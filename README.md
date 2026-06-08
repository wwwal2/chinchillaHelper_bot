# Chinchilla — Minimal Telegram Bot

A tiny Telegram bot written in **plain Node.js** with **no frameworks and no dependencies**.
It uses the built-in `fetch` and Telegram's long-polling `getUpdates` API.

When you send **`HI`** (any casing), the bot replies **`Greet`**.

## Requirements

- Node.js 18 or newer (for the built-in global `fetch`)

## Setup

1. Create a bot and get a token from [@BotFather](https://t.me/BotFather).
2. Provide the token via the `BOT_TOKEN` environment variable.

## Run

Windows (PowerShell):

```powershell
$env:BOT_TOKEN="YOUR_TOKEN_HERE"
node bot.js
```

macOS / Linux:

```bash
BOT_TOKEN="YOUR_TOKEN_HERE" node bot.js
```

Then open Telegram, message your bot `HI`, and it will reply `Greet`.
