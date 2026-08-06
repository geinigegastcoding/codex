import type { EnvironmentKind, Project, ProjectMilestone, ProjectRubricCriterion, SkillId } from '../domain/course-types'

const rubric = (domain: string): ProjectRubricCriterion[] => [
  { id: 'correctness', title: 'Correctness', description: `The ${domain} behavior satisfies the acceptance criteria and handles documented edge cases.`, weight: 35 },
  { id: 'tests', title: 'Tests', description: 'Automated tests prove important business rules, boundaries, and failure behavior.', weight: 20 },
  { id: 'design', title: 'Design', description: 'Domain logic, input/output, configuration, and dependencies have clear boundaries.', weight: 20 },
  { id: 'evidence', title: 'Evidence and analysis', description: 'Verifier evidence and the reflection report are complete, reproducible, and honest.', weight: 15 },
  { id: 'documentation', title: 'Documentation', description: 'A new developer can install, run, test, and understand the project.', weight: 10 },
]

const milestone = (
  id: string,
  title: string,
  summary: string,
  instructions: string[],
  acceptanceCriteria: string[],
  estimatedHours: number,
  prerequisiteMilestoneIds: string[] = [],
  browserCompatible = false,
): ProjectMilestone => ({
  id, title, summary, instructions, acceptanceCriteria, estimatedHours, prerequisiteMilestoneIds,
  evidence: [
    { id: `${id}-verification`, kind: browserCompatible ? 'browser-check' : 'verifier-report', description: 'Pass the milestone checks and record the resulting evidence.', required: true },
    { id: `${id}-reflection`, kind: 'reflection', description: 'Explain one design choice, one failure found, and the next improvement.', required: true },
  ],
})

const setup = (packageName: string) => [
  { id: 'create-venv', title: 'Create an isolated environment', command: 'python -m venv .venv', detail: 'Use a project-specific virtual environment.' },
  { id: 'activate-venv', title: 'Activate it', command: '.venv\\Scripts\\activate', detail: 'On macOS or Linux use source .venv/bin/activate.' },
  { id: 'install', title: 'Install the starter', command: 'python -m pip install -e .', detail: `Install ${packageName} in editable mode.` },
  { id: 'test', title: 'Verify the starter', command: 'python -m pytest', detail: 'Infrastructure errors must be resolved before implementation work starts.' },
]

const deliverables = (packageName: string, resultPath: string) => [
  { id: 'source', title: 'Application source', path: `src/${packageName}/`, description: 'Organized Python source with domain logic separated from I/O.', required: true },
  { id: 'tests', title: 'Automated tests', path: 'tests/', description: 'Tests for common paths, boundaries, invalid input, and regressions.', required: true },
  { id: 'result', title: 'Reproducible result', path: resultPath, description: 'The project-specific report, model, dashboard, or data artifact.', required: true },
  { id: 'readme', title: 'Project guide', path: 'README.md', description: 'Setup, commands, decisions, limitations, and sample output.', required: true },
  { id: 'verification', title: 'Verifier report', path: 'verification-report.json', description: 'Machine-readable evidence produced by the included verifier.', required: true },
]

type ProjectInput = Omit<Project, 'setup' | 'deliverables' | 'rubric' | 'starterBundlePath' | 'verifier'> & { packageName: string; resultPath: string }

const project = (input: ProjectInput): Project => ({
  ...input,
  setup: setup(input.packageName),
  deliverables: deliverables(input.packageName, input.resultPath),
  rubric: rubric(input.title.toLowerCase()),
  starterBundlePath: `/projects/${input.id}/${input.id}.zip`,
  verifier: { id: `${input.id}-verifier`, reportSchemaVersion: 1, command: 'python scripts/verify_project.py', reportFile: 'verification-report.json' },
})

