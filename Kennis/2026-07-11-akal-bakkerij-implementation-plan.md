# Akal Bakkerij Landingpage Implementation Plan

**Status:** Implemented as a local demo on 11 July 2026; not verified as a live production site. Last repository check: 24 July 2026.

**Goal:** Een visueel overtuigende, responsive Nederlandse demo-landingspagina voor Akal Bakkerij bouwen en lokaal draaien.

**Architecture:** Een zelfstandige `index.html` met interne CSS en minimale JavaScript. Relevante lokale foto's en één gegenereerde art-direction referentie ondersteunen het ontwerp zonder framework of buildstap.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, lokale HTTP-server.

---

### Task 1: Beeldselectie en art direction

**Files:**
- Inspect: `customers/Akal Bakkerij/context/*`
- Create: `customers/Akal Bakkerij/assets/akal-ui-reference.png`

- [x] Lokale bronfoto's verzameld onder `customers/Akal Bakkerij/context/`; geselecteerde versies staan onder `assets/upscaled/`.
- [x] Warme art-directionreferentie gegenereerd.
- [x] Referentie opgeslagen als `customers/Akal Bakkerij/assets/akal-ui-reference.png`.

### Task 2: Landingpage

**Files:**
- Create: `customers/Akal Bakkerij/index.html`

- [x] Zelfstandige pagina gebouwd in `customers/Akal Bakkerij/index.html`.
- [x] Hero, assortiment, bewijs, verhaal, bezoekinformatie en footer geïmplementeerd.
- [x] Responsive interne CSS, inline SVG-iconen, alt-teksten en echte bestel-, route- en telefoonlinks toegevoegd.

### Task 3: Verificatie en devserver

**Files:**
- Verify: `customers/Akal Bakkerij/index.html`

- [x] Lokale implementatie en assets zijn aanwezig in de repository.
- [ ] Herhaal vóór klantpresentatie de HTTP-, console-, desktop- en mobiele screenshotcontrole.
- [ ] Bevestig vóór publicatie handelsnaam, actuele openingstijden/prijzen, reviewgegevens en beeldrechten; zie `customers/Akal Bakkerij/info.md`.
