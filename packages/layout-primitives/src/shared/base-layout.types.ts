import type { ResponsiveValue } from "@ly-sys/layout-engine";
import type { ComponentPropsWithoutRef, ElementType } from "react";

export type AsChildProp = {
  asChild?: boolean;
};

export type PolymorphicComponentProps<E extends ElementType, P = Record<never, never>> = Omit<
  ComponentPropsWithoutRef<E>,
  keyof P | "asChild"
> &
  P &
  AsChildProp;

export type BaseLayoutProps<B extends string, E extends ElementType> = PolymorphicComponentProps<
  E,
  {
    gap?: ResponsiveValue<number | string, B>;
  }
>;
