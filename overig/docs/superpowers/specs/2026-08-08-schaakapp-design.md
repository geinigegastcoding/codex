# Schaakapp Design

## Doel

Een zelfstandige lokale webapp in `E:/MData/schaak` waarin twee spelers op één scherm een partij kunnen spelen met anime-waifu-avatars als schaakstukken.

## Architectuur

- Vanilla HTML, CSS en JavaScript; geen framework, bundler of runtime-dependency.
- `index.html` bevat de semantische interface en een lege 8x8 board mount.
- `styles.css` bevat de moonlit-dojo visual system, responsive layout en board states.
- `app.js` bevat state, legal move generation, rendering, interaction en game controls.
- `test.mjs` gebruikt Node's ingebouwde `assert` om de kernregels te controleren.

## Gedrag

- Startpositie is standaard schaak.
- Klik/tap op een eigen stuk om mogelijke zetten te tonen; klik daarna op een doelveld.
- Ondersteunt normale zetten, slaan, schaak, schaakmat, pat, rokade, en passant en promotie.
- Undo, nieuw spel en flip board zijn beschikbaar.
- De partijstatus en recente zetten blijven zichtbaar.
- Anime-portretten laden van DiceBear Lorelei met per stuk een vaste seed; bij netwerkfalen wordt een lokale SVG-avatar gebruikt.
- Zonder externe assets/API blijft de partij volledig speelbaar.

## Visuele richting

Een donkere speelzaal met inktblauw, warm ivoor en roos-goud. Het bord is het primaire focuspunt; de avatars krijgen een ronde medaillonstijl bovenop elk veld. De UI gebruikt ruime panelen, fijne lijnen, compacte labels en voldoende contrast voor toetsenbordfocus.

## Foutafhandeling en grenzen

- Ongeldige zetten worden niet uitgevoerd en veranderen de state niet.
- Een afbeelding die niet laadt krijgt direct de fallback-avatar.
- De eerste versie bevat geen online multiplayer, accountlaag, engine-tegenstander of persistente opslag.

## Verificatie

- Node self-test voor move legality, check, castling, en passant, promotion, checkmate en undo-state.
- Lokale browsercontrole op desktop en smalle viewport voor board-interactie, responsive layout en fallback-afbeeldingen.
