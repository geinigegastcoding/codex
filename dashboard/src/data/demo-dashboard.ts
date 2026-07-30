import type {
  AcquisitionPoint,
  ActivityEvent,
  DemoDashboardDataset,
  VisibilityPoint,
} from '../domain/dashboard-types'

const referenceDate = '2026-07-28'

function isoDay(daysBeforeReference: number) {
  const date = new Date(`${referenceDate}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() - daysBeforeReference)
  return date.toISOString().slice(0, 10)
}

const acquisition: AcquisitionPoint[] = Array.from({ length: 90 }, (_, index) => {
  const daysBeforeReference = 89 - index
  const weekday = new Date(`${isoDay(daysBeforeReference)}T12:00:00Z`).getUTCDay()
  const workday = weekday > 0 && weekday < 6
  const cycle = index % 12
  const outreach = workday ? 2 + ((index * 7 + cycle) % 7) : index % 3 === 0 ? 1 : 0
  const replies = workday ? Math.max(0, Math.floor(outreach * 0.42) + (index % 5 === 0 ? 1 : 0)) : 0
  const meetings = index % 9 === 0 || (workday && replies > 2 && index % 4 === 0) ? 1 : 0

  return { date: isoDay(daysBeforeReference), outreach, replies, meetings }
})

const visibility: VisibilityPoint[] = Array.from({ length: 90 }, (_, index) => ({
  date: isoDay(89 - index),
  pagesIndexed: 18 + Math.floor(index / 8) + (index > 54 ? 2 : 0) + (index > 76 ? 2 : 0),
}))

const activity: ActivityEvent[] = Array.from({ length: 42 }, (_, index) => {
  const type = (['action', 'lead', 'website', 'proposal'] as const)[index % 4]
  const titles = {
    action: 'Opvolgactie afgerond',
    lead: 'Demo-lead toegevoegd',
    website: 'Websitecontrole uitgevoerd',
    proposal: 'Voorstel voorbereid',
  }
  const details = {
    action: 'Een fictieve actie is verplaatst naar de volgende stap.',
    lead: 'Een fictieve organisatie is aan de demo-pipeline toegevoegd.',
    website: 'De demonstratiecontrole heeft nieuwe aandachtspunten gegroepeerd.',
    proposal: 'Een illustratief voorstel staat klaar voor interne controle.',
  }

  return {
    id: `activity-${index + 1}`,
    fictional: true as const,
    occurredAt: `${isoDay((index * 2) % 88)}T${String(9 + (index % 8)).padStart(2, '0')}:20:00`,
    type,
    title: titles[type],
    detail: details[type],
  }
}).sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))

export const demoDashboard: DemoDashboardDataset = {
  metadata: {
    mode: 'illustrative',
    label: 'Illustratieve demo',
    disclosure: 'Alle namen, activiteiten en waarden zijn fictief. Er zijn geen live databronnen gekoppeld.',
    referenceDate,
  },
  profile: {
    name: 'Daniël',
    role: 'Founder · The Brain',
    company: 'MagisData',
    region: 'Leiden',
  },
  founderFocus: {
    priority: 'Maak Leiden-outreach herhaalbaar en bewijs wat werkt',
    supportingActions: [
      'Kies één lokaal segment voor deze week',
      'Controleer de homepage-CTA op dezelfde belofte',
      'Reserveer één compact follow-upblok',
    ],
    decisions: {
      founder: [
        'Welk Leiden-segment krijgt deze week volledige aandacht?',
        'Welke ene belofte moet in outreach én op de website terugkomen?',
      ],
      executor: [
        'Bouw de fictieve prospectlijst en groepeer per segment',
        'Controleer websitecopy en bereid follow-ups voor',
      ],
    },
    evidenceReadiness: [
      { label: 'Sales OS / CRM', status: 'demo' },
      { label: 'Website-audit', status: 'demo' },
      { label: 'Campagnelog', status: 'not-connected' },
    ],
    weeklyReviewPrompt: 'Welke commerciële aanname moet deze week bewezen of geschrapt worden?',
  },
  leads: [
    {
      id: 'lead-studio-kanaal',
      fictional: true,
      companyName: 'Studio Kanaal · Demo',
      contactName: 'Mila de Wit',
      stage: 'proposal',
      source: 'local-outreach',
      createdAt: '2026-07-08',
      enteredStageAt: '2026-07-22',
      nextAction: 'Controleer voorstel en stuur persoonlijke toelichting',
      nextActionAt: '2026-07-28T09:30:00',
      urgency: 'high',
      proposalOutstanding: true,
      notes: ['Interesse in een compactere dienstenstructuur.', 'Alle informatie is fictief.'],
    },
    {
      id: 'lead-noordlicht',
      fictional: true,
      companyName: 'Noordlicht Fietsen · Demo',
      contactName: 'Jesse Vermeer',
      stage: 'demo',
      source: 'website-demo',
      createdAt: '2026-07-12',
      enteredStageAt: '2026-07-24',
      nextAction: 'Loop de mobiele website-audit na',
      nextActionAt: '2026-07-28T11:15:00',
      urgency: 'high',
      proposalOutstanding: false,
      notes: ['Demo-audit bevat alleen gesimuleerde bevindingen.'],
    },
    {
      id: 'lead-rijnzicht',
      fictional: true,
      companyName: 'Rijnzicht Interieur · Demo',
      contactName: 'Sara Jansen',
      stage: 'qualified',
      source: 'referral-demo',
      createdAt: '2026-07-18',
      enteredStageAt: '2026-07-21',
      nextAction: 'Plan een kort kennismakingsgesprek',
      nextActionAt: '2026-07-29T10:00:00',
      urgency: 'medium',
      proposalOutstanding: false,
      notes: ['Wil vooral duidelijkheid over lokale vindbaarheid.'],
    },
    {
      id: 'lead-atlas',
      fictional: true,
      companyName: 'Atlas Fysio · Demo',
      contactName: 'Noa Smit',
      stage: 'followUp',
      source: 'local-outreach',
      createdAt: '2026-06-30',
      enteredStageAt: '2026-07-17',
      nextAction: 'Stuur compacte follow-up met drie concrete verbeterpunten',
      nextActionAt: '2026-07-27T15:30:00',
      urgency: 'high',
      proposalOutstanding: true,
      notes: ['Vervolgactie is bewust als achterstallig gemarkeerd.'],
    },
    {
      id: 'lead-groene-werkplaats',
      fictional: true,
      companyName: 'De Groene Werkplaats · Demo',
      contactName: 'Sem Bakker',
      stage: 'new',
      source: 'local-outreach',
      createdAt: '2026-07-26',
      enteredStageAt: '2026-07-26',
      nextAction: 'Beoordeel of een website-demo relevant is',
      nextActionAt: '2026-07-30T13:00:00',
      urgency: 'low',
      proposalOutstanding: false,
      notes: ['Nog geen contactmoment; alleen een fictieve demo-lead.'],
    },
    {
      id: 'lead-haven-koffie',
      fictional: true,
      companyName: 'Haven Koffie · Demo',
      contactName: 'Lina Vos',
      stage: 'qualified',
      source: 'website-demo',
      createdAt: '2026-07-14',
      enteredStageAt: '2026-07-20',
      nextAction: 'Werk een lokale landingspagina-opzet uit',
      nextActionAt: '2026-07-31T09:00:00',
      urgency: 'medium',
      proposalOutstanding: false,
      notes: ['Illustratief voorbeeld voor horeca in Leiden.'],
    },
    {
      id: 'lead-polder-elektra',
      fictional: true,
      companyName: 'Polder Elektra · Demo',
      contactName: 'Finn Meijer',
      stage: 'demo',
      source: 'local-outreach',
      createdAt: '2026-07-06',
      enteredStageAt: '2026-07-19',
      nextAction: 'Controleer technische audit op prioriteit',
      nextActionAt: '2026-08-01T10:30:00',
      urgency: 'medium',
      proposalOutstanding: false,
      notes: ['Geen echte bedrijfs- of contactgegevens.'],
    },
    {
      id: 'lead-singel-studio',
      fictional: true,
      companyName: 'Singel Studio · Demo',
      contactName: 'Yara Mulder',
      stage: 'proposal',
      source: 'referral-demo',
      createdAt: '2026-07-03',
      enteredStageAt: '2026-07-23',
      nextAction: 'Verwerk feedback in de demo-offerte',
      nextActionAt: '2026-08-02T12:00:00',
      urgency: 'low',
      proposalOutstanding: true,
      notes: ['Fictieve propositie zonder bedrag of commerciële claim.'],
    },
  ],
  acquisition,
  visibility,
  websiteIssues: [
    { id: 'issue-1', fictional: true, category: 'technical', label: 'Canonieke URL ontbreekt', severity: 'serious', foundAt: '2026-07-24' },
    { id: 'issue-2', fictional: true, category: 'technical', label: 'Redirectketen inkorten', severity: 'warning', foundAt: '2026-07-23' },
    { id: 'issue-3', fictional: true, category: 'content', label: 'Dienstpagina mist direct antwoord', severity: 'warning', foundAt: '2026-07-22' },
    { id: 'issue-4', fictional: true, category: 'content', label: 'CTA is te algemeen', severity: 'serious', foundAt: '2026-07-25' },
    { id: 'issue-5', fictional: true, category: 'localSeo', label: 'Plaatsnaam ontbreekt in kerncopy', severity: 'serious', foundAt: '2026-07-21' },
    { id: 'issue-6', fictional: true, category: 'speed', label: 'Hero-afbeelding kan kleiner', severity: 'warning', foundAt: '2026-07-24' },
    { id: 'issue-7', fictional: true, category: 'accessibility', label: 'Focusstatus is onvoldoende zichtbaar', severity: 'critical', foundAt: '2026-07-26' },
    { id: 'issue-8', fictional: true, category: 'accessibility', label: 'Decoratief beeld mist lege alt', severity: 'warning', foundAt: '2026-07-20', resolvedAt: '2026-07-27' },
  ],
  activity,
}
