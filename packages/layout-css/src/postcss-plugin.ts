import type { PluginCreator } from "postcss";
import { type GeneratorConfig, generateLayoutCSS } from "./generator.js";

export const layoutPostcssPlugin: PluginCreator<GeneratorConfig> = (opts = {}) => ({
  postcssPlugin: "postcss-ly-sys-layout",
  Once(root) {
    root.walkAtRules("ly-sys-layout", (atRule) => {
      const css = generateLayoutCSS(opts);
      atRule.replaceWith(css);
    });
  },
});

layoutPostcssPlugin.postcss = true;

export default layoutPostcssPlugin;
