import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateLayoutCSS } from "@ly-sys/layout-css";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist/styles");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Generate base layout.css (no prefix)
console.log("Generating base layout.css...");
const baseCSS = generateLayoutCSS();
fs.writeFileSync(path.join(distDir, "layout.css"), baseCSS);

// 2. Generate layout-ly.css (prefix ly)
console.log("Generating layout-ly.css...");
const lyCSS = generateLayoutCSS({ prefix: "ly" });
fs.writeFileSync(path.join(distDir, "layout-ly.css"), lyCSS);

console.log("CSS Generation completed successfully!");
