import { expect, test, vi } from "vitest";
import { createLayoutService } from "../layout-service.js";
import type { LayoutServiceConfig } from "../types.js";

const createTestConfig = (overrides?: Partial<LayoutServiceConfig>): LayoutServiceConfig => ({
  engine: { config: { libPrefix: "ly" } },
  ...overrides,
});

test("layout-service registers and deduplicates candidates for a remote", () => {
  const service = createLayoutService(createTestConfig());

  service.registerCandidates(
    { candidates: [{ utility: "flex-col" }, { utility: "gap-4", breakpoint: "md" }] },
    "remoteA",
  );

  // Register again with overlap
  service.registerCandidates(
    { candidates: [{ utility: "flex-col" }, { utility: "gap-8" }] },
    "remoteA",
  );

  // Verify via requestDeferredCSS that state is maintained
  // (no direct getter, so we test behavior)
  service.registerCandidates({ candidates: [], rawCSS: { deferable: ".a{}" } }, "remoteA");

  const injector = vi.fn();
  const service2 = createLayoutService(createTestConfig({ deferredInjector: injector }));
  service2.registerCandidates(
    { candidates: [{ utility: "flex-col" }], rawCSS: { deferable: ".test{}" } },
    "remoteB",
  );
  service2.requestDeferredCSS("remoteB");
  expect(injector).toHaveBeenCalledWith(".test{}", "remoteB");
});

test("layout-service requestDeferredCSS is idempotent", () => {
  const injector = vi.fn();
  const service = createLayoutService(createTestConfig({ deferredInjector: injector }));

  service.registerCandidates({ candidates: [], rawCSS: { deferable: ".hover{}" } }, "remoteA");

  service.requestDeferredCSS("remoteA");
  service.requestDeferredCSS("remoteA"); // Should be no-op
  service.requestDeferredCSS("remoteA"); // Should be no-op

  expect(injector).toHaveBeenCalledTimes(1);
});

test("layout-service requestDeferredCSS is no-op for unknown remote", () => {
  const injector = vi.fn();
  const service = createLayoutService(createTestConfig({ deferredInjector: injector }));

  service.requestDeferredCSS("unknown");
  expect(injector).not.toHaveBeenCalled();
});

test("layout-service requestDeferredCSS is no-op when no deferable CSS", () => {
  const injector = vi.fn();
  const service = createLayoutService(createTestConfig({ deferredInjector: injector }));

  service.registerCandidates(
    { candidates: [{ utility: "gap-4" }], rawCSS: { critical: ".crit{}" } },
    "remoteA",
  );

  service.requestDeferredCSS("remoteA");
  expect(injector).not.toHaveBeenCalled();
});

test("layout-service merges rawCSS across multiple registrations", () => {
  const injector = vi.fn();
  const service = createLayoutService(createTestConfig({ deferredInjector: injector }));

  service.registerCandidates({ candidates: [], rawCSS: { deferable: ".a{}" } }, "remoteA");
  service.registerCandidates({ candidates: [], rawCSS: { deferable: ".b{}" } }, "remoteA");

  service.requestDeferredCSS("remoteA");
  expect(injector).toHaveBeenCalledWith(".a{}\n.b{}", "remoteA");
});

test("layout-service exposes the engine reference", () => {
  const engine = { config: { libPrefix: "ly" } };
  const service = createLayoutService({ engine });

  expect(service.engine).toBe(engine);
});

test("layout-service isolates candidates between remotes", () => {
  const injector = vi.fn();
  const service = createLayoutService(createTestConfig({ deferredInjector: injector }));

  service.registerCandidates(
    { candidates: [{ utility: "flex-col" }], rawCSS: { deferable: ".remote-a{}" } },
    "remoteA",
  );
  service.registerCandidates(
    { candidates: [{ utility: "flex-row" }], rawCSS: { deferable: ".remote-b{}" } },
    "remoteB",
  );

  service.requestDeferredCSS("remoteA");
  expect(injector).toHaveBeenCalledWith(".remote-a{}", "remoteA");

  service.requestDeferredCSS("remoteB");
  expect(injector).toHaveBeenCalledWith(".remote-b{}", "remoteB");
});

test("layout-service injects critical CSS synchronously on registration", () => {
  const critInjector = vi.fn();
  const service = createLayoutService(createTestConfig({ criticalInjector: critInjector }));

  // First registration with critical CSS
  service.registerCandidates(
    { candidates: [], rawCSS: { critical: ".crit-initial{}" } },
    "remoteA",
  );
  expect(critInjector).toHaveBeenCalledTimes(1);
  expect(critInjector).toHaveBeenLastCalledWith(".crit-initial{}", "remoteA");

  // Subsequent registration adding more critical CSS
  service.registerCandidates({ candidates: [], rawCSS: { critical: ".crit-more{}" } }, "remoteA");
  expect(critInjector).toHaveBeenCalledTimes(2);
  expect(critInjector).toHaveBeenLastCalledWith(".crit-initial{}\n.crit-more{}", "remoteA");

  // Subsequent registration with no new critical CSS (should be no-op for injector)
  service.registerCandidates({ candidates: [] }, "remoteA");
  expect(critInjector).toHaveBeenCalledTimes(2); // Still 2
});
