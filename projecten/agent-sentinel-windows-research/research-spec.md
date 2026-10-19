# Research spec

## 1. Executive summary

### Probleem

Een coding agent kan uren actief zijn terwijl Windows door idle- of lidbeleid gaat slapen. Het omgekeerde probleem is minstens zo vervelend: de taak is klaar, maar de machine blijft de hele nacht wakker. Bestaande keep-awake-tools lossen vooral “altijd aan” of “voor een timer” op. Agent-aware tools voegen procesdetectie toe, maar procesaanwezigheid is geen bewijs dat de agent nog nuttig werk verricht.

### Productthese

De winnende ervaring is geen caffeïneknop maar een kleine power guard:

1. de gebruiker maakt een expliciete sessie;
2. de app toont welk bewijs zij ziet;
3. de app houdt een power lease vast zolang de sessie actief of onzeker is;
4. de app voert pas na completion + quiet period + laatste controle een omkeerbare poweractie uit;
5. onbekende toestand betekent niet automatisch “klaar”.

### Aanbeveling

Onderzoek en bouw eerst een MVP met:

- tray-first bediening;
- één sessiemodel met meerdere workload-adapters;
- procesboom, explicit wrapper/heartbeat en handmatige fallback;
- Safe als default, Hands-off als bewuste expertmodus;
- Windows power request tijdens actieve sessies;
- duidelijke capability check voor laptop/lid/AC/batterij/Modern Standby;
- countdown met abort vóór shutdown;
- lokale eventlog met een korte, menselijke reden per beslissing.

Start niet met een generieke AI-classifier, cloudbackend, teamaccounts of automatische wijziging van verborgen power policies. Die maken de trust-opgave groter zonder de kernjob te bewijzen.

## 2. Scope en methode

### Onderzocht

- macOS keep-awake/agent-aware utilities als productcategorie;
- Windows power management, lidgedrag, shutdown, Modern Standby en desktop lifecycle;
- Windows-native UI en packaging;
- Mobbin-schermen/flows voor dashboards, settings, onboarding en destructieve bevestiging;
- differentiatie, failure modes en validatiecriteria voor een agent-aware Windows utility.

### Methode

- officiële Microsoft-documentatie als primaire technische bron;
- publieke productpagina’s en repositories voor categorie- en concurrentiesignalen;
- Mobbin MCP als visuele referentiebron; schermen zijn bekeken, niet gekopieerd;
- synthese met expliciet onderscheid tussen feit, observatie, aanname en voorstel.

### Niet gemeten

Geen marktvolume, willingness-to-pay, betrouwbaarheid op echte laptops, thermische effecten, batterijverbruik, false-shutdown-rate of compatibiliteit met specifieke agentversies. Deze punten zijn validatiewerk, geen bewezen claims.

## 3. Markt- en categoriebeeld

| Categorie | Wat al bestaat | Gat voor dit product |
|---|---|---|
| OS-/utility keep-awake | PowerToys Awake biedt handmatig, tijdelijk of tot een tijdstip wakker blijven. | Geen begrip van agentsemantiek of “klaar maar niet idle”. |
| Simpele Windows caffeine-apps | Tray-toggle, timer en soms scherm-/lockopties. | Vaak weinig uitleg over reden, lid-capability en recovery. |
| Agent-aware Windows tools | Publieke projecten zoals Insomnia en LidGuard koppelen proces-/agentactiviteit aan sleep-preventie. | Kans om betrouwbaarheid, polish, Safe/Hands-off en Windows-native trust beter uit te werken; claims van deze projecten moeten zelf getest worden. |
| macOS agent utilities | Nemuri, UnIdle, Keepresso en vergelijkbare tools combineren agentstatus met sleep/closed-lid-gedrag. | Windows-equivalent met native power-state uitleg en hardware-capability check. |
| Generieke automation | Schedulers en scripts kunnen na een proces of timer shutdown uitvoeren. | Geen coherent sessiemodel, statusweergave of veilige completion-arbitrage. |

### Differentiatie

Niet: “nog een app die Windows wakker houdt.”

