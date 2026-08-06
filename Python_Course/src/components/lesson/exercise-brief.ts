import type { Comparison, Exercise, TestCase } from '../../domain/course-types'

const maximumValueLength = 220

function quoteString(value: string) {
  return JSON.stringify(value)
}

export function formatPythonValue(value: unknown): string {
  let formatted: string
  if (value === null || value === undefined) formatted = 'None'
  else if (typeof value === 'boolean') formatted = value ? 'True' : 'False'
  else if (typeof value === 'string') formatted = quoteString(value)
  else if (typeof value === 'number') formatted = String(value)
  else if (Array.isArray(value)) formatted = `[${value.map(formatPythonValue).join(', ')}]`
  else if (typeof value === 'object') {
    formatted = `{${Object.entries(value).map(([key, item]) => `${quoteString(key)}: ${formatPythonValue(item)}`).join(', ')}}`
  } else formatted = String(value)

  return formatted.length > maximumValueLength
    ? `${formatted.slice(0, maximumValueLength - 1)}…`
    : formatted
}

export function extractFunctionSignature(exercise: Exercise) {
  const pattern = new RegExp(`^\\s*def\\s+${exercise.functionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\([^\\n]*\\)\\s*:`,'m')
  return exercise.starterCode.match(pattern)?.[0].trim() ?? ''
}

function describeComparison(comparison: Comparison | undefined, tolerance: number | undefined) {
  if (comparison === 'unordered') return 'Order does not matter for this result.'
  if (comparison === 'set-equivalent') return 'Duplicates and order do not matter for this result.'
  if (comparison === 'case-insensitive') return 'Letter case does not matter for this result.'
  if (comparison === 'numeric-tolerance') return `Numeric values may differ by at most ${tolerance ?? 1e-9}.`
  return ''
}

function formatCall(test: TestCase) {
  return `${test.functionName}(${test.args.map(formatPythonValue).join(', ')})`
}

function expectedOutcome(test: TestCase) {
  if (test.expectedException) return `raise ${test.expectedException}`
  return `return ${formatPythonValue(test.expected)}`
}

export type ExerciseBrief = {
  signature: string
  contract: string
  checklist: { title: string; behavior: string; note: string }[]
  example: string
  checkingNotes: string[]
}

export function buildExerciseBrief(exercise: Exercise): ExerciseBrief {
  const signature = extractFunctionSignature(exercise)
  const firstTest = exercise.tests[0]
  const parameterCount = firstTest?.args.length ?? 0
  const argumentLabel = `${parameterCount} ${parameterCount === 1 ? 'argument' : 'arguments'}`
  const checklist = exercise.tests.map((test) => ({
    title: test.name,
    behavior: `${formatCall(test)} → ${expectedOutcome(test)}`,
    note: describeComparison(test.comparison, test.tolerance),
  }))
  const allowedImports = exercise.allowedImports?.length
    ? `You may import only: ${exercise.allowedImports.join(', ')}.`
    : 'No imports are needed or allowed for this exercise.'

  return {
    signature,
    contract: `The checker calls this function directly with ${argumentLabel}. Keep the exact function name and parameter list, and return the result instead of reading input or printing it.`,
    checklist,
    example: firstTest ? `${formatCall(firstTest)} → ${expectedOutcome(firstTest)}` : '',
    checkingNotes: [
      'Write only the function and any small helper functions it needs. You do not need to call the function yourself.',
      'Alternative correct implementations are accepted; your code does not need to match the provided solution.',
      allowedImports,
      `The checker stops code that runs longer than ${(exercise.timeoutMs ?? 3000) / 1000} seconds.`,
    ],
  }
}
