# Hap calorie- en macrotracker - design

## Doel

Geef gebruikers een volledige, lokale dagregistratie voor energie, eiwit, koolhydraten en vet, gekoppeld aan Hap-recepten maar bruikbaar voor iedere maaltijd.

## Veiligheidskeuzes

- Startdoelen zijn expliciet de EU-referentie-inname voor een gemiddelde volwassene: 2.000 kcal, 50 g eiwit, 260 g koolhydraten en 70 g vet. Ze zijn geen persoonlijk doel.
- De gebruiker kan ieder doel zelf aanpassen; Hap berekent geen tekort uit gewicht, leeftijd of geslacht en geeft geen afslankvoorschrift.
- De interface moraliseert niet over eten: geen strafkleur, streak voor onder-eten of compliment voor zo weinig mogelijk calorieën.
- Boven een doel wordt feitelijk als `boven referentie` getoond; onder een doel als `resterend`.
- Receptwaarden blijven schattingen op basis van ingrediëntdekking. Handmatige waarden komen volledig van de gebruiker.
- Plannen is niet eten: weekplanner-items worden nooit automatisch gelogd. Loggen is altijd een expliciete actie.
- Geen gewichtstracker, automatisch calorietekort of medisch advies in deze fase.

## Data

- Opslag: versioned `hap:tracker` in `localStorage`.
- Doelen: kcal, eiwit, koolhydraten en vet.
- Logregel: id, datum, maaltijdtype, naam, bron, optioneel recept-id, gegeten porties en de vastgelegde macrototalen.
- Receptwaarden worden bij loggen gekopieerd zodat historie niet verandert wanneer receptberekening later verbetert.
- Invoer wordt begrensd en ongeldige, oude of onbekende velden worden bij laden gesaneerd.

## UX

- Desktopnavigatie krijgt `Voedingslog`; mobiel gebruikt vijf kernitems en het bestaande avatar-icoon voor profiel.
- Vandaag opent standaard, met vorige/volgende dag en `Vandaag`.
- Bovenaan staan energie en drie macrovoortgangen, inclusief gebruikte en resterende/boven-doel waarden.
- Dagregels zijn gegroepeerd in ontbijt, lunch, diner en tussendoor.
- Receptdetails krijgen `Log in voedingslog`, met datum, maaltijdtype en gegeten porties (los van bereidingsporties).
- De tracker heeft een handmatig formulier voor naam en vier voedingswaarden.
- Een compacte zeven-dagenhistorie toont dagelijkse kcal zonder oordeel en berekent een gemiddelde op gelogde dagen.
- Doelen zijn inline bewerkbaar in een apart paneel met de EU-bron en permanente niet-medische uitleg.

## Succescriteria

- Recept en handmatige invoer loggen, herladen, navigeren en verwijderen zonder dataverlies.
- Portiefracties schalen alle vier waarden correct.
- Doelen worden veilig gemigreerd en gesaneerd.
- Planneritems tellen niet mee zonder expliciete logactie.
- Browserflows, domeintests, typecheck, build en desktop/mobile screenshots zijn groen.
