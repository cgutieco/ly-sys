import { createLayoutEngine, type LayoutEngine } from "@ly-sys/layout-engine";
import { CandidateMode, createCandidateCollector } from "@ly-sys/layout-protocol";
import { render } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";
import { LayoutProvider } from "../layout-provider.js";
import { useLayout } from "../use-layout.js";

test("LayoutProvider renders children and distributes engine", () => {
  const engine = createLayoutEngine({
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base", "md"] as const,
  });

  const contextEngineRef = { current: null as LayoutEngine<any> | null };
  const ConsumerComponent = () => {
    const { engine: ctxEngine } = useLayout<any>();
    contextEngineRef.current = ctxEngine;
    return createElement("div", null, "hello");
  };

  render(createElement(LayoutProvider, { engine }, createElement(ConsumerComponent)));

  expect(contextEngineRef.current).toBeDefined();
  expect(contextEngineRef.current?.config.libPrefix).toBe("pcf");
});

test("LayoutProvider decorates parseResponsive to collect candidates", () => {
  const engine = createLayoutEngine({
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base", "md"] as const,
    candidateMode: CandidateMode.Collect as const,
    propRules: {
      direction: {
        scale: ["row", "col"],
      },
    },
  });

  const collector = createCandidateCollector();

  const ConsumerComponent = () => {
    const { engine: ctxEngine } = useLayout<any>();
    ctxEngine.parseResponsive("row", "direction", (v) => `flex-${v}`);
    ctxEngine.parseResponsive({ base: "col", md: "row" }, "direction", (v) => `flex-${v}`);
    return createElement("div", null, "hello");
  };

  render(createElement(LayoutProvider, { engine, collector }, createElement(ConsumerComponent)));

  const batch = collector.flush();
  // Emitted values:
  // First call: base: 'row' -> 'pcf-flex-row' -> utility: 'flex-row', breakpoint: undefined
  // Second call: base: 'col' -> 'pcf-flex-col' -> utility: 'flex-col', breakpoint: undefined
  //              md: 'row'   -> 'md:pcf-flex-row' -> utility: 'flex-row', breakpoint: 'md'
  expect(batch.candidates).toEqual([
    { utility: "flex-row", breakpoint: undefined },
    { utility: "flex-col", breakpoint: undefined },
    { utility: "flex-row", breakpoint: "md" },
  ]);
});

test("LayoutProvider SSR rendering collects candidates successfully", () => {
  const engine = createLayoutEngine({
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base", "lg"] as const,
    candidateMode: CandidateMode.Collect as const,
  });

  const collector = createCandidateCollector();

  const ConsumerComponent = () => {
    const { engine: ctxEngine } = useLayout<any>();
    ctxEngine.parseResponsive("col", "direction", (v) => `flex-${v}`);
    return createElement("div", null, "hello");
  };

  const html = renderToString(
    createElement(LayoutProvider, { engine, collector }, createElement(ConsumerComponent)),
  );

  expect(html).toBe("<div>hello</div>");
  const batch = collector.flush();
  expect(batch.candidates).toEqual([{ utility: "flex-col", breakpoint: undefined }]);
});

test("LayoutProvider preserves reference stability for prefix and resolve", () => {
  const engine = createLayoutEngine({
    libPrefix: "pcf",
    appPrefix: "app",
    breakpoints: ["base"] as const,
    candidateMode: CandidateMode.Collect as const,
  });
  const collector = createCandidateCollector();

  const contextEngineRef = { current: null as LayoutEngine<any> | null };
  const ConsumerComponent = () => {
    const { engine: ctxEngine } = useLayout<any>();
    contextEngineRef.current = ctxEngine;
    return createElement("div", null, "hello");
  };

  render(createElement(LayoutProvider, { engine, collector }, createElement(ConsumerComponent)));

  // References of resolve and prefix must remain identical to original engine to keep caches intact
  expect(contextEngineRef.current?.resolve).toBe(engine.resolve);
  expect(contextEngineRef.current?.prefix).toBe(engine.prefix);
  expect(contextEngineRef.current?.parseResponsive).not.toBe(engine.parseResponsive); // parseResponsive is decorated
});
