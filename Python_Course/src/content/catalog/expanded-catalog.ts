import type { Assessment, CourseModule, CourseStage, Lesson, SkillId } from '../../domain/course-types'
import { professionalExerciseByModule } from '../professional-exercises'

type Topic = { id: string; title: string; focus: string; practice: string }
type ModuleSpec = {
  id: string
  stageId: string
  title: string
  description: string
  prerequisiteIds: string[]
  skills: SkillId[]
  topics: [Topic, Topic, Topic, Topic]
  projectId: string
  resources?: string[]
  local?: boolean
}

const topic = (id: string, title: string, focus: string, practice: string): Topic => ({ id, title, focus, practice })

function buildAssessmentQuestion(spec: ModuleSpec, item: Topic, index: number): Assessment['questionPool'][number] {
  const concepts = item.focus.split(',').map((concept) => concept.trim()).filter(Boolean)
  const first = concepts[0] ?? item.title
  const middle = concepts[Math.floor(concepts.length / 2)] ?? item.title
  const last = concepts.at(-1) ?? item.title
  const distractors = [
    `Apply ${first}, but ignore ${last} and any boundary cases.`,
    `Treat ${middle} as interchangeable with ${first}; a separate contract is unnecessary.`,
    `Validate one successful example, then assume ${last} cannot change the result.`,
  ]
  const correctIndex = ((index + spec.id.length) % 4) as 0 | 1 | 2 | 3
  const choices = [...distractors]
  choices.splice(correctIndex, 0, item.focus)
  const promptLead = [
    'Which approach best preserves the required contract?',
    'Which review comment identifies the knowledge the implementation must apply?',
    'Which reasoning should guide both the implementation and its tests?',
    'Which set of ideas addresses the important behavior and boundaries?',
  ][index]

  return {
    id: `${spec.id}-question-${index + 1}`,
    prompt: `${item.practice} ${promptLead}`,
    choices: choices as [string, string, string, string],
    correctIndex,
    explanation: `A complete solution applies ${item.focus}. The alternatives each discard a named boundary, merge concepts that need separate reasoning, or infer correctness from one happy-path example.`,
    skillIds: spec.skills,
  }
}

