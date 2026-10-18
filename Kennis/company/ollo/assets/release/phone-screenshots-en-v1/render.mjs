import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  const modulePath = process.env.OLLO_SHARP_MODULE;
  if (!modulePath) throw new Error('Install sharp in the runtime or set OLLO_SHARP_MODULE to its module entry.', { cause: error });
  sharp = require(path.resolve(modulePath));
}

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const dir = path.dirname(fileURLToPath(import.meta.url));
const rawDir = path.join(dir, 'raw');
const outputDir = path.join(dir, 'framed');
const files = [
  { name: '01-choose-your-apps', title: 'Choose what to pause.', demo: false },
  { name: '02-keep-essentials-close', title: 'Keep essentials close.', demo: false },
  { name: '03-make-room-for-routines', title: 'Make room for routines.', demo: false },
  { name: '04-find-an-offline-idea', title: 'Find an offline idea.', demo: false },
  { name: '05-understand-your-patterns', title: 'Understand your patterns.', demo: true },
  { name: '06-a-calmer-daily-view', title: 'A calmer daily view.', demo: true }
];
const expectedRaw = { width: 1080, height: 1920 };
const expectedFrame = { width: 1080, height: 1920 };
const ui = { width: 936, height: 1664, x: 72, y: 204 };
const background = '#FFF3EB';
const charcoal = '#25231F';
const orange = '#B94000';

function frameSvg(title, demo) {
  const demoTag = demo
    ? `<text x="72" y="172" font-family="Arial, sans-serif" font-size="36" font-weight="700" letter-spacing="0.7" fill="${orange}">FICTIONAL DEMO DATA</text>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="${background}"/><text x="72" y="124" font-family="Arial, sans-serif" font-size="48" font-weight="700" fill="${charcoal}">${title}</text>${demoTag}<path d="M980 62h12v28h-12zM972 70h28v12h-28z" fill="#FF6B1A"/><path d="M980 70h12v12h-12z" fill="${orange}"/><rect x="66" y="198" width="948" height="1676" rx="12" fill="#FFFFFF" stroke="#E5D5C8" stroke-width="2"/></svg>`;
}

function inspectInputAlpha(bytes, meta, filename) {
  if (!meta.hasAlpha) return [255, 255];
  return sharp(bytes).raw().toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
    const alphaIndex = info.channels - 1;
    let min = 255;
    let max = 0;
    for (let i = alphaIndex; i < data.length; i += info.channels) {
      min = Math.min(min, data[i]);
      max = Math.max(max, data[i]);
    }
    if (min !== 255 || max !== 255) throw new Error(`${filename}: transparent input is not allowed (alpha range ${min}..${max}).`);
    return [min, max];
  });
}

const prepared = [];
const errors = [];
for (const item of files) {
  const filename = `${item.name}.png`;
  const inputPath = path.join(rawDir, filename);
  let bytes;
  try {
    bytes = await readFile(inputPath);
  } catch (error) {
    if (error.code === 'ENOENT') errors.push(`${filename}: missing from raw/.`);
    else errors.push(`${filename}: could not read (${error.message}).`);
    continue;
  }
  try {
    const meta = await sharp(bytes).metadata();
    if (meta.width !== expectedRaw.width || meta.height !== expectedRaw.height) {
      throw new Error(`expected ${expectedRaw.width}x${expectedRaw.height}, found ${meta.width}x${meta.height}.`);
    }
    const alphaRange = await inspectInputAlpha(bytes, meta, filename);
    prepared.push({ ...item, filename, bytes, meta, alphaRange });
  } catch (error) {
    errors.push(`${filename}: ${error.message}`);
  }
}
if (errors.length) throw new Error(`Raw screenshot validation failed; no framed outputs were written:\n- ${errors.join('\n- ')}`);

await mkdir(outputDir, { recursive: true });
const verification = [];
for (const item of prepared) {
  const resized = await sharp(item.bytes)
    .resize(ui.width, ui.height, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  const svg = Buffer.from(frameSvg(item.title, item.demo), 'utf8');
  const framed = await sharp(svg)
    .composite([{ input: resized, left: ui.x, top: ui.y }])
    .flatten({ background })
    .removeAlpha()
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  const filename = `${item.name}.png`;
  await writeFile(path.join(outputDir, filename), framed);
  const meta = await sharp(framed).metadata();
  if (meta.width !== expectedFrame.width || meta.height !== expectedFrame.height || meta.channels !== 3 || meta.hasAlpha) {
    throw new Error(`${filename}: output must be opaque RGB 1080x1920; got ${meta.width}x${meta.height}, ${meta.channels} channels, alpha=${meta.hasAlpha}.`);
  }
  verification.push({
    raw: {
      file: `raw/${item.filename}`,
      sha256: sha256(item.bytes),
      width: item.meta.width,
      height: item.meta.height,
      channels: item.meta.channels,
      hasAlpha: item.meta.hasAlpha,
      alphaRange: item.alphaRange
    },
    frame: {
      file: `framed/${filename}`,
      sha256: sha256(framed),
      width: meta.width,
      height: meta.height,
      channels: meta.channels,
      hasAlpha: meta.hasAlpha,
      bytes: framed.length
    },
    title: item.title,
    fictionalDemoDataLabel: item.demo ? 'FICTIONAL DEMO DATA' : null
  });
}

const manifest = {
  renderedAtUtc: new Date().toISOString(),
  renderedDateEuropeAmsterdam: new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
  renderer: 'render.mjs',
  transform: {
    rawInput: '1080x1920 PNG; dimensions validated; any alpha channel must be fully opaque',
    uiResize: '936x1664 at x=72, y=204; uniform scale 0.8666666667; Lanczos3; no crop',
    uiTreatment: 'raw app screenshot retained as one rectangular layer; no retouching, repainting, text overlay, or compositing inside the UI rectangle',
    externalFrame: '1080x1920 opaque RGB; cream background, charcoal exact title, small orange pixel spark; FICTIONAL DEMO DATA label only for captures 05 and 06'
  },
  captures: verification
};
await writeFile(path.join(dir, 'verification.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Rendered and verified ${verification.length} framed screenshots.`);
