import { createElement, type ElementType, forwardRef, type ReactElement, type Ref } from "react";
import { Flex } from "../flex/flex.js";
import type { FlexOwnProps, FlexProps } from "../flex/flex.types.js";

export type HStackOwnProps<B extends string> = Omit<FlexOwnProps<B>, "direction">;
export type HStackProps<B extends string, E extends ElementType = "div"> = Omit<
  FlexProps<B, E>,
  "direction"
>;

export const HStack = forwardRef<any, any>((props, ref) =>
  createElement(Flex, { ref, direction: "row", ...props }),
) as <B extends string, E extends ElementType = "div">(
  props: HStackProps<B, E> & { ref?: Ref<any> },
) => ReactElement | null;

(HStack as any).displayName = "HStack";
