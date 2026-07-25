import FlapCell from "./FlapCell";

export default function FlapRow({ label, value, width, tone = "amber" }) {
  const padded = value.toUpperCase().padEnd(width, " ").slice(0, width);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-display text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <div className="flex gap-[3px]">
        {padded.split("").map((char, i) => (
          <FlapCell key={i} char={char} tone={tone} delay={i * 60} />
        ))}
      </div>
    </div>
  );
}