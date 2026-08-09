const STORAGE_KEY = "sift-demo-state-v1";

const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/><path d="M8 21h8"/>',
  explore: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/><path d="M11 7v8M7 11h8"/>',
  saved: '<path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-3-6 3Z"/>',
  profile: '<circle cx="12" cy="8" r="3"/><path d="M5 21a7 7 0 0 1 14 0"/>',
  alerts: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
  sources: '<path d="M4 5h16M4 12h16M4 19h10"/><circle cx="20" cy="19" r="2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  spark: '<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5Z"/><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6Z"/>',
  bookmark: '<path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-3-6 3Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
};

const stories = [
  {
    id: "ecb-cut",
    lane: "forYou",
    accent: "green",
    tag: "Markets + policy",
    type: "Decision",
    title: "ECB cuts rates by 25 basis points",
    summary: "Illustrative event: the policy move changes the signal for European borrowing costs and the market path you track.",
    why: "You follow ECB decisions and European monetary policy.",
    time: "2h ago",
    read: "4 min",
    match: "Very strong match",
    sourceCount: 4,
    entities: ["ECB"],
    topics: ["Monetary policy", "Financial markets"],
    sources: [
      { name: "European Central Bank", short: "ECB", kind: "Primary", detail: "Policy statement", tone: "green", url: "https://www.ecb.europa.eu/press/pr/date/html/index.en.html" },
      { name: "Reuters", short: "R", kind: "Reporting", detail: "Market reaction", tone: "blue", url: "https://www.reuters.com/markets/europe/" },
      { name: "Financial Times", short: "FT", kind: "Analysis", detail: "What it changes", tone: "purple", url: "https://www.ft.com/markets" },
      { name: "NOS Economie", short: "NOS", kind: "Reporting", detail: "Dutch context", tone: "yellow", url: "https://nos.nl/economie" },
    ],
  },
  {
    id: "openai-model",
    lane: "forYou",
    accent: "blue",
    tag: "AI models",
    type: "Release",
    title: "OpenAI releases a new reasoning model",
    summary: "Illustrative event: the release matters because it changes the practical baseline for coding, tool use, and model selection.",
    why: "You follow AI model releases and OpenAI, with a high signal preference.",
    time: "5h ago",
    read: "6 min",
    match: "Very strong match",
    sourceCount: 5,
    entities: ["OpenAI"],
    topics: ["AI", "Model releases", "Programming"],
    sources: [
      { name: "OpenAI", short: "OAI", kind: "Primary", detail: "Release notes", tone: "green", url: "https://openai.com/news/" },
      { name: "Hacker News", short: "HN", kind: "Community", detail: "Developer discussion", tone: "yellow", url: "https://news.ycombinator.com/" },
      { name: "The Verge", short: "V", kind: "Reporting", detail: "Product context", tone: "blue", url: "https://www.theverge.com/tech" },
      { name: "GitHub", short: "GH", kind: "Community", detail: "Early tools", tone: "purple", url: "https://github.com/trending" },
      { name: "Ars Technica", short: "AT", kind: "Analysis", detail: "Technical read", tone: "blue", url: "https://arstechnica.com/ai/" },
    ],
  },
  {
    id: "nvidia-inference",
    lane: "forYou",
    accent: "green",
    tag: "AI infrastructure",
    type: "Announcement",
    title: "Nvidia targets cheaper AI inference with new hardware",
    summary: "Illustrative event: an infrastructure change could affect model serving costs, cloud strategy, and the companies you watch.",
    why: "You follow Nvidia and meaningful AI infrastructure changes, not daily stock noise.",
    time: "Yesterday",
    read: "5 min",
    match: "Strong match",
    sourceCount: 4,
    entities: ["Nvidia"],
    topics: ["AI infrastructure", "Semiconductors", "Financial markets"],
    sources: [
      { name: "Nvidia", short: "NV", kind: "Primary", detail: "Company announcement", tone: "green", url: "https://nvidianews.nvidia.com/" },
      { name: "Financial Times", short: "FT", kind: "Reporting", detail: "Industry impact", tone: "purple", url: "https://www.ft.com/technology" },
      { name: "The Register", short: "TR", kind: "Analysis", detail: "Hardware details", tone: "blue", url: "https://www.theregister.com/Hardware/" },
      { name: "Hacker News", short: "HN", kind: "Community", detail: "Builder reaction", tone: "yellow", url: "https://news.ycombinator.com/" },
    ],
  },
  {
    id: "eu-ai-guidance",
    lane: "important",
    accent: "yellow",
    tag: "Outside your profile",
    type: "Policy",
    title: "EU guidance changes how general-purpose AI rules are applied",
    summary: "Illustrative event: a material policy update can affect tools, companies, and public services even when it is outside your normal watchlist.",
    why: "This is an important-news override: broad consequence, official source, and a clear change from the previous position.",
    time: "Today",
    read: "7 min",
    match: "Outside your profile",
    sourceCount: 3,
    entities: ["European Commission"],
    topics: ["AI policy", "European Union"],
    sources: [
      { name: "European Commission", short: "EU", kind: "Primary", detail: "Official guidance", tone: "blue", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" },
      { name: "NOS", short: "NOS", kind: "Reporting", detail: "Dutch impact", tone: "yellow", url: "https://nos.nl/tech" },
      { name: "Tech Policy Press", short: "TP", kind: "Analysis", detail: "Policy context", tone: "purple", url: "https://techpolicy.press/" },
    ],
  },
  {
    id: "rate-cut-deep-dive",
    lane: "deep",
    accent: "purple",
    tag: "Deep dive",
    type: "Analysis",
    title: "What a rate cut changes for founders, savers, and markets",
    summary: "A slower, more detailed read that connects the event to the financial decisions and macro signals you follow.",
    why: "You have a high interest in monetary policy and this is analysis, not another headline duplicate.",
    time: "Yesterday",
    read: "12 min",
    match: "Deep dive",
    sourceCount: 3,
    entities: ["ECB"],
    topics: ["Monetary policy", "Financial markets"],
    sources: [
      { name: "The Economist", short: "E", kind: "Analysis", detail: "Macro context", tone: "purple", url: "https://www.economist.com/finance-and-economics" },
      { name: "ECB Research", short: "ECB", kind: "Primary", detail: "Research context", tone: "green", url: "https://www.ecb.europa.eu/pub/research/html/index.en.html" },
      { name: "FT Alphaville", short: "FT", kind: "Analysis", detail: "Market view", tone: "blue", url: "https://www.ft.com/alphaville" },
    ],
  },
  {
    id: "openai-follow-up",
    lane: "updates",
    accent: "blue",
    tag: "Update",
    type: "Follow-up",
    title: "Early developer tests reveal where the new model is actually useful",
    summary: "A follow-up to the model release, separating practical coding gains from benchmark theatre and launch-day noise.",
    why: "You opened and saved the original model-release event, so Sift is showing a meaningful update instead of a duplicate.",
    time: "Today",
    read: "8 min",
    match: "Because you saved it",
    sourceCount: 4,
    entities: ["OpenAI"],
    topics: ["AI", "Programming", "Model releases"],
    sources: [
      { name: "GitHub", short: "GH", kind: "Community", detail: "Public test repos", tone: "green", url: "https://github.com/trending" },
      { name: "Hacker News", short: "HN", kind: "Community", detail: "Builder discussion", tone: "yellow", url: "https://news.ycombinator.com/" },
      { name: "OpenAI", short: "OAI", kind: "Primary", detail: "Model documentation", tone: "blue", url: "https://platform.openai.com/docs/overview" },
      { name: "The Verge", short: "V", kind: "Reporting", detail: "Independent test", tone: "purple", url: "https://www.theverge.com/tech" },
    ],
  },
];

const topicCatalog = [
  { id: "ai-models", name: "AI model releases", description: "New models, capabilities, evaluations, and tool use.", accent: "green", count: "12 sources" },
  { id: "markets", name: "Financial markets", description: "Major moves and changes, not intraday noise.", accent: "blue", count: "18 sources" },
  { id: "monetary-policy", name: "ECB / monetary policy", description: "Decisions, speeches, inflation, and rate paths.", accent: "yellow", count: "9 sources" },
  { id: "ai-infra", name: "AI infrastructure", description: "Chips, inference, cloud economics, and deployment.", accent: "purple", count: "14 sources" },
  { id: "dutch-policy", name: "Dutch policy decisions", description: "What changes in practice, without political drama.", accent: "green", count: "11 sources" },
  { id: "programming", name: "Programming", description: "Tools, releases, and techniques that change the craft.", accent: "blue", count: "21 sources" },
];

const sourceCatalog = [
  { id: "ecb", name: "European Central Bank", domain: "ecb.europa.eu", type: "Primary", tier: "Direct", description: "Rate decisions, speeches, and official data.", tone: "green", enabled: true },
  { id: "company", name: "Company release feeds", domain: "openai.com · nvidianews.nvidia.com", type: "Primary", tier: "Direct", description: "First-party releases for entities you follow.", tone: "blue", enabled: true },
  { id: "reporting", name: "Licensed reporting", domain: "Reuters · FT · NOS", type: "Reporting", tier: "High", description: "Context and independent reporting where permitted.", tone: "purple", enabled: true },
  { id: "developer", name: "Developer communities", domain: "news.ycombinator.com · github.com", type: "Community", tier: "Context", description: "Early signals and practical builder discussion.", tone: "yellow", enabled: true },
  { id: "social", name: "Social discussion", domain: "reddit.com · youtube.com", type: "Community", tier: "Later", description: "Off by default in this prototype.", tone: "coral", enabled: false },
];

const defaultState = {
  route: "home",
  saved: ["nvidia-inference"],
  feedback: {},
  search: "",
  drawerStory: null,
  onboardingOpen: false,
  onboardingSelections: ["AI model releases", "ECB / monetary policy", "Nvidia", "Dutch policy decisions"],
  notifications: {
    explicit: true,
    important: true,
    daily: false,
  },
  rules: [
    { id: "ai", label: "AI + model releases", detail: "OpenAI, Anthropic, DeepMind, new tools", strength: 5, polarity: "follow", tone: "green" },
    { id: "markets", label: "Financial markets", detail: "Major movements, not daily noise", strength: 4, polarity: "follow", tone: "blue" },
    { id: "ecb", label: "ECB / monetary policy", detail: "Rate decisions and meaningful changes", strength: 5, polarity: "follow", tone: "yellow" },
    { id: "nvidia", label: "Nvidia", detail: "Meaningful company and infrastructure news", strength: 3, polarity: "follow", tone: "green" },
    { id: "nl-politics", label: "Dutch policy decisions", detail: "Decisions, not political drama", strength: 2, polarity: "follow", tone: "purple" },
    { id: "football", label: "Football", detail: "Blocked by you", strength: 5, polarity: "block", tone: "coral" },
    { id: "celebrity", label: "Celebrity news", detail: "Blocked by you", strength: 5, polarity: "block", tone: "coral" },
  ],
  sources: sourceCatalog.map((source) => ({ id: source.id, enabled: source.enabled })),
};

const navItems = [
  { id: "home", label: "Home", icon: "home" },
  { id: "explore", label: "Explore", icon: "explore" },
  { id: "saved", label: "Saved", icon: "saved" },
  { id: "profile", label: "Profile", icon: "profile" },
  { id: "alerts", label: "Alerts", icon: "alerts" },
  { id: "sources", label: "Sources", icon: "sources" },
];

let state = loadState();
let toastTimer;

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return stored ? { ...structuredClone(defaultState), ...stored, notifications: { ...defaultState.notifications, ...stored.notifications } } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    route: state.route,
    saved: state.saved,
    feedback: state.feedback,
    notifications: state.notifications,
    rules: state.rules,
    sources: state.sources,
  }));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function icon(name, className = "") {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || ""}</svg>`;
}

function initials(value) {
  return value.split(/\s+/).map((part) => part[0]).join("").slice(0, 3).toUpperCase();
}

function findStory(id) {
  return stories.find((story) => story.id === id);
}

function isSaved(id) {
  return state.saved.includes(id);
}

function sourceEnabled(id) {
  return state.sources.find((source) => source.id === id)?.enabled !== false;
}

function strengthLabel(rule) {
  if (rule.polarity === "block") return "Blocked";
  return ["Low", "Low", "Medium", "Medium-high", "High", "Very high"][rule.strength] || "Medium";
}

function routeTitle(route) {
  return navItems.find((item) => item.id === route)?.label || "Home";
}

function renderRail() {
  return `<aside class="rail" aria-label="Main navigation">
    <button class="brand" data-route="home" aria-label="Go to Sift home">s</button>
    <nav class="rail-nav">
      ${navItems.map((item) => `<button class="nav-item" data-route="${item.id}" aria-current="${state.route === item.id ? "page" : "false"}" data-testid="nav-${item.id}">
        ${icon(item.icon, "nav-icon")}
        <span>${item.label}</span>
      </button>`).join("")}
    </nav>
    <div class="rail-footer" title="Demo profile">D</div>
  </aside>`;
}

function renderDemoBanner() {
  return `<div class="demo-banner"><span class="demo-dot"></span><span>Demo feed: stories are illustrative. The product shape is real; live ingestion is intentionally not connected yet.</span></div>`;
}

function renderHome() {
  const forYou = stories.filter((story) => story.lane === "forYou");
  const important = stories.filter((story) => story.lane === "important");
  const deep = stories.filter((story) => story.lane === "deep");
  const updates = stories.filter((story) => story.lane === "updates");

  return `<div class="page-grid">
    <section class="content-column">
      <header class="topbar">
        <div>
          <p class="eyebrow">Saturday · your signal</p>
          <h1>Good morning, Daniel.</h1>
          <p class="topbar-copy">Three things changed that are worth your attention. Nothing else needs to compete for your time right now.</p>
        </div>
        <div class="topbar-actions">
          <button class="button button--secondary" data-action="show-onboarding">Adjust signal</button>
          <button class="button button--icon" data-action="show-search" aria-label="Search stories">${icon("explore", "nav-icon")}</button>
        </div>
      </header>
      ${renderDemoBanner()}
      <section aria-labelledby="for-you-heading">
        <div class="section-heading">
          <div><p>For you</p><h2 id="for-you-heading">The useful part of today.</h2></div>
          <span class="section-count">${forYou.length} strong matches</span>
        </div>
        <div class="story-list">${forYou.map(renderStoryCard).join("")}</div>
      </section>
      <section aria-labelledby="important-heading">
        <div class="section-heading">
          <div><p>Important</p><h2 id="important-heading">Outside your usual orbit.</h2></div>
          <span class="section-count">limited override</span>
        </div>
        <div class="story-list">${important.map(renderStoryCard).join("")}</div>
      </section>
      <section aria-labelledby="deep-heading">
        <div class="section-heading">
          <div><p>Deep dives</p><h2 id="deep-heading">One layer deeper.</h2></div>
          <span class="section-count">less often, more context</span>
        </div>
        <div class="story-list">${deep.map(renderStoryCard).join("")}</div>
      </section>
      <section aria-labelledby="updates-heading">
        <div class="section-heading">
          <div><p>Updates</p><h2 id="updates-heading">Worth following up.</h2></div>
          <span class="section-count">because you cared before</span>
        </div>
        <div class="story-list">${updates.map(renderStoryCard).join("")}</div>
      </section>
      <div class="signal-end">That is the useful part. Come back when something meaningful changes.</div>
    </section>
    <aside class="side-column">${renderSignalSidebar()}</aside>
  </div>`;
}

function renderSignalSidebar() {
  const followed = state.rules.filter((rule) => rule.polarity === "follow").slice(0, 4);
  const blocked = state.rules.filter((rule) => rule.polarity === "block").slice(0, 2);
  return `<div class="side-stack">
    <section class="side-card">
      <div class="side-card__head"><h3>Your signal</h3><button class="mini-link" data-route="profile">Edit</button></div>
      <div class="profile-score"><div class="score-ring"></div><div><strong>Profile is clear</strong><span>5 focused interests<br />2 quiet topics</span></div></div>
      <ul class="watch-list">
        ${followed.map((rule, index) => `<li class="watch-item"><span class="watch-marker ${index % 2 ? "watch-marker--blue" : ""}"></span>${escapeHTML(rule.label)}</li>`).join("")}
        ${blocked.map((rule) => `<li class="watch-item"><span class="watch-marker watch-marker--blocked"></span>${escapeHTML(rule.label)} muted</li>`).join("")}
      </ul>
    </section>
    <section class="side-card">
      <div class="side-card__head"><h3>Why this works</h3><span class="section-count">rule #1</span></div>
      <p class="side-note">Sift scores information value, not screen time. A quiet day is allowed to stay quiet.</p>
      <button class="button button--quiet" data-route="sources">Review sources ${icon("arrow", "nav-icon")}</button>
    </section>
    <section class="side-card">
      <div class="side-card__head"><h3>One small control</h3><span class="section-count">private</span></div>
      <p class="side-note">Your interest profile is yours to inspect, correct, export, or delete. Nothing is inferred silently.</p>
      <button class="button button--secondary" data-route="alerts">Tune alerts</button>
    </section>
  </div>`;
}

function renderStoryCard(story) {
  const saved = isSaved(story.id);
  const feedback = state.feedback[story.id];
  const toneClass = story.accent === "yellow" ? "story--yellow" : story.accent === "purple" ? "story--purple" : story.accent === "blue" ? "story--blue" : "";
  const matchClass = story.lane === "important" ? "match-pill--outside" : story.lane === "deep" ? "match-pill--deep" : "";
  return `<article class="story ${toneClass}" data-story="${story.id}" data-testid="story-card">
    <div class="story__topline">
      <div class="story__meta"><span class="story__tag">${escapeHTML(story.tag)}</span><span>·</span><span>${escapeHTML(story.time)}</span><span>·</span><span>${escapeHTML(story.read)}</span><span class="story__type">${escapeHTML(story.type)}</span></div>
      <span class="match-pill ${matchClass}">${escapeHTML(story.match)}</span>
    </div>
    <h3 class="story__title">${escapeHTML(story.title)}</h3>
    <p class="story__summary">${escapeHTML(story.summary)}</p>
    <div class="story__why">${icon("spark", "why-icon")}<span>${escapeHTML(story.why)}</span></div>
    <div class="story__bottomline">
      <div class="story__sources"><span class="source-stack">${story.sources.slice(0, 3).map((source) => `<span class="source-avatar">${escapeHTML(source.short)}</span>`).join("")}</span><span>${story.sourceCount} sources grouped</span></div>
      <div class="story__actions">
        <button class="text-button ${saved ? "is-active" : ""}" data-action="toggle-save" data-story="${story.id}">${icon("bookmark", "nav-icon")} ${saved ? "Saved" : "Save"}</button>
        <button class="text-button ${feedback === "more" ? "is-active" : ""}" data-action="feedback" data-feedback="more" data-story="${story.id}">More like this</button>
        <button class="story-link" data-action="open-story" data-story="${story.id}">Open story ${icon("arrow", "nav-icon")}</button>
      </div>
    </div>
  </article>`;
}

function renderPageShell(content, options = {}) {
  return `<div class="page-grid"><section class="content-column">${options.banner === false ? "" : renderDemoBanner()}${content}</section>${options.sidebar ? `<aside class="side-column">${renderSignalSidebar()}</aside>` : ""}</div>`;
}

function renderExplore() {
  const query = state.search.trim().toLowerCase();
  const matchingStories = query ? stories.filter((story) => [story.title, story.summary, story.tag, ...story.entities, ...story.topics, ...story.sources.map((source) => source.name)].join(" ").toLowerCase().includes(query)) : [];
  const topicResults = query ? topicCatalog.filter((topic) => [topic.name, topic.description].join(" ").toLowerCase().includes(query)) : topicCatalog;
  return renderPageShell(`<header class="page-heading"><div class="page-heading__row"><div><p class="eyebrow">Explore with intent</p><h1>Follow the questions behind the headlines.</h1><p>Search an event, entity, topic, or source. Follow what matters; mute what does not.</p></div></div></header>
    <div class="search-box">${icon("explore")}<input data-search type="search" value="${escapeHTML(state.search)}" placeholder="Try: OpenAI, ECB, Nvidia, rates..." aria-label="Search events, topics, and sources" /></div>
    <div class="filter-row"><button class="filter-chip is-active">All signals</button><button class="filter-chip">Events</button><button class="filter-chip">Entities</button><button class="filter-chip">Sources</button></div>
    ${query ? `<div class="section-heading"><div><p>Search results</p><h2>${matchingStories.length + topicResults.length} useful matches</h2></div><span class="section-count">for “${escapeHTML(state.search)}”</span></div>
      ${matchingStories.length ? `<div class="story-list">${matchingStories.map(renderStoryCard).join("")}</div>` : ""}
      ${topicResults.length ? `<div class="topic-grid search-topic-grid">${topicResults.map(renderTopicCard).join("")}</div>` : ""}
      ${!matchingStories.length && !topicResults.length ? `<div class="empty-state"><h3>No strong match yet.</h3><p>Try an exact entity or add a new interest to your profile.</p><button class="button button--secondary" data-action="show-onboarding">Teach Sift something</button></div>` : ""}` : `<div class="section-heading"><div><p>Start with a signal</p><h2>Topics people actually follow.</h2></div><span class="section-count">curated examples</span></div><div class="topic-grid">${topicCatalog.map(renderTopicCard).join("")}</div><div class="section-heading"><div><p>Recommended source paths</p><h2>Start close to the original.</h2></div><span class="section-count">source-first</span></div><div class="source-grid">${sourceCatalog.slice(0, 4).map(renderExploreSourceCard).join("")}</div>`}`, { banner: true });
}

function renderTopicCard(topic) {
  const followed = state.rules.some((rule) => rule.label.toLowerCase().includes(topic.name.toLowerCase().split(" ")[0]));
  return `<article class="topic-card topic-card--${topic.accent}"><div class="topic-card__head"><h3>${escapeHTML(topic.name)}</h3><span class="topic-card__count">${escapeHTML(topic.count)}</span></div><p>${escapeHTML(topic.description)}</p><button class="button ${followed ? "button--secondary" : "button--quiet"}" data-action="follow-topic" data-topic="${escapeHTML(topic.name)}">${followed ? "Following" : "Follow topic"} ${icon(followed ? "check" : "arrow", "nav-icon")}</button></article>`;
}

function renderExploreSourceCard(source) {
  const enabled = sourceEnabled(source.id);
  return `<article class="source-card"><div class="topic-card__head"><h3>${escapeHTML(source.name)}</h3><span class="topic-card__count">${escapeHTML(source.type)}</span></div><p>${escapeHTML(source.description)}</p><button class="button ${enabled ? "button--secondary" : "button--quiet"}" data-action="toggle-source" data-source="${source.id}">${enabled ? "Enabled" : "Enable source"}</button></article>`;
}

function renderSaved() {
  const savedStories = stories.filter((story) => isSaved(story.id));
  return renderPageShell(`<header class="page-heading"><p class="eyebrow">Your reading shelf</p><h1>Saved for a calmer moment.</h1><p>Keep the few things worth returning to. No unread-count anxiety, no backlog guilt.</p></header><div class="section-heading"><div><p>Saved events</p><h2>${savedStories.length ? "Still worth your time." : "Nothing saved yet."}</h2></div><span class="section-count">${savedStories.length} saved</span></div>${savedStories.length ? `<div class="story-list">${savedStories.map(renderStoryCard).join("")}</div>` : `<div class="empty-state"><h3>Save a strong signal.</h3><p>When an event feels worth keeping, save it here and Sift will show meaningful updates beside it.</p><button class="button button--primary" data-route="home">Back to your signal</button></div>`}`, { sidebar: true });
}

function renderProfile() {
  return renderPageShell(`<header class="page-heading"><p class="eyebrow">Control, not mystery</p><h1>Your interest profile.</h1><p>See what Sift thinks you care about. Change it directly; behavior never gets the final word.</p></header><section class="page-panel"><div class="page-panel__header"><div><h3>Signal rules</h3><p>Explicit preferences are stronger than inferred behavior.</p></div><button class="button button--secondary" data-action="show-onboarding">Add from language</button></div><div class="profile-list">${state.rules.map(renderProfileRule).join("")}</div></section><section class="page-panel"><div class="page-panel__header"><div><h3>How your profile learned</h3><p>Every change has a reason you can inspect.</p></div><span class="match-pill">68% tuned</span></div><p class="side-note">Your current profile is mostly explicit: AI, markets, ECB, Nvidia, and Dutch policy. Reading behavior is only used as a small confidence adjustment.</p></section>`, { sidebar: true });
}

function renderProfileRule(rule) {
  const blocked = rule.polarity === "block";
  return `<div class="profile-row"><div class="profile-row__head"><div><strong>${escapeHTML(rule.label)}</strong><small>${escapeHTML(rule.detail)}</small></div><span class="strength-label ${blocked ? "strength-label--blocked" : ""}">${strengthLabel(rule)}</span></div><div class="strength-track">${[1, 2, 3, 4, 5].map((segment) => `<span class="strength-segment ${blocked ? "is-blocked" : segment <= rule.strength ? "is-on" : ""}"></span>`).join("")}</div>${blocked ? "" : `<div class="stepper"><button data-action="change-strength" data-rule="${rule.id}" data-delta="-1" aria-label="Lower ${escapeHTML(rule.label)}">-</button><span>adjust</span><button data-action="change-strength" data-rule="${rule.id}" data-delta="1" aria-label="Raise ${escapeHTML(rule.label)}">+</button></div>`}</div>`;
}

function renderAlerts() {
  const rules = [
    { id: "explicit", title: "Explicit follows", detail: "Notify when a followed entity or trigger changes.", key: "explicit" },
    { id: "important", title: "Important outside your profile", detail: "Allow up to three broad-consequence overrides per day.", key: "important" },
    { id: "daily", title: "Daily briefing", detail: "A finite digest at 08:00 with a maximum of five events.", key: "daily" },
  ];
  return renderPageShell(`<header class="page-heading"><p class="eyebrow">Quiet by default</p><h1>Alerts with a reason.</h1><p>Notifications should mark a meaningful change, not manufacture a reason to reopen the app.</p></header><section class="page-panel"><div class="page-panel__header"><div><h3>Notification rules</h3><p>Every toggle has a visible scope.</p></div><span class="match-pill">${Object.values(state.notifications).filter(Boolean).length} active</span></div><div class="setting-list">${rules.map((rule) => `<div class="setting-row"><div class="setting-row__copy"><strong>${rule.title}</strong><span>${rule.detail}</span></div><button class="switch ${state.notifications[rule.key] ? "is-on" : ""}" data-action="toggle-notification" data-notification="${rule.key}" aria-label="Toggle ${rule.title}" aria-pressed="${state.notifications[rule.key]}"></button></div>`).join("")}</div></section><section class="page-panel"><div class="page-panel__header"><div><h3>Never notify for</h3><p>Blocked topics stay quiet unless you deliberately allow an override.</p></div></div><div class="filter-row">${state.rules.filter((rule) => rule.polarity === "block").map((rule) => `<span class="filter-chip">${escapeHTML(rule.label)} ${icon("close", "nav-icon")}</span>`).join("")}</div></section>`, { sidebar: true });
}

function renderSources() {
  return renderPageShell(`<header class="page-heading"><p class="eyebrow">Source control</p><h1>Choose where your signal comes from.</h1><p>Primary sources establish what happened. Reporting and community sources add context, not false certainty.</p></header><section class="page-panel"><div class="page-panel__header"><div><h3>Source registry</h3><p>Each source has a role, a quality tier, and an explicit on/off state.</p></div><span class="match-pill">${state.sources.filter((source) => source.enabled).length} enabled</span></div><div class="source-list">${sourceCatalog.map((source) => renderSourceRow(source)).join("")}</div></section><section class="page-panel"><div class="page-panel__header"><div><h3>Source rule</h3><p>Prefer direct evidence when the event is factual.</p></div><span class="section-count">trust, not volume</span></div><p class="side-note">Sift never turns a pile of repeated headlines into proof. It keeps the source trail visible and labels facts, analysis, opinion, and community discussion separately.</p></section>`, { sidebar: true });
}

function renderSourceRow(source) {
  const enabled = sourceEnabled(source.id);
  return `<div class="source-row"><div class="source-row__identity"><span class="source-badge source-badge--${source.tone}">${initials(source.name)}</span><div><strong>${escapeHTML(source.name)}</strong><small>${escapeHTML(source.domain)}<br />${escapeHTML(source.description)}</small></div></div><div class="source-row__meta"><span class="meta-pill">${escapeHTML(source.type)}</span><span class="meta-pill">${escapeHTML(source.tier)}</span><button class="switch ${enabled ? "is-on" : ""}" data-action="toggle-source" data-source="${source.id}" aria-label="Toggle ${escapeHTML(source.name)}" aria-pressed="${enabled}"></button></div></div>`;
}

function renderStoryDrawer(story) {
  return `<div class="drawer-backdrop" data-action="close-drawer"><aside class="story-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" data-drawer-panel><div class="drawer-topline"><span class="drawer-kicker">${escapeHTML(story.tag)}</span><button class="button button--icon" data-action="close-drawer" aria-label="Close story">${icon("close", "nav-icon")}</button></div><h2 class="drawer-title" id="drawer-title">${escapeHTML(story.title)}</h2><p class="drawer-summary">${escapeHTML(story.summary)}</p><div class="drawer-explanation">${icon("spark", "why-icon")} Why you are seeing this: ${escapeHTML(story.why)}</div><div class="drawer-actions"><button class="button ${isSaved(story.id) ? "button--secondary" : "button--primary"}" data-action="toggle-save" data-story="${story.id}">${icon("bookmark", "nav-icon")} ${isSaved(story.id) ? "Saved" : "Save event"}</button><button class="button button--quiet" data-action="feedback" data-feedback="more" data-story="${story.id}">More like this</button><button class="button button--quiet" data-action="feedback" data-feedback="less" data-story="${story.id}">Less like this</button></div><div class="drawer-section-title"><span>What changed</span><span>${escapeHTML(story.time)}</span></div><p class="side-note">This event is shown once even when multiple sources cover it. New information will appear as an update on the same event, not as another copy.</p><div class="drawer-section-title"><span>Source trail</span><span>${story.sourceCount} grouped</span></div><div class="source-lines">${story.sources.map((source) => `<a class="source-line" href="${escapeHTML(source.url)}" target="_blank" rel="noreferrer"><span class="source-line__copy"><strong>${escapeHTML(source.name)}</strong><span>${escapeHTML(source.detail)}</span></span><span class="source-kind">${escapeHTML(source.kind)} ${icon("arrow", "nav-icon")}</span></a>`).join("")}</div><div class="drawer-section-title"><span>Why one event</span><span>event-first</span></div><p class="side-note">The event is the product object. Articles are evidence attached underneath it, so repeated coverage can add context without multiplying the feed.</p></aside></div>`;
}

function renderOnboarding() {
  const choices = ["AI model releases", "Financial markets", "ECB / monetary policy", "Nvidia", "Dutch policy decisions", "Programming", "Football", "Celebrity news"];
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><div class="modal__topline"><span class="step-label">1 minute setup</span><button class="button button--icon" data-action="close-onboarding" aria-label="Close onboarding">${icon("close", "nav-icon")}</button></div><h2 id="onboarding-title">Teach Sift your signal.</h2><p class="modal__intro">Say what you want to stay ahead of. Sift turns it into rules you can inspect before anything is used to rank your feed.</p><label class="modal__label" for="interest-prompt">In your own words</label><textarea class="prompt-input" id="interest-prompt" placeholder="I care about AI models, ECB decisions, and meaningful Nvidia news. I do not care about football or celebrity news.">AI model releases, ECB decisions, and meaningful Nvidia news. Skip football and celebrity news.</textarea><label class="modal__label" style="margin-top: 18px;">Quick confirmation</label><div class="choice-grid">${choices.map((choice) => { const selected = state.onboardingSelections.includes(choice); const blocked = ["Football", "Celebrity news"].includes(choice); return `<button class="choice-chip ${selected ? "is-selected" : ""} ${blocked ? "is-blocked" : ""}" data-action="toggle-onboarding-interest" data-interest="${escapeHTML(choice)}">${selected ? icon("check", "nav-icon") : ""}${escapeHTML(choice)}</button>`; }).join("")}</div><div class="modal__footer"><span class="modal__hint">You can edit every rule later. No hidden interests are created.</span><button class="button button--primary" data-action="complete-onboarding">Use this profile ${icon("arrow", "nav-icon")}</button></div></section></div>`;
}

