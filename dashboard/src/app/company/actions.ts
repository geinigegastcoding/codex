"use server";

import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const KENNIS_DIR = 'E:/MData/Kennis';

export async function getCompanyData() {
  try {
    const statusContent = await fs.readFile(path.join(KENNIS_DIR, 'Status.md'), 'utf-8');
    const businessDataContent = await fs.readFile(path.join(KENNIS_DIR, 'Business_Data.md'), 'utf-8').catch(() => '');

    // Parse Next Actions from Status.md
    const nextActionsSection = statusContent.split('## Next Actions')[1]?.split('##')[0] || '';
    const tasks = nextActionsSection
      .split('\n')
      .filter(line => line.trim().match(/^\d+\.\s/))
      .map((line, idx) => ({
        id: idx + 1,
        text: line.replace(/^\d+\.\s(\*\*[^*]+\*\*:\s)?/, '').trim(),
        done: false,
        tag: line.includes('Marketing') ? 'Marketing' : line.includes('Technical') ? 'Technical' : 'Business'
      }));

    // Helper to extract value from list items
    const extractListValue = (key: string) => {
      const match = businessDataContent.match(new RegExp(`-\\s+${key}:\\s+(.+)`));
      return match ? match[1].trim() : "0";
    };

    // Helper to parse markdown tables
    const parseTable = (sectionHeader: string) => {
      const section = businessDataContent.split(`## ${sectionHeader}`)[1]?.split('##')[0];
      if (!section) return [];
      const lines = section.trim().split('\n').filter(l => l.startsWith('|'));
      if (lines.length < 3) return []; // header, divider, data
      const keys = lines[0].split('|').map(s => s.trim()).filter(Boolean);
      return lines.slice(2).map(line => {
        const values = line.split('|').map(s => s.trim()).filter(Boolean);
        return keys.reduce((obj, key, i) => ({ ...obj, [key.toLowerCase()]: values[i] }), {});
      });
    };

    const trajectory = extractListValue("Revenue Trajectory").split(',').map(Number);

    return {
      tasks,
      financials: {
        mrr: Number(extractListValue("Monthly Revenue")),
        cashFlow: Number(extractListValue("Cash Flow")),
        profitMargin: Number(extractListValue("Profit Margin")),
        revenueGrowth: Number(extractListValue("Revenue Growth")),
        leadToCustomer: Number(extractListValue("Lead to Customer Rate")),
        cpa: Number(extractListValue("CPA")),
        roi: Number(extractListValue("ROI")),
        trajectory: trajectory.length > 0 ? trajectory : [0,0,0,0,0,0,0,0,0,0,0,0]
      },
      funnel: {
        visitors: Number(extractListValue("Visitors")),
        captured: Number(extractListValue("Captured")),
        qualified: Number(extractListValue("Qualified")),
        proposals: Number(extractListValue("Proposals")),
        closed: Number(extractListValue("Closed")),
      },
      clients: parseTable("Clients"),
      projects: parseTable("Projects"),
      seo: {
        averagePosition: extractListValue("Average Position"),
        positionChange: extractListValue("Position Change"),
        aiCitationScore: extractListValue("AI Citation Score"),
        missingEntities: extractListValue("Missing Entities"),
        rankings: parseTable("SEO Rankings")
      },
      leads: {
        toReview: parseTable("Leads To Review"),
        toSend: parseTable("Leads To Send")
      }
    };
  } catch (error) {
    console.error("Error fetching company data:", error);
    return null;
  }
}

