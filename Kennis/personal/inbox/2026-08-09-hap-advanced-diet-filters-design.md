# Hap geavanceerde dieetfilters - design

## Doel

Geef gebruikers controle over persoonlijke ingrediënten die ze niet willen eten en over vet per portie, naast de bestaande eetpatronen, allergenen en macrofilters.

## Keuzes

- Persoonlijke ingrediëntuitsluitingen zijn vrije, lokale termen die tegen volledige ingrediëntnamen worden gematcht.
- Termen worden getrimd, begrensd, hoofdletterongevoelig ontdubbeld en veilig geladen uit oudere of beschadigde opslag.
- De UI biedt suggesties uit de echte lokale catalogus, maar accepteert ook een eigen term.
- Deze functie is nadrukkelijk een voorkeurfilter en geen allergiecontrole. De bestaande EU-allergenenuitsluitingen en veiligheidswaarschuwing blijven apart.
- Een nieuw maximaal-vetfilter gebruikt de al berekende vetwaarde per portie. Het standaardmaximum is ruim en ieder handmatig macrofilter zet het doelprofiel zichtbaar op `custom`.
- Het opslagformaat blijft additief compatibel; oude voorkeuren krijgen veilige defaults bij laden.

## Succescriteria

- Een term sluit ieder gerecht uit waarvan minstens één ingrediëntnaam de term als woord of woordgroep bevat.
- Toevoegen, verwijderen, reload en lokale back-up behouden de juiste termen.
- Ongeldige of dubbele termen verdwijnen bij sanering.
- Maximaal vet werkt samen met alle bestaande filters en verschijnt als actief label wanneer aangepast.
- Domein- en browsertests, typecheck, build, bundlecontract, PWA-offlinecheck en mobiele screenshots zijn groen.
