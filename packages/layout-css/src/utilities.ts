/**
 * Declarative dictionary of layout utilities for @ly-sys/layout.
 * This represents the single source of truth for classes generated
 * by the layout engine and their equivalent CSS styles.
 */
export const UTILITIES: Record<string, string> = {
  // Display
  flex: "display: flex;",
  "inline-flex": "display: inline-flex;",
  grid: "display: grid;",

  // Flex Direction
  "flex-row": "flex-direction: row;",
  "flex-col": "flex-direction: column;",
  "flex-row-reverse": "flex-direction: row-reverse;",
  "flex-col-reverse": "flex-direction: column-reverse;",

  // Flex Wrap
  "flex-wrap": "flex-wrap: wrap;",
  "flex-nowrap": "flex-wrap: nowrap;",
  "flex-wrap-reverse": "flex-wrap: wrap-reverse;",

  // Grow / Shrink
  grow: "flex-grow: 1;",
  "grow-0": "flex-grow: 0;",
  shrink: "flex-shrink: 1;",
  "shrink-0": "flex-shrink: 0;",

  // Flex Shortcuts
  "flex-1": "flex: 1 1 0%;",
  "flex-auto": "flex: 1 1 auto;",
  "flex-initial": "flex: 0 1 auto;",
  "flex-none": "flex: none;",

  // Alignment
  "items-start": "align-items: flex-start;",
  "items-center": "align-items: center;",
  "items-end": "align-items: flex-end;",
  "items-stretch": "align-items: stretch;",
  "items-baseline": "align-items: baseline;",

  // Justify
  "justify-start": "justify-content: flex-start;",
  "justify-center": "justify-content: center;",
  "justify-end": "justify-content: flex-end;",
  "justify-between": "justify-content: space-between;",
  "justify-around": "justify-content: space-around;",
  "justify-evenly": "justify-content: space-evenly;",

  // Margin Horizontal
  "mx-auto": "margin-left: auto; margin-right: auto;",

  // Aspect Ratio
  "aspect-auto": "aspect-ratio: auto;",
  "aspect-square": "aspect-ratio: 1 / 1;",
  "aspect-video": "aspect-ratio: 16 / 9;",

  // Basis
  "basis-auto": "flex-basis: auto;",
  "basis-full": "flex-basis: 100%;",
  "basis-1/2": "flex-basis: 50%;",
  "basis-1/3": "flex-basis: 33.333333%;",
  "basis-2/3": "flex-basis: 66.666667%;",
  "basis-1/4": "flex-basis: 25%;",
  "basis-3/4": "flex-basis: 75%;",
};

// Dynamically generate utilities with scales (gaps, spans, etc.)

// Gaps (1-12)
for (let i = 1; i <= 12; i++) {
  UTILITIES[`gap-${i}`] = `gap: var(--ly-sys-gap-${i});`;
  UTILITIES[`gap-x-${i}`] = `column-gap: var(--ly-sys-gap-${i});`;
  UTILITIES[`gap-y-${i}`] = `row-gap: var(--ly-sys-gap-${i});`;
}

// Grid Columns (1-12)
for (let i = 1; i <= 12; i++) {
  UTILITIES[`grid-cols-${i}`] = `grid-template-columns: repeat(${i}, minmax(0, 1fr));`;
}

// Grid Spans (1-12)
for (let i = 1; i <= 12; i++) {
  UTILITIES[`col-span-${i}`] = `grid-column: span ${i} / span ${i};`;
  UTILITIES[`row-span-${i}`] = `grid-row: span ${i} / span ${i};`;
}
UTILITIES["col-span-full"] = "grid-column: 1 / -1;";
UTILITIES["row-span-full"] = "grid-row: 1 / -1;";

// Grid Starts / Ends / Starts Auto / Ends Auto (1-13)
for (let i = 1; i <= 13; i++) {
  UTILITIES[`col-start-${i}`] = `grid-column-start: ${i};`;
  UTILITIES[`col-end-${i}`] = `grid-column-end: ${i};`;
  UTILITIES[`row-start-${i}`] = `grid-row-start: ${i};`;
  UTILITIES[`row-end-${i}`] = `grid-row-end: ${i};`;
}
UTILITIES["col-start-auto"] = "grid-column-start: auto;";
UTILITIES["col-end-auto"] = "grid-column-end: auto;";
UTILITIES["row-start-auto"] = "grid-row-start: auto;";
UTILITIES["row-end-auto"] = "grid-row-end: auto;";

// Max Widths
const maxWidthKeys = [
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
for (const key of maxWidthKeys) {
  UTILITIES[`max-w-${key}`] = `max-width: var(--ly-sys-max-w-${key});`;
}

// Basis standard values matching spacings
for (let i = 1; i <= 12; i++) {
  UTILITIES[`basis-${i}`] = `flex-basis: var(--ly-sys-gap-${i});`;
}

// Paddings (1-12)
for (let i = 1; i <= 12; i++) {
  UTILITIES[`p-${i}`] = `padding: var(--ly-sys-padding-${i});`;
  UTILITIES[`px-${i}`] =
    `padding-left: var(--ly-sys-padding-${i}); padding-right: var(--ly-sys-padding-${i});`;
  UTILITIES[`py-${i}`] =
    `padding-top: var(--ly-sys-padding-${i}); padding-bottom: var(--ly-sys-padding-${i});`;
  UTILITIES[`pt-${i}`] = `padding-top: var(--ly-sys-padding-${i});`;
  UTILITIES[`pb-${i}`] = `padding-bottom: var(--ly-sys-padding-${i});`;
  UTILITIES[`pl-${i}`] = `padding-left: var(--ly-sys-padding-${i});`;
  UTILITIES[`pr-${i}`] = `padding-right: var(--ly-sys-padding-${i});`;
}

// Margins (1-12)
for (let i = 1; i <= 12; i++) {
  UTILITIES[`m-${i}`] = `margin: var(--ly-sys-margin-${i});`;
  UTILITIES[`mx-${i}`] =
    `margin-left: var(--ly-sys-margin-${i}); margin-right: var(--ly-sys-margin-${i});`;
  UTILITIES[`my-${i}`] =
    `margin-top: var(--ly-sys-margin-${i}); margin-bottom: var(--ly-sys-margin-${i});`;
  UTILITIES[`mt-${i}`] = `margin-top: var(--ly-sys-margin-${i});`;
  UTILITIES[`mb-${i}`] = `margin-bottom: var(--ly-sys-margin-${i});`;
  UTILITIES[`ml-${i}`] = `margin-left: var(--ly-sys-margin-${i});`;
  UTILITIES[`mr-${i}`] = `margin-right: var(--ly-sys-margin-${i});`;
}
