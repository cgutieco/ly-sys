# @ly-sys/layout

React layout primitives system featuring class deduplication, responsive props, and a candidate protocol for
micro-frontends.

[![npm version](https://img.shields.io/npm/v/@ly-sys/layout?color=blue&style=flat-square)](https://www.npmjs.com/package/@ly-sys/layout)
[![package manager](https://img.shields.io/badge/package__manager-pnpm-ff69b4?style=flat-square)](https://pnpm.io/)
[![bundle size](https://img.shields.io/bundlephobia/min/@ly-sys/layout-engine?label=engine%20size&style=flat-square)](https://bundlephobia.com/package/@ly-sys/layout-engine)

The `@ly-sys/layout` package serves as the unified production entry point (facade) of the entire layout ecosystem. It
aggregates and re-exports the core layout engine, high-performance primitive React components, React context providers,
and the MFE candidate protocol under a single public interface.

---

## Key Features

- **Tree-shaking Out of the Box**: Re-exports sub-packages cleanly. Modern bundlers (Vite, Rsbuild, Webpack) will only
  bundle the components and code you actively use.
- **Sub-microsecond Resolution**: Features a high-performance class deduplication compiler and a 500-entry LRU cache,
  keeping runtime overhead near-zero.
- **Zero Styling Collisions**: Works entirely through native CSS Cascade Layers (`@layer layout`), allowing complete
  compatibility and deterministic styling alongside Tailwind CSS or custom style rules.
- **Decoupled MFE Protocol**: Enables Server-Side Rendering (SSR) safe candidate-based style extraction for federated
  micro-frontend architectures.
- **Polymorphism**: Native support for the `asChild` property (via `@ly-sys/react-slot`), allowing you to render any
  layout primitive as a semantic HTML tag or custom React component.

---

## Monorepo Architecture

This package aggregates the following modular sub-packages:

| Package                                                                                | Purpose                                                            | Bundle Size (Minified) |
|:---------------------------------------------------------------------------------------|:-------------------------------------------------------------------|:-----------------------|
| [`@ly-sys/layout-engine`](https://www.npmjs.com/package/@ly-sys/layout-engine)         | Parsers, prefixer, class resolver, and LRU cache.                  | ~3 KB                  |
| [`@ly-sys/layout-primitives`](https://www.npmjs.com/package/@ly-sys/layout-primitives) | React elements: `Flex`, `Grid`, `HStack`, `VStack`, etc.           | ~5 KB                  |
| [`@ly-sys/layout-react`](https://www.npmjs.com/package/@ly-sys/layout-react)           | `LayoutProvider`, `useLayout` context hook, and engine decorators. | ~3 KB                  |
| [`@ly-sys/layout-protocol`](https://www.npmjs.com/package/@ly-sys/layout-protocol)     | Versioned `CandidateCollector` and types for style federation.     | < 1 KB                 |
| [`@ly-sys/react-slot`](https://www.npmjs.com/package/@ly-sys/react-slot)               | Polymorphic `Slot` and `Slottable` utility components.             | ~1 KB                  |

---

## Installation

Install the facade package via your package manager of choice:

```bash
pnpm add @ly-sys/layout
# or
npm install @ly-sys/layout
# or
yarn add @ly-sys/layout
```

---

## Quick Start

### 1. Application Setup

Wrap your application in `LayoutProvider` to supply the layout engine:

```tsx
import React from "react";
import {createLayoutEngine, LayoutProvider, HStack, Flex} from "@ly-sys/layout";
import "@ly-sys/layout/styles.css";

// 1. Initialize the layout engine
const engine = createLayoutEngine({
    libPrefix: "ly", // Prefix for layout class names (e.g. ly-flex)
    breakpoints: ["base", "sm", "md", "lg", "xl"] as const
});

export function App() {
    return (
        <LayoutProvider engine={engine}>
            <HStack gap={4} p={4} justify="space-between" align="center">
                <h1>Dashboard</h1>
                <Flex gap={2}>
                    <button type="button" className="btn-secondary">Cancel</button>
                    <button type="button" className="btn-primary">Save Changes</button>
                </Flex>
            </HStack>
        </LayoutProvider>
    );
}
```

### 2. Import Styles in Global CSS

Declare the CSS Cascade Layers to guarantee correct rendering order and prevent resets:

```css
/* src/index.css */
@layer theme, base, global, layout, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);

/* Inject the default layout styles into the 'layout' layer */
@import "@ly-sys/layout/styles.css";

@import "tailwindcss/utilities.css" layer(utilities);
```

---

## Core Layout Primitives

The package exports 8 structural components. All of them support responsive props (e.g., `gap={{ base: 2, md: 4 }}`),
native HTML element properties, and polymorphic rendering via `asChild`.

### Flex

A standard CSS Flexbox container.

- **Props**:
    - `direction`: `ResponsiveValue<"row" | "column" | "row-reverse" | "column-reverse">`
    - `wrap`: `ResponsiveValue<"wrap" | "nowrap" | "wrap-reverse">`
    - `align`: `ResponsiveValue<"flex-start" | "flex-end" | "center" | "baseline" | "stretch">`
    - `justify`:
      `ResponsiveValue<"flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly">`
    - `grow`: `ResponsiveValue<number | string>`
    - `shrink`: `ResponsiveValue<number | string>`
    - `basis`: `ResponsiveValue<string | number>`

### HStack and VStack

Directional Flexbox wrappers representing Horizontal and Vertical stacks.

- **Props**: Inherit all `Flex` properties except `direction` (which is locked to `"row"` and `"column"` respectively).

### Grid

A CSS Grid container.

- **Props**:
    - `columns`: `ResponsiveValue<number>`
    - `minChildWidth`: `ResponsiveValue<string>` (creates an adaptive grid using CSS `minmax`)
    - `rowGap` / `columnGap`: `ResponsiveValue<number | string>`

> [!WARNING]
> By default, `columns` and `minChildWidth` are mutually exclusive. Attempting to supply both simultaneously will throw
> a development-mode warning/error unless `validationMode` is configured as `"Permissive"`.

### GridItem

A child component within a `Grid` container to define column and row span/alignment.

- **Props**:
    - `colSpan` / `rowSpan`: `ResponsiveValue<number | "full">`
    - `colStart` / `colEnd` / `rowStart` / `rowEnd`: `ResponsiveValue<number | string>`

### Container

A centered layout container with a maximum width boundary.

- **Props**:
    - `maxWidth`:
      `ResponsiveValue<"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" | "min" | "max" | "fit">`
    - `centerContent`: `ResponsiveValue<"auto" | "none">` (defaults to `"auto"` which applies `margin-inline: auto`)

### Center

A container that centers its children vertically and horizontally.

- **Props**:
    - `inline`: `ResponsiveValue<boolean>` (renders as `inline-flex` instead of `flex`)

### Spacer

A flexible spacer that expands to fill available space within a Flexbox container.

- **Props**: None (renders a `div` or target element with `flex: 1`).

---

## Micro-Frontend Candidate Protocol

In distributed frontends (such as Webpack Module Federation or Rspack), loading duplicate CSS bundles causes size
inflation. `@ly-sys/layout` resolves this by decoupling style generation.

Remotes (Micro-Frontends) do not ship with CSS. Instead, they register the styling "candidates" they need at runtime
into a shared `CandidateCollector`. The Host shell consolidates these candidates and fetches or injects only the
critical CSS required.

### Server-Side Rendering (SSR) Usage

```tsx
import {createLayoutEngine, LayoutProvider} from "@ly-sys/layout";
import {createCandidateCollector} from "@ly-sys/layout/protocol";
import ReactDOMServer from "react-dom/server";

// 1. Create a collector instance per request
const collector = createCandidateCollector();
const engine = createLayoutEngine({libPrefix: "ly"});

// 2. Render application
const html = ReactDOMServer.renderToString(
    <LayoutProvider engine={engine} collector={collector}>
        <App/>
    </LayoutProvider>
);

// 3. Flush the captured styling candidates
const batch = collector.flush();
console.log(batch.candidates);
// Output: [{ utility: "flex" }, { utility: "gap-4", breakpoint: "md" }]

// 4. Send HTML and the styling batch to the Host shell
```

---

## Reference Documentation

For deeper details on design tokens, integration architecture, and federation logs, refer to the guides in the source
repository:

- [Distributed Provider CSS Management (Medium)](https://medium.com/@pieroramirez810/distributed-provider-css-management-c5452b2b2166)

---

## License

MIT. See the root [LICENSE](../../LICENSE) file.
