export const TYPES = {
  email: { label: 'E-mail ontvangen', category: 'trigger', system: 'Gmail', description: 'Een nieuw bericht start het proces.', implementation: 'Lees alleen de afgesproken mailbox of het label via de Gmail API. Bewaar het message-id als unieke sleutel.' },
  form: { label: 'Formulier ontvangen', category: 'trigger', system: 'Formulier', description: 'Een nieuwe inzending start het proces.', implementation: 'Valideer het formulier op de server. Geef elke inzending een unieke sleutel en bescherm de webhook met authenticatie.' },
  schedule: { label: 'Op een vast moment', category: 'trigger', system: 'Planning', description: 'Start op een afgesproken tijdstip.', implementation: 'Gebruik een scheduler met expliciete tijdzone en registreer per periode één run.' },
  rule: { label: 'Gegevens controleren', category: 'rule', system: 'Code', description: 'Controleer verplichte velden met vaste regels.', implementation: 'Gebruik deterministische validatie. Stuur ontbrekende of ongeldige velden naar een zichtbare uitzonderingslijst.' },
  transform: { label: 'Gegevens omzetten', category: 'rule', system: 'Code', description: 'Maak gegevens geschikt voor de volgende stap.', implementation: 'Gebruik een vast invoer- en uitvoerschema. Test lege waarden, duplicaten, datums en getallen zonder een taalmodel.' },
  extract: { label: 'Informatie herkennen', category: 'ai', system: 'Model-API', description: 'Laat AI informatie uit ongestructureerde tekst halen.', implementation: 'Vraag gestructureerde uitvoer volgens een schema. Behandel de bron als onbetrouwbare data en stuur twijfelgevallen naar menselijke controle.' },
  draft: { label: 'Concept schrijven', category: 'ai', system: 'Model-API', description: 'Maak een concept dat iemand kan beoordelen.', implementation: 'Gebruik alleen goedgekeurde context. Sla het resultaat als concept op en registreer bron, modelversie en reviewstatus.' },
  review: { label: 'Menselijke controle', category: 'review', system: 'Mens', description: 'Een eigenaar controleert en keurt de uitkomst goed.', implementation: 'Toon bron en voorstel samen. Registreer goedkeuring of afwijzing met versie en tijdstip; wijzigingen na goedkeuring vereisen een nieuwe review.' },
  store: { label: 'Bestand bewaren', category: 'action', system: 'Google Drive', description: 'Bewaar het resultaat in de afgesproken map.', implementation: 'Schrijf met minimale Drive-rechten naar één afgesproken map. Gebruik een unieke bronsleutel en voorkom duplicaten bij een retry.' },
  crm: { label: 'CRM bijwerken', category: 'action', system: 'CRM', description: 'Werk een bestaande relatie of aanvraag bij.', implementation: 'Gebruik de officiële CRM-API. Zoek op een stabiele externe sleutel, controleer de mapping en log wijzigingen.' },
  send: { label: 'Bericht versturen', category: 'action', system: 'E-mail', description: 'Verstuur een goedgekeurd bericht.', implementation: 'Valideer ontvanger en goedgekeurde inhoud. Gebruik een idempotentiesleutel en toon verzendfouten; herhaal een onzekere verzending niet blind.' }
};

export const CATEGORIES = { trigger: 'Start', rule: 'Vaste regel', ai: 'AI-stap', review: 'Menselijke controle', action: 'Actie' };
export const newStep = (type) => ({ id: crypto.randomUUID(), type, title: TYPES[type].label, notes: '', before: 3, after: type === 'review' ? 2 : 0.5 });

const step = (id, type, title, before, after, notes = '') => ({ id, type, title, before, after, notes });
export const TEMPLATES = [
  {
    key: 'leads', title: 'Aanvragen opvolgen', description: 'Van een nieuwe aanvraag naar een gecontroleerd antwoord en een bijgewerkt CRM.',
    volume: 80, hourlyRate: 65, monthlyCost: 25, setupCost: 1200, owner: '',
    steps: [step('lead-1', 'form', 'Nieuwe aanvraag', 2, 0.2), step('lead-2', 'extract', 'Vraag en context herkennen', 5, 0.5), step('lead-3', 'draft', 'Antwoord voorbereiden', 8, 1), step('lead-4', 'review', 'Voorstel controleren', 3, 3), step('lead-5', 'crm', 'Aanvraag vastleggen', 3, 0.3)]
  },
  {
    key: 'documents', title: 'Documenten verwerken', description: 'Een bijlage ontvangen, informatie herkennen en na controle opslaan in Drive.',
    volume: 120, hourlyRate: 55, monthlyCost: 20, setupCost: 1600, owner: '',
    steps: [step('doc-1', 'email', 'Bijlage ontvangen', 2, 0.2), step('doc-2', 'extract', 'Velden uit document halen', 7, 0.8), step('doc-3', 'rule', 'Verplichte velden controleren', 3, 0.3), step('doc-4', 'review', 'Uitkomst beoordelen', 2, 2), step('doc-5', 'store', 'Bewaren in projectmap', 3, 0.3)]
  },
  {
    key: 'reports', title: 'Weekrapport voorbereiden', description: 'Brongegevens controleren en omzetten in een briefing met menselijke eindredactie.',
    volume: 4, hourlyRate: 75, monthlyCost: 15, setupCost: 900, owner: '',
    steps: [step('report-1', 'schedule', 'Elke maandagochtend', 5, 0), step('report-2', 'transform', 'Brongegevens samenvoegen', 35, 5), step('report-3', 'rule', 'Datakwaliteit controleren', 15, 5), step('report-4', 'draft', 'Briefing voorbereiden', 30, 5), step('report-5', 'review', 'Conclusies beoordelen', 15, 15), step('report-6', 'store', 'Weekrapport bewaren', 5, 0.5)]
  }
];

