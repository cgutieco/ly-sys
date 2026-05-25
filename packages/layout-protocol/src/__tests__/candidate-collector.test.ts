import { expect, test } from "vitest";
import { createCandidateCollector } from "../candidate-collector.js";

test("candidate-collector basic add operations and deduplication", () => {
  const collector = createCandidateCollector();

  collector.add("gap-4");
  collector.add("gap-4"); // Duplicate, should be ignored
  collector.add("gap-4", "md"); // Same utility, different breakpoint (should be added)
  collector.add("flex-col", "md");
  collector.add("flex-col", "md"); // Duplicate, should be ignored

  const batch = collector.flush();
  expect(batch.candidates).toEqual([
    { utility: "gap-4", breakpoint: undefined },
    { utility: "gap-4", breakpoint: "md" },
    { utility: "flex-col", breakpoint: "md" },
  ]);
  expect(batch.rawCSS).toBeUndefined();
});

test("candidate-collector flush resets state (destructive/idempotent)", () => {
  const collector = createCandidateCollector();
  collector.add("gap-4");
  collector.addRawCSS({ critical: ".a{}" });

  const batch1 = collector.flush();
  expect(batch1.candidates).toHaveLength(1);
  expect(batch1.rawCSS?.critical).toBe(".a{}");

  // Second flush must return empty state
  const batch2 = collector.flush();
  expect(batch2.candidates).toHaveLength(0);
  expect(batch2.rawCSS).toBeUndefined();
});

test("candidate-collector addRawCSS merges critical and deferable styles", () => {
  const collector = createCandidateCollector();

  collector.addRawCSS({ critical: ".crit-1{}", deferable: ".def-1{}" });
  collector.addRawCSS({ critical: ".crit-2{}" });
  collector.addRawCSS({ deferable: ".def-2{}" });

  const batch = collector.flush();
  expect(batch.rawCSS?.critical).toBe(".crit-1{}\n.crit-2{}");
  expect(batch.rawCSS?.deferable).toBe(".def-1{}\n.def-2{}");
});
