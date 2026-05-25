import { UTILITIES } from "./utilities.js";

export type GeneratorConfig = {
  prefix?: string;
  breakpoints?: Record<string, string>;
};

const DEFAULT_BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const generateLayoutCSS = (config: GeneratorConfig = {}): string => {
  const prefix = config.prefix === undefined ? "ly-sys" : config.prefix.trim();
  const breakpoints = config.breakpoints || DEFAULT_BREAKPOINTS;
  const pfx = prefix ? `${prefix}-` : "";

  let css = `/* Generado por @ly-sys/layout-css */\n\n`;

  // 1. Tokens de diseño en @layer global
  css += `@layer global {\n  :root {\n`;

  // Gaps / Paddings / Margins
  for (let i = 1; i <= 12; i++) {
    const val = `${i * 4}px`;
    css += `    --ly-sys-gap-${i}: ${val};\n`;
    css += `    --ly-sys-padding-${i}: ${val};\n`;
    css += `    --ly-sys-margin-${i}: ${val};\n`;
  }

  // Max Widths
  const maxW = {
    xs: "320px",
    sm: "384px",
    md: "448px",
    lg: "512px",
    xl: "576px",
    "2xl": "672px",
    "3xl": "768px",
    "4xl": "896px",
    "5xl": "1024px",
    "6xl": "1152px",
    "7xl": "1280px",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
  };
  for (const [k, v] of Object.entries(maxW)) {
    css += `    --ly-sys-max-w-${k}: ${v};\n`;
  }

  css += `  }\n}\n\n`;

  // Helper para indentar las reglas
  const formatRules = (indent: string) => {
    let rules = "";
    for (const [utility, style] of Object.entries(UTILITIES)) {
      const escapedUtility = utility.replaceAll("/", String.raw`\/`);
      rules += `${indent}.${pfx}${escapedUtility} { ${style} }\n`;
    }
    return rules;
  };

  // Helper para rules responsivas
  const formatResponsiveRules = (breakpoint: string, indent: string) => {
    let rules = "";
    // Escapar nombres de clase que empiezan con un número, ej. 2xl -> \32 xl
    const firstChar = breakpoint.charAt(0);
    const escapedBp =
      firstChar >= "0" && firstChar <= "9"
        ? String.raw`\3${firstChar} ${breakpoint.slice(1)}`
        : breakpoint;

    for (const [utility, style] of Object.entries(UTILITIES)) {
      const escapedUtility = utility.replaceAll("/", String.raw`\/`);
      // md\:flex-col, etc.
      rules += `${indent}.${escapedBp}\\:${pfx}${escapedUtility} { ${style} }\n`;
    }
    return rules;
  };

  // 2. Utilidades base en @layer layout
  css += `@layer layout {\n`;
  css += formatRules("  ");
  css += `}\n\n`;

  // 3. Utilidades responsivas
  css += `@layer layout {\n`;
  for (const [bp, width] of Object.entries(breakpoints)) {
    css += `  @media (min-width: ${width}) {\n`;
    css += formatResponsiveRules(bp, "    ");
    css += `  }\n\n`;
  }
  css += `}\n`;

  return css;
};
