
export interface LogEntry {
    level: "log" | "error" | "warn";
    message: string;
    timestamp: string;
  }