export async function scanLeadUrl(url: string) {
  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const start = Date.now();
    const res = await fetch(targetUrl, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Magisdata Bot' }
    });
    
    if (!res.ok) {
      return { url: targetUrl, error: `Failed to fetch: ${res.status}` };
    }

    const html = await res.text();
    const loadTime = Date.now() - start;
    const $ = cheerio.load(html);

    // Analyze SEO issues
    const issues = [];
    let score = 100;

    if (!$('title').text()) {
      issues.push("Missing Title Tag");
      score -= 20;
    }
    
    if (!$('meta[name="description"]').attr('content')) {
      issues.push("Missing Meta Description");
      score -= 15;
    }

    if (!$('script[type="application/ld+json"]').length) {
      issues.push("Missing Local Schema (JSON-LD)");
      score -= 25;
    }

    if (loadTime > 2000) {
      issues.push(`Slow Load Time (${loadTime}ms)`);
      score -= 10;
    }

    if (!$('meta[name="viewport"]').length) {
      issues.push("Not Mobile Responsive");
      score -= 30;
    }

    const h1Count = $('h1').length;
    if (h1Count === 0) {
      issues.push("Missing H1 Tag");
      score -= 10;
    } else if (h1Count > 1) {
      issues.push("Multiple H1 Tags");
      score -= 5;
    }

    return {
      url: targetUrl,
      score: Math.max(0, score),
      issues,
      loadTime,
      title: $('title').text() || 'No Title'
    };
  } catch (error) {
    return { url, error: (error as Error).message };
  }
}

export async function checkBrokenLinks(url: string) {
  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const res = await fetch(targetUrl, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Magisdata Bot' }
    });
    
    if (!res.ok) throw new Error("Failed to load page");

    const html = await res.text();
    const $ = cheerio.load(html);
    const links = new Set<string>();

    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && (href.startsWith('http') || href.startsWith('/'))) {
        if (href.startsWith('/')) {
          const baseUrl = new URL(targetUrl);
          links.add(`${baseUrl.origin}${href}`);
        } else {
          links.add(href);
        }
      }
    });

    const results = [];
    const ArrayLinks = Array.from(links).slice(0, 10); // Limit to 10 for performance

    for (const link of ArrayLinks) {
      try {
        const linkRes = await fetch(link, { method: 'HEAD' });
        if (linkRes.status >= 400) {
          results.push({ url: link, status: linkRes.status.toString(), source: targetUrl });
        }
      } catch (e) {
        results.push({ url: link, status: "Error", source: targetUrl });
      }
    }

    return results;
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function syncExternalData() {
  try {
    const businessDataPath = path.join(KENNIS_DIR, 'Business_Data.md');
    let content = await fs.readFile(businessDataPath, 'utf-8');
    let updated = false;

    // 1. Google Analytics 4 (GA4)
    if (process.env.GA4_PROPERTY_ID && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
      const analyticsDataClient = new BetaAnalyticsDataClient();
      
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${process.env.GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
      });
      
      const visitorsCount = response?.rows?.[0]?.metricValues?.[0]?.value || '0';
      content = content.replace(/- Visitors: \d+/, `- Visitors: ${visitorsCount}`);
      updated = true;
      console.log(`GA4 Synced: ${visitorsCount} visitors`);
    }

    // 2. Stripe MRR
    if (process.env.STRIPE_SECRET_KEY) {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' as any });
      
      const subscriptions = await stripe.subscriptions.list({ status: 'active' });
      let mrr = 0;
      subscriptions.data.forEach(sub => {
        const amount = sub.items.data[0]?.price?.unit_amount || 0;
        const interval = sub.items.data[0]?.price?.recurring?.interval;
        if (interval === 'month') mrr += amount / 100;
        if (interval === 'year') mrr += (amount / 100) / 12;
      });

      content = content.replace(/- Monthly Revenue: \d+/, `- Monthly Revenue: ${Math.round(mrr)}`);
      updated = true;
      console.log(`Stripe Synced: €${Math.round(mrr)} MRR`);
    }

    if (updated) {
      await fs.writeFile(businessDataPath, content, 'utf-8');
      return { success: true, message: "Data synced successfully from external APIs!" };
    } else {
      return { success: false, message: "No external API keys found. Add GA4_PROPERTY_ID or STRIPE_SECRET_KEY to .env" };
    }
  } catch (error) {
    console.error("Sync error:", error);
    return { success: false, error: (error as Error).message };
  }
}
