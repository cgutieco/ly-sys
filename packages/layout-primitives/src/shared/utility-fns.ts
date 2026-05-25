export const escapeSelector = (className: string): string =>
  className.replaceAll(/([!#$%&'*+./;<=>?@^`{|}~[\]():,])/g, String.raw`\$1`);

export const formatSize = (value: number | string): string =>
  typeof value === "number" ? `${value}px` : value;

export const BREAKPOINT_MEDIA_QUERIES: Record<string, string> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};
