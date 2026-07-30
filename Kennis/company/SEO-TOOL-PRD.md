# Product Requirements Document (PRD): Core 30 AI Agent

> **Status — 24 July 2026:** Research/product concept only. No implementation of this product was found in the current checkout. All performance, cost, timing and ranking statements below are targets or source claims, not verified MagisData results. Validate API terms, privacy, publishing safeguards and unit economics before development.

## 1. Objective & Vision

**Product Name:** Core 30 AI Agent. **Vision:** automate parts of a local SEO workflow around GBP-aligned site architecture and localized content. **Core Objective:** generate reviewable page plans and assets at scale without bypassing human fact-checking or publication approval. **Hypotheses to validate:** whether a 30-page architecture is appropriate per client, whether the workflow can finish in about 90 minutes, and whether API cost can remain below $1 per page. No ranking outcome is guaranteed.

## 2. Information Architecture & Layout

**Main Interface / Global Navigation:** A top navigation bar contains the following sequential modules: Overview, Settings, GBP Categories, Crawl, Research, Supp Planner, Geo Planner, Generate, Bulk, Publish, Internal Hubs, Video.

**Client Dashboard (Overview):**

- **KPI Metrics Section:** Pages Generated, Images Generated, Pages Crawled, GBP Services.
    
- **Workflow Phases Grid:**
    
    - _Setup:_ Client Settings, Entity Research.
        
    - _Phase 1:_ Site Crawl & Analysis, Geo Relevance Planner, Content Strategy.
        
    - _Phase 2:_ Bulk Pipeline, WordPress Publish, YouTube Upload.
        

## 3. Core Modules & Features

### 3.1 Settings & Setup

- **Login Flow:** Standard email input interface.
    
- **Client Management:** "New Client" creation button.
    
- **Profile Configuration:**
    
    - Basic Info input: Business Name, Website URL.
        
    - "Auto-Fill From Website" button.
        
    - Business Location & GBP input: Business Address.
        
    - Business Type selection (Service Area vs. Physical Location).
        

### 3.2 Entity Research (GBP Category Audit)

- **Input fields:** Primary GBP Category (e.g., Plumber), City (e.g., Malden).
    
- **Execution:** "Run Category Audit" queries Google Places API for businesses in the specified city.
    
- **Competitor Analysis Output:**
    
    - Calculates total local competitors sharing the primary category.
        
    - Lists secondary categories used by competitors (e.g., Electrician, Heating Contractor) alongside a usage count.
        
    - Highlights categories missing from the client's GBP to identify entity gaps.
        

### 3.3 Gap Analysis (Site Crawl & Research)

- **Data Ingestion:** Text area to copy/paste current GBP categories and services; "Parse" button to extract entities.
    
- **Site Crawler:**
    
    - Crawls the client website to extract page data, headings, schema, internal/external links, and word count.
        
    - UI lists URLs, Title, Word Count, and an AI-assigned "Service/Category".
        
    - **Mapping:** Users can set mapping to "Auto" or manually select the appropriate service/category from a dropdown for each URL.
        
- **Gap Identification (Research Tab):**
    
    - Cross-references parsed GBP entities against crawled website pages.
        
    - Outputs a list of "Missing pages" (e.g., Water tank repair, Water heater installation).
        
    - "Import to Bulk Content Generator" button queues missing pages for creation.
        

### 3.4 Supporting Content Planner (Topical Relevance)

- **Input:** Service Term (e.g., Plumber).
    
- **Scraping Engine:** Pulls data from Google "People Also Ask" (PAA), Reddit threads, local forums, and competitor sites.
    
- **Query Selection:**
    
    - Lists real questions asked by users.
        
    - Displays an AI-generated relevance score (0-100) for each query against the target service.
        
    - Allows inline text editing of scraped questions to refine the angle.
        
    - Checkbox selection and "Send to Bulk Queue" button.
        

