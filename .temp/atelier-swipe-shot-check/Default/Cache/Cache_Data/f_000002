const paintings = [
  {
    id: "tussendoor",
    artist: "Mara Veld",
    title: "Tussen twee ademhalingen",
    year: "2024",
    medium: "Acryl op linnen",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1000&q=85",
    alt: "Abstract schilderij met diepe blauwtinten en warme kleurvlakken",
    fallback: "linear-gradient(145deg, #2f5868 5%, #e6785e 53%, #eecb6b 100%)",
    profile: "warm",
    tags: ["Warm", "Gelaagd", "Spontaan"]
  },
  {
    id: "sacht",
    artist: "Noor de Wit",
    title: "Zacht bewijs",
    year: "2022",
    medium: "Olie op paneel",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85",
    alt: "Licht schilderij met zachte aardetinten en een rustige compositie",
    fallback: "linear-gradient(135deg, #d7c7ae, #eddfc9 45%, #77938d 46%, #355b70 100%)",
    profile: "quiet",
    tags: ["Stil", "Aards", "Zacht"]
  },
  {
    id: "nachtbloei",
    artist: "Iris Koster",
    title: "Nachtbloei",
    year: "2025",
    medium: "Gemengde techniek",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=85",
    alt: "Kleurrijk abstract schilderij met roze, blauw en geel",
    fallback: "linear-gradient(155deg, #e95768 0 32%, #efc95f 33% 57%, #43627e 58% 78%, #d77a86 79%)",
    profile: "dreamy",
    tags: ["Dromerig", "Kleur", "Vrij"]
  },
  {
    id: "heldere-hoek",
    artist: "Jules Meijer",
    title: "De heldere hoek",
    year: "2023",
    medium: "Tempera op doek",
    image: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1000&q=85",
    alt: "Grafisch schilderij met geometrische vormen in rood, geel en blauw",
    fallback: "linear-gradient(90deg, #e7785e 0 28%, #f2cc62 29% 59%, #31566e 60% 100%)",
    profile: "graphic",
    tags: ["Grafisch", "Helder", "Geometrisch"]
  },
  {
    id: "zondagmorgen",
    artist: "Lena Vos",
    title: "Zondagmorgen, 08:12",
    year: "2021",
    medium: "Olie op doek",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=85",
    alt: "Schilderachtig werk met zacht ochtendlicht en groene tinten",
    fallback: "linear-gradient(145deg, #a8b79e 0 34%, #e7d9bd 35% 64%, #d67a5e 65% 100%)",
    profile: "quiet",
    tags: ["Licht", "Rust", "Organisch"]
  },
  {
    id: "rood-aan-de-rand",
    artist: "Bo van Rijn",
    title: "Rood aan de rand",
    year: "2024",
    medium: "Olie en krijt",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=85",
    alt: "Expressief schilderij met fel rood en contrasterende donkere vormen",
    fallback: "linear-gradient(135deg, #183746 0 38%, #de624f 39% 67%, #efc75b 68% 100%)",
    profile: "warm",
    tags: ["Expressief", "Contrast", "Moedig"]
  },
  {
    id: "onderstroom",
    artist: "Samira El Idrissi",
    title: "Onderstroom",
    year: "2020",
    medium: "Aquarel en inkt",
    image: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=1000&q=85",
    alt: "Dromerig schilderij met een blauwe ondergrond en lichte vormen",
    fallback: "linear-gradient(160deg, #426b7d, #b5c7bd 43%, #e8c46a 44% 60%, #d87963 61%)",
    profile: "dreamy",
    tags: ["Dromerig", "Vloeibaar", "Ingetogen"]
  },
  {
    id: "vierkant-licht",
    artist: "Daan Smit",
    title: "Vierkant licht",
    year: "2022",
    medium: "Acryl en oliepastel",
    image: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1000&q=85",
    alt: "Modern kleurrijk schilderij met blokken en strepen",
    fallback: "linear-gradient(135deg, #f0c95b 0 24%, #d96051 25% 48%, #315b70 49% 74%, #e7d5b2 75%)",
    profile: "graphic",
    tags: ["Modern", "Blokken", "Direct"]
  },
  {
    id: "zomerregen",
    artist: "Evi van Leeuwen",
    title: "Zomerregen",
    year: "2025",
    medium: "Olie op doek",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1000&q=85",
    alt: "Abstract schilderij met rood, roze, geel en donkerblauw",
    fallback: "linear-gradient(125deg, #e7785c 0 30%, #df9a79 31% 48%, #345d72 49% 74%, #eec866 75%)",
    profile: "warm",
    tags: ["Zon", "Textuur", "Vol"]
  },
  {
    id: "blauwe-kamer",
    artist: "Otis Vermeer",
    title: "Blauwe kamer",
    year: "2023",
    medium: "Pigment op doek",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1000&q=85",
    alt: "Rustig blauw schilderij met een zachte centrale vorm",
    fallback: "linear-gradient(150deg, #274b60 0 33%, #789b99 34% 57%, #e8d8ba 58% 78%, #dd7860 79%)",
    profile: "quiet",
    tags: ["Blauw", "Ruimte", "Concentratie"]
  }
];

