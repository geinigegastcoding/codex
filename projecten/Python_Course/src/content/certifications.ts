import type { CertificationObjective, CertificationProfile, CredentialStatus } from '../domain/course-types'

const objective = (id: string, title: string, description: string, weight: number, lessonIds: string[] = [], exerciseIds: string[] = [], projectEvidenceIds: string[] = []): CertificationObjective => ({ id, title, description, weight, lessonIds, exerciseIds, assessmentIds: [], projectEvidenceIds })

const profile = (id: string, provider: string, title: string, status: CredentialStatus, officialUrl: string, summary: string, objectives: CertificationObjective[], examCode?: string): CertificationProfile => ({ id, provider, title, status, officialUrl, summary, objectives, examCode, verifiedAt: '2026-07-30' })

const pcepObjectives = [
  objective('fundamentals', 'Computer programming and Python fundamentals', 'Literals, variables, operators, console interaction, data types, and basic program structure.', 18, ['trace-values', 'truthiness-slices', 'function-contracts'], ['count-truthy']),
  objective('control-flow', 'Control flow', 'Conditions, loops, ranges, Boolean logic, and execution tracing.', 29, ['truthiness-slices', 'range-primes'], ['inclusive-primes']),
  objective('collections', 'Data collections', 'Strings, lists, tuples, dictionaries, slicing, and common collection operations.', 25, ['collections-choice', 'nested-aggregation'], ['summarize-orders']),
  objective('functions-exceptions', 'Functions and exceptions', 'Function contracts, parameters, scope foundations, return values, and exception handling.', 28, ['function-contracts', 'raise-or-propagate'], ['safe-average']),
]

