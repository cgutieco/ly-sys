import { expect, test } from "vitest";
import { createLayoutEngine } from "../create-engine.js";

test("createLayoutEngine returns compliant and immutable config object", () => {
  const engine = createLayoutEngine({
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base", "md"] as const,
  });

  expect(engine.config).toBeDefined();
  expect(engine.parseResponsive).toBeTypeOf("function");
  expect(engine.resolve).toBeTypeOf("function");
  expect(engine.prefix).toBeTypeOf("function");
  expect(engine.createCandidateCollector).toBeTypeOf("function");

  // Verify config is frozen
  expect(Object.isFrozen(engine.config)).toBe(true);
  expect(() => {
    (engine.config as any).libPrefix = "new-prefix";
  }).toThrow();

  // Verify functional integration of CandidateCollector
  const collector = engine.createCandidateCollector();
  collector.add("gap-4", "md");
  collector.add("gap-4", "md"); // duplicate
  collector.addRawCSS({ critical: ".test{}" });

  const batch = collector.flush();
  expect(batch.candidates).toEqual([{ utility: "gap-4", breakpoint: "md" }]);
  expect(batch.rawCSS?.critical).toBe(".test{}");
});

test("createLayoutEngine defaults libPrefix to ly-sys and appPrefix to empty string", () => {
  const engine = createLayoutEngine({
    breakpoints: ["base", "md"] as const,
  });

  expect(engine.config.libPrefix).toBe("ly-sys");
  expect(engine.config.appPrefix).toBe("");
});
