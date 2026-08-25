import { createServer } from "http";
import { addLogClient } from "./logBroadcast";

const PORT = Number(process.env.PORT) || 8080;

/** HTTP server for Elastic Beanstalk health checks and the SSE log stream. */
export function startHealthServer(): void {
  const server = createServer((req, res) => {
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
