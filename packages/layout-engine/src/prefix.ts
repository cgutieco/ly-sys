export const createPrefixer =
  (libPrefix: string): ((className: string) => string) =>
  (className: string) => {
    if (!className) return "";
    if (!libPrefix) return className;
    if (className.includes(" ")) {
      return className
        .split(/\s+/)
        .map((c) => (c ? `${libPrefix}-${c}` : ""))
        .filter(Boolean)
        .join(" ");
    }
    return `${libPrefix}-${className}`;
  };
