import type {
  CandidateBatch,
  CriticalCSSInjector,
  DeferredCSSInjector,
  LayoutService,
  LayoutServiceConfig,
} from "./types.js";

const candidateKey = (utility: string, breakpoint?: string): string =>
  breakpoint ? `${breakpoint}:${utility}` : utility;

const mergeCandidates = (existing: CandidateBatch, incoming: CandidateBatch): void => {
  const seen = new Set(existing.candidates.map((c) => candidateKey(c.utility, c.breakpoint)));

  for (const c of incoming.candidates) {
    const key = candidateKey(c.utility, c.breakpoint);
    if (!seen.has(key)) {
      existing.candidates.push(c);
      seen.add(key);
    }
  }
};

const mergeRawCSS = (existing: CandidateBatch, incoming: CandidateBatch): void => {
  if (!incoming.rawCSS) return;

  existing.rawCSS ??= {};

  if (incoming.rawCSS.critical) {
    existing.rawCSS.critical =
      (existing.rawCSS.critical ? `${existing.rawCSS.critical}\n` : "") + incoming.rawCSS.critical;
  }

  if (incoming.rawCSS.deferable) {
    existing.rawCSS.deferable =
      (existing.rawCSS.deferable ? `${existing.rawCSS.deferable}\n` : "") +
      incoming.rawCSS.deferable;
  }
};

const defaultDeferredInjector: DeferredCSSInjector = (css: string, remoteName: string): void => {
  const inject = () => {
    const style = document.createElement("style");
    style.dataset.lyDeferred = remoteName;
    style.textContent = css;
    document.head.appendChild(style);
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(inject);
  } else {
    setTimeout(inject, 0);
  }
};

const defaultCriticalInjector: CriticalCSSInjector = (css: string, remoteName: string): void => {
  if (typeof document === "undefined") return;
  let style = document.querySelector(`style[data-ly-critical="${remoteName}"]`) as HTMLStyleElement;
  if (!style) {
    style = document.createElement("style");
    style.dataset.lyDeferred = remoteName;
    document.head.appendChild(style);
  }
  style.textContent = css;
};

/**
 * Creates a LayoutService instance for use as a DI service in Module Federation.
 *
 * The host creates one instance and registers it in the DI container.
 * Remotes inherit it via BasicChildContainer and use it to:
 * - Access the shared LayoutEngine
 * - Register CSS candidates
 * - Request deferred CSS injection
 *
 * @example
 * ```ts
 * // In the host's DI plugin:
 * import { createLayoutService } from "@ly-sys/layout-protocol";
 *
 * ctx.bind("layout-service", {
 *   scope: "singleton",
 *   provider: () => createLayoutService({ engine: myEngine }),
 * });
 * ```
 */
export const createLayoutService = (config: LayoutServiceConfig): LayoutService => {
  const {
    engine,
    deferredInjector = defaultDeferredInjector,
    criticalInjector = defaultCriticalInjector,
  } = config;

  const registry = new Map<string, CandidateBatch>();
  const injectedDeferred = new Set<string>();

  return {
    engine,

    registerCandidates(batch: CandidateBatch, remoteName: string): void {
      const existing = registry.get(remoteName);

      if (!existing) {
        registry.set(remoteName, {
          candidates: [...batch.candidates],
          rawCSS: batch.rawCSS ? { ...batch.rawCSS } : undefined,
        });
        if (batch.rawCSS?.critical) {
          criticalInjector(batch.rawCSS.critical, remoteName);
        }
        return;
      }

      mergeCandidates(existing, batch);

      const prevCritical = existing.rawCSS?.critical;
      mergeRawCSS(existing, batch);

      if (existing.rawCSS?.critical && existing.rawCSS.critical !== prevCritical) {
        criticalInjector(existing.rawCSS.critical, remoteName);
      }
    },

    requestDeferredCSS(remoteName: string): void {
      if (injectedDeferred.has(remoteName)) return;

      const batch = registry.get(remoteName);
      if (!batch?.rawCSS?.deferable) return;

      injectedDeferred.add(remoteName);
      deferredInjector(batch.rawCSS.deferable, remoteName);
    },
  };
};
