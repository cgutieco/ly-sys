# @ly-sys/layout-engine

Core computation, responsive property parser, and utility class conflict resolution engine.

[![npm version](https://img.shields.io/npm/v/@ly-sys/layout-engine?color=blue&style=flat-square)](https://www.npmjs.com/package/@ly-sys/layout-engine)
[![package manager](https://img.shields.io/badge/package__manager-pnpm-ff69b4?style=flat-square)](https://pnpm.io/)

The `@ly-sys/layout-engine` package is the core computational core of the design system. It interprets responsive layout
values (such as `gap={{ base: 2, md: 4 }}`), translates high-level layout properties into atomic utility classes,
resolves class name conflicts (prioritizing custom overrides over defaults), and applies prefixing rules cleanly and
efficiently at runtime.

---

## Key Features

- **Low-Overhead Parsers**: Converts complex declarations into formatted utility class strings inside highly optimized
  hot paths.
- **Deduplication Engine**: Uses a right-most wins resolution algorithm for CSS class conflicts, adhering to a defined
  priority hierarchy (App-specific overrides > global/neutral classes > library defaults).
- **Sub-Microsecond Resolution**: Integrates a Least Recently Used (LRU) Cache to completely bypass calculations on
  subsequent component rendering cycles.
- **Prefix and Breakpoint Decorator**: Seamlessly processes responsive breakpoint prefixes (e.g., `md:ly-gap-4`) and
  prefixes according to configuration rules.
- **Zero Style Collisions**: Coordinates styling boundaries without external runtimes, producing highly clean utility
  strings compatible with CSS Cascade Layers.

---

## Architecture

The engine is comprised of three core modules:

```
┌────────────────────────────────────────────────────────┐
│                      LayoutEngine                      │
├────────────────────────────────────────────────────────┤
│  1. parseResponsive() ──►  [LRU Cache Lookup]          │
│                              │                         │
│                              ├─► Cache Hit  ──► Output │
│                              └─► Cache Miss ──► Parse  │
│                                                        │
│  2. resolve()         ──► Rightmost-wins & Priority     │
│                           App > Neutral > Lib          │
│                                                        │
│  3. prefix()          ──► Prepends prefixes to classes │
└────────────────────────────────────────────────────────┘
```

### 1. Responsive Property Parser

Translates atomic layout components' properties into valid responsive and prefixed utility class strings using the
current breakpoint configurations.

### 2. Collision Resolver (`resolve`)

Resolves layout utility conflicts at runtime. It analyzes class classes, groups them by property family (e.g.,
`flex-direction`, `gap`, `padding`), and retains only the winning classes according to priority:

- **`App`** (`appPrefix`, Priority 3): Local application-specific utility classes.
- **`Neutral`** (No prefix, Priority 2): Standard utility classes (e.g. Tailwind or default CSS).
- **`Lib`** (`libPrefix`, Priority 1): Library-specific default layout classes.

Within the same priority tier, the **rightmost class** (last declared) wins.

---

## Installation

```bash
pnpm add @ly-sys/layout-engine
# or
npm install @ly-sys/layout-engine
# or
yarn add @ly-sys/layout-engine
```

---

## Usage Guide

### 1. Instantiating the Engine

Create an engine instance with a customized library prefix and screen breakpoints:

```typescript
import {createLayoutEngine} from "@ly-sys/layout-engine";

const engine = createLayoutEngine({
    libPrefix: "ly",       // Prefix for layout class names (e.g. ly-flex)
    appPrefix: "app",      // Prefix for application-specific custom overrides
    breakpoints: ["base", "sm", "md", "lg", "xl"] as const
});
```

### 2. Parsing Responsive Values

Use `parseResponsive` to convert responsive objects or singular values into utility strings:

```typescript
const directionClasses = engine.parseResponsive(
    {base: "column", md: "row"}, // Responsive configuration
    "direction",                  // Layout property name
    (v) => `flex-${v}`            // Utility class mapper function
);

console.log(directionClasses);
// Output: "ly-flex-col md:ly-flex-row"
```

### 3. Resolving Conflicts with `resolve`

Ensure utility overrides behaves predictably when merging user-supplied classes and default generated classes:

```typescript
// Conflict 1: Overriding same property (e.g. flex-row vs flex-col)
const resolved = engine.resolve(
    "ly-flex ly-flex-row ly-gap-4", // Generated layout classes
    "ly-flex-col"                   // User custom classes
);
console.log(resolved);
// Output: "ly-flex ly-gap-4 ly-flex-col"
// (ly-flex-col overridden ly-flex-row due to rightmost-wins)

// Conflict 2: Prioritizing application overrides
const resolvedPriorities = engine.resolve(
    "ly-gap-4",   // Lib level (Priority 1)
    "app-gap-8"   // App level (Priority 3)
);
console.log(resolvedPriorities);
// Output: "app-gap-8"
// (app-gap-8 takes priority over ly-gap-4 regardless of ordering)
```

---

## Additional Details

### Caching Performance (LRU Cache)

Parsing responsive property configurations involves loops, object serialization, and array joining. To keep runtime
overhead near zero, the layout engine integrates a Least Recently Used (LRU) Cache (defaults to 500 entries).

You can also instantiate the cache standalone if needed:

```typescript
import {createLRUCache} from "@ly-sys/layout-engine";

// Create cache with capacity of 100 items
const cache = createLRUCache<string>(100);

cache.set("flexDirection|base:row;md:column", "ly-flex-row md:ly-flex-col");
console.log(cache.get("flexDirection|base:row;md:column"));
// Output: "ly-flex-row md:ly-flex-col"
```

---

## License

MIT. See the root [LICENSE](../../LICENSE) file.
