import { createServer, IncomingMessage, ServerResponse } from "http";
import { addLogClient } from "./logBroadcast";
import { isPaused, pause, resume } from "./botState";
import { ignoreOldUpdates } from "./technicalOperations";

const PORT = Number(process.env.PORT) || 8080;

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

  if (req.url === "/pause" && req.method === "POST") {
    setCorsHeaders(res);
    pause();
    console.log("Bot paused via API.");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ paused: true }));
    return true;
  }

  if (req.url === "/resume" && req.method === "POST") {
    setCorsHeaders(res);
    resume();
    await ignoreOldUpdates();
    console.log("Bot resumed via API.");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ paused: false }));
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
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
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
