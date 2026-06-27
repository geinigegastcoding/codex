# Product Requirement Document (PRD): The Ultimate Magisdata Dashboard

## 1. Objective & Vision
The **Magisdata Personal Dashboard** is a local, highly-advanced, JARVIS-inspired admin interface for Daniel Magis. It serves as the ultimate "God Mode" command center, housing Magisdata business pipelines, school projects, personal to-dos, and financial tracking. It is designed to look visually stunning (Neon Cyan, dark mode, terminal aesthetics) as a high-end showcase for social media, while remaining minimal, fast, and local-first under the hood.

## 2. Information Architecture & Layout
- **Main Hub**: A central overview featuring the active visual vault graph, high-level telemetry, and quick-glance metrics.
- **Dedicated Views**: Clean, separate tabs/views for `Magisdata`, `School`, `Personal`, and `Financials`.
- **Command Input**: Terminal-first aesthetic where typing commands (e.g., 'add', 'demo') triggers actions.
- **Global AI Assistant (RAG)**: A persistent, retractable sidebar/drawer containing an AI chat that uses the entire `Kennis` vault as context to answer questions about clients, school, and notes instantly.

## 3. Core Modules & Features

### A. The Kennis Vault Visualizer (The "Flex")
1. **2D Network (Default)**: Functional force-directed graph showing actual links between markdown files.
2. **3D Mode Toggle**: Switch to a 3D particle network (Three.js) for a deeper, JARVIS-like data view.
3. **Demo Mode**: Typing "demo" on the 3D page triggers a highly stylized, cinematic network animation designed specifically for LinkedIn/social media.

### B. Productivity & Progress Tracking
- **Task Management**: Parses `#school`, `#todo` tags from `.md` files. Includes quick-add commands.
- **Focus Engine**: A global Pomodoro timer that dims the dashboard to enforce focus, logging sessions to the vault.
- **Progress Visualizations**: GitHub-style "Daily Habits" heatmap, plus custom trackers and cool graphs for university grades and personal goals.

### C. Financial & Business Metrics
- **Local Revenue Tracking**: Parses MRR, pipeline value, and manual bills directly from local `.md` financial notes. Keeps data absolutely private and zero-dependency.

### D. System Telemetry & Environmental Data
- **Command Center Vibes**: Live widgets displaying local weather, a sleek digital clock, and real-time system stats (CPU/RAM usage) to complete the "hacker" aesthetic.

### E. The "Zero-Digital" Lead Generator
- **Goal**: Find local businesses missing a website and auto-generate a custom pitch.
- **Implementation**: Uses a completely free method (e.g., local browser automation or free-tier APIs) to verify missing `website` tags and generates a structured PDF pitch.

## 4. Technology Stack
- **Framework**: Next.js (App Router) + TypeScript.
- **Styling & UI**: Tailwind CSS, Framer Motion (buttery smooth micro-animations), Recharts for cool progress graphs.
- **Visualization**: `react-force-graph` (2D), `react-three-fiber` (3D).
- **Data Layer**: Local file-system parsing (`fs`, `gray-matter`). Zero external databases. %% ponytail: local MD parsing for ultimate privacy and YAGNI %%

## 5. Next Steps
1. Wait for the final UI reference image from the founder.
2. Bootstrap the Next.js application in `E:\MData\dashboard`.
3. Set up the global UI shell (Dark mode, Neon Cyan accents, telemetry widgets, sidebar).
4. Implement the local Markdown parsing API.

---
%% ponytail: updated with advanced AI, financial, and productivity modules from phase 2 grill-me session %%
