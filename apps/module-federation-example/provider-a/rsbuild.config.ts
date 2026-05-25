import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import mfConfig from "./module-federation.config";

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(mfConfig)],
  server: {
    port: 3001,
  },
  html: {
    title: "Provider A Standalone - ly-sys",
    template: "./public/index.html",
  },
});
