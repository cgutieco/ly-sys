import type { ResponsiveValue } from "@ly-sys/layout-engine";
import type { ElementType } from "react";
import type { BaseLayoutProps } from "../shared/base-layout.types.js";

export type ContainerOwnProps<B extends string> = {
  maxWidth?: ResponsiveValue<number | string, B>;
  centerContent?: ResponsiveValue<"auto" | "none", B>; // Default: 'auto' (mx-auto).
};

export type ContainerProps<B extends string, E extends ElementType = "div"> = BaseLayoutProps<
  B,
  E
> &
  ContainerOwnProps<B>;
