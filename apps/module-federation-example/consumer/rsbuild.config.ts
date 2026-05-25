import * as fs from "node:fs";
import * as path from "node:path";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import mfConfig from "./module-federation.config";

const configPath = path.resolve(process.cwd(), "./config/client-config.local.json");
const clientConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(mfConfig)],
  source: {
    define: {
      "import.meta.env.remotes": JSON.stringify(clientConfig.remotes),
    },
  },
  server: {
    port: 3000,
  },
  html: {
    title: "SaaS Metrics Dashboard - ly-sys",
    template: "./public/index.html",
  },
});
