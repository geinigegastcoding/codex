# Domeinstrategie: MagisData en MagisIntel

> Strategische index voor de domeinideeën — 22 september 2026

## Kernbesluit

Gebruik de domeinen als twee verschillende maar samenwerkende merken:

- **MagisData.nl**: Daniel bouwt AI-systemen, automatiseringen, tools, skills en technische infrastructuur.
- **MagisIntel.nl**: Gerhard Magis analyseert data, maakt managementinformatie en helpt organisaties betere beslissingen nemen.

MagisData wordt de technische werkplaats en het publieke portfolio. MagisIntel blijft de inhoudelijke data- en adviespraktijk. Alleen echte samenwerkingen verbinden de domeinen; geen kunstmatig SEO-netwerk en geen gekopieerde artikelen.

De uitgebreide ideeënuitwerking staat in [Domeinideeën - Sol Research 2026-09](Domeinideeën%20-%20Sol%20Research%202026-09.md) zodra de onderzoeksagent deze heeft afgerond.

## Mijn eerste prioriteiten

1. **MagisData Control Room** — privé dashboard voor eigen tools, inbox-events, geautoriseerde stagingtests, Drive-jobs, runs en auditlogs.
2. **Workflow Architect** — publieke tool die een terugkerend bedrijfsproces omzet in een reviewbare workflowkaart.
3. **MagisCard** — professionele digitale profielkaart op id.magisdata.nl met contact, cases, vCard en QR-code.
4. **MagisIntel Data-/Managementinformatie-scan** — intake die de beslissing achter een datavraag scherp maakt.
5. **MagisIntel KPI Atlas / Data Story Lab** — inhoudelijk portfolio met KPI-definities, synthetische datasets en uitleg van observatie naar beslissing.

## Ideeën voor MagisData

- MagisData OS: de bestaande vault, skills, SOP's en context als eigen AI-operatingsysteem.
- MagisData Lab: echte kleine demo's voor e-mail-naar-taak, document-intake, CSV-analyse, Drive-export en menselijke review.
- Private operatorconsole: eigen services, omgevingen, mailbox-aliassen, inbox-events, runs, fouten en audit.
- Authorized Drive Dropzone: bestanden alleen na expliciete autorisatie ophalen/exporteren; geen algemene downloader.
- API-/agent-gateway: server-side wrapper rond officiële model-API's met authenticatie, allowlists, kostenlimieten en auditlogs.
- Client Handoff Room: afgeschermde overdracht van een gebouwd systeem met handleidingen, integraties en openstaande acties.
- SEO/AI Visibility Check: alleen sites auditen die de gebruiker mag controleren; rapport met title, H1, canonical, robots, sitemap en links.

## Ideeën voor MagisIntel

- Data-/Managementinformatie-scan.
- Dashboard Reality Check.
- KPI Atlas.
- Data Quality Radar voor kleine CSV's, bij voorkeur local-first.
- Synthetic Data Playground voor zorg, verzekeraars, overheid en zakelijke dienstverlening.
- Data Story Lab: observatie, definitie, mogelijke verklaring, beperking en beslissing.
- “Vraag achter het cijfer”-intake.
- Templatebibliotheek voor KPI-kaarten, datadictionaries, besluitnotities en dashboardreviews.
- Later: privé klantportal voor rapporten, versies en datadefinities.

## Veilige vertaling van het multi-accountidee

De oorspronkelijke combinatie van massaal accounts aanmaken, één centrale inbox en automatisch scripts schrijven voor willekeurige websites wordt niet gebouwd. Dat kan platformlimieten, verificaties, spamfilters en voorwaarden omzeilen. Google sluit gebruik van meerdere accounts om limieten, filters of veiligheidsregels te omzeilen expliciet uit in de Workspace developer policy; de ACM vereist voor commerciële elektronische berichten voorafgaande toestemming, duidelijke afzender en eenvoudige afmelding.

De legitieme variant is **Inbox Operations**:

