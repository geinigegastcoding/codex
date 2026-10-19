# WebsitePapa2: wit-oranje testversie

Bijgewerkt: 2026-10-15.

## Vergelijken

- Branch: `codex/papa-orange-test`.
- Commit: `7b845b8` (`feat: build Gerhard Magis white and orange service website`).
- Werkmap: `C:\Users\Daniël\Desktop\Codex\klanten\WebsitePapa2-orange-test`.
- [Lokale preview](http://127.0.0.1:3010).
- De oorspronkelijke werkmap `C:\Users\Daniël\Desktop\Codex\klanten\WebsitePapa2` is niet aangepast. De daar aanwezige wijzigingen aan `package.json` en `package-lock.json` waren vooraf al aanwezig.
- De testbranch is lokaal vastgelegd en niet gepusht of publiek gepubliceerd.

Als de preview niet meer draait:

```powershell
Set-Location -LiteralPath 'C:\Users\Daniël\Desktop\Codex\klanten\WebsitePapa2-orange-test'
npm run dev -- --port 3010 --hostname 127.0.0.1
```

## Gebouwd

Nieuwe homepage, diensten, werkwijze, over Gerhard, expertise, praktijkervaring en contact. Een nieuwe 404-pagina gebruikt hetzelfde ontwerp. Wit met warm oranje, grote Manrope-typografie, een transparant studioportret en grafiekvormen achter het portret.

De inhoud is gebaseerd op de door de gebruiker aangeleverde LinkedIn-tekst: Gerhard Magis, PhD, zijn loopbaan, natuurkundepromotie en ervaring met data, zorg, beleid, financiële modellen en begeleiding van analisten. De aanbeveling van Marieke Pronk is een verkort fragment uit die tekst; de typefout in ‘complexe’ is gecorrigeerd.

Contact gebruikt `contact@magisintel.nl`. De contactknop opent het mailprogramma met een ingevuld onderwerp. Er is geen verzendformulier met een fictieve succesmelding. De footer linkt op alle nieuwe pagina's naar [MagisData](https://magisdata.nl).

Canonical en sitemap gebruiken `https://magisintel.nl`, aansluitend op het opgegeven e-mailadres en de bestaande technische sitemapinstellingen. Publieke routes zijn behouden. Privacytekst en portaalcode zijn niet herschreven.

De bestaande website is niet visueel bekeken; haar marketingtekst en componentimplementaties zijn niet als ontwerpbron gebruikt. Alleen de beschikbare foto's en noodzakelijke technische projectinformatie zijn gebruikt.

## Verificatie

| Lighthouse op de lokale productiepreview | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobiel | 100 | 100 | 100 | 100 | 1,7 s | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0,5 s | 0 |

- `npm run build`: geslaagd, inclusief TypeScript-controle.
- Browsercontrole: zeven pagina's met HTTP 200, één H1, unieke canonicals, titels van maximaal 55 tekens en acht interne bestemmingen per pagina.
- Interne links en social image: HTTP 200. MagisData-backlink: HTTPS HEAD 200.
- Responsive controle op 320, 390, 768, 1024 en 1440 pixels: geen horizontale overflow of afgeknipte hoofdtekst; contactknop in de eerste viewport.
- Mobiel menu, Escape, navigatie, diensten-accordion, grafiektabs en toetsenbordbediening: geslaagd.
- Werkelijk HTTP 404, begrijpelijke uitleg en terugkeer naar home: geslaagd.
- Illustratieve grafieken zijn zichtbaar gemarkeerd als fictieve indexwaarden, zonder klantdata.
- Vier bestaande portaaltests: geslaagd. Node geeft daarbij de bestaande `MODULE_TYPELESS_PACKAGE_JSON`-waarschuwing voor `lib/papa-ai.ts`; dit is een waarschuwing van de testrunner en geen mislukte test.
- Git meldde bij de meegeleverde fontlicentie de gebruikelijke LF/CRLF-normalisatie. De testwerkmap is na de commit schoon.

De browsercontrole staat in [papa-orange.browser.js](C:/Users/Daniël/Desktop/Codex/klanten/WebsitePapa2-orange-test/tests/papa-orange.browser.js). Uitvoeren tegen de draaiende preview:

```powershell
npx --package @playwright/cli playwright-cli -s=papa-orange run-code --filename=tests/papa-orange.browser.js
```

Screenshots en Lighthouse-JSON staan lokaal in `output/playwright/` en zijn genegeerd door Git:

- [Desktop](C:/Users/Daniël/Desktop/Codex/klanten/WebsitePapa2-orange-test/output/playwright/desktop-home.png)
- [Volledige desktopsite](C:/Users/Daniël/Desktop/Codex/klanten/WebsitePapa2-orange-test/output/playwright/desktop-full.png)
- [Mobiel](C:/Users/Daniël/Desktop/Codex/klanten/WebsitePapa2-orange-test/output/playwright/mobile-home.png)
- [Volledige mobiele site](C:/Users/Daniël/Desktop/Codex/klanten/WebsitePapa2-orange-test/output/playwright/mobile-full.png)

Een conflict met de gedeelde animatiestijlen is opgelost met eigen `data-gm-reveal`-attributen. De oude 404-fallback veroorzaakte een ongebruikte foto-preload op gewone pagina's; de nieuwe fallback verhelpt dit. Een zelf gehost variabel lettertype, 512px-afbeeldingslevering en voorrang voor het hoofdportret verbeteren de laadtijd.

## Beeld en generatieprompt

Het portret is gemaakt met de ingebouwde ImageGen-tool, met behoud van herkenbare identiteit en een transparante achtergrond. De originele portretfoto is als identiteitsreferentie gebruikt; deze is niet overschreven.

- [Gebruikt studioportret](C:/Users/Daniël/Desktop/Codex/klanten/WebsitePapa2-orange-test/public/images/gerhard-studio-orange.webp)
- [Social preview](C:/Users/Daniël/Desktop/Codex/klanten/WebsitePapa2-orange-test/public/images/gerhard-social-orange.jpg), 1200 × 630, samengesteld uit het nieuwe portret en typografie.
- Origineel gegenereerde PNG: `C:\Users\Daniël\.codex\generated_images\01a13c2f-f5e3-7770-888c-edfb45574b62\exec-59ee209c-5537-4bf6-a381-7de313591d8a.png`.
- Referentie: `C:\Users\Daniël\Desktop\Codex\klanten\WebsitePapa2\public\images\gerhard-portrait.jpg`.

Exacte generatieprompt:

```text
Use case: identity-preserve. Asset type: a high-end personal portfolio website hero portrait cutout. Input image 1 is the identity reference, of the exact man to depict. Create a photorealistic waist-up studio portrait of this same middle-aged Dutch man, preserving his recognizable facial identity, pale blue eyes, naturally greying brown hair, beard, age, skin detail and facial proportions. He wears a crisp light blue casual button-down shirt, sleeves casually rolled, arms comfortably folded low across his torso. Relaxed confident posture, a small warm natural smile, looking directly at the camera. Torso angled slightly toward the viewer's left, face square to camera. Soft editorial daylight, premium natural photography, no retouching that changes his identity. Composition: vertical 4:5, entire head and both arms inside frame with generous clean space around hair, visible down to waist, centred subject. Background: genuine transparent alpha, clean detailed cutout around hair and shirt; no scene, no background colour, no drop shadow. No text, no logo, no accessories, no props. This is a usable photographic asset, not a website mockup. Save the completed image as a local file and include the local output path in the result.
```

## Referenties

De oranje richting is geïnspireerd door [Twohy Design Works op One Page Love](https://onepagelove.com/twohy-design-works). De persoonlijke portfolio-compositie is mede geïnspireerd door [Isa de Burgh op One Page Love](https://onepagelove.com/isa-de-burgh). Voor krachtige typografie en een duidelijke contactuitnodiging is [Vucko op Mobbin](https://mobbin.com/sites/sections/de7ab043-3d01-4db4-9434-6e927e55e9c1) bekeken.

Manrope is lokaal opgeslagen en wordt via `next/font/local` geladen. De SIL Open Font License is opgenomen bij het lettertype; bron: [Google Fonts](https://fonts.google.com/specimen/Manrope).
