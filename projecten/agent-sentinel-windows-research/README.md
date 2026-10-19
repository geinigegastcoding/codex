# Agent Sentinel — Windows power guard research

Onderzoeksdossier voor een mogelijke Windows-app die coding agents en andere lange lokale workloads begeleidt: de pc wakker houdt zolang betrouwbaar werk actief is en daarna terugbrengt naar een gekozen power state.

Werknaam: Agent Sentinel. Dit is geen definitieve productnaam en in deze opdracht wordt geen app gebouwd.

## Besluit in één zin

Bouw eerst een lokale, tray-first “power guard” met expliciete sessies, evidence-based completion en veilige shutdown; behandel gesloten-lidgedrag als een hardware/Windows-capability die de app controleert en eerlijk begrenst, niet als een universele belofte.

## Dossier

- [Research spec](research-spec.md) — markt, probleem, gebruikers, hypotheses, aanbeveling en onderzoeksvragen.
- [PRD](PRD.md) — MVP-doel, scope, requirements, states, acceptatiecriteria en releaseplan.
- [Design system](DESIGN.md) — visuele richting, schermen, tokens, componenten, content en toegankelijkheid.
- [UX-flows](ux-flows.md) — first run, sessie starten, lid sluiten, completion, onzekerheid en recovery.
- [Technical feasibility](technical-feasibility.md) — Windows-API’s, architectuur, beperkingen, security en testmatrix.
- [Sources](references/sources.md) — officiële bronnen en marktbronnen met bewijsstatus.
- [Mobbin references](references/mobbin.md) — MCP-onderzoek, observaties en vertaling naar dit product.

## Niet in deze opdracht

Geen broncode, installatiepakket, mock-up, prototype, logo, prijsmodel of claim dat de app op ieder Windows-apparaat met gesloten klep kan blijven draaien.

## Hoofd-aannames

De eerste productcontext richt zich op power users die verschillende lokale workloads gebruiken (niet alleen één agent), op desktops én laptops, met zowel Safe als Hands-off mode. Safe by default blijft de releasepositie.

## Researchstatus

Desk research en Mobbin-referentieonderzoek zijn uitgevoerd op 22 september 2026. Er zijn nog geen echte gebruikersinterviews, hardwaretests of betrouwbaarheidmetingen gedaan. Alles dat nog niet empirisch is gevalideerd staat in de documenten als aanname, open vraag of voorgestelde target.
