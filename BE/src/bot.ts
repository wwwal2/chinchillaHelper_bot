import "./server/logBroadcast";
import { TOKEN } from "./telegram/api";
import { setupWebhook } from "./telegram/helpers";
import { startHealthServer } from "./server/httpServer";

if (!TOKEN) {
  console.error("Missing BOT_TOKEN");
  process.exit(1);
}

const WEBHOOK_URL = process.env.WEBHOOK_URL;
if (!WEBHOOK_URL) {
  console.error("Missing WEBHOOK_URL");
  process.exit(1);
}

async function main() {
  startHealthServer();
  await setupWebhook(WEBHOOK_URL!);
  console.log("Bot started. Waiting for webhook updates...");
}

main();
