import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    engine: "src/engine.ts",
    react: "src/react.ts",
    primitives: "src/primitives.ts",
    protocol: "src/protocol.ts",
    "postcss-plugin": "src/postcss-plugin.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  external: [
    "react",
    "react-dom",
    "postcss",
    "@ly-sys/layout-engine",
    "@ly-sys/layout-protocol",
    "@ly-sys/layout-react",
    "@ly-sys/layout-primitives",
    "@ly-sys/layout-css",
  ],
});
