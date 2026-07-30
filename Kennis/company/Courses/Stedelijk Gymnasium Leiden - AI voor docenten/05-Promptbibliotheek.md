# Promptbibliotheek - AI voor docenten

Gebruik alleen een door school goedgekeurde AI-tool. Voer geen namen, cijfers, medische gegevens, ondersteuningsbehoeften of herkenbaar leerlingwerk in. Vervang alles door fictieve gegevens.

## De vaste promptstructuur

Kopieer dit blok en vul de haken in:

```text
DOEL
Ik wil [concreet resultaat].

CONTEXT
Vak: [vak]. Niveau/klas: [niveau]. Leerdoel: [leerdoel].
Voorkennis en beperkingen: [context].

BRONNEN
Gebruik uitsluitend de informatie hieronder. Meld het expliciet als iets ontbreekt.
[plak toegestane, niet-vertrouwelijke broninformatie]

CRITERIA
Het resultaat moet voldoen aan:
- [criterium 1]
- [criterium 2]
- [criterium 3]

FORMAT
Lever het op als [tabel/stappenplan/rubric/vragenlijst].

CONTROLE
Sluit af met:
1. aannames;
2. mogelijke fouten of bias;
3. punten die ik als docent moet controleren.
```

## 1. Lesvoorbereiding

```text
Je bent mijn kritische onderwijsassistent. Ontwerp een les van 50 minuten voor [vak, klas] over [onderwerp].
Leerdoel: [meetbaar leerdoel].
Voorkennis: [voorkennis].
Maak: een activerende start van 5 minuten, kerninstructie, begeleide oefening, zelfstandige verwerking en exit-ticket.
Geef per onderdeel tijd, docenthandeling, leerlinghandeling en één veelvoorkomende misvatting.
Gebruik geen feiten buiten de bron hieronder. Markeer ontbrekende informatie.
BRON: [tekst]
Controleer tot slot of elke activiteit aantoonbaar bij het leerdoel past.
```

## 2. Differentiatie zonder drie aparte lessen

```text
Pas deze opdracht aan voor drie ondersteuningsniveaus, zonder het leerdoel te verlagen:
A. extra structuur;
B. standaard;
C. extra uitdaging.
Behoud dezelfde kerninhoud en beoordelingscriteria. Geef per niveau alleen de noodzakelijke aanpassing.
OPDRACHT: [opdracht]
LEERDOEL: [leerdoel]
```

## 3. Toetsmatrijs

```text
Maak een toetsmatrijs voor [vak, klas] op basis van de leerdoelen hieronder.
Verdeel [aantal] punten over kennis, toepassing en redeneren.
Neem per leerdoel op: gewicht, vraagvorm, cognitief niveau, aantal punten en reden voor de keuze.
Controleer of de totale punten en percentages optellen. Verzin geen ontbrekende leerdoelen.
LEERDOELEN: [leerdoelen]
```

## 4. Toetsvragen plus antwoordmodel

```text
Ontwerp [aantal] toetsvragen voor [vak, klas] bij deze toetsmatrijs.
Eisen:
- één eenduidige opdracht per vraag;
- geen onbedoelde hints;
- passende moeilijkheid en taal;
- mix van reproductie, toepassing en redenering;
- apart antwoordmodel met puntentoekenning;
- noem per vraag het getoetste leerdoel.
Voer daarna een kwaliteitscontrole uit op ambiguïteit, inhoudelijke juistheid, overlap en haalbaarheid binnen [tijd].
MATERIAAL: [leerdoelen + bronnen + toetsmatrijs]
```

## 5. Parallelle toetsversie

```text
Maak een parallelle versie van deze toets.
Behoud exact dezelfde leerdoelen, moeilijkheid, vraagvormen, punten en benodigde oplosstappen.
Verander context, getallen en formulering voldoende om overschrijven te beperken.
Geef een equivalentiecheck per vraag en een nieuw antwoordmodel.
TOETS: [toets zonder persoonsgegevens]
```

## 6. Rubric ontwerpen

```text
Maak een analytische rubric voor [product/opdracht] met maximaal 4 criteria en 4 prestatieniveaus.
Formuleer observeerbaar gedrag; vermijd woorden als "goed", "voldoende" en "netjes" zonder uitleg.
Laat elk criterium direct aansluiten op dit leerdoel: [leerdoel].
Voeg een korte controle toe op overlap, meetbaarheid en mogelijke bias.
```

## 7. Feedback als tweede lezer

```text
Je bent tweede lezer, niet de beoordelaar.
Vergelijk het geanonimiseerde werk uitsluitend met de rubric.
Lever:
1. bewijs uit het werk per criterium;
2. voorlopig niveau per criterium;
3. één concrete feedforward-tip;
4. onzekerheden of informatie die ontbreekt.
Ken geen eindcijfer toe. Citeer korte passages zodat ik alles kan controleren.
RUBRIC: [rubric]
GEANONIMISEERD WERK: [tekst]
```

## 8. Antwoordmodel controleren

```text
Controleer dit antwoordmodel als kritische vakcollega.
Zoek naar: feitelijke fouten, meerdere verdedigbare antwoorden, onduidelijke puntentoekenning, afhankelijkheidsfouten en disproportionele taalbelasting.
Geef alleen bevindingen met een concrete voorgestelde reparatie. Meld expliciet wanneer je vakinhoudelijke zekerheid laag is.
VRAAG + ANTWOORDMODEL: [tekst]
```

