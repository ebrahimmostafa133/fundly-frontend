import { useState } from "react";
import { TbFlag, TbAlertTriangle } from "react-icons/tb";
import reportsApi from "../../../api/reportsApi";

interface Props {
  projectId: number;
}

export default function ReportProjectSection({ projectId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleReport() {
    if (!reason.trim()) {
      setMsg({ type: "error", text: "Please provide a reason." });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      await reportsApi.createReport({ project: projectId, reason });
      setMsg({ type: "success", text: "Report submitted. Thank you." });
      setReason("");
      setOpen(false);
    } catch {
      setMsg({ type: "error", text: "Failed to submit report." });
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
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe why this project is inappropriate..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-error-300 bg-gray-50 resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { setOpen(false); setReason(""); }}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReport}
              disabled={submitting}
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
