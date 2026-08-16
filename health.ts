import { createServer } from "http";

const PORT = Number(process.env.PORT) || 8080;

/** Minimal HTTP server so Elastic Beanstalk health checks succeed. */
export function startHealthServer(): void {
  const server = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Health server listening on port ${PORT}`);
  });
}
