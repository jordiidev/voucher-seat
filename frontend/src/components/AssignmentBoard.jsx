function formatBoardDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function Row({ label, value, tone }) {
  const toneClass =
    tone === "alert" ? "text-alert" : tone === "muted" ? "text-muted" : "text-ink";
  return (
    <div className="flex items-baseline justify-between py-3 border-b border-ink/10">
      <span className="font-display text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <span className={`font-mono text-sm ${toneClass}`}>{value}</span>
    </div>
  );
}

export default function AssignmentBoard({ result, status }) {
  const hasResult = Boolean(result);
  const tone = status === "error" ? "alert" : "ink";

  return (
    <div className="rounded-md">
      <Row
        label="Flight"
        value={hasResult ? result.flightNumber : "—"}
        tone={hasResult ? tone : "muted"}
      />
      <Row
        label="Date"
        value={hasResult ? formatBoardDate(result.date) : "—"}
        tone={hasResult ? tone : "muted"}
      />
      <Row
        label="Aircraft"
        value={hasResult ? result.aircraft : "—"}
        tone={hasResult ? tone : "muted"}
      />
      <Row
        label="Status"
        value={status === "error" ? "Duplicate" : status === "success" ? "Assigned" : "Standby"}
        tone={hasResult ? tone : "muted"}
      />

      <div className="pt-4">
        <span className="font-display text-[10px] uppercase tracking-[0.2em] text-muted block mb-2">
          Assigned seats
        </span>
        {result?.seats?.length > 0 ? (
          <div className="flex gap-2">
            {result.seats.map((seat) => (
              <span
                key={seat}
                className="font-mono text-sm text-ink bg-amber/10 border border-amber/30 rounded px-2.5 py-1"
              >
                {seat}
              </span>
            ))}
          </div>
        ) : (
          <span className="font-mono text-sm text-muted">—</span>
        )}
      </div>
    </div>
  );
}