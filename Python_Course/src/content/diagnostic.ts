import type { DiagnosticSkill } from '../domain/course-types'

export const placement = {
  title: 'Foundation Refresh — accelerated path',
  summary: 'You remember enough Python to move quickly, but several mental models need rebuilding before advanced projects become fun instead of frustrating.',
  calibration: 'Your placement stays provisional for the first 10 mixed exercises. Strong first-try results skip refreshers; repeated misses add a smaller practice step.',
}

export const diagnosticSkills: DiagnosticSkill[] = [
  { skillId: 'syntax', label: 'Syntax and variables', score: 68, status: 'developing', evidence: 'You can write functions and conditions, but some output predictions and Python terminology were uncertain.' },
  { skillId: 'strings', label: 'Strings and transformations', score: 70, status: 'developing', evidence: 'normalize_name was correct and word counting had a solid structure; slicing and punctuation details need review.' },
  { skillId: 'loops', label: 'Loops and control flow', score: 72, status: 'developing', evidence: 'Prime checking and counting loops were workable. Inclusive ranges and precise condition explanations need practice.' },
  { skillId: 'functions', label: 'Functions and contracts', score: 62, status: 'developing', evidence: 'You define and return from functions correctly, but exceptions, defaults, and edge-case contracts are not secure yet.' },
  { skillId: 'dictionaries', label: 'Dictionaries and counting', score: 38, status: 'needs-review', evidence: 'Flat counting is partly retained; nested aggregation and choosing data structures caused the diagnostic to stop.' },
  { skillId: 'nested-data', label: 'Nested data', score: 12, status: 'unobserved', evidence: 'You identified this as a blocker and did not attempt the nested order summary.' },
  { skillId: 'sorting', label: 'Sorting and ranking', score: 15, status: 'needs-review', evidence: 'You explicitly identified sorting top words as above your current independent capability.' },
  { skillId: 'exceptions', label: 'Errors and validation', score: 22, status: 'needs-review', evidence: 'You recognize ValueError but need to learn raising versus returning and robust input validation.' },
  { skillId: 'testing', label: 'Automated testing', score: 5, status: 'unobserved', evidence: 'No automated tests were attempted, so the course starts from test design fundamentals.' },
  { skillId: 'oop', label: 'Object-oriented Python', score: 5, status: 'unobserved', evidence: 'The OOP diagnostic was not attempted.' },
  { skillId: 'complexity', label: 'Complexity', score: 35, status: 'needs-review', evidence: 'Your square-root intuition was promising, but Big-O vocabulary and comparisons need a proper foundation.' },
  { skillId: 'algorithms', label: 'Algorithms', score: 18, status: 'unobserved', evidence: 'High interest, but no broader algorithm evidence yet.' },
  { skillId: 'apis', label: 'APIs', score: 5, status: 'unobserved', evidence: 'A high-priority goal that has not been tested yet.' },
  { skillId: 'scraping', label: 'Web scraping', score: 5, status: 'unobserved', evidence: 'A top-three interest that will be introduced after reliable data handling.' },
  { skillId: 'data-analysis', label: 'Data analysis', score: 5, status: 'unobserved', evidence: 'No NumPy or pandas evidence yet.' },
  { skillId: 'statistics', label: 'Statistics', score: 5, status: 'unobserved', evidence: 'The course will teach this alongside sports prediction.' },
  { skillId: 'linear-algebra', label: 'Linear algebra', score: 5, status: 'unobserved', evidence: 'Requested rigorously from the beginning of the neural-network path.' },
  { skillId: 'machine-learning', label: 'Machine learning', score: 5, status: 'unobserved', evidence: 'Primary learning goal; prerequisites will be built explicitly.' },
  { skillId: 'neural-networks', label: 'Neural networks', score: 5, status: 'unobserved', evidence: 'Primary project interest with no assumed prior knowledge.' },
  { skillId: 'security', label: 'Defensive security', score: 5, status: 'unobserved', evidence: 'High interest; examples stay defensive, ethical, and authorized.' },
]
