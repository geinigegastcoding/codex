---
name: email-checker
description: Sorteer en beoordeel binnenkomende e-mail op actie, lezen, wachten of archiveren zonder zelfstandig berichten te versturen.
---

# E-mail checker

## Doel

Maak van een onrustige inbox een korte actielijst. De skill leest alleen binnen de beschikbare mailboxverbinding en maakt een controleerbaar voorstel.

## Werkwijze

1. Controleer of de mailboxconnector beschikbaar is. Als dat niet zo is, vraag om een export of werk met de aangeleverde tekst.
2. Lees afzender, onderwerp, datum, thread en relevante inhoud. Negeer handtekeningen en trackingruis.
3. Classificeer ieder bericht als `actie`, `lezen`, `wachten`, `factuur`, `archief` of `onduidelijk`.
4. Noteer de reden in een zin en benoem een concrete volgende stap.
5. Detecteer deadlines, directe klantvragen, afspraken, betaalverzoeken en privacygevoelige gegevens.
6. Maak conceptlabels of een conceptantwoord. Verstuur niets zonder expliciete bevestiging.
7. Sla een samenvatting op in `Kennis/company/` of `Kennis/personal/` wanneer de informatie duurzaam bruikbaar is.

## Uitvoer

Gebruik deze tabel:

| Prioriteit | Label | Afzender | Onderwerp | Volgende stap | Deadline | Zekerheid |
| --- | --- | --- | --- | --- | --- | --- |

Sluit af met `Direct controleren`, `Kan later`, en `Onzekerheden`.

## Regels

- Markeer phishing, betaalwijzigingen, juridische claims en verzoeken om geheimen als `onduidelijk` totdat een mens ze heeft gecontroleerd.
- Gebruik `Unknown` of `onbekend` wanneer een deadline of afzender niet verifieerbaar is.
- Verander geen label op basis van alleen de onderwerpregel als de inhoud iets anders zegt.
- Houd privé- en bedrijfsinformatie gescheiden.
- Een concept is nooit een verzonden bericht.

## Controle

Rapporteer het aantal gelezen berichten, het aantal onduidelijke berichten en eventuele ontbrekende connectorrechten. Verzin geen samenvatting wanneer de thread niet volledig beschikbaar is.