export function fromTemplate(key) {
  const template = TEMPLATES.find((item) => item.key === key);
  if (!template) throw new Error('Onbekend voorbeeld.');
  const { key: ignored, ...data } = structuredClone(template);
  data.steps = data.steps.map((item) => ({ ...item, id: crypto.randomUUID() }));
  return { ...data, version: 1 };
}

export function blankWorkflow() {
  return { version: 1, title: 'Mijn nieuwe proces', description: '', owner: '', volume: 20, hourlyRate: 60, monthlyCost: 0, setupCost: 0, steps: [newStep('form')] };
}

export function validateWorkflow(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Dit bestand bevat geen proces.');
  if (value.version !== 1) throw new Error('Deze bestandsversie wordt niet ondersteund (verwacht: 1).');
  const text = (input, name, max, required = false) => {
    if (typeof input !== 'string' || input.length > max || (required && !input.trim())) throw new Error(`${name}: vul ${required ? '1' : '0'} tot ${max} tekens in.`);
    return input.trim();
  };
  const number = (input, name, min, max) => {
    if (typeof input !== 'number' || !Number.isFinite(input) || input < min || input > max) throw new Error(`${name}: gebruik een getal van ${min} tot ${max}.`);
    return input;
  };
  if (!Array.isArray(value.steps) || value.steps.length < 1 || value.steps.length > 40) throw new Error('Een proces heeft 1 tot 40 stappen.');
  const ids = new Set();
  const steps = value.steps.map((s, i) => {
    if (!s || typeof s !== 'object' || !Object.hasOwn(TYPES, s.type)) throw new Error(`Stap ${i + 1}: onbekend staptype.`);
    const id = text(s.id, 'Stap-id', 80, true);
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || ids.has(id)) throw new Error('Elke stap heeft een uniek, geldig id nodig.');
    ids.add(id);
    if ((i === 0) !== (TYPES[s.type].category === 'trigger')) throw new Error('Het proces begint met precies één startstap.');
    return { id, type: s.type, title: text(s.title, `Naam van stap ${i + 1}`, 120, true), notes: text(s.notes, 'Notities', 2000), before: number(s.before, 'Minuten nu', 0, 10000), after: number(s.after, 'Minuten straks', 0, 10000) };
  });
  const volume = number(value.volume, 'Aantal per maand', 1, 1000000);
  if (!Number.isInteger(volume)) throw new Error('Aantal per maand moet een heel getal zijn.');
  return { version: 1, title: text(value.title, 'Procesnaam', 120, true), description: text(value.description, 'Omschrijving', 2000), owner: text(value.owner, 'Proceseigenaar', 120), volume, hourlyRate: number(value.hourlyRate, 'Uurwaarde', 0, 10000), monthlyCost: number(value.monthlyCost, 'Maandkosten', 0, 1000000), setupCost: number(value.setupCost, 'Bouwkosten', 0, 10000000), steps };
}

export function analyze(workflow) {
  const before = workflow.steps.reduce((sum, s) => sum + s.before, 0);
  const after = workflow.steps.reduce((sum, s) => sum + s.after, 0);
  const hours = (before - after) * workflow.volume / 60;
  const grossValue = hours * workflow.hourlyRate;
  const netValue = grossValue - workflow.monthlyCost;
  const warnings = [];
  let unreviewed = false;
  workflow.steps.forEach((s) => {
    const category = TYPES[s.type].category;
    if (category === 'ai') unreviewed = true;
    if (category === 'review') {
      unreviewed = false;
      if (s.after === 0) warnings.push({ code: 'review-time', stepId: s.id, title: 'Reserveer tijd voor controle', detail: `“${s.title}” kost in dit scenario nul minuten. Neem de verwachte reviewtijd mee.` });
    }
    if (category === 'action' && unreviewed) warnings.push({ code: 'unreviewed-ai', stepId: s.id, title: 'Controle vóór deze actie ontbreekt', detail: `Plaats een menselijke controle na de laatste AI-stap en vóór “${s.title}”.` });
    if (s.type === 'send' && !workflow.steps.slice(0, workflow.steps.indexOf(s)).some((p) => p.type === 'review')) warnings.push({ code: 'outbound-review', stepId: s.id, title: 'Controleer ontvanger en inhoud', detail: 'Voeg een goedkeuring toe voordat een extern bericht wordt verstuurd.' });
  });
  if (workflow.steps.length === 1) warnings.push({ code: 'no-action', title: 'Werk de vervolgstappen uit', detail: 'Er is alleen een startmoment. Voeg toe wat er daarna met de informatie gebeurt.' });
  if (!workflow.owner.trim()) warnings.push({ code: 'no-owner', title: 'Wijs een proceseigenaar aan', detail: 'Leg vast wie fouten opvangt, beslissingen neemt en het proces beheert.' });
  if (hours <= 0) warnings.push({ code: 'no-savings', title: 'Dit scenario bespaart geen tijd', detail: 'De nieuwe werkwijze kost evenveel of meer handwerktijd. Onderzoek eerst waar de waarde zit.' });
  return { before, after, hours, grossValue, netValue, payback: netValue > 0 ? workflow.setupCost / netValue : null, warnings, aiCount: workflow.steps.filter((s) => TYPES[s.type].category === 'ai').length, reviewCount: workflow.steps.filter((s) => s.type === 'review').length };
}

