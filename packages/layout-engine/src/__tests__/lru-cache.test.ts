import { expect, test } from "vitest";
import { createLRUCache } from "../lru-cache.js";

test("LRU Cache basic operations", () => {
  const cache = createLRUCache<string>(3);
  expect(cache.size()).toBe(0);

  cache.set("a", "1");
  cache.set("b", "2");
  cache.set("c", "3");
  expect(cache.size()).toBe(3);
  expect(cache.get("a")).toBe("1");
  expect(cache.get("b")).toBe("2");
  expect(cache.get("c")).toBe("3");

  // Eviction
  cache.set("d", "4");
  expect(cache.size()).toBe(3);
  expect(cache.get("a")).toBeUndefined(); // 'a' was evicted because it was the oldest and wasn't refreshed before 'd' was added
  expect(cache.get("d")).toBe("4");
});

test("LRU Cache updates MRU order on get", () => {
  const cache = createLRUCache<string>(3);
  cache.set("a", "1");
  cache.set("b", "2");
  cache.set("c", "3");

  // Get 'a' to refresh it (make it MRU)
  expect(cache.get("a")).toBe("1");

  // Now, add 'd'. 'b' should be evicted because 'a' was refreshed and 'c' was set later than 'b'.
  cache.set("d", "4");
  expect(cache.get("b")).toBeUndefined(); // evicted
  expect(cache.get("a")).toBe("1"); // kept
  expect(cache.get("c")).toBe("3"); // kept
  expect(cache.get("d")).toBe("4"); // kept
});

test("LRU Cache updates MRU order on set (overwrite)", () => {
  const cache = createLRUCache<string>(3);
  cache.set("a", "1");
  cache.set("b", "2");
  cache.set("c", "3");

  // Set 'a' to a new value (refresh it)
  cache.set("a", "updated-1");

  // Add 'd'. 'b' should be evicted.
  cache.set("d", "4");
  expect(cache.get("b")).toBeUndefined(); // evicted
  expect(cache.get("a")).toBe("updated-1"); // kept
});
