import { expect, test } from "vitest";
import { createPrefixer } from "../prefix.js";

test("prefixer basic operations", () => {
  const prefix = createPrefixer("pcf");
  expect(prefix("flex-col")).toBe("pcf-flex-col");
  expect(prefix("")).toBe("");
});

test("prefixer multiple classes", () => {
  const prefix = createPrefixer("pcf");
  expect(prefix("flex-col gap-4")).toBe("pcf-flex-col pcf-gap-4");
  expect(prefix("  flex-col   gap-4  ")).toBe("pcf-flex-col pcf-gap-4");
});
