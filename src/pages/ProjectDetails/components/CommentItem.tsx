import { useState, useEffect, useRef } from "react";
import { TbSend, TbCornerDownRight, TbFlag, TbTrash } from "react-icons/tb";
import commentsApi from "../../../api/commentsApi";
import { useProfile } from "../../../hooks/useProfile";
import ConfirmModal from "../../../components/shared/ConfirmModal";
import ReportCommentModal from "./ReportCommentModal";
import { formatTimeAgo } from "../utils/helpers";
import { PRIMARY } from "../utils/constants";
import type { Comment } from "../../../types/comment.types";

interface Props {
  comment: Comment;
  isLoggedIn: boolean;
  onRefresh: () => void;
  delay?: number;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  isLoggedIn,
  onRefresh,
  delay = 0,
  isReply = false,
}: Props) {
  const { user: currentUser } = useProfile();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const author = comment.user;
  const initials =
    `${author?.first_name?.[0] ?? ""}${author?.last_name?.[0] ?? ""}`.toUpperCase() || "?";
  const authorName =
    `${author?.first_name ?? ""} ${author?.last_name ?? ""}`.trim() || "Anonymous";
  const timeAgo = formatTimeAgo(comment.created_at);
  const isOwner = currentUser?.id === comment.user?.id;

  /* Focus input when opened */
  useEffect(() => {
    if (showReplyInput) inputRef.current?.focus();
  }, [showReplyInput]);

  async function handleReply() {
    if (!replyText.trim()) return;
    setReplying(true);

    try {
      await commentsApi.replyToComment(comment.id, replyText.trim());
      setReplyText("");
      setShowReplyInput(false);
      onRefresh();
    } catch {
      // silently fail
    } finally {
      setReplying(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!isOwner) return;

    setDeleting(true);
    try {
      await commentsApi.deleteComment(comment.id);
      setShowDeleteConfirm(false);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setDeleting(false);
    }
  }

  function handleDeleteClick() {
    if (!isOwner) return;
    setShowDeleteConfirm(true);
  }

  function handleReplyKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  }

  return (
    <div
      className={`animate-fadeUp ${isReply ? "ml-8 pl-4 border-l-2 border-primary-100" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${PRIMARY}, #38bdf8)` }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">{authorName}</span>
            <span className="text-xs text-gray-400">{timeAgo}</span>
          </div>

          {/* Body */}
          <p className="text-sm text-gray-600 mt-0.5 break-words">
            {comment.content}
          </p>

          {/* Actions */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 mt-1.5">
              {!isReply && (
                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-xs text-gray-400 hover:text-primary-500 font-medium flex items-center gap-1 transition-colors"
                >
                  <TbCornerDownRight size={13} />
                  Reply
                </button>
              )}
              <button
                onClick={() => setShowReportModal(true)}
                className="text-xs text-gray-400 hover:text-error-500 font-medium flex items-center gap-1 transition-colors"
              >
                <TbFlag size={13} />
                Report
              </button>
              {isOwner && (
                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="text-xs text-gray-400 hover:text-error-500 font-medium flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete this comment"
                >
                  <TbTrash size={13} />
                  Delete
                </button>
              )}
            </div>
          )}

          {/* Reply Input */}
          {showReplyInput && (
            <div className="flex gap-2 mt-2 animate-slideIn">
              <input
                ref={inputRef}
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleReplyKeyDown}
                placeholder="Write a reply..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
              />
              <button
                onClick={handleReply}
                disabled={replying || !replyText.trim()}
                className="bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-lg transition-colors disabled:opacity-40"
              >
                <TbSend size={14} />
              </button>
            </div>
          )}

          {/* Report Modal */}
          {showReportModal && (
            <ReportCommentModal
              commentId={comment.id}
              onClose={() => setShowReportModal(false)}
            />
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDeleteConfirm}
            loading={deleting}
            title="Delete Comment"
            message="Are you sure you want to delete this comment? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            isDanger
          />

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply, idx) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isLoggedIn={isLoggedIn}
                  onRefresh={onRefresh}
                  delay={idx * 0.03}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
