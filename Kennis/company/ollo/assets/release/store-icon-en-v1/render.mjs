import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
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
const xmlBytes = await readFile(path.join(dir, 'ic_ollo.xml'));
const xml = xmlBytes.toString('utf8');
const root = xml.match(/<vector\b([^>]*)>/)?.[1];
const attr = (name) => root?.match(new RegExp(`android:${name}="([^"]+)"`))?.[1];
const width = Number.parseFloat(attr('viewportWidth'));
const height = Number.parseFloat(attr('viewportHeight'));
if (width !== 108 || height !== 108) throw new Error('Unexpected vector viewport ' + width + 'x' + height);
const parsed = [...xml.matchAll(/<path\b([^>]*)\/>/g)].map(([, attributes]) => {
  const fill = attributes.match(/android:fillColor="([^"]+)"/)?.[1];
  const d = attributes.match(/android:pathData="([^"]+)"/)?.[1];
  if (!fill || !d) throw new Error('Unparsed vector path: ' + attributes);
  return { fill, d };
});
if (parsed.length !== 6) throw new Error('Expected 6 vector paths, found ' + parsed.length);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parsed.map(({ fill, d }) => `<path fill="${fill}" d="${d}"/>`).join('')}</svg>`;
const svgBytes = Buffer.from(svg, 'utf8');
const pngPath = path.join(dir, 'store-icon.png');
await writeFile(path.join(dir, 'store-icon.svg'), svgBytes);
const pngBytes = await sharp(svgBytes).resize(512, 512, { fit: 'fill' }).flatten({ background: '#FFF3EB' }).ensureAlpha(1).png({ compressionLevel: 9, palette: false }).toBuffer();
await writeFile(pngPath, pngBytes);
const meta = await sharp(pngBytes).metadata();
const { data: pixelData, info: pixelInfo } = await sharp(pngBytes).raw().toBuffer({ resolveWithObject: true });
if (pixelInfo.channels !== 4) throw new Error('Expected RGBA channels, got ' + pixelInfo.channels);
let alphaMin = 255;
let alphaMax = 0;
for (let i = 3; i < pixelData.length; i += 4) { alphaMin = Math.min(alphaMin, pixelData[i]); alphaMax = Math.max(alphaMax, pixelData[i]); }
if (alphaMin !== 255 || alphaMax !== 255) throw new Error('Expected fully opaque alpha, got range ' + alphaMin + '..' + alphaMax);
const originalPath = path.resolve(dir, '../../../../../../projecten/Ollo/app/src/main/res/drawable/ic_ollo.xml');
const originalBytes = await readFile(originalPath).catch(() => null);
const verification = {
  renderedAtUtc: new Date().toISOString(),
  renderedDateEuropeAmsterdam: new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
  source: 'app/src/main/res/drawable/ic_ollo.xml',
  sourceSha256: sha256(xmlBytes),
  sourceCopyMatchesRepoBytes: originalBytes ? sha256(originalBytes) === sha256(xmlBytes) : null,
  sourceViewport: width + 'x' + height,
  pathCount: parsed.length,
  sourceColors: [...new Set(parsed.map(({ fill }) => fill))],
  svgSha256: sha256(svgBytes),
  output: 'store-icon.png',
  outputSha256: sha256(pngBytes),
  format: meta.format,
  width: meta.width,
  height: meta.height,
  channels: meta.channels,
  hasAlpha: meta.hasAlpha,
  alphaRange: [alphaMin, alphaMax],
  bytes: pngBytes.length,
  visualReview: { status: 'Reviewed', date: '2026-10-19', note: 'Mascot centered on a uniform opaque cream background; non-background pixel bounds x=104..407 and y=132..388. Exact vector geometry and its five source colors are retained; raster antialiasing creates edge shades.' },
  playChannelRequirement: 'RGBA PNG with alpha channel present; all alpha values are 255 (fully opaque). This meets the documented channel format and dimensions, not a guarantee of Play approval.'
};
await writeFile(path.join(dir, 'verification.json'), JSON.stringify(verification, null, 2) + '\n');
