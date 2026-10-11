import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const testRoot = path.join(root, '.test-runs');
fs.mkdirSync(testRoot, { recursive: true });
const sandbox = fs.mkdtempSync(path.join(testRoot, 'media-'));
const source = path.join(sandbox, 'source.mp4');
const reference = path.join(sandbox, 'reference.png');
const fixture = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-n',
  '-f', 'lavfi', '-i', 'color=c=red:s=320x180:r=24:d=1.5',
  '-f', 'lavfi', '-i', 'color=c=blue:s=320x180:r=24:d=1.5',
  '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=44100:duration=3',
  '-filter_complex', '[0:v][1:v]concat=n=2:v=1:a=0[v]',
  '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-preset', 'ultrafast',
  '-pix_fmt', 'yuv420p', '-c:a', 'aac', source
], { encoding: 'utf8' });
assert.equal(fixture.status, 0, fixture.stderr);
const frame = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-n', '-i', source,
  '-frames:v', '1', '-update', '1', reference], { encoding: 'utf8' });
assert.equal(frame.status, 0, frame.stderr);

const cli = (...args) => spawnSync(process.execPath, [path.join(root, 'workflow.mjs'), ...args], { encoding: 'utf8' });
const prepare = (out, start = '1.75', duration = '1') => cli('prepare', '--source', source,
  '--start', start, '--duration', duration, '--character-1', reference, '--character-2', reference, '--out', out);
const probe = video => JSON.parse(spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format',
  '-of', 'json', video], { encoding: 'utf8' }).stdout);

test('the requested interval is cut, audio is retained, and supplied references are preserved', () => {
  const job = path.join(sandbox, 'prepared');
  const result = prepare(job);
  assert.equal(result.status, 0, result.stderr);
  const manifest = JSON.parse(fs.readFileSync(path.join(job, 'job.json'), 'utf8'));
  const media = probe(path.join(job, 'source.mp4'));
  assert.equal(Number(media.streams.find(s => s.codec_type === 'video').nb_frames), 24);
  assert.equal(Number(media.format.duration), 1);
  assert(media.streams.some(s => s.codec_type === 'audio'));
  assert.equal(manifest.start, 1.75);
  assert.deepEqual(fs.readFileSync(path.join(job, 'character-1.png')), fs.readFileSync(reference));
  const pixels = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', path.join(job, 'source.mp4'),
    '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1']);
  assert(pixels.stdout[2] > 200 && pixels.stdout[0] < 20, 'The selected interval must begin in the blue section, not the red beginning.');
});

test('a cut beyond the source and an existing job are rejected without overwriting data', () => {
  const impossible = path.join(sandbox, 'impossible');
  const result = prepare(impossible, '2', '2');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /beyond the source/);
  assert(!fs.existsSync(impossible));
  const occupied = path.join(sandbox, 'occupied');
  fs.mkdirSync(occupied);
  fs.writeFileSync(path.join(occupied, 'keep.txt'), 'user data');
  assert.notEqual(prepare(occupied).status, 0);
  assert.equal(fs.readFileSync(path.join(occupied, 'keep.txt'), 'utf8'), 'user data');
});

test('export adds the original soundtrack to a silent result and rejects incomplete footage', () => {
  const job = path.join(sandbox, 'export-job');
  assert.equal(prepare(job).status, 0);
  const silent = path.join(sandbox, 'silent.mp4');
  const short = path.join(sandbox, 'too-short.mp4');
  for (const [out, seconds] of [[silent, '1'], [short, '0.5']]) {
    const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-n', '-i', source,
      '-t', seconds, '-an', '-c:v', 'libx264', '-preset', 'ultrafast', out], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
  const rejected = cli('finish', '--job', job, '--video', short);
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /shorter than the requested/);
  const exported = cli('finish', '--job', job, '--video', silent);
  assert.equal(exported.status, 0, exported.stderr);
  const final = probe(path.join(job, 'final.mp4'));
  assert.equal(Number(final.format.duration), 1);
  assert(final.streams.some(s => s.codec_type === 'audio'), 'The export must use the source soundtrack even when generation has no audio.');
  const decoded = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', path.join(job, 'final.mp4'),
    '-map', '0:a:0', '-ac', '1', '-ar', '44100', '-f', 'f32le', 'pipe:1']).stdout;
  let crossings = 0;
  for (let i = 4; i < Math.min(decoded.length, 44100 * 4); i += 4) {
    if (decoded.readFloatLE(i - 4) <= 0 && decoded.readFloatLE(i) > 0) crossings++;
  }
  assert(crossings >= 435 && crossings <= 445, 'The retained soundtrack must contain the source 440 Hz tone.');
});

test('a malformed character reference is rejected before creating the job', () => {
  const invalid = path.join(sandbox, 'invalid.png');
  fs.writeFileSync(invalid, 'not an image');
  const job = path.join(sandbox, 'invalid-reference');
  const result = cli('prepare', '--source', source, '--start', '1.75', '--duration', '1',
    '--character-1', invalid, '--character-2', reference, '--out', job);
  assert.notEqual(result.status, 0);
  assert(!fs.existsSync(job), 'Invalid references must not leave a prepared job behind.');
});
