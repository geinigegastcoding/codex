# 02. Kennis die de agent begrijpt

## Doel

Je bouwt een kleine vault met duidelijke bronnen, grenzen en terugvindbare notities.

## Begin met weinig

Start met vijf notities. Een bedrijfsprofiel, een aanbod, een actief project, een werkafspraak en een bronnotitie zijn genoeg voor de eerste test. Een enorme import maakt het lastig om te zien welke context werkelijk helpt.

## Notitiecontract

Gebruik bij duurzame notities:

```yaml
---
title: Korte naam
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: project
tags: [project]
sources: []
status: proposal
---
```

Zet daarna de uitleg in gewone Markdown. Frontmatter helpt sorteren en controleren. Het vervangt de inhoud niet.

## Bronvolgorde

De actuele instructie van de gebruiker staat bovenaan. Daarna komt een direct gecontroleerde bron, een recente beslissing, historische context en pas daarna een inferentie. Een oude log is handig voor achtergrond en kan tegelijk achterhaald zijn.

## Stappen

1. Maak `Kennis/company/README.md` concreet voor je eigen bedrijf.
2. Maak `Kennis/company/Status.md` met datum en bron.
3. Voeg een project toe via `company/Templates/project-template.md`.
4. Maak een bronnotitie met `company/Templates/source-template.md`.
5. Link de nieuwe pagina in `Kennis/index.md`.
6. Voeg een korte regel toe aan `Kennis/logs/wiki-maintenance.md`.

## Oefening

Neem een werkinstructie die je al hebt. Schrijf hem opnieuw in drie onderdelen: context, stappen en controle. Laat elke stap verwijzen naar een bestand of duidelijke invoer.

## Controle

Zoek in de vault naar dubbele feiten. Vind je een oude en een nieuwe versie, markeer de oude als `historical` of archiveer hem. Verplaats de nieuwe informatie niet zonder de bron te lezen.

## Scriptkader

Laat een rommelige notitie zien en zet hem live om naar een korte bronvaste pagina. Bespreek het verschil tussen een bestand dat handig is voor de agent en een bestand dat alleen lang is.

