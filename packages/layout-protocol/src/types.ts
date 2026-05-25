export type Candidate = { utility: string; breakpoint?: string | undefined };

export type CandidateBatch = {
  candidates: Candidate[];
  rawCSS?: { critical?: string; deferable?: string } | undefined;
};

export type CandidateCollector = {
  add: (utility: string, breakpoint?: string | undefined) => void;
  addRawCSS: (css: { critical?: string; deferable?: string }) => void;
  flush: () => CandidateBatch;
};

export type ProviderResponse = {
  protocolVersion: string;
  candidates: Candidate[];
  rawCSS?: { critical?: string; deferable?: string } | undefined;
};

export enum LayerMode {
  Full = "full",
  Single = "single",
}

export enum CandidateMode {
  Off = "off",
  Collect = "collect",
}

export enum ValidationMode {
  Strict = "strict",
  Permissive = "permissive",
}

export enum SourcePriority {
  Lib = 1,
  Neutral = 2,
  App = 3,
}

export enum SourceName {
  Lib = "lib",
  App = "app",
  Neutral = "neutral",
}

export const DEFAULT_CACHE_SIZE = 500;
export const DEFAULT_LAYER_NAME = "layout";
export const DEFAULT_PROTOCOL_VERSION = "1.0";

// --- Module Federation Integration ---

export type LayoutService = {
  /** Shared engine singleton — same instance for host and all remotes */
  readonly engine: LayoutEngineRef;

  /**
   * Register CSS candidates from a remote.
   * The host decides when and how to generate the final CSS.
   */
  registerCandidates(batch: CandidateBatch, remoteName: string): void;

  /**
   * Request injection of deferred CSS for a remote.
   * The host controls the timing and strategy.
   * Idempotent: calling multiple times for the same remote is a no-op.
   */
  requestDeferredCSS(remoteName: string): void;
};

/**
 * Opaque reference to a LayoutEngine instance.
 * This avoids a hard dependency on @ly-sys/layout-engine from the protocol package.
 * The consuming code casts this to the concrete LayoutEngine type.
 */
export type LayoutEngineRef = Record<string, unknown>;

export type DeferredCSSInjector = (css: string, remoteName: string) => void;
export type CriticalCSSInjector = (css: string, remoteName: string) => void;

export type LayoutServiceConfig = {
  /** The layout engine instance to share across host and remotes */
  engine: LayoutEngineRef;
  /** Custom injector for deferred CSS. Defaults to appending a <style> tag via requestIdleCallback */
  deferredInjector?: DeferredCSSInjector;
  /** Custom injector for critical CSS. Defaults to appending a <style> tag synchronously */
  criticalInjector?: CriticalCSSInjector;
};
