# @ly-sys/layout

[![npm version](https://img.shields.io/npm/v/@ly-sys/layout?color=blue&style=flat-square)](https://www.npmjs.com/package/@ly-sys/layout)
[![build status](https://img.shields.io/github/actions/workflow/status/cgutieco/ly-sys/ci.yml?branch=main&style=flat-square)](https://github.com/cgutieco/ly-sys/actions)
[![license](https://img.shields.io/github/license/cgutieco/ly-sys?color=green&style=flat-square)](file:///Users/cgutieco/personal/ly-sys/LICENSE)
[![package manager](https://img.shields.io/badge/package__manager-pnpm-ff69b4?style=flat-square)](https://pnpm.io/)
[![build system](https://img.shields.io/badge/build__system-turborepo-orange?style=flat-square)](https://turbo.build/)

React layout primitives system featuring class deduplication, responsive props, and a candidate protocol for
micro-frontends.

## Contents

- [Quick Start](#quick-start)
- [Packages](#packages)
- [Primitives](#primitives)
- [Engine](#engine)
- [CSS Integration](#css-integration)
- [Candidate Protocol](#candidate-protocol)
- [API and Types](#api-and-types)
- [Infrastructure](#infrastructure)
- [Reference Documentation](#reference-documentation)

---

## Quick Start

### Installation

```bash
pnpm add @ly-sys/layout
```

### Basic Usage

```tsx
import {createLayoutEngine, LayoutProvider, Flex} from "@ly-sys/layout";

const engine = createLayoutEngine({
    libPrefix: "ly",
    appPrefix: "app",
    breakpoints: ["base", "sm", "md", "lg"] as const,
});

export function App() {
    return (
        <LayoutProvider engine={engine}>
            <Flex direction={{base: "column", md: "row"}} gap={4}>
                <aside>Sidebar</aside>
                <main>Main Content</main>
            </Flex>
        </LayoutProvider>
    );
}
```

### Importing Precompiled Styles

```css
@layer global, layout, components, utils;
@import "@ly-sys/layout/styles";
```

---

## Packages

```
packages/
  layout/                  -> Public facade (re-exports) 
  layout-css/              -> Styles, PostCSS plugin and generator
  layout-engine/           -> Core: parser, prefixer, resolve, LRU cache
  layout-react/            -> LayoutProvider, useLayout, context
  layout-primitives/       -> Flex, Grid, Container, HStack, VStack, etc.
  layout-protocol/         -> CandidateCollector and protocol types
  react-slot/              -> Polymorphic Slot and Slottable utility components
```

| Package                     | Description                            | Runtime Deps                                            | Size Limit |
|:----------------------------|:---------------------------------------|:--------------------------------------------------------|:-----------|
| `@ly-sys/layout`            | Facade — re-exports everything         | All internal packages                                   | —          |
| `@ly-sys/layout-engine`     | Class engine, deduplication, LRU cache | `@ly-sys/layout-protocol`                               | 3 KB       |
| `@ly-sys/layout-react`      | Provider and hooks for React           | `layout-engine`, `layout-protocol`                      | 3 KB       |
| `@ly-sys/layout-primitives` | Layout components                      | `layout-engine`, `layout-react`, `@ly-sys/react-slot`   | 5 KB       |
| `@ly-sys/layout-protocol`   | Candidate protocol                     | None                                                    | —          |
| `@ly-sys/react-slot`        | Polymorphic Slot and Slottable         | None                                                    | 1 KB       |

Subpath exports available: `@ly-sys/layout/engine`, `@ly-sys/layout/react`, `@ly-sys/layout/primitives`,
`@ly-sys/layout/protocol`, `@ly-sys/layout/slot`, `@ly-sys/layout/styles`.

---

## Primitives

Included components (8): `Flex`, `Grid`, `GridItem`, `Container`, `HStack`, `VStack`, `Center`, `Spacer`.

All primitives share:

- `gap` (responsive values)
- `asChild` for polymorphic rendering via `@ly-sys/react-slot`
- Native HTML props of the rendered element

Summary of specific props:

- `Flex`: `direction`, `wrap`, `align`, `justify`, `basis`, `grow`, `shrink`
- `HStack` / `VStack`: same as `Flex` except `direction`
- `Grid`: `columns`, `minChildWidth`, `rowGap`, `columnGap`
- `GridItem`: `colSpan`, `rowSpan`, `colStart`, `colEnd`, `rowStart`, `rowEnd`
- `Container`: `maxWidth`, `centerContent`
- `Center`: `inline`
- `Spacer`: no custom props, outputs `flex-1`

> [!IMPORTANT]
> `Grid` only allows `columns` and `minChildWidth` simultaneously when `validationMode` is `Permissive`. In other modes,
> it throws a runtime validation error.
> The `base` breakpoint does not generate a prefix (if included in `breakpoints`).

---

## Engine

The engine exposes three main operations:

- `parseResponsive`: converts responsive values into prefixed CSS classes.
- `resolve`: deduplicates classes with priority `app > neutral > lib`.
- `prefix`: applies `libPrefix` to utilities.

Relevant details:

- Deduplication runs in $O(n)$ with a static collision map and a 500-entry LRU cache.
- Invalid values are skipped; in dev mode they are logged to the console.
- `libPrefix` defaults to `"ly-sys"`. `appPrefix` defaults to `""`.

Validation and errors:

- `validationMode: Permissive` disables validation via `propRules`.
- `useLayout` called outside of `LayoutProvider` throws an error in development; in production it calls `console.error`
  and returns an empty engine.

---

## CSS Integration

Utilities and tokens are generated inside `@layer global` and `@layer layout`. Available tokens include:

- `--ly-sys-gap-*`, `--ly-sys-padding-*`, `--ly-sys-margin-*` (values 1 to 12)
- `--ly-sys-max-w-*` (`xs` to `7xl`, `full`, `min`, `max`, `fit`)

For custom prefixes or breakpoints, use the PostCSS plugin:

- Import `layoutPostcssPlugin` from `@ly-sys/layout/postcss`.
- Add `@ly-sys-layout;` directive in your CSS.

---

## Candidate Protocol

In `candidateMode: Collect`, `LayoutProvider` decorates the engine to register used utilities and optionally arbitrary
CSS (e.g. `minChildWidth`) using `CandidateCollector`. The host can consolidate candidates and request critical/deferred
CSS from a centralized service.

The protocol contract resides in `@ly-sys/layout-protocol` and exposes `CANDIDATE_PROTOCOL_VERSION`.

---

## API and Types

The complete reference is available in the TypeScript types distributed by each package. Key points:

- `createLayoutEngine` accepts `EngineConfig` with `breakpoints`, `libPrefix`, `appPrefix`, `propRules`, and
  validation/candidate modes.
- `LayoutProvider` receives `engine` and optionally `collector`.
- `useLayout` returns `{ engine, collector }`.

---

## Infrastructure

Main tools: pnpm, Turborepo, tsup, TypeScript, Vitest, Testing Library, Biome, size-limit.

Available scripts:

```bash
pnpm build
pnpm typecheck
pnpm test
pnpm lint
pnpm lint:fix
pnpm format
pnpm size-limit
```

---

## Reference Documentation

- [Distributed Provider CSS Management (Medium)](https://medium.com/@pieroramirez810/distributed-provider-css-management-c5452b2b2166)

---

## License

MIT. See the [LICENSE](./LICENSE) file.
