import { ValidationMode } from "@ly-sys/layout-protocol";
import type { createLRUCache } from "./lru-cache.js";
import type { EngineConfig, PropRule, ResponsiveValue } from "./types.js";

const isResponsiveObject = <T extends string | number, B extends string>(
  value: ResponsiveValue<T, B>,
): value is Partial<Record<B, T>> => typeof value === "object" && value !== null;

const serializeResponsiveKey = <T extends string | number, B extends string>(
  value: ResponsiveValue<T, B>,
  breakpoints: readonly B[],
): string => {
  if (!isResponsiveObject(value)) return String(value);

  const parts: string[] = [];
  for (const bp of breakpoints) {
    const bpValue = value[bp];
    if (bpValue !== undefined) {
      parts.push(`${bp}:${bpValue}`);
    }
  }

  return parts.join(";");
};

const isValidResponsiveValue = <T extends string | number>(
  val: T,
  propName: string,
  rule: PropRule | undefined,
  validationMode: EngineConfig<string>["validationMode"],
): boolean => {
  if (!rule || validationMode === ValidationMode.Permissive) return true;

  const isArbitrary = typeof val === "string" && val.startsWith("[") && val.endsWith("]");

  let isScaled = true;
  if (rule.scale) {
    isScaled =
      rule.scale.includes(val) ||
      rule.scale.includes(String(val)) ||
      rule.scale.includes(Number(val));
  }

  const isValid = isArbitrary ? !!rule.allowArbitrary : isScaled;

  if (!isValid && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    console.error(`[ly-sys/layout] Invalid value "${val}" for prop "${propName}".`);
  }

  return isValid;
};

const appendResponsiveClass = <T extends string | number, B extends string>(
  emittedClasses: string[],
  bp: B,
  val: T,
  prefixer: (className: string) => string,
  utilityFn: (val: T) => string,
): void => {
  const utility = utilityFn(val);
  if (!utility) return;

  const prefixed = prefixer(utility);
  emittedClasses.push(bp === "base" ? prefixed : `${bp}:${prefixed}`);
};

const collectResponsiveClasses = <T extends string | number, B extends string>(
  value: ResponsiveValue<T, B>,
  isObject: boolean,
  config: EngineConfig<B>,
  propName: string,
  prefixer: (className: string) => string,
  utilityFn: (val: T) => string,
): string[] => {
  const emittedClasses: string[] = [];
  const rule = config.propRules?.[propName];
  const validationMode = config.validationMode;

  if (isObject) {
    const valueObj = value as Partial<Record<B, T>>;
    for (const bp of config.breakpoints) {
      const val = valueObj[bp];
      if (val === undefined || val === null) continue;
      if (!isValidResponsiveValue(val, propName, rule, validationMode)) {
        continue;
      }
      appendResponsiveClass(emittedClasses, bp, val, prefixer, utilityFn);
    }

    return emittedClasses;
  }

  for (const bp of config.breakpoints) {
    if (bp !== "base") continue;
    if (!isValidResponsiveValue(value as T, propName, rule, validationMode)) {
      continue;
    }
    appendResponsiveClass(emittedClasses, bp, value as T, prefixer, utilityFn);
  }

  return emittedClasses;
};

export const createParseResponsive = <B extends string>(
  config: EngineConfig<B>,
  prefixer: (className: string) => string,
  cache: ReturnType<typeof createLRUCache<string>>,
): (<T extends string | number>(
  value: ResponsiveValue<T, B>,
  propName: string,
  utilityFn: (val: T) => string,
) => string) => {
  return <T extends string | number>(
    value: ResponsiveValue<T, B>,
    propName: string,
    utilityFn: (val: T) => string,
  ): string => {
    if (value === undefined || value === null) return "";

    // 1. Serialize cache key in O(k)
    const isObject = isResponsiveObject(value);
    const serializedKey = serializeResponsiveKey(value, config.breakpoints);

    const cacheKey = `${propName}|${serializedKey}`;

    // 2. LRU Cache lookup
    const cached = cache.get(cacheKey);
    if (cached !== undefined) return cached;

    // 3. Cache miss: compute classes
    const emittedClasses = collectResponsiveClasses(
      value,
      isObject,
      config,
      propName,
      prefixer,
      utilityFn,
    );

    const result = emittedClasses.join(" ");
    cache.set(cacheKey, result);
    return result;
  };
};
