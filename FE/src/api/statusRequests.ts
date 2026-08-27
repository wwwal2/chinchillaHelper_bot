import axios from "axios";
import { StatusResponse } from "../types/api";


export async function getStatus(): Promise<StatusResponse> {
  const { data } = await axios.get<StatusResponse>("/status");
  return data;
}

export async function postBotControlAction(paused: boolean): Promise<StatusResponse> {
  const { data } = await axios.post<StatusResponse>("/control", { pause: paused });
  return data;
}
