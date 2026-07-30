import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT = String.raw`E:\MData\Kennis\Courses\Stedelijk Gymnasium Leiden - AI voor docenten\01-AI-voor-docenten-2-uur.pptx`;
const RENDER_DIR = String.raw`E:\MData\.temp\stedelijk-ai-course\deck-render`;

const C = {
  paper: "#F7F4EF",
  white: "#FFFFFF",
  ink: "#17222C",
  muted: "#667085",
  burgundy: "#6B1F2A",
  burgundyDark: "#45141B",
  gold: "#D6A756",
  sand: "#E9DFCF",
  pale: "#EEE8DE",
  green: "#2F6B4F",
  greenBg: "#E7F2EC",
  orange: "#A65F16",
  orangeBg: "#FFF1DF",
  red: "#9D2B2B",
  redBg: "#FCE8E6",
  blue: "#315C7D",
  blueBg: "#E7EEF5",
};

const ppt = Presentation.create({ slideSize: { width: 1280, height: 720 } });

function textbox(slide, text, x, y, w, h, opts = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    name: opts.name,
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  box.text = text;
  box.text.style = {
    fontSize: opts.size ?? 26,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    fontFamily: "Arial",
    alignment: opts.align ?? "left",
    verticalAlignment: opts.valign ?? "top",
  };
  return box;
}

function rect(slide, x, y, w, h, fill, opts = {}) {
  return slide.shapes.add({
    geometry: opts.geometry ?? "rect",
    name: opts.name,
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: {
      style: "solid",
      fill: opts.line ?? fill,
      width: opts.lineWidth ?? 0,
    },
    borderRadius: opts.radius,
  });
}

function line(slide, x, y, w, color = C.gold, width = 3) {
  return rect(slide, x, y, w, width, color);
}

function base(title, section, number, background = C.paper) {
  const slide = ppt.slides.add();
  slide.background.fill = background;
  textbox(slide, section.toUpperCase(), 56, 32, 560, 30, {
    size: 17,
    bold: true,
    color: C.burgundy,
  });
  textbox(slide, title, 56, 78, 1165, 70, {
    size: 50,
    bold: true,
    color: C.ink,
    name: `slide-${number}-title`,
  });
  line(slide, 56, 154, 1168, C.gold, 3);
  textbox(slide, String(number).padStart(2, "0"), 1165, 668, 58, 22, {
    size: 16,
    color: C.muted,
    align: "right",
  });
  return slide;
}

function notes(slide, timing, talk, action = "", sources = []) {
  const parts = [
    `Timing: ${timing}`,
    "",
    "Spreektekst / aandachtspunten:",
    talk,
  ];
  if (action) parts.push("", "Actie / interactie:", action);
  parts.push("", "[Sources]");
  if (sources.length) {
    for (const source of sources) parts.push(`- ${source}`);
  } else {
    parts.push("- Geen externe bron; cursusinstructie of eigen werkvorm.");
  }
  slide.speakerNotes.textFrame.setText(parts.join("\n"));
  slide.speakerNotes.setVisible(true);
}

function twoColumns(slide, leftTitle, leftBody, rightTitle, rightBody, opts = {}) {
  const y = opts.y ?? 210;
  const h = opts.h ?? 350;
  line(slide, 56, y, 520, C.burgundy, 6);
  line(slide, 670, y, 520, C.gold, 6);
  textbox(slide, leftTitle, 56, y + 26, 520, 50, { size: 31, bold: true, color: C.burgundy });
  textbox(slide, leftBody, 56, y + 92, 520, h - 90, { size: opts.bodySize ?? 24, color: C.ink });
  textbox(slide, rightTitle, 670, y + 26, 520, 50, { size: 31, bold: true, color: C.burgundy });
  textbox(slide, rightBody, 670, y + 92, 520, h - 90, { size: opts.bodySize ?? 24, color: C.ink });
}

function threeColumns(slide, items, opts = {}) {
  const x0 = 56;
  const gap = 30;
  const w = (1168 - gap * 2) / 3;
  const y = opts.y ?? 220;
  for (let i = 0; i < 3; i++) {
    const x = x0 + i * (w + gap);
    const item = items[i];
    textbox(slide, item.kicker, x, y, w, 34, {
      size: 18,
      bold: true,
      color: item.color ?? C.burgundy,
    });
    textbox(slide, item.title, x, y + 48, w, 66, {
      size: 31,
      bold: true,
      color: C.ink,
    });
    line(slide, x, y + 125, w, item.color ?? C.gold, 4);
    textbox(slide, item.body, x, y + 150, w, opts.h ?? 290, {
      size: opts.bodySize ?? 22,
      color: C.ink,
    });
  }
}

