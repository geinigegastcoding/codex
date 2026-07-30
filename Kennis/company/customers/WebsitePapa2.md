# Magis Data Intelligence (WebsitePapa2)

## 1. Customer Overview
**Company Name:** Magis Data Intelligence
**Owner:** Gerhard Magis, PhD
**Email:** jgmagis@hotmail.com
**Slogan:** "Data die niet ruist, maar richting geeft." / "Data naar beslissingen. Rust in cijfers. Richting in keuzes."

**Profile:**
Gerhard is a Senior Business Consultant and Data Analyst with a PhD in Physics from Universiteit Leiden. He bridges the gap between data and strategy, providing analytical, pragmatic, and result-oriented solutions. He is also a SAS Certified Base Programmer for SAS 9. His approach centers on translating complex data analyses into clear, actionable management information.

**Target Sectors:**
- Zorgorganisaties (Complex performance and capacity questions)
- Verzekeraars en financiële dienstverleners (Risk and portfolio data)
- Overheid en publieke sector (Where policy, execution, and accountability meet)
- Zakelijke dienstverlening (Need for better management information)

---

## 2. Services & Expertise
**Core Services:**
1. **Data-analyse:** Identifying patterns, trends, and anomalies in existing data with a focus on policy, operations, or management.
2. **Managementinformatie:** Developing clear reports and dashboards for better steering, defining clear indicators rather than just producing more numbers.
3. **Risico- en kansenanalyse:** Signaling deviations in processes or policies to identify risks early and discuss concrete improvement opportunities.
4. **Strategisch advies:** Translating insights into concrete actions aligned with organizational goals.
5. **Procesoptimalisatie:** Investigating how information, work processes, and decision-making interact to provide practical improvements.

**Expertise Areas:**
- Data-analyse en statistiek
- Business intelligence en dashboards
- Beleidsanalyse en besluitvorming
- Risico- en kansenidentificatie
- Proces- en prestatieanalyse
- Data naar managementinformatie

**Work Process (Werkwijze):**
1. **Vraag scherp maken** (Determining which decision, performance, or uncertainty needs better support)
2. **Data beoordelen** (Making availability, quality, definitions, and limitations of data explicit)
3. **Analyse uitvoeren** (Investigating relevant patterns, differences, and explanations with quantitative methods)
4. **Vertalen naar sturing** (Converting outcomes into understandable management information, dashboards, or advisory notes)
5. **Bespreken en toepassen** (Discussing results with stakeholders so insights land in choices and working methods)

---

## 3. LinkedIn Recommendations / References
Gerhard is highly regarded by his peers and managers from his time at Zilveren Kruis and Dedimo:
- **Marco Ruiter** (Directeur Strategische Partnerships, Dedimo): "Inhoudelijk sterk, prettig in omgang, en bouwer van complexe tools."
- **Marieke Pronk** (Directeur Health Contracting & Strategisch zorgadviseur): "Zeer gedreven, kritisch waar nodig, maakt complexe analyses begrijpelijk."
- **Guus Mulder** (Business Intelligence Specialist, Zilveren Kruis): "Werkt op hoog analytisch niveau, bouwt complexe breed overdraagbare producten."
- **Paul Wagenaar** (Specialist Digitale contractering, Zilveren Kruis): "Sterk in complexe problemen gestructureerd analyseren."
- **Sander van Ekeren** (Strategische HR Vraagstukken): "Uitstekende data-analist met eigenaarschap en liefde voor complexe vraagstukken."

---

## 4. Technical Project Information
**Project Name:** magis-data-intelligence
**Cloudflare Worker Name:** papawebsite
**Version:** 0.1.0

### Tech Stack:
- **Framework:** Next.js 16.0.0
- **UI:** React 19.0.0, Tailwind CSS 4.1.5 (@tailwindcss/postcss)
- **Language:** TypeScript 5.8.3
- **Deployment:** OpenNext (@opennextjs/cloudflare 1.19.4), Cloudflare Workers (Wrangler 4.86.0)
- **Fonts:** @fontsource/manrope (v5.0.19), @fontsource/space-grotesk (v5.0.18)

### App Structure (Next.js App Router):
- `/cases` - Case studies (Managementdashboards, Kosten en prestaties, etc.)
- `/contact` - Contact page, FAQ about intake and process
- `/diensten` - Detailed breakdown of services
- `/expertise` - The mix of technical analysis and business insight
- `/over-mij` - Gerhard Magis' profile and background
- `/werkwijze` - The 5-step process and collaboration principles
- `site.tsx` - Contains centralized data (nav items, services, credentials, expertise, SVG components)
- `page.tsx` - Contains recommendations and FAQ data for the homepage
- `inner-page-images.ts` - Centralizes stock image URLs used across the inner pages

### Configuration Files

**package.json:**
```json
{
  "name": "magis-data-intelligence",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build && opennextjs-cloudflare build --skipNextBuild",
    "lint": "tsc --noEmit",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "upload": "opennextjs-cloudflare build && opennextjs-cloudflare upload",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  },
  "dependencies": {
    "@fontsource/manrope": "^5.0.19",
    "@fontsource/space-grotesk": "^5.0.18",
    "@opennextjs/cloudflare": "^1.19.4",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.5",
    "@types/node": "^24.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.1.5",
    "typescript": "^5.8.3",
    "wrangler": "^4.86.0"
  }
}
```

**wrangler.jsonc:**
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "papawebsite",
  "compatibility_date": "2026-04-28",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "papawebsite"
    }
  ],
  "images": {
    "binding": "IMAGES"
  }
}
```

**README.md:**
```md
# Magis Data Intelligence

Next.js, TypeScript and Tailwind homepage for Magis Data Intelligence.

## Commands

```bash
npm install
npm run dev
npm run build
```
```
