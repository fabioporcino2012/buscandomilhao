"use client";

import { useState } from "react";

export function PauseButton() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="pause-control">
      <button
        type="button"
        className={paused ? "button resume" : "button pause"}
        aria-pressed={paused}
        onClick={() => setPaused((current) => !current)}
      >
        {paused ? "Retomar saídas" : "Pausar saídas"}
      </button>
      <small>
        {paused ? "Saídas pausadas. " : ""}
        Entradas e auditoria continuam ativas.
      </small>
    </div>
  );
}