function workshopBand(slide, label, instruction, time) {
  rect(slide, 56, 190, 1168, 106, C.burgundy);
  textbox(slide, label, 86, 213, 330, 50, { size: 32, bold: true, color: C.white });
  textbox(slide, instruction, 420, 210, 610, 58, { size: 24, color: C.white });
  textbox(slide, time, 1050, 213, 135, 50, { size: 32, bold: true, color: C.gold, align: "right" });
}

// 1 — title
{
  const slide = ppt.slides.add();
  slide.background.fill = C.burgundyDark;
  rect(slide, 0, 0, 22, 720, C.gold);
  textbox(slide, "STEDELIJK GYMNASIUM LEIDEN", 70, 56, 660, 32, {
    size: 19, bold: true, color: C.gold,
  });
  textbox(slide, "AI voor docenten", 70, 220, 1030, 100, {
    size: 80, bold: true, color: C.white,
  });
  textbox(slide, "Van eerste prompt naar veilig dagelijks gebruik", 70, 340, 900, 55, {
    size: 34, color: C.sand,
  });
  textbox(slide, "2 uur • uitleg • demo • oefenen • eigen workflow", 70, 585, 850, 35, {
    size: 22, color: C.gold,
  });
  notes(
    slide,
    "0:00-0:02",
    "Open kort. Verbind de training aan het schoolmotto: nieuwsgierigheid én kritisch denken. Zeg dat AI vandaag wordt behandeld als assistent, niet als autopilot.",
    "Vraag om laptops dicht te laten tot de eerste oefening.",
    ["https://www.gymnasiumleiden.nl/"]
  );
}

// 2
{
  const slide = base("Na twee uur kun je dit morgen gebruiken", "Start", 2);
  threeColumns(slide, [
    { kicker: "MAKEN", title: "Sneller starten", body: "Lesopzet\nToetsmatrijs\nVraagvarianten\nRubricconcept" },
    { kicker: "CONTROLEREN", title: "Beter beslissen", body: "Bronnencheck\nTweede lezer\nFeedbackbewijs\nBiascheck" },
    { kicker: "BEGRENZEN", title: "Veilig werken", body: "Geen leerlingdata\nMenselijk eindbesluit\nGeen detectorvonnis\nTransparant gebruik" },
  ], { y: 220, bodySize: 24 });
  notes(
    slide,
    "0:02-0:05",
    "Loop de drie opbrengsten langs. AI-geletterdheid betekent niet alleen kunnen prompten, maar ook risico's begrijpen en passend handelen.",
    "Laat deelnemers één opbrengst kiezen die voor hen vandaag het belangrijkst is.",
    [
      "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=nl",
      "https://www.kennisnet.nl/artificial-intelligence/werken-aan-ai-geletterdheid-op-school/",
    ]
  );
}

// 3
{
  const slide = base("120 minuten: begrijpen, proberen, begrenzen", "Route", 3);
  const items = [
    ["0-25", "Begrijpen", "Wat AI doet en waar het misgaat"],
    ["25-65", "Maken", "Prompten + mini-toets bouwen"],
    ["65-90", "Controleren", "Pauze + feedback als tweede lezer"],
    ["90-105", "Onderzoeken", "AI-signalen zonder detectorvonnis"],
    ["105-120", "Borgen", "Eigen workflow + school-SOP"],
  ];
  let y = 205;
  for (let i = 0; i < items.length; i++) {
    const [time, title, body] = items[i];
    textbox(slide, time, 70, y, 135, 40, { size: 27, bold: true, color: C.burgundy });
    line(slide, 210, y + 20, 80, i % 2 ? C.gold : C.burgundy, 4);
    textbox(slide, title, 320, y - 2, 245, 45, { size: 30, bold: true });
    textbox(slide, body, 590, y, 590, 42, { size: 23, color: C.muted });
    y += 88;
  }
  notes(slide, "0:05-0:08", "Leg de route uit. De cursus wisselt korte uitleg en direct toepassen af.", "Benoem de pauze van vijf minuten.");
}

// 4
{
  const slide = base("Begin bij jouw echte tijdlek", "Nulmeting", 4);
  textbox(slide, "Welke docenttaak kost veel tijd,\nmaar vraagt niet elke seconde jouw unieke oordeel?", 90, 220, 850, 130, {
    size: 43, bold: true, color: C.ink,
  });
  rect(slide, 90, 420, 1080, 100, C.pale);
  textbox(slide, "Schrijf 1 taak op → deel met je buur → markeer: concept, controle of besluit", 125, 450, 1010, 45, {
    size: 28, color: C.burgundy, bold: true,
  });
  notes(slide, "0:08-0:10", "Laat deelnemers een concrete taak kiezen. Stuur weg van vage doelen als 'iets met AI'.", "60 seconden schrijven, 60 seconden duo-uitwisseling.");
}

