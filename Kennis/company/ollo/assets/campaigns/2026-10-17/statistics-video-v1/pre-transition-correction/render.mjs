import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const sharpModule = 'C:/Users/Daniël/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp';
const sharp = require(sharpModule);
const ffmpeg = 'C:/Users/Daniël/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe';
const ffprobe = 'C:/Users/Daniël/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe';
const W = 1080, H = 1920, FPS = 30, DURATION = 12, FRAMES = FPS * DURATION;
const bg = '#FFF9F1', ink = '#25231F', muted = '#68655F', orange = '#B94000', sparkOrange = '#FF6B1A', pale = '#FFE3D1';
const mascotPath = join(here, 'inputs', 'ollo_mascot.png');
const weekPath = 'C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/2026-10-16-insights/confirmed/partial-week.png';
const monthPath = 'C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/2026-10-16-insights/confirmed/partial-month.png';
const videoPath = join(here, 'statistics-context-v1.mp4');
const posterPath = join(here, 'poster.png');
const expected = {
  mascot: '0edbcd365a6724bfdd54c1cfc6ad039230a1ca4ba62ceca619a379c4dd402ed1',
  week: 'a32ee811a504a48a24c536c606f41647273171dc1eaf87ac81a2ea649289b665',
  month: '33299d9829b5d7bb341db8dc86c13e30fa1fe1fc9476b077916209b0ca32cfaa',
};
const sha = (b) => createHash('sha256').update(b).digest('hex');
const [mascot, week, month] = await Promise.all([readFile(mascotPath), readFile(weekPath), readFile(monthPath)]);
for (const [name, data] of [['mascot', mascot], ['week', week], ['month', month]]) if (sha(data) !== expected[name]) throw new Error(`${name} source hash changed; stop before rendering.`);
const mascot64 = mascot.toString('base64'), week64 = week.toString('base64'), month64 = month.toString('base64');
const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (v) => { v = clamp(v); return v * v * (3 - 2 * v); };
const fade = (t, start, end, d = 0.22) => smooth((t - start) / d) * (1 - smooth((t - (end - d)) / d));
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (s, x, y, size, fill, weight = 650, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(s)}</text>`;
function pixelSpark(x, y, t, at) {
  const p = Math.max(0, 1 - Math.abs(t - at) / 0.42);
  if (p <= 0) return '';
  const scale = .6 + .46 * smooth(p);
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${(p * .92).toFixed(3)}"><rect x="-8" y="-28" width="16" height="56" fill="${sparkOrange}"/><rect x="-28" y="-8" width="56" height="16" fill="${sparkOrange}"/><rect x="-4" y="-4" width="8" height="8" fill="${bg}"/><rect x="31" y="-33" width="10" height="10" fill="${orange}"/><rect x="-39" y="22" width="10" height="10" fill="${pale}"/></g>`;
}
function renderSvg(frame) {
  const t = frame / FPS;
  const introA = fade(t, .06, 1.92);
  const weekA = fade(t, 1.76, 6.02, .18);
  const monthA = fade(t, 5.82, 9.20, .18);
  const endA = fade(t, 9.0, 12.08, .24);
  const bob = Math.sin(t * Math.PI * 2.2) * 6;
  const shotW = 702, shotH = 1560, shotX = 189, shotY = 315;
  const badge = (a) => `<g opacity="${a.toFixed(3)}"><rect x="344" y="230" width="392" height="58" rx="29" fill="${orange}"/>${text('FICTIEVE REVIEWDATA', 540, 269, 25, '#FFFFFF', 750, 'middle', 'letter-spacing="1.4"')}</g>`;
  const shell = (src64, a) => `<g opacity="${a.toFixed(3)}"><rect x="${shotX-14}" y="${shotY-14}" width="${shotW+28}" height="${shotH+28}" rx="26" fill="#FFFFFF"/><image href="data:image/png;base64,${src64}" x="${shotX}" y="${shotY}" width="${shotW}" height="${shotH}" preserveAspectRatio="none"/></g>`;
  const sparkle = pixelSpark(810, 680, t, 10.62);
  const logo = text('ollo', 78, 100, 52, ink, 800, 'start', 'letter-spacing="-2"');
  const concept = text('CONCEPT', 1000, 101, 25, muted, 600, 'end', 'letter-spacing="3"');
  const intro = `<g opacity="${introA.toFixed(3)}">${text('Geen meting?', 540, 452, 92, ink, 800)}${text('Dan ook geen nul.', 540, 568, 70, orange, 800)}<image href="data:image/png;base64,${mascot64}" x="375" y="${(820+bob).toFixed(2)}" width="330" height="330" preserveAspectRatio="xMidYMid meet" image-rendering="pixelated"/></g>`;
  const weekTitle = `<g opacity="${weekA.toFixed(3)}">${text('Onbekend ≠ nul.', 540, 154, 64, ink, 800)}</g>`;
  const monthTitle = `<g opacity="${monthA.toFixed(3)}">${text('Ook dekking staat erbij.', 540, 154, 56, ink, 800)}</g>`;
  const outro = `<g opacity="${endA.toFixed(3)}"><image href="data:image/png;base64,${mascot64}" x="380" y="430" width="320" height="320" preserveAspectRatio="xMidYMid meet" image-rendering="pixelated"/>${text('Cijfers met context.', 540, 964, 73, ink, 800)}${text('Inzicht zonder oordeel.', 540, 1062, 59, orange, 800)}</g>`;
  const shadows = `<rect x="65" y="160" width="12" height="12" fill="${pale}"/><rect x="1002" y="517" width="10" height="10" fill="${sparkOrange}" opacity=".35"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${bg}"/>${shadows}${shell(week64,weekA)}${shell(month64,monthA)}${weekTitle}${monthTitle}${badge(Math.max(weekA,monthA))}${intro}${outro}${sparkle}${logo}${concept}</svg>`;
}

