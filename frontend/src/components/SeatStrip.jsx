import { AIRCRAFT_LAYOUTS } from "../utils/seatLayout";

export default function SeatStrip({ aircraft, seats }) {
  const layout = AIRCRAFT_LAYOUTS[aircraft];
  if (!layout) return null;

  const rows = seats.map((s) => parseInt(s, 10));

  return (
    <div className="pt-1">
      <div className="relative h-10 flex items-center">
        <div className="absolute left-0 right-0 h-px bg-muted/25" />
        {rows.map((row, i) => {
          const pct = ((row - 1) / (layout.rows - 1)) * 100;
          return (
            <div
              key={i}
              style={{ left: `${pct}%` }}
              className="absolute -translate-x-1/2"
            >
              <div className="w-2 h-2 rounded-full bg-amber shadow-[0_0_5px_1px_rgba(184,135,58,0.35)]" />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] font-mono text-muted tracking-widest">
        <span>NOSE</span>
        <span>TAIL</span>
      </div>
    </div>
  );
}