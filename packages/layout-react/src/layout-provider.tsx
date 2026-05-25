import type { LayoutEngine, ResponsiveValue } from "@ly-sys/layout-engine";
import { type CandidateCollector, CandidateMode } from "@ly-sys/layout-protocol";
import { createElement, type ReactNode, useMemo } from "react";
import { LayoutContext, type LayoutContextValue } from "./context.js";

export type LayoutProviderProps<B extends string> = {
  engine: LayoutEngine<B>;
  collector?: CandidateCollector;
  children?: ReactNode;
};

const registerCandidates = (
  classesString: string,
  config: { libPrefix?: string },
  collector?: CandidateCollector,
): void => {
  if (!classesString || !collector) return;
  const classes = classesString.split(/\s+/).filter(Boolean);
  for (const cls of classes) {
    const colonIndex = cls.lastIndexOf(":");
    const hasBreakpoint = colonIndex >= 0;
    const breakpoint = hasBreakpoint ? cls.slice(0, colonIndex) : undefined;
    const rawClass = hasBreakpoint ? cls.slice(colonIndex + 1) : cls;

    if (config.libPrefix && rawClass.startsWith(`${config.libPrefix}-`)) {
      const utility = rawClass.slice(config.libPrefix.length + 1);
      collector.add(utility, breakpoint);
    }
  }
};

export const LayoutProvider = <B extends string>({
  engine,
  collector,
  children,
}: LayoutProviderProps<B>) => {
  const contextValue = useMemo<LayoutContextValue<B>>(() => {
    const shouldCollect =
      engine.config.candidateMode === CandidateMode.Collect && collector != null;

    if (!shouldCollect) {
      return { engine, collector };
    }

    const decoratedEngine: LayoutEngine<B> = {
      ...engine,
      parseResponsive: <T extends string | number>(
        value: ResponsiveValue<T, B>,
        propName: string,
        utilityFn: (val: T) => string,
      ): string => {
        const result = engine.parseResponsive(value, propName, utilityFn);
        registerCandidates(result, engine.config, collector);
        return result;
      },
    };

    return { engine: decoratedEngine, collector };
  }, [engine, collector]);

  return createElement(LayoutContext.Provider, { value: contextValue }, children);
};
