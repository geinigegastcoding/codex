import type { Assessment, AssessmentQuestion, SkillId } from '../domain/course-types'
import { expandedAssessments, expandedModules } from './catalog/expanded-catalog'

const question = (id: string, prompt: string, correct: string, distractors: [string, string, string], explanation: string, skillIds: SkillId[]): AssessmentQuestion => ({ id, prompt, choices: [correct, ...distractors], correctIndex: 0, explanation, skillIds })

const certificationSimulation = (id: string, title: string, skills: SkillId[], questions: AssessmentQuestion[]): Assessment => ({
  id,
  title,
  description: 'Original objective-based questions for readiness practice; these are not copied exam questions.',
  kind: 'certification-simulation',
  minutes: 35,
  passingScore: 75,
  prerequisiteIds: [],
  questionPool: questions,
})

export const certificationAssessments: Assessment[] = [
  certificationSimulation('simulation-pcep', 'PCEP readiness simulation', ['syntax', 'loops', 'dictionaries', 'functions', 'exceptions'], [
    question('pcep-1', 'What does range(2, 7, 2) produce when converted to a list?', '[2, 4, 6]', ['[2, 4, 6, 8]', '[2, 3, 4, 5, 6]', '[7, 5, 3]'], 'The stop is exclusive and the step adds two.', ['loops']),
    question('pcep-2', 'Which expression compares two values rather than their object identity?', 'left == right', ['left is right', 'left := right', 'left equals right'], 'Equality and identity answer different questions.', ['syntax']),
    question('pcep-3', 'What is the clearest way to reject a broken caller contract?', 'Raise a specific exception.', ['Return an error string among valid values.', 'Print a warning and continue.', 'Catch every error inside the function.'], 'Specific exceptions keep failures distinct from valid results.', ['exceptions', 'functions']),
    question('pcep-4', 'Which dictionary pattern increments a missing count without a separate membership branch?', "counts[key] = counts.get(key, 0) + 1", ['counts[key] += 1 always', 'counts.add(key)', 'counts[key] = key + 1'], 'get supplies the initial zero.', ['dictionaries']),
  ]),
  certificationSimulation('simulation-pcap', 'PCAP readiness simulation', ['modules', 'packages', 'oop', 'files', 'generators'], [
    question('pcap-1', 'Why use if __name__ == "__main__" in an importable module?', 'To keep script-only execution out of normal imports.', ['To make every name private.', 'To install the module.', 'To catch syntax errors.'], 'Imported modules receive their module name rather than __main__.', ['modules']),
    question('pcap-2', 'What ends normal iteration from __next__?', 'Raising StopIteration.', ['Returning None.', 'Raising EOFError.', 'Deleting the iterator.'], 'The iterator protocol uses StopIteration.', ['generators']),
    question('pcap-3', 'What is a strong reason to prefer composition over inheritance?', 'The reused object is a capability, not a subtype relationship.', ['Composition automatically runs faster.', 'Inheritance cannot contain methods.', 'Composition removes all coupling.'], 'Subtype claims should satisfy substitution; capabilities can be composed.', ['oop']),
    question('pcap-4', 'Why pass an encoding when opening a text file?', 'To make byte-to-text conversion explicit and reproducible.', ['To convert the file to binary.', 'To prevent every I/O error.', 'To make context managers optional.'], 'Text files decode bytes according to an encoding.', ['files']),
  ]),
  certificationSimulation('simulation-data', 'Data analyst readiness simulation', ['numpy', 'pandas', 'statistics', 'visualization', 'sql'], [
    question('data-1', 'A join unexpectedly multiplies rows. What should be checked first?', 'The key cardinality and duplicate keys on both sides.', ['The chart palette.', 'The Python recursion limit.', 'Whether all columns are strings.'], 'Many-to-many keys multiply matching combinations.', ['pandas']),
    question('data-2', 'Which split is safest for predicting future sports matches?', 'A chronological split where training precedes validation and test.', ['A random split after creating future aggregates.', 'Use the complete dataset for both training and evaluation.', 'Choose the split with the highest score.'], 'Prediction-time order prevents future information entering training.', ['statistics']),
    question('data-3', 'What does NumPy broadcasting require?', 'Trailing dimensions must be equal or one of them must be 1.', ['Arrays must have identical total element counts.', 'Both arrays must be one-dimensional.', 'Every operation must allocate a Python list.'], 'Broadcasting compares compatible dimensions from the right.', ['numpy']),
    question('data-4', 'What should accompany a chart when exact accessible values matter?', 'A readable data table.', ['A second y-axis.', 'A rainbow palette.', 'A screenshot without labels.'], 'Tables provide exact values and a non-visual alternative.', ['visualization']),
  ]),
  certificationSimulation('simulation-testing', 'Python testing readiness simulation', ['testing', 'debugging'], [
    question('test-1', 'What should a unit test name communicate?', 'The protected rule and scenario.', ['Only the function name.', 'The line number being executed.', 'The number of assertions.'], 'A useful name explains why a regression matters.', ['testing']),
    question('test-2', 'Where should a dependency usually be patched?', 'Where the code under test looks it up.', ['Only where the dependency was originally defined.', 'In every module in the project.', 'Inside the Python standard library.'], 'Names are resolved in the importing module namespace.', ['testing']),
    question('test-3', 'What is the main danger of asserting every internal call?', 'Tests become coupled to implementation rather than behavior.', ['The tests become integration tests automatically.', 'Python stops collecting tests.', 'Assertions cannot compare calls.'], 'Over-specified interaction tests resist safe refactoring.', ['testing']),
    question('test-4', 'What follows a red test in a disciplined TDD cycle?', 'Implement the smallest behavior that makes it pass.', ['Add several unrelated abstractions.', 'Delete the test.', 'Release immediately without refactoring.'], 'Red-green-refactor keeps feedback small and purposeful.', ['testing']),
  ]),
  certificationSimulation('simulation-automation', 'Automation readiness simulation', ['automation', 'cli', 'files', 'logging'], [
    question('auto-1', 'Why offer a dry-run mode for batch file changes?', 'It exposes the planned changes before mutation.', ['It guarantees the code has no bugs.', 'It makes backups unnecessary.', 'It hides permission failures.'], 'Preview reduces the cost of misunderstanding scope.', ['automation']),
    question('auto-2', 'What makes an automation safely rerunnable?', 'Idempotent behavior or explicit reconciliation of prior work.', ['Using random output names every time.', 'Ignoring all existing output.', 'Catching and suppressing every exception.'], 'Repeated execution should not duplicate or corrupt work.', ['automation']),
    question('auto-3', 'Where should diagnostics go when stdout is machine-readable JSON?', 'stderr', ['stdout mixed into the JSON', 'the source file', 'nowhere'], 'Separate streams preserve composability.', ['cli']),
    question('auto-4', 'What should an unattended scheduled job make explicit?', 'Working directory, environment, overlap policy, and failure reporting.', ['Only the script filename.', 'A GUI confirmation for every run.', 'The developer IDE state.'], 'Schedulers often run with a different environment than an interactive shell.', ['automation', 'logging']),
  ]),
  certificationSimulation('simulation-security', 'Defensive Python security readiness simulation', ['security', 'networking', 'files'], [
    question('security-1', 'Which is appropriate for storing user passwords?', 'A purpose-built password hashing function with a salt.', ['Plain SHA-256 without a salt.', 'Base64 encoding.', 'Reversible encryption with a key in source.'], 'Password hashing functions are intentionally expensive and salted.', ['security']),
    question('security-2', 'What is the safest default for invoking a trusted local command with user-derived arguments?', 'Pass an argument list without a shell and validate the values.', ['Concatenate a shell command string.', 'Disable timeouts.', 'Run with administrator privileges.'], 'Avoiding a shell removes a major injection boundary.', ['security']),
    question('security-3', 'What does a file hash manifest provide?', 'Evidence that file bytes differ from a trusted baseline.', ['Proof of who changed a file.', 'Automatic confidentiality.', 'Guaranteed malware classification.'], 'Hashes detect change but do not explain cause or ownership.', ['security', 'files']),
    question('security-4', 'When is network retry unsafe?', 'When the operation is non-idempotent and may already have succeeded.', ['Whenever a timeout exists.', 'Only on localhost.', 'When the response is JSON.'], 'Retries can duplicate side effects unless the protocol handles them.', ['security', 'networking']),
  ]),
  certificationSimulation('simulation-ai', 'AI readiness simulation', ['machine-learning', 'neural-networks', 'nlp', 'generative-ai', 'responsible-ai'], [
    question('ai-1', 'What is leakage in a pre-match prediction model?', 'Using information that would not exist at prediction time.', ['Using more than one feature.', 'Scaling numeric columns.', 'Comparing with a baseline.'], 'Leakage creates unrealistic evaluation performance.', ['machine-learning']),
    question('ai-2', 'Why shift logits by their maximum before softmax?', 'To improve numerical stability without changing probabilities.', ['To make every class equally likely.', 'To remove the need for labels.', 'To convert the model into regression.'], 'Softmax is invariant to adding or subtracting the same constant.', ['neural-networks']),
    question('ai-3', 'What is a prompt injection defense principle?', 'Treat retrieved and user content as untrusted data, not privileged instructions.', ['Ask the model to ignore attacks once.', 'Put secrets in a longer system prompt.', 'Allow every tool and inspect afterward.'], 'Capability boundaries must be enforced outside model text.', ['generative-ai', 'security']),
    question('ai-4', 'What makes an AI evaluation useful?', 'It includes realistic failures that could disprove the demo.', ['It contains only examples the model already passed.', 'It measures response length only.', 'It replaces human review in every domain.'], 'Evaluation should test the claims and important failure modes.', ['responsible-ai']),
  ]),
]

export const stageAssessments: Assessment[] = Array.from({ length: 12 }, (_, order) => {
  const stageId = `stage-${order}`
  const moduleAssessmentIds = expandedModules.filter((item) => item.stageId === stageId).map((item) => `boss-${item.id}`)
  const questions = expandedAssessments.filter((item) => moduleAssessmentIds.includes(item.id)).flatMap((item) => item.questionPool)
  return {
    id: `readiness-${stageId}`,
    title: `Stage ${order} readiness assessment`,
    description: 'A mixed retrieval check across the expanded objectives in this stage.',
    kind: 'stage-readiness',
    minutes: Math.max(20, Math.min(60, questions.length * 3)),
    passingScore: 75,
    prerequisiteIds: moduleAssessmentIds,
    questionPool: questions,
  }
})

export const assessments: Assessment[] = [...expandedAssessments, ...stageAssessments, ...certificationAssessments]
export const assessmentById = Object.fromEntries(assessments.map((item) => [item.id, item])) as Record<string, Assessment>
