import { expect, test } from "vitest";
import { createLayoutEngine } from "../index.js";

test("engine smoke test", () => {
  const engine = createLayoutEngine({
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base", "md"],
  });
  expect(engine.prefix("flex")).toBe("pcf-flex");
});
