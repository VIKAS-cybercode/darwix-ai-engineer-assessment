import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.KB_BRIDGE_PORT || 3003);
const KB_URL = process.env.KB_URL || "http://localhost:3002";

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "q1-kb-bridge",
    kbUrl: KB_URL
  });
});

app.post("/search", async (req, res) => {
  try {
    const query = String(req.body?.query || "").trim();

    if (!query) {
      return res.status(400).json({
        grounded: false,
        error: "query is required"
      });
    }

    const url = `${KB_URL}/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`KB API returned ${response.status}`);
    }

    const data = await response.json();

    const results = Array.isArray(data.results) ? data.results : [];

    return res.json({
      grounded: results.length > 0,
      query,
      results: results.slice(0, 3).map((item: any) => ({
        source_id: item.source_id,
        title: item.title,
        category: item.category,
        heading: item.heading,
        content: item.content,
        score: item.score
      }))
    });
  } catch (error) {
    console.error(error);

    return res.status(502).json({
      grounded: false,
      error: "Knowledge base unavailable"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Q1 KB bridge running at http://localhost:${PORT}`);
  console.log(`Forwarding to Q2 KB: ${KB_URL}`);
});