const profileTypes = {
  warm: {
    label: "Kleur als kompas",
    name: "De warme verzamelaar",
    description: "Je oog zoekt warmte, beweging en een beetje lef. Je hoeft niet alles te begrijpen om te weten dat het klopt.",
    artLabel: "Warmte",
    tags: ["Koraal", "Oker", "Zichtbare verf"]
  },
  quiet: {
    label: "Ruimte om te kijken",
    name: "De stille observator",
    description: "Je kiest werken die niet meteen alles vertellen. Zachtheid, ritme en een stille onderstroom winnen het van spektakel.",
    artLabel: "Stilte",
    tags: ["Aards", "Licht", "Langzaam"]
  },
  dreamy: {
    label: "Logica mag even wachten",
    name: "De vrije dromer",
    description: "Je valt voor sfeer en mogelijkheden. Een vorm mag vloeibaar blijven en een kleur hoeft nergens op te lijken.",
    artLabel: "Droom",
    tags: ["Vloeibaar", "Blauw", "Verbeelding"]
  },
  graphic: {
    label: "Vorm vóór verhaal",
    name: "De grafische denker",
    description: "Je houdt van duidelijke keuzes, spanning en composities met een eigen ruggengraat. Minder ruis, meer richting.",
    artLabel: "Vorm",
    tags: ["Lijnen", "Contrast", "Structuur"]
  }
};

const storageKey = "atelier-swipe-state-v1";
const elements = {
  cardStack: document.querySelector("#cardStack"),
  progressLabel: document.querySelector("#progressLabel"),
  progressCopy: document.querySelector("#progressCopy"),
  remainingCount: document.querySelector("#remainingCount"),
  savedCount: document.querySelector("#savedCount"),
  profileContent: document.querySelector("#profileContent"),
  savedGrid: document.querySelector("#savedGrid"),
  toast: document.querySelector("#toast"),
  discoverView: document.querySelector("#discoverView"),
  profileView: document.querySelector("#profileView"),
  savedView: document.querySelector("#savedView")
};

let state = loadState();
let actionHistory = [];
let isAnimating = false;
let toastTimer;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && saved.decisions && typeof saved.decisions === "object") {
      return { decisions: saved.decisions };
    }
  } catch (error) {
    console.warn("Atelier Swipe kon de lokale voortgang niet lezen.", error);
  }
  return { decisions: {} };
}

function persistState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    showToast("Je keuzes konden niet lokaal worden bewaard.");
    console.warn("Atelier Swipe kon de lokale voortgang niet bewaren.", error);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getRemainingPaintings() {
  return paintings.filter((painting) => !state.decisions[painting.id]);
}

function getLikedPaintings() {
  return paintings.filter((painting) => state.decisions[painting.id] === "like");
}

function getCurrentPainting() {
  return getRemainingPaintings()[0] || null;
}

function getNextPainting() {
  return getRemainingPaintings()[1] || null;
}

function render() {
  elements.savedCount.textContent = getLikedPaintings().length;
  elements.remainingCount.textContent = getRemainingPaintings().length;
  renderCard();
  renderSaved();
  renderProfile();
}

