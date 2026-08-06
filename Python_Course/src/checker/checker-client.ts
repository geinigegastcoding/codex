import type { Exercise } from '../domain/course-types'
import type { CheckerResult, WorkerMessage } from './worker-protocol'

type Pending = { resolve: (result: CheckerResult) => void; timer: number }

export class PythonChecker {
  private worker: Worker | null = null
  private readyPromise: Promise<void> | null = null
  private pending = new Map<string, Pending>()

  start() {
    if (this.readyPromise) return this.readyPromise
    this.readyPromise = new Promise((resolve, reject) => {
      this.worker = new Worker(new URL('./checker.worker.ts', import.meta.url), { type: 'module' })
      this.worker.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
        if (event.data.type === 'ready') resolve()
        if (event.data.type === 'startup-error') reject(new Error(event.data.error))
        if (event.data.type === 'result') {
          const pending = this.pending.get(event.data.result.id)
          if (!pending) return
          window.clearTimeout(pending.timer)
          this.pending.delete(event.data.result.id)
          pending.resolve(event.data.result)
        }
      })
      this.worker.addEventListener('error', (event) => reject(new Error(event.message)))
    })
    return this.readyPromise
  }

  async run(code: string, exercise: Exercise) {
    await this.start()
    const id = crypto.randomUUID()
    return new Promise<CheckerResult>((resolve) => {
      const timeoutMs = exercise.timeoutMs ?? 3000
      const timer = window.setTimeout(() => {
        this.pending.delete(id)
        this.restart()
        resolve({ id, status: 'timeout', tests: [], stdout: '', error: `Your code ran for more than ${timeoutMs / 1000} seconds. Check for an infinite loop or work that grows too quickly.` })
      }, timeoutMs)
      this.pending.set(id, { resolve, timer })
      this.worker?.postMessage({ id, code, tests: exercise.tests, allowedImports: exercise.allowedImports ?? [] })
    })
  }

  restart() {
    this.worker?.terminate()
    for (const pending of this.pending.values()) window.clearTimeout(pending.timer)
    this.pending.clear()
    this.worker = null
    this.readyPromise = null
    void this.start()
  }

  stop() {
    this.worker?.terminate()
    this.worker = null
    this.readyPromise = null
  }
}

export const pythonChecker = new PythonChecker()
