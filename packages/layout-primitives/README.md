# @ly-sys/layout-primitives

High-performance atomic React layout components with zero styling collisions, responsive props, and polymorphic
rendering.

[![npm version](https://img.shields.io/npm/v/@ly-sys/layout-primitives?color=blue&style=flat-square)](https://www.npmjs.com/package/@ly-sys/layout-primitives)
[![package manager](https://img.shields.io/badge/package__manager-pnpm-ff69b4?style=flat-square)](https://pnpm.io/)

The `@ly-sys/layout-primitives` package provides a complete set of high-performance React components designed
specifically to resolve structure, spacing, grids, and alignment in modern user interfaces.

---

## Key Features

- **Responsive Props**: Pass responsive objects (e.g. `gap={{ base: 2, md: 4 }}`) directly to components.
- **Polymorphism via Radix Slot**: Retain full layout capabilities while rendering semantic HTML elements or custom
  components using `asChild`.
- **Runtime Conflict Check**: Built-in development mode validation rules (such as ensuring columns and min-child widths
  in Grid containers are mutually exclusive).
- **CSS Cascade Layer Ready**: Integrates seamlessly with `@layer layout` utility styles to keep specificity near zero
  and guarantee easy overrides.

---

## Installation

```bash
pnpm add @ly-sys/layout-primitives
# or
npm install @ly-sys/layout-primitives
# or
yarn add @ly-sys/layout-primitives
```

> [!NOTE]
> This package requires `react` and `react-dom` (v18 or v19) as peer dependencies, and connects to the
`@ly-sys/layout-react` context to consume the layout engine.

---

## Usage Guide & API Reference

### 1. Flex

A standard CSS Flexbox container.

- **Properties**:
    - `direction`: `ResponsiveValue<"row" | "column" | "row-reverse" | "column-reverse", B>`
    - `wrap`: `ResponsiveValue<"nowrap" | "wrap" | "wrap-reverse", B>`
    - `align`: `ResponsiveValue<"start" | "center" | "end" | "stretch" | "baseline", B>`
    - `justify`: `ResponsiveValue<"start" | "center" | "end" | "between" | "around" | "evenly", B>`
    - `basis`: `ResponsiveValue<number | string, B>`
    - `grow`: `ResponsiveValue<number | string, B>`
    - `shrink`: `ResponsiveValue<number | string, B>`
    - `gap`: `ResponsiveValue<number | string, B>`
    - `asChild`: `boolean`

```tsx
import {Flex} from "@ly-sys/layout-primitives";

export function Navigation() {
    return (
        <Flex direction={{base: "column", md: "row"}} justify="between" align="center" gap={4}>
            <div>Logo</div>
            <Flex gap={2}>
                <a href="/home">Home</a>
                <a href="/about">About</a>
            </Flex>
        </Flex>
    );
}
```

### 2. HStack and VStack

Directional wrappers for horizontal and vertical stacks respectively.

- **Properties**: Inherits all `Flex` properties, except `direction` which is statically locked (to `"row"` for `HStack`
  and `"column"` for `VStack`).

```tsx
import {HStack, VStack, Spacer} from "@ly-sys/layout-primitives";

export function Card() {
    return (
        <VStack gap={4} p={4} style={{border: "1px solid #ccc"}}>
            <HStack align="center" gap={2}>
                <h3>Card Title</h3>
                <Spacer/>
                <span>v1.0</span>
            </HStack>
            <p>This is the card body content stacked vertically.</p>
        </VStack>
    );
}
```

### 3. Grid

A CSS Grid container.

- **Properties**:
    - `columns`: `ResponsiveValue<number | string, B>`
    - `minChildWidth`: `ResponsiveValue<number | string, B>`
    - `rowGap` / `columnGap` / `gap`: `ResponsiveValue<number | string, B>`
    - `asChild`: `boolean`

> [!WARNING]
> `columns` and `minChildWidth` are **mutually exclusive**. Attempting to provide both simultaneously will throw a
> development error (unless `validationMode` is configured as `"permissive"`).
>
> When using `minChildWidth`, the component registers dynamic `rawCSS` (critical styles) containing media queries (e.g.
`@media (min-width: 640px) { ... }`) to build the auto-fit grid safely.

```tsx
import {Grid, GridItem} from "@ly-sys/layout-primitives";

export function Gallery() {
    return (
        // Responsive grid specifying column template count
        <Grid columns={{base: 1, sm: 2, md: 4}} gap={4}>
            <GridItem colSpan={{base: 1, sm: 2}}>Main Item (takes 2 cols on SM)</GridItem>
            <GridItem>Item 2</GridItem>
            <GridItem>Item 3</GridItem>
        </Grid>
    );
}
```

### 4. GridItem

A child component within a `Grid` container to control span, start, and end rules.

- **Properties**:
    - `colSpan` / `rowSpan`: `ResponsiveValue<number | string, B>` (supports numeric spans and `"full"`)
    - `colStart` / `colEnd` / `rowStart` / `rowEnd`: `ResponsiveValue<number | string, B>`
    - `gap`: `ResponsiveValue<number | string, B>`
    - `asChild`: `boolean`

### 5. Container

A centered layout wrapper with a constrained maximum width.

- **Properties**:
    - `maxWidth`: `ResponsiveValue<number | string, B>` (supports values like `"xs"`, `"md"`, `"3xl"`, `"7xl"`,
      `"full"`, `"min"`, `"max"`, `"fit"`, or arbitrary numbers)
    - `centerContent`: `ResponsiveValue<"auto" | "none", B>` (defaults to `"auto"` which applies `margin-inline: auto` /
      `mx-auto`)
    - `gap`: `ResponsiveValue<number | string, B>`
    - `asChild`: `boolean`

```tsx
import {Container} from "@ly-sys/layout-primitives";

export function PageLayout() {
    return (
        <Container maxWidth="7xl" p={4}>
            <h1>Layout Content Centered</h1>
        </Container>
    );
}
```

### 6. Center

A container that centers its children vertically and horizontally using flexbox alignment.

- **Properties**:
    - `inline`: `ResponsiveValue<"flex" | "inline-flex", B>` (defaults to `"flex"`)
    - `gap`: `ResponsiveValue<number | string, B>`
    - `asChild`: `boolean`

```tsx
import {Center} from "@ly-sys/layout-primitives";

export function CenteredLoader() {
    return (
        <Center style={{height: "100vh"}}>
            <div>Loading...</div>
        </Center>
    );
}
```

### 7. Spacer

A flexible component that grows to fill available space within a Flexbox container (`flex-direction: row` or `column`).

- **Properties**:
    - `asChild`: `boolean`

---

## Polymorphic Rendering via `asChild`

All layout primitives support the `asChild` property (via `@radix-ui/react-slot`). When `asChild` is `true`, the layout
component does not render its default DOM element (`div`). Instead, it delegates all layout class names, refs, and
properties to its immediate child element.

This is highly useful for semantic SEO layout structuring:

```tsx
import {Center, HStack} from "@ly-sys/layout-primitives";

export function Footer() {
    return (
        // Renders as a semantic <footer> instead of a <div>
        <HStack asChild justify="between" p={4}>
            <footer>
                <p>© 2026 Company</p>
                <a href="/privacy">Privacy Policy</a>
            </footer>
        </HStack>
    );
}
```

---

## License

MIT. See the root [LICENSE](../../LICENSE) file.