function render() {
  const page = state.route === "home" ? renderHome() : state.route === "explore" ? renderExplore() : state.route === "saved" ? renderSaved() : state.route === "profile" ? renderProfile() : state.route === "alerts" ? renderAlerts() : renderSources();
  document.querySelector("#app").innerHTML = `<div class="app-shell">${renderRail()}<main class="page">${page}</main></div>${state.drawerStory ? renderStoryDrawer(findStory(state.drawerStory)) : ""}${state.onboardingOpen ? renderOnboarding() : ""}`;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function navigate(route) {
  state.route = route;
  state.drawerStory = null;
  state.search = route === "explore" ? state.search : "";
  persist();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleSave(storyId) {
  if (isSaved(storyId)) {
    state.saved = state.saved.filter((id) => id !== storyId);
    showToast("Removed from saved.");
  } else {
    state.saved = [...state.saved, storyId];
    showToast("Saved. Sift will show meaningful updates here.");
  }
  persist();
  render();
}

function applyFeedback(storyId, feedback) {
  state.feedback[storyId] = feedback;
  persist();
  const message = feedback === "more" ? "Got it. Sift will look for more of this signal." : feedback === "less" ? "Understood. Similar items will be quieter." : "Feedback saved.";
  showToast(message);
  render();
}

function changeStrength(ruleId, delta) {
  const rule = state.rules.find((item) => item.id === ruleId);
  if (!rule) return;
  rule.strength = Math.max(1, Math.min(5, rule.strength + delta));
  persist();
  render();
  showToast(`${rule.label} is now ${strengthLabel(rule).toLowerCase()}.`);
}

function toggleSource(sourceId) {
  const source = state.sources.find((item) => item.id === sourceId);
  if (!source) return;
  source.enabled = !source.enabled;
  persist();
  render();
  const catalogItem = sourceCatalog.find((item) => item.id === sourceId);
  showToast(`${catalogItem?.name || "Source"} ${source.enabled ? "enabled" : "muted"}.`);
}

function toggleInterest(interest) {
  if (state.onboardingSelections.includes(interest)) {
    state.onboardingSelections = state.onboardingSelections.filter((item) => item !== interest);
  } else {
    state.onboardingSelections = [...state.onboardingSelections, interest];
  }
  render();
}

function completeOnboarding() {
  const prompt = document.querySelector("#interest-prompt")?.value.trim();
  const knownLabels = state.rules.map((rule) => rule.label.toLowerCase());
  const selectedFollow = state.onboardingSelections.filter((interest) => !["Football", "Celebrity news"].includes(interest));
  selectedFollow.forEach((interest) => {
    if (!knownLabels.some((label) => label.includes(interest.toLowerCase().split(" ")[0]))) {
      state.rules.push({ id: `custom-${Date.now()}-${interest}`, label: interest, detail: "Added during onboarding", strength: 3, polarity: "follow", tone: "green" });
    }
  });
  state.onboardingOpen = false;
  persist();
  render();
  showToast(prompt ? "Profile updated from your words." : "Profile updated.");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a, article, .drawer-backdrop, [data-drawer-panel]");
  if (!target) return;

  const action = target.dataset.action;
  if (action === "show-onboarding") {
    state.onboardingOpen = true;
    render();
    return;
  }
  if (action === "close-onboarding") {
    state.onboardingOpen = false;
    render();
    return;
  }
  if (action === "close-drawer") {
    if (target.dataset.drawerPanel && event.target.closest("[data-drawer-panel]")) return;
    state.drawerStory = null;
    render();
    return;
  }
  if (action === "show-search") {
    state.route = "explore";
    state.drawerStory = null;
    render();
    requestAnimationFrame(() => document.querySelector("[data-search]")?.focus());
    return;
  }
  if (action === "open-story") {
    state.drawerStory = target.dataset.story;
    render();
    return;
  }
  if (action === "toggle-save") {
    toggleSave(target.dataset.story);
    return;
  }
  if (action === "feedback") {
    applyFeedback(target.dataset.story, target.dataset.feedback);
    return;
  }
  if (action === "change-strength") {
    changeStrength(target.dataset.rule, Number(target.dataset.delta));
    return;
  }
  if (action === "toggle-source") {
    toggleSource(target.dataset.source);
    return;
  }
  if (action === "toggle-notification") {
    const key = target.dataset.notification;
    state.notifications[key] = !state.notifications[key];
    persist();
    render();
    showToast(`${key === "daily" ? "Daily briefing" : key === "important" ? "Important overrides" : "Explicit follows"} ${state.notifications[key] ? "enabled" : "muted"}.`);
    return;
  }
  if (action === "toggle-onboarding-interest") {
    toggleInterest(target.dataset.interest);
    return;
  }
  if (action === "complete-onboarding") {
    completeOnboarding();
    return;
  }
  if (action === "follow-topic") {
    const topic = target.dataset.topic;
    if (!state.rules.some((rule) => rule.label.toLowerCase() === topic.toLowerCase())) {
      state.rules.push({ id: `topic-${Date.now()}`, label: topic, detail: "Added from Explore", strength: 3, polarity: "follow", tone: "green" });
      persist();
      render();
      showToast(`${topic} is now in your signal.`);
    } else {
      showToast(`${topic} is already in your signal.`);
    }
    return;
  }

  const route = target.dataset.route;
  if (route) {
    navigate(route);
    return;
  }

  if (target.matches("article[data-story]")) {
    state.drawerStory = target.dataset.story;
    render();
  }
});

document.addEventListener("input", (event) => {
  if (!event.target.matches("[data-search]")) return;
  state.search = event.target.value;
  render();
  const input = document.querySelector("[data-search]");
  input?.focus();
  input?.setSelectionRange(state.search.length, state.search.length);
});

render();
