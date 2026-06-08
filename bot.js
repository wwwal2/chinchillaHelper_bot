// Minimal Telegram bot in plain Node.js (no frameworks, no dependencies).
// Requires Node.js 18+ (uses the built-in global fetch).
// Run with: node bot.js   (set BOT_TOKEN first, see README.md)

// const TOKEN = process.env.BOT_TOKEN;
const TOKEN = "8603670056:AAGZEpE2RpUZV-WpjEWmQBKQBgtAaPNe6W4";

if (!TOKEN) {
  console.error("Missing BOT_TOKEN. Set it before running, e.g.:");
  console.error('  Windows PowerShell:  $env:BOT_TOKEN="123:abc"; node bot.js');
  console.error('  macOS/Linux:         BOT_TOKEN="123:abc" node bot.js');
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
  console.log("Bot started. Listening for messages...");
  let offset = 0;

  while (true) {
    try {
      const updates = await callApi("getUpdates", { offset, timeout: 30 });
      for (const update of updates) {
        offset = update.update_id + 1;
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
