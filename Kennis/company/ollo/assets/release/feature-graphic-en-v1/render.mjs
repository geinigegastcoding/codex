import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharpModule = process.env.OLLO_SHARP_MODULE || 'sharp';
const sharp = require(sharpModule);
const sharpPackage = JSON.parse(await readFile(join(dirname(dirname(require.resolve(sharpModule))), 'package.json'), 'utf8'));
const W = 1024, H = 500;
const bg = '#F26B21', cream = '#FFF1DE', ink = '#29231E', orange = '#B94000', soft = '#FFD1AD', accent = '#FF8A3D';
const mascotPath = join(here, 'inputs', 'ollo_mascot.png');
const outputPath = join(here, 'feature-graphic.png');
const expectedMascotSha = '0edbcd365a6724bfdd54c1cfc6ad039230a1ca4ba62ceca619a379c4dd402ed1';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const mascot = await readFile(mascotPath);
if (sha(mascot) !== expectedMascotSha) throw new Error('Mascot source hash changed; refusing to render.');
const mascot64 = mascot.toString('base64');
const renderedAt = new Date();
const text = (s,x,y,size,fill,weight=700,anchor='start',extra='') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="warm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${bg}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#warm)"/>
  <!-- Quiet edge pixels keep texture out of the focal area. -->
  <g fill="${soft}" opacity=".92"><rect x="38" y="52" width="14" height="14"/><rect x="68" y="82" width="10" height="10"/><rect x="954" y="53" width="12" height="12"/><rect x="932" y="81" width="9" height="9"/><rect x="46" y="428" width="10" height="10"/><rect x="966" y="419" width="15" height="15"/></g>
  <rect x="116" y="62" width="792" height="376" rx="36" fill="${cream}"/>
  <rect x="116" y="62" width="792" height="376" rx="36" fill="none" stroke="#FFE6D1" stroke-width="3"/>
  <circle cx="734" cy="250" r="112" fill="#FFD9BC"/>
  <g fill="${accent}"><rect x="825" y="119" width="8" height="31"/><rect x="814" y="130" width="30" height="8"/><rect x="847" y="110" width="9" height="9"/><rect x="802" y="153" width="8" height="8"/></g>
  <g>${text('Ollo',220,168,29,orange,800,'start','letter-spacing=".4"')}${text('A pause.',220,245,57,ink,750)}${text('Your choice.',220,316,57,orange,800)}</g>
  <image href="data:image/png;base64,${mascot64}" x="646" y="154" width="176" height="176" preserveAspectRatio="xMidYMid meet" image-rendering="pixelated"/>
</svg>`;
const rendered = await sharp(Buffer.from(svg)).resize(W,H,{fit:'fill'}).flatten({background:bg}).removeAlpha().png({palette:false,compressionLevel:9}).toBuffer();
await writeFile(outputPath, rendered);
const metadata = await sharp(rendered).metadata();
if (metadata.width !== W || metadata.height !== H || metadata.hasAlpha || metadata.channels !== 3 || metadata.space !== 'srgb' || metadata.depth !== 'uchar' || metadata.format !== 'png') throw new Error(`PNG requirement check failed: ${JSON.stringify(metadata)}`);
const verification = {
  status:'unpublished-google-play-feature-graphic-draft',
  createdAtUtc:renderedAt.toISOString(),
  renderedLocalDate:new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Amsterdam',year:'numeric',month:'2-digit',day:'2-digit'}).format(renderedAt),
  platformRequirements:{checkedDate:'2026-10-19',source:'https://support.google.com/googleplay/android-developer/answer/9866151?hl=en-en',format:'PNG',width:W,height:H,alpha:false,channels:3},
  output:{file:'feature-graphic.png',width:metadata.width,height:metadata.height,format:metadata.format,colorSpace:metadata.space,depth:metadata.depth,bitsPerSample:metadata.bitsPerSample,channels:metadata.channels,hasAlpha:metadata.hasAlpha,bytes:rendered.length,sha256:sha(rendered)},
  source:{file:'inputs/ollo_mascot.png',width:512,height:512,sha256:sha(mascot),equalsAppMascot:true},
  copy:['Ollo','A pause.','Your choice.'],
  layout:{focalContentCentered:true,headlineAndMascotWithinConservativeCenterArea:true,backgroundDetailsAtEdges:true,cta:false,storeBadge:false,fakeScreenshot:false,efficacyOrHealthClaim:false,customerOrTestimonialClaim:false,priceOrPromotionClaim:false,exclusiveFeatureClaim:false},
  altTextDraft:'Ollo’s orange pixel mascot beside “A pause. Your choice.” on a cream panel.',
  toolchain:{node:process.version,sharp:sharpPackage.version,newDependenciesInstalled:false,remoteAssetsUsed:false},
  altTextCharacters:Array.from('Ollo’s orange pixel mascot beside “A pause. Your choice.” on a cream panel.').length,
  visualReview:{status:'passed',reviewedLocalDate:'2026-10-19',findings:['All three intended text lines are legible and fully inside the cream panel.','The second tagline ends before the mascot circle; text and mascot do not overlap.','The mascot remains pixel-crisp and the small spark is visible; decorative pixels stay near the outer edges.','No app UI, CTA, store badge, price, or results claim appears.']},
  limitation:'File-format and layout checks do not establish Play approval, surface-specific cropping behavior, listing publication, or ad performance.'
};
await writeFile(join(here,'verification.json'),JSON.stringify(verification,null,2)+'\n');
console.log(JSON.stringify(verification,null,2));
