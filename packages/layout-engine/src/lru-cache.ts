export const createLRUCache = <V>(
  maxSize: number,
): {
  get: (key: string) => V | undefined;
  set: (key: string, value: V) => void;
  size: () => number;
} => {
  const cache = new Map<string, V>();

  return {
    get(key: string): V | undefined {
      const value = cache.get(key);
      if (value === undefined) return undefined;
      cache.delete(key);
      cache.set(key, value);
      return value;
    },
    set(key: string, value: V): void {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= maxSize) {
        // Evict the least recently used element (the first one in the Map insertion order)
        const oldestKey = cache.keys().next().value;
        if (oldestKey !== undefined) {
          cache.delete(oldestKey);
        }
      }
      cache.set(key, value);
    },
    size(): number {
      return cache.size;
    },
  };
};
