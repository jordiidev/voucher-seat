import { useEffect, useState } from "react";

export default function FlapCell({ char, tone = "amber", delay = 0 }) {
  const [display, setDisplay] = useState(char);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (char === display) return;
    const startTimer = setTimeout(() => {
      setFlipping(true);
      const swapTimer = setTimeout(() => {
        setDisplay(char);
        setFlipping(false);
      }, 160);
      return () => clearTimeout(swapTimer);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [char]);

  const toneClass =
    tone === "alert" ? "text-alert" : tone === "muted" ? "text-muted" : "text-amber";

  return (
    <span className="flap-cell">
      <span className={`flap-face ${flipping ? "flap-flipping" : ""} ${toneClass}`}>
        {display === " " ? "\u00A0" : display}
      </span>
    </span>
  );
}