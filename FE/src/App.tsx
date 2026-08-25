import { useEffect, useRef, useState } from "react";
import "./App.css";

interface LogEntry {
  level: "log" | "error" | "warn";
  message: string;
  timestamp: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour12: false });
}

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const es = new EventSource("/logs");

    es.onopen = () => setConnected(true);

    es.onmessage = (e: MessageEvent<string>) => {
      const entry: LogEntry = JSON.parse(e.data);
      setEntries((prev) => [...prev, entry]);
    };

    es.onerror = () => {
      setConnected(false);
    };

    return () => es.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  return (
    <div className="app">
      <header className="header">
        <h1>Chinchilla Bot</h1>
        <span className={`status ${connected ? "status--online" : "status--offline"}`}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </header>

      <main className="log-panel">
        {entries.length === 0 && (
          <p className="empty">Waiting for log entries…</p>
        )}
        {entries.map((entry, i) => (
          <div key={i} className={`log-entry log-entry--${entry.level}`}>
            <span className="log-time">{formatTime(entry.timestamp)}</span>
            <span className="log-level">{entry.level.toUpperCase()}</span>
            <span className="log-message">{entry.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>
    </div>
  );
}
