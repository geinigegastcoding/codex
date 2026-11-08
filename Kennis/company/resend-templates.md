# MagisData e-mailtemplates

Overzicht van de drie concepten die na de door Daniel bevestigde opruiming op 6 november 2026 in Resend zijn overgebleven. Deze berichten zijn bedoeld voor persoonlijke klantcommunicatie; er is niets gepubliceerd of verzonden.

## Klantreis

| Moment | Concept | Voor gebruik aanvullen |
|---|---|---|
| Aanvraag ontvangen | [Aanvraag ontvangen](https://resend.com/templates/magisdata-aanvraag-vernieuwd) | — |
| Voorstel versturen | [Voorstel](https://resend.com/templates/magisdata-voorstel-vernieuwd) | Voorstel toevoegen |
| Welkom heten | [Welkom en samenwerking](https://resend.com/templates/magisdata-welkom-samenwerking) | — |

De drie concepten zijn via HTML aangemaakt en hebben een automatisch gegenereerde tekstversie. De zeventien overige concepten zijn na expliciete bevestiging verwijderd. Een momentopname van de beschikbare inhoud staat in `resend-template-backup-2026-11-06T21-39-36-601Z.json`; van zeven concepten gaf de MCP geen inhoud terug.

Gebruik de berichten op basis van het werkelijke klantmoment. Ze vormen geen automatische campagne.

## Beelden

De templates gebruiken momenteel het bestaande, publiek bereikbare websitebeeld. Drie nieuwe beelden staan lokaal in `Kennis/company/email-afbeeldingen/`: `kennismaking-email.jpg`, `voorstel-voortgang-email.jpg` en `oplevering-email.jpg`. Deze zijn nog niet aan de templates gekoppeld; daarvoor is een duurzaam bereikbare afbeeldings-URL of een upload in de Resend-editor nodig. De oorspronkelijke PNG's staan in dezelfde map.

De JPEG's zijn 1200 × 676 pixels en ongeveer 93–111 KB. De website gebruikt onder meer wit (`#ffffff`), donker voor lopende tekst (`#171c2b`) en blauw (`#4f58ff`; donkerder `#3d45d7` voor een link op wit). Gebruik geen tekst in de afbeelding voor informatie die de ontvanger moet kunnen lezen.

| Beeld | Geschikt voor | Alternatieve tekst |
|---|---|---|
| `kennismaking-email.jpg` | Aanvraag, kennismaking en welkom | Marmeren hand met een blauw patroon van stippen |
| `voorstel-voortgang-email.jpg` | Voorstel en voortgang | Klassieke beelden op drie treden met blauwe digitale details |
| `oplevering-email.jpg` | Oplevering en opvolging | Marmeren boog met een blauwe bol en digitale details |

## Afzender en gebruik

De concepten gebruiken `Daniel van MagisData <contact@magisdata.nl>` en zijn ondertekend met Daniel. Het domein is in Resend geverifieerd voor verzending. De mails zijn concepten: vul eventuele blokhaken en bijlagen in en publiceer pas wanneer de inhoud klaar is voor gebruik.

Bij de controle op 6 november 2026 meldde Resend DKIM en SPF als geverifieerd; de publieke DNS bevatte een DMARC-record en Cloudflare MX-records. Dat bewijst niet dat een antwoord op `contact@magisdata.nl` in de juiste inbox terechtkomt.

De nieuwe concepten zijn opgeslagen en teruggelezen, maar niet als testmail in Gmail of klassiek Outlook bekeken. Met name de responsieve breedte en witruimte in Outlook zijn daarom nog niet bevestigd.
