import { sendMessage } from "../telegram/helpers";
import { Update } from "../telegram/types";

export async function catchUserMessage(update: Update, messageToCatch: string) {
  const userMessage = update.message;

  if (!userMessage || typeof userMessage.text !== "string") return;

  if (userMessage.text.trim().toLowerCase() === messageToCatch.toLowerCase().trim()) {
    await sendMessage(userMessage.chat.id, "Greet");
  }
}
