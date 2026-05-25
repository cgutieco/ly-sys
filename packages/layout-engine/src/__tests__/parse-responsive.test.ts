import { ValidationMode } from "@ly-sys/layout-protocol";
import { expect, test, vi } from "vitest";
import { createLRUCache } from "../lru-cache.js";
import { createParseResponsive } from "../parse-responsive.js";
import { createPrefixer } from "../prefix.js";

test("parse-responsive basic scalar and responsive values", () => {
  const config = {
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base", "sm", "md", "lg"] as const,
  };
  const prefixer = createPrefixer(config.libPrefix);
  const cache = createLRUCache<string>(100);
  const parse = createParseResponsive(config, prefixer, cache);

  // Scalar
  const res1 = parse("col", "direction", (v) => `flex-${v}`);
  expect(res1).toBe("pcf-flex-col");

  // Object
  const res2 = parse(
    { base: "col", md: "row", lg: "row-reverse" },
    "direction",
    (v) => `flex-${v}`,
  );
  expect(res2).toBe("pcf-flex-col md:pcf-flex-row lg:pcf-flex-row-reverse");
});

test("parse-responsive validation mode: strict vs permissive", () => {
  const configStrict = {
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base", "md"] as const,
    validationMode: ValidationMode.Strict,
    propRules: {
      gap: {
        scale: [1, 2, 3, 4],
        allowArbitrary: false,
      },
    },
  };

  const prefixer = createPrefixer("pcf");
  const cache = createLRUCache<string>(100);
  const parseStrict = createParseResponsive(configStrict, prefixer, cache);

  // Spy on console.error
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  // Scale validation in strict
  const resValid = parseStrict(2, "gap", (v) => `gap-${v}`);
  expect(resValid).toBe("pcf-gap-2");
  expect(consoleErrorSpy).not.toHaveBeenCalled();

  const resInvalid = parseStrict(5, "gap", (v) => `gap-${v}`);
  expect(resInvalid).toBe("");
  expect(consoleErrorSpy).toHaveBeenCalled();
  consoleErrorSpy.mockClear();

  // Arbitrary values check
  const resArbitraryFail = parseStrict("[24px]", "gap", (v) => `gap-${v}`);
  expect(resArbitraryFail).toBe("");
  expect(consoleErrorSpy).toHaveBeenCalled();
  consoleErrorSpy.mockClear();

  // Strict allowArbitrary: true
  const configStrictWithArbitrary = {
    ...configStrict,
    propRules: {
      gap: {
        scale: [1, 2, 3, 4],
        allowArbitrary: true,
      },
    },
  };
  const parseStrictWithArbitrary = createParseResponsive(
    configStrictWithArbitrary,
    prefixer,
    createLRUCache<string>(100),
  );

  const resArbitraryPass = parseStrictWithArbitrary("[24px]", "gap", (v) => `gap-${v}`);
  expect(resArbitraryPass).toBe("pcf-gap-[24px]");
  expect(consoleErrorSpy).not.toHaveBeenCalled();

  // Permissive mode ignores rules and passes directly
  const configPermissive = {
    ...configStrict,
    validationMode: ValidationMode.Permissive,
  };
  const parsePermissive = createParseResponsive(
    configPermissive,
    prefixer,
    createLRUCache<string>(100),
  );

  const resPermissive = parsePermissive(5, "gap", (v) => `gap-${v}`);
  expect(resPermissive).toBe("pcf-gap-5");
  expect(consoleErrorSpy).not.toHaveBeenCalled();

  // Permissive mode overrides allowArbitrary: false
  const resPermissiveArbitrary = parsePermissive("[24px]", "gap", (v) => `gap-${v}`);
  expect(resPermissiveArbitrary).toBe("pcf-gap-[24px]");
  expect(consoleErrorSpy).not.toHaveBeenCalled();

  consoleErrorSpy.mockRestore();
});

test("parse-responsive LRU caching hits", () => {
  const config = {
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base", "md"] as const,
  };
  const prefixer = createPrefixer("pcf");
  const cache = createLRUCache<string>(100);
  const parse = createParseResponsive(config, prefixer, cache);

  const mockFn = vi.fn((v) => `flex-${v}`);

  const res1 = parse("col", "direction", mockFn);
  expect(res1).toBe("pcf-flex-col");
  expect(mockFn).toHaveBeenCalledTimes(1);

  // Second call must HIT the cache and not call mockFn again
  const res2 = parse("col", "direction", mockFn);
  expect(res2).toBe("pcf-flex-col");
  expect(mockFn).toHaveBeenCalledTimes(1);
});