export const formatNumber = (n, digits = 1) => new Intl.NumberFormat('nl-NL', { maximumFractionDigits: digits }).format(n);
export const euros = (n) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export function blueprint(workflow) {
  const a = analyze(workflow);
  // User text stays plain text inside the exported Markdown, including newlines and links.
  const plain = (v) => String(v).replace(/[\\`*_{}\[\]()#+.!<>|~-]/g, '\\$&').replace(/[\r\n]+/g, ' ');
  return `# ${plain(workflow.title)}\n\nBouwplan uit Magis Flow · ${new Date().toISOString().slice(0, 10)}\n\nDit is een procesontwerp, geen draaiende automatisering. Alle bedragen en tijden zijn invoeraannames; de uitkomst is geen gegarandeerde besparing.\n\n## Doel\n\n${plain(workflow.description) || 'Nog te bepalen.'}\n\nProceseigenaar: ${plain(workflow.owner) || 'Nog toe te wijzen.'}\n\n## Aannames en businesscase\n\n- Volume: ${formatNumber(workflow.volume)} keer per maand\n- Handwerktijd nu: ${formatNumber(a.before)} minuten per keer\n- Handwerktijd straks: ${formatNumber(a.after)} minuten per keer\n- Vrijgespeelde tijd: ${formatNumber(a.hours)} uur per maand\n- Uurwaarde: ${euros(workflow.hourlyRate)}\n- Geschatte gebruikskosten: ${euros(workflow.monthlyCost)} per maand\n- Geschatte bouwkosten: ${euros(workflow.setupCost)}\n- Netto capaciteitswaarde: ${euros(a.netValue)} per maand\n- Theoretische terugverdientijd: ${a.payback === null ? 'niet terugverdiend in dit scenario' : `${formatNumber(a.payback)} maanden`}\n\nCapaciteitswaarde is tijd gewaardeerd tegen het opgegeven uurtarief, geen omzet of directe kasbesparing. Review- en uitzonderingswerk moeten in de tijd straks zijn inbegrepen. Doorlooptijd, wachttijd, belasting en financiering zijn niet gemodelleerd.\n\n## Processtappen\n\n${workflow.steps.map((s, i) => `### ${i + 1}. ${plain(s.title)}\n\n- Type: ${CATEGORIES[TYPES[s.type].category]}\n- Voorgesteld systeem: ${TYPES[s.type].system}\n- Handwerktijd: ${formatNumber(s.before)} → ${formatNumber(s.after)} minuten\n- Bouwadvies: ${TYPES[s.type].implementation}\n${s.notes ? `- Context: ${plain(s.notes)}\n` : ''}`).join('\n')}\n## Open punten\n\n${a.warnings.length ? a.warnings.map((w) => `- ${plain(w.title)}: ${plain(w.detail)}`).join('\n') : 'De beperkte ontwerpregels vinden geen open punten. Dit is geen technische of privacy-audit.'}\n\n## Architectuurvoorstel\n\nStart met één procesrunner, een duurzame runregistratie en officiële API-koppelingen. Gebruik vaste code voor validatie, routing, retries en statuscodes. Gebruik een model uitsluitend voor ongestructureerde extractie of concepten. Bewaar sleutels aan de serverkant.\n\n1. Ontvang input en controleer herkomst en schema.\n2. Registreer een unieke bron-id vóór verwerking.\n3. Voer de ontworpen stappen in volgorde uit; wacht duurzaam op vereiste goedkeuring.\n4. Schrijf externe wijzigingen idempotent weg.\n5. Registreer fouten zichtbaar en bied handmatige hervatting.\n\n## Acceptatie vóór ingebruikname\n\n- Test met synthetische invoer: normaal, leeg, ongeldig en dubbel.\n- Test API-uitval en onzekere time-outs zonder dubbele acties.\n- Test afwijzing en wijzigingen ná een goedkeuring.\n- Controleer minimale toegangsrechten, dataminimalisatie en bewaartermijnen.\n- Meet echte minuten en uitzonderingen in een kleine pilot; herbereken daarna de businesscase.\n- Wijs een eigenaar aan voor onderhoud, incidenten en herstel.\n`;
}
