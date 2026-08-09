# Sift research notes

Research checked: 8 August 2026. Links are primary product or platform documentation where available. Product and legal terms change; verify again before shipping integrations.

## Competitor findings

### Google News

Google News already lets people follow topics, locations, and sources, and uses activity to personalize some news surfaces. Google describes factors such as freshness, prominence, and source authoritativeness in its news systems.

Implication: Sift cannot claim `personalized news` as a category novelty. The useful contrast is a smaller, event-first queue with a user-editable explanation ledger.

Sources: [Google News personalization help](https://support.google.com/googlenews/answer/9010862), [How news works on Google](https://newsinitiative.withgoogle.com/hownewsworks/).

### Feedly and Leo

Feedly supports AI Feeds that target topics, entities, or events beyond simple keyword subscriptions and can include negative layers or source exclusions. It is a serious market-intelligence product and a direct competitor for expert users.

Implication: Sift should not compete on filter power. It should hide the machinery until the user needs to inspect it, and rank events rather than ask users to maintain many feeds.

Sources: [Feedly AI Feeds guide](https://docs.feedly.com/article/699-guide-to-ai-feeds-market-intel), [Feedly source following](https://docs.feedly.com/article/768-follow-sources-in-feedly), [Feedly getting started](https://docs.feedly.com/article/523-getting-started-with-feedly).

### Ground News

Ground News aggregates coverage, compares reporting across sources, and exposes blindspots and media-bias context. Its personalization is explicitly moderated by the product's broader goal of helping users get outside a news bubble.

Implication: Sift should borrow the idea of visible source coverage and an outside-profile lane, but avoid making political bias scoring the main product.

Sources: [Ground News product](https://ground.news/product), [Who is Ground News?](https://help.ground.news/en/articles/11593153), [Ground News FAQ](https://ground.news/frequently-asked-questions).

### NewsBlur

NewsBlur is an important near-neighbor: its Intelligence Trainer lets users train likes/dislikes across titles, authors, tags, text, URLs, and scopes, and it has story clustering and notifications.

Implication: the product premise is technically and behaviorally plausible, but a new app needs a much simpler first-run experience and a clear event-value outcome rather than another advanced RSS control panel.

Sources: [NewsBlur intelligence training](https://www.newsblur.com/features/intelligence-training), [global and folder-scoped training](https://blog.newsblur.com/2026/02/02/global-and-folder-scoped-intelligence-training/), [NewsBlur feature overview](https://www.newsblur.com/).

### Readwise Reader

Readwise Reader combines RSS, newsletters, saved content, highlights, annotations, filtering, and import from other readers.

Implication: it is a strong destination for reading and retention. Sift should stay focused on finding the right event before it becomes a reading library.

Source: [Readwise Reader documentation](https://docs.readwise.io/reader/docs).

### Perplexity

Perplexity is an AI search engine that returns cited answers and supports research across multiple sources. That solves on-demand investigation rather than a stable, transparent daily interest profile.

Implication: Sift can link from a story to deeper research later, but should not rebuild a general answer engine in the MVP.

Sources: [What is Perplexity?](https://www.perplexity.ai/help-center/en/articles/10352155-what-is-perplexity), [Perplexity getting started](https://www.perplexity.ai/help-center/en/articles/10354975-getting-started-with-perplexity).

### Artifact as a warning

Artifact is a historical precedent for AI-personalized news. The founders later shut the product down after concluding that the market opportunity did not justify continued investment.

Implication: a beautiful personalized feed and AI summaries are not enough. Distribution, repeat utility, trust, and a narrow paid use case matter more than novelty.

Sources: [The Information's report on the shutdown](https://www.theinformation.com/briefings/artifact-news-app-from-instagrams-co-founders-shuts-down), [TechCrunch analysis](https://techcrunch.com/2024/01/18/why-artifact-from-instagrams-founders-failed-shut-down/).

## Source and API options

| Source | Cost/availability | Good for | MVP decision |
| --- | --- | --- | --- |
| RSS 2.0 / Atom | Open standards; publisher terms still apply | Publisher feeds, blogs, institutions | First ingestion adapter |
| ECB RSS + Data Portal API | Official and public | Rate decisions, speeches, releases, euro data | First primary-source adapter |
| Hacker News API | Public near-real-time API, documented in the official Firebase repository | Developer discussions and links | Add after RSS proof |
| GitHub REST API | Public data with rate limits; authenticated access is more generous | Releases, repositories, discussions | Add for followed projects only |
| SEC EDGAR | Public regulatory filings with fair-access requirements | US company filings and disclosures | Add for finance/company watchlists |
| Guardian Open Platform | Developer key; free non-commercial tier with limits, commercial usage requires a commercial arrangement | Licensed example publisher corpus | Use for a prototype only if usage stays within the key's terms |
| Reddit Data API | OAuth, registration, changing limits, and terms restricting reuse/training | Community context | Later; do not assume scraping is acceptable |
| YouTube Data API | API key/OAuth and quota accounting | Channels/videos for followed entities | Later; use only for explicit subscriptions |
| GDELT | Broad global event/news discovery | Candidate generation and coverage signals | Optional discovery source, never the sole factual source |
| Paid news APIs/licensing | More reliable coverage, recurring cost, contract restrictions | Commercial mainstream news | Budget only after value is proven |

### Official references

- [RSS 2.0 specification](https://www.rssboard.org/rss-specification)
- [Atom RFC 4287](https://www.rfc-editor.org/info/rfc4287)
- [ECB RSS feeds](https://www.ecb.europa.eu/home/html/rss.en.html)
- [ECB Data Portal API](https://data.ecb.europa.eu/help/api/data)
- [Official Hacker News API repository](https://github.com/HackerNews/API)
- [GitHub REST API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [SEC EDGAR API overview](https://www.sec.gov/files/edgar/filer-information/api-overview.pdf)
- [Guardian Open Platform access](https://open-platform.theguardian.com/access/)
- [Reddit Data API Terms](https://redditinc.com/policies/data-api-terms)
- [YouTube Data API overview](https://developers.google.com/youtube/v3/getting-started)
- [YouTube quota calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [GDELT Cloud API documentation](https://docs.gdeltcloud.com/api-reference/v2)

## What can and cannot be scraped reliably

### Acceptable starting points

- fetch RSS/Atom feeds at a respectful interval;
- use an official API with its authentication, attribution, rate limits, and deletion rules;
- store URLs, titles, dates, authors, source identity, and small permitted descriptions;
- open the original page when the user wants to read it;
- keep a source registry that records the exact licence and retention policy per source.

### Do not assume permission for

- crawling publisher pages just because they are public;
- copying full article text, photos, videos, or paywalled content;
- bypassing rate limits, bot checks, paywalls, or access controls;
- using Reddit user content to train models without the required permission;
- converting a feed into a competing full-text publication;
- retaining content after an API or publisher asks for removal.

## Copyright, text mining, and privacy

EU Directive 2019/790 gives press publishers related rights for certain online uses while excluding hyperlinking, mere facts, and very short extracts from that specific right. It also distinguishes text-and-data-mining exceptions and requires attention to rights reservations. That is not a safe harbour for a commercial aggregator to reproduce articles.

The safe product posture is source-linking, event facts, provenance, minimal excerpts, deletion support, and licensing when a source is central to the product. Have counsel review the source registry and generated summaries before a public launch.

Sources: [EU Directive 2019/790](https://eur-lex.europa.eu/eli/dir/2019/790/oj?locale=en), [GDPR Article 5 data minimisation](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679).

## Recommended research conclusion

Build the first experiment with curated demo events and a small source registry. Add RSS plus ECB first. If users do not prefer the short, explainable event queue over a normal news app, more sources will only create more noise and more legal surface area.
