import { render } from "@testing-library/react";
import React from "react";
import { expect, test, vi } from "vitest";
import { useLayout } from "../use-layout.js";

const TestComponent = () => {
  useLayout();
  return React.createElement("div", null, "child");
};

test("useLayout throws in development outside LayoutProvider", () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  // Prevent console.error clutter in test output from React's error boundary
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => {
    render(React.createElement(TestComponent));
  }).toThrow("[ly-sys/layout] useLayout debe usarse dentro de un <LayoutProvider>.");

  errorSpy.mockRestore();
  if (originalEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalEnv;
  }
});

test("useLayout falls back in production outside LayoutProvider", () => {
  const originalEnv = process.env.NODE_ENV;
  // Simulate production
  process.env.NODE_ENV = "production";

  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  let resultEngine: any = null;
  const FallbackComponent = () => {
    const { engine } = useLayout();
    resultEngine = engine;
    return React.createElement("div", null, "child");
  };

  expect(() => {
    render(React.createElement(FallbackComponent));
  }).not.toThrow();

  expect(errorSpy).toHaveBeenCalledWith("[ly-sys/layout] useLayout fuera de LayoutProvider.");
  expect(resultEngine).toBeDefined();
  expect(resultEngine.resolve("pcf-flex-col", "app-flex-row")).toBe("pcf-flex-col app-flex-row");
  expect(resultEngine.prefix("flex")).toBe("flex");
  expect(resultEngine.parseResponsive("row", "direction", (v: any) => `flex-${v}`)).toBe("");

  errorSpy.mockRestore();
  if (originalEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalEnv;
  }
});
