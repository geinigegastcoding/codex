# Onderzoek: wat te doen met magisdata.nl?

**Datum:** 22 september 2026  
**Status:** onderzoek en advies; nog geen keuze of implementatie

## Aanleiding

Daniel wil `magisdata.nl` bij nader inzien niet als website van een eigen bedrijf gebruiken. Mogelijke toepassingen die al zijn genoemd: Cloudflare Tunnel, dingen verkopen, portfolio, een eigen digitale ID-kaart, een URL-naar-Google-Drive-downloader en een Codex-endpoint.

## Aannames

- Het domein mag persoonlijk blijven en hoeft niet direct geld op te leveren.
- Lage kosten en weinig onderhoud zijn belangrijker dan zoveel mogelijk functies.
- Publieke onderdelen mogen zichtbaar zijn; persoonlijke tools moeten afgeschermd zijn.
- `magisdata.nl` mag worden behouden omdat `Magis` ook Daniels achternaam is en "data" goed past bij digitale projecten.

## Korte conclusie

De sterkste bestemming is geen nieuwe onderneming, webshop of enkel portfolio, maar een **persoonlijke digitale werkplaats en internet-namespace**:

- `magisdata.nl`: kleine publieke profiel- en startpagina van Daniel;
- `lab.magisdata.nl`: publieke projecten, experimenten en eventueel gratis tools;
- `dash.magisdata.nl`: afgeschermde ingang naar persoonlijke services;
- `save.magisdata.nl`: prive URL-naar-Google-Drive-tool;
- `codex.magisdata.nl`: later eventueel een strikt afgeschermde Codex-jobrunner;
- `pay.magisdata.nl`: alleen toevoegen wanneer er daadwerkelijk een product te koop is.

Daarmee ondersteunt een domein meerdere nuttige rollen zonder te doen alsof MagisData nog een bedrijf is. De hoofdregel is: **het hoofddomein is voor mensen, subdomeinen zijn voor systemen.**

## Wat er nu al staat

- De live website presenteert MagisData nog als bedrijf dat AI-systemen, websites, SEO en advies verkoopt.
- De sitemap bevat 26 publieke URL's. Meerdere oude en nieuwe bedrijfspagina's staan al in zoekresultaten.
- DNS draait al via Cloudflare (`david.ns.cloudflare.com` en `indie.ns.cloudflare.com`).
- Cloudflare Email Routing is al actief via drie Cloudflare MX-records. Het domein kan dus nu al adressen zoals `daniel@magisdata.nl` ontvangen en doorsturen.
- Search Console-verificatie staat als DNS-record ingesteld. Die moet bij een herbestemming behouden blijven.

Dit betekent dat herbestemmen mogelijk is zonder nieuwe infrastructuur, maar ook dat alleen een andere homepage publiceren niet genoeg is om de oude bedrijfsidentiteit op te ruimen.

## Drie samenhangende richtingen

### 1. Persoonlijke digitale werkplaats - aanbevolen

Het domein wordt Daniels vaste digitale adres. De publieke site is een klein profiel met projecten, contact, een downloadbare vCard en links. Prive-tools staan op afgeschermde subdomeinen.

**Sterk omdat:** het dagelijks nut kan hebben, bij de naam past, geen verdienmodel nodig heeft en later alle andere ideeen kan opnemen.  
**Nadeel:** persoonlijke services vragen basisbeheer en goede toegangsbeveiliging.

### 2. Publiek maker-lab

Het domein toont vooral projecten, experimenten, open tools, notities en downloads. Dit is een portfolio zonder dienstverleningsclaims.

**Sterk omdat:** projecten vanzelf bewijs van vaardigheden worden en een tool later alsnog een product kan worden.  
**Nadeel:** een portfolio dat niet wordt bijgehouden veroudert snel en levert weinig dagelijks persoonlijk nut op.

### 3. Stoppen, parkeren of verkopen

Archiveer de huidige site, zet een minimale landingspagina neer of bied het domein te koop aan.

**Sterk omdat:** vrijwel geen onderhoud.  
**Nadeel:** `magisdata.nl` heeft waarschijnlijk meer gebruikswaarde voor Daniel dan verkoopwaarde voor een onbekende koper. Dat is een inschatting: het is geen generiek zoekwoorddomein, maar het combineert wel Daniels achternaam met een relevant technologiewoord.

## Beslismatrix

| Richting | Persoonlijk nut | Past bij naam | Onderhoud | Risico | Bedrijfsdruk | Advies |
|---|---:|---:|---|---|---|---|
| Persoonlijke hub + e-mail | 5/5 | 5/5 | Laag | Laag | Geen | Nu doen |
| Prive toolhub via Tunnel/Access | 5/5 | 5/5 | Middel | Middel | Geen | Klein starten |
| Publiek lab/portfolio | 4/5 | 5/5 | Laag-middel | Laag | Optioneel | Tweede stap |
| Digitale producten verkopen | 3/5 | 4/5 | Middel | Middel | Hoog | Alleen met echt product |
| Algemene webshop | 1/5 | 2/5 | Hoog | Middel | Hoog | Niet doen |
| Parkeren/verkopen | 2/5 | n.v.t. | Zeer laag | Laag | Geen | Alleen bij nul interesse |