// 5
{
  const slide = base("AI voorspelt plausibele tekst — geen waarheid", "Basis", 5);
  textbox(slide, "PROMPT", 74, 245, 190, 42, { size: 22, bold: true, color: C.burgundy });
  rect(slide, 74, 300, 280, 116, C.blueBg);
  textbox(slide, "doel + context\n+ bron + criteria", 98, 325, 235, 70, { size: 25, bold: true, color: C.blue });
  textbox(slide, "→", 388, 323, 80, 70, { size: 54, bold: true, color: C.gold, align: "center" });
  rect(slide, 495, 230, 310, 260, C.burgundy);
  textbox(slide, "TAALMODEL", 535, 270, 230, 40, { size: 28, bold: true, color: C.white, align: "center" });
  textbox(slide, "zoekt patronen\nvoorspelt vervolg\nkent jouw context niet", 535, 335, 230, 105, { size: 23, color: C.sand, align: "center" });
  textbox(slide, "→", 835, 323, 80, 70, { size: 54, bold: true, color: C.gold, align: "center" });
  rect(slide, 940, 300, 270, 116, C.orangeBg);
  textbox(slide, "plausibele output\n+ onzekerheid", 965, 325, 220, 70, { size: 25, bold: true, color: C.orange, align: "center" });
  textbox(slide, "Jij controleert: klopt het, past het, mag het?", 245, 555, 790, 55, { size: 34, bold: true, color: C.burgundy, align: "center" });
  notes(slide, "0:10-0:14", "Gebruik de metafoor van een extreem ervaren aanvuller. Het model kan overtuigend klinken terwijl bronnen, redenering of details niet kloppen.", "Vraag één deelnemer om een voorbeeld van overtuigend foutieve AI-output.");
}

// 6
{
  const slide = base("Zet AI in waar varianten goedkoop zijn", "Kansen en grenzen", 6);
  twoColumns(
    slide,
    "Sterke rollen",
    "• brainstormer\n• eerste versie\n• variantenmaker\n• samenvatter\n• kritische tweede lezer",
    "Zwakke rollen",
    "• bron van waarheid\n• autonome beoordelaar\n• beslisser over leerlingen\n• detector van intentie\n• beheerder van gevoelige data",
    { y: 215, bodySize: 27, h: 350 }
  );
  notes(slide, "0:14-0:18", "De praktische grens: laat AI opties of bewijsstructuur maken, maar niet zelfstandig besluiten over leerlingen nemen.", "Laat deelnemers hun gekozen tijdlek onder 'sterke' of 'zwakke' rol plaatsen.");
}

// 7
{
  const slide = base("Een goede prompt is een compacte opdrachtbrief", "Prompten", 7);
  const labels = [
    ["1", "DOEL", "Wat moet er ontstaan?"],
    ["2", "CONTEXT", "Vak, klas, leerdoel"],
    ["3", "BRONNEN", "Waar mag AI op steunen?"],
    ["4", "CRITERIA", "Wanneer is het bruikbaar?"],
    ["5", "FORMAT", "Hoe wil je het ontvangen?"],
    ["6", "CONTROLE", "Wat moet AI en jij checken?"],
  ];
  let y = 200;
  for (let i = 0; i < labels.length; i++) {
    const [n, head, body] = labels[i];
    textbox(slide, n, 70, y, 45, 38, { size: 25, bold: true, color: C.gold });
    textbox(slide, head, 135, y, 220, 38, { size: 25, bold: true, color: C.burgundy });
    textbox(slide, body, 390, y, 770, 38, { size: 23, color: C.ink });
    y += 70;
  }
  notes(slide, "0:18-0:22", "Geen magische formule: de kwaliteit komt vooral van helder leerdoel, relevante bron en expliciete controle.", "Laat deelnemers de zes woorden hardop meelezen.");
}

// 8
{
  const slide = base("Van vaag verzoek naar controleerbaar resultaat", "Prompten", 8);
  twoColumns(
    slide,
    "Te vaag",
    "“Maak een toets over de Romeinen.”\n\nGeen klas\nGeen leerdoel\nGeen bron\nGeen kwaliteitscheck",
    "Werkbaar",
    "Klas 2 gymnasium\nMeetbaar leerdoel\nAlleen opgegeven bron\n20 punten + antwoordmodel\nCheck ambiguïteit en tijd",
    { y: 215, bodySize: 25, h: 365 }
  );
  notes(slide, "0:22-0:25", "Vraag wat de AI in de linkerprompt gedwongen is te raden. Leg uit dat elke gok later controlewerk wordt.", "Laat de groep één ontbrekend criterium toevoegen.");
}

