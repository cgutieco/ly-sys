import type { LayoutEngine } from "@ly-sys/layout-engine";
import { CandidateMode } from "@ly-sys/layout-protocol";
import { useContext } from "react";
import { LayoutContext, type LayoutContextValue } from "./context.js";

const createEmptyEngine = (): LayoutEngine<any> => ({
  config: Object.freeze({
    libPrefix: "",
    appPrefix: "",
    breakpoints: [] as readonly string[],
    candidateMode: CandidateMode.Off,
  }),
  resolve: (generated: string, user?: string) => {
    const g = generated ? generated.trim() : "";
    const u = user ? user.trim() : "";
    if (!g && !u) return "";
    if (!g) return u;
    if (!u) return g;
    return `${g} ${u}`;
  },
  parseResponsive: () => "",
  prefix: (className: string) => className,
  createCandidateCollector: () => ({
    add: () => {},
    addRawCSS: () => {},
    flush: () => ({ candidates: [] }),
  }),
});

export const useLayout = <B extends string>(): LayoutContextValue<B> => {
  const ctx = useContext(LayoutContext);
  if (ctx === null) {
    const isDev = typeof process !== "undefined" && process.env.NODE_ENV !== "production";
    if (isDev) {
      throw new Error("[ly-sys/layout] useLayout must be used within a <LayoutProvider>.");
    }
    // Production fallback
    console.error("[ly-sys/layout] useLayout outside of a <LayoutProvider>.");
    return {
      engine: createEmptyEngine(),
    } as LayoutContextValue<B>;
  }
  return ctx as LayoutContextValue<B>;
};
