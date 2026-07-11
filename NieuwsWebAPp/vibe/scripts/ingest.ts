import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables (e.g., from .env.local)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const parser = new Parser();

// Load taxonomy
const taxonomyPath = path.resolve(process.cwd(), 'scripts', 'taxonomy.json');
const taxonomyRules: Record<string, string[]> = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

const FEEDS = [
  { name: 'NOS Nieuws', url: 'https://feeds.nos.nl/nosnieuwsalgemeen' },
  { name: 'NOS Politiek', url: 'https://feeds.nos.nl/nosnieuwspolitiek' },
  { name: 'RTL Nieuws', url: 'https://www.rtlnieuws.nl/rss/feed.xml' },
  { name: 'RTL Z', url: 'https://www.rtlnieuws.nl/rss/rtlz/feed.xml' },
  { name: 'Tweakers', url: 'http://feeds.feedburner.com/tweakers/mixed' },
  { name: 'NU.nl', url: 'https://www.nu.nl/rss/Algemeen' },
  { name: 'Rijksoverheid', url: 'https://www.rijksoverheid.nl/actueel/nieuws/rss' },
];

/**
 * Strips HTML tags from a string
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Determines tags for an article based on its title and description
 */
function tagArticle(title: string, description: string): string[] {
  const content = `${title} ${description}`.toLowerCase();
  const matchedTags = new Set<string>();

  for (const [tag, keywords] of Object.entries(taxonomyRules)) {
    for (const keyword of keywords) {
      // Basic word boundary match (can be improved with regex \b)
      if (content.includes(keyword.toLowerCase())) {
        matchedTags.add(tag);
        break; // Match found for this tag, move to next tag
      }
    }
  }

  // Always add a generic "news" tag
  matchedTags.add('news');
  return Array.from(matchedTags);
}

/**
 * Generates a consistent hash to prevent duplicates
 */
function generateHash(title: string, url: string): string {
  return crypto.createHash('sha256').update(`${title}|${url}`).digest('hex');
}

async function ingest() {
  console.log("Starting RSS Ingestion...");
  const articlesToInsert = [];

  for (const feed of FEEDS) {
    try {
      console.log(`Fetching: ${feed.name}`);
      const parsedFeed = await parser.parseURL(feed.url);

      for (const item of parsedFeed.items) {
        if (!item.title || !item.link) continue;

        const description = stripHtml(item.contentSnippet || item.content || '');
        const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
        const hash = generateHash(item.title, item.link);
        const tags = tagArticle(item.title, description);

        // Simple heuristic for breaking news
        const isBreaking = item.title.toLowerCase().includes('breaking') || item.title.toLowerCase().includes('nu live');

        articlesToInsert.push({
          source_name: feed.name,
          title: item.title,
          description: description.substring(0, 500), // Trim to a reasonable length
          url: item.link,
          published_at: publishedAt,
          tags: tags,
          is_breaking: isBreaking,
          content_hash: hash,
        });
      }
    } catch (error) {
      console.error(`Failed to fetch ${feed.name}:`, error);
    }
  }

  console.log(`Found ${articlesToInsert.length} articles across all feeds. Upserting to Supabase...`);

  // We use ON CONFLICT to ignore duplicates based on content_hash
  const { data, error } = await supabase
    .from('articles')
    .upsert(articlesToInsert, { onConflict: 'content_hash', ignoreDuplicates: true })
    .select();

  if (error) {
    console.error("Error upserting articles:", error);
  } else {
    console.log(`Successfully processed batch. ${data?.length || 0} new articles inserted.`);
  }

  console.log("Ingestion completed.");
}

// Run the ingestion
ingest().catch(console.error);
