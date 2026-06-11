import "dotenv/config";
import { ApiActionEnum, APIError, APIParams, Update } from "./types";
import { callApi, TOKEN } from "./api";
import { ignoreOldUpdates } from "./technicalOperations";
import { catchUserMessage } from "./features";



if (!TOKEN) {
  console.error("Missing BOT_TOKEN");
  process.exit(1);
}

async function main() {
  await ignoreOldUpdates();

  console.log("Bot started. Listening for messages...");




  let offset = 0;

  while (true) {
    try {
      const updates = await callApi(ApiActionEnum.getUpdates, { offset, timeout: 300, allowed_updates: ["message"] });

      for (const update of updates) {
        offset = update.update_id + 1;
        const text = update.message?.text;
        if (text) console.log(`Received message: "${text}"`);

        await catchUserMessage(update, "hi");
      }
    } catch (err) {
      console.error("Error in bot file:", (err as APIError).message);
      // Brief pause before retrying so we don't hammer the API on failure.
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

main();