## Beoordeling van de genoemde ideeen

### Cloudflare Tunnel

**Goed idee als infrastructuur, niet als doel op zichzelf.** Cloudflare Tunnel laat een lokale service via een uitgaande verbinding publiceren zonder inkomende poorten of publiek IP-adres. Het domein gebruikt Cloudflare al, dus de basis is aanwezig.

Tunnel maakt een service echter niet automatisch prive. Zet Cloudflare Access voor ieder dashboard of endpoint en laat alleen Daniels account toe. Voor machineverkeer zijn service tokens of mTLS geschikter dan een publiek endpoint.

Geschikte toepassingen:

- persoonlijk dashboard of app-launcher;
- automatiseringen en webhooks;
- kleine thuisserverdiensten;
- URL-naar-Drive-downloader;
- Codex-jobrunner;
- status en logs.

Bronnen: [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/), [Cloudflare Access-beleid](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/), [self-hosted applicaties beveiligen](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/).

### Portfolio

**Goed als onderdeel, te smal als enige bestemming.** Gebruik `lab.magisdata.nl` of een `/projects`-gedeelte voor afgeronde projecten, screenshots, korte technische uitleg en links naar live werk. Noem het een persoonlijke werkplaats of projectarchief, niet een bureau.

De beste variant is automatisch of zeer eenvoudig bij te werken: per project alleen probleem, resultaat, gebruikte techniek en link. Geen uitgebreid CMS bouwen voordat dat nodig blijkt.

### Eigen digitale ID-kaart

**Zeer geschikt als publieke basis.** Dit is geen wettelijk identiteitsbewijs, maar een eigen, permanent online visitekaartje dat niet afhankelijk is van LinkedIn of een ander platform.

Minimale inhoud:

- naam en foto;
- korte beschrijving;
- geverifieerde links naar profielen en projecten;
- `daniel@magisdata.nl`;
- downloadbare vCard en QR-code;
- eventueel publieke sleutels.

Later kan `/.well-known/webfinger` worden toegevoegd. WebFinger is een open standaard waarmee software profiel- en identiteitslinks bij een domein kan vinden. Voeg dit pas toe als een concrete dienst het gebruikt; de gewone profielpagina en vCard leveren eerder waarde.