Wel: “de meest begrijpelijke lokale power guard voor workloads met een expliciete lifecycle.”

De verdediging zit in de combinatie:

- evidence-based status in plaats van alleen process-name matching;
- zichtbare causaliteit: “we blijven wakker omdat X”;
- veilig einde: completion, grace period, re-check en abort;
- Windows-realiteit: lidgedrag, Modern Standby, AC/DC en policies als capability;
- lokale privacy en een bijna onzichtbare tray-ervaring.

## 4. Gebruiker en jobs-to-be-done

### Primaire doelgroep

Power users die een lokale of hybride workload starten, daarna weg willen lopen, en geen energie of voortgang willen verspillen aan een verkeerd ingestelde sleep/shutdown-regel.

### Kernjob

“Als ik een lange agentrun start, wil ik mijn laptop kunnen sluiten of mijn desktop kunnen verlaten zonder dat het werk door slaap stopt, maar ik wil ook dat de machine vanzelf terugkeert naar een veilige power state zodra het werk aantoonbaar klaar is.”

### Secundaire jobs

- “Waarom blijft mijn pc wakker?”
- “Wacht mijn agent op mij of werkt hij nog?”
- “Kan mijn apparaat dit met de klep dicht?”
- “Kan ik shutdown nog stoppen?”
- “Wat gebeurde er tijdens de nacht?”

### Kritische momenten

1. Vlak vóór het verlaten van de machine: vertrouwen en capability check.
2. Tijdens een lange run: minimale afleiding, snelle statuscontrole vanuit de tray.
3. Bij onduidelijke output: fail safe, geen stille interpretatie.
4. Vlak vóór poweractie: begrijpelijk, zichtbaar, omkeerbaar.
5. Na terugkeer: korte geschiedenis die de gebruiker niet hoeft te reconstrueren.

## 5. Researchbevindingen

### Bevinding A — “proces draait” is een zwakke completion-signal

Agents kunnen open blijven in een interactieve prompt, wachten op gebruikersinput, een child process starten of crashen met een shell die nog openstaat. CPU-idleheid zegt niets over completion. De engine moet meerdere evidence-signalen combineren en “unknown” apart houden.

### Bevinding B — gesloten-lidgedrag is geen puur app-feature

Windows kan op lid sluiten sleep, hibernate, shutdown of niets uitvoeren. Power requests voorkomen idle-sleep, maar Microsoft documenteert ook dat user-initiated sleep/lid actions niet onbeperkt door de legacy execution-state API kunnen worden tegengehouden. Modern Standby kan desktopprocessen bovendien pauzeren of throttlen.

Conclusie: de app moet vóór een sessie een capability lezen, de gebruiker waarschuwen en geen universele “werkt altijd dichtgeklapt”-claim maken.

### Bevinding C — shutdown is technisch eenvoudig, vertrouwen niet

Windows ondersteunt een geplande shutdown met timeout en abort. De productwaarde zit daarom in de voorliggende status: waarom wordt deze actie voorbereid, welke workloads zijn gecontroleerd, hoeveel tijd is er nog en waar kan de gebruiker annuleren?

### Bevinding D — “quiet tray, rich detail” past bij de frequentie

De gebruiker wil niet continu een dashboard lezen. De tray moet één scanbare status tonen; de volledige window is voor instellen, inspecteren en herstellen. De app moet daarom twee snelheden ondersteunen: glanceable en auditable.

### Bevinding E — het echte vertrouwen komt uit verklaringen

Een status zonder reden voelt als een onbetrouwbare daemon. Gebruik korte verklaringen zoals:

- “Awake — Codex CLI produced output 18s ago.”
- “Waiting — terminal prompt detected; shutdown is blocked.”
- “Unknown — no heartbeat for 90s; keeping the PC awake.”
- “Ready — all 2 workloads exited successfully.”

## 6. Hypotheses om te valideren

