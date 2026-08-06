export type SkillId =
  | 'syntax' | 'strings' | 'loops' | 'functions' | 'dictionaries' | 'nested-data'
  | 'sorting' | 'exceptions' | 'testing' | 'oop' | 'complexity' | 'algorithms'
  | 'apis' | 'scraping' | 'data-analysis' | 'statistics' | 'linear-algebra'
  | 'machine-learning' | 'neural-networks' | 'security' | 'console-io'
  | 'files' | 'modules' | 'packages' | 'iterators' | 'generators' | 'decorators'
  | 'typing' | 'debugging' | 'packaging' | 'cli' | 'automation' | 'logging'
  | 'concurrency' | 'networking' | 'sql' | 'databases' | 'numpy' | 'pandas'
  | 'visualization' | 'nlp' | 'generative-ai' | 'responsible-ai'

export type SkillStatus = 'secure' | 'developing' | 'needs-review' | 'unobserved'
export type LessonKind = 'challenge' | 'concept' | 'math-lab' | 'project-step' | 'review' | 'local-lab' | 'assessment'
export type Comparison = 'exact' | 'unordered' | 'set-equivalent' | 'case-insensitive' | 'numeric-tolerance'
export type EvidenceKind = 'exercise' | 'assessment' | 'local-verifier' | 'project-milestone'
export type EnvironmentKind = 'browser' | 'local-python' | 'local-venv' | 'notebook' | 'desktop'

export type TestCase = {
  name: string
  functionName: string
  args: unknown[]
  expected?: unknown
  expectedException?: string
  comparison?: Comparison
  tolerance?: number
}

export type Exercise = {
  id: string
  title: string
  prompt: string
  starterCode: string
  solution: string
  functionName: string
  skillIds: SkillId[]
  tests: TestCase[]
  hints: [string, string, string]
  allowedImports?: string[]
  timeoutMs?: number
}

export type Resource = {
  id: string
  title: string
  provider: string
  url: string
  topic: string
  duration: string
  reason: string
}

export type LessonEvidence = {
  kind: EvidenceKind
  referenceId: string
  required: boolean
}

export type Lesson = {
  id: string
  moduleId: string
  title: string
  subtitle: string
  kind: LessonKind
  minutes: number
  difficulty: 1 | 2 | 3 | 4 | 5
  objectives: string[]
  explanation: string[]
  example: string
  challenge: string
  exerciseId?: string
  evidence?: LessonEvidence[]
  prerequisiteLessonIds?: string[]
  resourceIds: string[]
  skillIds: SkillId[]
}

export type CourseModule = {
  id: string
  stageId: string
  title: string
  description: string
  prerequisiteIds: string[]
  lessonIds: string[]
  bossChallenge: string
  bossAssessmentId?: string
  projectId: string
}

export type CourseStage = {
  id: string
  order: number
  title: string
  description: string
  moduleIds: string[]
  assessmentId?: string
  accent: string
}

export type ProjectSetupStep = {
  id: string
  title: string
  command?: string
  detail: string
}

export type ProjectDeliverable = {
  id: string
  title: string
  path: string
  description: string
  required: boolean
}

export type ProjectEvidenceRequirement = {
  id: string
  kind: 'browser-check' | 'verifier-report' | 'file-hash' | 'reflection'
  description: string
  required: boolean
}

export type ProjectMilestone = {
  id: string
  title: string
  summary: string
  instructions: string[]
  acceptanceCriteria: string[]
  prerequisiteMilestoneIds: string[]
  evidence: ProjectEvidenceRequirement[]
  estimatedHours: number
}

export type ProjectRubricCriterion = {
  id: string
  title: string
  description: string
  weight: number
}

export type ProjectVerifier = {
  id: string
  reportSchemaVersion: 1
  command: string
  reportFile: string
}

export type Project = {
  id: string
  title: string
  stageId: string
  summary: string
  outcome: string
  estimatedHours: number
  environment: EnvironmentKind
  prerequisiteModuleIds: string[]
  prerequisiteLessonIds: string[]
  setup: ProjectSetupStep[]
  milestones: ProjectMilestone[]
  deliverables: ProjectDeliverable[]
  rubric: ProjectRubricCriterion[]
  skills: SkillId[]
  starterBundlePath: string
  verifier?: ProjectVerifier
  localOnly?: boolean
}

export type AssessmentQuestion = {
  id: string
  prompt: string
  choices: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  skillIds: SkillId[]
}

export type Assessment = {
  id: string
  title: string
  description: string
  kind: 'module-boss' | 'stage-readiness' | 'certification-simulation'
  minutes: number
  passingScore: number
  prerequisiteIds: string[]
  questionPool: AssessmentQuestion[]
}

export type CredentialStatus = 'active' | 'preview' | 'optional-specialist' | 'historical' | 'closed'

export type CertificationObjective = {
  id: string
  title: string
  description: string
  weight: number
  lessonIds: string[]
  exerciseIds: string[]
  assessmentIds: string[]
  projectEvidenceIds: string[]
}

export type CertificationProfile = {
  id: string
  provider: string
  title: string
  examCode?: string
  status: CredentialStatus
  officialUrl: string
  verifiedAt: string
  summary: string
  objectives: CertificationObjective[]
}

export type DiagnosticSkill = {
  skillId: SkillId
  label: string
  score: number
  status: SkillStatus
  evidence: string
}