function paintingCardMarkup(painting, isBack = false) {
  const cardClass = isBack ? "painting-card back" : "painting-card current";
  const loading = isBack ? "lazy" : "eager";
  return `
    <article class="${cardClass}" data-card-id="${escapeHtml(painting.id)}" aria-label="${escapeHtml(painting.title)} door ${escapeHtml(painting.artist)}">
      <div class="painting-art" style="--art-fallback: ${painting.fallback}">
        <img src="${escapeHtml(painting.image)}" alt="${escapeHtml(painting.alt)}" loading="${loading}" />
        <div class="card-topline">
          <span class="card-index">${String(paintings.indexOf(painting) + 1).padStart(2, "0")} / ${paintings.length}</span>
          <span>${escapeHtml(painting.medium)}</span>
        </div>
        <div class="card-caption">
          <p class="card-artist">${escapeHtml(painting.artist)}</p>
          <h3>${escapeHtml(painting.title)}</h3>
          <div class="card-meta">
            <span>${escapeHtml(painting.year)}</span>
            <span>${escapeHtml(painting.tags[0])}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderCard() {
  const current = getCurrentPainting();
  const next = getNextPainting();

  if (!current) {
    elements.cardStack.innerHTML = `
      <div class="deck-finished">
        <div class="finished-orbit" aria-hidden="true"><span></span></div>
        <p class="eyebrow"><span></span> Ronde compleet</p>
        <h3>Je hebt gekeken.</h3>
        <p>Je voorlopige stijl staat klaar. Ga naar <strong>Mijn stijl</strong> en zie wat je keuzes vertellen.</p>
        <button class="primary-button" type="button" data-view="profile">Bekijk mijn stijl <span>→</span></button>
      </div>
    `;
  } else {
    elements.cardStack.innerHTML = `${next ? paintingCardMarkup(next, true) : ""}${paintingCardMarkup(current)}`;
    elements.cardStack.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => image.closest(".painting-art").classList.add("image-failed"), { once: true });
    });
  }

  const completed = paintings.length - getRemainingPaintings().length;
  elements.progressLabel.textContent = current
    ? `${String(completed + 1).padStart(2, "0")} / ${String(paintings.length).padStart(2, "0")}`
    : "KLAAR";
  elements.progressCopy.textContent = current
    ? completed === 0 ? "Je eerste indruk telt." : `${completed} ${completed === 1 ? "keuze" : "keuzes"} gemaakt.`
    : "Je profiel is klaar om te bekijken.";

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.disabled = isAnimating || !current || (button.dataset.action === "undo" && actionHistory.length === 0);
  });

  bindCardGesture();
  bindViewButtons(elements.cardStack);
}

function bindCardGesture() {
  const card = elements.cardStack.querySelector(".painting-card.current");
  if (!card || card.dataset.gestureBound) return;

  card.dataset.gestureBound = "true";
  let startX = 0;
  let startY = 0;
  let pointerId = null;

  card.addEventListener("pointerdown", (event) => {
    if (isAnimating) return;
    startX = event.clientX;
    startY = event.clientY;
    pointerId = event.pointerId;
    card.setPointerCapture(pointerId);
    card.classList.add("is-dragging");
  });

  card.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) return;
    card.style.setProperty("--drag-x", `${deltaX}px`);
    card.style.setProperty("--card-angle", `${Math.max(-12, Math.min(12, deltaX / 18))}deg`);
  });

  const releaseCard = (event) => {
    if (pointerId !== event.pointerId) return;
    const deltaX = event.clientX - startX;
    pointerId = null;
    card.classList.remove("is-dragging");
    if (Math.abs(deltaX) > 85) {
      choose(deltaX > 0 ? "like" : "pass");
      return;
    }
    card.style.setProperty("--drag-x", "0px");
    card.style.setProperty("--card-angle", "0deg");
  };

  card.addEventListener("pointerup", releaseCard);
  card.addEventListener("pointercancel", releaseCard);
}

function renderSaved() {
  const liked = getLikedPaintings();

  if (!liked.length) {
    elements.savedGrid.innerHTML = `
      <div class="saved-empty">
        <div class="saved-empty-inner">
          <div class="empty-orbit" aria-hidden="true"><span></span></div>
          <h3>Je muur is nog leeg.</h3>
          <p>Bewaar werken die iets bij je losmaken. Ze verschijnen hier, zonder ruis.</p>
          <button class="primary-button" type="button" data-view="discover">Naar de galerie <span>→</span></button>
        </div>
      </div>
    `;
  } else {
    elements.savedGrid.innerHTML = liked.map((painting) => `
      <article class="saved-card">
        <div class="saved-card-art" style="--art-fallback: ${painting.fallback}">
          <img src="${escapeHtml(painting.image)}" alt="${escapeHtml(painting.alt)}" loading="lazy" />
          <button class="remove-save" type="button" data-remove="${escapeHtml(painting.id)}" aria-label="Verwijder ${escapeHtml(painting.title)} uit je collectie">×</button>
        </div>
        <div class="saved-card-info">
          <p>${escapeHtml(painting.artist)}</p>
          <h3>${escapeHtml(painting.title)}</h3>
          <div class="saved-meta"><span>${escapeHtml(painting.year)}</span><span>${escapeHtml(painting.tags[0])}</span></div>
        </div>
      </article>
    `).join("");

    elements.savedGrid.querySelectorAll(".saved-card-art img").forEach((image) => {
      image.addEventListener("error", () => image.closest(".saved-card-art").classList.add("image-failed"), { once: true });
    });
  }

  elements.savedGrid.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeSaved(button.dataset.remove));
  });
  bindViewButtons(elements.savedGrid);
}

function renderProfile() {
  const liked = getLikedPaintings();
  const madeChoices = paintings.filter((painting) => state.decisions[painting.id]).length;

  if (!liked.length) {
    const emptyCopy = madeChoices
      ? "Je hebt deze ronde bewust doorgelopen zonder favoriet. Dat is ook een smaak. Probeer nog een ronde en kijk wat blijft hangen."
      : "Kies een paar werken en we vertalen je eerste indruk naar een kleine, persoonlijke stijlkaart.";
    elements.profileContent.innerHTML = `
      <div class="profile-empty">
        <div class="profile-empty-inner">
          <div class="empty-orbit" aria-hidden="true"><span></span></div>
          <h3>Nog geen etiket.</h3>
          <p>${emptyCopy}</p>
          <button class="primary-button" type="button" data-view="discover">Eerst even kijken <span>→</span></button>
        </div>
      </div>
    `;
  } else {
    const profile = getProfile(liked);
    const tagCounts = getTagCounts(liked);
    const tags = Object.entries(tagCounts)
      .sort(([, first], [, second]) => second - first)
      .slice(0, 3)
      .map(([tag]) => tag);
    const profileTitle = liked.length === paintings.length ? profile.name : `Voorlopig: ${profile.name}`;

    elements.profileContent.innerHTML = `
      <div class="profile-panel">
        <div class="profile-art">
          <div class="profile-art-label"><span>${escapeHtml(profile.label)}</span><strong>${escapeHtml(profile.artLabel)}</strong></div>
        </div>
        <div class="profile-summary">
          <p class="eyebrow"><span></span> Op basis van ${liked.length} ${liked.length === 1 ? "keuze" : "keuzes"}</p>
          <h3>${escapeHtml(profileTitle)}</h3>
          <p>${escapeHtml(profile.description)}</p>
          <div class="profile-tags">${[...new Set([...tags, ...profile.tags])].slice(0, 5).map((tag) => `<span class="profile-tag">${escapeHtml(tag)}</span>`).join("")}</div>
          <div class="profile-footnote"><strong>${liked.length}/${paintings.length}</strong><span>werken die je zonder uitleg zou ophangen.</span></div>
        </div>
      </div>
    `;
  }

  bindViewButtons(elements.profileContent);
}

function getTagCounts(liked) {
  return liked.reduce((counts, painting) => {
    painting.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, {});
}

function getProfile(liked) {
  const scores = liked.reduce((totals, painting) => {
    totals[painting.profile] = (totals[painting.profile] || 0) + 1;
    return totals;
  }, {});
  return profileTypes[Object.entries(scores).sort(([, first], [, second]) => second - first)[0][0]];
}

function choose(decision) {
  const current = getCurrentPainting();
  if (!current || isAnimating) return;

  const currentCard = elements.cardStack.querySelector(".painting-card.current");
  if (!currentCard) return;

  isAnimating = true;
  currentCard.classList.add(decision === "like" ? "is-swiping-right" : "is-swiping-left");
  state.decisions[current.id] = decision;
  actionHistory.push(current.id);
  persistState();
  showToast(decision === "like" ? `${current.title} staat in je collectie.` : "Overgeslagen — volgende.");

  window.setTimeout(() => {
    isAnimating = false;
    render();
    if (!getCurrentPainting()) {
      showView("profile");
      showToast("Je ronde is compleet. Je stijl staat klaar.");
    }
  }, 370);
}

function undoLast() {
  if (isAnimating) return;
  const lastId = actionHistory.pop();
  if (!lastId) {
    showToast("Er is nog geen keuze om terug te draaien.");
    return;
  }
  const painting = paintings.find((item) => item.id === lastId);
  delete state.decisions[lastId];
  persistState();
  render();
  showToast(`${painting.title} staat weer voor je klaar.`);
}

function removeSaved(id) {
  const painting = paintings.find((item) => item.id === id);
  if (!painting) return;
  delete state.decisions[id];
  actionHistory = actionHistory.filter((historyId) => historyId !== id);
  persistState();
  render();
  showToast(`${painting.title} is uit je collectie gehaald.`);
}

function showView(view) {
  const views = {
    discover: elements.discoverView,
    profile: elements.profileView,
    saved: elements.savedView
  };
  Object.entries(views).forEach(([name, element]) => element.classList.toggle("is-hidden", name !== view));
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindViewButtons(scope = document) {
  scope.querySelectorAll("[data-view]").forEach((button) => {
    if (button.dataset.viewBound) return;
    button.dataset.viewBound = "true";
    button.addEventListener("click", () => showView(button.dataset.view));
  });
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.action === "undo") undoLast();
    if (button.dataset.action === "like") choose("like");
    if (button.dataset.action === "pass") choose("pass");
  });
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.addEventListener("keydown", (event) => {
  const tagName = document.activeElement?.tagName;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(tagName)) return;
  if (event.key === "ArrowLeft") choose("pass");
  if (event.key === "ArrowRight") choose("like");
  if (event.key === "Backspace") {
    event.preventDefault();
    undoLast();
  }
});

render();
