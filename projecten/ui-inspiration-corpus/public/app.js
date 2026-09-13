const state = {
  allSources: [],
  selectedId: null
};

const elements = {
  search: document.querySelector('#search'),
  classification: document.querySelector('#classification'),
  category: document.querySelector('#category'),
  reset: document.querySelector('#resetFilters'),
  refresh: document.querySelector('#refresh'),
  stats: document.querySelector('#stats'),
  grid: document.querySelector('#sourceGrid'),
  summary: document.querySelector('#resultsSummary'),
  details: document.querySelector('#details'),
  detailContent: document.querySelector('#detailContent'),
  closeDetails: document.querySelector('#closeDetails')
};

const labels = {
  A: 'Reusable',
  B: 'Verify asset',
  C: 'Reference only',
  D: 'Avoid automation'
};

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function formatList(items = []) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function currentQuery() {
  const params = new URLSearchParams();
  if (elements.search.value.trim()) params.set('q', elements.search.value.trim());
  if (elements.classification.value) params.set('classification', elements.classification.value);
  if (elements.category.value) params.set('category', elements.category.value);
  return params;
}

function renderStats(summary, visibleCount) {
  const cards = [
    ['Index', summary.total, 'tracked sources'],
    ['Reusable', summary.byClassification.A, 'license-ready candidates'],
    ['Verify', summary.byClassification.B, 'asset-level review'],
    ['Reference', summary.byClassification.C + summary.byClassification.D, 'link or blocklist']
  ];
  elements.stats.innerHTML = cards.map(([label, value, caption]) => `
    <div class="stat-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${caption}</small>
    </div>
  `).join('');
  elements.summary.textContent = `${visibleCount} of ${summary.total} sources · select a card to inspect its license boundary`;
}

function renderCategories(summary) {
  const current = elements.category.value;
  elements.category.innerHTML = '<option value="">All categories</option>';
  for (const category of summary.categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    elements.category.append(option);
  }
  elements.category.value = summary.categories.includes(current) ? current : '';
}

function renderCards(sources) {
  if (!sources.length) {
    elements.grid.innerHTML = '<div class="empty-state"><strong>No sources match.</strong><span>Try a broader search or clear the filters.</span></div>';
    return;
  }

  elements.grid.innerHTML = sources.map((source) => `
    <article class="source-card ${state.selectedId === source.id ? 'is-selected' : ''}">
      <div class="card-topline">
        <span class="class-pill class-${source.classification}">${source.classification} · ${labels[source.classification]}</span>
        <span class="rank">#${source.rank ?? '—'}</span>
      </div>
      <h2>${escapeHtml(source.name)}</h2>
      <p>${escapeHtml(source.description)}</p>
      <div class="tag-row">${source.categories.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
      <div class="card-footer">
        <span>${escapeHtml(source.license)}${source.content_manifest ? ` · ${source.content_manifest.files.length} local file${source.content_manifest.files.length === 1 ? '' : 's'}` : ''}</span>
        <button class="card-link" type="button" data-source-id="${escapeHtml(source.id)}">Inspect <span aria-hidden="true">↗</span></button>
      </div>
    </article>
  `).join('');
}

function renderDetails(source) {
  if (!source) {
    elements.details.hidden = true;
    return;
  }
  elements.details.hidden = false;
  elements.detailContent.innerHTML = `
    <span class="eyebrow">Source record</span>
    <div class="detail-title-row">
      <h2>${escapeHtml(source.name)}</h2>
      <span class="class-pill class-${source.classification}">${source.classification}</span>
    </div>
    <p class="detail-description">${escapeHtml(source.description)}</p>
    <a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">Open official source <span aria-hidden="true">↗</span></a>
    <dl class="detail-facts">
      <div><dt>License</dt><dd>${escapeHtml(source.license)}</dd></div>
      <div><dt>Commercial public use</dt><dd>${escapeHtml(source.commercial_public_use)}</dd></div>
      <div><dt>Modification</dt><dd>${escapeHtml(source.modification)}</dd></div>
      <div><dt>Internal use</dt><dd>${escapeHtml(source.internal_local_use)}</dd></div>
      <div><dt>Last verified</dt><dd>${escapeHtml(source.last_verified)}</dd></div>
      <div><dt>Confidence</dt><dd>${escapeHtml(source.confidence)}</dd></div>
    </dl>
    <div class="detail-section"><h3>Provides</h3><ul>${formatList(source.provides)}</ul></div>
    <div class="detail-section"><h3>Acquire it like this</h3><p>${escapeHtml(source.acquisition)}</p></div>
    <div class="detail-section"><h3>Boundary</h3><p>${escapeHtml(source.scraping_api)}</p></div>
    <div class="detail-section"><h3>CLI content</h3><p>${source.content_manifest ? `Pulled locally: ${source.content_manifest.files.map((file) => `<code>${escapeHtml(file.path)}</code>`).join(' ')}.` : source.pull_command ? `Run <code>${escapeHtml(source.pull_command)}</code> to fetch the approved repository README and license. Add <code>--file PATH</code> for another file.` : 'No automatic content pull is enabled for this source. Keep it as metadata and notes.'}</p></div>
    <div class="detail-section"><h3>Limitations</h3><ul>${formatList(source.limitations)}</ul></div>
    <div class="detail-links">
      <a href="${escapeHtml(source.license_url)}" target="_blank" rel="noreferrer">License ↗</a>
      <a href="${escapeHtml(source.terms_url)}" target="_blank" rel="noreferrer">Terms ↗</a>
    </div>
  `;
}

async function loadSummary() {
  const response = await fetch('/api/summary');
  if (!response.ok) throw new Error('Could not load corpus summary.');
  return response.json();
}

async function loadSources() {
  const response = await fetch(`/api/sources?${currentQuery()}`);
  if (!response.ok) throw new Error('Could not load source records.');
  return response.json();
}

async function refresh() {
  elements.grid.innerHTML = '<div class="loading-state">Updating the local index…</div>';
  try {
    const [summary, result] = await Promise.all([loadSummary(), loadSources()]);
    state.allSources = result.data;
    renderCategories(summary);
    renderStats(summary, result.total);
    renderCards(result.data);
    renderDetails(state.allSources.find((source) => source.id === state.selectedId));
  } catch (error) {
    elements.grid.innerHTML = `<div class="error-state"><strong>Could not load the corpus.</strong><span>${escapeHtml(error.message)}</span></div>`;
  }
}

elements.search.addEventListener('input', refresh);
elements.classification.addEventListener('change', refresh);
elements.category.addEventListener('change', refresh);
elements.refresh.addEventListener('click', refresh);
elements.reset.addEventListener('click', () => {
  elements.search.value = '';
  elements.classification.value = '';
  elements.category.value = '';
  state.selectedId = null;
  refresh();
});
elements.closeDetails.addEventListener('click', () => {
  state.selectedId = null;
  renderDetails(null);
  renderCards(state.allSources);
});
elements.grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-source-id]');
  if (!button) return;
  state.selectedId = button.dataset.sourceId;
  renderDetails(state.allSources.find((source) => source.id === state.selectedId));
  renderCards(state.allSources);
});

refresh();
