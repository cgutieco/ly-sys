import { useLayout } from "@ly-sys/layout-react";
import { Slot } from "@radix-ui/react-slot";
import { createElement, type ElementType, forwardRef, type ReactElement, type Ref } from "react";
import type { GridItemProps } from "./grid-item.types.js";

export const GridItem = forwardRef<any, any>(
  (
    {
      colSpan,
      rowSpan,
      colStart,
      colEnd,
      rowStart,
      rowEnd,
      gap,
      asChild,
      className,
      children,
      ...restProps
    },
    ref,
  ) => {
    const { engine } = useLayout();

    const generated = [
      colSpan && engine.parseResponsive(colSpan, "colSpan", (v) => `col-span-${v}`),
      rowSpan && engine.parseResponsive(rowSpan, "rowSpan", (v) => `row-span-${v}`),
      colStart && engine.parseResponsive(colStart, "colStart", (v) => `col-start-${v}`),
      colEnd && engine.parseResponsive(colEnd, "colEnd", (v) => `col-end-${v}`),
      rowStart && engine.parseResponsive(rowStart, "rowStart", (v) => `row-start-${v}`),
      rowEnd && engine.parseResponsive(rowEnd, "rowEnd", (v) => `row-end-${v}`),
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
  props: GridItemProps<B, E> & { ref?: Ref<any> },
) => ReactElement | null;

(GridItem as any).displayName = "GridItem";
