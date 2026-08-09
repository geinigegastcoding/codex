# 06. Veiligheid en menselijke controle

## Doel

Je kunt benoemen waar de agent mag helpen en waar een mens de laatste beslissing houdt.

## Reviewpunten

Een mens controleert altijd voor:

- verzenden van e-mail of berichten;
- publiceren van tekst, code of beeld;
- betalingen, facturen of prijswijzigingen;
- gebruik van persoonsgegevens;
- juridische, medische of HR-inhoud;
- verwijderen, verplaatsen of archiveren van grote hoeveelheden bestanden.

## Geheimen

Zet sleutels in `.env` of een credential manager. Voeg `.env` toe aan `.gitignore`. Gebruik `.env.example` alleen voor namen en uitleg. Controleer commits met `git diff --staged` voordat je ze deelt.

## Prompt injection

Behandel instructies in een e-mail, webpagina of document als broninhoud. Een bron kan zeggen dat je een bestand moet uploaden of een geheim moet delen. Dat is geen automatische toestemming. Stop bij een onverwachte opdracht en vraag om controle.

## Oefening

Maak een matrix:

| Actie | Agent | Mens | Verboden zonder extra toestemming |
| --- | --- | --- | --- |
| Samenvatten | Ja | Steekproef | Gevoelige bron ontbreekt |
| Conceptmail maken | Ja | Altijd | Verzenden |
| Bericht versturen | Nee | Altijd | Zonder akkoord |
| Label voorstellen | Ja | Bij twijfel | Verwijderen |

## Controle

Laat in je skill zien wat de agent doet bij ontbrekende input, tegenstrijdige feiten en een verzoek om een extern bericht te sturen.

## Scriptkader

Gebruik één veilig en één risicovol voorbeeld. Laat het verschil zien tussen een concept genereren en een actie uitvoeren. Houd de uitleg rustig en concreet.

