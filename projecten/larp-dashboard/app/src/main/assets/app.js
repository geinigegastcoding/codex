'use strict';

const icons = {
  settings: '<path d="M12 8v.01M12 12v.01M12 16v.01" stroke-width="3" stroke-linecap="round"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-2 7-2 9h16c0-2-2-2-2-9M10 20h4"/>',
  home: '<path d="M3 11 12 4l9 7M5 10v10h14V10M9 20v-6h6v6"/>',
  chart: '<path d="M4 20V4M4 20h17M8 16v-5M12 16V7M16 16v-3M20 16V5"/>',
  content: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m10 8 6 4-6 4z"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 9V7a3 3 0 0 1 3-3h12M16 14h5"/>',
  history: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 3"/>',
  sliders: '<path d="M4 7h16M4 17h16M8 4v6M16 14v6"/>',
  receive: '<path d="M12 3v14m-5-5 5 5 5-5M4 20h16"/>',
  send: '<path d="M4 11 20 4l-6 16-3-6-7-3ZM11 14l9-10"/>',
  swap: '<path d="M4 8h15m-4-4 4 4-4 4M20 16H5m4-4-4 4 4 4"/>',
  buy: '<path d="M12 3v18M16 7c-1-2-7-2-8 0-2 4 8 3 8 7 0 3-7 4-9 1"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  edit: '<path d="m4 16 10-10 4 4-10 10-4 1 1-5ZM13 7l4 4"/>'
};
const svg = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;
const logos = {
  shopify: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path fill="currentColor" d="M7 9 25 7l2 21-22-2L7 9Z"/><path stroke="#95bf47" stroke-width="2" d="M12 10c0-8 8-8 8-1"/><path fill="#6f963b" d="M19 12c-3-2-7-1-7 2 0 3 4 3 4 5 0 1-2 1-4 0l-1 3c4 2 8 1 8-3 0-3-4-4-4-5 0-1 2-1 3 0z"/></svg>',
  youtube: '<svg viewBox="0 0 32 24" fill="none" aria-hidden="true"><rect x="1" y="2" width="30" height="20" rx="5" fill="currentColor"/><path d="m13 7 9 5-9 5V7Z" fill="white"/></svg>',
  phantom: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path fill="currentColor" d="M3 20C3 11 8 5 18 5c7 0 11 5 11 11 0 5-2 8-5 8-1 0-2-1-2-2-1 2-3 3-5 3-1 0-2-1-2-2-2 2-3 3-5 2-2 0-2-2-1-4-2 3-4 4-6 3-1-1-1-2 0-4Z"/><ellipse cx="19" cy="13" rx="1.5" ry="2" fill="#a999f7"/><ellipse cx="24" cy="13" rx="1.5" ry="2" fill="#a999f7"/></svg>',
  tiktok: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M17 4h4c.4 4 3 7 7 7v4c-3 0-5-1-7-2v8c0 5-3 8-8 8-4 0-7-3-7-7s3-7 8-7v4c-2 0-4 1-4 3s1 3 3 3c3 0 4-2 4-4V4Z" fill="#25f4ee" transform="translate(-1 1)"/><path d="M17 4h4c.4 4 3 7 7 7v4c-3 0-5-1-7-2v8c0 5-3 8-8 8-4 0-7-3-7-7s3-7 8-7v4c-2 0-4 1-4 3s1 3 3 3c3 0 4-2 4-4V4Z" fill="#fe2c55" transform="translate(1 -1)"/><path d="M17 4h4c.4 4 3 7 7 7v4c-3 0-5-1-7-2v8c0 5-3 8-8 8-4 0-7-3-7-7s3-7 8-7v4c-2 0-4 1-4 3s1 3 3 3c3 0 4-2 4-4V4Z" fill="white"/></svg>',
  stripe: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="white" d="M13 12c0-1 1-2 3-2 3 0 6 1 8 2V6c-2-1-5-2-8-2C9 4 5 8 5 13c0 8 11 7 11 10 0 1-1 2-3 2-3 0-6-1-9-3v6c3 1 6 2 9 2 7 0 12-3 12-9 0-8-12-7-12-9Z"/></svg>',
  amazon: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 8h22v15H5z" fill="white"/><path d="M9 25c5 3 10 3 15 0" stroke="#ff9900" stroke-width="2" stroke-linecap="round"/><path d="m22 23 4 1-2 3" fill="#ff9900"/><path d="M12 8c0-6 8-6 8 0" stroke="#232f3e" stroke-width="2"/></svg>'
};

