import type { TestCase } from '../domain/course-types'

export type CheckerRequest = {
  id: string
  code: string
  tests: TestCase[]
  allowedImports: string[]
}

export type TestResult = {
  name: string
  passed: boolean
  message: string
}

export type CheckerResult = {
  id: string
  status: 'passed' | 'failed' | 'syntax-error' | 'runtime-error' | 'blocked-import' | 'timeout' | 'checker-error'
  tests: TestResult[]
  stdout: string
  error?: string
  line?: number
}

export type WorkerMessage =
  | { type: 'ready' }
  | { type: 'result'; result: CheckerResult }
  | { type: 'startup-error'; error: string }
