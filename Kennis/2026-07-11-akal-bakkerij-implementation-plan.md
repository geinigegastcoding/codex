# Akal Bakkerij Landingpage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een visueel overtuigende, responsive Nederlandse demo-landingspagina voor Akal Bakkerij bouwen en lokaal draaien.

**Architecture:** Een zelfstandige `index.html` met interne CSS en minimale JavaScript. Relevante lokale foto's en één gegenereerde art-direction referentie ondersteunen het ontwerp zonder framework of buildstap.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, lokale HTTP-server.

---

### Task 1: Beeldselectie en art direction

**Files:**
- Inspect: `E:/MData/customers/Akal Bakkerij/context/*`
- Create: `E:/MData/customers/Akal Bakkerij/assets/akal-ui-reference.png`

- [ ] Controleer de lokale foto's via een contact sheet en noteer welke winkel- en foodfoto's bruikbaar zijn.
- [ ] Genereer met Image v2 een warme visuele richting voor een Turkse bakkerij/grill zonder tekst of logo's die als eindcontent moeten worden overgenomen.
- [ ] Bewaar het gekozen resultaat onder `assets/akal-ui-reference.png`.

### Task 2: Landingpage

**Files:**
- Create: `E:/MData/customers/Akal Bakkerij/index.html`

- [ ] Bouw semantische secties voor hero, assortiment, bewijs, sfeer, bezoekinformatie en footer.
- [ ] Voeg interne responsive CSS toe in crème, terracotta, olijfgroen en warm rood.
- [ ] Gebruik inline SVG-iconen en toegankelijke links voor Thuisbezorgd, route en telefoon.
- [ ] Gebruik alleen relevante lokale foto's met passende alt-teksten.

### Task 3: Verificatie en devserver

**Files:**
- Verify: `E:/MData/customers/Akal Bakkerij/index.html`

- [ ] Start een lokale statische HTTP-server vanuit de klantmap.
- [ ] Controleer dat de pagina en alle lokale assets HTTP 200 teruggeven.
- [ ] Maak desktop- en mobiele screenshots en controleer layout, leesbaarheid, foto-uitsneden en CTA's.
- [ ] Controleer dat er geen donkerblauw, paars, zwart, emoji's of consolefouten voorkomen.