// 9
{
  const slide = base("Live demo: bouw kwaliteit in de prompt", "Demo", 9);
  textbox(slide, "1", 70, 210, 70, 70, { size: 47, bold: true, color: C.gold });
  textbox(slide, "Start expres te vaag", 155, 220, 400, 48, { size: 31, bold: true });
  textbox(slide, "2", 70, 325, 70, 70, { size: 47, bold: true, color: C.gold });
  textbox(slide, "Voeg leerdoel, bron en punten toe", 155, 335, 520, 48, { size: 31, bold: true });
  textbox(slide, "3", 70, 440, 70, 70, { size: 47, bold: true, color: C.gold });
  textbox(slide, "Laat AI zijn eigen output bekritiseren", 155, 450, 610, 48, { size: 31, bold: true });
  rect(slide, 830, 205, 350, 310, C.burgundy);
  textbox(slide, "Let op", 870, 245, 270, 45, { size: 30, bold: true, color: C.gold });
  textbox(slide, "De tweede prompt is niet ‘waar’.\nHij is alleen beter controleerbaar.", 870, 325, 270, 125, { size: 27, color: C.white });
  notes(slide, "0:25-0:29", "Voer de demo uit met de prompt uit de trainershandleiding. Laat één fout of twijfel zichtbaar staan; corrigeer niet alles vooraf.", "Vraag deelnemers hardop welke controle ze als docent nog moeten doen.");
}

// 10
{
  const slide = base("Veilig gebruik begint vóór de prompt", "Privacy", 10);
  threeColumns(slide, [
    { kicker: "GROEN", color: C.green, title: "Fictief", body: "Lesideeën\nVoorbeeldteksten\nQuizvarianten\nStructuurhulp" },
    { kicker: "ORANJE", color: C.orange, title: "Minimaal", body: "Geanonimiseerd werk\nFeedbackconcept\nToetsmateriaal\nExtra controle" },
    { kicker: "ROOD", color: C.red, title: "Niet invoeren", body: "Namen en cijfers\nDossiers en gezondheid\nCentraal examenwerk\nDisciplinaire besluiten" },
  ], { y: 220, bodySize: 23 });
  notes(
    slide,
    "0:29-0:34",
    "Leg uit dat ook indirecte details iemand herkenbaar kunnen maken. Een goedgekeurde tool en centrale accountinstellingen blijven nodig, ook als de prompt zelf weinig gegevens bevat.",
    "Laat drie voorbeelden uit de zaal in groen, oranje of rood plaatsen.",
    [
      "https://www.kennisnet.nl/artificial-intelligence/privacy-en-ai-hier-moeten-scholen-op-letten/",
      "https://www.autoriteitpersoonsgegevens.nl/en/node/266",
    ]
  );
}

// 11
{
  const slide = base("K.L.O.P.T. vóór je output gebruikt", "Controle", 11);
  const items = [
    ["K", "Klopt", "vakinhoud en berekening?"],
    ["L", "Lijn", "met leerdoel en niveau?"],
    ["O", "Onderbouwd", "met bronnen en aannames?"],
    ["P", "Privacy", "gegevens echt minimaal?"],
    ["T", "Tekenen", "jij voor het eindbesluit?"],
  ];
  let y = 205;
  for (let i = 0; i < items.length; i++) {
    const [letter, head, body] = items[i];
    rect(slide, 70, y, 56, 56, i % 2 ? C.gold : C.burgundy);
    textbox(slide, letter, 70, y + 5, 56, 45, { size: 31, bold: true, color: C.white, align: "center" });
    textbox(slide, head, 160, y + 4, 230, 45, { size: 29, bold: true, color: C.burgundy });
    textbox(slide, body, 420, y + 7, 700, 40, { size: 25 });
    y += 83;
  }
  notes(slide, "0:34-0:40", "Introduceer K.L.O.P.T. als vaste laatste stap. Het acroniem staat ook in het werkboek en de SOP.", "Laat iedereen K.L.O.P.T. bij zijn eerste oefenoutput gebruiken.");
}

