import "dotenv/config";
import { Client } from "pg";

type RetrievedChunk = {
  source_id: string;
  title: string;
  category: string;
  heading: string | null;
  content: string;
  score: number;
};

const STOP_WORDS = new Set([
  "what", "are", "the", "is", "a", "an", "for", "of", "to",
  "and", "or", "can", "i", "do", "does", "how", "much", "may",
  "be", "my", "on", "in", "with", "about", "that", "will",
  "your", "you", "me", "loan"
]);

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9₹]+/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function detectIntent(query: string): string[] {
  const q = query.toLowerCase();

  const categories: string[] = [];

  if (
    q.includes("document") ||
    q.includes("paper") ||
    q.includes("proof") ||
    q.includes("bank statement")
  ) {
    categories.push("documents");
  }

  if (
    q.includes("eligible") ||
    q.includes("eligibility") ||
    q.includes("turnover") ||
    q.includes("minimum") ||
    q.includes("qualify") ||
    q.includes("qualification")
  ) {
    categories.push("eligibility");
  }

  if (
    q.includes("borrow") ||
    q.includes("amount") ||
    q.includes("tenure") ||
    q.includes("loan size") ||
    q.includes("how much")
  ) {
    categories.push("product");
  }

  if (
    q.includes("guarantee") ||
    q.includes("approved") ||
    q.includes("approval") ||
    q.includes("rate") ||
    q.includes("interest") ||
    q.includes("emi")
  ) {
    categories.push("faq");
  }

  if (
    q.includes("don't want") ||
    q.includes("do not want") ||
    q.includes("concern") ||
    q.includes("privacy") ||
    q.includes("share my") ||
    q.includes("financial information") ||
    q.includes("too expensive") ||
    q.includes("too high")
  ) {
    categories.push("objections");
  }

  return categories;
}

function calculateScore(
  query: string,
  heading: string | null,
  content: string,
  category: string
): number {
  const queryWords = normalize(query);
  const contentWords = normalize(content);
  const headingWords = normalize(heading ?? "");

  if (queryWords.length === 0) {
    return 0;
  }

  const contentSet = new Set(contentWords);
  const headingSet = new Set(headingWords);

  let score = 0;

  for (const word of queryWords) {
    if (contentSet.has(word)) {
      score += 1;
    }

    if (headingSet.has(word)) {
      score += 1.5;
    }
  }

  const normalizedQuery = query
    .toLowerCase()
    .replace(/[^a-z0-9₹]+/g, " ")
    .trim();

  const normalizedContent = content
    .toLowerCase()
    .replace(/[^a-z0-9₹]+/g, " ");

  if (
    normalizedQuery.length > 5 &&
    normalizedContent.includes(normalizedQuery)
  ) {
    score += 3;
  }

  // Domain-aware intent boost.
  const intents = detectIntent(query);

  if (intents.includes(category)) {
    score += 4;
  }

  return score / queryWords.length;
}

export async function retrieve(
  query: string,
  topK = 3
): Promise<RetrievedChunk[]> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from .env");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  try {
    const result = await client.query(`
      SELECT
        c.content,
        c.heading,
        d.source_id,
        d.title,
        d.category
      FROM kb_chunks c
      JOIN kb_documents d
        ON d.id = c.document_id
    `);

    const ranked = result.rows
      .map(row => ({
        source_id: row.source_id,
        title: row.title,
        category: row.category,
        heading: row.heading,
        content: row.content,
        score: calculateScore(
          query,
          row.heading,
          row.content,
          row.category
        )
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return ranked;
  } finally {
    await client.end();
  }
}

async function main() {
  const query = process.argv.slice(2).join(" ");

  if (!query) {
    console.error(
      'Usage: npx tsx src/retrieve.ts "your question here"'
    );
    process.exit(1);
  }

  console.log(`\n🔎 Query: ${query}\n`);

  const results = await retrieve(query);

  if (results.length === 0) {
    console.log("No relevant knowledge-base content found.");
    return;
  }

  results.forEach((result, index) => {
    console.log(`--- Result ${index + 1} ---`);
    console.log(`Source: ${result.source_id}`);
    console.log(`Title: ${result.title}`);
    console.log(`Category: ${result.category}`);
    console.log(`Heading: ${result.heading ?? "N/A"}`);
    console.log(`Score: ${result.score.toFixed(3)}`);
    console.log(`Content:\n${result.content}\n`);
  });
}

if (process.argv[1]?.includes("retrieve")) {
  main().catch(error => {
    console.error("❌ Retrieval failed:");
    console.error(error);
    process.exit(1);
  });
}