export enum ApiActionEnum {
  sendMessage = "sendMessage",
  getUpdates = "getUpdates",
  deleteWebhook = "deleteWebhook",
}

export interface APIParams {
  [ApiActionEnum.sendMessage]: { chat_id: number; text: string };
  [ApiActionEnum.getUpdates]: { offset?: number; timeout?: number };
  [ApiActionEnum.deleteWebhook]: { drop_pending_updates?: boolean };
}

export interface Update {
  update_id: number;
  message?: Message;
}

export interface Message {
  chat: { id: number };
  text?: string;
}

export interface APIError {
  message: string;
}