| ID | Hypothese | Minimale test | Signaal |
|---|---|---|---|
| H1 | Gebruikers begrijpen evidence-status beter dan een enkel groen/rood icoon. | Prototype-test met drie statusvarianten. | Correcte uitleg van “waarom wakker”. |
| H2 | Safe mode voorkomt meer wantrouwen dan hands-off tijd bespaart. | Scenario-test met echte shutdown countdown. | Annuleerpercentage, begrip en vertrouwen. |
| H3 | Een expliciete sessie is acceptabeler dan globale agentdetectie. | Interview + wizardtest. | Gebruiker kan sessie starten zonder lange configuratie. |
| H4 | Een capability check voor lid/AC voorkomt foutieve verwachtingen. | Test op desktop, laptop AC/DC, Modern Standby. | Geen “het werkte niet”-verrassing in de testmatrix. |
| H5 | Een wrapper/heartbeat is betrouwbaarder dan alleen process matching. | Vergelijk dezelfde run met proces-, wrapper- en heartbeat-adapter. | Completion precision en false-shutdown-rate. |
| H6 | De categorie is aantrekkelijker als generieke workload guard dan als Codex-only tool. | Concepttest met agent, build, render en downloadscenario’s. | Herkenning van eigen use case zonder uitleg. |

## 7. Open onderzoeksvragen

### Gebruiker

- Welke workload-signalen vertrouwen gebruikers: exit code, file changes, terminal output, agent event, handmatig “done”?
- Hoe lang tolereren zij een quiet period vóór actie?
- Is shutdown de default gewenste actie, of sleep/hibernate?
- Wanneer is “waiting for input” een eindstatus en wanneer niet?

### Techniek

- Welke concrete agentintegraties hebben stabiele lifecycle hooks op Windows/WSL?
- Welke laptopmodellen blijven met lid dicht en AC aangesloten daadwerkelijk werken?
- Wat gebeurt er bij power loss, wake, Fast Startup, reboot en Windows Update?
- Is een tray process met startup task genoeg, of is een broker/service nodig?

### Product

- Is de naam/categorie begrijpelijk zonder “caffeine” als metafoor?
- Willen gebruikers history bewaren, exporteren of alleen een laatste run zien?
- Is een paid tier nodig, of is lokale open-source distributie de betere trustpositie?

## 8. Risicoregister

| Risico | Impact | Waarschijnlijkheid | Mitigatie |
|---|---:|---:|---|
| False positive completion → pc schakelt uit | Zeer hoog | Middel | Unknown blokkeert actie; completion vereist meerdere signals; countdown + abort; test op echte runs. |
| Laptop slaapt ondanks app | Hoog | Middel | Capability preflight, AC-limiet, lidactie uitleg, Modern Standby als unsupported/conditional state. |
| App blijft awake na crash | Hoog | Middel | Lease TTL, watchdog, startup recovery, log reason, test crash/restart. |
| Agent wacht op input | Hoog | Hoog | Detecteer prompt/blocked evidence; geen shutdown in Safe; aparte status. |
| Batterij/thermals lopen leeg/op | Hoog | Middel | DC policy, minimum battery threshold, thermal signal, automatic release/hibernate policy. |
| Security/privilege mismatch | Hoog | Middel | Geen admin-by-default; capability check; minimale rechten; geen shell injection. |
| Te veel configuratie | Middel | Hoog | Eerst 3-step setup; advanced adapters pas na core success. |
| Concurrentie kopieert keep-awake feature | Middel | Hoog | Verdedig op trust, evidence, native polish en lokale auditability. |

## 9. Success definition voor de volgende fase

De onderzoeksfase is geslaagd wanneer een implementatieteam zonder productbeslissingen te raden kan:

- de MVP-scope afbakenen;
- per workloadstatus de poweractie bepalen;
- uitleggen wanneer gesloten-lidgedrag niet beloofd kan worden;
- een testmatrix uitvoeren zonder data loss;
- de eerste schermen en componenten consistent ontwerpen;
- een pilot doen met echte agentruns en een expliciete stopregel.

Niet geslaagd zolang we alleen “keep PC awake” kunnen demonstreren zonder completion, recovery en hardwaregrenzen.
