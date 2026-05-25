import { useLayout } from "@ly-sys/layout-react";
import { Slot } from "@radix-ui/react-slot";
import { createElement, type ElementType, forwardRef, type ReactElement, type Ref } from "react";
import type { BaseLayoutProps } from "../shared/base-layout.types.js";

export type SpacerProps<B extends string, E extends ElementType = "div"> = BaseLayoutProps<B, E>;

export const Spacer = forwardRef<any, any>(
  ({ asChild, className, children, ...restProps }, ref) => {
    const { engine } = useLayout();

    const prefixedGenerated = engine.prefix("flex-1");
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
  props: SpacerProps<B, E> & { ref?: Ref<any> },
) => ReactElement | null;

(Spacer as any).displayName = "Spacer";
