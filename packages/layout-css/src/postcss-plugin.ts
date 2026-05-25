import type { PluginCreator } from "postcss";
import { type GeneratorConfig, generateLayoutCSS } from "./generator.js";

export const layoutPostcssPlugin: PluginCreator<GeneratorConfig> = (opts = {}) => ({
  postcssPlugin: "postcss-ly-sys-layout",
  AtRule(atRule) {
    if (atRule.name === "ly-sys-layout") {
      const css = generateLayoutCSS(opts);
      atRule.replaceWith(css);
    }
  },
});

layoutPostcssPlugin.postcss = true;

export default layoutPostcssPlugin;
