# 5 long-form video-ideeen en scripts

De lange formats zijn ontworpen voor 12 tot 30 minuten. De volgorde volgt een praktische demo: probleem, map, workflow, review en resultaat. De toon blijft nuchter. Voeg eigen schermopnamen en echte, geanonimiseerde tests toe voordat je publiceert.

## 1. Bouw je eerste AI-systeem in 45 minuten

**Belofte:** De kijker maakt een kleine werkruimte met Kennis, een skill, output en een eerste test.

**Duur:** 25 minuten.

### Script

**0:00 - Opening**

"Vandaag bouwen we een kleine AI-werkruimte voor één taak die iedere week terugkomt. We gebruiken een inbox- of klantupdate als voorbeeld. Aan het einde staat er een map, een skill en een testbestand. De flow gaat niet automatisch publiceren. We stoppen bij de reviewstap, zodat je precies ziet wat de agent doet en waar jij beslist."

**2:00 - Kies de taak**

"Open een leeg document. Schrijf de taak, frequentie, input en gewenste output op. Kies iets dat je drie keer kunt testen. Een vaag doel geeft later een vaag dashboard en een vage skill."

**5:00 - Open de template**

Toon `.agents`, `.claude`, `Kennis`, `plans`, `output` en `projecten`. Leg uit dat iedere map een eigenaar heeft. Open `AGENTS.md` en de twee authority-bestanden.

**9:00 - Vul Kennis**

Maak een bedrijfsprofiel, projectstatus en bronnotitie. Gebruik frontmatter. Laat zien dat `Unknown` een geldige waarde is wanneer je iets niet hebt gemeten.

**14:00 - Schrijf de skill**

Maak doel, input, stappen, output en stopregels. Spiegel de file. Test de spiegeling met PowerShell.

**18:00 - Draai de workflow**

Geef drie inputbestanden. Laat de agent de relevante Kennis lezen, een concept maken en ontbrekende feiten markeren. Toon een fout wanneer de input tegenstrijdig is.

**22:00 - Review en afsluiting**

"Ik controleer nu de namen, data en volgende acties. Daarna geef ik het bestand een status. De eerste versie hoeft nog geen enorme automatisering te zijn. Hij moet vooral opnieuw uitvoerbaar zijn. Sla je map op, plan een onderhoudsmoment en test hem deze week met drie echte voorbeelden."

**CTA:** "De template staat in de beschrijving. Deel je gekozen taak wanneer je vastloopt bij het afbakenen."

## 2. Van rommelige inbox naar een bruikbare actielijst

**Belofte:** De kijker ziet hoe een e-mail checker werkt zonder zelfstandig te verzenden.

**Duur:** 22 minuten.

### Script

**Opening:**

"Ik laat vandaag zien hoe je een inbox laat sorteren op betekenis. We gebruiken zes labels en een expliciete categorie voor twijfel. Het resultaat is een actielijst, geen automatische verzending."

**Blok 1: labels ontwerpen**

Leg `actie`, `lezen`, `wachten`, `factuur`, `archief` en `onduidelijk` uit. Geef bij ieder label een positieve regel en een grensgeval.

**Blok 2: input schoonmaken**

Gebruik drie geanonimiseerde threads. Verwijder trackingtekst. Laat zien wat er ontbreekt wanneer alleen een onderwerpregel beschikbaar is.

**Blok 3: skill openen**

Lees `email-checker/SKILL.md`. Bespreek waarom de output een tabel bevat en waarom de agent een reden per label geeft.

**Blok 4: live test**

Test een klantvraag, een nieuwsbrief en een betalingswijziging. De betalingswijziging komt op onduidelijk. Laat de gebruiker de conclusie aanpassen voordat er een conceptantwoord ontstaat.

**Blok 5: review**

Controleer afzender, deadline en vervolgstap. Benoem dat een labelvoorstel waardevol is, terwijl een verkeerd verzonden antwoord directe schade kan veroorzaken.

**Slot:**

"Maak de eerste versie met drie mails. Voeg pas meer labels toe wanneer je in de praktijk een terugkerend verschil ziet."

**CTA:** "Download de checklist en schrijf je eigen labels op."

## 3. Bouw een Kennis-vault die je agent kan gebruiken

