# @ly-sys/layout-react

Official React bindings, context providers, and hooks for the layout system.

[![npm version](https://img.shields.io/npm/v/@ly-sys/layout-react?color=blue&style=flat-square)](https://www.npmjs.com/package/@ly-sys/layout-react)
[![package manager](https://img.shields.io/badge/package__manager-pnpm-ff69b4?style=flat-square)](https://pnpm.io/)

The `@ly-sys/layout-react` package provides the official React bindings for the layout system. It handles context
initialization (`LayoutProvider`), custom layout engine binding, and styling candidate extraction via automatic compiler
decoration.

---

## Key Features

- **Automated Style Interception**: Automatically listens to the rendering layout primitive calculations and logs used
  styling candidates to a central collector.
- **SSR Safe Architecture**: Request-scoped collector instantiation prevents memory leaks and CSS cross-contamination in
  concurrent server renderings.
- **Fail-Safe Fallbacks**: The context hook (`useLayout`) automatically falls back to a prefix-free mock layout engine
  in production environments if used outside a provider to avoid crashing layouts.
- **React 18 & 19 Support**: Full compatibility with the latest versions of React.

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                     LayoutProvider                     │
├────────────────────────────────────────────────────────┤
│  If CandidateMode.Collect & collector is present:      │
│                                                        │
│  Decorates Engine:                                     │
│  parseResponsive() ──►  engine.parseResponsive()       │
│                                │                       │
│                                ├──► Classes            │
│                                │                       │
│                                └──► Intercept & Strip  │
│                                     Prefixes           │
│                                        │               │
│                                        ▼               │
│                                     collector.add()    │
└────────────────────────────────────────────────────────┘
```

The React provider wraps the underlying `LayoutEngine`. If candidate collection is enabled (
`candidateMode === CandidateMode.Collect`) and a `collector` is provided, the provider automatically wraps the engine's
`parseResponsive` method. Whenever a layout primitive (e.g. `<Flex>`, `<Grid>`) is rendered, its computed styling
classes are captured, stripped of library prefixes, and stored in the collector.

---

## Installation

```bash
pnpm add @ly-sys/layout-react
# or
npm install @ly-sys/layout-react
# or
yarn add @ly-sys/layout-react
```

---

## Usage Guide & API Reference

### 1. Basic Layout Context Integration

Wrap your application tree in `<LayoutProvider>` and provide a layout engine:

```tsx
import React from "react";
import {createLayoutEngine} from "@ly-sys/layout-engine";
import {LayoutProvider} from "@ly-sys/layout-react";

// Initialize layout engine
const engine = createLayoutEngine({
    libPrefix: "ly",
    breakpoints: ["base", "sm", "md", "lg", "xl"] as const
});

export function App({children}: { children: React.ReactNode }) {
    return (
        <LayoutProvider engine={engine}>
            {children}
        </LayoutProvider>
    );
}
```

### 2. Custom Hooks (`useLayout`)

Consume the context inside custom components to manually parse responsive values:

```tsx
import React from "react";
import {useLayout} from "@ly-sys/layout-react";

export function CustomBox({children}: { children: React.ReactNode }) {
    const {engine} = useLayout();

    // Manually resolve responsive custom styling rules
    const classes = engine.parseResponsive(
        {base: 2, md: 4},
        "gap",
        (v) => `gap-${v}`
    );

    return (
        <div className={classes}>
            {children}
        </div>
    );
}
```

---

## Server-Side Rendering (SSR) & Isolation

When server rendering an application, concurrent requests must not share a singleton styling collector to avoid
cross-request contamination.

### Complete SSR Flow Example

```tsx
import React from "react";
import ReactDOMServer from "react-dom/server";
import {createLayoutEngine} from "@ly-sys/layout-engine";
import {createCandidateCollector} from "@ly-sys/layout-protocol";
import {LayoutProvider} from "@ly-sys/layout-react";
import {App} from "./App.js";

const engine = createLayoutEngine({
    libPrefix: "ly",
    candidateMode: "collect", // Enable candidate collection mode
    breakpoints: ["base", "sm", "md", "lg", "xl"] as const
});

export function handleRenderRequest(req: Request) {
    // 1. Create a unique collector instance per request
    const requestCollector = createCandidateCollector();

    // 2. Render layout tree to HTML
    const html = ReactDOMServer.renderToString(
        <LayoutProvider engine={engine} collector={requestCollector}>
            <App/>
        </LayoutProvider>
    );

    // 3. Flush candidate batch (resets collector internally for safety)
    const batch = requestCollector.flush();

    // 4. Return the HTML and extracted candidates batch (for host injection)
    return {html, batch};
}
```

---

## Advanced Guide: Manual Candidate Population

If you render React primitives (e.g. `<Flex>`, `<Grid>`), candidate collection is **100% automated** by the provider
decoration engine.

However, you should manually add candidates to the collector (e.g., using `collector.add("utility-class")`) in the
following scenarios where the automatic React collector does not have visibility:

1. **Native HTML Elements**: If you use standard tags like `<div className="ly-flex ly-gap-4">` instead of structural
   `<Flex gap={4}>` primitives.
2. **Dynamic / External HTML**: If you render HTML templates dynamically using `dangerouslySetInnerHTML` containing
   layout utilities.
3. **Cross-Framework Remotes**: If your Module Federation contains remote MFEs built with **Svelte**, **Angular**, or *
   *Vue** that rely on the Host's grid styling.

---

## License

MIT. See the root [LICENSE](../../LICENSE) file.
