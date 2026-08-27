import { ServerResponse } from "http";

export interface LogEntry {
  level: "log" | "error" | "warn";
  message: string;
  timestamp: string;
}

const clients = new Set<ServerResponse>();

function broadcast(entry: LogEntry) {
  const data = `data: ${JSON.stringify(entry)}\n\n`;
  for (const client of clients) {
    try {
      client.write(data);
    } catch {
      clients.delete(client);
    }
  }
}

export function addLogClient(res: ServerResponse) {
  clients.add(res);
  res.on("close", () => clients.delete(res));
}

const _log = console.log.bind(console);
const _error = console.error.bind(console);
const _warn = console.warn.bind(console);

console.log = (...args: unknown[]) => {
  _log(...args);
  broadcast({ level: "log", message: args.map(String).join(" "), timestamp: new Date().toISOString() });
};

console.error = (...args: unknown[]) => {
  _error(...args);
  broadcast({ level: "error", message: args.map(String).join(" "), timestamp: new Date().toISOString() });
};

console.warn = (...args: unknown[]) => {
  _warn(...args);
  broadcast({ level: "warn", message: args.map(String).join(" "), timestamp: new Date().toISOString() });
};
