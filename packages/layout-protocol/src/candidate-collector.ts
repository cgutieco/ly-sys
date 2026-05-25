import type { Candidate, CandidateBatch, CandidateCollector } from "./types.js";

export const createCandidateCollector = (): CandidateCollector => {
  const seen = new Set<string>(); // key: `${breakpoint}:${utility}` or `utility`
  const candidates: Candidate[] = [];
  let rawCSS: { critical?: string; deferable?: string } | undefined;

  return {
    add(utility: string, breakpoint?: string): void {
      const key = breakpoint ? `${breakpoint}:${utility}` : utility;
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push({ utility, breakpoint });
    },
    addRawCSS(css: { critical?: string; deferable?: string }): void {
      rawCSS ??= {};
      if (css.critical) {
        rawCSS.critical = (rawCSS.critical ? `${rawCSS.critical}\n` : "") + css.critical;
      }
      if (css.deferable) {
        rawCSS.deferable = (rawCSS.deferable ? `${rawCSS.deferable}\n` : "") + css.deferable;
      }
    },
    flush(): CandidateBatch {
      const result: CandidateBatch = {
        candidates: [...candidates],
        rawCSS: rawCSS ? { ...rawCSS } : undefined,
      };
      // Destructive: clear state
      candidates.length = 0;
      seen.clear();
      rawCSS = undefined;
      return result;
    },
  };
};
