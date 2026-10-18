// Editable SVG layouts; original ImageGen illustrations are embedded unchanged.
// Run: node compose-cards.mjs <installed-sharp-package-directory>
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const sharp = createRequire(import.meta.url)(process.argv[2] || 'sharp');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const cards = [
  {
    name: 'mini-pauze-card-v1', image: 'mini-pauze-concept-v1.png',
    sourceSha256: 'e89f9c83ff802c9d518f76766abfa0ee7ab497b325665eb1a61b15bd881d50f4',
    headline: ['Even pauze.', 'Jij kiest.'],
    body: ['Een beslismoment voor', 'apps die jij kiest.'],
    footer: 'Geen account. Geen cloudanalyse.',
    alt: 'De oranje pixelmascotte onderbreekt een lint van donkere tegels. Dit is een illustratie, geen appbeeld.',
  },
  {
    name: 'quiz-card-v1', image: 'quiz-concept-v1.png',
    sourceSha256: '5216eaa27e5a3b14319b465e86a0ac2dd4bdd06c953a21c0db94a0304c10eeac',
    headline: ['Drie vragen.', 'Jij kiest.'],
    body: ['Een optionele quiz', 'vóór je een gekozen app opent.'],
    footer: 'Schaken · rekenen · wist-je-dat',
    alt: 'De oranje pixelmascotte bij drie blokken met schaak-, reken- en boekmotieven. Dit is een illustratie, geen appbeeld.',
  },
];

const manifest = {
  status: 'unpublished-local-concepts', width: 1080, height: 1350,
  textMode: 'deterministic SVG, no generated lettering',
  font: 'Segoe UI with sans-serif fallback; not embedded in editable SVG; raster export fixed',
  sourceImages: 'Existing built-in ImageGen outputs, embedded byte-for-byte; no new generation or bitmap edit',
  publicDestination: null, platformAcceptanceClaim: false, appAssetReplaced: false,
  boardCreated: false, boardLimitation: 'Direct Creative Production MCP transport not exposed in this session',
  cards: [],
};
for (const card of cards) {
  const source = await readFile(new URL(card.image, import.meta.url));
  if (sha(source) !== card.sourceSha256) throw new Error(`Source image changed: ${card.image}`);
  const sourceMeta = await sharp(source).metadata();
  if (sourceMeta.width !== 1122 || sourceMeta.height !== 1402) throw new Error('Unexpected source dimensions');
  const text = (value, y, size, fill, weight = 400, extra = '') =>
    `<text x="72" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${escape(value)}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-labelledby="title desc">
<title id="title">${escape(card.headline.join(' '))} — Ollo</title><desc id="desc">${escape(card.alt)}</desc>
<image x="0" y="0" width="1080" height="1350" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${source.toString('base64')}"/>
<g font-family="Segoe UI, sans-serif">
${text('ollo', 112, 56, '#25231F', 800, 'letter-spacing="-2"')}
<text x="1008" y="104" text-anchor="end" font-size="26" font-weight="600" letter-spacing="2" fill="#68655F">CONCEPT</text>
${text(card.headline[0], 236, 104, '#25231F', 800, 'letter-spacing="-3"')}
${text(card.headline[1], 350, 104, '#B94000', 800, 'letter-spacing="-3"')}
${text(card.body[0], 420, 36, '#68655F')}
${text(card.body[1], 466, 36, '#68655F')}
${text(card.footer, 1294, 28, '#25231F', 600)}
</g></svg>`;
  const svgFile = `${card.name}.svg`, pngFile = `${card.name}.png`;
  await writeFile(new URL(svgFile, import.meta.url), svg, 'utf8');
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const outputMeta = await sharp(png).metadata();
  if (outputMeta.width !== 1080 || outputMeta.height !== 1350) throw new Error('Wrong export dimensions');
  await writeFile(new URL(pngFile, import.meta.url), png);
  manifest.cards.push({ ...card, svg: svgFile, png: pngFile, svgSha256: sha(Buffer.from(svg)), pngSha256: sha(png), width: outputMeta.width, height: outputMeta.height });
}
await writeFile(new URL('cards-v1.manifest.json', import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ status: manifest.status, cards: manifest.cards.map(card => ({ file: card.png, sha256: card.pngSha256 })) }));
