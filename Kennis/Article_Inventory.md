# MagisData Content & Article Inventory

Dit document is het handmatige register voor MagisData-artikelen en contentkansen. **Laatst repository-gecontroleerd: 24 juli 2026.** De actieve websites zijn gitlinks waarvan de inhoud niet in deze checkout aanwezig is; daardoor betekent “geregistreerd” niet automatisch dat de URL nu live en bereikbaar is.

## Gepubliceerde Artikelen (Live)

| Datum | Slug / URL | Focus Keywords | Status | Auteur |
|---|---|---|---|---|
| 03-07-2026 | `/inzichten/heeft-een-loodgieter-een-website-nodig` | website loodgieter; heeft een loodgieter een website nodig | Geregistreerd; live status opnieuw verifiëren | Daniël Magis |

## Contentkansen (nog te valideren met zoekwoordonderzoek)

| Topic / Niche | Doelwit Keyword | Prioriteit | Opmerkingen |
|---|---|---|---|
| Boekhouder | "boekhouder website laten maken" | Hoog | Hoge LTV per klant voor boekhouders, ze zoeken vaak naar vindbaarheid. |
| Kapper | "SEO voor kapperszaak" | Gemiddeld | Lokaal zeer competitief (veel zoekvolume). |
| Aannemer | "website aannemer kosten" | Hoog | Grote projecten, veel behoefte aan professionele uitstraling. |

---

**Werkwijze voor het toevoegen van nieuwe artikelen:**
1. Valideer zoekintentie, relevantie, concurrentie en bestaande overlap voordat een onderwerp wordt gekozen.
2. Voer de `seo-article-generator` skill uit voor dit onderwerp.
3. Voer de `seo-page-publisher` skill uit om het te publiceren.
4. Controleer build, metadata, canonical, schema waar relevant, afbeelding(en), minimaal drie geldige interne links en sitemap-opname.
5. Voeg het artikel pas als `Live` toe nadat de productie-URL HTTP 200 geeft.
