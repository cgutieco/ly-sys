import { createLayoutEngine } from "@ly-sys/layout-engine";
import { CandidateMode, createCandidateCollector } from "@ly-sys/layout-protocol";
import { LayoutProvider } from "@ly-sys/layout-react";
import { render } from "@testing-library/react";
import { createElement, createRef } from "react";
import { expect, test } from "vitest";
import { Center, Container, Flex, Grid, GridItem, HStack, Spacer, VStack } from "../index.js";

const engine = createLayoutEngine({
  libPrefix: "pcf",
  appPrefix: "app",
  breakpoints: ["base", "md"] as const,
  candidateMode: CandidateMode.Collect,
  propRules: {
    direction: { scale: ["row", "column", "row-reverse", "column-reverse"] },
    gap: { scale: [1, 2, 4, 8] },
    columns: { allowArbitrary: true },
    minChildWidth: { allowArbitrary: true },
    ratio: { allowArbitrary: true },
    maxWidth: { allowArbitrary: true },
  },
});

test("Spacer renders and emits flex-1", () => {
  const { container } = render(
    createElement(
      LayoutProvider,
      { engine },
      createElement(Spacer, { className: "custom-spacer" }),
    ),
  );
  const spacer = container.firstChild as HTMLElement;
  expect(spacer.className).toContain("pcf-flex-1");
  expect(spacer.className).toContain("custom-spacer");
});

test("Flex renders responsive layout properties", () => {
  const { container } = render(
    createElement(
      LayoutProvider,
      { engine },
      createElement(Flex, {
        direction: { base: "row", md: "column" } as any,
        gap: 4,
        className: "user-class",
      }),
    ),
  );
  const element = container.firstChild as HTMLElement;
  expect(element.className).toContain("pcf-flex");
  expect(element.className).toContain("pcf-flex-row");
  expect(element.className).toContain("md:pcf-flex-col");
  expect(element.className).toContain("pcf-gap-4");
  expect(element.className).toContain("user-class");
});

test("HStack and VStack enforce correct directions", () => {
  const { container: containerH } = render(
    createElement(LayoutProvider, { engine }, createElement(HStack, { gap: 2 })),
  );
  expect((containerH.firstChild as HTMLElement).className).toContain("pcf-flex-row");

  const { container: containerV } = render(
    createElement(LayoutProvider, { engine }, createElement(VStack, { gap: 2 })),
  );
  expect((containerV.firstChild as HTMLElement).className).toContain("pcf-flex-col");
});

test("Center aligns content in both directions", () => {
  const { container } = render(
    createElement(LayoutProvider, { engine }, createElement(Center, { inline: "inline-flex" })),
  );
  const element = container.firstChild as HTMLElement;
  expect(element.className).toContain("pcf-inline-flex");
  expect(element.className).toContain("pcf-items-center");
  expect(element.className).toContain("pcf-justify-center");
});

test("Grid columns and minChildWidth exclusion", () => {
  expect(() => {
    render(
      createElement(
        LayoutProvider,
        { engine },
        createElement(Grid, { columns: 3, minChildWidth: "200px" }),
      ),
    );
  }).toThrow('[ly-sys/layout] "columns" and "minChildWidth" are mutually exclusive in Grid.');
});

test("Grid minChildWidth registers raw CSS in collector", () => {
  const collector = createCandidateCollector();
  render(
    createElement(
      LayoutProvider,
      { engine, collector },
      createElement(Grid, {
        minChildWidth: { base: "200px", md: "300px" } as any,
      }),
    ),
  );
  const batch = collector.flush();

  expect(batch.candidates).toEqual([
    { utility: "grid-cols-[200px]", breakpoint: undefined },
    { utility: "grid-cols-[300px]", breakpoint: "md" },
  ]);

  expect(batch.rawCSS?.critical).toContain(
    ".pcf-grid-cols-\\[200px\\] { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }",
  );
  expect(batch.rawCSS?.critical).toContain(
    "@media (min-width: 768px) { .md\\:pcf-grid-cols-\\[300px\\] { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); } }",
  );
});

test("GridItem renders coordinates", () => {
  const { container } = render(
    createElement(LayoutProvider, { engine }, createElement(GridItem, { colSpan: 2, rowStart: 1 })),
  );
  const element = container.firstChild as HTMLElement;
  expect(element.className).toContain("pcf-col-span-2");
  expect(element.className).toContain("pcf-row-start-1");
});

test("Container handles centering and maxWidth", () => {
  const { container: c1 } = render(
    createElement(LayoutProvider, { engine }, createElement(Container, { maxWidth: "lg" })),
  );
  expect((c1.firstChild as HTMLElement).className).toContain("pcf-max-w-lg");
  expect((c1.firstChild as HTMLElement).className).toContain("pcf-mx-auto");

  const { container: c2 } = render(
    createElement(
      LayoutProvider,
      { engine },
      createElement(Container, { maxWidth: "lg", centerContent: "none" }),
    ),
  );
  expect((c2.firstChild as HTMLElement).className).toContain("pcf-max-w-lg");
  expect((c2.firstChild as HTMLElement).className).not.toContain("pcf-mx-auto");
});

test("polymorphic asChild merges classes and ref forwarding", () => {
  const ref = createRef<HTMLButtonElement>();
  let clicked = false;
  const { container } = render(
    createElement(
      LayoutProvider,
      { engine },
      createElement(
        Flex,
        { asChild: true, direction: "row", ref },
        createElement(
          "button",
          {
            onClick: () => {
              clicked = true;
            },
            className: "my-btn",
          },
          "Click me",
        ),
      ),
    ),
  );
  const button = container.firstChild as HTMLButtonElement;
  expect(button.tagName).toBe("BUTTON");
  expect(button.className).toContain("pcf-flex");
  expect(button.className).toContain("pcf-flex-row");
  expect(button.className).toContain("my-btn");

  button.click();
  expect(clicked).toBe(true);
  expect(ref.current).toBe(button);
});

test("resolver handles flex shorthand without colliding with direction", () => {
  const { container } = render(
    createElement(
      LayoutProvider,
      { engine },
      createElement(Flex, {
        direction: "column",
        className: "app-flex-1",
      }),
    ),
  );
  const element = container.firstChild as HTMLElement;
  expect(element.className).toContain("pcf-flex-col");
  expect(element.className).toContain("app-flex-1");
});
