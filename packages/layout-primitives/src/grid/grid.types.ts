import type { ResponsiveValue } from "@ly-sys/layout-engine";
import type { ElementType } from "react";
import type { BaseLayoutProps } from "../shared/base-layout.types.js";

export type GridOwnProps<B extends string> = {
  columns?: ResponsiveValue<number | string, B>;
  minChildWidth?: ResponsiveValue<number | string, B>;
  rowGap?: ResponsiveValue<number | string, B>;
  columnGap?: ResponsiveValue<number | string, B>;
};

export type GridProps<B extends string, E extends ElementType = "div"> = BaseLayoutProps<B, E> &
  GridOwnProps<B>;
