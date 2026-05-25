import { expect, test } from "vitest";
import { extractPropertyGroup } from "../property-map.js";

test("extractPropertyGroup classifications", () => {
  // Lib prefix
  expect(extractPropertyGroup("pcf-flex-col", "pcf", "app")).toEqual({
    group: "flex-direction",
    source: "lib",
    breakpoint: undefined,
  });

  // App prefix with breakpoint
  expect(extractPropertyGroup("md:app-flex-row", "pcf", "app")).toEqual({
    group: "flex-direction",
    source: "app",
    breakpoint: "md",
  });

  // Neutral utility
  expect(extractPropertyGroup("mt-4", "pcf", "app")).toEqual({
    group: "margin-top",
    source: "neutral",
    breakpoint: undefined,
  });

  // Axes (columns / rows gap)
  expect(extractPropertyGroup("md:pcf-gap-x-4", "pcf", "app")).toEqual({
    group: "column-gap",
    source: "lib",
    breakpoint: "md",
  });
  expect(extractPropertyGroup("lg:pcf-gap-4", "pcf", "app")).toEqual({
    group: "gap",
    source: "lib",
    breakpoint: "lg",
  });

  // Arbitrary values
  expect(extractPropertyGroup("pcf-gap-[24px]", "pcf", "app")).toEqual({
    group: "gap",
    source: "lib",
    breakpoint: undefined,
  });

  // Non-layout classes
  expect(extractPropertyGroup("text-red-500", "pcf", "app")).toBeNull();
});
