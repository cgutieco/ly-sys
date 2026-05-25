#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { generateLayoutCSS } from "./generator.js";

const args = process.argv.slice(2);
let prefix = "";
let outPath = "layout.css";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--prefix" && args[i + 1]) {
    prefix = args[i + 1];
    i++;
  } else if (args[i] === "--out" && args[i + 1]) {
    outPath = args[i + 1];
    i++;
  }
}

console.log(`Generating layout CSS... Prefix: "${prefix}", Out: "${outPath}"`);
const css = generateLayoutCSS({ prefix });

const absoluteOut = path.resolve(outPath);
const dir = path.dirname(absoluteOut);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(absoluteOut, css);
console.log(`Successfully generated layout CSS at: ${absoluteOut}`);
