import { spawn } from 'node:child_process'

const npm = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : 'npm'
const npmArgs = process.platform === 'win32' ? ['/d', '/s', '/c', 'npm run dev'] : ['run', 'dev']
const api = spawn(process.execPath, ['server/index.mjs'], { stdio: 'inherit' })
const ui = spawn(npm, npmArgs, { stdio: 'inherit' })

function stop() {
  api.kill('SIGTERM')
  ui.kill('SIGTERM')
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)
api.on('exit', (code) => { if (code && code !== 0) ui.kill('SIGTERM') })
ui.on('exit', (code) => { if (code && code !== 0) api.kill('SIGTERM') })
