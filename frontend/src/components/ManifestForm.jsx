import { AIRCRAFT_OPTIONS } from "../utils/seatLayout";

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-display text-[11px] uppercase tracking-[0.2em] text-muted mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ManifestForm({ form, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Crew name">
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Sarah Amelia"
          className="field-input"
        />
      </Field>

      <Field label="Crew ID">
        <input
          type="text"
          required
          value={form.id}
          onChange={(e) => onChange("id", e.target.value)}
          placeholder="98123"
          className="field-input font-mono"
        />
      </Field>

      <div className="grid grid-cols-2 gap-5">
        <Field label="Flight no.">
          <input
            type="text"
            required
            value={form.flightNumber}
            onChange={(e) => onChange("flightNumber", e.target.value.toUpperCase())}
            placeholder="GA102"
            className="field-input font-mono"
          />
        </Field>

        <Field label="Flight date">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="field-input font-mono [color-scheme:light]"
          />
        </Field>
      </div>

      <Field label="Aircraft type">
        <select
          required
          value={form.aircraft}
          onChange={(e) => onChange("aircraft", e.target.value)}
          className="field-input appearance-none"
        >
          <option value="" disabled>Select aircraft</option>
          {AIRCRAFT_OPTIONS.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </Field>

      <button type="submit" disabled={loading} className="ticket-button">
        <span>{loading ? "Generating" : "Generate vouchers"}</span>
        <span className="ticket-button-divider" />
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}