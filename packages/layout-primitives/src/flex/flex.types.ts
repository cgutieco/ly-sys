import type { ResponsiveValue } from "@ly-sys/layout-engine";
import type { ElementType } from "react";
import type { BaseLayoutProps } from "../shared/base-layout.types.js";

export type FlexOwnProps<B extends string> = {
  direction?: ResponsiveValue<"row" | "column" | "row-reverse" | "column-reverse", B>;
  wrap?: ResponsiveValue<"nowrap" | "wrap" | "wrap-reverse", B>;
  align?: ResponsiveValue<"start" | "center" | "end" | "stretch" | "baseline", B>;
  justify?: ResponsiveValue<"start" | "center" | "end" | "between" | "around" | "evenly", B>;
  basis?: ResponsiveValue<number | string, B>;
  grow?: ResponsiveValue<number | string, B>;
  shrink?: ResponsiveValue<number | string, B>;
};

export type FlexProps<B extends string, E extends ElementType = "div"> = BaseLayoutProps<B, E> &
  FlexOwnProps<B>;
