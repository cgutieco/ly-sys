import type { ResponsiveValue } from "@ly-sys/layout-engine";
import type { ElementType } from "react";
import type { BaseLayoutProps } from "../shared/base-layout.types.js";

export type GridItemOwnProps<B extends string> = {
  colSpan?: ResponsiveValue<number | string, B>;
  rowSpan?: ResponsiveValue<number | string, B>;
  colStart?: ResponsiveValue<number | string, B>;
  colEnd?: ResponsiveValue<number | string, B>;
  rowStart?: ResponsiveValue<number | string, B>;
  rowEnd?: ResponsiveValue<number | string, B>;
};

export type GridItemProps<B extends string, E extends ElementType = "div"> = BaseLayoutProps<B, E> &
  GridItemOwnProps<B>;
