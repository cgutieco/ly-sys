import fs from "node:fs";
import path from "node:path";
import { generateLayoutCSS } from "@ly-sys/layout-css";
import { expect, test } from "vitest";

test("generateLayoutCSS output contains expected global design tokens and structure", () => {
  const cssContent = generateLayoutCSS();

  // Verify it starts with comment and wraps global in @layer global
  expect(cssContent).toContain("@layer global {");
  expect(cssContent).toContain(":root {");

  // Verify gap, padding, and margin tokens (1 to 12)
  for (let i = 1; i <= 12; i++) {
    expect(cssContent).toContain(`--ly-sys-gap-${i}:`);
    expect(cssContent).toContain(`--ly-sys-padding-${i}:`);
    expect(cssContent).toContain(`--ly-sys-margin-${i}:`);
  }

  // Verify max-w tokens
  const maxWTokens = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "full",
    "min",
    "max",
    "fit",
  ];
  for (const size of maxWTokens) {
    expect(cssContent).toContain(`--ly-sys-max-w-${size}:`);
  }

  // Validate the nested block structure of @layer global { :root { ... } }
  const cleanContent = cssContent.replace(/\s+/g, " ");
  expect(cleanContent).toMatch(/@layer global\s*\{\s*:root\s*\{/);
  expect(cleanContent).toMatch(/@layer layout\s*\{/);
});

test("pre-compiled layout CSS files exist in dist directory", () => {
  const cssPath = path.resolve(__dirname, "../../dist/styles/layout.css");
  const lyCssPath = path.resolve(__dirname, "../../dist/styles/layout-ly.css");

  expect(fs.existsSync(cssPath)).toBe(true);
  expect(fs.existsSync(lyCssPath)).toBe(true);

  const baseCSS = fs.readFileSync(cssPath, "utf8");
  expect(baseCSS).toContain("display: flex");
  expect(baseCSS).toContain(".ly-sys-flex");
  expect(baseCSS).not.toContain(".ly-flex");

  const lyCSS = fs.readFileSync(lyCssPath, "utf8");
  expect(lyCSS).toContain(".ly-flex");
});
