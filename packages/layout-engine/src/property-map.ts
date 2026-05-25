import { SourceName } from "@ly-sys/layout-protocol";

export const PROPERTY_MAP: Record<string, string> = {
  // Flex
  "flex-row": "flex-direction",
  "flex-col": "flex-direction",
  "flex-row-reverse": "flex-direction",
  "flex-col-reverse": "flex-direction",
  "flex-wrap": "flex-wrap",
  "flex-nowrap": "flex-wrap",
  "flex-wrap-reverse": "flex-wrap",
  basis: "flex-basis",
  grow: "flex-grow",
  shrink: "flex-shrink",
  flex: "display",
  "inline-flex": "display",

  // Grid
  "grid-cols": "grid-template-columns",
  "col-span": "grid-column",
  "row-span": "grid-row",
  "col-start": "grid-column-start",
  "col-end": "grid-column-end",
  "row-start": "grid-row-start",
  "row-end": "grid-row-end",

  // Gap
  gap: "gap",
  "gap-x": "column-gap",
  "gap-y": "row-gap",

  // Alignment
  "justify-start": "justify-content",
  "justify-center": "justify-content",
  "justify-end": "justify-content",
  "justify-between": "justify-content",
  "justify-around": "justify-content",
  "justify-evenly": "justify-content",
  "items-start": "align-items",
  "items-center": "align-items",
  "items-end": "align-items",
  "items-stretch": "align-items",
  "items-baseline": "align-items",

  // Dimensions
  "max-w": "max-width",
  aspect: "aspect-ratio",

  // Margins
  mx: "margin-horizontal",
  my: "margin-vertical",
  mt: "margin-top",
  mb: "margin-bottom",
  ml: "margin-left",
  mr: "margin-right",
  m: "margin",
  "mx-auto": "margin-horizontal",

  // Paddings
  px: "padding-horizontal",
  py: "padding-vertical",
  pt: "padding-top",
  pb: "padding-bottom",
  pl: "padding-left",
  pr: "padding-right",
  p: "padding",
};

const FLEX_DISPLAY_VALUES = new Set(["flex-1", "flex-auto", "flex-initial", "flex-none"]);

const PREFIX_GROUPS: Array<[string, string]> = [
  ["gap-x", "column-gap"],
  ["gap-y", "row-gap"],
  ["gap", "gap"],
  ["col-span", "grid-column"],
  ["row-span", "grid-row"],
  ["col-start", "grid-column-start"],
  ["col-end", "grid-column-end"],
  ["row-start", "grid-row-start"],
  ["row-end", "grid-row-end"],
  ["items", "align-items"],
  ["justify", "justify-content"],
  ["max-w", "max-width"],
  ["mx", "margin-horizontal"],
  ["my", "margin-vertical"],
  ["mt", "margin-top"],
  ["mb", "margin-bottom"],
  ["ml", "margin-left"],
  ["mr", "margin-right"],
  ["m", "margin"],
  ["px", "padding-horizontal"],
  ["py", "padding-vertical"],
  ["pt", "padding-top"],
  ["pb", "padding-bottom"],
  ["pl", "padding-left"],
  ["pr", "padding-right"],
  ["p", "padding"],
  ["aspect", "aspect-ratio"],
];

const matchesKey = (utility: string, key: string): boolean =>
  utility === key || utility.startsWith(`${key}-`);

const getPropertyGroup = (utility: string): string | null => {
  // 1. Exact match
  const exact = PROPERTY_MAP[utility];
  if (exact) return exact;

  // 2. Strip trailing segments (e.g. gap-x-4 -> gap-x)
  const parts = utility.split("-");
  for (let i = parts.length - 1; i > 0; i--) {
    const sub = parts.slice(0, i).join("-");
    const mapped = PROPERTY_MAP[sub];
    if (mapped) return mapped;
  }

  // 3. Fallback prefix checking
  if (utility.startsWith("flex-")) {
    if (utility.startsWith("flex-wrap") || utility.startsWith("flex-nowrap")) {
      return "flex-wrap";
    }
    if (FLEX_DISPLAY_VALUES.has(utility) || utility.startsWith("flex-[")) {
      return "flex";
    }
    return "flex-direction";
  }

  for (const [key, group] of PREFIX_GROUPS) {
    if (matchesKey(utility, key)) return group;
  }

  return null;
};

export const extractPropertyGroup = (
  className: string,
  libPrefix: string,
  appPrefix: string,
): {
  group: string;
  source: SourceName;
  breakpoint?: string | undefined;
} | null => {
  const trimmed = className.trim();
  if (trimmed === "") return null;

  // Extract breakpoint
  const colonIndex = trimmed.lastIndexOf(":");
  const hasBreakpoint = colonIndex >= 0;
  const breakpoint = hasBreakpoint ? trimmed.slice(0, colonIndex) : undefined;
  const rawClass = hasBreakpoint ? trimmed.slice(colonIndex + 1) : trimmed;

  // Classify source and utility
  let source: SourceName = SourceName.Neutral;
  let utility = rawClass;

  if (libPrefix && rawClass.startsWith(`${libPrefix}-`)) {
    source = SourceName.Lib;
    utility = rawClass.slice(libPrefix.length + 1);
  } else if (appPrefix && rawClass.startsWith(`${appPrefix}-`)) {
    source = SourceName.App;
    utility = rawClass.slice(appPrefix.length + 1);
  }

  const group = getPropertyGroup(utility);
  if (group === null) return null;

  return { group, source, breakpoint };
};
