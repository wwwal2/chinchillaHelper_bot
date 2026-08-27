import "./Header.css";

interface Props {
  paused: boolean;
  toggling: boolean;
  onToggle: () => void;
}

export default function Header({ paused, toggling, onToggle }: Props) {
  return (
    <header className="header">
      <h1>B-Bot polling</h1>
      <span className={`status ${paused ? "status--offline" : "status--online"}`}>
        {paused ? "Bot paused" : "Bot running"}
      </span>
      <button
        className={`btn-toggle ${paused ? "btn-toggle--resume" : "btn-toggle--pause"}`}
        onClick={onToggle}
        disabled={toggling}
      >
        {toggling ? "…" : paused ? "Resume" : "Pause"}
      </button>
    </header>
  );
}
