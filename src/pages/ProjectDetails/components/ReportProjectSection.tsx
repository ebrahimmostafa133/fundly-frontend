import { useState, useEffect } from "react";
import { TbFlag, TbAlertTriangle } from "react-icons/tb";
import reportsApi, { type ReasonChoice } from "../../../api/reportsApi";

interface Props {
  projectId: number;
}

export default function ReportProjectSection({ projectId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reasons, setReasons] = useState<ReasonChoice[]>([]);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (open && reasons.length === 0) {
      fetchReasons();
    }
  }, [open]);

  async function fetchReasons() {
    setLoading(true);
    try {
      const data = await reportsApi.getReasonChoices();
      setReasons(data);
    } catch (error) {
      console.error(error);
      setMsg({ type: "error", text: "Failed to load reason options." });
    } finally {
      setLoading(false);
    }
  }

  async function handleReport() {
    if (!reason.trim()) {
      setMsg({ type: "error", text: "Please select a reason." });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      await reportsApi.createReport({ project: projectId, reason });
      setMsg({ type: "success", text: "Report submitted. Thank you." });
      setReason("");
      setOpen(false);
    } catch(error: any) {
      console.log(error)
      let errorText = "Failed to submit report.";
      if (error.response?.data) {
        errorText = error.response.data;
      }
      setMsg({ type: "error", text: errorText });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-error-500 transition-colors"
      >
        <TbFlag size={16} />
        Report this project
      </button>

      {open && (
        <div className="mt-3 animate-slideIn">
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading reasons...</div>
          ) : (
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-error-300 bg-white"
            >
              <option value="">Select a reason</option>
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { setOpen(false); setReason(""); }}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReport}
              disabled={submitting || loading}
              className="px-4 py-2 bg-error-500 hover:bg-error-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <TbAlertTriangle size={14} />
              {submitting ? "Sending..." : "Submit Report"}
            </button>
          </div>
        </div>
      )}

      {msg && (
        <div
          className={`mt-2 px-3 py-2 rounded-xl text-xs animate-popIn ${
            msg.type === "success"
              ? "bg-success-50 text-success-700 border border-success-200"
              : "bg-error-50 text-error-700 border border-error-200"
          }`}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}
