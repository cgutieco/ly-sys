# @ly-sys/layout-protocol

Specification, data models, and service interfaces for the layout candidate communication protocol.

[![npm version](https://img.shields.io/npm/v/@ly-sys/layout-protocol?color=blue&style=flat-square)](https://www.npmjs.com/package/@ly-sys/layout-protocol)
[![package manager](https://img.shields.io/badge/package__manager-pnpm-ff69b4?style=flat-square)](https://pnpm.io/)

The `@ly-sys/layout-protocol` package defines the formal specifications, types, and services utilized by the layout
system to orchestrate dynamic style injection. It is engineered specifically for decoupled architectures, such as *
*Micro-Frontends (MFE)** and **Server-Side Rendering (SSR)**.

---

## Key Features

- **Decoupled Architecture**: Remotes register style "candidates" they need at runtime without bundling static CSS
  sheets.
- **Prefix Decoupling**: Candidates are collected prefix-free (e.g. `"gap-4"`). Hosts prepend their configured prefix at
  runtime, enabling MFEs to run on hosts with different prefixes without rebuilds.
- **Constant Memory Footprint**: Collector deduplicates candidates on-the-fly, keeping memory overhead $O(1)$.
- **Module Federation Service**: Features `LayoutService` for DI (Dependency Injection) containers, coordinating
  critical and deferred style injection between remotes and hosts.

---

## Architecture

The protocol is designed around a state collector that intercepts layout components during render cycles and flushes
them as a structured batch payload.

### SSR / Rendering Collection Flow

```mermaid
sequenceDiagram
    participant MFE as Micro-Frontend (Remote)
    participant Provider as LayoutProvider (Decorator)
    participant Engine as LayoutEngine Core
    participant Collector as CandidateCollector

    Note over MFE,Collector: 1. Instantiation per Request
    MFE->>Collector: createCandidateCollector()
    MFE->>Provider: <LayoutProvider engine={engine} collector={collector}>
    
    Note over Provider,Engine: 2. Transparent Engine Decoration
    Provider->>Engine: Intercepts parseResponsive()

    Note over MFE,Provider: 3. Render and Registration
    MFE->>Provider: <Flex gap={{ base: 2, md: 4 }}>
    Provider->>Engine: engine.parseResponsive()
    Engine-->>Provider: Returns "ly-gap-2 md:ly-gap-4"
    Provider->>Collector: collector.add("gap-2", undefined)
    Provider->>Collector: collector.add("gap-4", "md")
    
    Note over MFE,Collector: 4. Extraction (Flush)
    MFE->>Collector: collector.flush()
    Collector-->>MFE: Returns CandidateBatch and resets internal state
```

---

## Installation

```bash
pnpm add @ly-sys/layout-protocol
# or
npm install @ly-sys/layout-protocol
# or
yarn add @ly-sys/layout-protocol
```

---

## Usage Guide & API Reference

### 1. Candidate Collector API

Use `createCandidateCollector` to track style classes and raw styles:

```typescript
import {createCandidateCollector} from "@ly-sys/layout-protocol";

// 1. Create a collector
const collector = createCandidateCollector();

// 2. Add candidates (utilities must be prefix-free)
collector.add("flex-row");
collector.add("gap-4", "md");

// 3. Add custom raw inline CSS (e.g. from minChildWidth grid rules)
collector.addRawCSS({
    critical: ".custom-grid { display: grid; }",
    deferable: ".custom-grid:hover { opacity: 0.9; }"
});

// 4. Flush the batch (returns the batch data and resets the collector state)
const batch = collector.flush();
console.log(batch);
/*
Output:
{
  candidates: [
    { utility: "flex-row", breakpoint: undefined },
    { utility: "gap-4", breakpoint: "md" }
  ],
  rawCSS: {
    critical: ".custom-grid { display: grid; }",
    deferable: ".custom-grid:hover { opacity: 0.9; }"
  }
}
*/
```

---

### 2. LayoutService (Module Federation & MFE Orchestration)

In distributed frontends, remotes shouldn't duplicate style compilation. Instead, they share a singleton `LayoutService`
registered in a DI (Dependency Injection) container.

#### Host Configuration (DI container initialization)

```typescript
import {createLayoutService} from "@ly-sys/layout-protocol";
import {createLayoutEngine} from "@ly-sys/layout-engine";

const hostEngine = createLayoutEngine({libPrefix: "ly"});

// Bind to DI container as a singleton
const layoutService = createLayoutService({
    engine: hostEngine,
    // Custom critical style injector (defaults to DOM insertion)
    criticalInjector: (css, remoteName) => {
        console.log(`Injecting critical CSS for ${remoteName}`);
    },
    // Custom deferred style injector (defaults to requestIdleCallback styling)
    deferredInjector: (css, remoteName) => {
        console.log(`Injecting deferred CSS for ${remoteName}`);
    }
});
```

#### Remote MFE Registration

A Remote MFE accesses the shared `LayoutService` from the host and registers its rendering candidates:

```typescript
// On the remote, when mounting components
import type {LayoutService, CandidateBatch} from "@ly-sys/layout-protocol";

export function mountRemoteComponent(container: HTMLElement, layoutService: LayoutService) {
    // 1. Obtain MFE component's batch output (e.g. from SSR or static rendering)
    const batch: CandidateBatch = {
        candidates: [{utility: "grid-cols-4"}],
        rawCSS: {critical: ".mfe-grid { background: red; }"}
    };

    // 2. Register candidates and critical styles with the Host layout service
    layoutService.registerCandidates(batch, "remote-mfe-auth");

    // 3. Request deferred styles in a non-blocking callback (e.g., in requestIdleCallback)
    layoutService.requestDeferredCSS("remote-mfe-auth");
}
```

---

## Data Model Specifications

### `Candidate`

Represents an individual layout utility.

```typescript
type Candidate = {
    utility: string;              // e.g. "flex-row", "gap-4" (always prefix-free)
    breakpoint?: string;          // e.g. "md", "lg", or undefined for the baseline
};
```

### `CandidateBatch`

The payload containing styling components.

```typescript
type CandidateBatch = {
    candidates: Candidate[];
    rawCSS?: {
        critical?: string;          // Injected synchronously (render-blocking)
        deferable?: string;         // Injected asynchronously (non-blocking)
    };
};
```

### `LayoutService`

The interface exposed via Module Federation context:

```typescript
type LayoutService = {
    readonly engine: LayoutEngineRef;
    registerCandidates(batch: CandidateBatch, remoteName: string): void;
    requestDeferredCSS(remoteName: string): void;
};
```

---

## License

MIT. See the root [LICENSE](../../LICENSE) file.