## 9. Nakijkconsistentie testen

```text
Beoordeel deze drie fictieve antwoorden met hetzelfde antwoordmodel.
Maak verschillen in puntentoekenning zichtbaar en identificeer waar het model onvoldoende eenduidig is.
Stel daarna maximaal drie aanscherpingen van het antwoordmodel voor.
Geef geen oordeel over echte leerlingen.
ANTWOORDMODEL: [model]
FICTIEVE ANTWOORDEN: [A, B, C]
```

## 10. Misvattingen analyseren

```text
Groepeer deze geanonimiseerde, losse fouten in maximaal vijf inhoudelijke misvattingen.
Geef per groep: kenmerk, waarschijnlijke denkstap, controlevraag en korte herstelactiviteit.
Doe geen uitspraken over individuele leerlingen en verzin geen oorzaken.
FOUTENLIJST: [anonieme foutfragmenten]
```

## 11. Broncontrole

```text
Maak van onderstaande AI-output een verificatielijst.
Splits in controleerbare claims. Geef per claim aan:
- welk type betrouwbare bron nodig is;
- welke zoekterm bruikbaar is;
- wat een docent inhoudelijk moet controleren.
Bevestig zelf geen claims zonder meegeleverde bron.
AI-OUTPUT: [tekst]
```

## 12. Tekst op passend taalniveau

```text
Herschrijf deze instructie voor [klas/niveau].
Behoud alle vaktermen die leerlingen moeten leren en leg ze kort uit.
Maak zinnen korter, voeg tussenkopjes toe en geef één voorbeeld.
Verander de inhoud of moeilijkheid van het leerdoel niet.
TEKST: [tekst]
```

## 13. Mondelinge verdiepingsvragen bij twijfel

```text
Maak vijf neutrale mondelinge vragen waarmee een leerling zijn eigen denkproces bij dit werk kan toelichten.
De vragen mogen niet beschuldigend zijn en moeten gaan over keuzes, bronnen, tussenstappen en revisies.
Geef per vraag aan welk procesbewijs de vraag kan opleveren.
OPDRACHT: [opdracht]
WERK: [geanonimiseerd fragment]
```

## 14. Opdracht AI-bestendiger maken

```text
Herontwerp deze opdracht zodat het leerproces beter zichtbaar wordt.
Behoud het leerdoel, maar voeg minimaal twee passende procesbewijzen toe, bijvoorbeeld: bronnenlogboek, tussenversie, mondelinge toelichting, lokaal verzamelde data of reflectie op AI-gebruik.
Maak duidelijk welk AI-gebruik toegestaan, verplicht of verboden is.
OPDRACHT: [opdracht]
```

## 15. Ouders of leerlingen informeren

```text
Schrijf een korte, rustige toelichting voor [leerlingen/ouders] over het AI-gebruik bij deze opdracht.
Vermeld:
- waarom AI wel of niet wordt gebruikt;
- wat toegestaan is;
- welke gegevens nooit mogen worden ingevoerd;
- hoe AI-gebruik wordt vermeld;
- dat de leerling verantwoordelijk blijft voor inhoud en bronnen.
Maximaal 180 woorden, taalniveau B1.
CONTEXT: [opdracht en schoolafspraken]
```

## 16. Hallucinatie- en biascheck

```text
Voer een rode-teamcontrole uit op je vorige antwoord.
Zoek specifiek naar:
1. verzonnen of onbewezen feiten;
2. ontbrekende perspectieven;
3. cultureel of talig vooroordeel;
4. te stellige conclusies;
5. punten waarop menselijke vakkennis nodig is.
Geef daarna alleen een gecorrigeerde versie en een korte lijst van resterende onzekerheden.
```

## 17. AI-gebruik door leerling transparant laten maken

```text
Maak een invulbaar AI-logboek van maximaal één pagina voor deze opdracht.
Velden: tool, datum, doel, gebruikte prompt, bruikbare output, wat is gewijzigd, gecontroleerde bronnen, wat de leerling zelf heeft gedaan.
Voeg een slotverklaring toe: "Ik kan alle keuzes en inhoud in mijn eindproduct uitleggen."
OPDRACHT: [opdracht]
```

## 18. Persoonlijke weekworkflow

```text
Ontwerp een eenvoudige wekelijkse AI-workflow voor mijn werk als docent [vak].
Mijn terugkerende taken: [taken].
Mijn grootste tijdlek: [tijdlek].
Gebruik AI alleen voor concepten, varianten, structurering en controle.
Houd beoordeling, vertrouwelijke communicatie en definitieve besluiten bij mij.
Maak een tabel met taak, AI-rol, menselijke controle, privacyrisico en verwachte tijdwinst.
```

## Snelle kwaliteitscheck voor elke output

- Klopt de vakinhoud?
- Past het bij leerdoel en niveau?
- Zijn bronnen en aannames zichtbaar?
- Is de taal inclusief en niet onnodig sturend?
- Zitten er geen persoonsgegevens in?
- Kan ik het resultaat uitleggen en verdedigen?
- Heb ik zelf de eindbeslissing genomen?
