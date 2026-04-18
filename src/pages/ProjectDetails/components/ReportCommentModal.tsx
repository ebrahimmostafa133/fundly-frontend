import { useState, useEffect } from "react";
import { TbFlag, TbX } from "react-icons/tb";
import reportsApi, { type ReasonChoice } from "../../../api/reportsApi";

interface Props {
  commentId: number;
  onClose: () => void;
}

export default function ReportCommentModal({ commentId, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reasons, setReasons] = useState<ReasonChoice[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchReasons();
  }, []);

  async function fetchReasons() {
    setLoading(true);
    try {
      const data = await reportsApi.getReasonChoices();
      setReasons(data);
    } catch (error) {
      console.error(error);
      setMsg("Failed to load reason options.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!reason.trim()) {
      setMsg("Please select a reason.");
      return;
    }

    setSubmitting(true);

    try {
      await reportsApi.createReport({ comment: commentId, reason });
      setMsg("Report submitted. Thank you.");
      setTimeout(onClose, 1200);
    } catch (error: any) {
      // Extract error message from backend
      let errorText = "Failed to submit report.";
      if (error.response?.data) {
        errorText = error.response.data;
      }
      setMsg(errorText);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 animate-popIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
          <TbFlag size={13} className="text-error-500" />
          Report Comment
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <TbX size={16} />
        </button>
      </div>

      {/* Reason Dropdown */}
      {loading ? (
        <div className="text-xs text-gray-500 py-2">Loading reasons...</div>
      ) : (
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-error-300 bg-white"
        >
          <option value="">Select a reason</option>
          {reasons.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-2">
        {msg && <span className="text-xs text-gray-500">{msg}</span>}
        <button
          onClick={handleSubmit}
          disabled={submitting || loading}
          className="ml-auto px-3 py-1.5 bg-error-500 hover:bg-error-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Report"}
        </button>
      </div>
    </div>
  );
}
