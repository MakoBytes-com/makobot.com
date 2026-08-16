// Build the hero video on the homepage from real screenshots of the app.
//
// The old hero.mp4 was made on 1 May from the WPF app, which no longer exists —
// the whole product was rebuilt as a single Electron app, so the video showed a
// interface a visitor would never see after downloading. Nothing about that is
// fixable by editing; it needs remaking from the app as it actually is.
//
//   node scripts/build-hero-video.mjs <shots-dir> <out.mp4>
//
// Inputs are the redacted PNGs from prep-shots.mjs. Everything is silent and
// loops, because the page autoplays it muted as a background banner.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const IN = process.argv[2];
const OUT = process.argv[3];

// Order tells the story: who she is, what she did while you were away, the work
// she is watching, what you can give her.
const FRAMES = ['01-chat.png', '02-activity.png', '03-projects.png', '04-connectors.png'];

const HOLD = 4.6; // seconds each frame is readable
const FADE = 0.9; // crossfade between frames
const W = 1920;
const H = 1080;

const files = FRAMES.map((f) => path.join(IN, f)).filter((f) => fs.existsSync(f));
if (files.length < 2) {
  console.error(`Need at least two frames in ${IN}; found ${files.length}.`);
  process.exit(1);
}

// Each still is scaled to COVER the 16:9 frame and centre-cropped. The captures
// are 3862x2110 (1.83:1), slightly wider than 16:9, so this trims a sliver from
// the sides rather than letterboxing — a black bar in a hero banner looks like
// a broken video.
const args = [];
for (const f of files) args.push('-loop', '1', '-t', String(HOLD), '-i', f);

const chains = files.map(
  (_, i) =>
    `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,` +
    `crop=${W}:${H},setsar=1,fps=30,format=yuv420p[v${i}]`
);

// Chain the crossfades: v0 x v1 -> x1, x1 x v2 -> x2, ...
let last = 'v0';
const fades = [];
for (let i = 1; i < files.length; i++) {
  const offset = (HOLD - FADE) * i;
  const label = i === files.length - 1 ? 'out' : `x${i}`;
  fades.push(`[${last}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(2)}[${label}]`);
  last = label;
}

const filter = [...chains, ...fades].join(';');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
execFileSync(
  'ffmpeg',
  [
    '-y',
    ...args,
    '-filter_complex', filter,
    '-map', '[out]',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    // Small enough to autoplay on a phone connection, sharp enough to read the
    // interface. The old hero was 4 MB for the same job.
    '-crf', '26',
    '-preset', 'slow',
    // A keyframe every second so the loop restarts cleanly.
    '-g', '30',
    '-movflags', '+faststart',
    '-an',
    OUT,
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] }
);

const size = fs.statSync(OUT).size;
console.log(`${OUT}\n  ${files.length} frames, ${(HOLD * files.length - FADE * (files.length - 1)).toFixed(1)}s, ${(size / 1048576).toFixed(2)} MB`);
