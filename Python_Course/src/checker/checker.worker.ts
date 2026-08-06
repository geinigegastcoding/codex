/// <reference lib="webworker" />
import type { PyodideInterface } from 'pyodide'
import { pythonHarness } from './harness'
import type { CheckerRequest, CheckerResult, WorkerMessage } from './worker-protocol'

const worker = self as unknown as DedicatedWorkerGlobalScope
let pyodide: PyodideInterface | null = null

async function initialize() {
  const runtimeUrl = `${worker.location.origin}/pyodide/pyodide.mjs`
  const runtime = await import(/* @vite-ignore */ runtimeUrl) as { loadPyodide: (options: { indexURL: string }) => Promise<PyodideInterface> }
  pyodide = await runtime.loadPyodide({ indexURL: `${worker.location.origin}/pyodide/` })
  worker.postMessage({ type: 'ready' } satisfies WorkerMessage)
}

initialize().catch((error: unknown) => {
  worker.postMessage({ type: 'startup-error', error: error instanceof Error ? error.message : String(error) } satisfies WorkerMessage)
})

worker.addEventListener('message', async (event: MessageEvent<CheckerRequest>) => {
  const request = event.data
  if (!pyodide) {
    worker.postMessage({ type: 'result', result: { id: request.id, status: 'checker-error', tests: [], stdout: '', error: 'Python is still starting.' } } satisfies WorkerMessage)
    return
  }
  if (request.code.length > 50_000) {
    worker.postMessage({ type: 'result', result: { id: request.id, status: 'checker-error', tests: [], stdout: '', error: 'Code is limited to 50 KB for one exercise.' } } satisfies WorkerMessage)
    return
  }
  try {
    pyodide.globals.set('USER_CODE', request.code)
    pyodide.globals.set('TESTS_JSON', JSON.stringify(request.tests))
    pyodide.globals.set('ALLOWED_JSON', JSON.stringify(request.allowedImports))
    const raw = await pyodide.runPythonAsync(pythonHarness)
    const parsed = JSON.parse(String(raw)) as Omit<CheckerResult, 'id'>
    worker.postMessage({ type: 'result', result: { ...parsed, id: request.id } } satisfies WorkerMessage)
  } catch (error) {
    worker.postMessage({ type: 'result', result: { id: request.id, status: 'checker-error', tests: [], stdout: '', error: error instanceof Error ? error.message : String(error) } } satisfies WorkerMessage)
  } finally {
    pyodide.globals.delete('USER_CODE')
    pyodide.globals.delete('TESTS_JSON')
    pyodide.globals.delete('ALLOWED_JSON')
  }
})