const proc = spawn(ffmpeg, ['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','19','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',videoPath], {stdio:['pipe','ignore','pipe']});
let err=''; proc.stderr.setEncoding('utf8'); proc.stderr.on('data',c=>{err=(err+c).slice(-8000)});
for (let frame=0; frame<FRAMES; frame++) {
  const raw=await sharp(Buffer.from(renderSvg(frame))).ensureAlpha().raw().toBuffer();
  if(raw.length!==W*H*4) throw new Error(`Bad raw frame at ${frame}`);
  if(!proc.stdin.write(raw)) await once(proc.stdin,'drain');
}
proc.stdin.end();
await new Promise((resolve,reject)=>{proc.once('error',reject);proc.once('close',code=>code===0?resolve():reject(new Error(`ffmpeg exit ${code}: ${err}`)))});
async function frameAt(seconds, path) { execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-ss',String(seconds),'-i',videoPath,'-frames:v','1','-update','1',path]); }
const qa = [['opening',.65],['week',3.6],['month',7.2],['ending',10.6],['last',11.85]];
for(const [name,sec] of qa) await frameAt(sec,join(here,'qa',`${name}.png`));
await frameAt(10.7,posterPath);
const probe=JSON.parse(execFileSync(ffprobe,['-v','error','-count_frames','-show_entries','stream=codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,duration,nb_read_frames:format=duration,size','-of','json',videoPath],{encoding:'utf8'}));
const stream=probe.streams.find(s=>s.codec_type==='video');
if(!stream||stream.width!==W||stream.height!==H||stream.codec_name!=='h264'||stream.pix_fmt!=='yuv420p'||probe.streams.length!==1||Number(probe.format.duration)<11.95||Number(probe.format.duration)>12.05||Number(stream.nb_read_frames)!==FRAMES) throw new Error('Unexpected output video metadata/frame count.');
const posterMeta=await sharp(posterPath).metadata();
const copy=['Geen meting?','Dan ook geen nul.','Onbekend ≠ nul.','Ook dekking staat erbij.','FICTIEVE REVIEWDATA','Cijfers met context.','Inzicht zonder oordeel.','CONCEPT'];
const svgEnd=renderSvg(Math.round(10.7*FPS));
for(const phrase of ['Cijfers met context.','Inzicht zonder oordeel.','CONCEPT']) if(!svgEnd.includes(phrase)) throw new Error(`Missing end copy ${phrase}`);
const video=await readFile(videoPath), poster=await readFile(posterPath);
const stats=await Promise.all([sharp(mascotPath).metadata(),sharp(weekPath).metadata(),sharp(monthPath).metadata()]);
const manifest={
  status:'unpublished-local-concept', createdAt:new Date().toISOString(),
  render:{width:W,height:H,fps:FPS,expectedFrames:FRAMES,decodedFrames:Number(stream.nb_read_frames),durationSeconds:Number(probe.format.duration),container:'MP4',codec:'H.264',pixelFormat:stream.pix_fmt,audioTracks:0,videoBytes:video.length,poster:{file:'poster.png',width:posterMeta.width,height:posterMeta.height,sha256:sha(poster)}},
  files:{video:{file:'statistics-context-v1.mp4',sha256:sha(video)},source:{file:'render.mjs',sha256:sha(await readFile(join(here,'render.mjs')))},brief:{file:'brief.md',sha256:sha(await readFile(join(here,'brief.md')))}},
  sourceAssets:{mascot:{file:'inputs/ollo_mascot.png',width:stats[0].width,height:stats[0].height,sha256:sha(mascot),equalsAppSource:true},confirmedWeek:{file:weekPath,width:stats[1].width,height:stats[1].height,sha256:sha(week),fictitiousFixture:true,embeddedUnmodified:true},confirmedMonth:{file:monthPath,width:stats[2].width,height:stats[2].height,sha256:sha(month),fictitiousFixture:true,embeddedUnmodified:true}},
  screenshotTreatment:{wholeImageVisible:true,cropped:false,retouched:false,labelsRecreated:false,sourcePixelsResampledOnlyForComposition:true,externalDemoWarning:'FICTIEVE REVIEWDATA remains visible for every frame where a statistics screenshot is shown; original UI also visibly reads Demo · fictief.'},
  storyboard:[{start:0,end:1.9,copy:['Geen meting?','Dan ook geen nul.'],visual:'Mascot with one restrained pixel-spark beat.'},{start:1.9,end:6.0,copy:['Onbekend ≠ nul.','FICTIEVE REVIEWDATA'],visual:'Full confirmed mixed-week screenshot, including unknown dash, measured zero, 6/7 days, and partial-day label.'},{start:6.0,end:9.15,copy:['Ook dekking staat erbij.','FICTIEVE REVIEWDATA'],visual:'Full confirmed 30-day screenshot, including 24/30 available and 3 partial days.'},{start:9.15,end:12,copy:['Cijfers met context.','Inzicht zonder oordeel.'],visual:'Mascot sign-off; no CTA.'}],
  exactDutchCopy:copy, claimReview:{unknownIsNotZeroSupportedByCurrentUi:true,partialMeasurementDisclosed:true,fictionalScreenshotsLabeled:true,efficacyOrHealthClaim:false,exclusiveFeatureClaim:false,privacyClaim:false,downloadStorePriceOrDestinationClaim:false,customerQuote:false},
  manualVisualReview:'pending', toolchain:{node:process.version,sharp:JSON.parse(await readFile(join(sharpModule,'package.json'),'utf8')).version,ffmpeg:execFileSync(ffmpeg,['-version'],{encoding:'utf8'}).split('\n')[0].trim(),remotionUsed:false,browserOrExtraDependencyInstalled:false},hostLimit:'Locally rendered graphic composition using confirmed review captures. Host video QA does not establish app acceptance, user comprehension, campaign performance, or field measurement accuracy.',ffprobe:probe,inspectedFrames:qa.map(([name,timeSeconds])=>({file:`qa/${name}.png`,timeSeconds}))
};
await writeFile(join(here,'verification.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({status:manifest.status,render:manifest.render,videoSha256:manifest.files.video.sha256,posterSha256:manifest.render.poster.sha256,sourceHashes:manifest.sourceAssets},null,2));