const specs: ModuleSpec[] = [
  { id: 'm0-exam', stageId: 'stage-0', title: 'Exam literacy and precise tracing', description: 'Read Python questions exactly and distinguish syntax, runtime behavior, and output.', prerequisiteIds: ['m0-tracing'], skills: ['syntax', 'console-io'], projectId: 'word-insight', topics: [
    topic('numerals', 'Numeral systems and literals', 'decimal, binary, octal, hexadecimal, separators, and numeric literal validity', 'Convert values between bases and predict the value of mixed numeric literals.'),
    topic('bitwise', 'Bitwise operations', 'binary representation, &, |, ^, ~, shifts, masks, and precedence', 'Build and explain small permission masks without confusing Boolean and bitwise operations.'),
    topic('console', 'Console input and output', 'input strings, explicit conversion, print separators, endings, and formatting', 'Write a robust console interaction and trace conversion failures.'),
    topic('trace', 'Timed code tracing', 'evaluation order, mutation, short-circuiting, exceptions, and exact printed output', 'Complete a timed set and annotate the rule used for every line.'),
  ] },
  { id: 'm1-text-collections', stageId: 'stage-1', title: 'Strings and collections in depth', description: 'Use Python collection semantics confidently, including copies, comprehensions, and deterministic transformations.', prerequisiteIds: ['m1-data'], skills: ['strings', 'dictionaries', 'nested-data', 'sorting'], projectId: 'sports-table', topics: [
    topic('unicode', 'Unicode and text boundaries', 'code points, encodings, normalization awareness, casefold, and UTF-8 files', 'Normalize user-visible identifiers without pretending all text rules are universal.'),
    topic('copies', 'Aliasing, shallow copies, and nested mutation', 'identity, equality, copying containers, and shared nested values', 'Predict and repair a nested-data mutation bug.'),
    topic('comprehensions', 'Comprehensions with intent', 'list, set, and dictionary comprehensions, filters, nested readability, and scope', 'Replace repetitive transformations while keeping complex logic readable.'),
    topic('collection-tools', 'High-value collection operations', 'unpacking, enumerate, zip, membership, stable sorting, and key functions', 'Transform parallel records into a deterministic ranked report.'),
  ] },
  { id: 'm2-functions-advanced', stageId: 'stage-2', title: 'Advanced functions and iteration', description: 'Build reusable APIs with precise signatures, closures, iterators, generators, and decorators.', prerequisiteIds: ['m0-functions'], skills: ['functions', 'iterators', 'generators', 'decorators'], projectId: 'route-finder', topics: [
    topic('signatures', 'Advanced function signatures', 'positional-only, keyword-only, defaults, variadic arguments, and argument binding', 'Design a public function that prevents ambiguous calls.'),
    topic('scope-closures', 'Scope and closures', 'LEGB lookup, nonlocal state, late binding, and closure use cases', 'Diagnose a late-binding callback bug and build a safe function factory.'),
    topic('iterators', 'Iterator protocol', 'iter, next, StopIteration, iterable versus iterator, and one-pass behavior', 'Implement a small iterator and prove why it cannot be reused automatically.'),
    topic('generators', 'Generators and lazy pipelines', 'yield, generator expressions, send boundaries, laziness, and memory trade-offs', 'Build a lazy record pipeline and test exhaustion behavior.'),
  ] },
  { id: 'm2-algorithm-patterns', stageId: 'stage-2', title: 'Algorithm patterns', description: 'Recognize reusable problem-solving patterns beyond individual algorithms.', prerequisiteIds: ['m2-structures'], skills: ['algorithms', 'complexity', 'testing'], projectId: 'route-finder', resources: ['visualgo', 'big-o'], topics: [
    topic('two-pointer', 'Two-pointer and sliding-window problems', 'window invariants, monotonic movement, counts, and boundary handling', 'Solve a longest-valid-window problem and state its invariant.'),
    topic('hashing', 'Hash-based lookup patterns', 'frequency maps, complement lookup, grouping, and expected complexity', 'Replace a quadratic pair search with a dictionary-backed solution.'),
    topic('heap', 'Priority queues and top-k', 'heap invariants, push/pop, nlargest trade-offs, and deterministic ties', 'Maintain the best k results from a stream.'),
    topic('trees', 'Trees and recursive structure', 'nodes, traversals, depth, balanced reasoning, and iterative alternatives', 'Implement one traversal both recursively and iteratively.'),
  ] },
  { id: 'm3-modules-files', stageId: 'stage-3', title: 'Modules, files, and serialization', description: 'Organize code and work safely with text, binary data, paths, and common formats.', prerequisiteIds: ['m1-errors'], skills: ['modules', 'packages', 'files', 'exceptions'], projectId: 'sports-collector', topics: [
    topic('imports', 'Imports and namespaces', 'module search, aliases, __name__, import side effects, and public APIs', 'Split a script into modules without introducing circular imports.'),
    topic('pathlib', 'Paths and filesystem boundaries', 'Path objects, relative versus absolute paths, traversal, metadata, and safe output locations', 'Build a platform-independent file discovery function.'),
    topic('text-binary', 'Text and binary files', 'encodings, newline handling, bytes, seek, buffering, and context managers', 'Explain and repair a text-versus-bytes failure.'),
    topic('formats', 'CSV, JSON, and schema validation', 'dialects, serialization limits, type restoration, versioned schemas, and malformed records', 'Convert a CSV fixture into validated versioned JSON.'),
  ] },
  { id: 'm3-exceptions-oop', stageId: 'stage-3', title: 'Advanced exceptions and OOP', description: 'Design class systems and error hierarchies that remain understandable as software grows.', prerequisiteIds: ['m1-quality'], skills: ['exceptions', 'oop', 'typing'], projectId: 'sports-table', topics: [
    topic('exception-hierarchy', 'Exception hierarchy and chaining', 'BaseException, Exception, custom errors, else/finally, chaining, and cleanup', 'Create a small domain error hierarchy and preserve root causes.'),
    topic('inheritance', 'Inheritance and method resolution', 'overriding, super, MRO, mixins, and fragile hierarchy warning signs', 'Trace cooperative method calls in a multiple-inheritance example.'),
    topic('polymorphism', 'Polymorphism and protocols', 'duck typing, substitution, composition, abstract interfaces, and capability design', 'Replace a type-switching conditional with a shared protocol.'),
    topic('properties', 'Properties, dataclasses, and object invariants', 'managed attributes, dataclass options, immutability, equality, and validation', 'Model a value object that cannot enter an invalid state.'),
  ] },
  { id: 'm3-packages', stageId: 'stage-3', title: 'Packages and reusable libraries', description: 'Turn modules into installable packages with stable APIs and clear version boundaries.', prerequisiteIds: ['m3-modules-files'], skills: ['packages', 'packaging', 'testing'], projectId: 'word-insight', topics: [
    topic('layout', 'Package layouts', 'src layout, __init__, public imports, internal modules, and test placement', 'Design a package tree for one existing project.'),
    topic('pyproject', 'pyproject.toml fundamentals', 'build systems, project metadata, dependencies, optional groups, and entry points', 'Create metadata for an installable CLI package.'),
    topic('versions', 'Versions and compatibility', 'semantic versioning, deprecation, changelogs, constraints, and lock-file roles', 'Plan a breaking API change without surprising users.'),
    topic('distribution', 'Build and inspect distributions', 'sdist, wheel, build artifacts, package contents, and local installation tests', 'Build a package locally and inspect what it actually contains.'),
  ] },
  { id: 'm4-typing-packaging', stageId: 'stage-4', title: 'Typing and professional standards', description: 'Use types, documentation, and standards to communicate contracts and catch defects earlier.', prerequisiteIds: ['m3-packages'], skills: ['typing', 'packaging', 'testing'], projectId: 'magis-tool', topics: [
    topic('annotations', 'Type annotations that clarify contracts', 'built-in generics, unions, optionals, aliases, return types, and gradual typing', 'Annotate a data pipeline and identify what types cannot prove.'),
    topic('protocols', 'Protocols, generics, and typed records', 'Protocol, TypeVar, Generic, TypedDict, and structural compatibility', 'Define a reusable typed boundary for a storage adapter.'),
    topic('documentation', 'Documentation as an interface', 'docstrings, examples, README structure, API references, and decision records', 'Document a function so its edge cases are testable without reading source.'),
    topic('standards', 'PEP conventions and code review', 'style consistency, naming, imports, linting, review scope, and justified exceptions', 'Review a patch for correctness, clarity, and unnecessary change.'),
  ] },
  { id: 'm4-decorators-context', stageId: 'stage-4', title: 'Decorators and context management', description: 'Encapsulate cross-cutting behavior without hiding control flow.', prerequisiteIds: ['m2-functions-advanced'], skills: ['decorators', 'functions', 'exceptions'], projectId: 'magis-tool', topics: [
    topic('function-decorators', 'Function decorators', 'higher-order functions, wrappers, functools.wraps, arguments, and return preservation', 'Write a timing decorator that keeps metadata and propagates errors.'),
    topic('class-decorators', 'Class decorators and descriptors', 'class transformation, descriptor protocol, attribute access, and appropriate restraint', 'Trace a validating descriptor before deciding whether a property is simpler.'),
    topic('context-managers', 'Context managers', 'enter/exit, exception handling, contextlib, resource ownership, and nested contexts', 'Build a context manager that restores state after failure.'),
    topic('cross-cutting', 'Cross-cutting concerns without magic', 'logging, retries, transactions, metrics, and explicit alternatives', 'Choose between decorator, context manager, helper, and direct code for four cases.'),
  ] },
  { id: 'm4-concurrency', stageId: 'stage-4', title: 'Concurrency and asynchronous Python', description: 'Choose threads, processes, or async work based on the actual bottleneck.', prerequisiteIds: ['m4-typing-packaging'], skills: ['concurrency', 'exceptions', 'testing'], projectId: 'sports-collector', topics: [
    topic('model', 'Concurrency mental models', 'tasks, scheduling, parallelism, I/O-bound versus CPU-bound work, and shared state', 'Classify workloads and predict where concurrency will not help.'),
    topic('futures', 'Threads, processes, and futures', 'executors, submitted work, result ordering, exceptions, cancellation, and process costs', 'Parallelize independent work while preserving deterministic output.'),
    topic('asyncio', 'asyncio foundations', 'coroutines, await, tasks, gathering, timeouts, cancellation, and event-loop blocking', 'Build a bounded asynchronous fixture collector.'),
    topic('safety', 'Concurrency safety and testing', 'races, locks, queues, immutability, deadlocks, and deterministic tests', 'Reproduce and repair a lost-update race.'),
  ] },
  { id: 'm4-gui-performance', stageId: 'stage-4', title: 'GUI, debugging, and performance', description: 'Build event-driven interfaces and improve slow code with evidence rather than guesses.', prerequisiteIds: ['m4-typing-packaging'], skills: ['oop', 'debugging', 'testing'], projectId: 'magis-tool', topics: [
    topic('gui-events', 'Event-driven GUI foundations', 'event loops, widgets, callbacks, state, layout, and main-thread rules', 'Sketch a Tkinter workflow with testable domain logic.'),
    topic('debugger', 'Debugger workflows', 'breakpoints, stepping, watches, call stacks, conditional breaks, and post-mortem diagnosis', 'Find a nested-state defect with a debugger instead of print statements.'),
    topic('profiling', 'Profiling CPU and memory', 'measurement baselines, cProfile, timeit, allocation thinking, and representative workloads', 'Profile two implementations and explain the actual bottleneck.'),
    topic('optimization', 'Optimization with constraints', 'algorithm first, caching, vectorization, batching, readability, and regression benchmarks', 'Improve measured performance without changing behavior.'),
  ] },
  { id: 'm5-test-foundations', stageId: 'stage-5', title: 'unittest and test design', description: 'Build a disciplined testing vocabulary and robust standard-library test suites.', prerequisiteIds: ['m1-quality'], skills: ['testing', 'exceptions', 'debugging'], projectId: 'sports-table', resources: ['pytest-docs'], topics: [
    topic('test-levels', 'Test levels and purposes', 'unit, integration, system, acceptance, regression, and risk-based selection', 'Choose the smallest useful test level for real failure scenarios.'),
    topic('unittest', 'unittest structure', 'TestCase, assertions, setup, teardown, discovery, subtests, and exception checks', 'Build a unittest suite for a stateful domain object.'),
    topic('boundaries', 'Boundary and equivalence design', 'valid partitions, invalid partitions, boundaries, decision tables, and state transitions', 'Derive cases from a contract before writing implementation.'),
    topic('failures', 'Readable failures and defect reports', 'expected versus actual, minimal reproduction, test names, diagnostics, and flaky-test evidence', 'Turn a vague failure into a reproducible defect report.'),
  ] },
  { id: 'm5-pytest', stageId: 'stage-5', title: 'pytest in real projects', description: 'Use fixtures, parametrization, markers, and suite organization without creating hidden coupling.', prerequisiteIds: ['m5-test-foundations'], skills: ['testing', 'packages'], projectId: 'route-finder', resources: ['pytest-docs'], topics: [
    topic('assertions', 'pytest assertions and parametrization', 'assert rewriting, parameter IDs, matrices, exception matching, and focused cases', 'Compress repeated cases without hiding why each matters.'),
    topic('fixtures', 'Fixture design and scope', 'dependency injection, yield cleanup, scope, factories, and fixture overuse', 'Replace shared mutable setup with explicit fixture factories.'),
    topic('organization', 'Suite organization and markers', 'test layout, markers, selection, configuration, plugins, and slow/integration boundaries', 'Create predictable commands for fast and complete suites.'),
    topic('coverage', 'Coverage as a question', 'line and branch coverage, untested risks, mutation thinking, and false confidence', 'Use a coverage gap to find an untested business decision.'),
  ] },
  { id: 'm5-mocking-tdd', stageId: 'stage-5', title: 'Mocks, TDD, and behavior', description: 'Control external boundaries and use test-first feedback without overfitting tests to implementation.', prerequisiteIds: ['m5-pytest'], skills: ['testing', 'apis', 'files'], projectId: 'sports-collector', topics: [
    topic('test-doubles', 'Test doubles and boundaries', 'stubs, fakes, spies, mocks, contracts, and choosing the seam', 'Replace a live HTTP dependency with a realistic fake.'),
    topic('patching', 'Patching without brittle tests', 'where to patch, autospec concepts, call assertions, context managers, and cleanup', 'Repair a mock that patches the definition instead of the lookup site.'),
    topic('tdd', 'Test-driven development', 'red-green-refactor, smallest step, triangulation, and design feedback', 'Implement one behavior through a documented TDD cycle.'),
    topic('bdd', 'Behavior examples and acceptance tests', 'Given-When-Then, executable examples, business language, and avoiding duplicate layers', 'Turn a workflow rule into a precise acceptance scenario.'),
  ] },
  { id: 'm6-cli', stageId: 'stage-6', title: 'Command-line applications', description: 'Create composable CLI tools with predictable streams, exit codes, configuration, and help.', prerequisiteIds: ['m3-packages'], skills: ['cli', 'console-io', 'testing'], projectId: 'word-insight', topics: [
    topic('argparse', 'argparse and command structure', 'options, positional arguments, subcommands, defaults, validation, and generated help', 'Design a CLI with one clear happy path and actionable misuse errors.'),
    topic('streams', 'stdin, stdout, and stderr', 'piping, text streams, diagnostics, machine-readable output, and broken-pipe behavior', 'Make a command useful both to people and shell pipelines.'),
    topic('exit-codes', 'Exit codes and failure contracts', 'success, user error, operational error, partial results, and exception boundaries', 'Map domain failures to stable process behavior.'),
    topic('config', 'Configuration precedence', 'arguments, environment, files, defaults, validation, and secret handling', 'Implement explicit configuration precedence and display safe effective settings.'),
  ] },
  { id: 'm6-filesystem-automation', stageId: 'stage-6', title: 'Filesystem and process automation', description: 'Automate local workflows safely with dry runs, idempotence, atomic writes, and controlled subprocesses.', prerequisiteIds: ['m6-cli'], skills: ['automation', 'files', 'security'], projectId: 'magis-tool', topics: [
    topic('discovery', 'Filesystem discovery', 'glob patterns, traversal, symlinks, metadata, ordering, and permission failures', 'Discover candidate files deterministically without following unsafe loops.'),
    topic('transforms', 'Safe batch transformations', 'preview plans, backups, atomic replacement, collision policy, and idempotence', 'Build a dry-run rename plan that cannot silently overwrite files.'),
    topic('subprocess', 'Controlled subprocesses', 'argument lists, shell risks, capture, timeouts, return codes, and environment isolation', 'Run a trusted tool without shell injection or hidden hangs.'),
    topic('recovery', 'Recovery and resumability', 'checkpoints, journals, partial failure, retries, rollback boundaries, and reconciliation', 'Resume a multi-file workflow without duplicating completed work.'),
  ] },
  { id: 'm6-logging-scheduling', stageId: 'stage-6', title: 'Logging, scheduling, and notifications', description: 'Operate automation repeatedly with observable behavior and sustainable failure policies.', prerequisiteIds: ['m6-filesystem-automation'], skills: ['logging', 'automation', 'exceptions'], projectId: 'magis-tool', topics: [
    topic('logging', 'Structured logging', 'levels, handlers, formatters, context, sensitive fields, and library etiquette', 'Design logs that explain a failed run without exposing secrets.'),
    topic('rotation', 'Log lifecycle and metrics', 'rotation, retention, counters, durations, summaries, and health signals', 'Define a compact operational summary for every run.'),
    topic('scheduling', 'Scheduling reliable jobs', 'task schedulers, working directories, environment differences, overlap, and missed runs', 'Prepare a script to run unattended with explicit paths and locking.'),
    topic('notifications', 'Actionable notifications', 'success silence, failure alerts, deduplication, escalation, and recovery messages', 'Send only notifications that require a decision or action.'),
  ] },
  { id: 'm7-networking', stageId: 'stage-7', title: 'Networking foundations', description: 'Understand sockets and protocols well enough to build and debug safe networked programs.', prerequisiteIds: ['m3-http'], skills: ['networking', 'apis', 'security'], projectId: 'sports-collector', topics: [
    topic('layers', 'Network layers and addressing', 'IP, ports, DNS, TCP, UDP, client/server roles, and latency', 'Trace what must happen before an HTTPS request reaches an application.'),
    topic('sockets', 'Socket programming', 'bind, listen, accept, connect, send/receive, framing, timeouts, and cleanup', 'Build a localhost-only framed echo protocol.'),
    topic('protocols', 'Application protocols', 'message framing, serialization, versioning, idempotence, authentication boundaries, and errors', 'Design a tiny versioned protocol that rejects malformed messages.'),
    topic('diagnosis', 'Network failure diagnosis', 'DNS errors, refused connections, timeouts, partial reads, TLS errors, and retries', 'Classify failures and choose which are safe to retry.'),
  ] },
  { id: 'm7-sqlite-formats', stageId: 'stage-7', title: 'SQLite and structured formats', description: 'Persist trustworthy local data with transactions, parameterized SQL, and explicit schemas.', prerequisiteIds: ['m3-modules-files'], skills: ['sql', 'databases', 'files', 'security'], projectId: 'sports-table', topics: [
    topic('relational', 'Relational modeling', 'tables, rows, keys, constraints, normalization, and relationship choices', 'Turn nested season records into a small relational schema.'),
    topic('queries', 'SQL queries and parameters', 'select, filter, sort, aggregate, join, placeholders, and injection prevention', 'Write parameterized queries for standings and trends.'),
    topic('transactions', 'Transactions and consistency', 'commit, rollback, atomicity, connection scope, migrations, and concurrent access', 'Import a season atomically and prove failed rows do not leave partial data.'),
    topic('xml-csv', 'CSV and XML interoperability', 'stream parsing, namespaces, dialects, validation, and round-trip limitations', 'Convert supplied XML and CSV fixtures into one validated domain model.'),
  ] },
  { id: 'm7-security', stageId: 'stage-7', title: 'Defensive Python security', description: 'Apply secure-development and defensive-analysis concepts only in authorized environments.', prerequisiteIds: ['m7-networking'], skills: ['security', 'networking', 'files'], projectId: 'sports-collector', topics: [
    topic('threat-model', 'Threat modeling and trust boundaries', 'assets, actors, entry points, abuse cases, controls, and residual risk', 'Threat-model a local collector or automation tool.'),
    topic('crypto', 'Cryptographic foundations', 'encoding versus encryption, hashes, MACs, signatures, salts, secure randomness, and library selection', 'Choose the correct primitive for integrity, passwords, confidentiality, and authenticity.'),
    topic('integrity', 'File integrity and log analysis', 'hash manifests, trusted baselines, structured events, indicators, and evidence preservation', 'Detect changed files in a fixture tree and produce an auditable report.'),
    topic('secure-delivery', 'Dependencies, secrets, and secure delivery', 'dependency review, environment secrets, least privilege, updates, and incident-ready logging', 'Audit a project for leaked secrets and unnecessary privileges.'),
  ] },
  { id: 'm8-numpy', stageId: 'stage-8', title: 'NumPy proficiency', description: 'Use real arrays, broadcasting, vectorization, and numerical validation for data and ML work.', prerequisiteIds: ['m4-arrays'], skills: ['numpy', 'linear-algebra', 'data-analysis'], projectId: 'neural-from-scratch', resources: ['numpy'], local: true, topics: [
    topic('arrays', 'Array creation, dtype, and shape', 'constructors, dtype, ndim, shape, reshape, views, and memory awareness', 'Build arrays with explicit shape and dtype contracts.'),
    topic('indexing', 'Indexing, masks, and assignment', 'slices, fancy indexing, Boolean masks, copies versus views, and mutation', 'Clean numeric outliers without accidental shared-memory changes.'),
    topic('broadcasting', 'Broadcasting and vectorization', 'compatible dimensions, expansion, ufuncs, reductions, and loop replacement', 'Vectorize a feature-standardization pipeline and explain every shape.'),
    topic('numerics', 'Numerical reliability', 'floating-point tolerance, NaN/inf, stable formulas, random generators, and reproducibility', 'Diagnose unstable numeric output and write tolerance-based tests.'),
  ] },
  { id: 'm8-pandas', stageId: 'stage-8', title: 'pandas proficiency', description: 'Build reproducible table transformations with joins, grouping, time data, and validation.', prerequisiteIds: ['m8-numpy'], skills: ['pandas', 'data-analysis', 'files'], projectId: 'sports-dashboard', resources: ['pandas'], local: true, topics: [
    topic('selection', 'DataFrame selection and types', 'indexes, loc/iloc, dtypes, nullable values, conversion, and chained-assignment avoidance', 'Select and convert data while making missingness explicit.'),
    topic('grouping', 'Grouping and aggregation', 'groupby, agg, transform, multi-index results, pivots, and reconciliation', 'Build team-level summaries and reconcile them with source totals.'),
    topic('joins', 'Joins and reshaping', 'merge validation, concat, melt, pivot, duplicate keys, and cardinality', 'Join match and team data while proving row counts are correct.'),
    topic('time', 'Time series and windows', 'datetime parsing, time zones, sorting, resampling, rolling windows, and leakage awareness', 'Create form features using only prior matches.'),
  ] },
  { id: 'm8-data-engineering', stageId: 'stage-8', title: 'SQL and data-engineering workflows', description: 'Move data through validated, reproducible pipelines with clear lineage and quality checks.', prerequisiteIds: ['m8-pandas', 'm7-sqlite-formats'], skills: ['sql', 'databases', 'pandas', 'testing'], projectId: 'sports-dashboard', local: true, topics: [
    topic('advanced-sql', 'Analytical SQL', 'CTEs, window functions, conditional aggregation, query plans, and readable decomposition', 'Compute rankings and rolling metrics in SQL.'),
    topic('pipeline', 'Extract-transform-load design', 'raw, staging, clean, serving layers, idempotence, partitioning, and checkpoints', 'Design a rerunnable local ETL pipeline.'),
    topic('quality', 'Data-quality contracts', 'schema, uniqueness, nullability, ranges, relationships, freshness, and reconciliation', 'Turn assumptions into executable quality checks.'),
    topic('lineage', 'Lineage and reproducibility', 'source identity, versions, transformations, manifests, hashes, and environment capture', 'Produce a manifest that explains exactly how a report was generated.'),
  ] },
  { id: 'm9-inference', stageId: 'stage-9', title: 'Statistical inference', description: 'Reason from samples while stating assumptions, uncertainty, and practical meaning.', prerequisiteIds: ['m4-statistics'], skills: ['statistics', 'data-analysis'], projectId: 'sports-dashboard', resources: ['statquest'], topics: [
    topic('distributions', 'Distributions and simulation', 'random variables, common distributions, expectation, variance, simulation, and model fit', 'Simulate a sports process and compare empirical and theoretical behavior.'),
    topic('intervals', 'Confidence intervals', 'sampling distributions, standard errors, bootstrap intervals, interpretation, and assumptions', 'Construct and explain an interval without claiming probability about a fixed parameter.'),
    topic('hypotheses', 'Hypothesis tests and effect sizes', 'null models, p-values, errors, power, multiple testing, and practical significance', 'Evaluate a difference with both uncertainty and effect size.'),
    topic('relationships', 'Correlation and regression reasoning', 'association, confounding, residuals, assumptions, and causal restraint', 'Analyze a relationship and name plausible confounders.'),
  ] },
  { id: 'm9-visualization', stageId: 'stage-9', title: 'Visualization in Python', description: 'Create accessible static and interactive visual explanations with validated choices.', prerequisiteIds: ['m4-visuals', 'm8-pandas'], skills: ['visualization', 'pandas', 'statistics'], projectId: 'sports-dashboard', local: true, topics: [
    topic('matplotlib', 'Matplotlib foundations', 'figures, axes, marks, scales, labels, layouts, and export', 'Build a publication-ready single-series trend chart.'),
    topic('seaborn', 'Statistical visualization', 'long-form data, distributions, categorical comparisons, relationships, and uncertainty', 'Compare groups without hiding distributions.'),
    topic('accessibility', 'Accessible chart systems', 'contrast, color independence, legends, direct labels, table alternatives, and responsive export', 'Audit and repair a chart for color and reading accessibility.'),
    topic('story', 'Dashboard composition and narrative', 'question hierarchy, filters, small multiples, annotation, cognitive load, and limitations', 'Compose three coordinated views around one decision.'),
  ] },
  { id: 'm10-ml-applied', stageId: 'stage-10', title: 'Applied machine learning', description: 'Build end-to-end scikit-learn systems with preprocessing, tuning, calibration, and interpretation.', prerequisiteIds: ['m5-evaluation', 'm8-data-engineering'], skills: ['machine-learning', 'pandas', 'testing'], projectId: 'sports-predictor', resources: ['sklearn'], local: true, topics: [
    topic('pipelines', 'Preprocessing pipelines', 'column transformations, encoding, scaling, imputation, leakage prevention, and schema checks', 'Build mixed-type preprocessing that fits training data only.'),
    topic('validation', 'Model selection and validation', 'cross-validation, time splits, search spaces, nested concerns, and reproducibility', 'Tune a model without using the final holdout.'),
    topic('calibration', 'Probabilities and calibration', 'decision scores, calibration curves, thresholds, costs, and uncertainty', 'Choose a threshold based on error cost rather than accuracy alone.'),
    topic('interpretation', 'Interpretation and monitoring', 'feature importance limits, permutation methods, partial dependence concepts, drift, and model cards', 'Explain a model without turning association into causation.'),
  ] },
  { id: 'm10-nlp', stageId: 'stage-10', title: 'NLP and embeddings', description: 'Represent, classify, retrieve, and evaluate text with classical and modern techniques.', prerequisiteIds: ['m10-ml-applied'], skills: ['nlp', 'machine-learning', 'linear-algebra'], projectId: 'recommender', local: true, topics: [
    topic('text-pipeline', 'Text preprocessing and baselines', 'tokenization choices, leakage, bag-of-words, TF-IDF, linear models, and evaluation', 'Build a strong text-classification baseline.'),
    topic('embeddings', 'Embeddings and similarity', 'dense representations, cosine similarity, normalization, nearest neighbors, and semantic limitations', 'Create a semantic retrieval prototype and inspect false matches.'),
    topic('sequence', 'Sequence and transformer concepts', 'tokens, context, attention intuition, encoders, decoders, and computational trade-offs', 'Trace a simplified attention calculation and its shapes.'),
    topic('evaluation', 'NLP evaluation and data quality', 'class metrics, retrieval metrics, human review, label ambiguity, bias, and distribution shift', 'Design evaluation that includes both metrics and reviewed examples.'),
  ] },
  { id: 'm10-generative-ai', stageId: 'stage-10', title: 'Generative AI and responsible applications', description: 'Build useful LLM application patterns with explicit evaluation, security, privacy, and human oversight.', prerequisiteIds: ['m10-nlp'], skills: ['generative-ai', 'responsible-ai', 'security'], projectId: 'magis-tool', local: true, topics: [
    topic('llm-basics', 'LLM application foundations', 'tokens, context windows, prompting, sampling, hallucination, grounding, and cost', 'Choose where deterministic code must surround model judgment.'),
    topic('rag-tools', 'Retrieval and tool use', 'chunking, retrieval, citations, structured outputs, tool contracts, and failure handling', 'Design a small grounded assistant with verifiable sources.'),
    topic('prompt-security', 'Prompt injection and data boundaries', 'untrusted instructions, tool permissions, secret isolation, output validation, and least privilege', 'Threat-model a tool-using assistant and restrict its capabilities.'),
    topic('responsible-ai', 'Evaluation and responsible AI', 'task metrics, red-team cases, bias, privacy, transparency, human review, and rollback', 'Create an evaluation set that can disprove an impressive demo.'),
  ] },
  { id: 'm11-portfolio', stageId: 'stage-11', title: 'Portfolio engineering', description: 'Turn course projects into maintainable evidence of independent engineering ability.', prerequisiteIds: ['m7-professional', 'm10-generative-ai'], skills: ['testing', 'packaging', 'debugging'], projectId: 'magis-tool', topics: [
    topic('selection', 'Select and scope portfolio work', 'audience, problem value, technical evidence, privacy, exclusions, and definition of done', 'Choose projects that demonstrate different capabilities without inflating scope.'),
    topic('quality-gates', 'Release quality gates', 'clean setup, tests, lint, typing, security checks, reproducibility, and artifacts', 'Build a release checklist that fails loudly.'),
    topic('demonstration', 'Technical demonstrations', 'README narrative, architecture diagrams, screenshots, sample data, limitations, and live explanation', 'Prepare a five-minute demo that includes one failure case.'),
    topic('reflection', 'Evidence-based reflection', 'decisions, trade-offs, mistakes, measured improvements, remaining gaps, and next iteration', 'Write a reflection that proves learning rather than only completion.'),
  ] },
  { id: 'm11-cert-core', stageId: 'stage-11', title: 'Core Python certification review', description: 'Consolidate entry, associate, and professional Python objectives through original timed practice.', prerequisiteIds: ['m4-gui-performance', 'm7-sqlite-formats'], skills: ['syntax', 'oop', 'modules', 'files', 'testing'], projectId: 'word-insight', topics: [
    topic('pcep', 'PCEP objective synthesis', 'syntax, flow, collections, functions, exceptions, and precise tracing', 'Complete an original timed entry-level simulation and classify every error.'),
    topic('pcap', 'PCAP objective synthesis', 'modules, strings, OOP, exceptions, files, generators, and closures', 'Complete an associate simulation with code-reading and implementation tasks.'),
    topic('pcpp', 'PCPP1 objective synthesis', 'advanced OOP, standards, GUI, networking, logging, formats, and databases', 'Complete a professional-domain readiness audit and targeted lab.'),
    topic('exam-strategy', 'Exam strategy without shortcuts', 'time allocation, question wording, elimination, tracing, uncertainty flags, and post-attempt review', 'Create a strategy from actual attempt evidence rather than confidence alone.'),
  ] },
  { id: 'm11-cert-specialist', stageId: 'stage-11', title: 'Specialist certification review', description: 'Consolidate data, testing, automation, security, and AI objective profiles.', prerequisiteIds: ['m11-cert-core', 'm10-generative-ai'], skills: ['data-analysis', 'testing', 'automation', 'security', 'generative-ai'], projectId: 'magis-tool', topics: [
    topic('data', 'Data certification synthesis', 'NumPy, pandas, SQL, statistics, visualization, quality, and analysis workflows', 'Complete a fixture-based data readiness assessment.'),
    topic('testing-automation', 'Testing and automation synthesis', 'unittest, pytest, mocks, TDD, CLI, OS tools, logging, and scheduling', 'Build and test a safe automation task under time constraints.'),
    topic('security-ai', 'Security and AI synthesis', 'secure development, defensive analysis, ML, NLP, LLMs, prompt security, and responsible use', 'Evaluate a small AI feature through both security and quality lenses.'),
    topic('readiness-plan', 'Evidence-driven readiness plan', 'objective weights, missing evidence, recency, timed performance, weak domains, and scheduling', 'Produce a certificate-specific plan with measurable exit criteria.'),
  ] },
  { id: 'm11-independent-build', stageId: 'stage-11', title: 'Independent build transition', description: 'Move from guided course work to planning, building, validating, and shipping original software.', prerequisiteIds: ['m11-portfolio', 'm11-cert-specialist'], skills: ['functions', 'testing', 'packaging', 'security'], projectId: 'magis-tool', topics: [
    topic('discovery', 'Problem discovery', 'user need, constraints, alternatives, risk, success measures, and smallest valuable scope', 'Write a one-page brief for an original Python product.'),
    topic('architecture', 'Architecture proportional to scope', 'boundaries, data flow, dependencies, deployment shape, failure modes, and simplicity', 'Choose the minimum architecture that satisfies the brief.'),
    topic('execution', 'Milestone execution', 'vertical slices, checkpoints, tests, demos, feedback, and scope control', 'Plan and deliver one complete vertical slice before expanding.'),
    topic('ship', 'Ship, observe, and iterate', 'release, monitoring, support, feedback, maintenance, deprecation, and learning loops', 'Release an original project and define the evidence for its next iteration.'),
  ] },
]

