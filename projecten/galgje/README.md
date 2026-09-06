# Nederlandse galgje-beslisboom

Dit project traint voor iedere woordlengte een eigen `DecisionTreeClassifier`.
Bij elke beurt wordt de volledige kandidaatlijst opnieuw berekend. De keuze
gebruikt een frequentieprioriteit voor normale Nederlandse woorden en de boom
leert uit realistische galgje-states welke letter de kandidaatlijst goed raakt
en opdeelt.

De standaardlijst is de officiële OpenTaal-lijst. De bron bevat versie 2.20.23,
413.937 regels en na de galgje-filter 391.918 unieke speelbare woorden.
`woorden_opentaal.txt` is de originele bron; `woorden_opentaal_galgje.txt` is de
opgeschoonde afgeleide lijst die de trainer standaard gebruikt. De bijbehorende
licentie en bronvermelding staan in `LICENSE-OpenTaal.txt`.

`woorden_frequentie_10000.txt` is een aanvullende ranglijst met veelgebruikte
woorden. Die lijst bepaalt alleen hoe waarschijnlijk een kandidaat is; woorden
die er niet in staan blijven gewoon speelbaar. De bronvermelding staat in
`BRON-dutch-words.txt`.

Geen enkele levende taal heeft letterlijk een eindige, volledig actuele
woordenlijst. OpenTaal is hier de brede officiële-spelling-basis; eigennamen,
samenstellingen en nieuwe woorden kunnen later nog worden toegevoegd.
`woorden_demo.txt` blijft alleen voor de snelle zelftest.

## Snel testen

```powershell
cd E:\MData\projecten\galgje
python -m pip install scikit-learn
python galgje_tree.py self-test
python galgje_tree.py train
python -B -m unittest -v test_galgje.py
python galgje_tree.py evaluate --games 100
python galgje_tree.py game
python galgje_tree.py play --secret computer
python galgje_tree.py predict --pattern ________
```

De training maakt `galgje_model.pkl`. Dit bestand is lokaal gegenereerd en
hoort alleen bij de gebruikte woordenlijst; na wijzigingen aan die lijst moet
je opnieuw trainen.

## Eigen Nederlandse woordenlijst

```powershell
python galgje_tree.py train `
  --words C:\pad\naar\nederlandse_woorden.txt `
  --model galgje_model.pkl `
  --states-per-length 2000 `
  --max-training-words 5000
```

Standaard gebruikt `train` ook `woorden_frequentie_10000.txt`. Zonder die
prior trainen kan met `--no-frequency`; dat is vooral nuttig voor experimenten.

Regels die geen schoon alfabetisch woord bevatten worden overgeslagen en
zichtbaar gemeld. Accenten worden ondersteund. `ij` wordt behandeld als twee
letters, zoals in een normale Nederlandse galgjevariant.

## OpenTaal bijwerken

De meegeleverde bronbestanden zijn rechtstreeks afkomstig van:
`https://github.com/OpenTaal/opentaal-wordlist`.
Download na een nieuwe release opnieuw `wordlist.txt`, voer dezelfde
alfabetische galgje-filter uit en train daarna opnieuw. Bewaar altijd
`LICENSE-OpenTaal.txt` bij de bronlijst.

## Commando's

- `train`: maakt per woordlengte een boom en slaat alle modellen plus de
  frequentieprioriteit op.
- `evaluate`: test willekeurige woorden en toont winpercentage, fouten en
  resultaten per lengte.
- `game`: speel zelf een volledige interactieve galgjeronde. Standaard kiest
  het model een woord van lengte 4 t/m 12; gebruik bijvoorbeeld `--length 8`
  voor een vaste lengte.
- `play --secret woord`: laat de AI een bekend testwoord raden. Zonder
  `--secret` wordt het woord verborgen ingevoerd.
- `predict`: geeft voor een patroon zoals `__a__` de volgende letter.
- `self-test`: controleert trainen, opslaan/laden en daadwerkelijk oplossen.

De solver filtert na iedere goede of foute gok opnieuw op patroon en foute
letters. De boom wordt gebruikt als hij dezelfde keuze maakt als de exacte
frequentiegewogen kandidaatberekening; anders wint die kandidaatberekening.
Zo kan een onzekere boom geen leven verspillen. De prior is een praktische
benadering van woordkans, geen garantie dat ieder onbekend woord voorspeld kan
worden.
