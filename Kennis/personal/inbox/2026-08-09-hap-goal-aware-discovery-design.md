# Hap doelbewuste receptontdekking - design

## Doel

Verbind het voedingslog met receptontdekking door transparant te tonen welke reeds gefilterde gerechten onder de resterende energiereferentie van de gekozen dag passen.

## Keuzes

- De selectie gebruikt uitsluitend gerechten die al door het volledige eetprofiel, allergenen, persoonlijke ingrediëntuitsluitingen en maaltijdlimieten zijn gekomen.
- `Past binnen` betekent alleen `kcal per portie is niet hoger dan de resterende dagreferentie`; Hap claimt geen persoonlijk voedingsadvies of complete dagbalans.
- De bestaande smaakranking bepaalt de volgorde. Er komt geen verborgen dieet-score of beloning voor zo weinig mogelijk eten.
- Eiwit, koolhydraten en vet worden zichtbaar getoond zodat de gebruiker zelf kan vergelijken.
- Zodra de energiereferentie bereikt of overschreden is, geeft Hap geen restrictieve suggesties; de gebruiker kan wel normaal alle gefilterde recepten blijven ontdekken.
- Openen en loggen blijven twee expliciete acties. Een suggestie telt nooit automatisch als gegeten.

## Succescriteria

- Alleen recepten onder of gelijk aan de resterende kcal worden getoond, in bestaande rankvolgorde en zonder duplicaten.
- Alle actieve dieetfilters blijven van toepassing.
- Bij nul resterend verschijnt een neutrale uitleg en gewone ontdekknop.
- Vanuit een kaart opent het juiste recept; pas de bestaande logactie wijzigt dagtotalen.
- Tests, 320px-layout, build, bundlecontract en offline reload blijven groen.
