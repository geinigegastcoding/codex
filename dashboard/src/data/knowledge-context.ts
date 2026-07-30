import type { Provenance, SourceReference } from '../domain/workspace-types'

const reviewedAt = '2026-07-24'

const sources = {
  status: { label: 'Status', repositoryPath: 'Kennis/Status.md', asOf: reviewedAt, provenance: 'verified' as const },
  projects: { label: 'Projects', repositoryPath: 'Kennis/PROJECTS.md', asOf: reviewedAt, provenance: 'verified' as const },
  decisions: { label: 'Decisions', repositoryPath: 'Kennis/decisions.md', asOf: reviewedAt, provenance: 'verified' as const },
  progress: { label: 'Progress', repositoryPath: 'Kennis/progress.md', asOf: reviewedAt, provenance: 'verified' as const },
  founder: { label: 'Founder profile', repositoryPath: 'Kennis/Daniel Magis.md', asOf: reviewedAt, provenance: 'verified' as const },
} satisfies Record<string, SourceReference>

export type KnowledgeProject = {
  id: string
  name: string
  state: 'active' | 'blocked' | 'under-review' | 'recent'
  relevance: string
  nextAction: string
  blocker?: string
  decisionGate?: string
  source: SourceReference
}

export type KnowledgeDecision = {
  id: string
  title: string
  question: string
  owner: 'Daniël' | 'Executor'
  provenance: Provenance
  source: SourceReference
}

export const knowledgeContext = {
  reviewedAt,
  objective: {
    title: 'Verbeter de MagisData-website en verkrijg de eerste bevestigde klant',
    detail: 'Maak de Leiden-positionering geloofwaardig, herstel de websitebron en bouw een herhaalbare lokale outreach-werkwijze.',
    source: sources.status,
  },
  nextActions: [
    'Herstel of identificeer de canonieke website-repository.',
    'Controleer daarna productie, SEO-basis en conversieroutes.',
    'Maak van Leiden-first positionering een herhaalbare outreach-queue.',
    'Valideer het Sales OS met echt gebruik voordat persistence wordt uitgebreid.',
  ],
  blockers: [
    'De canonieke websitebron is in deze checkout niet vastgesteld.',
    'Productiestatus en actuele SEO kunnen lokaal niet worden geverifieerd.',
    'Acquisitie- en analyticsmetingen zijn niet met een live bron verbonden.',
  ],
  founderModel: {
    brain: 'Daniël bepaalt richting, commerciële prioriteit en productkeuzes.',
    executor: 'De Executor bouwt, controleert, documenteert en meldt onzekerheid direct.',
    source: sources.founder,
  },
  projects: [
    {
      id: 'website',
      name: 'MagisData website',
      state: 'blocked',
      relevance: 'Primaire commerciële basis voor Leiden-positionering en eerste-klantacquisitie.',
      nextAction: 'Herstel de canonieke bron en voer daarna een productie-audit uit.',
      blocker: 'Website en WebsiteMagisData zijn in de kennis-snapshot niet als canonieke bron bevestigd.',
      decisionGate: 'Kies welke repository leidend is.',
      source: sources.projects,
    },
    {
      id: 'sales-os',
      name: 'Sales OS',
      state: 'active',
      relevance: 'De kleinste operationele workflow om next actions en prospectopvolging te valideren.',
      nextAction: 'Gebruik de queue met echte prospects voordat duurzame opslag wordt toegevoegd.',
      decisionGate: 'Bepaal na gebruik welke persistence werkelijk nodig is.',
      source: sources.projects,
    },
    {
      id: 'dashboard',
      name: 'Persoonlijk command center',
      state: 'active',
      relevance: 'Geeft Daniël één plek voor richting, besluiten, lokaal werk en eerlijke bronstatus.',
      nextAction: 'Valideer of Today, Inbox en Review dagelijks bruikbaar zijn.',
      decisionGate: 'Behoud alleen pagina’s die echte beslis- of uitvoeringswaarde geven.',
      source: sources.decisions,
    },
    {
      id: 'marketing',
      name: 'Acquisitie-assets',
      state: 'recent',
      relevance: 'Ondersteunend materiaal voor outreach, social en duidelijke websitecommunicatie.',
      nextAction: 'Gebruik alleen assets die de huidige acquisitiecampagne direct ondersteunen.',
      source: sources.projects,
    },
  ] satisfies KnowledgeProject[],
  decisions: [
    {
      id: 'canonical-website',
      title: 'Canonieke websitebron',
      question: 'Wordt Website of WebsiteMagisData de leidende bron?',
      owner: 'Daniël',
      provenance: 'unknown',
      source: sources.status,
    },
    {
      id: 'production-audit',
      title: 'Productie-audit starten',
      question: 'Welke productie-URL en bron mogen als actueel worden gecontroleerd?',
      owner: 'Daniël',
      provenance: 'unknown',
      source: sources.status,
    },
    {
      id: 'sales-persistence',
      title: 'Sales OS persistence',
      question: 'Heeft echt gebruik aangetoond welke gegevens duurzaam bewaard moeten worden?',
      owner: 'Daniël',
      provenance: 'verified',
      source: sources.decisions,
    },
    {
      id: 'dashboard-value',
      title: 'Dashboardwaarde bewaken',
      question: 'Welke persoonlijke pagina verandert aantoonbaar een beslissing of volgende actie?',
      owner: 'Daniël',
      provenance: 'local',
      source: sources.decisions,
    },
  ] satisfies KnowledgeDecision[],
  weeklyPrompt: 'Welke aanname over acquisitie, aanbod of uitvoering moet deze week bewezen of geschrapt worden?',
  reviewSteps: [
    { id: 'review-objective', title: 'Bevestig de primaire commerciële doelstelling.' },
    { id: 'review-blockers', title: 'Controleer welke blokkade deze week echt moet verdwijnen.' },
    { id: 'review-decisions', title: 'Beslis, delegeer of stel open keuzes bewust uit.' },
    { id: 'review-focus', title: 'Kies maximaal drie prioriteiten voor de volgende werkcyclus.' },
  ],
  progress: [
    { date: '26 jun', title: 'Kennisbasis en foundercontext ingericht', detail: 'De vault, samenwerking en logging kregen een vaste basis.' },
    { date: '28–30 jun', title: 'Websitebasis opgeschoond', detail: 'Routes, mobiel gedrag en sitemapkeuzes zijn aangescherpt.' },
    { date: '1–11 jul', title: 'Snelle product- en marketing-MVP’s gebouwd', detail: 'Templates, websitewerk, Jarvis, Vibe, video en een demo-site zijn uitgevoerd.' },
    { date: '14–18 jul', title: 'Sales OS en responsive werk geleverd', detail: 'De lokale queue/next-action-MVP en websiteverbeteringen zijn geïmplementeerd.' },
    { date: '24 jul', title: 'Feiten en onbekenden opnieuw gescheiden', detail: 'Placeholderclaims zijn verwijderd en de actuele prioriteiten zijn geconsolideerd.' },
  ],
  sources,
}
