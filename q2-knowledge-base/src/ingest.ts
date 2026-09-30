import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

type SourceConfig = {
  sourceId: string;
  title: string;
  category: string;
};

const SOURCES: Record<string, SourceConfig> = {
  "loan-product.md": {
    sourceId: "LOAN-001",
    title: "FlexiBiz Business Loan Product",
    category: "product",
  },
  "eligibility-policy.md": {
    sourceId: "LOAN-002",
    title: "Eligibility Policy",
    category: "eligibility",
  },
  "required-documents.md": {
    sourceId: "LOAN-003",
    title: "Required Documents",
    category: "documents",
  },
  "loan-faq.md": {
    sourceId: "LOAN-004",
    title: "Loan FAQ",
    category: "faq",
  },
  "objections.md": {
    sourceId: "LOAN-005",
    title: "Common Objections",
    category: "objections",
  },
  "qualification-rules.md": {
    sourceId: "LOAN-006",
    title: "Qualification Rules",
    category: "qualification",
  },
};

function cleanMarkdown(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

function redactPotentialPii(text: string): string {
  return text
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[REDACTED_EMAIL]"
    )
    .replace(
      /\b(?:\+91[-\s]?)?[6-9]\d{9}\b/g,
      "[REDACTED_PHONE]"
    );
}

type Chunk = {
  content: string;
  heading: string | null;
  chunkIndex: number;
};

function chunkMarkdown(text: string, maxChars = 1200): Chunk[] {
  const lines = text.split("\n");

  const chunks: Chunk[] = [];

  let currentHeading: string | null = null;
  let currentLines: string[] = [];

  function flush() {
    const content = currentLines.join("\n").trim();

    if (!content) {
      currentLines = [];
      return;
    }

    chunks.push({
      content,
      heading: currentHeading,
      chunkIndex: chunks.length,
    });

    currentLines = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/);

    if (headingMatch) {
      flush();
      currentHeading = headingMatch[1].trim();
      currentLines.push(line);
      continue;
    }

    currentLines.push(line);

    if (currentLines.join("\n").length >= maxChars) {
      flush();
    }
  }

  flush();

  return chunks;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing from .env");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  const dataDir = path.resolve(process.cwd(), "../data");

  console.log("📚 Starting knowledge-base ingestion...");
  console.log(`📁 Source directory: ${dataDir}`);

  await client.connect();

  try {
    for (const [fileName, config] of Object.entries(SOURCES)) {
      const filePath = path.join(dataDir, fileName);

      console.log(`\n📄 Processing ${fileName}...`);

      const rawText = await fs.readFile(filePath, "utf8");

      const cleanedText = redactPotentialPii(
        cleanMarkdown(rawText)
      );

      const chunks = chunkMarkdown(cleanedText);

      console.log(`   Source: ${config.sourceId}`);
      console.log(`   Category: ${config.category}`);
      console.log(`   Chunks: ${chunks.length}`);

      const documentResult = await client.query(
        `
        INSERT INTO kb_documents
          (source_id, title, source_type, file_path, version, category)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (source_id)
        DO UPDATE SET
          title = EXCLUDED.title,
          source_type = EXCLUDED.source_type,
          file_path = EXCLUDED.file_path,
          version = EXCLUDED.version,
          category = EXCLUDED.category,
          updated_at = NOW()
        RETURNING id
        `,
        [
          config.sourceId,
          config.title,
          "markdown",
          `data/${fileName}`,
          "1.0",
          config.category,
        ]
      );

      const documentId = documentResult.rows[0].id;

      await client.query(
        `DELETE FROM kb_chunks WHERE document_id = $1`,
        [documentId]
      );

      for (const chunk of chunks) {
        await client.query(
          `
          INSERT INTO kb_chunks
            (
              document_id,
              chunk_index,
              content,
              heading,
              metadata
            )
          VALUES
            ($1, $2, $3, $4, $5)
          `,
          [
            documentId,
            chunk.chunkIndex,
            chunk.content,
            chunk.heading,
            JSON.stringify({
              source_id: config.sourceId,
              title: config.title,
              category: config.category,
              source_file: fileName,
              version: "1.0",
              retrieval_method: "lexical",
              pii_redacted: cleanedText !== rawText,
            }),
          ]
        );
      }

      console.log(`   ✅ Indexed successfully.`);
    }

    const documents = await client.query(`
      SELECT COUNT(*)::int AS count
      FROM kb_documents
    `);

    const chunks = await client.query(`
      SELECT COUNT(*)::int AS count
      FROM kb_chunks
    `);

    console.log("\n======================================");
    console.log("✅ KNOWLEDGE BASE INGESTION COMPLETE");
    console.log("======================================");
    console.log(`Documents: ${documents.rows[0].count}`);
    console.log(`Chunks: ${chunks.rows[0].count}`);
    console.log("Retrieval: lexical / keyword-based");
    console.log("External embedding API: none");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("\n❌ Ingestion failed:");
  console.error(error);
  process.exit(1);
});