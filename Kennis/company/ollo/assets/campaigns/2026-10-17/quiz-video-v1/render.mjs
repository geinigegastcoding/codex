import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharpModule = process.env.OLLO_SHARP_MODULE || 'C:/Users/Daniël/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp';
const sharp = require(sharpModule);
const ffmpeg = process.env.OLLO_FFMPEG || 'C:/Users/Daniël/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe';
const ffprobe = process.env.OLLO_FFPROBE || 'C:/Users/Daniël/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe';
const W = 1080, H = 1920, FPS = 30, DURATION = 10, FRAMES = FPS * DURATION;
const bg = '#FFF9F1', ink = '#25231F', muted = '#68655F', orange = '#B94000', sparkOrange = '#FF6B1A', pale = '#FFE3D1';
const mascotPath = join(here, 'inputs', 'ollo_mascot.png');
const conceptPath = resolve(here, '..', 'quiz-concept-v1.png');
const videoPath = join(here, 'quiz-opening-v1.mp4');
const posterPath = join(here, 'poster.png');
const qaDir = join(here, 'qa');
const expectedMascotSha = '0edbcd365a6724bfdd54c1cfc6ad039230a1ca4ba62ceca619a379c4dd402ed1';
const expectedConceptSha = '5216eaa27e5a3b14319b465e86a0ac2dd4bdd06c953a21c0db94a0304c10eeac';
const copy = [
  'Een app openen?',
  'OPTIONEEL',
  'Eerst drie vragen.',
  'vóór je een gekozen app opent.',
  'Schaken · Rekenen · Wist je dat?',
  'Drie vragen.',
  'Jij kiest.',
  'Een optionele quiz vóór je',
  'een gekozen app opent.',
  'CONCEPT',
];

const sha = (buffer) => createHash('sha256').update(buffer).digest('hex');
const mascot = await readFile(mascotPath);
const concept = await readFile(conceptPath);
if (sha(mascot) !== expectedMascotSha) throw new Error('Mascot source hash changed; stop before rendering.');
if (sha(concept) !== expectedConceptSha) throw new Error('Quiz illustration source hash changed; stop before rendering.');
const mascot64 = mascot.toString('base64');
const art64 = concept.toString('base64');

const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (v) => { v = clamp(v); return v * v * (3 - 2 * v); };
const fade = (t, start, end, duration = 0.24) => smooth((t - start) / duration) * (1 - smooth((t - (end - duration)) / duration));
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (str, x, y, size, fill, weight = 600, anchor = 'middle', extra = '') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(str)}</text>`;

function pixelSpark(x, y, t, at) {
  const p = Math.max(0, 1 - Math.abs(t - at) / 0.38);
  if (p <= 0) return '';
  const s = 0.55 + 0.5 * smooth(p);
  const a = p * 0.95;
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${a.toFixed(3)}">
    <rect x="-8" y="-30" width="16" height="60" fill="${sparkOrange}"/><rect x="-30" y="-8" width="60" height="16" fill="${sparkOrange}"/>
    <rect x="-4" y="-4" width="8" height="8" fill="${bg}"/><rect x="28" y="-34" width="10" height="10" fill="${orange}"/><rect x="-39" y="24" width="10" height="10" fill="${pale}"/>
  </g>`;
}

function renderSvg(frame) {
  const t = frame / FPS;
  const imageFade = smooth((t - 1.28) / 0.5);
  const mascotFade = 1 - smooth((t - 1.15) / 0.42);
  const bob = Math.sin(t * Math.PI * 2.1) * 5;
  const introA = fade(t, 0.08, 1.62);
  const middleA = fade(t, 1.42, 5.98);
  const topicsA = fade(t, 4.35, 7.22);
  const finalA = fade(t, 6.08, 10.2);
  const zoom = 1 + 0.018 * smooth(t / DURATION);
  const artW = 960 * zoom, artH = (1402 / 1122) * artW;
  const artX = (W - artW) / 2;
  const artY = 138 - (artH - 1199) / 2;
  const mascotSize = 320;
  const mascotY = 490 + bob;
  const badge = `<g opacity="${middleA.toFixed(3)}">
    <rect x="408" y="240" width="264" height="58" rx="29" fill="${orange}"/>
    ${text('OPTIONEEL', 540, 279, 27, '#FFFFFF', 700, 'middle', 'letter-spacing="2"')}
  </g>`;
  const sparks = [pixelSpark(326, 1138, t, 3.25), pixelSpark(568, 1031, t, 4.04), pixelSpark(810, 941, t, 4.82)].join('');
  const staticLabel = text('CONCEPT', 1000, 100, 26, muted, 600, 'end', 'letter-spacing="3"');
  const logo = text('ollo', 80, 103, 50, ink, 800, 'start', 'letter-spacing="-2"');
  const body = `
    <g opacity="${imageFade.toFixed(3)}">
      <image href="data:image/png;base64,${art64}" x="${artX.toFixed(2)}" y="${artY.toFixed(2)}" width="${artW.toFixed(2)}" height="${artH.toFixed(2)}" preserveAspectRatio="none"/>
    </g>
    <g opacity="${mascotFade.toFixed(3)}">
      <image href="data:image/png;base64,${mascot64}" x="380" y="${mascotY.toFixed(2)}" width="${mascotSize}" height="${mascotSize}" preserveAspectRatio="xMidYMid meet" image-rendering="pixelated"/>
    </g>
    ${sparks}
    <g opacity="${introA.toFixed(3)}">${text('Een app openen?', 540, 382, 86, ink, 750)}</g>
    ${badge}
    <g opacity="${middleA.toFixed(3)}">${text('Eerst drie vragen.', 540, 386, 82, ink, 750)}${text('vóór je een gekozen app opent.', 540, 459, 42, muted, 450)}</g>
    <g opacity="${topicsA.toFixed(3)}">${text('Schaken · Rekenen · Wist je dat?', 540, 1515, 39, ink, 650)}</g>
    <g opacity="${finalA.toFixed(3)}">
      ${text('Drie vragen.', 540, 308, 92, ink, 800)}
      ${text('Jij kiest.', 540, 408, 92, orange, 800)}
      ${text('Een optionele quiz vóór je', 540, 492, 39, muted, 450)}
      ${text('een gekozen app opent.', 540, 540, 39, muted, 450)}
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="67" y="156" width="12" height="12" fill="${pale}"/><rect x="1000" y="534" width="10" height="10" fill="${sparkOrange}" opacity=".3"/>
    ${body}${logo}${staticLabel}
  </svg>`;
}

