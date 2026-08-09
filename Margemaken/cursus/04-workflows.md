# 04. Van taak naar workflow

## Doel

Je laat een echte taak door een volledige route lopen: verzamelen, beoordelen, bewerken, reviewen en opslaan.

## De minimale route

```text
Input -> Context -> Agentbewerking -> Menselijke review -> Output -> Log
```

Maak elke overgang zichtbaar. Als de input een mailboxthread is, staat de bron in het resultaat. Als de output een klantmail is, blijft het bericht een concept totdat iemand het controleert.

## Voorbeeld: wekelijkse klantupdate

1. Verzamel projectnotities uit `projecten/` en relevante meetingnotities.
2. Controleer status, datum en open acties.
3. Laat de agent een concept maken met vaste koppen: voortgang, risico, volgende stap.
4. Vergelijk het concept met de bronbestanden.
5. Laat een mens formulering en claims goedkeuren.
6. Bewaar het goedgekeurde resultaat in `output/approved/` of de gekozen klantmap.
7. Log wat er is verstuurd of bewust is aangepast.

## Foutsoorten

- ontbrekende input;
- tegenstrijdige status;
- verkeerde klant of projectmap;
- onbewezen claim;
- output in verkeerd formaat;
- externe actie zonder goedkeuring.

Maak een fout zichtbaar. Een lege tabel met `onbekend` is bruikbaarder dan een nette gok.

## Oefening

Voer de workflow drie keer uit. Meet tijdsduur en noteer waar jij moet bijsturen. Pas daarna de skill aan. Maak geen grote abstractie voor een fout die je nog maar eenmaal zag.

## Controle

Een workflow is testbaar wanneer iemand anders de stappen kan volgen met dezelfde drie inputs en kan beoordelen of de output klopt.

## Scriptkader

Laat de volledige route zien met één alledaagse taak. Gebruik een echte fout uit de test. Dat maakt de demo geloofwaardiger dan een perfecte eerste poging.

