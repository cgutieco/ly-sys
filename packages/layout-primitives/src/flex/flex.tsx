import { useLayout } from "@ly-sys/layout-react";
import { Slot } from "@radix-ui/react-slot";
import { createElement, type ElementType, forwardRef, type ReactElement, type Ref } from "react";
import type { FlexProps } from "./flex.types.js";

export const Flex = forwardRef<any, any>(
  (
    {
      direction,
      wrap,
      align,
      justify,
      gap,
      basis,
      grow,
      shrink,
      asChild,
      className,
      children,
      ...restProps
    },
    ref,
  ) => {
    const { engine } = useLayout();

    const generated = [
      direction &&
        engine.parseResponsive(direction, "direction", (v) => {
          if (v === "column") return "flex-col";
          if (v === "column-reverse") return "flex-col-reverse";
          return `flex-${v}`;
        }),
      wrap && engine.parseResponsive(wrap, "wrap", (v) => `flex-${v}`),
      align && engine.parseResponsive(align, "align", (v) => `items-${v}`),
      justify && engine.parseResponsive(justify, "justify", (v) => `justify-${v}`),
      gap && engine.parseResponsive(gap, "gap", (v) => `gap-${v}`),
      basis && engine.parseResponsive(basis, "basis", (v) => `basis-${v}`),
      grow &&
        engine.parseResponsive(grow, "grow", (v) => {
          if (v === 0 || v === "0") return "grow-0";
          if (v === 1 || v === "1") return "grow";
          return `grow-${v}`;
        }),
      shrink &&
        engine.parseResponsive(shrink, "shrink", (v) => {
          if (v === 0 || v === "0") return "shrink-0";
          if (v === 1 || v === "1") return "shrink";
          return `shrink-${v}`;
        }),
    ]
      .filter(Boolean)
      .join(" ");

    const prefixedGenerated = [engine.prefix("flex"), generated].filter(Boolean).join(" ");
    const finalClassName = engine.resolve(prefixedGenerated, className);

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
  props: FlexProps<B, E> & { ref?: Ref<any> },
) => ReactElement | null;

(Flex as any).displayName = "Flex";
