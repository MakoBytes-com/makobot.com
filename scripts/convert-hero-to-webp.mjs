// One-off: convert public/images/hero.jpg to hero.webp for hero performance.
// Run: node scripts/convert-hero-to-webp.mjs
import sharp from "sharp";
import { stat, unlink } from "node:fs/promises";
import path from "node:path";

const inPath = path.join("public", "images", "hero.jpg");
const outPath = path.join("public", "images", "hero.webp");

const inStat = await stat(inPath);
await sharp(inPath).webp({ quality: 86 }).toFile(outPath);
const outStat = await stat(outPath);

console.log(
  `hero.jpg: ${(inStat.size / 1024).toFixed(0)}KB → hero.webp: ${(outStat.size / 1024).toFixed(0)}KB ` +
    `(${Math.round((1 - outStat.size / inStat.size) * 100)}% smaller)`
);

await unlink(inPath);
console.log("Removed hero.jpg (replaced by hero.webp).");
