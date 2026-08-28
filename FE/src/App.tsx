import { useEffect, useState } from "react";
import "./styles/App.css";
import { getStatus, postBotControlAction } from "./api/statusRequests";
import { LogEntry } from "./types/components";
import Header from "./components/Header/Header";
import LogPanel from "./components/LogPanel/LogPanel";

export default function App() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    getStatus()
      .then((data) => setPaused(data.paused))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const es = new EventSource("/logs");

    es.onmessage = (e: MessageEvent<string>) => {
      const entry: LogEntry = JSON.parse(e.data);
      setEntries((prev) => [...prev, entry]);
    };

    return () => es.close();
  }, []);

  async function togglePause() {
    setToggling(true);
    try {
      const data = await postBotControlAction(!paused);
      setPaused(data.paused);
    } catch {
      // keep current state if request failed
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="app">
      <Header paused={paused} toggling={toggling} onToggle={togglePause} />
      <LogPanel entries={entries} />
    </div>
  );
}