const storageKey = 'dashlab.data.v1';
const shopDefaults = {
  today: { sales: 1749.28, orders: 19, conversion: 2.8, visitors: 94, fulfill: 8, payments: 1, risk: 0 },
  week: { sales: 14278.49, orders: 134, conversion: 2.4, visitors: 512, fulfill: 24, payments: 2, risk: 1 },
  month: { sales: 47880.93, orders: 523, conversion: 1.42, visitors: 30, fulfill: 50, payments: 1, risk: 9 },
  quarter: { sales: 129406.15, orders: 1488, conversion: 1.86, visitors: 61, fulfill: 71, payments: 3, risk: 12 }
};
const youtubeDefaults = {
  week: { views: 58200, watch: 1490, subscribers: 22, revenue: 121.20 },
  month: { views: 248901, watch: 6324, subscribers: 84, revenue: 584.67 },
  quarter: { views: 744092, watch: 18417, subscribers: 259, revenue: 1640.14 }
};
function defaults() {
  return {
    shopify: { currency: 'USD', range: 'month', ranges: JSON.parse(JSON.stringify(shopDefaults)) },
    youtube: { currency: 'USD', range: 'month', ranges: JSON.parse(JSON.stringify(youtubeDefaults)), videos: [
      { title: 'How I grew my channel this month', views: 2500 },
      { title: 'Everything I learned along the way', views: 2400 },
      { title: 'The simple setup that changed things', views: 2000 },
      { title: 'A closer look behind the scenes', views: 1600 },
      { title: 'My best tips for getting started', views: 1000 }
    ] },
    phantom: { range: '1M', assets: [
      { name: 'Solana', symbol: 'SOL', icon: 'sol', glyph: '≋', quantity: 24.5, value: 3675, price: 150 },
      { name: 'Ethereum', symbol: 'ETH', icon: 'eth', glyph: '♦', quantity: 1.4, value: 3500, price: 2500 },
      { name: 'Bitcoin', symbol: 'BTC', icon: 'btc', glyph: '₿', quantity: 0.032, value: 2080, price: 65000 },
      { name: 'Polygon', symbol: 'POL', icon: 'pol', glyph: '⬡', quantity: 1800, value: 900, price: 0.5 }
    ], activity: [] },
    tiktok: { range: 'week', ranges: {
      week: { views: 458203, profileViews: 25123, likes: 41850, comments: 1532, shares: 2842, followers: 2468 },
      month: { views: 1842901, profileViews: 96211, likes: 143720, comments: 6308, shares: 11920, followers: 9850 },
      quarter: { views: 5216340, profileViews: 294100, likes: 412410, comments: 19810, shares: 38212, followers: 28740 }
    }, videos: [
      { title: 'A day in the life', views: 182400 },
      { title: 'The one thing that changed everything', views: 87300 },
      { title: 'Behind the scenes', views: 64200 }
    ] },
    stripe: { currency: 'USD', range: 'month', ranges: {
      today: { gross: 3024, payments: 33, customers: 14, net: 2897.30, mrr: 1326, balance: 6892.16 },
      week: { gross: 8614.42, payments: 97, customers: 67, net: 8284.03, mrr: 4572, balance: 6892.16 },
      month: { gross: 26814.70, payments: 307, customers: 214, net: 25534.40, mrr: 8326, balance: 6892.16 },
      quarter: { gross: 82491.22, payments: 967, customers: 701, net: 79140.88, mrr: 12275, balance: 6892.16 }
    } },
    amazon: { currency: 'USD', range: 'month', ranges: {
      today: { sales: 868.55, units: 31, orders: 13, returns: 2, messages: 0 },
      week: { sales: 4924.22, units: 186, orders: 79, returns: 5, messages: 2 },
      month: { sales: 18324.60, units: 682, orders: 304, returns: 12, messages: 3 },
      quarter: { sales: 53670.22, units: 2045, orders: 921, returns: 28, messages: 5 }
    } }
  };
}
let storageWarning = '';
let data;
try {
  const stored = localStorage.getItem(storageKey);
  const saved = stored ? JSON.parse(stored) : null;
  if (stored && (!saved || !saved.shopify || !saved.youtube || !saved.phantom)) throw new Error('Invalid saved data');
  data = saved ? mergeProfiles(saved, defaults()) : defaults();
} catch (error) {
  data = defaults();
  storageWarning = 'Saved dashboard data could not be loaded. New edits will replace it.';
}
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(data)); return true; }
  catch (error) { toast('Could not save. Check your device storage.'); return false; }
}
const android = window.DashLab || null;
const profiles = ['shopify', 'youtube', 'phantom', 'tiktok', 'stripe', 'amazon'];
const lightProfiles = ['shopify', 'tiktok', 'amazon'];
let profile = android ? android.getProfile() : (localStorage.getItem('dashlab.profile') || '');
if (!profiles.includes(profile)) profile = '';
let previousProfile = profile;
let shopMetric = 'sales';
let shopTab = 'home';
let ytMetric = 'views';
let ytTab = 'Overview';
let walletTab = 'Tokens';
let walletReceive = false;
const newMetric = { tiktok: 'views', stripe: 'net', amazon: 'sales' };
let tiktokTab = 'Overview';
let modalOpen = false;
let toastTimer;
const app = document.getElementById('app');
const portal = document.getElementById('portal');
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const amount = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(value));
const compact = value => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(Number(value));
const money = (value, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value));
const quantity = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }).format(Number(value));
const currencyOptions = current => ['USD', 'EUR', 'GBP'].map(value => `<option value="${value}" ${value === current ? 'selected' : ''}>${value}</option>`).join('');
const rangeOptions = (current, youtube = false) => [
  ...(!youtube ? [['today', 'Today']] : []), ['week', 'Last 7 days'], [ 'month', youtube ? 'Last 28 days' : 'Last 30 days'], ['quarter', 'Last 90 days']
].map(([value, label]) => `<option value="${value}" ${value === current ? 'selected' : ''}>${label}</option>`).join('');
const rangeCount = range => ({ today: 24, week: 7, month: 30, quarter: 90 }[range] || 30);
function toast(message) {
  const element = document.getElementById('toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 3500);
}
function chart(series, color, options = {}) {
  const maximum = Math.max(...series, 0.01) * 1.1;
  const left = options.labels ? 38 : 1;
  const width = 359 - left;
  const point = (value, i) => `${(left + width * i / Math.max(1, series.length - 1)).toFixed(1)},${(118 - value / maximum * 105).toFixed(1)}`;
  const points = series.map(point).join(' ');
  const grid = [0, 1, 2, 3].map(i => {
    const y = 13 + 35 * i;
    const labelValue = maximum * (3 - i) / 3;
    const label = options.percent ? `${amount(labelValue)}%` : options.currency ? new Intl.NumberFormat('en-US', { style: 'currency', currency: options.currency, notation: 'compact', maximumFractionDigits: 1 }).format(labelValue) : compact(labelValue);
    return `<line x1="${left}" x2="359" y1="${y}" y2="${y}" stroke="${options.dark ? '#38383a' : '#e4e6e7'}" stroke-width="1"/>${options.labels ? `<text x="0" y="${y + 4}" fill="${options.dark ? '#a8a8ac' : '#96999b'}" font-size="9">${escapeHtml(label)}</text>` : ''}`;
  }).join('');
  const compare = options.compare ? `<polyline fill="none" stroke="${color}" opacity=".25" stroke-dasharray="2 4" stroke-width="1.5" points="${series.map((value, i) => point(value * (0.7 + (i % 5) * .08), i)).join(' ')}"/>` : '';
  return `<div class="chart"><svg viewBox="0 0 360 125" preserveAspectRatio="none" role="img" aria-label="Performance chart">${grid}${compare}<polyline fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" points="${points}"/></svg></div>`;
}
function navItem(icon, label, action, target, active) {
  return `<button class="nav-item ${active ? 'active' : ''}" data-action="${action}" data-target="${target}">${svg(icon)}<span>${label}</span></button>`;
}
function topMenu() { return `<button class="icon-btn" data-action="menu" aria-label="Dashboard settings">${svg('settings')}</button>`; }

function chooser() {
  const choices = [
    ['shopify', 'Shopify', 'Store overview & sales', 'shop'],
    ['youtube', 'YouTube Studio', 'Channel analytics & content', 'youtube'],
    ['phantom', 'Phantom', 'Wallet overview & tokens', 'phantom'],
    ['tiktok', 'TikTok Studio', 'Creator analytics & posts', 'tiktok'],
    ['stripe', 'Stripe', 'Payments & revenue', 'stripe'],
    ['amazon', 'Amazon Seller', 'Sales & orders', 'amazon']
  ];
  return `<div class="app chooser"><div class="chooser-wrap">
    <div class="wordmark"><span class="labmark"><i></i><i></i><i></i><i></i></span>DASHLAB</div>
    <div class="chooser-heading"><div class="eyebrow">YOUR DASHBOARDS</div><h1>Pick a<br>dashboard.</h1><p>Choose a dashboard to make it yours. Your numbers stay on this device.</p></div>
    ${choices.map(([id, label, subtitle, icon]) => `<button class="choice" data-action="choose" data-profile="${id}"><span class="brand-icon ${icon}">${logos[id]}</span><span class="choice-copy"><strong>${label}</strong><span>${subtitle}</span></span><span class="choice-arrow">›</span></button>`).join('')}
    <div class="chooser-note">${svg('lock')}<span>Choosing a dashboard updates the home-screen icon and closes the app.</span></div>
    ${previousProfile ? '<button class="back-link" data-action="return-profile">← Back to dashboard</button>' : ''}
  </div></div>`;
}
function shopify() {
  const shop = data.shopify;
  const stats = shop.ranges[shop.range];
  const metrics = [
    ['sales', 'Total sales', money(stats.sales, shop.currency), '↗ 2%'],
    ['orders', 'Orders', compact(stats.orders), '↗ 4%'],
    ['conversion', 'Conversion', `${amount(stats.conversion)}%`, '↗ 0.5%']
  ];
  const values = shopMetric === 'conversion'
    ? seriesForBalance(stats.conversion, rangeCount(shop.range), 61).map(value => Math.min(100, value))
    : seriesForTotal(stats[shopMetric], rangeCount(shop.range), shopMetric === 'sales' ? 41 : 53, shopMetric === 'orders' ? 0 : 2);
  const nav = `<nav class="bottom-nav light" aria-label="Shopify dashboard navigation">${navItem('home', 'Home', 'shop-nav', 'home', shopTab === 'home')}${navItem('chart', 'Analytics', 'shop-nav', 'analytics', shopTab === 'analytics')}${navItem('content', 'Orders', 'shop-nav', 'orders', false)}${navItem('sliders', 'Settings', 'menu', '', false)}</nav>`;
  if (shopTab === 'analytics') {
    const cards = metrics.map(([id, label, value]) => {
      const series = id === 'conversion'
        ? seriesForBalance(stats[id], rangeCount(shop.range), 61).map(point => Math.min(100, point))
        : seriesForTotal(stats[id], rangeCount(shop.range), id === 'sales' ? 41 : 53, id === 'orders' ? 0 : 2);
      return `<section class="shop-report-card"><button data-action="edit-shop" data-key="${id}" aria-label="Edit ${label}"><span>${label} over time</span><strong>${value}</strong></button>${stats[id] === 0 ? '<p>No data for this date range.</p>' : chart(series, '#1598b4', { labels: true, percent: id === 'conversion', currency: id === 'sales' ? shop.currency : null })}</section>`;
    }).join('');
    return `<div class="app shopify"><div class="main-scroll"><header class="topbar topbar-shop"><div class="brand-title">Analytics <span class="shop-chevron">⌄</span></div><div class="top-actions">${topMenu()}<span class="avatar">DL</span></div></header><div class="shop-analytics"><label class="pill"><select aria-label="Date range" data-change="shop-range">${rangeOptions(shop.range)}</select></label><div class="shop-report-list">${cards}</div></div></div>${nav}</div>`;
  }
  const dayLabels = shop.range === 'today' ? ['12 AM', '12 PM', 'Now'] : [rangeCount(shop.range) - 1, Math.floor((rangeCount(shop.range) - 1) / 2), 0].map(days => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  return `<div class="app shopify"><div class="main-scroll">
    <header class="topbar topbar-shop"><div class="brand-title"><span class="brand-icon shop" style="width:30px;height:30px;border-radius:8px">${logos.shopify}</span><span style="font-size:16px;letter-spacing:-.02em">Shopify</span></div><div class="top-actions">${topMenu()}<span class="avatar">DL</span></div></header>
    <section class="shop-card"><div class="shop-inner">
      <div class="filter-row"><label class="pill"><select aria-label="Date range" data-change="shop-range">${rangeOptions(shop.range)}</select></label><button class="pill" data-action="edit-shop" data-key="visitors"><span class="dot"></span>${amount(stats.visitors)} visitors</button><button class="pill report" data-action="shop-report">▤ Report</button></div>
      <div class="metrics">${metrics.map(([id, label, value, change]) => `<button class="metric ${shopMetric === id ? 'active' : ''}" data-action="edit-shop" data-key="${id}" aria-label="Edit ${label}"><span class="metric-label">${label}</span><span class="metric-value">${value}</span><span class="metric-change up">${change}</span></button>`).join('')}</div>
      ${chart(values, '#1598b4', { labels: true, compare: true, percent: shopMetric === 'conversion', currency: shopMetric === 'sales' ? shop.currency : null })}
      <div class="axis-labels">${dayLabels.map(label => `<span>${label}</span>`).join('')}</div>
      <div class="shop-shortcuts"><button class="shortcut" data-action="edit-shop" data-key="fulfill"><strong>${amount(stats.fulfill)}</strong><span>Orders to fulfill</span></button><button class="shortcut" data-action="edit-shop" data-key="payments"><strong>${amount(stats.payments)}</strong><span>Payments to capture</span></button><button class="shortcut" data-action="edit-shop" data-key="risk"><strong>${amount(stats.risk)}</strong><span>High risk orders</span></button></div>
    </div></section>
    <div class="shop-empty"><span class="check">✓</span><strong>That's it for now</strong><p>Check back later for more insights and advice about your business.</p></div>
  </div>${nav}</div>`;
}
function youtube() {
  const yt = data.youtube;
  const stats = yt.ranges[yt.range];
  const descriptions = { views: 'Views', watch: 'Watch time (hours)', subscribers: 'Subscribers', revenue: 'Estimated revenue' };
  const values = { views: compact(stats.views), watch: amount(stats.watch), subscribers: `+${amount(stats.subscribers)}`, revenue: money(stats.revenue, yt.currency) };
  const cards = Object.entries(descriptions).map(([key, label]) => {
    const series = seriesForTotal(stats[key], yt.range === 'month' ? 28 : rangeCount(yt.range), { views: 2, watch: 12, subscribers: 47, revenue: 92 }[key], ['views', 'subscribers'].includes(key) ? 0 : 2);
    return `<section class="yt-card yt-metric" data-yt-card="${key}"><div class="yt-metric-label">${label}</div><button class="yt-amount yt-value" data-action="edit-yt" data-key="${key}" aria-label="Edit ${label}">${values[key]}</button><div class="yt-sub"><label><select aria-label="YouTube date range" data-change="yt-range">${rangeOptions(yt.range, true)}</select></label></div>${chart(series, '#00b4d8', { labels: true, dark: true, currency: key === 'revenue' ? yt.currency : null })}<div class="axis-labels"><span>Start</span><span>Today</span></div></section>`;
  }).join('');
  return `<div class="app youtube"><div class="main-scroll">
    <header class="topbar topbar-youtube"><div class="brand-title">${logos.youtube}<span>Studio</span></div><div class="top-actions">${topMenu()}<span class="avatar" style="background:#7083b2;color:white">Y</span></div></header>
    <div class="yt-tabs">${['Overview', 'Content', 'Audience', 'Revenue'].map(tab => `<button class="yt-tab ${ytTab === tab ? 'active' : ''}" data-action="yt-tab" data-tab="${tab}">${tab}</button>`).join('')}</div>
    <div class="yt-content">
      <div class="yt-carousel" id="yt-carousel" role="region" aria-label="Channel analytics cards">${cards}</div>
      <div class="yt-pagination" aria-label="Choose an analytics card">${Object.entries(descriptions).map(([key, label]) => `<button class="yt-dot ${ytMetric === key ? 'active' : ''}" data-action="yt-metric" data-key="${key}" aria-label="Show ${label}" aria-pressed="${ytMetric === key}"></button>`).join('')}</div>
      <div class="yt-card yt-recap"><span>Your weekly recap is here</span><span>✧</span></div>
      <section class="yt-card yt-section" id="top-content"><div class="section-heading"><div><h2>Top content</h2><p>Views · ${yt.range === 'week' ? 'Last 7 days' : yt.range === 'quarter' ? 'Last 90 days' : 'Last 28 days'}</p></div></div>
        ${yt.videos.map((video, index) => `<button class="video-row" data-action="edit-video" data-index="${index}" aria-label="Edit ${escapeHtml(video.title)}"><span class="thumbnail">▶</span><span class="video-name">${escapeHtml(video.title)}</span><span class="video-views">${compact(video.views)}</span></button>`).join('')}
      </section>
    </div>
  </div><nav class="bottom-nav" aria-label="YouTube Studio navigation">${navItem('home', 'Dashboard', 'yt-nav', 'Overview', ytTab === 'Overview')}${navItem('content', 'Content', 'yt-nav', 'Content', ytTab === 'Content')}${navItem('chart', 'Analytics', 'yt-nav', 'Audience', ytTab === 'Audience' || ytTab === 'Revenue')}${navItem('sliders', 'Settings', 'menu', '', false)}</nav></div>`;
}
function phantom() {
  const wallet = data.phantom;
  if (walletReceive) {
    return `<div class="app phantom phantom-receive"><div class="main-scroll"><header class="receive-header"><button data-action="wallet-receive-close" aria-label="Close receive">×</button><h1>Receive</h1></header><div class="receive-list">${wallet.assets.map((asset, index) => `<button class="receive-asset" data-action="wallet-receive-token" data-index="${index}" aria-label="Receive ${escapeHtml(asset.name)}"><span class="coin ${escapeHtml(asset.icon)}">${escapeHtml(asset.glyph)}</span><span class="receive-asset-name"><strong>${escapeHtml(asset.name)}</strong><small>${escapeHtml(asset.symbol)}</small></span><span class="receive-chevron">›</span></button>`).join('')}</div></div></div>`;
  }
  const total = walletTotal(wallet.assets);
  const counts = { '1D': 24, '1W': 7, '1M': 30, '3M': 60, '1Y': 90 };
  const balances = seriesForBalance(total, counts[wallet.range], 307 + counts[wallet.range]);
  const change = Math.round((total - balances[0]) * 100) / 100;
  const changePercent = balances[0] > 0 ? change / balances[0] * 100 : 0;
  const changeSign = change >= 0 ? '+' : '−';
  return `<div class="app phantom"><div class="main-scroll">
    <header class="topbar topbar-phantom"><div class="wallet-account"><span class="avatar wallet-avatar">A1</span>Account 1 <span style="color:#aaa">⌄</span></div><div class="top-actions">${topMenu()}</div></header>
    <div class="wallet-balance"><button data-action="edit-wallet-total" aria-label="Edit total balance" style="background:transparent;color:inherit"><h1>${money(total)}</h1></button><p>${changeSign}${money(Math.abs(change))} &nbsp; ${changeSign}${amount(Math.abs(changePercent))}%</p></div>
    <div class="wallet-actions">${[['receive', 'Receive'], ['send', 'Send'], ['swap', 'Swap'], ['buy', 'Buy']].map(([id, label]) => `<button class="wallet-action" data-action="wallet-action" data-kind="${id}"><span class="action-icon">${svg(id)}</span>${label}</button>`).join('')}</div>
    <div class="wallet-chart">${chart(balances, '#a99bf8', { dark: true })}</div>
    <div class="range-row">${Object.keys(counts).map(range => `<button class="range-btn ${wallet.range === range ? 'active' : ''}" data-action="wallet-range" data-range="${range}">${range}</button>`).join('')}</div>
    <div class="wallet-tabs">${['Tokens', 'Activity'].map(tab => `<button class="wallet-tab ${walletTab === tab ? 'active' : ''}" data-action="wallet-tab" data-tab="${tab}">${tab}</button>`).join('')}</div>
    ${walletTab === 'Tokens' ? `<div class="asset-list">${wallet.assets.map((asset, index) => `<button class="asset-row" data-action="edit-asset" data-index="${index}"><span class="coin ${asset.icon}">${asset.glyph}</span><span class="asset-name"><strong>${asset.name}</strong><small>${quantity(asset.quantity)} ${asset.symbol}</small></span><span class="asset-value"><strong>${money(asset.value)}</strong><small>${changeSign}${money(Math.abs(total ? asset.value * change / total : 0))}</small></span></button>`).join('')}</div>` : `<div class="asset-list">${wallet.activity.length ? wallet.activity.map(item => `<div class="asset-row"><span class="coin" style="font-size:15px">${item.kind === 'Send' ? '↗' : item.kind === 'Swap' ? '⇄' : '↙'}</span><span class="asset-name"><strong>${escapeHtml(item.kind)} ${escapeHtml(item.symbol)}</strong><small>${escapeHtml(item.date)}</small></span><span class="asset-value"><strong>${item.kind === 'Send' ? '−' : item.kind === 'Swap' ? '' : '+'}${money(item.value)}</strong></span></div>`).join('') : '<div class="wallet-empty">No activity yet.</div>'}</div>`}
  </div><nav class="bottom-nav" aria-label="Phantom dashboard navigation">${navItem('wallet', 'Wallet', 'wallet-tab', 'Tokens', walletTab === 'Tokens')}${navItem('history', 'Activity', 'wallet-tab', 'Activity', walletTab === 'Activity')}${navItem('sliders', 'Settings', 'menu', '', false)}</nav></div>`;
}

const extraLabels = {
  tiktok: { views: 'Post views', profileViews: 'Profile views', likes: 'Likes', comments: 'Comments', shares: 'Shares', followers: 'New followers' },
  stripe: { gross: 'Gross volume', payments: 'Payments', customers: 'Customers', net: 'Net volume from sales', mrr: 'Monthly recurring revenue', balance: 'Available balance' },
  amazon: { sales: 'Product sales', units: 'Units ordered', orders: 'Open orders', returns: 'Returns', messages: 'Buyer messages' }
};
const extraMoney = { tiktok: [], stripe: ['gross', 'net', 'mrr', 'balance'], amazon: ['sales'] };
function extraValue(name, key, value) {
  return extraMoney[name].includes(key) ? money(value, data[name].currency) : compact(value);
}
function extraSeries(name, key, range) {
  const total = data[name].ranges[range][key];
  const count = ['tiktok', 'stripe'].includes(name) && range === 'month' ? 28 : rangeCount(range);
  if (name === 'stripe' && ['mrr', 'balance'].includes(key)) return seriesForBalance(total, count, 183);
  return seriesForTotal(total, count, { tiktok: 37, stripe: 73, amazon: 91 }[name], extraMoney[name].includes(key) ? 2 : 0);
}
function extraRanges(name, ranges) {
  return ranges.map(([key, label]) => `<button class="extra-range ${data[name].range === key ? 'active' : ''}" data-action="extra-range" data-range="${key}">${label}</button>`).join('');
}
function extraMetricButton(name, key, value, className, range) {
  return `<button class="${className} ${newMetric[name] === key ? 'active' : ''}" data-action="edit-extra" data-key="${key}"${range ? ` data-range="${range}"` : ''}><span>${extraLabels[name][key]}</span><strong>${extraValue(name, key, value)}</strong></button>`;
}
function tiktok() {
  const creator = data.tiktok;
  const stats = creator.ranges[creator.range];
  const labels = extraLabels.tiktok;
  return `<div class="app tiktok"><div class="main-scroll">
    <header class="creator-header"><h1>Analytics</h1><div class="top-actions">${topMenu()}<span class="avatar creator-avatar">Y</span></div></header>
    <div class="creator-tabs">${['Overview', 'Content', 'Followers'].map(tab => `<button class="creator-tab ${tiktokTab === tab ? 'active' : ''}" data-action="tiktok-tab" data-tab="${tab}">${tab}</button>`).join('')}</div>
    <div class="creator-ranges">${extraRanges('tiktok', [['week', '7 days'], ['month', '28 days'], ['quarter', '90 days']])}</div>
    <section class="creator-card"><div class="creator-card-heading"><h2>Key metrics <span>ⓘ</span></h2><p>${creator.range === 'week' ? 'Last 7 days' : creator.range === 'month' ? 'Last 28 days' : 'Last 90 days'}</p></div>
      <div class="creator-metrics">${Object.keys(labels).map(key => extraMetricButton('tiktok', key, stats[key], 'creator-metric')).join('')}</div>
      ${chart(extraSeries('tiktok', newMetric.tiktok, creator.range), '#368cac', { labels: true })}<div class="axis-labels"><span>Start</span><span>Today</span></div>
    </section>
    <section class="creator-card creator-posts" id="tiktok-posts"><h2>Recent posts</h2>${creator.videos.map((video, index) => `<button class="creator-post" data-action="edit-video" data-profile="tiktok" data-index="${index}"><span class="post-thumb">▶</span><span class="post-name">${escapeHtml(video.title)}</span><strong>${compact(video.views)}</strong></button>`).join('')}</section>
  </div><nav class="bottom-nav light" aria-label="TikTok Studio navigation">${navItem('home', 'Home', 'tiktok-nav', 'Overview', tiktokTab === 'Overview')}${navItem('chart', 'Analytics', 'tiktok-nav', 'Overview', false)}${navItem('content', 'Content', 'tiktok-nav', 'Content', tiktokTab === 'Content')}${navItem('sliders', 'Settings', 'menu', '', false)}</nav></div>`;
}
function stripe() {
  const account = data.stripe;
  const today = account.ranges.today;
  const stats = account.ranges[account.range];
  const key = newMetric.stripe;
  return `<div class="app stripe"><div class="main-scroll">
    <header class="stripe-header"><span class="stripe-account">S</span><h1>Home</h1>${topMenu()}</header>
    <div class="stripe-content"><h2>Today</h2><div class="stripe-today">${['gross', 'payments', 'customers'].map(item => extraMetricButton('stripe', item, today[item], 'stripe-stat', 'today')).join('')}</div>
      <div class="stripe-heading"><h2>Reports overview</h2><span>⌁</span></div>
      <div class="stripe-ranges">${extraRanges('stripe', [['today', '1D'], ['week', '1W'], ['month', '4W'], ['quarter', '3M']])}</div>
      <section class="stripe-report"><button class="stripe-report-title" data-action="edit-extra" data-key="${key}"><span>${extraLabels.stripe[key]}</span><strong>${extraValue('stripe', key, stats[key])}</strong></button><div class="stripe-period">${account.range === 'today' ? 'Today' : account.range === 'week' ? 'Last 7 days' : account.range === 'month' ? 'Last 4 weeks' : 'Last 90 days'}</div>
        ${chart(extraSeries('stripe', key, account.range), '#8e83ff', { dark: true, compare: true })}<div class="axis-labels"><span>Start</span><span>Today</span></div>
      </section>
      <section class="stripe-secondary"><button data-action="edit-extra" data-key="mrr"><span>Monthly recurring revenue</span><strong>${money(stats.mrr, account.currency)}</strong></button><span class="stripe-trend">↗</span></section>
      <section class="stripe-secondary"><button data-action="edit-extra" data-key="balance"><span>Available balance</span><strong>${money(stats.balance, account.currency)}</strong></button><span class="stripe-trend">›</span></section>
    </div>
  </div><nav class="bottom-nav stripe-nav" aria-label="Stripe navigation">${navItem('home', 'Home', 'extra-home', 'home', true)}${navItem('wallet', 'Payments', 'edit-extra', 'payments', false)}${navItem('chart', 'Balances', 'edit-extra', 'balance', false)}${navItem('content', 'Customers', 'edit-extra', 'customers', false)}${navItem('sliders', 'Settings', 'menu', '', false)}</nav></div>`;
}
function barChart(series) {
  const max = Math.max(...series, 1) * 1.1;
  const width = 300 / series.length;
  const symbol = newMetric.amazon === 'sales' ? { USD: '$', EUR: '€', GBP: '£' }[data.amazon.currency] : '';
  const grid = [16, 52, 89, 126].map(y => `<line x1="0" x2="300" y1="${y}" y2="${y}" stroke="#e8ebed" stroke-width="1"/><text x="305" y="${y + 3}" fill="#87939b" font-size="8">${symbol}${compact(max * (126 - y) / 110)}</text>`).join('');
  const bars = series.map((value, index) => {
    const height = value / max * 110;
    return `<rect x="${(index * width + 1).toFixed(2)}" y="${(126 - height).toFixed(2)}" width="${Math.max(1, width - 2).toFixed(2)}" height="${height.toFixed(2)}" rx="1" fill="${index === series.length - 1 ? '#aab5be' : '#ff9900'}"/>`;
  }).join('');
  return `<div class="chart amazon-chart"><svg viewBox="0 0 360 130" preserveAspectRatio="none" role="img" aria-label="Performance chart">${grid}${bars}</svg></div>`;
}
function amazon() {
  const seller = data.amazon;
  const today = seller.ranges.today;
  const stats = seller.ranges[seller.range];
  const key = newMetric.amazon;
  return `<div class="app amazon"><div class="main-scroll">
    <header class="amazon-header"><button class="icon-btn amazon-menu" data-action="menu" aria-label="Open menu">☰</button><div class="amazon-wordmark">amazon <span>seller</span><i></i></div>${topMenu()}</header>
    <button class="amazon-health" data-action="amazon-health"><span>✓</span><div><strong>Account health</strong><small>Your account is healthy</small></div><b>›</b></button>
    <div class="amazon-today">${[['sales', 'Sales today'], ['units', 'Units today'], ['orders', 'Open orders']].map(([item, label]) => `<button class="amazon-today-stat" data-action="edit-extra" data-key="${item}" data-range="today"><span>${label}</span><strong>${extraValue('amazon', item, today[item])}</strong></button>`).join('')}</div>
    <section class="amazon-card"><div class="amazon-heading"><h1>Sales overview</h1><label class="amazon-range-select"><select aria-label="Date range" data-change="amazon-range">${rangeOptions(seller.range)}</select></label></div>
      <div class="amazon-metric-switch">${['sales', 'units', 'orders'].map(item => `<button class="amazon-chip ${key === item ? 'active' : ''}" data-action="extra-metric" data-key="${item}">${extraLabels.amazon[item]}</button>`).join('')}</div>
      <button class="amazon-total" data-action="edit-extra" data-key="${key}"><strong>${extraValue('amazon', key, stats[key])}</strong><span>${extraLabels.amazon[key]}</span></button>
      ${barChart(extraSeries('amazon', key, seller.range))}<div class="axis-labels"><span>Start</span><span>Today</span></div>
    </section>
    <section class="amazon-card amazon-tasks"><h2>Manage your business</h2>${[['orders', 'Manage orders'], ['returns', 'Manage returns'], ['messages', 'Buyer messages']].map(([item, label]) => `<button data-action="edit-extra" data-key="${item}" data-range="today"><span>${label}</span><strong>${amount(today[item])} ›</strong></button>`).join('')}</section>
  </div><nav class="bottom-nav light amazon-nav" aria-label="Amazon Seller navigation">${navItem('home', 'Home', 'extra-home', 'home', true)}${navItem('content', 'Orders', 'edit-extra', 'orders', false)}${navItem('chart', 'Sales', 'edit-extra', 'sales', false)}${navItem('sliders', 'Menu', 'menu', '', false)}</nav></div>`;
}
function render() {
  document.documentElement.style.colorScheme = lightProfiles.includes(profile) ? 'light' : 'dark';
  if (android) android.setAppearance(profile);
  const screens = { shopify, youtube, phantom, tiktok, stripe, amazon };
  app.innerHTML = profile ? screens[profile]() : chooser();
  const carousel = document.getElementById('yt-carousel');
  if (carousel) {
    scrollYtCard(ytMetric);
    carousel.addEventListener('scroll', () => {
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      const cards = [...carousel.querySelectorAll('[data-yt-card]')];
      const current = cards.reduce((closest, card) => Math.abs(card.offsetLeft + card.offsetWidth / 2 - center) < Math.abs(closest.offsetLeft + closest.offsetWidth / 2 - center) ? card : closest);
      ytMetric = current.dataset.ytCard;
      document.querySelectorAll('.yt-dot').forEach(dot => {
        const active = dot.dataset.key === ytMetric;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-pressed', String(active));
      });
    }, { passive: true });
  }
}
function scrollYtCard(key, animated = false) {
  const carousel = document.getElementById('yt-carousel');
  if (!carousel) return;
  const card = [...carousel.querySelectorAll('[data-yt-card]')].find(item => item.dataset.ytCard === key);
  if (!card) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  carousel.scrollTo({ left: card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2, behavior: animated && !reducedMotion ? 'smooth' : 'auto' });
}

function closeSheet() {
  portal.innerHTML = '';
  modalOpen = false;
}
function showSheet(title, description, contents, onSubmit, submitLabel = 'Save changes') {
  modalOpen = true;
  portal.innerHTML = `<div class="overlay ${['shopify', 'youtube', 'phantom'].includes(profile) ? 'motion' : ''}" data-action="backdrop"><section class="sheet ${lightProfiles.includes(profile) ? '' : 'dark'}" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><div class="grabber"></div><div class="sheet-head"><h2>${escapeHtml(title)}</h2><button class="close-sheet" data-action="close" aria-label="Close">×</button></div><p class="description">${escapeHtml(description)}</p>${onSubmit ? `<form id="sheet-form">${contents}<p class="form-error" role="alert"></p><button type="submit" class="primary">${escapeHtml(submitLabel)}</button></form>` : contents}</section></div>`;
  if (onSubmit) {
    document.getElementById('sheet-form').addEventListener('submit', event => {
      event.preventDefault();
      const error = onSubmit(new FormData(event.currentTarget));
      if (error) { event.currentTarget.querySelector('.form-error').textContent = error; return; }
      closeSheet();
      render();
    });
  }
}
const field = (label, name, value, inputMode = 'decimal') => `<label class="field">${escapeHtml(label)}<input name="${name}" value="${escapeHtml(value)}" inputmode="${inputMode}" autocomplete="off" required></label>`;
const select = (label, name, options) => `<label class="field">${escapeHtml(label)}<select name="${name}">${options}</select></label>`;
const validInteger = value => Number.isInteger(value);
const centsOnly = value => Math.round(value * 100) === value * 100 || Math.abs(Math.round(value * 100) - value * 100) < 0.00001;
function editShop(key) {
  const shop = data.shopify;
  const stats = shop.ranges[shop.range];
  const labels = { sales: 'Total sales', orders: 'Orders', conversion: 'Conversion rate (%)', visitors: 'Visitors', fulfill: 'Orders to fulfill', payments: 'Payments to capture', risk: 'High risk orders' };
  if (!hasOwn(labels, key)) return;
  if (['sales', 'orders', 'conversion'].includes(key)) { shopMetric = key; render(); }
  const contents = field(labels[key], 'value', stats[key]) + (key === 'sales' ? select('Currency', 'currency', currencyOptions(shop.currency)) : '');
  showSheet(`Edit ${labels[key].toLowerCase()}`, 'The chart updates automatically for this date range.', contents, form => {
    const value = parseAmount(form.get('value'));
    if (value === null) return 'Enter a number from 0 to 1,000,000,000,000.';
    if (['orders', 'visitors', 'fulfill', 'payments', 'risk'].includes(key) && !validInteger(value)) return 'Enter a whole number.';
    if (key === 'conversion' && value > 100) return 'Conversion cannot be greater than 100%.';
    if ((key === 'sales' || key === 'conversion') && !centsOnly(value)) return 'Use at most two decimal places.';
    stats[key] = value;
    if (key === 'sales') shop.currency = form.get('currency');
    save();
    return '';
  });
}
function editYoutube(key) {
  const yt = data.youtube;
  const stats = yt.ranges[yt.range];
  const labels = { views: 'Views', watch: 'Watch time (hours)', subscribers: 'Subscribers', revenue: 'Estimated revenue' };
  if (!hasOwn(labels, key)) return;
  ytMetric = key;
  const contents = field(labels[key], 'value', stats[key]) + (key === 'revenue' ? select('Currency', 'currency', currencyOptions(yt.currency)) : '');
  showSheet(`Edit ${labels[key].toLowerCase()}`, 'The chart updates automatically for this date range.', contents, form => {
    const value = parseAmount(form.get('value'));
    if (value === null) return 'Enter a number from 0 to 1,000,000,000,000.';
    if (['views', 'subscribers'].includes(key) && !validInteger(value)) return 'Enter a whole number.';
    if (['revenue', 'watch'].includes(key) && !centsOnly(value)) return 'Use at most two decimal places.';
    stats[key] = value;
    if (key === 'revenue') yt.currency = form.get('currency');
    save();
    return '';
  });
}
function editVideo(index, source = 'youtube') {
  if (!['youtube', 'tiktok'].includes(source)) return;
  const video = data[source].videos[index];
  if (!video) return;
  showSheet('Edit video', 'Update the title and views shown in your content list.', field('Title', 'title', video.title, 'text') + field('Views', 'views', video.views, 'numeric'), form => {
    const title = String(form.get('title')).trim();
    const views = parseAmount(form.get('views'));
    if (!title || title.length > 100) return 'Enter a title of up to 100 characters.';
    if (views === null || !validInteger(views)) return 'Views must be a non-negative whole number.';
    video.title = title;
    video.views = views;
    save();
    return '';
  });
}
function editExtra(key, range) {
  const name = profile;
  if (!hasOwn(extraLabels, name) || !hasOwn(extraLabels[name], key)) return;
  const dashboard = data[name];
  const selectedRange = range || dashboard.range;
  if (!hasOwn(dashboard.ranges, selectedRange)) return;
  dashboard.range = selectedRange;
  newMetric[name] = key;
  const stats = dashboard.ranges[selectedRange];
  const label = extraLabels[name][key];
  const monetary = extraMoney[name].includes(key);
  const contents = field(label, 'value', stats[key], monetary ? 'decimal' : 'numeric')
    + (monetary ? select('Currency', 'currency', currencyOptions(dashboard.currency)) : '');
  render();
  showSheet(`Edit ${label.toLowerCase()}`, 'The chart updates automatically for this date range.', contents, form => {
    const value = parseAmount(form.get('value'));
    if (value === null) return 'Enter a number from 0 to 1,000,000,000,000.';
    if (!monetary && !validInteger(value)) return 'Enter a whole number.';
    if (monetary && !centsOnly(value)) return 'Use at most two decimal places.';
    if (name === 'stripe' && key === 'balance') Object.values(dashboard.ranges).forEach(period => { period.balance = value; });
    else stats[key] = value;
    if (monetary) dashboard.currency = form.get('currency');
    save();
    return '';
  });
}
function editWalletTotal() {
  const wallet = data.phantom;
  showSheet('Edit total balance', 'Token values adjust proportionally to match this total.', field('Total balance (USD)', 'value', walletTotal(wallet.assets)), form => {
    const value = parseAmount(form.get('value'));
    if (value === null || !centsOnly(value)) return 'Enter a valid amount with up to two decimal places.';
    const before = wallet.assets;
    wallet.assets = scaleWallet(before, value).map((asset, index) => ({
      ...asset,
      quantity: before[index].value === 0 && asset.value > 0 ? Math.round(asset.value / asset.price * 1e8) / 1e8 : asset.quantity
    }));
    save();
    return '';
  });
}
function editAsset(index) {
  const asset = data.phantom.assets[index];
  if (!asset) return;
  showSheet(`Edit ${asset.name}`, 'Set the token amount and its displayed value.', field(`Amount (${asset.symbol})`, 'quantity', asset.quantity) + field('Value (USD)', 'value', asset.value), form => {
    const qty = parseAmount(form.get('quantity'));
    const value = parseAmount(form.get('value'));
    if (qty === null || value === null || !centsOnly(value)) return 'Enter valid non-negative amounts. USD allows two decimals.';
    if (walletTotal(data.phantom.assets) - asset.value + value > 1000000000000) return 'The wallet maximum is $1 trillion.';
    asset.quantity = qty;
    asset.value = value;
    if (qty > 0 && value > 0) asset.price = value / qty;
    save();
    return '';
  });
}
function changeAssetValue(asset, change) {
  const oldValue = asset.value;
  const unitPrice = asset.quantity > 0 && oldValue > 0 ? oldValue / asset.quantity : asset.price;
  asset.value = Math.round((oldValue + change) * 100) / 100;
  asset.quantity = Math.round(asset.value / unitPrice * 1e8) / 1e8;
}
function walletAction(kind, selectedIndex) {
  const wallet = data.phantom;
  const names = { receive: 'Receive', send: 'Send', swap: 'Swap', buy: 'Buy' };
  if (!hasOwn(names, kind)) return;
  if (selectedIndex !== undefined && !wallet.assets[selectedIndex]) return;
  const options = wallet.assets.map((asset, index) => `<option value="${index}" ${index === selectedIndex ? 'selected' : ''}>${escapeHtml(asset.name)} (${escapeHtml(asset.symbol)})</option>`).join('');
  const destination = kind === 'swap' ? select('To token', 'destination', options) : '';
  const description = kind === 'receive' ? 'Add an amount to this token balance on this device.' : 'Choose a token and enter an amount.';
  showSheet(names[kind], description, select(kind === 'swap' ? 'From token' : 'Token', 'asset', options) + destination + field('Amount (USD)', 'value', ''), form => {
    const index = Number(form.get('asset'));
    const targetIndex = Number(form.get('destination'));
    const value = parseAmount(form.get('value'));
    const asset = wallet.assets[index];
    if (!asset || value === null || value <= 0 || !centsOnly(value)) return 'Enter an amount greater than zero, with up to two decimals.';
    if ((kind === 'send' || kind === 'swap') && value > asset.value) return 'This token balance is too low.';
    if (kind === 'swap' && (targetIndex === index || !wallet.assets[targetIndex])) return 'Choose two different tokens.';
    if ((kind === 'receive' || kind === 'buy') && walletTotal(wallet.assets) + value > 1000000000000) return 'The wallet maximum is $1 trillion.';
    changeAssetValue(asset, kind === 'send' || kind === 'swap' ? -value : value);
    if (kind === 'swap') changeAssetValue(wallet.assets[targetIndex], value);
    wallet.activity.unshift({ kind: names[kind], symbol: kind === 'swap' ? `${asset.symbol} → ${wallet.assets[targetIndex].symbol}` : asset.symbol, value, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
    save();
    if (kind === 'receive') walletReceive = false;
    return '';
  }, names[kind]);
}
function showMenu() {
  showSheet('Dashboard settings', 'Manage your dashboard.', '<button class="menu-item" data-action="switch"><span>Switch dashboard</span><span>›</span></button>', null);
}
function showReport() {
  const shop = data.shopify;
  const stats = shop.ranges[shop.range];
  showSheet('Report', 'A summary of the current date range.', `<div class="menu-item"><span>Total sales</span><strong>${money(stats.sales, shop.currency)}</strong></div><div class="menu-item"><span>Orders</span><strong>${amount(stats.orders)}</strong></div><div class="menu-item"><span>Conversion</span><strong>${amount(stats.conversion)}%</strong></div>`, null);
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'backdrop' && event.target !== button) return;
  if (action === 'close' || action === 'backdrop') { closeSheet(); return; }
  if (action === 'choose') {
    const selected = button.dataset.profile;
    if (!profiles.includes(selected)) return;
    if (android) android.selectProfile(selected);
    else { profile = selected; localStorage.setItem('dashlab.profile', selected); render(); }
  } else if (action === 'return-profile') {
    profile = previousProfile; render();
  } else if (action === 'menu') {
    showMenu();
  } else if (action === 'switch') {
    previousProfile = profile; profile = ''; closeSheet(); render(); window.scrollTo(0, 0);
  } else if (action === 'edit-shop') {
    editShop(button.dataset.key);
  } else if (action === 'shop-report') {
    showReport();
  } else if (action === 'shop-nav') {
    if (button.dataset.target === 'orders') editShop('orders');
    else if (['home', 'analytics'].includes(button.dataset.target)) {
      shopTab = button.dataset.target; render(); window.scrollTo(0, 0);
    }
  } else if (action === 'yt-metric') {
    scrollYtCard(button.dataset.key, true);
  } else if (action === 'edit-yt') {
    editYoutube(button.dataset.key);
  } else if (action === 'edit-video') {
    editVideo(Number(button.dataset.index), button.dataset.profile || 'youtube');
  } else if (action === 'edit-extra') {
    editExtra(button.dataset.key || button.dataset.target, button.dataset.range);
  } else if (action === 'extra-range') {
    if (hasOwn(extraLabels, profile) && hasOwn(data[profile].ranges, button.dataset.range)) {
      data[profile].range = button.dataset.range; save(); render();
    }
  } else if (action === 'extra-metric') {
    if (hasOwn(extraLabels, profile) && hasOwn(extraLabels[profile], button.dataset.key)) {
      newMetric[profile] = button.dataset.key; render();
    }
  } else if (action === 'extra-home') {
    window.scrollTo(0, 0);
  } else if (action === 'amazon-health') {
    showSheet('Account health', 'Your account is healthy.', '', null);
  } else if (action === 'tiktok-tab' || action === 'tiktok-nav') {
    tiktokTab = button.dataset.tab || button.dataset.target;
    newMetric.tiktok = tiktokTab === 'Followers' ? 'followers' : 'views';
    render();
    if (tiktokTab === 'Content') document.getElementById('tiktok-posts').scrollIntoView();
    else window.scrollTo(0, 0);
  } else if (action === 'yt-tab' || action === 'yt-nav') {
    ytTab = button.dataset.tab || button.dataset.target;
    ytMetric = ({ Overview: 'views', Content: 'views', Audience: 'subscribers', Revenue: 'revenue' })[ytTab];
    render();
  } else if (action === 'wallet-range') {
    data.phantom.range = button.dataset.range; save(); render();
  } else if (action === 'wallet-tab') {
    walletTab = button.dataset.tab || button.dataset.target; render();
  } else if (action === 'edit-wallet-total') {
    editWalletTotal();
  } else if (action === 'edit-asset') {
    editAsset(Number(button.dataset.index));
  } else if (action === 'wallet-receive-close') {
    walletReceive = false; render();
  } else if (action === 'wallet-receive-token') {
    walletAction('receive', Number(button.dataset.index));
  } else if (action === 'wallet-action') {
    if (button.dataset.kind === 'receive') { walletReceive = true; render(); window.scrollTo(0, 0); }
    else walletAction(button.dataset.kind);
  }
});
document.addEventListener('change', event => {
  const element = event.target;
  if (element.dataset.change === 'shop-range' && hasOwn(data.shopify.ranges, element.value)) {
    data.shopify.range = element.value; save(); render();
  }
  if (element.dataset.change === 'yt-range' && hasOwn(data.youtube.ranges, element.value)) {
    const card = element.closest('[data-yt-card]');
    if (card) ytMetric = card.dataset.ytCard;
    data.youtube.range = element.value; save(); render();
  }
  if (element.dataset.change === 'amazon-range' && hasOwn(data.amazon.ranges, element.value)) {
    data.amazon.range = element.value; save(); render();
  }
});
window.handleBack = () => {
  if (modalOpen) { closeSheet(); return true; }
  if (profile === 'phantom' && walletReceive) { walletReceive = false; render(); return true; }
  if (!profile && previousProfile) { profile = previousProfile; render(); return true; }
  return false;
};
window.showNativeError = () => toast('Could not change the launcher icon. Please try again.');
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && window.handleBack()) event.preventDefault();
});
render();
if (storageWarning) toast(storageWarning);