**Belofte:** De kijker start met een lege vault en bouwt een kleine contextlaag.

**Duur:** 20 minuten.

### Script

**Opening:**

"Een agent kan pas goed verwijzen naar je bedrijf wanneer de informatie ergens staat en een bronstatus heeft. Ik maak vandaag vijf notities. Meer heb je voor de eerste test niet nodig."

**Blok 1: authority**

Open `00-authority.md`. Leg de bronvolgorde en de grens tussen company en personal uit.

**Blok 2: navigatie**

Open `01-navigation.md`. Voeg een link toe naar een project en een source note. Toon hoe je voorkomt dat een nieuwe pagina een los eiland wordt.

**Blok 3: vijf notities**

Maak profiel, aanbod, status, project en bron. Houd elke notitie klein. Gebruik `verified`, `reported`, `proposal` of `historical` wanneer nodig.

**Blok 4: onderhoud**

Voer `validate-kennis.ps1` uit. Bespreek een foutmelding en herstel één ontbrekende frontmatter.

**Slot:**

"De vault is geen archiefwedstrijd. De waarde zit in context die de agent op het juiste moment kan vinden en waar jij de herkomst kunt controleren."

**CTA:** "Begin met vijf notities en deel de map die het meest lastig was."

## 4. Maak van een terugkerende taak je eerste skill

**Belofte:** De kijker schrijft een skill met vaste stappen en test hem met een lastige input.

**Duur:** 24 minuten.

### Script

**Opening:**

"Ik neem een taak die ik steeds opnieuw uitvoer en leg hem vast als een bestand dat een andere agent ook kan volgen. De interessante stap is niet de eerste goede output. Het is de behandeling van een onduidelijke input."

**Blok 1: probleem en trigger**

Schrijf op wanneer de skill start en hoe je merkt dat de taak klaar is.

**Blok 2: regels**

Maak regels voor bronnen, prioriteit, output en stopmoment. Vermijd brede woorden als `goed`, `snel` en `professioneel` zonder uitleg.

**Blok 3: output**

Maak een tabel of vaste koppen. Voeg een sectie `Onzekerheden` toe.

**Blok 4: spiegeling**

Kopieer de skill naar `.agents` en `.claude`. Controleer de bestanden op gelijkheid.

**Blok 5: drie tests**

Test normale input, ontbrekende input en tegenstrijdige input. Noteer precies waar de uitkomst afwijkt.

**Slot:**

"Een skill wordt beter door een echte fout te bewaren. Voeg die fout toe aan je volgende testset en plan een korte onderhoudsdatum."

**CTA:** "Gebruik de system-builder als startpunt voor je eigen taak."

## 5. Dashboard-tour: van overzicht naar capstone

**Belofte:** De kijker ziet hoe het dashboard de cursus, Kennis en skills bij elkaar houdt.

**Duur:** 18 minuten.

### Script

**Opening:**

"Dit dashboard is een beslisscherm voor je AI-systeem. Het doet geen alsof alle data al echt is. Demo-data staat gemarkeerd en de gebruiker kan hem vervangen."

**Blok 1: Overzicht**

Toon voortgang, volgende actie, modulelijst en systeemcheck. Leg uit waarom vier kaarten genoeg zijn voor een eerste versie.

**Blok 2: Kennis**

Open de mapweergave en captureveld. Vertel dat een capture eerst ruw mag blijven en later wordt verwerkt.

**Blok 3: Cursus en Skills**

Klik door de modules en premade skills. Koppel iedere kaart aan een bestand in de repo.

**Blok 4: Community**

Laat het weekritme zien: taak kiezen, input schoonmaken, output reviewen. Toon het vraagformat.

**Blok 5: Eigen data**

Open `src/App.tsx`. Vervang een module, een activiteit en een metric. Run typecheck en build. Maak daarna een screenshot op desktop en mobiel.

**Slot:**

"Een goed dashboard laat zien wat je vandaag moet weten. De rest hoort in de bestanden en workflows eronder. Als je capstone klaar is, laat je eerst de route zien en pas daarna de mooie kaart."

**CTA:** "Bouw één eigen kaart en koppel hem aan een concreet planbestand."

