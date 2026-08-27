import { useEffect, useRef } from "react";
import { LogEntry } from "../../types/components";
import "./LogPanel.css";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour12: false });
}

interface Props {
  entries: LogEntry[];
}

export default function LogPanel({ entries }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  return (
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
  );
}
