# Hap boodschappen v2 - design

## Doel

Laat de boodschappenlijst een volledige winkellijst zijn, niet alleen een receptenexport.

## Beslissingen

- `hap:shopping` migreert veilig van versie 1 naar versie 2.
- Gebruikers kunnen een vrij artikel met optionele hoeveelheid toevoegen en later verwijderen.
- Een handmatig artikel met dezelfde genormaliseerde naam wordt met receptbijdragen gegroepeerd; de herkomst blijft zichtbaar.
- Ingrediënten worden deterministisch ingedeeld in groente & fruit, brood & granen, zuivel & eieren, vlees & vis, voorraad, kruiden en overig.
- `Altijd in huis` is een blijvende voorraadkeuze per genormaliseerd ingrediënt. Voorraad telt niet als afgevinkt en gaat nooit mee naar Jumbo.
- Gewone vinkjes blijven tijdelijk bij de actuele lijst; verdwijnende artikelen worden opgeschoond.
- De Jumbo-actie gebruikt alleen niet-afgevinkte artikelen die niet in voorraad staan.

## UX

- Boven de lijst staat een compact formulier met artikel en hoeveelheid.
- De lijst krijgt winkelcategorie-koppen met aantallen.
- Ieder artikel heeft een echte checkbox en een aparte voorraadknop; geen geneste interactieve elementen.
- Voorraadartikelen blijven zichtbaar maar gedempt en kunnen met één tik terug op de lijst.
- Een lijst met alleen handmatige artikelen blijft volledig bruikbaar zonder gekozen recept.

## Succescriteria

- Bestaande lokale v1-lijsten laden zonder verlies.
- Handmatig toevoegen, herladen, groeperen, voorraad wisselen en verwijderen zijn getest.
- Cartregels sluiten vinkjes en voorraad aantoonbaar uit.
- Desktop en 390px mobiel blijven overzichtelijk.
