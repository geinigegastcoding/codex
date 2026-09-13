---
title: Reading-app — implementatietaken
created: 2026-09-10
updated: 2026-09-12
type: project-tasks
tags: [personal, reading-app, android, tasks]
status: active
source: research.md
---

# Reading-app — implementatietaken

Deze checklist vertaalt [`research.md`](research.md) naar concrete bouwtaken. `research.md` blijft behouden als onderzoeks- en bewijsbron; dit bestand is de uitvoerbare backlog. Een aangevinkte taak is in de huidige APK aanwezig, maar moet bij latere wijzigingen opnieuw worden getest.

## Eerst: lokaal account/archief resetten

- [x] Voeg in Instellingen een duidelijk zichtbare knop `Account resetten` toe.
- [x] Verwijder bij reset alle notities, quotes, reviews, ratings, hoofdstukken en leesvoortgang.
- [x] Toon een expliciete waarschuwing dat de actie niet automatisch ongedaan kan worden gemaakt.
- [x] Bied een keuze om ook de bibliotheek en de opgeslagen geschiedenis van gelezen boeken te verwijderen.
- [x] Houd de keuze begrijpelijk: zonder die optie blijven alleen de kale boekrecords bestaan en worden ze teruggezet naar `Wil ik lezen`.
- [x] Toon na afloop feedback en breng de gebruiker terug naar de lege Bibliotheek.
- [x] Voeg vóór een destructieve reset een optionele JSON-export-snelkoppeling toe.

## P0 — kern betrouwbaar maken

### R-01 — Zoeken in Mijn bibliotheek

- [x] Zoek lokaal op titel, auteur en ISBN.
- [x] Combineer zoeken met de filters `Alles`, `Wil ik lezen`, `Bezig` en `Uitgelezen`.
- [x] Open vanuit elk lokaal resultaat hetzelfde boekdetail.
- [x] Voeg sortering toe: Recent, Titel en Auteur.
- [x] Toon bij grotere collecties een alfabetische letterindex.

### R-02 — Lokale export en herstel

- [x] Exporteer een machineleesbare JSON-backup.
- [x] Exporteer een leesbaar Markdown-archief.
- [x] Toon vóór herstel aantallen en ID-conflicten.
- [x] Bied samenvoegen en vervangen als afzonderlijke herstelkeuzes.
- [x] Bevestig de destructieve vervangactie expliciet.
- [x] Toon bij conflicten voorbeeldtitels en -notities naast de aantallen.

### R-03 — Verder lezen en snelle capture

- [x] Toon maximaal drie recent bijgewerkte boeken met status `Bezig` als terugkeerkaarten.
- [x] Toon huidige pagina, totaal aantal pagina’s en optioneel hoofdstuk.
- [x] Werk absolute paginainvoer en hoofdstukinvoer rechtstreeks bij.
- [x] Maak vanuit Verder lezen direct een notitie.
- [x] Bewaar notities met alleen boek, type en tekst; titel en locatie blijven optioneel.
- [x] Bewaar review- en notitieconcepten duurzaam wanneer de gebruiker teruggaat, roteert of de invoer verlaat.
- [x] Toon een kleine preview van de laatste eigen terugkeercontext.

### R-04 — Journal doorzoekbaar maken

- [x] Toon notities en reviews centraal in één Journal.
- [x] Zoek in notitietekst, titel, boektitel en auteur.
- [x] Toon bronboek, type, locatie en datum bij iedere Journalrij.
- [x] Ondersteun de typen Gedachte, Samenvatting, Quote, Theorie en Notitie bij invoer.
- [x] Laat quotes als favoriet markeren.
- [x] Filter expliciet op een boek.
- [x] Voeg een favorietenfilter toe.
- [x] Voeg de ontbrekende Journalfilters voor Theorie en Notitie toe.

## P1 — sterke uitbreidingen

### R-05 — Volgende volgorde en snel parkeren

