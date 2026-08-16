// Turn raw window captures into site-ready art.
//
// Two jobs: redact what is personal, and normalise everything to one size so
// the hero video does not jump between frames.
//
// Redaction is a real blur over the pixels, not a CSS overlay and not a crop —
// the published file itself must not carry his client names or his Windows
// username. The UI structure stays visible, which is the whole point of a
// product screenshot; only the content he would not want on a public page goes.
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';

const SHOTS = process.argv[2];
const OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });

/** Blur a rectangle in place, hard enough that nothing is recoverable. */
async function redact(file, rects, outFile, { width = 1920 } = {}) {
  const img = sharp(file);
  const meta = await img.metadata();
  const layers = [];
  for (const r of rects) {
    // Clamp, so a rect that runs past the edge cannot throw.
    const left = Math.max(0, Math.round(r.x));
    const top = Math.max(0, Math.round(r.y));
    const w = Math.min(meta.width - left, Math.round(r.w));
    const h = Math.min(meta.height - top, Math.round(r.h));
    if (w <= 0 || h <= 0) continue;
    const patch = await sharp(file)
      .extract({ left, top, width: w, height: h })
      .blur(18)
      .toBuffer();
    layers.push({ input: patch, left, top });
  }
  // TWO passes on purpose. sharp runs resize BEFORE composite within one
  // pipeline, so a rectangle measured against the full-size capture would be
  // pasted onto an already-shrunk image and land outside it. Redact at full
  // size, then scale the finished thing.
  const redacted = await sharp(file).composite(layers).png().toBuffer();
  await sharp(redacted)
    .resize({ width, fit: 'inside', withoutEnlargement: false })
    .png()
    .toFile(outFile);
  return { file: path.basename(outFile), redacted: layers.length, from: `${meta.width}x${meta.height}` };
}

const S = (n) => path.join(SHOTS, n);
const O = (n) => path.join(OUT, n);

const jobs = [
  // Clean already — nothing personal on screen.
  { in: '01-chat.png', out: '01-chat.png', rects: [] },
  {
    in: '02-activity.png',
    out: '02-activity.png',
    // One line reads "could not serve on :7777 - EADDRINUSE", left over from my
    // own second instance during testing. True, but it is a stray error in a
    // marketing shot and it is not what this panel normally looks like.
    rects: [{ x: 1130, y: 975, w: 1600, h: 34 }],
  },
  {
    in: '03-projects.png',
    out: '03-projects.png',
    rects: [
      // makobot.com's path carries his Windows username.
      { x: 1140, y: 706, w: 760, h: 34 },
      // Every card below names a real client and its folder on his disk.
      { x: 1128, y: 848, w: 1610, h: 1110 },
    ],
  },
  // The shelf. Nothing on it is his.
  { in: '06-connectors.png', out: '04-connectors.png', rects: [] },
];

for (const j of jobs) {
  if (!fs.existsSync(S(j.in))) {
    console.log(`skip ${j.in} (not captured)`);
    continue;
  }
  const r = await redact(S(j.in), j.rects, O(j.out));
  console.log(`${r.file.padEnd(22)} from ${r.from.padEnd(10)} redactions: ${r.redacted}`);
}
