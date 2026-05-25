import { useLayout } from "@ly-sys/layout-react";
import { Slot } from "@radix-ui/react-slot";
import { createElement, type ElementType, forwardRef, type ReactElement, type Ref } from "react";
import type { CenterProps } from "./center.types.js";

export const Center = forwardRef<any, any>(
  ({ inline, gap, asChild, className, children, ...restProps }, ref) => {
    const { engine } = useLayout();

    const displayVal = inline ?? "flex";

    const generated = [
      engine.parseResponsive(displayVal, "display", (v) => v),
      engine.prefix("items-center"),
      engine.prefix("justify-center"),
      gap && engine.parseResponsive(gap, "gap", (v) => `gap-${v}`),
    ]
      .filter(Boolean)
      .join(" ");

    const finalClassName = engine.resolve(generated, className);

    const Comp = asChild ? Slot : "div";

    return createElement(
      Comp,
      {
        ref,
        className: finalClassName,
        ...restProps,
      },
      children,
    );
  },
) as <B extends string, E extends ElementType = "div">(
  props: CenterProps<B, E> & { ref?: Ref<any> },
) => ReactElement | null;

(Center as any).displayName = "Center";
