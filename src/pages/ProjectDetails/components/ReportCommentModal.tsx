import { useState } from "react";
import { TbFlag, TbX } from "react-icons/tb";
import reportsApi from "../../../api/reportsApi";

interface Props {
  commentId: number;
  onClose: () => void;
}

export default function ReportCommentModal({ commentId, onClose }: Props) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit() {
    if (!reason.trim()) {
      setMsg("Please provide a reason.");
      return;
    }

    setSubmitting(true);

    try {
      await reportsApi.createReport({ comment: commentId, reason });
      setMsg("Report submitted. Thank you.");
      setTimeout(onClose, 1200);
    } catch {
      setMsg("Failed to submit report.");
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

      {/* Reason */}
      <textarea
        rows={2}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why is this comment inappropriate?"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-error-300 bg-white resize-none"
      />

      {/* Actions */}
      <div className="flex items-center justify-between mt-2">
        {msg && <span className="text-xs text-gray-500">{msg}</span>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="ml-auto px-3 py-1.5 bg-error-500 hover:bg-error-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Report"}
        </button>
      </div>
    </div>
  );
}
