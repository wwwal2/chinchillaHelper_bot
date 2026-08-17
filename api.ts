import "dotenv/config";
import { ApiActionEnum, APIParams } from "./types";

export const TOKEN = process.env.BOT_TOKEN;

const API = `https://api.telegram.org/bot${TOKEN}`;

export async function callApi(apiAction: ApiActionEnum, params: APIParams[ApiActionEnum]) {
    const res = await fetch(`${API}/${apiAction}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`${apiAction} failed: ${data.description}`);
    }
    return data.result;
    
  }
