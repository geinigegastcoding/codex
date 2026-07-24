# MagisData Website Council Review

> **Historical review from 28 June 2026.** Findings below are recommendations, not proof of current implementation. The website gitlinks are not initialized in this checkout as of 24 July 2026; re-audit the live site and current source before acting. Highest-priority durable checks: intent-matched CTAs, clickable contact path, honest proof, consistent first-person voice, appropriate schema, unique titles/Open Graph data, at least three valid internal links per page, and no broken or Cloudflare email-protection links.

## ROUND 1: Home Page (`app/page.tsx`)

### 1. SEO Specialist Review
- **Good**: Proper use of Next.js metadata API, JSON-LD for structured data, and semantic `<main>` tag.
- **Actionable Issues**:
  - The `<Hero />` component must contain exactly one `<h1>`. No other `<h1>` on the page.
  - Strict Header Hierarchy: Use `<h2>` for main section titles, and `<h3>` for sub-items in `<Services />`, `<Process />`, etc.
  - Inject `FAQPage` schema into `<CustomerQuestions />` to capture 'People Also Ask' snippets.
  - Fix internal links in `<Services />` and `<CaseStudyInsights />` to use Next.js `<Link>` with descriptive anchor text.
  - Optimize images with `next/image`, descriptive `alt` tags, and `priority=true` for above-the-fold content.

### 2. Content Strategist Review
- **Good**: Excellent clarity, target audience identified immediately. The pragmatic, anti-BS tone builds trust. High-value CTA ("Vraag gratis websiteplan aan") vs generic contact options.
- **Actionable Issues**:
  - The "Ontwerpportfolio" disclaimer reads too negatively. Frame it more positively (e.g., "Dit is een conceptontwerp om onze stijl te laten zien.").
  - Avoid acronyms (AEO, GEO) in the Hero bullet points as local entrepreneurs might not know them. Use plain language (e.g., "Slimme Vindbaarheid").

### 3. CRO Specialist Review
- **Good**: The primary CTA is high-value, low-friction and consistently repeated. Fantastic use of anxiety reduction near the final CTA ("Reactie binnen 1 werkdag").
- **Actionable Issues**:
  - "Results" Disconnect: The Results section shows process features ("1 point of contact") rather than hard numbers (e.g. "+40% leads"). Update this to actually reflect results.
  - Over-apologetic case studies introduce doubt before the final CTA (echoing the Content Strategist).
  - Button Hierarchy: Ensure the secondary CTA ("Bekijk onze diensten") is visually subdued so it doesn't cannibalize the primary CTA.

## ROUND 2: Core Service Pages (`/diensten`, `/webontwikkeling`, `/seo-diensten`)

### 1. SEO Specialist Review
- **Good**: The `/diensten` hub architecture is a masterclass, using `CollectionPage`, `BreadcrumbList`, and `WebPage` schema perfectly. The templating system (`<ContentPage>`) guarantees that every service page automatically generates `Service` JSON-LD and consistent metadata. Flawless semantic HTML.
- **Actionable Issues**:
  - Anchor text dilution: Clicking a whole card on the Services Hub includes the description and button text in the anchor link. Wrapping only the title in the `<Link>` is stronger for SEO, though the current approach is an acceptable UX tradeoff.

### 2. Content Strategist Review
- **Good**: Empathy and structure are 10/10. The symptom-based diagnostic router ("Waar begin je?") and "Voor wie dit is / Niet voor" blocks are brilliant at building trust and filtering leads.
- **Actionable Issues**:
  - The H1 on `/diensten` ("AI-gedreven websites...") contradicts the brand's anti-BS, "gewone taal" tone. Remove "AI-gedreven" and focus on outcomes.
  - Technical jargon in the SEO deliverables ("Canonicals, schema..."): Translate these or add subtext explaining that "we handle the technical plumbing" to align with the plain-language promise.
  - Vary the strict "geen klantresultaten zonder verificatie" disclaimer text so it doesn't feel too repetitive across multiple pages.

