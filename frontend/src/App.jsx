import { useState } from "react";
import ManifestForm from "./components/ManifestForm";
import AssignmentBoard from "./components/AssignmentBoard";
import { checkVoucher, generateVoucher } from "./utils/api";
import SeatStrip from "./components/SeatStrip";

const INITIAL_FORM = {
  name: "",
  id: "",
  flightNumber: "",
  date: "",
  aircraft: "",
};

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleChange = (field, value) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const checkRes = await checkVoucher(form.flightNumber, form.date);

      if (checkRes.data.exists) {
        setStatus("error");
        setMessage(
          `Vouchers already issued for ${form.flightNumber} on this date.`,
        );
        setResult({
          flightNumber: form.flightNumber,
          date: form.date,
          aircraft: form.aircraft,
          seats: [],
        });
        setLoading(false);
        return;
      }

      const genRes = await generateVoucher({
        name: form.name,
        id: form.id,
        flightNumber: form.flightNumber,
        date: form.date,
        aircraft: form.aircraft,
      });

      setResult({
        flightNumber: form.flightNumber,
        date: form.date,
        aircraft: form.aircraft,
        seats: genRes.data.seats,
      });
      setStatus("success");
    } catch (err) {
      if (err.response?.status === 409) {
        setStatus("error");
        setMessage(
          err.response.data.message ||
            "Vouchers already issued for this flight and date.",
        );
      } else if (err.response?.status === 422) {
        const firstError = Object.values(err.response.data.errors || {})[0];
        setStatus("error");
        setMessage(firstError?.[0] || "Please check the form and try again.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-board-bg text-ink font-body flex items-center">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Seat Assignment
        </h1>
        <p className="text-sm text-muted mb-10">
          Issue 3 unique voucher seats for a promotional flight campaign.
        </p>

        <div className="relative bg-cell rounded-lg shadow-2xl shadow-black/40">
          <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px perforation" />
          <div className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-board-bg" />
          <div className="hidden md:block absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-board-bg" />

          <div className="grid md:grid-cols-2">
            <div className="p-7 md:p-8 md:pr-10">
              <span className="font-display text-[10px] uppercase tracking-[0.25em] text-muted block mb-6">
                Manifest entry
              </span>
              <ManifestForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>

            <div className="p-7 md:p-8 md:pl-10">
              <span className="font-display text-[10px] uppercase tracking-[0.25em] text-muted block mb-6">
                Assignment board
              </span>

              {message && (
                <div
                  className={`animate-in text-sm rounded-md px-3 py-2.5 mb-5 border ${
                    status === "error"
                      ? "bg-alert/10 border-alert/30 text-alert"
                      : "bg-amber/10 border-amber/30 text-amber"
                  }`}
                >
                  {message}
                </div>
              )}

              <AssignmentBoard result={result} status={status} />
              <SeatStrip aircraft={result?.aircraft} seats={result?.seats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
