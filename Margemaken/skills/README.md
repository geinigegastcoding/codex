# Skill registry

De basiskit is bewust klein gehouden. Elke skill staat gespiegeld in `.agents/skills/` en `.claude/skills/`.

| Skill | Gebruik | Menselijke controle |
| --- | --- | --- |
| `email-checker` | Inbox triage, labels en antwoordconcepten | Voor verzenden, verwijderen en betaalacties |
| `youtube-transcriber` | Video naar bronnotitie en leerpunten | Voor rechten, claims en publicatie |
| `kennis-navigator` | Kennis lezen, opslaan en onderhouden | Voor gevoelige of onduidelijke context |
| `content-humanizer` | Natuurlijker redigeren in Nederlands | Voor merkstem en feitelijke claims |
| `system-builder` | Terugkerend werk omzetten in een workflow | Voor scope, risico en livegang |

## Nieuwe skill toevoegen

Maak eerst een voorbeeld met een echte taak. Beschrijf trigger, invoer, beslisregels, output, uitzonderingen en controle. Voeg de skill daarna in beide skillmappen toe en werk deze registry bij.

