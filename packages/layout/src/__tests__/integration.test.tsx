/**
 * @vitest-environment jsdom
 */

import { createLRUCache } from "@ly-sys/layout-engine";
import React from "react";
import { renderToString } from "react-dom/server";
import { expect, test, vi } from "vitest";
// Import from the built facade files under packages/layout/src/
import { createLayoutEngine } from "../engine.js";
import { Flex, Grid, Spacer } from "../primitives.js";
import {
  CandidateMode,
  createCandidateCollector,
  DEFAULT_CACHE_SIZE,
  DEFAULT_PROTOCOL_VERSION,
  LayerMode,
} from "../protocol.js";
import { LayoutProvider, useLayout } from "../react.js";

// Mock CSS Service configuration interface
interface CSSServiceConfig {
  libPrefix: string;
  layerName: string;
  layerMode: LayerMode;
  protocolVersion: string;
}

// Simulated production CSS Service
const mockCSSService = (batch: any, config: CSSServiceConfig): string => {
  if (config.protocolVersion !== DEFAULT_PROTOCOL_VERSION) {
    throw new Error(`[CSS Service] Protocol version ${config.protocolVersion} is not supported.`);
  }

  const rules: string[] = [];

  for (const cand of batch.candidates) {
    const selector =
      cand.breakpoint && cand.breakpoint !== "base"
        ? `.${cand.breakpoint}\\:${config.libPrefix}-${cand.utility}`
        : `.${config.libPrefix}-${cand.utility}`;

    let declaration = "";
    if (cand.utility === "flex") {
      declaration = "display: flex;";
    } else if (cand.utility === "flex-col") {
      declaration = "flex-direction: column;";
    } else if (cand.utility === "grid-cols-12") {
      declaration = "grid-template-columns: repeat(12, minmax(0, 1fr));";
    } else if (cand.utility === "flex-1") {
      declaration = "flex: 1 1 0%;";
    } else if (cand.utility.startsWith("gap-")) {
      const val = cand.utility.split("-")[1];
      declaration = `gap: var(--${config.libPrefix}-gap-${val});`;
    }

    if (declaration) {
      const rule = `${selector} { ${declaration} }`;
      if (cand.breakpoint && cand.breakpoint !== "base") {
        const mediaQuery = cand.breakpoint === "md" ? "(min-width: 768px)" : "(min-width: 1024px)";
        rules.push(`@media ${mediaQuery} { ${rule} }`);
      } else {
        rules.push(rule);
      }
    }
  }

  if (batch.rawCSS?.critical) {
    rules.push(batch.rawCSS.critical);
  }

  const cssContent = rules.join("\n");

  if (config.layerMode === LayerMode.Full) {
    return `@layer global, ${config.layerName}, components, utils;\n@layer ${config.layerName} {\n${cssContent}\n}`;
  } else {
    return `@layer ${config.layerName} {\n${cssContent}\n}`;
  }
};

test("7.1 & 7.5 Complete SSR Flow with Candidate Collection and CSS Service deduplication", () => {
  const engine = createLayoutEngine({
    libPrefix: "ly-sys",
    appPrefix: "app",
    breakpoints: ["base", "md"] as const,
    candidateMode: CandidateMode.Collect,
    propRules: {
      direction: { scale: ["row", "column"] },
      gap: { scale: [1, 2, 4, 8] },
    },
  });

  const collector = createCandidateCollector();

  // Render a React Layout tree to String (SSR simulation)
  const html = renderToString(
    React.createElement(
      LayoutProvider,
      { engine, collector },
      React.createElement(
        Flex,
        { direction: "column", gap: 4 },
        React.createElement(Spacer),
        React.createElement(Grid, { gap: 2, columns: 12 }),
      ),
    ),
  );

  // Assert HTML generated successfully and contains prefix classes
  expect(html).toContain("ly-sys-flex");
  expect(html).toContain("ly-sys-flex-col");
  expect(html).toContain("ly-sys-gap-4");
  expect(html).toContain("ly-sys-flex-1");
  expect(html).toContain("ly-sys-grid");

  // Extract candidates collected during render
  const batch = collector.flush();

  // Deduplicate and verify candidate list (only responsive values resolved are collected dynamically)
  expect(batch.candidates).toEqual(
    expect.arrayContaining([
      { utility: "flex-col", breakpoint: undefined },
      { utility: "gap-4", breakpoint: undefined },
      { utility: "grid-cols-12", breakpoint: undefined },
      { utility: "gap-2", breakpoint: undefined },
    ]),
  );

  // Feed candidates to our simulated CSS Service
  const css = mockCSSService(batch, {
    libPrefix: "ly-sys",
    layerName: "layout",
    layerMode: LayerMode.Full,
    protocolVersion: DEFAULT_PROTOCOL_VERSION,
  });

  // Verify the final CSS generated
  expect(css).toContain("@layer global, layout, components, utils;");
  expect(css).toContain(".ly-sys-flex-col { flex-direction: column; }");
  expect(css).toContain(".ly-sys-gap-4 { gap: var(--ly-sys-gap-4); }");
  expect(css).toContain(
    ".ly-sys-grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }",
  );
});

