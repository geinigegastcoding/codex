# Hap voedingslog v2 - design

## Doel

Maak dagelijks loggen sneller en corrigeerbaar zonder de lokale, niet-medische aanpak van Hap te verlaten.

## Keuzes

- Iedere logregel kan worden aangepast. Handmatige regels krijgen naam, datum, maaltijdtype en macro's; receptregels krijgen datum, maaltijdtype en gegeten porties, waarbij de oorspronkelijke vastgelegde schatting proportioneel wordt geschaald.
- Recente unieke maaltijden kunnen met één expliciete actie op de actieve dag worden herhaald. De kopie krijgt een nieuw id en verandert het origineel niet.
- Alle voedingshistorie kan als UTF-8 CSV worden gedownload voor eigen analyse of overleg met een professional. Export is lokaal en bevat geen verborgen profieldata.
- Een dertig-dagenoverzicht rekent gemiddelden alleen over dagen waarop iets is gelogd. Ontbrekende dagen worden niet als nul-inname behandeld.
- Geen micronutriënten worden toegevoegd zolang de receptbron daarvoor geen voldoende betrouwbare gegevens heeft.

## UX

- Boven de dagregels komt een compacte rij met `Exporteer CSV` en recente maaltijden om opnieuw te loggen.
- Iedere dagregel krijgt `Bewerk` naast `Verwijder`.
- Bewerken gebeurt inline onder de geselecteerde regel, met bewaren en annuleren. De UI meldt duidelijk wanneer receptwaarden opnieuw zijn geschaald.
- Onder de bestaande zevendaagse grafiek komt een dertig-dagenoverzicht met gelogde dagen en gemiddelde kcal, eiwit, koolhydraten en vet.
- Herhalen, bewerken en exporteren geven een zichtbare en voor screenreaders aangekondigde bevestiging.

## Data en veiligheid

- Het bestaande versioned `hap:tracker`-formaat blijft geldig; er is geen migratie nodig.
- Updates lopen door dezelfde sanitizer als nieuwe regels.
- CSV-velden worden correct gequote en formule-achtige tekst wordt geneutraliseerd om spreadsheet-injectie te voorkomen.
- Recente maaltijden worden deterministisch op datum en invoervolgorde gekozen en op bron/recept of genormaliseerde naam ontdubbeld.

## Succescriteria

- Een handmatige regel kan worden aangepast en blijft na herladen correct.
- Een receptregel kan van portie veranderen zonder de historische per-portieschatting te verliezen.
- Een recente maaltijd wordt als zelfstandige regel op de gekozen dag gekopieerd.
- CSV bevat doelen noch privéprofieldata, maar wel alle logregels met datum, type, bron en macro's.
- Dertig-dagengemiddelden negeren ontbrekende dagen expliciet.
- Domeintests, browserflows, typecheck, build, PWA-test en desktop/mobile screenshots blijven groen.
