import { useLayout } from "@ly-sys/layout-react";
import { Slot } from "@radix-ui/react-slot";
import { createElement, type ElementType, forwardRef, type ReactElement, type Ref } from "react";
import type { ContainerProps } from "./container.types.js";

export const Container = forwardRef<any, any>(
  ({ maxWidth, centerContent, gap, asChild, className, children, ...restProps }, ref) => {
    const { engine } = useLayout();

    const centerContentVal = centerContent ?? "auto";

    const generated = [
      maxWidth && engine.parseResponsive(maxWidth, "maxWidth", (v) => `max-w-${v}`),
      centerContentVal &&
        engine.parseResponsive(centerContentVal, "centerContent", (v) =>
          v === "auto" ? "mx-auto" : "",
        ),
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
  props: ContainerProps<B, E> & { ref?: Ref<any> },
) => ReactElement | null;

(Container as any).displayName = "Container";
