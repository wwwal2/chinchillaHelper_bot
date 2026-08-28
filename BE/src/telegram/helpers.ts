import { callApi } from "./api";
import { ApiActionEnum, APIError } from "./types";

export async function setupWebhook(webhookUrl: string) {
  try {
    await callApi(ApiActionEnum.setWebhook, {
      url: webhookUrl,
      allowed_updates: ["message"],
      drop_pending_updates: true,
    });
    console.log("Webhook registered:", webhookUrl);
  } catch (err) {
    console.warn("Could not register webhook:", (err as APIError).message);
  }
}

export async function sendMessage(chatId: number, text: string) {
  return await callApi(ApiActionEnum.sendMessage, { chat_id: chatId, text });
}