Bron: [RFC 7033 - WebFinger](https://www.rfc-editor.org/rfc/rfc7033.html).

### Automatisch URL naar Google Drive downloaden

**Haalbaar en waarschijnlijk een nuttige eerste prive-tool.** Een formulier ontvangt een URL en doelmap; een lokale runner downloadt het bestand en schrijft het naar Google Drive. Voor grote bestanden is een lokale runner achter Cloudflare Tunnel logischer dan Google Apps Script: Apps Script beperkt een URL Fetch-response tot 50 MB.

De simpelste technische kern is `rclone`: de officiele remote-control-API bevat `operations/copyurl`, en de Google Drive-backend ondersteunt OAuth. Gebruik bij voorkeur de beperkte `drive.file`-scope, zodat de tool alleen bestanden kan beheren die hij zelf heeft gemaakt. Rclone meldt dat zijn gedeelde Google-client-ID in 2026 wordt uitgefaseerd; maak daarom een eigen OAuth-client.

Minimale veiligheidsgrenzen:

- alleen toegankelijk via Cloudflare Access;
- blokkeer localhost, prive-IP-ranges en cloud-metadata-adressen om SSRF te voorkomen;
- maximaal bestandsgrootte, timeout en aantal gelijktijdige downloads;
- vaste doelmap en veilige bestandsnamen;
- log elke mislukking zichtbaar;
- geen publieke "download alles"-dienst vanwege misbruik, malware en auteursrechten.

Bronnen: [Google Drive uploads](https://developers.google.com/workspace/drive/api/guides/manage-uploads), [Apps Script quota's](https://developers.google.com/apps-script/guides/services/quotas), [rclone Google Drive](https://rclone.org/drive/), [rclone remote control](https://rclone.org/rc/).

### Codex-endpoint

**Technisch mogelijk, maar pas als tweede of derde tool.** De officiele Codex SDK kan server-side lokale Codex-threads starten, voortzetten en hervatten. App Server is bedoeld voor rijkere clients met authenticatie, geschiedenis, approvals en gestreamde events.

Maak geen publiek endpoint dat willekeurige prompts direct als shelltaken uitvoert. Een veilige persoonlijke variant ontvangt alleen een klein jobformulier, zet taken in een wachtrij en start Codex in een vooraf gekozen repository/worktree met een beperkte sandbox. Toegang gaat via Cloudflare Access; automatiseringen gebruiken een apart service token. Houd menselijke goedkeuring voor destructieve, publicerende of externe acties.

Bron: [officiele Codex SDK-documentatie](https://learn.chatgpt.com/docs/codex-sdk).

### Dingen verkopen

**Alleen logisch voor concrete, passende digitale producten.** Denk aan een template, kleine tool, handleiding, script of download. Een complete webshop bouwen voordat er een product en koper zijn, voegt vooral werk toe. Stripe Payment Links kan een checkout op bijvoorbeeld `pay.magisdata.nl` plaatsen zonder eigen winkelsoftware.

Voor incidentele verkoop van eigen tweedehandsspullen zijn Marktplaats of Vinted logischer: daar zitten kopers al. Regelmatig inkopen, diensten leveren of met winst verkopen kan fiscaal een bron van inkomen zijn. KVK noemt zelfstandig, commercieel en regelmatig aan anderen verkopen als criteria voor inschrijving; online consumentenverkoop brengt daarnaast informatie-, retour- en andere verplichtingen mee. Dat botst rechtstreeks met de wens om geen eigen bedrijf te voeren.

Bronnen: [Stripe Payment Links en eigen domein](https://docs.stripe.com/payment-links/customize), [Belastingdienst over online verkopen](https://www.belastingdienst.nl/wps/wcm/connect/nl/werk-en-inkomen/content/inkomstenbelasting-betalen-over-internetverkopen), [KVK over een webwinkel](https://www.kvk.nl/starten/een-webwinkel-starten-begin-hier/), [Nederlandse regels voor online verkoop](https://business.gov.nl/regulations/long-distance-sales-and-purchases/).

## Andere kansrijke toepassingen

### Hoog nut, weinig werk

- **Persoonlijk e-mailadres:** `daniel@magisdata.nl`; e-mailrouting is al actief. Cloudflare forwarding is geen volledige uitgaande mailbox, dus antwoorden vanaf het domein vereisen een mailprovider of verzenddienst.
- **Korte links:** `go.magisdata.nl/...` voor stabiele links naar projecten, documenten en profielen.
- **Prive startdashboard:** links, systeemstatus en snelle acties op een Access-beveiligde pagina.
- **Contact- en bestandendrop:** tijdelijke uploadlinks waarmee iemand een bestand aan Daniel kan sturen; gebruik verloopdata en bestandlimieten.
- **Persoonlijke API/webhook-ingang:** `hooks.magisdata.nl` voor bekende automatiseringen, altijd met handtekening of service token.

### Alleen toevoegen bij concreet gebruik

- publieke notities of een digital garden;
- statuspagina voor eigen services;
- nieuwsbriefarchief;
- Fediverse-identiteit via WebFinger;
- download- en releasepagina voor eigen software;
- donatie- of betaallink;
- publieke mini-tools zoals converters of calculators.

## Wat niet doen

- Geen nieuwe uitgebreide bedrijfswebsite bouwen onder een andere tekstuele verpakking.
- Geen algemene webshop starten alleen omdat het domein beschikbaar is.
- Geen NAS, adminpaneel, Codex-runner of downloader publiek bereikbaar maken zonder Access.
- Geen wildcard Tunnel maken die automatisch iedere lokale service publiceert.
- Geen tien subdomeinen vooraf bouwen; ieder subdomein moet een werkelijk gebruikte functie hebben.
- Geen oude dienstpagina's allemaal naar de nieuwe homepage redirecten. Google adviseert een echte `404`/`410` wanneer geen relevante vervanger bestaat; alleen inhoud met een duidelijke opvolger krijgt een `301`.

Bron: [Google Search Central over verwijderde en verplaatste pagina's](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors).

## Aanbevolen minimale eerste versie

1. Archiveer de huidige bedrijfssite lokaal.
2. Vervang het hoofddomein door een kleine pagina: **"Daniel Magis - persoonlijke digitale werkplaats"** met profiel, contact en projecten.
3. Verwijder prijzen, verkoopclaims, leadformulieren en bedrijfspositionering.
4. Geef oude pagina's zonder vervanger een echte `404` of `410`; stuur cases die relevant blijven door naar het projectarchief.
5. Publiceer een nieuwe kleine sitemap en houd Search Console-verificatie actief.
6. Maak een enkel prive-subdomein, `dash.magisdata.nl`, achter Cloudflare Access.
7. Voeg daarna maar een eerste tool toe: `save.magisdata.nl`.
8. Bouw `codex.magisdata.nl` pas wanneer er een exact terugkerend jobtype is dat het endpoint moet uitvoeren.

## Wanneer is dit een succes?

Na dertig dagen:

- het domein wekt nergens meer de indruk van een actief bureau;
- `daniel@magisdata.nl` en de profielpagina zijn bruikbaar;
- minstens een prive-tool wordt werkelijk wekelijks gebruikt;
- geen private service is zonder authenticatie bereikbaar;
- nieuwe onderdelen worden alleen toegevoegd vanuit aantoonbaar gebruik.

## Eindadvies

**Behoud het domein en maak er Daniels persoonlijke digitale werkplaats van.** Start met identiteit, e-mail en een afgeschermd dashboard. Voeg de Drive-downloader als eerste nuttige tool toe. Gebruik het portfolio/lab als openbaar projectarchief. Behandel verkoop als optionele latere functie en een Codex-endpoint als gevoelige interne infrastructuur, niet als publiek speeltje.