function buildLesson(spec: ModuleSpec, item: Topic, index: number): Lesson {
  const id = `${spec.id}-${item.id}`
  const exerciseId = index === 0 ? professionalExerciseByModule[spec.id] : undefined
  return {
    id,
    moduleId: spec.id,
    title: item.title,
    subtitle: item.focus,
    kind: spec.local ? 'local-lab' : index === 3 ? 'review' : 'challenge',
    minutes: spec.local ? 35 : 25,
    difficulty: Math.min(5, 3 + Math.floor(index / 2)) as Lesson['difficulty'],
    objectives: [
      `Explain ${item.focus}.`,
      `Apply the topic in a fresh ${spec.title.toLowerCase()} problem.`,
      'Test one boundary or failure case and explain why it matters.',
    ],
    explanation: [
      `${item.title} belongs in this module because it supports ${spec.description.toLowerCase()}`,
      `The core focus is ${item.focus}.`,
      'Use a small example first, then verify behavior at a boundary before applying it to a project.',
    ],
    example: `# Focus: ${item.focus}\n# Explain the contract, then implement the smallest verified example.`,
    challenge: item.practice,
    exerciseId,
    evidence: exerciseId
      ? [{ kind: 'exercise', referenceId: exerciseId, required: true }]
      : [{ kind: 'assessment', referenceId: `boss-${spec.id}`, required: true }],
    resourceIds: spec.resources ?? ['python-tutorial'],
    skillIds: spec.skills,
  }
}

