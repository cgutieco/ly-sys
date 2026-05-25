import type { ResponsiveValue } from "@ly-sys/layout-engine";
import type { ElementType } from "react";
import type { BaseLayoutProps } from "../shared/base-layout.types.js";

export type CenterOwnProps<B extends string> = {
  inline?: ResponsiveValue<"flex" | "inline-flex", B>;
};

export type CenterProps<B extends string, E extends ElementType = "div"> = BaseLayoutProps<B, E> &
  CenterOwnProps<B>;
