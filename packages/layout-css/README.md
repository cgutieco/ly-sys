# @ly-sys/layout-css

CSS utility compiler, design tokens generator, and PostCSS plugin for the layout system.

[![npm version](https://img.shields.io/npm/v/@ly-sys/layout-css?color=blue&style=flat-square)](https://www.npmjs.com/package/@ly-sys/layout-css)
[![package manager](https://img.shields.io/badge/package__manager-pnpm-ff69b4?style=flat-square)](https://pnpm.io/)

The `@ly-sys/layout-css` package is the stylesheet compiler and static build tool of the ecosystem. It provides the
design utility generation logic, the official PostCSS plugin, and a command-line interface (CLI) that allows compiling
custom stylesheets with bespoke prefixes and breakpoints, without runtime overhead.

---

## Key Features

- **Static CSS Generation**: Generates standard CSS classes for layout structures (flexbox, grid, spacing, sizing,
  margins, paddings, etc.) to completely eliminate runtime CSS-in-JS overhead.
- **CSS Cascade Layers Support**: Emits styles using `@layer global` (for design tokens) and `@layer layout` (for core
  rules and media queries) to prevent collisions with other libraries (like Tailwind CSS) or global resets.
- **Flexible PostCSS Plugin**: Seamlessly integrates into modern bundlers (Vite, Rsbuild, Webpack) to compile styles
  automatically based on configuration.
- **Standalone CLI compiler**: Compile stylesheets statically anywhere without a build configuration.
- **Design Tokens Customization**: Generates design tokens (spacing, margins, paddings, gap, and container max-widths)
  leveraging native CSS Custom Properties.

---

## Architecture

The compiler generates clean, layer-based stylesheets designed to run at the absolute lowest CSS specificity.

### CSS Layer Order and Precedence

To prevent utility styles from overriding localized custom CSS rules or getting overridden by browser resets, the
stylesheet structures the emitted styles under explicit `@layer` declarations:

- **`theme`**: Initial variable and token declarations.
- **`base`**: Global browser resets (like CSS reset / preflight).
- **`global`**: Design tokens and custom properties (lower priority for easy customization).
- **`layout`**: Core layout classes and responsive utility rules (like flex direction, grid templates, aspect ratios,
  etc.).
- **`components`**: Application-specific custom styles and classes.
- **`utilities`**: Atomic utility classes (e.g. Tailwind's overrides).

---

## Installation

Install the package via your preferred package manager:

```bash
pnpm add @ly-sys/layout-css
# or
npm install @ly-sys/layout-css
# or
yarn add @ly-sys/layout-css
```

---

## Usage Guide

### 1. Integration via PostCSS Plugin

In modern bundler setups (such as Vite, Rsbuild, or Next.js), you can automate CSS generation using the PostCSS plugin.

Add the plugin to your `postcss.config.js` or `postcss.config.mjs` configuration:

```javascript
// postcss.config.js
import {layoutPostcssPlugin} from "@ly-sys/layout-css";

export default {
    plugins: [
        layoutPostcssPlugin({
            prefix: "ly", // Custom prefix (default is "ly-sys")
            breakpoints: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px"
            }
        })
    ]
};
```

Then, import or insert the directive in your global CSS stylesheet:

```css
/* src/index.css */
@layer theme, base, global, layout, components, utilities;

/* Inject generated stylesheet here */
@ly-sys-layout;
```

### 2. Standalone Compilation via CLI

If you prefer static, zero-configuration CSS files, you can generate them using the CLI:

```bash
# Basic usage
npx ly-layout-css --prefix ly --out src/styles/layout.css

# Output prefix-free classes
npx ly-layout-css --prefix "" --out src/styles/layout-clean.css
```

#### CLI Options

| Option     | Description                                                                           | Default        |
|:-----------|:--------------------------------------------------------------------------------------|:---------------|
| `--prefix` | Prefix prepended to all generated utility classes (e.g. `--prefix ly` -> `.ly-flex`). | `"ly-sys"`     |
| `--out`    | Output destination file path.                                                         | `"layout.css"` |

---

## Spacing and Sizing Token Scales

The generated stylesheet defines spacing tokens under `@layer global` as native CSS Custom Properties, making them
easily overrideable or references in your custom stylesheets.

### Spacing Scale (Margins, Paddings, Gaps)

Tokens are scaled from **1 to 12** on a 4px increment scale:

| Scale  | CSS Token                                                        | Base Value | Equivalent (rem) |
|:------:|:-----------------------------------------------------------------|:----------:|:----------------:|
| **1**  | `--ly-sys-gap-1` / `--ly-sys-padding-1` / `--ly-sys-margin-1`    |   `4px`    |    `0.25rem`     |
| **2**  | `--ly-sys-gap-2` / `--ly-sys-padding-2` / `--ly-sys-margin-2`    |   `8px`    |     `0.5rem`     |
| **3**  | `--ly-sys-gap-3` / `--ly-sys-padding-3` / `--ly-sys-margin-3`    |   `12px`   |    `0.75rem`     |
| **4**  | `--ly-sys-gap-4` / `--ly-sys-padding-4` / `--ly-sys-margin-4`    |   `16px`   |      `1rem`      |
| **5**  | `--ly-sys-gap-5` / `--ly-sys-padding-5` / `--ly-sys-margin-5`    |   `20px`   |    `1.25rem`     |
| **6**  | `--ly-sys-gap-6` / `--ly-sys-padding-6` / `--ly-sys-margin-6`    |   `24px`   |     `1.5rem`     |
| **7**  | `--ly-sys-gap-7` / `--ly-sys-padding-7` / `--ly-sys-margin-7`    |   `28px`   |    `1.75rem`     |
| **8**  | `--ly-sys-gap-8` / `--ly-sys-padding-8` / `--ly-sys-margin-8`    |   `32px`   |      `2rem`      |
| **9**  | `--ly-sys-gap-9` / `--ly-sys-padding-9` / `--ly-sys-margin-9`    |   `36px`   |    `2.25rem`     |
| **10** | `--ly-sys-gap-10` / `--ly-sys-padding-10` / `--ly-sys-margin-10` |   `40px`   |     `2.5rem`     |
| **11** | `--ly-sys-gap-11` / `--ly-sys-padding-11` / `--ly-sys-margin-11` |   `44px`   |    `2.75rem`     |
| **12** | `--ly-sys-gap-12` / `--ly-sys-padding-12` / `--ly-sys-margin-12` |   `48px`   |      `3rem`      |

### Max Widths (Container Primitives)

Used by `<Container>` layout primitives to constrain layouts:

- **Screen Sizes**: `--ly-sys-max-w-xs` (`320px`) up to `--ly-sys-max-w-7xl` (`1280px`).
- **Layout Boundaries**: `--ly-sys-max-w-full` (`100%`), `--ly-sys-max-w-min` (`min-content`), `--ly-sys-max-w-max` (
  `max-content`), and `--ly-sys-max-w-fit` (`fit-content`).

---

## License

MIT. See the root [LICENSE](../../LICENSE) file.