export const expandedLessons: Lesson[] = specs.flatMap((spec) => spec.topics.map((item, index) => buildLesson(spec, item, index)))

export const expandedModules: CourseModule[] = specs.map((spec) => ({
  id: spec.id,
  stageId: spec.stageId,
  title: spec.title,
  description: spec.description,
  prerequisiteIds: spec.prerequisiteIds,
  lessonIds: spec.topics.map((item) => `${spec.id}-${item.id}`),
  bossChallenge: `Complete the ${spec.title} evidence assessment and explain corrections for every missed objective.`,
  bossAssessmentId: `boss-${spec.id}`,
  projectId: spec.projectId,
}))

export const stageModuleAdditions = Object.fromEntries(
  Array.from({ length: 12 }, (_, order) => [`stage-${order}`, specs.filter((spec) => spec.stageId === `stage-${order}`).map((spec) => spec.id)]),
) as Record<string, string[]>

export const expandedStages: CourseStage[] = [
  { id: 'stage-8', order: 8, title: 'Data Engineering with Python', description: 'Develop real NumPy, pandas, SQL, data-quality, and reproducible pipeline proficiency.', moduleIds: stageModuleAdditions['stage-8'], accent: '#2f9d86' },
  { id: 'stage-9', order: 9, title: 'Statistics & Visualization', description: 'Reason about uncertainty and communicate evidence through accessible Python visualizations.', moduleIds: stageModuleAdditions['stage-9'], accent: '#c98500' },
  { id: 'stage-10', order: 10, title: 'Machine Learning & AI', description: 'Build trustworthy ML, NLP, neural-network, and generative-AI applications with responsible boundaries.', moduleIds: stageModuleAdditions['stage-10'], accent: '#9085e9' },
  { id: 'stage-11', order: 11, title: 'Portfolio & Certification Readiness', description: 'Consolidate objective evidence, release polished work, and transition to independent software building.', moduleIds: stageModuleAdditions['stage-11'], accent: '#e66767' },
]

export const expandedAssessments: Assessment[] = specs.map((spec) => ({
  id: `boss-${spec.id}`,
  title: `${spec.title} boss assessment`,
  description: `Demonstrate the four ${spec.title.toLowerCase()} objectives before the module counts as proficient.`,
  kind: 'module-boss',
  minutes: 20,
  passingScore: 75,
  prerequisiteIds: [],
  questionPool: spec.topics.map((item, index) => buildAssessmentQuestion(spec, item, index)),
}))
