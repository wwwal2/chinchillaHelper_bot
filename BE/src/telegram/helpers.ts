import { callApi } from "./api";
import { ApiActionEnum, APIError } from "./types";

export async function ignoreOldUpdates() {
  try {
    await callApi(ApiActionEnum.deleteWebhook, { drop_pending_updates: true });
    console.log("Webhook cleared.");
  } catch (err) {
    console.warn("Could not clear webhook:", (err as APIError).message);
  }
}

export async function sendMessage(chatId: number, text: string) {
  return await callApi(ApiActionEnum.sendMessage, { chat_id: chatId, text });
}
