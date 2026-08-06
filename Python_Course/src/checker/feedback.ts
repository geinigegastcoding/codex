import type { CheckerResult } from './worker-protocol'

export function feedbackFor(result: CheckerResult) {
  if (result.status === 'passed') return { title: 'All checks passed', tone: 'success', message: 'Your solution satisfied every example and edge-case check. Explain why it works before moving on.' } as const
  if (result.status === 'syntax-error') return { title: `Syntax problem${result.line ? ` on line ${result.line}` : ''}`, tone: 'error', message: `${result.error} Read the line above the marker too—missing brackets and colons often surface one line later.` } as const
  if (result.status === 'blocked-import') return { title: 'Import not available here', tone: 'warning', message: result.error ?? 'This exercise is designed for Python’s built-in tools.' } as const
  if (result.status === 'timeout') return { title: 'Execution timed out', tone: 'error', message: result.error ?? 'Look for a loop whose condition never changes.' } as const
  if (result.status === 'runtime-error') return { title: 'Your code raised an error', tone: 'error', message: `${result.error} Trace the values immediately before the failing operation.` } as const
  const failed = result.tests.find((test) => !test.passed)
  return { title: 'One more case needs work', tone: 'warning', message: failed ? `${failed.name}: ${failed.message} Which assumption in your code does this input break?` : result.error ?? 'The checker could not finish this attempt.' } as const
}