// 12
{
  const slide = base("Hands-on 1: maak een mini-toets", "Oefenen", 12);
  workshopBand(slide, "WERK IN DUO'S", "Kies één echt leerdoel. Gebruik geen herkenbare leerlinggegevens.", "25 min");
  threeColumns(slide, [
    { kicker: "STAP 1", title: "Maak", body: "Toetsmatrijs\n3-5 vragen\nAntwoordmodel" },
    { kicker: "STAP 2", title: "Controleer", body: "Leerdoel\nAmbiguïteit\nPunten\nHaalbaarheid" },
    { kicker: "STAP 3", title: "Verbeter", body: "Pas prompt aan\nBewaar versie 2\nDeel één reparatie" },
  ], { y: 360, bodySize: 22, h: 200 });
  notes(slide, "0:40-0:43", "Deel de opdracht uit. Duo's mogen eigen materiaal gebruiken zolang het geen gevoelige of beveiligde data bevat.", "Open het werkboek op Hands-on 1.");
}

// 13
{
  const slide = base("Begin bij de toetsmatrijs, niet bij losse vragen", "Hands-on 1", 13);
  textbox(slide, "LEERDOEL", 90, 230, 210, 45, { size: 28, bold: true, color: C.burgundy, align: "center" });
  textbox(slide, "→", 315, 225, 70, 55, { size: 44, bold: true, color: C.gold, align: "center" });
  textbox(slide, "TOETSMATRIJS", 395, 230, 250, 45, { size: 28, bold: true, color: C.burgundy, align: "center" });
  textbox(slide, "→", 660, 225, 70, 55, { size: 44, bold: true, color: C.gold, align: "center" });
  textbox(slide, "VRAGEN", 740, 230, 190, 45, { size: 28, bold: true, color: C.burgundy, align: "center" });
  textbox(slide, "→", 945, 225, 70, 55, { size: 44, bold: true, color: C.gold, align: "center" });
  textbox(slide, "MODEL", 1020, 230, 165, 45, { size: 28, bold: true, color: C.burgundy, align: "center" });
  line(slide, 90, 310, 1095, C.sand, 4);
  textbox(slide, "AI versnelt de keten. Jij bewaakt de uitlijning.", 210, 385, 860, 60, {
    size: 40, bold: true, color: C.ink, align: "center",
  });
  textbox(slide, "Vraag steeds: welk leerdoel wordt in dit antwoord zichtbaar?", 290, 485, 700, 48, {
    size: 27, color: C.muted, align: "center",
  });
  notes(slide, "0:43-0:47", "Zet duo's aan het werk. Herinner ze eraan dat AI eerst de matrijs moet maken.", "Loop rond en vraag welk leerdoel elke vraag daadwerkelijk meet.");
}

// 14
{
  const slide = base("Werkprompt voor toets en antwoordmodel", "Hands-on 1", 14);
  rect(slide, 70, 195, 1140, 385, C.white, { line: C.sand, lineWidth: 2 });
  textbox(
    slide,
    "Ontwerp een mini-toets voor [vak, klas] bij dit leerdoel: [leerdoel].\n\n" +
      "Maak eerst een toetsmatrijs en daarna 3-5 vragen met antwoordmodel en punten. " +
      "Gebruik uitsluitend deze bron: [bron].\n\n" +
      "Controleer ambiguïteit, alternatieve verdedigbare antwoorden, taalniveau en haalbaarheid. " +
      "Sluit af met wat ik als docent nog moet verifiëren.",
    105, 230, 1070, 320,
    { size: 26, color: C.ink }
  );
  textbox(slide, "Kopieer • vul aan • test • verbeter één keer", 350, 610, 580, 38, {
    size: 24, bold: true, color: C.burgundy, align: "center",
  });
  notes(slide, "0:47-1:00", "Laat de prompt zichtbaar staan. Help alleen wanneer duo's vastlopen; stuur steeds terug naar leerdoel, bron en criteria.", "Na 8 minuten: kondig aan dat iedereen nu de eerste output met K.L.O.P.T. controleert.");
}

// 15
{
  const slide = base("De beste winst zit in je reparatie", "Hands-on 1", 15);
  twoColumns(
    slide,
    "AI maakte...",
    "Welke vraag, rubricregel of formulering leek bruikbaar?\n\nWaar was de output te algemeen, fout of oneerlijk?",
    "Ik veranderde...",
    "Wat heb je aangepast?\n\nWelke extra promptregel voorkomt dezelfde fout de volgende keer?",
    { y: 215, bodySize: 25, h: 350 }
  );
  notes(slide, "1:00-1:05", "Nabespreking: verzamel drie concrete reparaties, geen algemene toolreviews.", "Laat elk duo één reparatie noteren in het werkboek.");
}