- [x] Markeer één boek optioneel als primaire `Volgende` keuze.
- [x] Houd een kleine handmatige shortlist bij zonder algoritmische aanbevelingen of pushberichten.
- [x] Bewaar een voorlopig boekidee met titel, auteur, bron en optionele gedachte.
- [x] Markeer voorlopige items als `Nog niet gekoppeld`.
- [x] Koppel een voorlopig item later aan een gecontroleerd catalogusrecord.

### R-06 — Leesperioden, pauze, DNF en herlezen

- [x] Voeg aparte leesperioden toe met startdatum, einddatum, voortgang, editie, formaat en uitkomst.
- [x] Start met `Nieuwe leesperiode` zonder de vorige periode te wijzigen.
- [x] Bewaar maximaal één actieve periode en toon afgeronde perioden als historie.
- [x] Bewaar DNF als betekenisvolle uitkomst met laatst bekende pagina.
- [x] Laat een privéreden voor DNF optioneel invoeren.
- [x] Laat DNF standaard zonder rating; een rating moet bewust gekozen worden.
- [x] Maak status- en datumcorrectie mogelijk zonder opnieuw aan te maken.
- [x] Waarschuw vóór het archiveren van een periode over pagina’s en bewaarde historie.
- [x] Gebruik archiveren in plaats van onherstelbaar verwijderen.

### R-07 — Taal en editie corrigeren

- [x] Toon bij catalogusresultaten beschikbare titel, auteur, taal, ISBN en jaar.
- [x] Bied handmatig toevoegen wanneer Open Library geen resultaat geeft.
- [x] Voorkom dubbele toevoeging op hetzelfde interne ID of ISBN.
- [x] Toon vóór toevoegen ook formaat en pagina-aantal wanneer beschikbaar.
- [x] Laat vanuit boekdetail een andere editie kiezen zonder notities of voortgang te verliezen.
- [x] Laat titel-, taal-, formaat-, ISBN-, pagina- en covermetadata corrigeren.
- [x] Scheid werk-ID en gekozen editiegegevens; leesperioden bewaren hun eigen editie.
- [x] Maak duidelijk wanneer een Nederlandse of andere taalvariant niet betrouwbaar uit de catalogus komt.

### R-08 — Export van één boek als dossier

- [x] Neem in Markdown titel, auteur, status, voortgang, rating, review, notities en locaties mee.
- [x] Voeg een actie toe om één geselecteerd boek als afzonderlijk Markdown-dossier te exporteren.
- [x] Neem editie, formaat, hoofdstuk en datums volledig mee.
- [x] Neem leesperioden en hun historische relaties mee.

### R-09 — Grote collectie veilig onderhouden

- [x] Voeg multi-select toe voor veilige bulkacties: status wijzigen en verwijderen.
- [x] Vraag bevestiging vóór het verwijderen van een boek.
- [x] Maak verwijderen herstelbaar via een herstelarchief.
- [x] Voeg `Ongedaan maken`-feedback toe omdat herstel echt werkt.
- [x] Behoud bij onderhoudsacties alle niet-betrokken notities en relaties.

### R-11 — Serievolgorde als context

- [x] Toon serienaam en volgnummer wanneer de catalogus dit betrouwbaar levert.
- [x] Laat seriegegevens handmatig corrigeren.
- [x] Toon het volgende deel alleen wanneer dat al in de bibliotheek staat.
- [x] Breid series niet automatisch uit en stuur geen release-notificaties.
- [x] Markeer omnibussen als collectie zonder ze stil te splitsen.

## P2 — opt-in modules die nu zijn gebouwd

Deze modules zijn bewust niet onderdeel van de rustige kernlus. Ze zijn wel beschikbaar als expliciete, lokale of door de gebruiker geconfigureerde acties; niets publiceert of synchroniseert stil op de achtergrond.