const proc = spawn(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${W}x${H}`, '-framerate', String(FPS), '-i', 'pipe:0',
  '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-threads', '2', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', videoPath,
], { stdio: ['pipe', 'ignore', 'pipe'] });
let errorLog = '';
proc.stderr.setEncoding('utf8');
proc.stderr.on('data', (chunk) => { errorLog = (errorLog + chunk).slice(-8000); });
for (let frame = 0; frame < FRAMES; frame++) {
  const pixels = await sharp(Buffer.from(renderSvg(frame))).ensureAlpha().raw().toBuffer();
  if (pixels.length !== W * H * 4) throw new Error(`Bad raw frame size at ${frame}: ${pixels.length}`);
  if (!proc.stdin.write(pixels)) await once(proc.stdin, 'drain');
}
proc.stdin.end();
const exitCode = await new Promise((resolveExit, reject) => {
  proc.once('error', reject);
  proc.once('close', (code) => code === 0 ? resolveExit(code) : reject(new Error(`ffmpeg exit ${code}: ${errorLog}`)));
});

async function extractFrame(seconds, output) {
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(seconds), '-i', videoPath, '-frames:v', '1', '-update', '1', output]);
}
await extractFrame(8.8, posterPath);
const qaFrames = [
  ['first', 0.25], ['optional', 2.45], ['topics', 4.85], ['final', 8.0], ['last', 9.8],
];
for (const [name, seconds] of qaFrames) await extractFrame(seconds, join(qaDir, `${name}.png`));

const probe = JSON.parse(execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,duration:format=duration,size', '-of', 'json', videoPath], { encoding: 'utf8' }));
const videoStream = probe.streams.find((stream) => stream.codec_type === 'video');
if (!videoStream || videoStream.width !== W || videoStream.height !== H || videoStream.codec_name !== 'h264' || videoStream.pix_fmt !== 'yuv420p') throw new Error('Unexpected MP4 video stream metadata.');
if (probe.streams.length !== 1 || Number(probe.format.duration) < 9.95 || Number(probe.format.duration) > 10.05) throw new Error('Unexpected duration or audio stream.');
const posterMeta = await sharp(posterPath).metadata();
if (posterMeta.width !== W || posterMeta.height !== H) throw new Error('Poster dimensions do not match video.');
for (const phrase of copy) if (!renderSvg(Math.round(FPS * 8.8)).includes(phrase)) throw new Error(`Expected end-card copy missing: ${phrase}`);

const output = await readFile(videoPath);
const poster = await readFile(posterPath);
const mascotMeta = await sharp(mascotPath).metadata();
const conceptMeta = await sharp(conceptPath).metadata();
const verification = {
  status: 'unpublished-local-concept',
  generatedAt: new Date().toISOString(),
  render: { width: W, height: H, fps: FPS, expectedFrames: FRAMES, format: 'MP4/H.264', pixelFormat: videoStream.pix_fmt, durationSeconds: Number(probe.format.duration), audioTracks: 0, videoBytes: output.length, poster: { file: 'poster.png', width: posterMeta.width, height: posterMeta.height, sha256: sha(poster) } },
  files: { video: { file: 'quiz-opening-v1.mp4', sha256: sha(output) }, source: { file: 'render.mjs', sha256: sha(await readFile(join(here, 'render.mjs'))) }, brief: { file: 'brief.md', sha256: sha(await readFile(join(here, 'brief.md'))) } },
  sourceAssets: {
    appMascot: { file: 'inputs/ollo_mascot.png', width: mascotMeta.width, height: mascotMeta.height, sha256: sha(mascot), equalsAppSource: sha(mascot) === expectedMascotSha },
    quizIllustration: { file: '../quiz-concept-v1.png', width: conceptMeta.width, height: conceptMeta.height, sha256: sha(concept), equalsExistingConcept: sha(concept) === expectedConceptSha },
  },
  exactDutchCopy: copy,
  claimReview: { optionalQuizOnly: true, chosenAppScopeVisible: true, learningOrScreenTimeOutcomeClaim: false, storeAvailabilityOrDestinationClaim: false, fakeAppUiOrScreenshot: false, audio: false },
  manualVisualReview: 'pending',
  toolchain: { node: process.version, sharp: JSON.parse(await readFile(join(sharpModule, 'package.json'), 'utf8')).version, ffmpeg: execFileSync(ffmpeg, ['-version'], { encoding: 'utf8' }).split('\n')[0], remotionUsed: false, browserOrExtraDependencyInstalled: false },
  hostLimit: 'SVG frames + bundled Sharp + installed FFmpeg; host render and media checks do not establish platform acceptance or ad performance.',
  ffprobe: probe,
};
await writeFile(join(here, 'verification.json'), `${JSON.stringify(verification, null, 2)}\n`);
console.log(JSON.stringify({ status: verification.status, render: verification.render, videoSha256: verification.files.video.sha256, posterSha256: verification.render.poster.sha256, outputBytes: output.length, exitCode }, null, 2));