// 16
{
  const slide = ppt.slides.add();
  slide.background.fill = C.burgundyDark;
  textbox(slide, "5 minuten pauze", 70, 215, 850, 90, { size: 76, bold: true, color: C.white });
  textbox(slide, "Maak deze zin af:", 70, 360, 500, 45, { size: 29, color: C.gold });
  textbox(slide, "“AI was nuttig toen …\nmaar ik moest ingrijpen bij …”", 70, 420, 960, 110, {
    size: 39, bold: true, color: C.sand,
  });
  notes(slide, "1:05-1:10", "Echte pauze. Vraag deelnemers bij terugkomst één observatie met een buur te delen.", "Zet een timer op vijf minuten.");
}

// 17
{
  const slide = base("Bij nakijken is AI een tweede lezer", "Feedback", 17);
  textbox(slide, "1", 80, 240, 70, 70, { size: 46, bold: true, color: C.gold });
  textbox(slide, "Rubric + geanonimiseerd werk", 165, 250, 430, 48, { size: 29, bold: true });
  textbox(slide, "2", 80, 355, 70, 70, { size: 46, bold: true, color: C.gold });
  textbox(slide, "AI koppelt tekstbewijs aan criteria", 165, 365, 500, 48, { size: 29, bold: true });
  textbox(slide, "3", 80, 470, 70, 70, { size: 46, bold: true, color: C.gold });
  textbox(slide, "Docent controleert en beslist", 165, 480, 470, 48, { size: 29, bold: true });
  rect(slide, 760, 230, 390, 310, C.greenBg);
  textbox(slide, "Geen eindcijfer\nuit één modelantwoord", 800, 320, 310, 100, {
    size: 34, bold: true, color: C.green, align: "center",
  });
  notes(slide, "1:10-1:14", "Introduceer de tweede-lezerworkflow. Het doel is consistentie en bewijs, niet het uitbesteden van professionele verantwoordelijkheid.", "Open Hands-on 2 in het werkboek.");
}

// 18
{
  const slide = base("Vraag om bewijs, onzekerheid en feedforward", "Feedback", 18);
  rect(slide, 70, 205, 1140, 310, C.white, { line: C.sand, lineWidth: 2 });
  textbox(
    slide,
    "Je bent tweede lezer, niet de beoordelaar.\n\n" +
      "Vergelijk het geanonimiseerde werk uitsluitend met de rubric. Geef per criterium:\n" +
      "• bewijs uit het werk;\n• voorlopig niveau;\n• één feedforward-tip;\n• onzekerheden.\n\n" +
      "Ken geen eindcijfer toe. Citeer korte passages zodat ik alles kan controleren.",
    105, 235, 1070, 250, { size: 25 }
  );
  textbox(slide, "Sterke promptregel: “citeer het bewijs”", 350, 565, 580, 42, {
    size: 28, bold: true, color: C.burgundy, align: "center",
  });
  notes(slide, "1:14-1:19", "Voer de prompt uit op het fictieve leerlingantwoord. Laat de groep eerst zelf één rubriccriterium beoordelen.", "Vergelijk menselijk oordeel en AI-voorstel.");
}

// 19
{
  const slide = base("Menselijke controle is geen laatste klik", "Beoordelen", 19);
  threeColumns(slide, [
    { kicker: "BEWIJS", title: "Wat staat er?", body: "Korte citaten\nWerkstappen\nBrongebruik" },
    { kicker: "CRITERIUM", title: "Wat telt?", body: "Rubric\nLeerdoel\nAntwoordmodel" },
    { kicker: "BESLUIT", title: "Wie tekent?", body: "Docent\nUitlegbaar\nCorrigeerbaar" },
  ], { y: 230, bodySize: 24 });
  textbox(slide, "Centrale examens: geen AI bij het nakijken", 285, 585, 710, 42, {
    size: 29, bold: true, color: C.red, align: "center",
  });
  notes(
    slide,
    "1:19-1:25",
    "Leg uit dat menselijke controle actief teruggaat naar bewijs en criteria. Benoem de harde grens voor centrale examens.",
    "Vraag waar deelnemers bij hun eigen vak de meeste beoordelingsambiguïteit verwachten.",
    ["https://www.vo-raad.nl/nieuws/vo-raad-geen-ai-bij-nakijken-centraal-examens"]
  );
}

// 20
{
  const slide = base("AI-signalen zijn aanwijzingen, geen vonnis", "Integriteit", 20);
  twoColumns(
    slide,
    "Zwakke signalen",
    "Detectorpercentage\nGladde of formele stijl\nPlots andere toon\nWeinig taalfouten",
    "Betere vragen",
    "Kloppen de bronnen?\nIs het denkproces zichtbaar?\nKan de leerling keuzes uitleggen?\nWat stond vooraf in de opdracht?",
    { y: 220, bodySize: 26, h: 340 }
  );
  notes(
    slide,
    "1:25-1:30",
    "Wees expliciet: geen enkel stijlkenmerk bewijst AI-gebruik. Onderzoek toont aanzienlijke foutpositieven bij niet-moedertaalsprekers in meerdere detectoren.",
    "Vraag welke schade een onterechte beschuldiging kan veroorzaken.",
    ["https://pmc.ncbi.nlm.nih.gov/articles/PMC10382961/"]
  );
}

