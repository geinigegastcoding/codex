# Artikel Generatie Strategie & Guidelines

Dit document dient als "knowledge base" (context base) voor het genereren van kwalitatieve SEO-artikelen voor MagisData. Het doel is om content gaps te vullen, hoger te ranken in zoekmachines en AI "slop" te vermijden.

**Laatst bijgewerkt:** 24 juli 2026. Publiceer niets zonder broncontrole, redactionele review en technische verificatie.

## 1. Tone of Voice & Merkidentiteit
- **Merk:** MagisData
- **Taal:** Nederlands (Doelland: Nederland)
- **Stijl (Cruciaal voor LLM Citations):** Objectief, informatief, extreem behulpzaam en nuchter. Het artikel mag **absoluut geen verkoopverhaal** zijn. We beantwoorden de vraag van de lezer feitelijk en zo goed mogelijk.
- **Geen wij-zij verhalen:** Schrijf niet over "waarom wij de beste zijn". Geef onafhankelijk advies. LLM's (ChatGPT, Gemini) en Google (EEAT) ranken content die écht de intentie helpt, geen verkapte pitches.
- **Doelgroep:** Lokale dienstverleners, MKB-bedrijven en professionals die online beter gevonden willen worden en meer conversie zoeken.

## 2. Artikelstructuur & Template
Elk gegenereerd artikel (vaak in de sectie `Inzichten` / `Kennisbank`) moet strikt voldoen aan de volgende opbouw:

1. **Titel (H1) & Metadata:** Duidelijke, zoekwoord-gedreven titel en meta-beschrijving.
2. **TL;DR / Direct Antwoord (Cruciaal):** De eerste zin van het artikel **geeft direct het antwoord** op de zoekvraag. De zinnen daarna leggen het uit. Dit is perfect voor AI-vindbaarheid (AEO/GEO) en verbetert de gebruikerservaring.
3. **Inleiding / Context:** Korte uitleg waarom dit onderwerp belangrijk is voor de doelgroep.
4. **Kern (Headers H2, H3):** Gebruik **bold**, *italics*, lijsten (bulletpoints), quotes en waar nuttig **tabellen** om de content perfect scanbaar te maken.
5. **Conclusie:** Een sterke en nuttige samenvatting aan het eind.
6. **Relevante FAQ (Veelgestelde Vragen):** 3 tot 5 veelgestelde vragen met korte, directe antwoorden.
7. **Sterke CTA (Call to Action):** Geen standaard spam. De CTA moet extreem relevant zijn voor het onderwerp (bijv. in een artikel over "Website maken in Leiden" is de interne link / CTA gericht op de "Website laten maken Leiden" pagina).
8. **Bronnen & claims:** Onderbouw tijdgevoelige, juridische, financiële, technische en cijfermatige claims met actuele primaire bronnen. Verzin geen ervaring, klantresultaat, citaat of statistiek.

## 3. Interne Links Strategie
- **Vanuit het artikel:** Minimaal 3 werkende, contextueel relevante interne links naar bestaande MagisData-pagina's.
- **Naar het artikel toe:** Zodra een artikel is gegenereerd en gepubliceerd, moet het gelinkt worden vanaf gerelateerde pagina's (via `internal-links.ts` of in-text links).
- Gebruik exacte en beschrijvende anchorteksten (geen "klik hier").

## 4. Afbeeldingen
- Elk artikel **MOET** minimaal één afbeelding bevatten, maar **twee afbeeldingen wordt ten zeerste aangeraden** (bijv. één als header en één ondersteunend in de tekst).
- Afbeeldingen moeten in **WebP** formaat worden opgeslagen voor optimale laadsnelheid.
- Plaatsing is essentieel om tekst op te breken en visuele waarde te bieden. (Methoden voor het vinden/genereren van gratis en passende afbeeldingen worden later geautomatiseerd).

## 5. Implementatie in WebsiteMagisData
- De laatst bekende implementatie gebruikt data-objecten in `content/articles.ts` en rendering via `app/inzichten/[slug]/page.tsx`.
- Deze paden moeten opnieuw worden gecontroleerd zodra de canonieke website-gitlink beschikbaar is; de websitebron ontbreekt in deze checkout.
- Controleer vóór publicatie: unieke title (maximaal 70 tekens), description, canonical, Open Graph, robots/indexeerbaarheid, sitemap, relevante schema, afbeeldingsafmetingen/alt-tekst en alle interne/externe links.

## 6. Te Ontwikkelen (To-Do's)
- Vergelijkingspagina's bouwen (MagisData vs. andere bureaus, vs. DIY, vs. Lovable, vs. WordPress).
- Keyword research automatisering/optimalisatie implementeren.
- Automatische artikelpublicatie opzetten indien mogelijk.
- LLM citations en search rankings bijhouden.

## Definition of done

Een artikel is pas `Live` wanneer de productie-URL HTTP 200 geeft, mobiel leesbaar is, geen console/buildfouten heeft, in de sitemap staat, minstens drie geldige interne links bevat en in [[Article_Inventory]] is geregistreerd met controledatum.