export const projects: Project[] = [
  project({
    id: 'word-insight', title: 'Word Insight Analyzer', stageId: 'stage-0', summary: 'Repair and expand your original word-frequency diagnostic into a reliable command-line tool.', outcome: 'A tested analyzer that ranks words, handles ties, reports useful statistics, and processes UTF-8 files.', estimatedHours: 10, environment: 'local-python', packageName: 'word_insight', resultPath: 'examples/report.json', prerequisiteModuleIds: ['m0-tracing', 'm0-functions'], prerequisiteLessonIds: ['pure-counting', 'ranking-repair'], skills: ['strings', 'dictionaries', 'sorting', 'testing', 'cli', 'files'],
    milestones: [
      milestone('word-core', 'Pure analysis core', 'Normalize and count text without side effects.', ['Define punctuation and case rules.', 'Implement tokenize and word_frequency as pure functions.', 'Keep caller input unchanged.'], ['Empty text returns empty results.', 'Whitespace and punctuation follow the policy.', 'The functions do not print.'], 2, [], true),
      milestone('word-ranking', 'Deterministic ranking', 'Rank frequent words with an alphabetical tie-break.', ['Implement top_words(counts, limit).', 'Validate invalid limits.', 'Do not mutate counts.'], ['Higher counts appear first.', 'Ties are alphabetical.', 'Zero and invalid limits are tested.'], 2, ['word-core'], true),
      milestone('word-stats', 'Text statistics', 'Add totals, vocabulary size, lexical diversity, and longest-word reporting.', ['Define each statistic.', 'Handle empty text.', 'Return a JSON-serializable report.'], ['Fixtures match hand calculations.', 'Ties are deterministic.', 'No division-by-zero path exists.'], 2, ['word-ranking']),
      milestone('word-cli', 'Readable CLI', 'Accept direct text or a file and render text or JSON.', ['Use argparse.', 'Send user errors to stderr.', 'Keep formatting outside the analysis module.'], ['Both input modes work.', 'Failures use non-zero exits.', 'JSON output is valid.'], 2, ['word-stats']),
      milestone('word-release', 'Verified release', 'Complete tests, documentation, and verification.', ['Name tests after protected behavior.', 'Run the verifier.', 'Document complexity and tokenization limits.'], ['All tests pass.', 'All deliverables are present.', 'README commands work.'], 2, ['word-cli']),
    ],
  }),
  project({
    id: 'sports-table', title: 'Sports League Table', stageId: 'stage-1', summary: 'Turn raw match records into validated, persistent team standings.', outcome: 'A deterministic leaderboard with nested statistics, configurable scoring, JSON persistence, and clear validation failures.', estimatedHours: 14, environment: 'local-venv', packageName: 'sports_table', resultPath: 'examples/standings.json', prerequisiteModuleIds: ['m1-data', 'm1-errors', 'm1-quality'], prerequisiteLessonIds: ['nested-aggregation', 'json-validation', 'tests-as-reasons'], skills: ['dictionaries', 'nested-data', 'sorting', 'exceptions', 'testing', 'files', 'oop'],
    milestones: [
      milestone('table-contract', 'Match data contract', 'Validate team names and scores before aggregation.', ['Model the record.', 'Reject self-matches and negative scores.', 'Preserve source context in errors.'], ['Invalid fixtures fail for the intended reason.', 'Validation never partially updates standings.', 'Normalization is documented.'], 3),
      milestone('table-aggregate', 'Standing aggregation', 'Compute played, results, goals, difference, and points.', ['Update both teams.', 'Support configurable scoring.', 'Build fresh standings each run.'], ['Column invariants hold.', 'Goal totals balance.', 'Input order does not change totals.'], 3, ['table-contract']),
      milestone('table-ranking', 'Tie-breaking', 'Rank by points, goal difference, goals, then name.', ['Implement one ranking key.', 'Document direction per field.', 'Test complete ties.'], ['Tie order is exact.', 'Output is deterministic.', 'Caller data is not mutated.'], 2, ['table-aggregate'], true),
      milestone('table-persistence', 'JSON season workflow', 'Load, validate, calculate, and save a versioned report.', ['Separate parsing and validation.', 'Use UTF-8 context managers.', 'Include scoring metadata.'], ['Round trips retain report data.', 'Syntax and domain errors differ.', 'Output is stable.'], 3, ['table-ranking']),
      milestone('table-release', 'League-table release', 'Add a CLI, integration tests, and verifier evidence.', ['Support input and output paths.', 'Test fixtures end to end.', 'Document tie rules.'], ['Exit codes are tested.', 'Verifier passes.', 'README includes a complete example.'], 3, ['table-persistence']),
    ],
  }),
  project({
    id: 'route-finder', title: 'Route Finder', stageId: 'stage-2', summary: 'Find and explain routes through a transport or game map.', outcome: 'A tested BFS route finder with reconstruction, unreachable-state handling, complexity analysis, and algorithm comparison.', estimatedHours: 14, environment: 'local-venv', packageName: 'route_finder', resultPath: 'examples/route-report.json', prerequisiteModuleIds: ['m2-complexity', 'm2-structures', 'm2-graphs'], prerequisiteLessonIds: ['binary-search-lesson', 'stacks-queues', 'graphs-bfs'], skills: ['algorithms', 'complexity', 'dictionaries', 'testing', 'cli', 'files'],
    milestones: [
      milestone('route-model', 'Graph model', 'Represent and validate directed or undirected maps.', ['Choose adjacency storage.', 'Define duplicate-edge behavior.', 'Load JSON fixtures.'], ['All neighbors exist.', 'Directedness is explicit.', 'Malformed maps fail before traversal.'], 2),
      milestone('route-bfs', 'Breadth-first traversal', 'Explore in distance layers without revisiting nodes.', ['Use a FIFO queue.', 'Mark nodes when queued.', 'Return traversal metadata.'], ['Shortest unweighted paths are found.', 'Cycles terminate.', 'Boundary cases are tested.'], 3, ['route-model'], true),
      milestone('route-reconstruct', 'Route reconstruction', 'Recover paths from predecessor data.', ['Store each predecessor once.', 'Reconstruct backward.', 'Represent unreachable results explicitly.'], ['Every route edge exists.', 'Endpoints are correct.', 'No partial route is fabricated.'], 2, ['route-bfs'], true),
      milestone('route-compare', 'Algorithm comparison', 'Compare BFS with DFS or Dijkstra.', ['Use shared contracts.', 'Benchmark generated graphs.', 'Separate correctness and timing claims.'], ['A meaningful difference is demonstrated.', 'Complexity uses vertices and edges.', 'Benchmarks reproduce.'], 4, ['route-reconstruct']),
      milestone('route-release', 'Route CLI', 'Provide route queries, readable output, tests, and docs.', ['Accept map, endpoints, and algorithm.', 'Show explored count.', 'Run verification.'], ['Errors are actionable.', 'Required cases pass.', 'Complexity is documented.'], 3, ['route-compare']),
    ],
  }),
  project({
    id: 'sports-collector', title: 'Responsible Sports Data Collector', stageId: 'stage-3', summary: 'Collect and clean permitted public sports data without aggressive scraping.', outcome: 'A rate-limited collector with fixtures, caching, checkpoints, logs, provenance, and quality reports.', estimatedHours: 20, environment: 'local-venv', packageName: 'sports_collector', resultPath: 'data/clean/sports-records.json', prerequisiteModuleIds: ['m3-http', 'm3-html', 'm3-pipeline'], prerequisiteLessonIds: ['http-model', 'scraping-ethics', 'collector-design'], skills: ['apis', 'scraping', 'security', 'exceptions', 'testing', 'logging', 'files'], localOnly: true,
    milestones: [
      milestone('collector-policy', 'Collection preflight', 'Document authorization, terms, robots guidance, privacy, API preference, and limits.', ['Complete the preflight template.', 'Specify delay, page cap, and stop conditions.', 'Stay in fixture mode until approved.'], ['Every field is answered.', 'No bypass or stealth behavior exists.', 'Safe limits are defaults.'], 3),
      milestone('collector-fetch', 'HTTP boundary', 'Fetch pages with bounded retries, timeouts, caching, and status rules.', ['Retry temporary failures only.', 'Honor Retry-After.', 'Inject the HTTP client.'], ['Permanent failures stop.', 'Pagination cannot loop.', 'Tests make no live calls.'], 4, ['collector-policy']),
      milestone('collector-parse', 'Structural parsing', 'Parse API or HTML fixtures and retain provenance.', ['Prefer official APIs.', 'Use structural selectors.', 'Record source and parser version.'], ['Missing fields are visible.', 'Selector changes fail loudly.', 'Identity keys are documented.'], 4, ['collector-fetch']),
      milestone('collector-clean', 'Data quality', 'Normalize records and quarantine invalid rows.', ['Keep raw and clean data separate.', 'Count transformations and skips.', 'Version the output schema.'], ['Runs are idempotent.', 'Totals reconcile.', 'Output validates.'], 4, ['collector-parse']),
      milestone('collector-release', 'Resumable collector', 'Add checkpoints, logging, CLI controls, and an offline demo.', ['Resume after the last valid page.', 'Keep logs free of secrets.', 'Verify with fixtures.'], ['Resume creates no duplicates.', 'Logs explain stop conditions.', 'README states permissions.'], 5, ['collector-clean']),
    ],
  }),
  project({
    id: 'sports-dashboard', title: 'Sports Performance Dashboard', stageId: 'stage-4', summary: 'Explore performance, trends, and uncertainty in a reproducible data product.', outcome: 'A validated pipeline with honest charts, accessible tables, and a written conclusion.', estimatedHours: 22, environment: 'notebook', packageName: 'sports_dashboard', resultPath: 'reports/dashboard.html', prerequisiteModuleIds: ['m4-arrays', 'm4-statistics', 'm4-visuals'], prerequisiteLessonIds: ['arrays-vectors', 'summary-statistics', 'chart-choice'], skills: ['data-analysis', 'statistics', 'numpy', 'pandas', 'visualization', 'testing'], localOnly: true,
    milestones: [
      milestone('dashboard-audit', 'Dataset audit', 'Profile schema, types, missingness, duplicates, ranges, and provenance.', ['Create a load function.', 'Record units.', 'Separate raw and derived data.'], ['Totals are deterministic.', 'Invalid ranges are visible.', 'No hidden notebook cleaning exists.'], 4),
      milestone('dashboard-clean', 'Reproducible cleaning', 'Build explicit pandas transformations and assertions.', ['Convert types deliberately.', 'Handle missingness by meaning.', 'Assert invariants.'], ['A fresh kernel reproduces results.', 'Losses are counted.', 'Raw files remain unchanged.'], 4, ['dashboard-audit']),
      milestone('dashboard-analysis', 'Statistics and questions', 'Answer three defined questions with uncertainty.', ['Write questions first.', 'Use grouped summaries.', 'Avoid causal overclaiming.'], ['Units and populations are clear.', 'A hand fixture confirms results.', 'Limitations are stated.'], 4, ['dashboard-clean']),
      milestone('dashboard-visuals', 'Accessible visuals', 'Create trend, comparison, and distribution views with tables.', ['Use one scale per chart.', 'Label units and windows.', 'Avoid color-only meaning.'], ['Forms match the question.', 'Tables expose exact values.', 'Labels remain readable.'], 5, ['dashboard-analysis']),
      milestone('dashboard-release', 'Dashboard story', 'Package reproducible outputs, conclusions, and verification.', ['Run cleanly.', 'Export a report or document the app.', 'State the strongest supported conclusion.'], ['One command regenerates outputs.', 'Verifier checks figures and tables.', 'Claims remain honest.'], 5, ['dashboard-visuals']),
    ],
  }),
  project({
    id: 'sports-predictor', title: 'Sports Match Predictor', stageId: 'stage-5', summary: 'Build a model and prove whether it beats a baseline without leakage.', outcome: 'A time-aware pipeline with baselines, two model families, metrics, error analysis, and a model card.', estimatedHours: 30, environment: 'local-venv', packageName: 'sports_predictor', resultPath: 'reports/model-card.md', prerequisiteModuleIds: ['m5-foundations', 'm5-models', 'm5-evaluation'], prerequisiteLessonIds: ['features-targets', 'baselines', 'leakage-crossvalidation'], skills: ['machine-learning', 'statistics', 'data-analysis', 'testing', 'pandas', 'visualization'], localOnly: true,
    milestones: [
      milestone('predictor-contract', 'Prediction contract', 'Define prediction time, target, features, and forbidden future information.', ['Create a feature-availability table.', 'Add leakage checks.', 'Choose a chronological holdout.'], ['Features exist at prediction time.', 'Future rows cannot leak.', 'Population is explicit.'], 5),
      milestone('predictor-baseline', 'Baselines', 'Implement majority and domain-rule baselines.', ['Fit on training data only.', 'Choose metrics.', 'Save predictions.'], ['Metrics reproduce.', 'Imbalance is reported.', 'A value threshold is defined.'], 4, ['predictor-contract']),
      milestone('predictor-pipeline', 'Models and preprocessing', 'Compare two scikit-learn model families in pipelines.', ['Fit preprocessing in-pipeline.', 'Tune on training periods.', 'Set seeds.'], ['Holdout stays untouched.', 'Models share evaluation data.', 'Artifacts are versioned.'], 8, ['predictor-baseline']),
      milestone('predictor-evaluate', 'Error analysis', 'Evaluate confusion, calibration, slices, and concrete failures.', ['Compare baselines.', 'Inspect time and class slices.', 'Explain drift risk.'], ['Variation is shown.', 'Five errors are analyzed.', 'Weak results are honest.'], 6, ['predictor-pipeline']),
      milestone('predictor-release', 'Model card', 'Ship reproducible training, inference, tests, and intended-use documentation.', ['Provide train/evaluate commands.', 'Test schema and leakage guards.', 'Document prohibited use.'], ['Metrics recreate within tolerance.', 'Verifier reads generated results.', 'Provenance is stated.'], 7, ['predictor-evaluate']),
    ],
  }),
  project({
    id: 'neural-from-scratch', title: 'Neural Network from Scratch', stageId: 'stage-6', summary: 'Build a dense neural network with NumPy before using a framework.', outcome: 'A vectorized network that passes gradient checks, learns a small classifier, and reports per-class errors.', estimatedHours: 32, environment: 'local-venv', packageName: 'neural_from_scratch', resultPath: 'reports/training-report.html', prerequisiteModuleIds: ['m6-linear', 'm6-gradients', 'm6-networks'], prerequisiteLessonIds: ['vectors-matrices', 'derivatives-gradients', 'dense-neurons'], skills: ['linear-algebra', 'neural-networks', 'statistics', 'numpy', 'testing', 'visualization'], localOnly: true,
    milestones: [
      milestone('neural-tensors', 'Dense layer', 'Implement vectorized affine layers with shape contracts.', ['Represent batches as rows.', 'Initialize reproducibly.', 'Test hand-worked values.'], ['Shapes work across batch sizes.', 'No example loop is needed.', 'Bad dimensions fail clearly.'], 5),
      milestone('neural-loss', 'Stable loss', 'Implement ReLU, softmax, and cross-entropy safely.', ['Shift softmax logits.', 'Stabilize logarithms.', 'Separate logits and probabilities.'], ['Probabilities sum to one.', 'Extreme values stay finite.', 'Loss matches fixtures.'], 5, ['neural-tensors']),
      milestone('neural-backprop', 'Gradient checks', 'Derive and implement every parameter gradient.', ['Cache forward values.', 'Compare finite differences.', 'Set an error threshold.'], ['All parameters pass.', 'Shapes match.', 'Labels are not mutated.'], 8, ['neural-loss']),
      milestone('neural-training', 'Training diagnostics', 'Train mini-batches and record loss, accuracy, and gradient norms.', ['Shuffle reproducibly.', 'Separate validation.', 'Save history.'], ['Loss improves.', 'Validation is update-free.', 'Seeds reproduce.'], 7, ['neural-backprop']),
      milestone('neural-release', 'Technical report', 'Analyze classes, plot learning curves, and compare a framework baseline.', ['Report per-class metrics.', 'Explain fit signals.', 'Document math limits.'], ['Target behavior is verified.', 'Plots regenerate.', 'Comparison uses the same split.'], 7, ['neural-training']),
    ],
  }),
  project({
    id: 'flappy-ai', title: 'Flappy Bird AI', stageId: 'stage-7', summary: 'Train and evaluate an agent in a local Flappy Bird environment.', outcome: 'A Pygame/NEAT system with tested physics, state encoding, fitness, checkpoints, logs, and multi-seed evaluation.', estimatedHours: 36, environment: 'desktop', packageName: 'flappy_ai', resultPath: 'reports/evaluation.json', prerequisiteModuleIds: ['m6-networks', 'm7-flappy'], prerequisiteLessonIds: ['fitness-design', 'neat-workflow'], skills: ['algorithms', 'machine-learning', 'neural-networks', 'testing', 'visualization'], localOnly: true,
    milestones: [
      milestone('flappy-environment', 'Game environment', 'Build deterministic reset, step, collision, and scoring.', ['Separate simulation and rendering.', 'Use fixed time steps.', 'Expose a standard transition result.'], ['Headless tests run.', 'Seeds reproduce obstacles.', 'Collision boundaries are tested.'], 8),
      milestone('flappy-state', 'State and actions', 'Encode only information available to the bird.', ['Normalize distances and velocity.', 'Avoid future information.', 'Document ranges.'], ['Observation shape is stable.', 'No renderer objects leak.', 'A rule agent can act.'], 5, ['flappy-environment']),
      milestone('flappy-fitness', 'Fitness design', 'Reward progress without stalling loopholes.', ['List reward hacks.', 'Penalize non-progress.', 'Log reward components.'], ['Stationary play cannot score forever.', 'Pipe progress is rewarded.', 'Trajectories reproduce fitness.'], 5, ['flappy-state']),
      milestone('flappy-train', 'NEAT training', 'Configure populations, reporters, and resumable checkpoints.', ['Train headlessly.', 'Record generations.', 'Resume checkpoints.'], ['Restart works.', 'Config is versioned.', 'Selection uses training seeds.'], 9, ['flappy-fitness']),
      milestone('flappy-evaluate', 'Unseen evaluation', 'Compare frozen agents on unseen seeds and render a demo.', ['Freeze before evaluation.', 'Report score distributions.', 'Compare random and rule baselines.'], ['Median and variation are shown.', 'Demo uses the frozen agent.', 'Verifier runs headlessly.'], 9, ['flappy-train']),
    ],
  }),
  project({
    id: 'recommender', title: 'Explainable Recommender', stageId: 'stage-7', summary: 'Recommend unseen items and explain why each result appears.', outcome: 'A popularity baseline and similarity model with time-aware evaluation, cold-start behavior, and truthful explanations.', estimatedHours: 28, environment: 'local-venv', packageName: 'explainable_recommender', resultPath: 'reports/evaluation.json', prerequisiteModuleIds: ['m5-evaluation', 'm7-recommender'], prerequisiteLessonIds: ['recommender-baseline', 'similarity-evaluation'], skills: ['machine-learning', 'algorithms', 'data-analysis', 'statistics', 'linear-algebra', 'responsible-ai'], localOnly: true,
    milestones: [
      milestone('recommender-data', 'Interaction contract', 'Validate users, items, interactions, timestamps, and metadata.', ['Define positive feedback.', 'Deduplicate deliberately.', 'Split by time.'], ['Future events stay held out.', 'Unknown entities are handled.', 'Quality counts reconcile.'], 4),
      milestone('recommender-baseline', 'Popularity baseline', 'Rank unseen candidates with deterministic ties.', ['Filter consumed items.', 'Handle fewer than k.', 'Measure coverage.'], ['No holdout leakage occurs.', 'Ties are stable.', 'Cold start is documented.'], 4, ['recommender-data'], true),
      milestone('recommender-similarity', 'Personalization', 'Create similarity and personalized rankings.', ['Normalize vectors.', 'Exclude self and seen items.', 'Bound neighbors.'], ['Fixtures give expected neighbors.', 'Sparse users work.', 'Scores are explained.'], 7, ['recommender-baseline']),
      milestone('recommender-evaluate', 'Ranking metrics', 'Measure precision@k, recall@k, coverage, and slices.', ['Use later holdout events.', 'Compare popularity.', 'Report unevaluable users.'], ['Denominators are explicit.', 'Variation is included.', 'Losing models are reported honestly.'], 6, ['recommender-similarity']),
      milestone('recommender-explain', 'Explanations and release', 'Attach traceable reasons and document risks.', ['Use real model signals.', 'Avoid causal claims.', 'Document privacy and filter bubbles.'], ['Reasons are traceable.', 'Known and unknown users work.', 'Verifier confirms metrics.'], 7, ['recommender-evaluate']),
    ],
  }),
  project({
    id: 'magis-tool', title: 'Magis Data Productivity Tool', stageId: 'stage-7', summary: 'Build a maintainable local tool around one repetitive Magis Data workflow.', outcome: 'A tested application with a narrow contract, preview mode, useful interface, logs, documentation, and measured time savings.', estimatedHours: 26, environment: 'local-venv', packageName: 'magis_tool', resultPath: 'reports/workflow-result.json', prerequisiteModuleIds: ['m1-quality', 'm3-pipeline', 'm7-professional'], prerequisiteLessonIds: ['tests-as-reasons', 'clean-pipeline', 'maintainable-project'], skills: ['functions', 'testing', 'apis', 'data-analysis', 'automation', 'cli', 'logging', 'security'], localOnly: true,
    milestones: [
      milestone('magis-discovery', 'Workflow contract', 'Define actors, inputs, outputs, failure cost, and excluded scope.', ['Measure the manual workflow.', 'Anonymize fixtures.', 'Define preview and rollback.'], ['Success is measurable.', 'Scope is narrow.', 'Sensitive and destructive paths are identified.'], 4),
      milestone('magis-domain', 'Pure transformation', 'Implement typed business logic independent from I/O.', ['Define models.', 'Collect validation issues.', 'Create realistic fixtures.'], ['Core behavior is deterministic.', 'Invalid records do not create hidden output.', 'Tests explain real rules.'], 6, ['magis-discovery']),
      milestone('magis-boundaries', 'Safe boundaries', 'Add file or API adapters with validation, dry run, and idempotence.', ['Keep credentials external.', 'Write atomically.', 'Avoid sensitive logs.'], ['Dry run previews all changes.', 'Repeats do not duplicate work.', 'Partial failures are visible.'], 6, ['magis-domain']),
      milestone('magis-interface', 'Local interface', 'Provide a CLI or local UI with preview, confirmation, and summaries.', ['Optimize the main path.', 'Use actionable errors.', 'Use non-color statuses.'], ['A colleague can follow the README.', 'Destructive actions require confirmation.', 'Totals reconcile.'], 5, ['magis-boundaries']),
      milestone('magis-release', 'Operational release', 'Verify, document, measure, and prepare handoff.', ['Run cleanly.', 'Compare time and errors.', 'Document support boundaries.'], ['No machine-specific paths exist.', 'Benefits and limits are measured.', 'Evidence is complete.'], 5, ['magis-interface']),
    ],
  }),
]