// 21
{
  const slide = base("Werk van vermoeden naar hoor en wederhoor", "Integriteit", 21);
  const steps = [
    ["1", "Vooraf", "Wat was toegestaan?"],
    ["2", "Controle", "Bronnen en inconsistenties"],
    ["3", "Proces", "Versies, notities, logboek"],
    ["4", "Gesprek", "Neutraal laten uitleggen"],
    ["5", "Besluit", "Menselijk + bestaande regels"],
  ];
  let x = 64;
  for (let i = 0; i < steps.length; i++) {
    const [n, title, body] = steps[i];
    rect(slide, x, 250, 205, 210, i === 4 ? C.burgundy : C.pale);
    textbox(slide, n, x + 20, 270, 45, 42, { size: 28, bold: true, color: i === 4 ? C.gold : C.burgundy });
    textbox(slide, title, x + 20, 325, 165, 42, { size: 26, bold: true, color: i === 4 ? C.white : C.ink });
    textbox(slide, body, x + 20, 380, 165, 55, { size: 20, color: i === 4 ? C.sand : C.muted });
    x += 230;
  }
  textbox(slide, "Detector? Hooguit aanvullend signaal — nooit stap 5.", 325, 525, 630, 42, {
    size: 27, bold: true, color: C.red, align: "center",
  });
  notes(slide, "1:30-1:34", "Loop de vijf stappen door. Koppel aan bestaande schoolprocedures; deze training introduceert geen nieuw sanctieregime.", "Laat deelnemers één neutrale vraag formuleren.");
}

// 22
{
  const slide = base("Maak leren zichtbaar; probeer AI niet onzichtbaar te jagen", "Toetsontwerp", 22);
  threeColumns(slide, [
    { kicker: "TIJDENS", title: "Procesbewijs", body: "Tussenversie\nBronnenlog\nKeuzemomenten\nFeedbackronde" },
    { kicker: "NA", title: "Uitleg", body: "Kort mondeling\nNieuwe toepassing\nVerdedig keuze\nReflecteer op AI" },
    { kicker: "VOORAF", title: "Heldere regels", body: "Toegestaan\nVerplicht\nVerboden\nVermeld gebruik" },
  ], { y: 225, bodySize: 23 });
  notes(slide, "1:34-1:40", "Benadruk dat robuust toetsontwerp proces en begrip zichtbaar maakt. Niet iedere opdracht hoeft volledig AI-vrij te zijn.", "Laat deelnemers één bestaand toetsmoment procesrijker maken.");
}

// 23
{
  const slide = base("Casus: 78% AI, twee onvindbare bronnen", "Integriteit", 23);
  rect(slide, 70, 205, 1140, 125, C.redBg);
  textbox(slide, "Een plots foutloze tekst. Detector: 78%. Twee bronnen bestaan niet.", 105, 245, 1070, 48, {
    size: 31, bold: true, color: C.red, align: "center",
  });
  twoColumns(
    slide,
    "Wat doe je vandaag?",
    "Noteer drie concrete stappen.\n\nWie moet je eventueel betrekken?",
    "Wat doe je niet?",
    "Welke snelle conclusie of handeling is onzorgvuldig?\n\nWat zeg je tegen de leerling?",
    { y: 375, bodySize: 23, h: 220 }
  );
  notes(slide, "1:40-1:45", "Bespreek de casus in duo's. Gewenst: bronnen controleren, neutraal gesprek, procesbewijs, hoor en wederhoor; niet automatisch sanctioneren op detectoruitslag.", "Twee minuten duo's, drie minuten plenair.");
}

// 24
{
  const slide = base("Eén schoolsysteem voorkomt losse improvisatie", "Borgen", 24);
  const rows = [
    ["1", "Goedgekeurde tools", "Welke accounts en functies mogen?"],
    ["2", "Verkeerslicht", "Welke taken zijn groen, oranje of rood?"],
    ["3", "Vaste prompt", "Doel, context, bron, criteria, format, controle"],
    ["4", "K.L.O.P.T.", "Eén outputcheck voor iedereen"],
    ["5", "Escalatie", "Privacy, examen en integriteit naar juiste rol"],
  ];
  let y = 205;
  for (let i = 0; i < rows.length; i++) {
    const [n, title, body] = rows[i];
    textbox(slide, n, 72, y, 45, 38, { size: 25, bold: true, color: C.gold });
    textbox(slide, title, 145, y, 300, 38, { size: 26, bold: true, color: C.burgundy });
    textbox(slide, body, 470, y, 690, 38, { size: 23 });
    y += 77;
  }
  notes(
    slide,
    "1:45-1:49",
    "Introduceer de meegeleverde concept-SOP. De school moet toolkeuze, rollen en escalatiepunten nog vaststellen.",
    "Laat deelnemers benoemen welk schoolbesluit nu het meest urgent is.",
    [
      "https://www.kennisnet.nl/artificial-intelligence/schoolafspraken-over-het-gebruik-van-generatieve-ai/",
      "https://www.kennisnet.nl/artificial-intelligence/privacy-en-ai-hier-moeten-scholen-op-letten/",
    ]
  );
}

