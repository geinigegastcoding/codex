# Decisions

Decisions made during the development of Magisdata, including their rationale and when to revisit them.

**Last consolidated:** 24 July 2026. A proposal or council verdict is not a decision unless explicitly adopted and reflected in active work.

## Log of Decisions

### 2026-07-24: Evidence-Based Knowledge Vault
- **Decision**: Mark unknown metrics as unknown, separate concepts from implementations, and use repository-relative paths because the repository moves between machines.
- **Rationale**: Placeholder numbers and `E:\MData` links had become misleading in the Linux/laptop checkout.
- **Revisit**: When an automated, source-attributed data sync is operational.

### 2026-07-24: Sales OS Before Broad Dashboard Expansion
- **Decision**: Treat `CRM/` as the current operational MVP and validate its lead queue/next-action workflow before adding Gmail or reviving the broad dashboard.
- **Rationale**: The CRM code is present and buildable; the historical `dashboard/` source is absent.
- **Revisit**: After real-prospect usage demonstrates the workflow and persistence requirements.

### 2026-07-11: Akal Bakkerij Remains a Demo Pending Confirmation
- **Decision**: Keep the implemented single-page site as a demo until the preferred trading name, business facts, image rights and customer approval are confirmed.
- **Rationale**: Source research conflicts between Akal/Azal naming and includes third-party imagery and time-sensitive data.
- **Revisit**: Before publication or customer presentation.

### 2026-06-30: Single-Language Sitemap
- **Decision**: Omit redundant language alternates from the Dutch-only sitemap.
- **Rationale**: The alternates added unnecessary XHTML output and the site has no alternate-language routes.
- **Revisit**: If a second language launches.

### 2026-06-28: Remove Deprecated AI Service Routes
- **Decision**: Remove the old AI automation/infrastructure service pages and return 410 for permanently removed routes.
- **Rationale**: The offering and navigation no longer supported those pages.
- **Revisit**: Only if a clearly defined replacement offer is approved.

### 2026-06-27: Consent-First Analytics
- **Decision**: Default analytics consent/storage to denied while keeping the Google tag discoverable through Consent Mode.
- **Rationale**: Preserve consent-first behavior and reliable tag initialization.
- **Revisit**: Whenever analytics tooling, consent requirements or deployment headers change.

### 2026-06-26: Global Session Logging Skill
- **Decision**: Created the global `end-conversation` skill to automate logging of chat sessions.
- **Rationale**: Automates log creation, saving time and ensuring consistent formatting (`YYYY-MM-DD - [Brief Topic].md`) in the `Kennis/logs/` folder.
- **Revisit**: Re-evaluate if logging needs change or new metadata is required.

### 2026-06-26: Leiden-First SEO Strategy (Plumbers & Barbers Focus)
- **Decision**: Focus SEO efforts on Leiden-region commercial intent first, targeting small local businesses like plumbers and barbers.
- **Rationale**: Plumbers and barbers have high local search intent and clear, straightforward conversion goals, making them excellent initial clients to prove Magisdata's value and generate revenue quickly.
- **Revisit**: Once first 1-2 local clients are acquired.

### 2026-06-26: Zero-Glow & High-Trust Brand Design
- **Decision**: Avoid any glowing design elements (e.g., neon shadows, radial orbs) and fake testimonials/reviews.
- **Rationale**: Aligns with a calm, engineered, premium, and trustworthy brand identity.
- **Revisit**: Permanent brand guideline.

### 2026-06-26: Vibecoding & Financial-Driven Execution
- **Decision**: Align business building and AI cooperation with a "vibecoding" mindset, optimizing for fast momentum, simple structures, and direct path to making money.
- **Rationale**: Keeps energy high, reduces analysis paralysis, and maintains focus on immediate revenue generation.
- **Revisit**: Ongoing alignment.

### 2026-06-26: Brain/Executor Collaboration Model
- **Decision**: Formally adopt the Brain/Executor division of labor between Daniel Magis and AI assistants.
- **Rationale**: Daniel provides the strategic direction and product decisions, while the AI executes the technical coding, build checks, and implementations. This leverages the unique strengths of both parties.
- **Revisit**: Continuous evaluation of teamwork efficiency.

### 2026-06-26: Standardized Product Packages and Pricing Models
- **Decision**: Document and align all plans with the active yearly prices maintained in `Website/app/diensten/pricing-data.tsx` (Website plans, Visibility plans, AI Automation, and Growth Consulting).
- **Rationale**: Ensures the knowledge base is synchronized with the live website products and commercial offerings.
- **Revisit**: Whenever pricing or product features are updated.

### 2026-06-26: Optimized Website Sales Client Template
- **Decision**: Refocused and optimized the `Client Template.md` note specifically for website package sales (Start/Groei/Autoriteit), assets gathering, design vibe, and technical launch checklists.
- **Rationale**: Directly aligns the template structure with Magisdata's primary revenue driver (selling websites to small local businesses).
- **Revisit**: After the first 3 website launches.

### 2026-06-26: Local Lead Auditor & Dashboard Proposal
- **Decision**: Keep a technical proposal for a local business dashboard and AI-powered lead auditor; it was not approved as immediate implementation scope.
- **Rationale**: Provides a cutting-edge technical strategy that directly accelerates lead generation and client acquisition.
- **Revisit**: As soon as the main website technical hygiene tasks are completed.

### 2026-06-26: Vault-First Markdown File Rule
- **Decision**: Default general context notes to the repository's `Kennis/` vault, resolving the actual workspace path per machine.
- **Rationale**: Ensures all project context and documentation are centralized in the Obsidian vault rather than scattered across code folders.
- **Revisit**: Permanent workflow rule.

### 2026-06-26: Brainstorm & Design First Dashboard Roadmap (superseded)
- **Decision**: Adopted a roadmap for the dashboard project that prioritizes feature brainstorming and user-flow design (using Google Flow) before executing any coding steps.
- **Rationale**: Aligns with the strategic partner model, ensuring features are thoroughly designed and aligned with Daniel's vision before implementation begins.
- **Revisit**: Superseded by the 2026-07-24 Sales OS decision unless the historical dashboard is restored.


## Related Links
- [[Readme]]
- [[Status]]
- [[progress]]
- [[Dashboard and AI Ideas]]

%% ponytail: documented website-sales template optimization and local auditor roadmap %%