- [x] Koppel een quote direct aan een eigen reflectienotitie.
- [x] Homescreen-widget voor het primaire Verder lezen-boek.
- [x] Barcode- of camerascan met zichtbare controle vóór toevoegen en handmatige fallback.
- [x] Lokale profielaccountlaag en optionele cloudsync via een door de gebruiker ingestelde GET/PUT-JSON-companion-endpoint.
- [x] Lokale sociale feed, openbare-reviewmarkering, vrienden en DM’s; externe publicatie blijft opt-in via een toekomstige companion-endpoint.
- [x] Streaks, badges, confetti-feedback, dagelijkse doelen en lokale pushherinneringen.
- [x] Optionele AI-samenvattingen, titelvoorstellen en aanbevelingen via een door de gebruiker ingesteld OpenAI-compatibel endpoint.
- [x] Ingebouwde PDF-reader met pagina-annotaties/highlights en Markdown-relatie-export.
- [x] Uitgebreide custom fields, bezit-/leenadministratie en handmatige Discover-feed op onderwerp.

## R-13 — Lezen voor de lijst-modus

- [x] Bewaar lokaal een gekozen profiel: onderbouw/vmbo, havo 5 of vwo 6.
- [x] Bewaar een instelbaar gewenst aantal boeken per lijst.
- [x] Voeg bestaande bibliotheekboeken toe aan en verwijder ze uit een aparte boekenlijst.
- [x] Toon per lijstboek status, gelezen/nog te lezen en reflectie-checklist.
- [x] Ondersteun leesniveaus S en N1–N6 met handmatige bronvermelding.
- [x] Toon minimum- en streefniveau per profiel met expliciet advieslabel.
- [x] Laat onbekende niveaus onbekend blijven; inferentie op basis van pagina’s of populariteit is niet toegestaan.
- [x] Open vanuit de lijst hetzelfde boekdetail en laat niveau/reflectie inline bijwerken.
- [x] Neem de boekenlijst mee in JSON-, Markdown-export, herstel en accountreset.

## R-14 — Android homescreen-widget

- [x] Toon actieve titel en absolute pagina/totaal op een glanceable widget.
- [x] Toon gelezen/vereist voor de actieve boekenlijst.
- [x] Open vanuit de widget direct de boekenlijstmodus.
- [x] Werk de widget na lokale writes bij en controleer lege, normale en lange titels.
- [ ] Controleer minimale grootte en resize-gedrag op een Android-emulator.

## R-15 — Launcher-logo

- [x] Genereer een eigen open-book logo met image generation.
- [x] Gebruik het asset als launcher- en roundIcon zonder licht/donker-mix.
- [x] Controleer transparantie, schaal en herkenbaarheid in de launcher.

## Verificatie nieuwe modules

- [x] Compileer Kotlin, lint en debug APK na de boekenlijst-/widget-/logo-wijzigingen.
- [x] Smoke-test profielwissel, aantal boeken, toevoegen/verwijderen, niveaucheck en reflectie.
- [x] Controleer persist na force-stop.
- [ ] Controleer herstel via JSON op een schone installatie.
- [x] Controleer reset met en zonder bibliotheek verwijderen inclusief boekenlijstdata.
- [x] Installeer APK, maak screenshot van lijstmodus en controleer widget/deep link visueel.

## Verificatie bij iedere release

- [x] Debug APK bouwen en installeren.
- [x] Bibliotheek, Zoeken, Journal en boekdetail op een echte emulator controleren.
- [x] Android Back, sheets, keyboard en safe-area-insets controleren.
- [x] Open Library-fout, leeg resultaat en handmatige fallback controleren.
- [x] Reset uitvoeren met behoud van boeken en controleren dat alle leesdata weg is.
- [x] Reset uitvoeren met verwijderen van boeken en controleren dat de Bibliotheek leeg is.
- [x] Na een force-stop en herstart controleren dat een volledige reset niet terugvalt naar demo-data.
- [x] JSON exporteren, herstellen, samenvoegen en vervangen op een schone installatie controleren.
- [x] Donker thema, licht thema en systeemthema opnieuw controleren na reset.
