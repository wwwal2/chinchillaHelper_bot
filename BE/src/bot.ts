import "./logBroadcast";
import { ApiActionEnum, APIError } from "./types";
import { callApi, TOKEN } from "./api";
import { ignoreOldUpdates } from "./technicalOperations";
import { catchUserMessage } from "./features";
import { startHealthServer } from "./health";
import { isPaused, setAbortController } from "./botState";

if (!TOKEN) {
  console.error("Missing BOT_TOKEN");
  process.exit(1);
}

async function main() {
  startHealthServer();
  await ignoreOldUpdates();

  console.log("Bot started. Listening for messages...");

  let offset = 0;

  while (true) {
    if (isPaused()) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const updates = await callApi(ApiActionEnum.getUpdates, { offset, timeout: 300, allowed_updates: ["message"] }, controller.signal);

      for (const update of updates) {
        offset = update.update_id + 1;
        
        const text = update.message?.text;

        if (text) {
          console.log(`Received message: "${text}"`);
        };

        await catchUserMessage(update, "hi");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        console.log("Polling aborted — bot paused.");
        continue;
      }
      console.error("Error in bot file:", (err as APIError).message);
      await new Promise((r) => setTimeout(r, 2000));
    } finally {
      setAbortController(null);
    }
  }
}

main();
