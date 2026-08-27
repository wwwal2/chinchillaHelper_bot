import { createServer, IncomingMessage, ServerResponse } from "http";
import { addLogClient } from "./logBroadcast";
import { isPaused, pause, resume } from "../botState";
import { ignoreOldUpdates } from "../telegram/helpers";

const PORT = Number(process.env.PORT) || 8080;

function readJson<T>(req: IncomingMessage): Promise<T | null> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
    req.on("end", () => {
      try { resolve(JSON.parse(body) as T); }
      catch { resolve(null); }
    });
    req.on("error", () => resolve(null));
  });
}

function setCorsHeaders(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function handleBotControl(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  if (req.url === "/status" && req.method === "GET") {
    setCorsHeaders(res);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ paused: isPaused() }));
    return true;
  }

  if (req.url === "/control" && req.method === "POST") {
    setCorsHeaders(res);
    const body = await readJson<{ pause: boolean }>(req);
    if (body === null || typeof body.pause !== "boolean") {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: 'Body must be { "pause": true|false }' }));
      return true;
    }
    if (body.pause) {
      pause();
      console.log("Bot paused via API.");
    } else {
      resume();
      await ignoreOldUpdates();
      console.log("Bot resumed via API.");
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ paused: body.pause }));
    return true;
  }

  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return true;
  }

  return false;
}

/** HTTP server for Elastic Beanstalk health checks and the SSE log stream. */
export function startHealthServer(): void {
  const server = createServer(async (req, res) => {
    if (await handleBotControl(req, res)) return;

    if (req.url === "/logs") {
      setCorsHeaders(res);
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });
      res.flushHeaders();
      addLogClient(res);
      return;
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Health server listening on port ${PORT}`);
  });
}
