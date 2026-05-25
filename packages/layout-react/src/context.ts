import type { LayoutEngine } from "@ly-sys/layout-engine";
import type { CandidateCollector } from "@ly-sys/layout-protocol";
import { createContext } from "react";

export type LayoutContextValue<B extends string> = {
  engine: LayoutEngine<B>;
  collector?: CandidateCollector | undefined;
};

export const LayoutContext = createContext<LayoutContextValue<any> | null>(null);
