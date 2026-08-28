export enum ApiActionEnum {
  sendMessage = "sendMessage",
  getUpdates = "getUpdates",
  deleteWebhook = "deleteWebhook",
  setWebhook = "setWebhook",
}

export interface APIParams {
  [ApiActionEnum.sendMessage]: { chat_id: number; text: string };
  [ApiActionEnum.getUpdates]: { offset?: number; timeout?: number; allowed_updates?: string[] };
  [ApiActionEnum.deleteWebhook]: { drop_pending_updates?: boolean };
  [ApiActionEnum.setWebhook]: { url: string; allowed_updates?: string[]; drop_pending_updates?: boolean };
}

export interface Update {
  update_id: number;
  message?: Message;
}

export interface Message {
  message_id: number;
  from: User;
  chat: Chat;
  text?: string;
  date: number;
}

export interface Chat {
  id: number;
  title: string;
  username: string;
  type: string;
}

export interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
}

export interface APIError {
  message: string;
}