export const certifications: CertificationProfile[] = [
  profile('pcep', 'Python Institute', 'PCEP – Certified Entry-Level Python Programmer', 'active', 'https://pythoninstitute.org/pcep', 'Entry-level Python syntax, control flow, collections, functions, and exceptions.', pcepObjectives, 'PCEP-30'),
  profile('pcap', 'Python Institute', 'PCAP – Certified Associate Python Programmer', 'active', 'https://pythoninstitute.org/pcap', 'Associate-level modules, packages, strings, exceptions, files, and object-oriented programming.', [
    objective('modules-packages', 'Modules and packages', 'Imports, namespaces, standard modules, package structure, and distribution concepts.', 25, ['maintainable-project']),
    objective('exceptions-strings', 'Exceptions and strings', 'Exception hierarchy, propagation, Unicode, string methods, and text processing.', 25, ['raise-or-propagate', 'pure-counting'], ['normalize-name']),
    objective('oop', 'Object-oriented programming', 'Classes, inheritance, polymorphism, methods, properties, and exceptions in class designs.', 35, ['objects-state'], ['bank-account']),
    objective('files-generators', 'Files, iterators, generators, and closures', 'Text and binary files plus reusable iteration and functional techniques.', 15, ['json-validation']),
  ], 'PCAP-31'),
  profile('pcpp1', 'Python Institute', 'PCPP1 – Certified Professional Python Programmer 1', 'active', 'https://pythoninstitute.org/pcpp1', 'Professional OOP, coding standards, GUI, networking, files, logging, configuration, and databases.', [
    objective('advanced-oop', 'Advanced object-oriented programming', 'Inheritance, composition, decorators, metaprogramming foundations, and design practices.', 25, ['objects-state', 'maintainable-project'], [], ['magis-tool/magis-domain']),
    objective('standards-quality', 'Standards and engineering quality', 'PEP conventions, documentation, typing, packaging, testing, and maintainability.', 20, ['tests-as-reasons', 'maintainable-project'], ['safe-average'], ['magis-tool/magis-release']),
    objective('gui-network', 'GUI and network programming', 'Event-driven GUI concepts, sockets, protocols, and safe network boundaries.', 20, ['http-model']),
    objective('formats-logging', 'Formats, logging, and configuration', 'CSV, XML, JSON, structured logs, and configuration sources.', 20, ['json-validation', 'collector-design'], [], ['sports-collector/collector-release']),
    objective('database', 'Database programming', 'SQLite connections, transactions, queries, schema design, and safe parameters.', 15),
  ], 'PCPP1-32'),
  profile('pced', 'Python Institute', 'PCED – Certified Entry-Level Data Analyst with Python', 'active', 'https://pythoninstitute.org/pced', 'Entry-level data acquisition, cleaning, NumPy, pandas, statistics, and visualization.', [
    objective('data-foundations', 'Data acquisition and preparation', 'Load, inspect, validate, clean, and reshape structured data.', 30, ['pandas-cleaning', 'clean-pipeline'], [], ['sports-dashboard/dashboard-clean']),
    objective('numpy-pandas', 'NumPy and pandas', 'Array operations, indexing, DataFrames, grouping, joining, and missing values.', 30, ['arrays-vectors', 'pandas-cleaning'], ['moving-average'], ['sports-dashboard/dashboard-analysis']),
    objective('statistics', 'Statistics', 'Center, spread, probability, sampling, and standardized values.', 20, ['summary-statistics', 'probability-sampling'], ['standardize']),
    objective('visualization', 'Visualization', 'Choose, build, and interpret honest charts.', 20, ['chart-choice', 'data-story'], [], ['sports-dashboard/dashboard-visuals']),
  ]),
  profile('pcad', 'Python Institute', 'PCAD – Certified Associate Data Analyst with Python', 'active', 'https://pythoninstitute.org/pcad', 'Associate data analysis with SQL, advanced pandas, statistics, visualization, and reproducible reporting.', [
    objective('advanced-pandas', 'Advanced pandas and transformation', 'Joins, reshaping, grouping, time series, validation, and efficient transformations.', 30, ['pandas-cleaning'], [], ['sports-dashboard/dashboard-clean']),
    objective('sql', 'SQL for analysis', 'Queries, joins, aggregates, window concepts, safe parameters, and data modeling.', 20),
    objective('statistics-analysis', 'Applied statistics', 'Sampling, uncertainty, relationships, experiment reasoning, and limitations.', 25, ['summary-statistics', 'probability-sampling', 'data-story'], ['standardize'], ['sports-dashboard/dashboard-analysis']),
    objective('reporting', 'Visualization and reporting', 'Accessible multi-view analysis with reproducible written conclusions.', 25, ['chart-choice', 'data-story'], [], ['sports-dashboard/dashboard-release']),
  ]),
  profile('pcet', 'Python Institute', 'PCET – Certified Entry-Level Tester with Python', 'active', 'https://pythoninstitute.org/pcet', 'Testing foundations, assertions, unittest, test design, defects, and reporting.', [
    objective('test-foundations', 'Testing foundations', 'Purposes, levels, test cases, defects, expected results, and regression reasoning.', 30, ['tests-as-reasons'], ['safe-average']),
    objective('unittest', 'Python test tools', 'Assertions, setup, teardown, suites, discovery, and exception tests.', 35, ['tests-as-reasons'], ['safe-average', 'bank-account']),
    objective('design-reporting', 'Test design and reporting', 'Boundaries, equivalence classes, coverage thinking, readable failures, and reports.', 35, ['function-contracts', 'tests-as-reasons'], [], ['sports-table/table-release']),
  ]),
  profile('pcat', 'Python Institute', 'PCAT – Certified Associate Tester with Python', 'active', 'https://pythoninstitute.org/pcat', 'Professional pytest, fixtures, mocking, TDD, BDD concepts, coverage, and maintainable test architecture.', [
    objective('pytest-fixtures', 'pytest and fixtures', 'Parametrization, fixtures, marks, plugins, and maintainable suites.', 30, ['tests-as-reasons'], [], ['route-finder/route-release']),
    objective('mocking', 'Mocks and test doubles', 'Patch boundaries, fake dependencies, interaction assertions, and avoiding over-mocking.', 25, ['collector-design'], [], ['sports-collector/collector-fetch']),
    objective('tdd-bdd', 'TDD and BDD', 'Small feedback cycles, executable examples, behavior language, and refactoring.', 20, ['tests-as-reasons']),
    objective('quality', 'Coverage and quality strategy', 'Risk-based coverage, integration tests, CI thinking, and useful test reports.', 25, ['maintainable-project'], [], ['magis-tool/magis-release']),
  ]),
  profile('pcea', 'Python Institute', 'PCEA – Certified Entry-Level Automation with Python', 'active', 'https://pythoninstitute.org/pcea', 'Files, command-line tools, operating-system automation, logging, scheduling, and safe productivity scripts.', [
    objective('files-cli', 'Files and command-line interfaces', 'Paths, files, CSV/JSON, argparse, exit codes, and robust user errors.', 30, ['json-validation', 'maintainable-project'], [], ['word-insight/word-cli']),
    objective('os-automation', 'Operating-system automation', 'Pathlib, shutil, subprocess boundaries, environment variables, and idempotence.', 30, ['collector-design'], [], ['magis-tool/magis-boundaries']),
    objective('logging-schedule', 'Logging and scheduling', 'Structured logs, rotation concepts, scheduled execution, retries, and notifications.', 20, ['collector-design'], [], ['sports-collector/collector-release']),
    objective('delivery', 'Reliable automation delivery', 'Configuration, tests, dry runs, documentation, and safe failure recovery.', 20, ['tests-as-reasons', 'capstone-release'], [], ['magis-tool/magis-release']),
  ]),
  profile('pces', 'Python Institute', 'PCES – Certified Entry-Level Security with Python', 'active', 'https://pythoninstitute.org/pces', 'Defensive security, validation, cryptographic foundations, safe networking, and authorized security automation.', [
    objective('secure-code', 'Secure Python development', 'Input validation, least privilege, secrets, dependencies, and safe error handling.', 30, ['function-contracts', 'raise-or-propagate', 'capstone-release'], [], ['magis-tool/magis-boundaries']),
    objective('network-web', 'Network and web security foundations', 'Protocols, requests, trust boundaries, authentication concepts, and safe collection.', 25, ['http-model', 'scraping-ethics'], [], ['sports-collector/collector-policy']),
    objective('crypto', 'Cryptographic foundations', 'Hashing, encoding, encryption, signatures, randomness, and appropriate library use.', 20),
    objective('defensive-tools', 'Authorized defensive tools', 'Log analysis, indicators, file integrity, safe scanners, and evidence handling.', 25, ['collector-design'], [], ['sports-collector/collector-release']),
  ]),
  profile('pcei', 'Python Institute', 'PCEI – Certified Entry-Level AI with Python', 'active', 'https://pythoninstitute.org/pcei', 'Machine learning, neural networks, NLP, generative AI, prompt safety, responsible AI, and evaluation.', [
    objective('ml-foundations', 'Machine-learning foundations', 'Features, targets, splits, baselines, models, metrics, and leakage.', 30, ['features-targets', 'baselines', 'metrics-errors', 'leakage-crossvalidation'], ['majority-baseline', 'classification-metrics'], ['sports-predictor/predictor-release']),
    objective('neural-networks', 'Neural networks', 'Tensors, dense layers, activations, loss, gradients, training, and image inputs.', 25, ['vectors-matrices', 'derivatives-gradients', 'dense-neurons', 'backprop-images'], ['dense-neuron'], ['neural-from-scratch/neural-release']),
    objective('nlp-generative', 'NLP and generative AI', 'Text representation, embeddings, transformers, LLM application patterns, and evaluation.', 25),
    objective('responsible-ai', 'Responsible and secure AI', 'Bias, privacy, transparency, prompt injection, limitations, and human oversight.', 20, ['data-story', 'capstone-release'], [], ['recommender/recommender-explain']),
  ]),
  profile('certiport-python', 'Certiport', 'IT Specialist – Python', 'active', 'https://certiport.pearsonvue.com/Certifications/ITSpecialist/Certification/Overview', 'Practical Python operations, flow control, data structures, functions, errors, modules, and debugging.', pcepObjectives, 'IT Specialist Python'),
  profile('hackerrank-python-basic', 'HackerRank', 'Python (Basic) Skills Certification', 'active', 'https://www.hackerrank.com/skills-verification/python_basic', 'Timed practical Python problem solving using collections, strings, functions, and standard-language behavior.', [
    objective('problem-solving', 'Practical problem solving', 'Translate requirements into correct functions under time constraints.', 50, ['function-contracts', 'range-primes', 'nested-aggregation'], ['inclusive-primes', 'summarize-orders', 'binary-search']),
    objective('language-use', 'Python language use', 'Collections, strings, sorting, exceptions, and readable implementation.', 50, ['collections-choice', 'ranking-repair', 'raise-or-propagate'], ['top-words', 'safe-average']),
  ]),
  profile('pcpp2', 'Python Institute', 'PCPP2 – Certified Professional Python Programmer 2', 'preview', 'https://pythoninstitute.org/pcpp2', 'Published as in development; shown only as a future advanced-professional coverage preview.', [objective('advanced-professional', 'Advanced professional Python', 'Architecture, design patterns, concurrency, networking, quality, and delivery topics expected at an advanced level.', 100, ['maintainable-project', 'capstone-release'])]),
  profile('giac-gpyc', 'GIAC', 'GIAC Python Coder', 'optional-specialist', 'https://www.giac.org/certifications/python-coder-gpyc/', 'Specialist Python credential with a security and systems focus; broader than the general course security profile.', [objective('security-coding', 'Security-focused Python coding', 'Python fluency applied to networking, binary data, automation, analysis, and defensive security.', 100, ['http-model', 'collector-design', 'maintainable-project'], [], ['sports-collector/collector-release'])], 'GPYC'),
  profile('databricks-spark', 'Databricks', 'Certified Associate Developer for Apache Spark', 'optional-specialist', 'https://www.databricks.com/learn/certification/apache-spark-developer-associate', 'Specialist PySpark and distributed-data credential requiring a separate Spark-focused extension.', [objective('spark', 'Apache Spark development', 'DataFrame operations, Spark SQL, transformations, actions, execution, and production data workflows.', 100, ['pandas-cleaning'], [], ['sports-dashboard/dashboard-release'])]),
  profile('mta-python', 'Microsoft', 'MTA 98-381 Introduction to Programming Using Python', 'historical', 'https://learn.microsoft.com/en-us/credentials/certifications/mta-retirement-faqs', 'Retired on June 30, 2022. Kept only as historical context; do not target this credential.', pcepObjectives, '98-381'),
  profile('tensorflow-developer', 'Google', 'TensorFlow Developer Certificate', 'closed', 'https://www.tensorflow.org/certificate', 'The exam is closed. Its former practical deep-learning topics remain useful but it is not an earnable target.', [objective('tensorflow', 'TensorFlow model development', 'Framework workflows for dense networks, images, text, time series, and model evaluation.', 100, ['backprop-images'], [], ['neural-from-scratch/neural-release'])]),
]

export const simulationByCertification: Record<string, string> = {
  pcep: 'simulation-pcep',
  pcap: 'simulation-pcap',
  pced: 'simulation-data',
  pcad: 'simulation-data',
  pcet: 'simulation-testing',
  pcat: 'simulation-testing',
  pcea: 'simulation-automation',
  pces: 'simulation-security',
  pcei: 'simulation-ai',
  'certiport-python': 'simulation-pcep',
  'hackerrank-python-basic': 'simulation-pcep',
}

for (const certification of certifications) {
  const assessmentId = simulationByCertification[certification.id]
  if (assessmentId) for (const item of certification.objectives) item.assessmentIds = [assessmentId]
}

export const certificationById = Object.fromEntries(certifications.map((item) => [item.id, item])) as Record<string, CertificationProfile>