test("7.2 Protocol Version Check: rejects unsupported candidate versions in CSS Service", () => {
  const batch = {
    candidates: [{ utility: "flex", breakpoint: undefined }],
  };

  // Valid protocol version 1.0 should pass
  expect(() => {
    mockCSSService(batch, {
      libPrefix: "ly-sys",
      layerName: "layout",
      layerMode: LayerMode.Full,
      protocolVersion: DEFAULT_PROTOCOL_VERSION,
    });
  }).not.toThrow();

  // Invalid protocol version 2.0 must be rejected
  expect(() => {
    mockCSSService(batch, {
      libPrefix: "ly-sys",
      layerName: "layout",
      layerMode: LayerMode.Full,
      protocolVersion: "2.0",
    });
  }).toThrow(/Protocol version 2.0 is not supported/);
});

test("7.3 Context Loss / React Singleton violation safety safeguards", () => {
  const originalEnv = process.env.NODE_ENV;

  // 1. Simulation of DEVELOPMENT environment
  process.env.NODE_ENV = "development";
  const DevDummy = () => {
    useLayout();
    return null;
  };

  expect(() => {
    renderToString(React.createElement(DevDummy));
  }).toThrow(/useLayout debe usarse dentro de un <LayoutProvider>/);

  // 2. Simulation of PRODUCTION environment
  process.env.NODE_ENV = "production";
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  let fallbackEngine: any;
  const ProdDummy = () => {
    fallbackEngine = useLayout();
    return null;
  };

  expect(() => {
    renderToString(React.createElement(ProdDummy));
  }).not.toThrow();

  // Verify console.error was logged
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining("[ly-sys/layout] useLayout fuera de LayoutProvider."),
  );

  // Verify a safe empty fallback engine is returned and works without crashing
  expect(fallbackEngine).toBeDefined();
  expect(fallbackEngine.engine.resolve("a", "b")).toBe("a b");

  // Clean up
  consoleErrorSpy.mockRestore();
  if (originalEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalEnv;
  }
});

test("7.6 LRU Cache stress and memory capping checks", () => {
  const cache = createLRUCache<string>(DEFAULT_CACHE_SIZE);
  expect(cache.size()).toBe(0);

  const doubleCapacity = DEFAULT_CACHE_SIZE * 2;
  // Stress cache with items exceeding capacity
  for (let i = 0; i < doubleCapacity; i++) {
    cache.set(`key-${i}`, `value-${i}`);
  }

  // Verify the cache size is capped strictly at DEFAULT_CACHE_SIZE and does not leak memory
  expect(cache.size()).toBe(DEFAULT_CACHE_SIZE);

  // Verify LRU eviction rules: oldest entries (like key-0) must be evicted
  expect(cache.get("key-0")).toBeUndefined();
  expect(cache.get("key-100")).toBeUndefined();
  expect(cache.get(`key-${DEFAULT_CACHE_SIZE - 1}`)).toBeUndefined();

  // The last DEFAULT_CACHE_SIZE entries must be retained
  expect(cache.get(`key-${DEFAULT_CACHE_SIZE}`)).toBe(`value-${DEFAULT_CACHE_SIZE}`);
  expect(cache.get(`key-${doubleCapacity - 1}`)).toBe(`value-${doubleCapacity - 1}`);
});

test("7.7 Brownfield Coexistence: layerMode configuration validation", () => {
  const batch = {
    candidates: [{ utility: "flex", breakpoint: undefined }],
  };

  // 1. Single Layer Mode (Brownfield) - only wraps in layout layer, does not declare layers order
  const singleLayerCSS = mockCSSService(batch, {
    libPrefix: "ly-sys",
    layerName: "my-custom-layout",
    layerMode: LayerMode.Single,
    protocolVersion: DEFAULT_PROTOCOL_VERSION,
  });

  expect(singleLayerCSS).not.toContain("@layer global,");
  expect(singleLayerCSS).toContain("@layer my-custom-layout {");

  // 2. Full Layer Mode - declares global layers order
  const fullLayerCSS = mockCSSService(batch, {
    libPrefix: "ly-sys",
    layerName: "my-custom-layout",
    layerMode: LayerMode.Full,
    protocolVersion: DEFAULT_PROTOCOL_VERSION,
  });

  expect(fullLayerCSS).toContain("@layer global, my-custom-layout, components, utils;");
  expect(fullLayerCSS).toContain("@layer my-custom-layout {");
});