- eigen accounts inventariseren;
- aliassen aan eigen projecten of stagingomgevingen koppelen;
- binnenkomende verificatie- en statusmails labelen;
- testgebruikers in eigen software aanmaken;
- QA uitvoeren tegen lokale mocks of expliciete sandbox-API's;
- alleen geallowliste hosts gebruiken;
- externe writes handmatig goedkeuren;
- geen CAPTCHA-, telefoon- of e-mailverificatie omzeilen;
- geen bulkmail, spam of proxy-/IP-rotatie;
- geen wachtwoorden, tokens of herstelcodes in de database.

## Voorgestelde subdomeinen

### MagisData

- id.magisdata.nl — profielkaart.
- lab.magisdata.nl — demo's.
- app.magisdata.nl — private Control Room achter Cloudflare Access.
- api.magisdata.nl — geauthenticeerde API-gateway.
- upload.magisdata.nl — geautoriseerde upload/dropzone.
- test.magisdata.nl — testdata en staging-only.
- docs.magisdata.nl — documentatie.
- status.magisdata.nl — publieke status.

### MagisIntel

- scan.magisintel.nl — intake.
- atlas.magisintel.nl — KPI- en begrippenatlas.
- stories.magisintel.nl — interactieve data stories.
- portal.magisintel.nl — private klantomgeving, pas bij echte behoefte.

Begin niet met alle subdomeinen. Start met MagisCard, één Lab-demo, de Data-scan en één Data Story. Voeg de Control Room toe zodra de eigen inbox-/toolworkflow werkelijk tijd bespaart.

## Minimale Control Room-architectuur

Cloudflare Email Routing ontvangt expliciete testaliassen en stuurt ze naar een dedicated Workspace-testmailbox. Een lokale sync leest de mailbox read-only uit en slaat alleen metadata op in SQLite. De lokale webapp wordt alleen via Cloudflare Tunnel en Access ontsloten. Een allowlist begrenst services, omgevingen en acties. Pas bij bewezen volume komen een Worker, Queue, D1 of Gmail push-notificaties.

De eerste versie moet dus geen multi-tenant platform zijn. Eén gebruiker, één testmailbox, synthetic data, zichtbare fouten, verwijdering en auditlogs zijn genoeg.

## SEO-verdeling

MagisData-clusters:

- AI-systemen voor ondernemers;
- workflow-automatisering;
- e-mail- en kenniswerkautomatisering;
- AI-audit;
- veilige AI-integraties;
- agent-ready context;
- technische cases.

MagisIntel-clusters:

- data-analyse;
- managementinformatie;
- KPI-definities;
- datakwaliteit;
- dashboardbeoordeling;
- risico- en kansenanalyse;
- procesprestaties;
- data voor zorg, overheid en verzekeraars.

De live homepages hebben bruikbare titles, descriptions, canonicals en Open Graph-afbeeldingen. De MagisData-sitemap bevat ook oudere SEO-/web-/GEO-/AEO-routes. Controleer per route of die nog bij het echte aanbod past; behoud geen pagina alleen om zoekwoorden te bezitten.

## Bronnen

- [MagisData.nl](https://magisdata.nl/)
- [MagisIntel.nl](https://magisintel.nl/)
- [Cloudflare Email Routing](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/)
- [Cloudflare Email Workers](https://developers.cloudflare.com/email-service/api/route-emails/email-handler/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/setup/secure-private-apps/private-web-app/)
- [Cloudflare Queues](https://developers.cloudflare.com/queues/reference/how-queues-works/)
- [Gmail API overview](https://developers.google.com/workspace/gmail/api/guides)
- [Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes)
- [Google Workspace user data policy](https://developers.google.com/workspace/workspace-api-user-data-developer-policy)
- [Google Drive download/export](https://developers.google.com/workspace/drive/api/guides/manage-downloads)
- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [ACM spamregels](https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/spam-voorkomen-uw-reclame)
- [Autoriteit Persoonsgegevens: beveiliging](https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/beveiliging/beveiliging-van-persoonsgegevens)

