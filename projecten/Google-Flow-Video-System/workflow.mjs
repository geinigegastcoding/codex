import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const { values: args, positionals } = parseArgs({ allowPositionals: true, options: {
  source: { type: 'string' }, start: { type: 'string' }, duration: { type: 'string' },
  'character-1': { type: 'string' }, 'character-2': { type: 'string' },
  out: { type: 'string' }, job: { type: 'string' }, video: { type: 'string' }
} });

function run(command, argv, options = {}) {
  const result = spawnSync(command, argv, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, ...options });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr || `${command} failed with status ${result.status}`);
  return result.stdout;
}

const ffmpeg = argv => run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-n', ...argv]);
const probe = file => JSON.parse(run('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]));
const required = key => {
  if (!args[key]) throw new Error(`Missing --${key}`);
  return path.resolve(args[key]);
};

try {
  if (positionals[0] === 'prepare') {
    const source = required('source'), first = required('character-1'), second = required('character-2'), out = required('out');
    for (const input of [source, first, second]) if (!fs.statSync(input).isFile()) throw new Error(`Not a file: ${input}`);
    for (const reference of [first, second]) {
      if (!['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(reference).toLowerCase())) throw new Error('Character references must be PNG, JPEG, or WebP images.');
      const image = probe(reference).streams.find(s => s.codec_type === 'video');
      if (!image?.width || !image?.height) throw new Error(`Unreadable character reference: ${reference}`);
      ffmpeg(['-i', reference, '-frames:v', '1', '-f', 'null', '-']);
    }
    const start = Number(args.start), duration = Number(args.duration);
    if (!Number.isFinite(start) || start < 0 || !Number.isFinite(duration) || duration <= 0 || duration > 30) throw new Error('Provide a nonnegative start and a duration greater than zero and at most 30 seconds.');
    const media = probe(source);
    if (!media.streams.some(s => s.codec_type === 'video')) throw new Error('The source has no video stream.');
    if (start + duration > Number(media.format.duration) + 0.0001) throw new Error('The requested cut extends beyond the source.');
    if (fs.existsSync(out) && fs.readdirSync(out).length) throw new Error('The output folder is not empty; use a new job folder.');
    fs.mkdirSync(out, { recursive: true });
    const file = name => path.join(out, name);
    const characters = [first, second].map((reference, index) => ({
      file: `character-${index + 1}${path.extname(reference).toLowerCase()}`, role: index === 0 ? 'left performer' : 'right performer'
    }));
    fs.copyFileSync(first, file(characters[0].file));
    fs.copyFileSync(second, file(characters[1].file));
    ffmpeg(['-ss', String(start), '-i', source, '-t', String(duration), '-map', '0:v:0', '-map', '0:a:0?',
      '-vf', 'fps=24', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', file('source.mp4')]);
    const hasAudio = media.streams.some(s => s.codec_type === 'audio');
    if (hasAudio) ffmpeg(['-ss', String(start), '-i', source, '-t', String(duration), '-vn', '-c:a', 'pcm_s16le', file('source-audio.wav')]);
    ffmpeg(['-i', file('source.mp4'), '-frames:v', '1', '-update', '1', file('first-frame.png')]);
    ffmpeg(['-ss', String(Math.max(0, duration - 1 / 24)), '-i', file('source.mp4'), '-frames:v', '1', '-update', '1', file('last-frame.png')]);
    ffmpeg(['-i', file('source.mp4'), '-an', '-vf', 'fps=1,scale=640:-1,tile=3x2', '-frames:v', '1', '-update', '1', file('contact-sheet.png')]);
    const prepared = probe(file('source.mp4'));
    if (Math.abs(Number(prepared.format.duration) - duration) > 1 / 24) throw new Error('Prepared duration failed validation.');
    ffmpeg(['-i', file('source.mp4'), '-f', 'null', '-']);
    const job = { state: 'prepared', original: source, start, duration, fps: 24, hasAudio,
      media: prepared, characters,
      reviews: [], flow: { manualGenerate: true, projectUrl: null, spentCredits: 0 } };
    fs.writeFileSync(file('job.json'), JSON.stringify(job, null, 2) + '\n');
    console.log(JSON.stringify({ job: out, state: job.state, duration, frames: prepared.streams.find(s => s.codec_type === 'video').nb_frames }));
  } else if (['finish', 'local'].includes(positionals[0])) {
    const dir = required('job'), jobFile = path.join(dir, 'job.json'), job = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
    const file = name => path.join(dir, name);
    if (fs.existsSync(file('final.mp4'))) throw new Error('final.mp4 already exists; keep it and use a new job for a different take.');
    let video;
    if (positionals[0] === 'local') {
      const tool = path.join(root, 'tools', 'facefusion');
      const python = path.join(root, '.venv', 'Scripts', 'python.exe');
      if (!fs.existsSync(python) || !fs.existsSync(path.join(tool, 'facefusion.py'))) throw new Error('Run setup.ps1 before local processing.');
      // shortcut: faces only; full hair and wardrobe replacement needs the Flow or motion-transfer route.
      for (let i = 0; i < 2; i++) {
        const output = file(`local-pass-${i + 1}.mp4`);
        if (fs.existsSync(output)) throw new Error(`A previous pass exists: ${output}. Inspect it before retrying.`);
        run(python, ['facefusion.py', 'headless-run', '--source-paths', file(job.characters[i].file),
          '--target-path', i === 0 ? file('source.mp4') : file('local-pass-1.mp4'), '--output-path', output,
          '--face-selector-mode', 'reference', '--face-selector-order', 'left-right', '--reference-face-position', String(i),
          '--reference-frame-number', String(i === 0 ? Math.min(96, Math.max(0, Math.round(job.duration * 24) - 1)) : 0),
          // shortcut: these thresholds are calibrated on the supplied clip; review selection when changing performers.
          '--reference-face-distance', i === 0 ? '0.47' : '0.4', '--processors', 'face_swapper', '--face-swapper-model', 'hyperswap_1a_256',
          '--execution-providers', 'cpu', '--execution-thread-count', '4', '--output-video-encoder', 'libx264',
          '--output-video-quality', '95', '--output-video-fps', '24', '--workflow-strategy', 'memory', '--download-providers', 'github'],
        { cwd: tool, stdio: 'inherit' });
      }
      video = file('local-pass-2.mp4');
      job.mode = 'local-face-only';
    } else {
      video = required('video');
      job.mode = 'external-result';
    }
    const generated = probe(video);
    if (!generated.streams.some(s => s.codec_type === 'video')) throw new Error('The supplied result has no video stream.');
    if (Number(generated.format.duration) < job.duration - 1 / 24) throw new Error('Generated footage is shorter than the requested interval.');
    ffmpeg(['-i', video, ...(job.hasAudio ? ['-i', file('source-audio.wav')] : []), '-map', '0:v:0',
      ...(job.hasAudio ? ['-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k'] : ['-an']),
      '-t', String(job.duration), '-vf', 'fps=24', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file('final.mp4')]);
    const final = probe(file('final.mp4'));
    if (Math.abs(Number(final.format.duration) - job.duration) > 1 / 24 || final.streams.some(s => s.codec_type === 'audio') !== job.hasAudio) throw new Error('Final duration or soundtrack failed validation.');
    ffmpeg(['-i', file('final.mp4'), '-f', 'null', '-']);
    job.state = 'awaiting_visual_review';
    job.result = { file: 'final.mp4', generatedFrom: video, media: final };
    fs.writeFileSync(jobFile, JSON.stringify(job, null, 2) + '\n');
    console.log(JSON.stringify({ file: file('final.mp4'), state: job.state, mode: job.mode, duration: final.format.duration }));
  } else {
    throw new Error('Usage: node workflow.mjs prepare --source VIDEO --start SECONDS --duration SECONDS --character-1 IMAGE --character-2 IMAGE --out NEW_JOB\n       node workflow.mjs local --job JOB\n       node workflow.mjs finish --job JOB --video GENERATED_VIDEO');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
