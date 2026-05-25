import { expect, test } from "vitest";
import { createLRUCache } from "../lru-cache.js";
import { createResolver } from "../resolve.js";

test("resolver basic priorities app > neutral > lib", () => {
  const cache = createLRUCache<string>(100);
  const resolve = createResolver("pcf", "app", cache);

  // app vs lib -> app wins
  expect(resolve("pcf-flex-col", "app-flex-row")).toBe("app-flex-row");

  // neutral vs lib -> neutral wins
  expect(resolve("pcf-flex-col", "flex-row")).toBe("flex-row");

  // app vs neutral -> app wins
  expect(resolve("flex-row", "app-flex-col")).toBe("app-flex-col");

  // Mixed case: resolve('pcf-flex-col pcf-gap-4', 'app-flex-row mt-4')
  // mt-4 is neutral (kept)
  // app-flex-row is app (kept, overrides pcf-flex-col)
  // pcf-gap-4 is lib (kept, no conflict)
  // Result: pcf-gap-4 app-flex-row mt-4
  expect(resolve("pcf-flex-col pcf-gap-4", "app-flex-row mt-4")).toBe(
    "pcf-gap-4 app-flex-row mt-4",
  );
});

test("resolver axes distinction", () => {
  const cache = createLRUCache<string>(100);
  const resolve = createResolver("pcf", "app", cache);

  // gap-x-4 and gap-4 are in different groups, they should co-exist
  expect(resolve("pcf-gap-4", "pcf-gap-x-2")).toBe("pcf-gap-4 pcf-gap-x-2");
  expect(resolve("pcf-gap-x-2", "pcf-gap-4")).toBe("pcf-gap-x-2 pcf-gap-4");
});

test("resolver unrecognized neutral classes co-exist", () => {
  const cache = createLRUCache<string>(100);
  const resolve = createResolver("pcf", "app", cache);

  // Unrecognized neutral classes (like mt-4, text-red-500) co-exist with lib classes
  expect(resolve("pcf-flex-col", "text-red-500 mt-4")).toBe("pcf-flex-col text-red-500 mt-4");
});

test("resolver memoization and cache limits", () => {
  const cache = createLRUCache<string>(2);
  const resolve = createResolver("pcf", "app", cache);

  const res1 = resolve("pcf-flex-col", "app-flex-row");
  const res2 = resolve("pcf-flex-col", "app-flex-row");
  expect(res1).toBe(res2);

  // Fill cache to force eviction
  resolve("pcf-gap-4", "app-gap-2");
  resolve("pcf-items-center", "app-items-start");

  // Since size limit is 2, first call should be evicted
  expect(cache.size()).toBe(2);
});
