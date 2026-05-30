# @ly-sys/react-slot

Polymorphic rendering utilities for React (Slot and Slottable).

[![npm version](https://img.shields.io/npm/v/@ly-sys/react-slot?color=blue&style=flat-square)](https://www.npmjs.com/package/@ly-sys/react-slot)
[![package manager](https://img.shields.io/badge/package__manager-pnpm-ff69b4?style=flat-square)](https://pnpm.io/)

The `@ly-sys/react-slot` package provides clean, robust, and lightweight utilities to implement the **polymorphic
composition pattern** (`asChild`) in React.

---
 
## Key Features

- **Polymorphic Composition**: Seamlessly delegates rendering responsibilities to the immediate child component, merging
  attributes and styles.
- **Smart Prop Merging**: Combines `className` lists, merges inline `style` objects, and merges other properties giving
  precedence to the child element.
- **Ordered Event Chaining**: Auto-composes matching event handlers (e.g., `onClick`) ensuring that the **child's
  handler is executed first**, followed by the Slot's handler.
- **Ref Composition (`composeRefs`)**: Merges multiple refs (both callback refs and React 18/19 mutable `RefObject`
  instances) to attach them to the same DOM node without memory leaks.
- **Zero DOM Footprint**: Removes itself entirely from the DOM tree, avoiding unnecessary wrapping `<div>` elements.

---

## Installation

Install the package via your package manager:

```bash
pnpm add @ly-sys/react-slot
# or
npm install @ly-sys/react-slot
# or
yarn add @ly-sys/react-slot
```

---

## Usage Guide & API Reference

### 1. Implementing `asChild` in a Component

Use the `Slot` component to conditionally delegate rendering if the `asChild` flag is enabled:

```tsx
import React, {forwardRef} from "react";
import {Slot} from "@ly-sys/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({asChild, className, children, ...props}, ref) => {
        // If asChild is true, Slot will merge classes/props onto the first child element
        const Component = asChild ? Slot : "button";

        return (
            <Component
                ref={ref}
                className={`btn-base ${className || ""}`}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Button.displayName = "Button";
```

#### Consumption:

```tsx
// Renders as a standard <button>
<Button onClick={() => console.log("Standard button clicked")}>
    Save Changes
</Button>

// Renders as an <a> tag instead, but inherits button styles and combines event handlers!
<Button asChild onClick={() => console.log("Slot handler running")}>
    <a href="/dashboard" onClick={() => console.log("Link handler running")}>
        Go to Dashboard
    </a>
</Button>
```

### 2. Multi-child Composition with `Slottable`

When a component accepts complex children (such as icons or helper tags) but we only want to delegate the rendering
target onto a specific child node, wrap the main interactive content in `<Slottable>`:

```tsx
import React, {forwardRef} from "react";
import {Slot, Slottable} from "@ly-sys/react-slot";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean;
    headerIcon?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({asChild, headerIcon, children, ...props}, ref) => {
        const Component = asChild ? Slot : "div";

        return (
            <Component ref={ref} className="card-container" {...props}>
                {headerIcon && <span className="card-icon">{headerIcon}</span>}
                <Slottable>{children}</Slottable>
            </Component>
        );
    }
);
```

#### Consumption:

```tsx
<Card asChild headerIcon={<Icon/>}>
    <section className="custom-section">
        <h2>Section Title</h2>
        <p>Card Content</p>
    </section>
</Card>
```

---

## License

MIT. See the root [LICENSE](../../LICENSE) file.
