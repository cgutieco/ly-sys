import { createElement, type ElementType, forwardRef, type ReactElement, type Ref } from "react";
import { Flex } from "../flex/flex.js";
import type { FlexOwnProps, FlexProps } from "../flex/flex.types.js";

export type VStackOwnProps<B extends string> = Omit<FlexOwnProps<B>, "direction">;
export type VStackProps<B extends string, E extends ElementType = "div"> = Omit<
  FlexProps<B, E>,
  "direction"
>;

export const VStack = forwardRef<any, any>((props, ref) =>
  createElement(Flex, { ref, direction: "column", ...props }),
) as <B extends string, E extends ElementType = "div">(
  props: VStackProps<B, E> & { ref?: Ref<any> },
) => ReactElement | null;

(VStack as any).displayName = "VStack";
