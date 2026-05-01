// One-off: convert walkthrough PNGs to WebP for hero performance.
// Run: node scripts/convert-walkthrough-to-webp.mjs
import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const dir = path.join("public", "images", "walkthrough");
const files = (await readdir(dir)).filter((f) => f.endsWith(".png")).sort();

let totalIn = 0;
let totalOut = 0;
for (const f of files) {
  const inPath = path.join(dir, f);
  const outPath = path.join(dir, f.replace(/\.png$/, ".webp"));
  const inStat = await stat(inPath);
  await sharp(inPath).webp({ quality: 86 }).toFile(outPath);
  const outStat = await stat(outPath);
  totalIn += inStat.size;
  totalOut += outStat.size;
  console.log(
    `${f}: ${(inStat.size / 1024).toFixed(0)}KB → ${(outStat.size / 1024).toFixed(0)}KB ` +
      `(${Math.round((1 - outStat.size / inStat.size) * 100)}% smaller)`
  );
  await unlink(inPath);
}
console.log(
  `\nTotal: ${(totalIn / 1024).toFixed(0)}KB → ${(totalOut / 1024).toFixed(0)}KB ` +
    `(saved ${((totalIn - totalOut) / 1024).toFixed(0)}KB, ${Math.round((1 - totalOut / totalIn) * 100)}% smaller)`
);
