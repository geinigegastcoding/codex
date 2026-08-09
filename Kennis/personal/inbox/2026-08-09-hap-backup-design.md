# Hap lokale back-up - design

## Doel

Maak alle lokale Hap-data overdraagbaar en herstelbaar zonder account, cloud of verborgen serveropslag.

## Data in de back-up

- Opgeslagen recepten.
- Lokaal smaakmodel.
- Eetprofiel en filters.
- Boodschappen, vinkjes, handmatige items en vaste voorraad.
- Weekplanner over alle datums.
- Voedingsdoelen en volledige loghistorie.

## Beslissingen

- JSON-container met `app: "Hap"`, eigen versie, exporttijd en geneste data.
- Receptcatalogus en afbeeldingen worden niet gedupliceerd; recept-id's verwijzen naar de ingebouwde catalogus.
- Export is een lokale browserdownload. Er gaat niets naar een server.
- Import is altijd twee stappen: bestand kiezen en valideren, daarna expliciet `Herstel back-up`.
- Iedere deelstaat gebruikt bij import dezelfde bestaande sanitizer als bij normaal laden. Onbekende recept-id's, foute datums en ongeldige getallen worden verwijderd of teruggebracht naar veilige defaults.
- Een niet-Hap-bestand, niet-ondersteunde versie of onleesbare JSON wordt luid afgewezen en verandert geen huidige data.
- App-startup gebruikt dezelfde sanitizers voor saves en smaakmodel, zodat beschadigde `localStorage` de app niet meer kan laten crashen.

## UX

- Profiel krijgt `Mijn lokale data` met exportknop, bestandskiezer en privacyuitleg.
- Na geldige selectie verschijnt exportdatum plus aantallen saves, geplande dagen en logregels.
- Herstel toont een bevestiging omdat bestaande lokale data wordt vervangen.
- Succes of fout verschijnt zichtbaar en via `aria-live`.

## Succescriteria

- Exportbestand heeft stabiele versie en bevat alle zes deelstaten.
- Roundtrip door create/parse behoudt geldige data.
- Malformeerde bestanden wijzigen niets.
- Browsertest bewijst download en expliciet herstel.
