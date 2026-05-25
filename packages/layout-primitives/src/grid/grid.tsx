import type { LayoutEngine, ResponsiveValue } from "@ly-sys/layout-engine";
import { type CandidateCollector, CandidateMode, ValidationMode } from "@ly-sys/layout-protocol";
import { useLayout } from "@ly-sys/layout-react";
import { Slot } from "@radix-ui/react-slot";
import { createElement, type ElementType, forwardRef, type ReactElement, type Ref } from "react";
import { BREAKPOINT_MEDIA_QUERIES, escapeSelector, formatSize } from "../shared/utility-fns.js";
import type { GridProps } from "./grid.types.js";

const getMinChildWidthValues = <B extends string>(
  minChildWidth: ResponsiveValue<number | string, B>,
): Partial<Record<string, number | string>> => {
  if (typeof minChildWidth === "object" && minChildWidth !== null) {
    return minChildWidth as Partial<Record<string, number | string>>;
  }

  return { base: minChildWidth };
};

const collectMinChildWidthCandidates = <B extends string>(
  engine: LayoutEngine<B>,
  collector: CandidateCollector | null | undefined,
  minChildWidth: ResponsiveValue<number | string, B>,
): void => {
  if (engine.config.candidateMode !== CandidateMode.Collect || !collector) {
    return;
  }

  const values = getMinChildWidthValues(minChildWidth);

  for (const bp of engine.config.breakpoints) {
    const val = values[bp];
    if (val === undefined || val === null) {
      continue;
    }

    const formatted = formatSize(val);
    const utility = `grid-cols-[${formatted}]`;
    const prefixed = engine.prefix(utility);
    const fullClass = bp === "base" ? prefixed : `${bp}:${prefixed}`;

    const selector = `.${escapeSelector(fullClass)}`;
    const cssRule = `${selector} { grid-template-columns: repeat(auto-fit, minmax(${formatted}, 1fr)); }`;

    if (bp === "base") {
      collector.addRawCSS({ critical: cssRule });
      continue;
    }

    const mediaQuery = BREAKPOINT_MEDIA_QUERIES[bp];
    collector.addRawCSS({
      critical: mediaQuery ? `@media ${mediaQuery} { ${cssRule} }` : cssRule,
    });
  }
};

export const Grid = forwardRef<any, any>(
  (
    { columns, minChildWidth, rowGap, columnGap, gap, asChild, className, children, ...restProps },
    ref,
  ) => {
    const { engine, collector } = useLayout();

    if (columns !== undefined && minChildWidth !== undefined) {
      if (engine.config.validationMode !== ValidationMode.Permissive) {
        throw new Error(
          '[ly-sys/layout] "columns" and "minChildWidth" are mutually exclusive in Grid.',
        );
      }
    }

    // Register raw CSS to the candidate collector if active
    if (minChildWidth !== undefined) {
      collectMinChildWidthCandidates(engine, collector, minChildWidth);
    }

    const generated = [
      columns && engine.parseResponsive(columns, "columns", (v) => `grid-cols-${v}`),
      minChildWidth &&
        engine.parseResponsive(
          minChildWidth,
          "minChildWidth",
          (v) => `grid-cols-[${formatSize(v)}]`,
        ),
      rowGap && engine.parseResponsive(rowGap, "rowGap", (v) => `gap-y-${v}`),
      columnGap && engine.parseResponsive(columnGap, "columnGap", (v) => `gap-x-${v}`),
      gap && engine.parseResponsive(gap, "gap", (v) => `gap-${v}`),
    ]
      .filter(Boolean)
      .join(" ");

    const prefixedGenerated = [engine.prefix("grid"), generated].filter(Boolean).join(" ");
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
  props: GridProps<B, E> & { ref?: Ref<any> },
) => ReactElement | null;

(Grid as any).displayName = "Grid";
