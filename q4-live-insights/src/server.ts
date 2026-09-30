import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import { SignalEngine, TranscriptChunk } from "./engine.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const PORT = 3004;
const engine = new SignalEngine();

const latencySamples: number[] = [];
const activeClients = new Set<WebSocket>();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "q4-live-insights",
    mode: "streaming-simulation"
  });
});

app.get("/metrics", (_req, res) => {
  const sorted = [...latencySamples].sort((a, b) => a - b);

  const percentile = (p: number): number => {
    if (sorted.length === 0) return 0;

    const index = Math.min(
      sorted.length - 1,
      Math.ceil((p / 100) * sorted.length) - 1
    );

    return sorted[index];
  };

  res.json({
    samples: sorted.length,
    p50Ms: percentile(50),
    p95Ms: percentile(95),
    minMs: sorted.length ? sorted[0] : 0,
    maxMs: sorted.length ? sorted[sorted.length - 1] : 0
  });
});

app.post("/events", (req, res) => {
  const chunk = req.body as TranscriptChunk;

  if (
    !chunk ||
    !chunk.callId ||
    typeof chunk.sequence !== "number" ||
    typeof chunk.timestamp !== "number" ||
    !chunk.speaker ||
    typeof chunk.text !== "string" ||
    typeof chunk.confidence !== "number"
  ) {
    res.status(400).json({
      error: "Invalid transcript chunk"
    });
    return;
  }

  const processingStart = performance.now();

  const nudges = engine.process(chunk);

  const processingEnd = performance.now();

  const processingMs = processingEnd - processingStart;

  const ingestToProcessMs = Math.max(
    0,
    Date.now() - chunk.timestamp
  );

  latencySamples.push(ingestToProcessMs);

  const payload = {
    type: "transcript",
    receivedAt: Date.now(),
    processingMs,
    ingestToProcessMs,
    chunk,
    nudges
  };

  broadcast(payload);

  res.json({
    accepted: true,
    nudges,
    processingMs,
    ingestToProcessMs
  });
});

wss.on("connection", (socket) => {
  activeClients.add(socket);

  socket.send(
    JSON.stringify({
      type: "connected",
      message: "Q4 live insights stream connected",
      connectedAt: Date.now()
    })
  );

  socket.on("close", () => {
    activeClients.delete(socket);
  });
});

function broadcast(payload: unknown): void {
  const message = JSON.stringify(payload);

  for (const client of activeClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

server.listen(PORT, () => {
  console.log(`Q4 Live Insights server running on http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`WebSocket stream: ws://localhost:${PORT}/ws`);
  console.log(`Streaming endpoint: POST http://localhost:${PORT}/events`);
});
