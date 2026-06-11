import { sendMessage } from "./technicalOperations";
import { Update } from "./types";

export async function catchUserMessage(update: Update, messageToCatch: string) {
    const userMessage = update.message;
    if (!userMessage || typeof userMessage.text !== "string") return;
  
    // Reply "Greet" whenever the user types "HI" (case-insensitive).
    if (userMessage.text.trim().toLowerCase() === messageToCatch.toLowerCase().trim()) {
      await sendMessage(userMessage.chat.id, "Greet");
    }
  }