### 3. CRO Specialist Review
- **Good**: The psychological flow (Symptom -> Service -> Deliverables -> Fit -> FAQ -> CTA) is pristine. The `HeroPanel` gives a great TL;DR for skimmers.
- **Actionable Issues**:
  - The "Backwards" Secondary CTA: The `ContentPage` template defaults the secondary button to `/diensten`. Sending a user from a specific service back to the hub is pushing them backward in the funnel. It should move them laterally to proof (e.g., `href="/cases"`).
  - Choice Paralysis Risk: On `/diensten`, pricing grids are stacked. Highlight a "Recommended" or "Most Popular" option to anchor the user.
  - Visual Hierarchy on FAQ: The native `<details>` tags need a visual affordance (like a chevron icon) so users know they can expand them.

## ROUND 3: Trust & Proof Pages (`/over-ons`, `/cases`)

### 1. SEO Specialist Review
- **Good**: Fast rendering. Smart use of eager-loading for above-the-fold portfolio images (great for LCP). Excellent use of HTML5 semantic tags.
- **Actionable Issues**:
  - Missing E-E-A-T Schema: The About page relies on standard WebPage schema. It **MUST** use `AboutPage` schema and `Person` schema for the founder ("Daniël Magis") connected to the `Organization` schema to feed Google's Knowledge Graph.

### 2. Content Strategist Review
- **Good**: Perfect encapsulation of the brand philosophy. "AI zonder rook" and "Rustig premium" build immense trust.
- **Actionable Issues**:
  - Inconsistent Pronouns: The About page uses "We" (agency feel), but the Cases page uses "Ik" (freelancer feel). This causes cognitive dissonance. Pick one and stick to it site-wide.
  - The About Page H1 is clunky: "Gebouwd voor merken die digitaal serieuzer willen winnen" is a mouthful. Simplify to "Voor ondernemers die hun website serieus nemen."
  - Overkill Disclaimer (echoing CRO feedback): Stop repeating the defensive portfolio disclaimer everywhere.

### 3. CRO Specialist Review
- **Good**: The Founder Face Reveal is a massive trust accelerator. Contextual CTA on the Cases page is a perfect low-friction next step.
- **Actionable Issues**:
  - Disclaimer Overdose: Repeating "geen resultaatclaim" on every single portfolio card trains the user to doubt your competence. State once that it's a "Design & UX Showcase" and remove it from the individual cards.
  - Missing Third-Party Voice: The About page lacks human testimonials or logos. You need third-party validation to back up your claims.

## ROUND 4: Visibility & Local Landing Pages (`/ai-vindbaarheid`, `/lokale-seo`, `/seo-bureau-leiden`, etc.)

### 1. SEO Specialist Review
- **Good**: Programmatic Scalability using `<LandingRoutePage>` is phenomenal for spinning up targeted pages without router bloat.
- **Actionable Issues**:
  - LocalBusiness Schema: Local pages like `seo-bureau-leiden` must inject `LocalBusiness` schema with NAP data (Name, Address, Phone) to win local packs, not just generic `WebPage` schema.
  - Orphan Page Trap: Ensure all dynamically generated landing pages are linked in the XML sitemap or a footer sitemap so they aren't orphaned.
  - Keyword Cannibalization: Hyper-focus the Leiden page on local intent and link back to the main SEO page to avoid cannibalizing the national ranking.

### 2. Content Strategist Review
- **Good**: "Anti-Marketing Marketing" is 10/10. Calling out spammy duplicate city pages builds incredible trust. Being radically honest about your actual physical location vs target city is great.
- **Actionable Issues**:
  - Acronym Overload: Having separate pages for AEO, GEO, and AI-vindbaarheid might confuse layman target audiences. Consider making `ai-vindbaarheid` a pillar page and folding AEO/GEO underneath it as methods.
  - Too Educational: The `online-marketing-bureau` page reads like a textbook. Agitate the emotional pain points more (e.g. burning ad budget on a leaky website).

### 3. CRO Specialist Review
- **Good**: The Variant System (`local`, `ai`, `search`) creates instant psychological alignment with the searcher. The `directAnswer` blocks capture featured snippet intent perfectly.
- **Actionable Issues**:
  - Trapdoor Secondary CTA: Hardcoding the secondary CTA to `/diensten` rips a user out of their local/specific context. Make it dynamic (e.g., link to local cases from local pages).
  - Primary CTA Intent Mismatch: "Gratis websiteplan" is too heavy for educational, top-of-funnel pages like `geo-optimalisatie`. Use a softer, mid-funnel CTA like "Doe de AI-vindbaarheid check."
  - Generic Local Trust: Don't use a globe icon for local pages. Use a map pin and inject specific local trust signals.
