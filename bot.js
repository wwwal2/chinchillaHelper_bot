
require("dotenv").config();

const TOKEN = process.env.BOT_TOKEN;
console.log('TOKEN:', TOKEN)
if (!TOKEN) {
  console.error("Missing BOT_TOKEN");
  process.exit(1);
}

const API = `https://api.telegram.org/bot${TOKEN}`;

async function callApi(method, params) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`${method} failed: ${data.description}`);
  }
  return data.result;
}

function sendMessage(chatId, text) {
  return callApi("sendMessage", { chat_id: chatId, text });
}

async function handleUpdate(update) {
  const message = update.message;
  if (!message || typeof message.text !== "string") return;

  // Reply "Greet" whenever the user types "HI" (case-insensitive).
  if (message.text.trim().toLowerCase() === "hi") {
    await sendMessage(message.chat.id, "Greet");
  }
}

async function main() {
  // Remove any webhook so long-polling works correctly.
  try {
    await callApi("deleteWebhook", { drop_pending_updates: true });
    console.log("Webhook cleared.");
  } catch (err) {
    console.warn("Could not clear webhook:", err.message);
  }

  console.log("Bot started. Listening for messages...");
  let offset = 0;

  while (true) {
    try {
      const updates = await callApi("getUpdates", { offset, timeout: 30 });
      for (const update of updates) {
        offset = update.update_id + 1;
        const text = update.message?.text;
        if (text) console.log(`Received message: "${text}"`);
        await handleUpdate(update);
      }
    } catch (err) {
      console.error("Error:", err.message);
      // Brief pause before retrying so we don't hammer the API on failure.
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

main();
