import {
  Children,
  cloneElement,
  createElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

type PossibleRef<T> = Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as any).current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => {
    for (const ref of refs) {
      setRef(ref, node);
    }
  };
}

type AnyProps = Record<string, any>;

export function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

export function Slottable({ children }: { children: ReactNode }): ReactElement {
  return children as ReactElement;
}

function isSlottable(child: ReactNode): child is ReactElement<{ children: ReactNode }> {
  return isValidElement(child) && child.type === Slottable;
}

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const Slot = forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = slottable.props.children;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (isValidElement(newElement)) {
          return (newElement as ReactElement<any>).props.children as ReactNode;
        }
        return null;
      }
      return child;
    });

    return createElement(
      SlotClone,
      { ...slotProps, ref: forwardedRef },
      isValidElement(newElement)
        ? cloneElement(newElement as ReactElement<any>, undefined, newChildren)
        : null,
    );
  }

  return createElement(SlotClone, { ...slotProps, ref: forwardedRef }, children);
});

Slot.displayName = "Slot";

interface SlotCloneProps {
  children?: ReactNode;
}

export const SlotClone = forwardRef<any, SlotCloneProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (isValidElement(children)) {
    const childRef = (children as any).ref || (children.props as any)?.ref;
    return cloneElement(children as ReactElement<any>, {
      ...mergeProps(slotProps, children.props as AnyProps),
      ref: childRef ? composeRefs(forwardedRef, childRef) : forwardedRef,
    });
  }

  if (children === null || children === undefined) {
    return null;
  }

  return Children.only(children);
});

SlotClone.displayName = "SlotClone";
