---
title: Ollo opening quiz — NASA fact content review
created: 2026-10-17
updated: 2026-10-17
type: project
status: source-audit
tags: [ollo, quiz, facts, nasa, content-review]
---

# NASA fact cards — content review

Checked 17 October 2026 against seven official NASA pages. Scope is factual accuracy, Dutch clarity and source-label traceability only; this does not evaluate whether quizzes improve learning or phone use.

| Card in OpeningQuiz.kt | Finding, source and proposed action |
|---|---|
| Venus rotation vs orbit · NASA · Venus Facts | **Supported.** NASA gives a 243-Earth-day rotation and 225-Earth-day Venus year. The question explicitly says “draai om zijn as,” avoiding an ambiguous use of “day.” Current choices/explanation/fact are sound. The source label identifies the planet's facts page. [NASA Venus Facts](https://science.nasa.gov/venus/venus-facts/) |
| Sunlight to Earth · NASA · The Solar System | **Supported.** NASA gives about 8 minutes 20 seconds for sunlight to reach Earth (about 150 million km), so “ruim acht minuten” and the eight-minute answer are suitable approximations. The source label is too broad to identify this page. Prefer the exact page title **NASA · Voyager 1: What Is a Light-Day** or **NASA · Earth Facts**. [NASA: Voyager 1 — What Is a Light-Day](https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/) |
| Moon’s distance · NASA · Lunar Laser Ranging | **Supported.** NASA reports the Earth–Moon distance increasing by about 3.8 cm/year from laser-ranging measurements; the app’s “gemiddelde” and “langzaam” are appropriate. The label names the method, not a uniquely identifiable page. Prefer the exact page title **NASA · Laser Beams Reflected Between Earth and Moon Boost Science**. [NASA: Laser Beams Reflected Between Earth and Moon Boost Science](https://www.nasa.gov/missions/lro/laser-beams-reflected-between-earth-and-moon-boost-science/) |
| Saturn density · NASA · Saturn Facts | **Supported.** NASA says Saturn is the only solar-system planet with mean density below water. Its answer and Dutch explanation are accurate; label matches the page. [NASA Saturn Facts](https://science.nasa.gov/saturn/facts/) |
| Mercury polar ice · NASA · Ice on Mercury | **Supported by the MESSENGER follow-up; clarity/source-label candidate.** The generic facts page is more cautious than the dedicated MESSENGER account. That difference alone does not require weakening the app's water-ice fact. The question/answer fit the dedicated source. A clearer explanation could replace “soms nooit zonlicht” with **“In permanent beschaduwde kraters bij de polen kan waterijs blijven bestaan.”** The source label could become **NASA · Water Ice on Mercury**. These are readability/traceability proposals, not a demonstrated wrong answer. [NASA Mercury Facts](https://science.nasa.gov/mercury/facts/), [NASA: Water Ice on Mercury](https://science.nasa.gov/photojournal/water-ice-on-mercury/) |
| Earth largest rocky/terrestrial planet · NASA · Earth Facts | **Supported.** NASA calls Earth the biggest terrestrial planet and states that the four inner planets are made of rock and metal. “Grootste rotsplaneet” and the answer are apt in this quiz context; label matches the page. [NASA Facts About Earth](https://science.nasa.gov/earth/facts/) |

## Summary

No wrong answer was established in the six cards. Parent independently checked the dedicated Mercury page and Earth Facts; the latter also supports the sunlight approximation. Keep Mercury's existing learning fact: NASA's mission evidence supports it. Simpler Mercury wording and more precise sunlight/Moon/Mercury references are candidates. The in-app source is plain text (“Bron: …”), not a citation link; a longer title alone would not provide a complete reference and must also fit large text. The exact URLs in this report are the current source map. No app copy, source-label or navigation change ships from this audit.

## Source inspection note

In [OpeningQuiz.kt](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/domain/OpeningQuiz.kt>), each fact stores question, choices, correct index, explanation, learning fact and a short source string. The overlay displays the source string, but no URL. No factual discrepancy was found in the other five cards’ choices or explanations. The initial review included an unnecessary numerical solar-day aside for Venus; parent removed it because the implemented question only compares explicit rotation with orbit. This audit does not add a solar-day claim.
