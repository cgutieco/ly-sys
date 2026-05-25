import { SourceName, SourcePriority } from "@ly-sys/layout-protocol";
import type { createLRUCache } from "./lru-cache.js";
import { extractPropertyGroup } from "./property-map.js";

type Source = SourceName;

type CollisionEntry = {
  className: string;
  priority: number;
  index: number;
};

const getPriority = (source: Source): number => {
  if (source === SourceName.App) return SourcePriority.App;
  if (source === SourceName.Neutral) return SourcePriority.Neutral;
  return SourcePriority.Lib;
};

const getSourceFromPrefix = (className: string, libPrefix: string, appPrefix: string): Source => {
  if (libPrefix && className.startsWith(`${libPrefix}-`)) return SourceName.Lib;
  if (appPrefix && className.startsWith(`${appPrefix}-`)) return SourceName.App;
  return SourceName.Neutral;
};

const buildCollisionInfo = (
  className: string,
  index: number,
  libPrefix: string,
  appPrefix: string,
): { key: string; entry: CollisionEntry } => {
  const parsed = extractPropertyGroup(className, libPrefix, appPrefix);
  if (parsed) {
    const key = `${parsed.breakpoint ?? ""}:${parsed.group}`;
    return {
      key,
      entry: { className, priority: getPriority(parsed.source), index },
    };
  }

  const key = `__unrecognized__:${index}`;
  const source = getSourceFromPrefix(className, libPrefix, appPrefix);
  return {
    key,
    entry: { className, priority: getPriority(source), index },
  };
};

export const createResolver = (
  libPrefix: string,
  appPrefix: string,
  cache: ReturnType<typeof createLRUCache<string>>,
): ((generated: string, user?: string) => string) => {
  return (generated: string, user?: string): string => {
    const trimmedGenerated = generated ? generated.trim() : "";
    const trimmedUser = user ? user.trim() : "";

    if (!trimmedGenerated && !trimmedUser) return "";
    if (!trimmedGenerated) return trimmedUser;
    if (!trimmedUser) return trimmedGenerated;

    const cacheKey = `${trimmedGenerated}|${trimmedUser}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached;

    // Split classes
    const classes = `${trimmedGenerated} ${trimmedUser}`.split(/\s+/).filter(Boolean);
    const n = classes.length;

    // Map to keep track of collision key -> retained class info
    const collisionMap = new Map<string, CollisionEntry>();

    // Traverse right-to-left to apply rightmost wins on same priority
    for (let i = n - 1; i >= 0; i--) {
      const cls = classes[i];
      const info = buildCollisionInfo(cls, i, libPrefix, appPrefix);
      const existing = collisionMap.get(info.key);

      if (!existing || info.entry.priority > existing.priority) {
        collisionMap.set(info.key, info.entry);
      }
    }

    // Sort retained classes by their original index to preserve order
    const sortedClasses = Array.from(collisionMap.values())
      .sort((a, b) => a.index - b.index)
      .map((item) => item.className);

    const result = sortedClasses.join(" ");
    cache.set(cacheKey, result);
    return result;
  };
};