export const projectById = Object.fromEntries(projects.map((item) => [item.id, item])) as Record<string, Project>

export function validateProjects() {
  const ids = new Set<string>()
  for (const item of projects) {
    if (ids.has(item.id)) throw new Error(`Duplicate project ${item.id}`)
    ids.add(item.id)
    if (item.milestones.length < 5) throw new Error(`Project ${item.id} needs at least five milestones`)
    if (item.rubric.reduce((total, criterion) => total + criterion.weight, 0) !== 100) throw new Error(`Project ${item.id} rubric must total 100`)
    if (item.setup.length < 3 || item.deliverables.length < 4 || !item.starterBundlePath) throw new Error(`Project ${item.id} is missing setup or deliverables`)
    const milestoneIds = new Set(item.milestones.map((entry) => entry.id))
    if (milestoneIds.size !== item.milestones.length) throw new Error(`Project ${item.id} has duplicate milestone IDs`)
    for (const entry of item.milestones) {
      if (!entry.instructions.length || !entry.acceptanceCriteria.length || !entry.evidence.some((evidence) => evidence.required)) throw new Error(`Incomplete milestone ${item.id}/${entry.id}`)
      for (const prerequisiteId of entry.prerequisiteMilestoneIds) if (!milestoneIds.has(prerequisiteId)) throw new Error(`Missing milestone prerequisite ${item.id}/${prerequisiteId}`)
    }
  }
  return true
}

export const projectEnvironments = projects.map((item) => item.environment) as EnvironmentKind[]
export const projectSkillIds = projects.flatMap((item) => item.skills) as SkillId[]
