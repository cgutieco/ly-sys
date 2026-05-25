import { createCandidateCollector, DEFAULT_CACHE_SIZE } from "@ly-sys/layout-protocol";
import { createLRUCache } from "./lru-cache.js";
import { createParseResponsive } from "./parse-responsive.js";
import { createPrefixer } from "./prefix.js";
import { createResolver } from "./resolve.js";
import type { EngineConfig, LayoutEngine } from "./types.js";

export const createLayoutEngine = <const B extends string>(
  config: EngineConfig<B>,
): LayoutEngine<B> => {
  const libPrefix = config.libPrefix ?? "ly-sys";
  const appPrefix = config.appPrefix ?? "";

  const cache = createLRUCache<string>(DEFAULT_CACHE_SIZE);
  const prefixer = createPrefixer(libPrefix);
  const parseResponsive = createParseResponsive(
    { ...config, libPrefix, appPrefix },
    prefixer,
    cache,
  );
  const resolve = createResolver(libPrefix, appPrefix, cache);

  return {
    config: Object.freeze({
      ...config,
      libPrefix,
      appPrefix,
    }),
    parseResponsive,
    resolve,
    prefix: prefixer,
    createCandidateCollector,
  };
};
