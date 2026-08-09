# Hap weekplanner - design

## Doel

Maak van losse receptkeuzes een uitvoerbare week: zeven dinerplekken, gevoed door het huidige eetprofiel en direct omzetbaar naar de bestaande boodschappenlijst.

## Beslissingen

- De planner gebruikt echte kalenderdatums en start weken op maandag.
- Planning blijft lokaal onder `hap:planner`; oude of onbekende data wordt bij laden gesaneerd.
- Een dag heeft in deze eerste versie precies een diner. Dat houdt plannen snel en voorkomt een zware kalenderinterface.
- Een recept kan vanuit volledige details op een dag van de zichtbare week worden gezet.
- `Vul lege dagen` gebruikt alleen de huidige gefilterde en gerangschikte matches, vermijdt dubbele recepten en overschrijft nooit handmatige keuzes.
- Porties blijven per geplande dag instelbaar van 1 tot 12.
- De hele zichtbare week kan met één actie aan de gecombineerde boodschappenlijst worden toegevoegd; bestaande receptselecties worden bijgewerkt.
- Weekoverzicht toont alleen ondersteunende schattingen: geplande dagen, gemiddelde kcal/eiwit per portie en richtprijs. Geen medisch voedingsplan.

## UX

- Hoofdnavigatie krijgt `Week` tussen Bewaard en Boodschappen.
- Bovenaan staan vorige week, huidige week en volgende week.
- Zeven compacte dagkaarten tonen datum, recept, porties en acties voor details/verwijderen.
- Lege dagen blijven expliciet zichtbaar.
- Auto-fill en boodschappenactie zijn prominente, afzonderlijke acties met duidelijke resultaatmelding.
- Op mobiel wordt de lijst één kolom; de vijf navigatie-items blijven ieder minimaal bruikbaar.

## Grenzen

- Geen accounts, synchronisatie of notificaties.
- Geen claim dat een automatisch gevulde week nutritioneel of medisch compleet is.
- Geen ontbijt/lunch/snacks totdat dinerplanning in gebruik en tests betrouwbaar is.

## Succescriteria

- Plannen, porties aanpassen, herladen, week wisselen en verwijderen werken zonder dataverlies.
- Auto-fill respecteert actieve dieetfilters en bestaande keuzes.
- `Voeg week toe` vult of actualiseert de boodschappenlijst zonder duplicaten.
- Typecheck, domeintests, browserflows, build en desktop/mobile screenshots zijn groen.