// 25
{
  const slide = base("De zesstappen-SOP past op één scherm", "SOP", 25);
  const steps = [
    ["1", "DOEL"],
    ["2", "TOOL"],
    ["3", "DATA"],
    ["4", "PROMPT"],
    ["5", "CONTROLE"],
    ["6", "BESLUIT"],
  ];
  let x = 55;
  for (let i = 0; i < steps.length; i++) {
    const [n, title] = steps[i];
    rect(slide, x, 240, 175, 150, i === 5 ? C.burgundy : C.pale);
    textbox(slide, n, x + 18, 260, 45, 40, { size: 27, bold: true, color: i === 5 ? C.gold : C.burgundy });
    textbox(slide, title, x + 18, 325, 140, 38, { size: 23, bold: true, color: i === 5 ? C.white : C.ink });
    x += 195;
  }
  textbox(slide, "Stop zodra tool, data of menselijke controle niet op orde is.", 250, 475, 780, 50, {
    size: 32, bold: true, color: C.red, align: "center",
  });
  notes(slide, "1:49-1:54", "Loop de SOP snel door. Het stopmoment is belangrijker dan perfecte prompts.", "Laat deelnemers hun gekozen workflow door de zes stappen halen.");
}

// 26
{
  const slide = base("Hands-on 2: ontwerp jouw veilige workflow", "Oefenen", 26);
  workshopBand(slide, "WERK ALLEEN", "Kies één terugkerende taak en maak de menselijke controle expliciet.", "3 min");
  threeColumns(slide, [
    { kicker: "AI-ROL", title: "Wat doet AI?", body: "Concept\nVarianten\nStructuur\nTweede lezer" },
    { kicker: "GRENS", title: "Wat nooit?", body: "Welke data?\nWelk besluit?\nWanneer stop je?" },
    { kicker: "TEST", title: "Binnen 48 uur", body: "Kleine taak\nMeet kwaliteit\nDeel bevinding" },
  ], { y: 360, bodySize: 22, h: 200 });
  notes(slide, "1:54-1:57", "Laat iedereen het invulblad in het werkboek afronden. Dit is de persoonlijke transfer naar de praktijk.", "Na twee minuten: laat de buur één risico zoeken.");
}

// 27 — close
{
  const slide = ppt.slides.add();
  slide.background.fill = C.burgundyDark;
  textbox(slide, "BEGIN KLEIN", 70, 50, 450, 35, { size: 20, bold: true, color: C.gold });
  textbox(slide, "Morgen één taak.\nAltijd zelf controleren.", 70, 190, 1040, 180, {
    size: 72, bold: true, color: C.white,
  });
  line(slide, 70, 420, 1080, C.gold, 4);
  textbox(slide, "Geen persoonsgegevens • geen detectorvonnis • menselijk eindbesluit", 70, 460, 1060, 55, {
    size: 29, color: C.sand,
  });
  textbox(slide, "Je hebt mee: werkboek • prompts • trainershandleiding • AI-SOP", 70, 600, 970, 32, {
    size: 23, color: C.gold,
  });
  notes(slide, "1:57-2:00", "Laat deelnemers hun 48-uursactie aan een buur noemen. Sluit af met de drie rode lijnen op de slide.", "Vraag om één zin: wat ga je testen en hoe controleer je het?");
}

await fs.mkdir(RENDER_DIR, { recursive: true });
for (const [index, slide] of ppt.slides.items.entries()) {
  const stem = `slide-${String(index + 1).padStart(2, "0")}`;
  const png = await ppt.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(RENDER_DIR, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(RENDER_DIR, `${stem}.layout.json`), await layout.text());
}

const montage = await ppt.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(path.join(RENDER_DIR, "deck-montage.webp"), new Uint8Array(await montage.arrayBuffer()));

const pptx = await PresentationFile.exportPptx(ppt);
await pptx.save(OUT);
console.log(OUT);
