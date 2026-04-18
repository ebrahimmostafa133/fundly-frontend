import { useState } from "react";
import { Link } from "react-router-dom";
import { TbMessageCircle, TbSend } from "react-icons/tb";
import commentsApi from "../../../api/commentsApi";
import CommentItem from "./CommentItem";
import type { Comment } from "../../../types/comment.types";

interface Props {
  projectId: number;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  isLoggedIn: boolean;
}

export default function CommentsSection({
  projectId,
  comments,
  setComments,
  isLoggedIn,
}: Props) {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAddComment() {
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const created = await commentsApi.addComment(projectId, newComment.trim());
      setComments((prev) => [created, ...prev]);
      setNewComment("");
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  }

  async function refreshComments() {
    try {
      const data = await commentsApi.getProjectComments(projectId);
      setComments(data);
    } catch {
      // silently fail
    }
  }

  return (
    <div>
      {/* Title */}
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TbMessageCircle size={20} className="text-primary-500" />
        Comments
        <span className="text-sm font-normal text-gray-400 ml-1">
          ({comments.length})
        </span>
      </h2>

      {/* Add comment */}
      {isLoggedIn ? (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
          />
          <button
            onClick={handleAddComment}
            disabled={submitting || !newComment.trim()}
            className="bg-primary-500 hover:bg-primary-600 text-white p-2.5 rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center"
          >
            <TbSend size={18} />
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 mb-6 text-center">
          <Link to="/login" className="text-primary-500 font-semibold hover:underline">
            Log in
          </Link>{" "}
          to join the discussion
        </div>
      )}

      {/* List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <TbMessageCircle size={36} className="mx-auto text-gray-200 mb-2" />
          <p className="text-gray-400 text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, idx) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isLoggedIn={isLoggedIn}
              onRefresh={refreshComments}
              delay={idx * 0.05}
            />
          ))}
        </div>
      )}
    </div>
  );
}
