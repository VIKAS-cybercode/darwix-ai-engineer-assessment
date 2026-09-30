import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { retrieve } from "./retrieve.js";

dotenv.config();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "darwix-q2-knowledge-base",
  });
});

app.get("/search", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required.",
      });
    }

    const results = await retrieve(query);

    res.json({
      success: true,
      query,
      results,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Knowledge base search failed.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Q2 Knowledge Base API running on http://localhost:${PORT}`);
});