### 3.5 Geo Relevance Planner (Geographical Relevance)

- **Data Ingestion:** File upload interface for local rank maps (specifically LeadSnap CSV heatmaps).
    
- **Inputs:** Target Service, City.
    
- **Generation:** "Generate Places" button.
    
- **AI Neighborhood Analysis:**
    
    - Identifies surrounding neighborhoods and their distance/direction from the GBP (e.g., "3.3 mi E").
        
    - Provides strategic text reasoning on why a specific location is targeted (e.g., competitor density, required effort to improve map rank).
        
- **Hyper-Local Target Selection:**
    
    - Pulls specific landmarks (parks, stadiums, municipal buildings) from Google Places API.
        
    - Checkbox selection to exclude irrelevant landmarks (e.g., omitting a yoga studio for a plumbing site).
        
    - "Send to Bulk Content Generator" button.
        

### 3.6 Bulk Content Generator (8-Pass Writing Engine)

This is the core content production system. It utilizes four distinct engine prompts based on page type (Service, Category, Location, Supporting) and applies global "Content Type Guardrails" to keep the AI on track.

- **Pass 1: Research Synthesis:** Compresses raw scraped data (Reddit, PAA, local landmarks) into a structured content brief.
    
- **Pass 2: Strategic Outline:** Maps out page architecture, defining H2 headings and the strategic angle/flow for each section.
    
- **Pass 3: Section Draft:** Executes independent API calls for each H2 section to simulate a human writer taking breaks, resulting in natural tone variations.
    
- **Pass 4: Burstiness:** Rewrites content to vary sentence length, inject fragments, and break predictable AI cadence.
    
- **Pass 5: Perplexity:** Replaces predictable AI vocabulary (e.g., "robust", "leverage", "streamline", "significant improvements") with natural phrasing. Removes em-dashes.
    
- **Pass 6: Human Bookends:** Rewrites the first two and last two sentences using highly conversational, opinionated language optimized for searcher retention and algorithm weighting.
    
- **Pass 7: Conversion:** Injects natural, non-spammy Calls to Action (CTAs) and phone numbers relevant to the specific page context.
    
- **Pass 8: Final Check:** Quality assurance pass to verify adherence to the brief, word counts, formatting rules, and to flag/rewrite any leftover AI patterns.
    
- **Parallel Processing Steps:** Concurrently generates an FAQ Section, Meta Title/Description/H1, Schema/JSON-LD, relevant external links to authority sources, and images using specific prompts.
    

### 3.7 Output, Review, & Deployment

- **Bulk Queue Dashboard:** Displays progress bars for outlines and drafting.
    
- **Export & Review:**
    
    - Shows total pages generated, failed generations, total words, and an average AI detection score (%).
        
    - Individual rows display Word Count, AI Score, Images status, and Video status.
        
    - Options to "Download All DOCX" or download ZIP files of images.
        
- **Video Generation & YouTube Integration:**
    
    - Renders a video script and generates a corresponding video.
        
    - Creates YouTube title, tags, and description.
        
    - Automatically uploads to YouTube.
        
- **WordPress Deployment:** Automatically publishes the finished article, complete with H-tags, table of contents, images, and the embedded YouTube video directly to the client's WordPress site.
    

## 4. Technology Stack (Observed & Inferred)

- **AI/LLM Integration:** Bring Your Own Key (BYOK) integration (explicitly mentions ChatGPT/OpenAI, Claude, and Perplexity logic).
    
- **External APIs:**
    
    - Google Places API (fetching categories and landmark data).
        
    - YouTube API (video upload).
        
    - WordPress REST API (direct publishing).
        
- **Third-Party Integrations:** LeadSnap (CSV heatmap ingestion).
    
- **Export Formats:** DOCX generation, CSV export capabilities.
    
- **Frontend UI:** Web application with dark mode styling, utilizing asynchronous progress bars, tables, and collapsible accordion menus.
