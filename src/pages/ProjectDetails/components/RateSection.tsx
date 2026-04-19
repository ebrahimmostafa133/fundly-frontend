import { useState, useEffect } from "react";
import { TbStarFilled, TbStar } from "react-icons/tb";
import ratingsApi from "../../../api/ratingsApi";

interface Props {
  projectId: number;
  onRated: () => void;
}

export default function RateSection({ projectId, onRated }: Props) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchUserRating();
  }, [projectId]);

  async function fetchUserRating() {
    try {
      setLoading(true);
      const data = await ratingsApi.getUserRating(projectId);
      if (data.value) {
        setSelected(data.value);
      }
    } catch (error) {
      console.error("Failed to fetch user rating:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRate(value: number) {
    setSelected(value);
    setSubmitting(true);
    setMsg(null);

    try {
      if (selected > 0) {
        // User already has a rating, update it
        await ratingsApi.updateRating(projectId, value);
        setMsg({ type: "success", text: "Rating updated!" });
      } else {
        // Create new rating
        await ratingsApi.createRating(projectId, value);
        setMsg({ type: "success", text: "Rating submitted!" });
      }
      onRated();
    } catch (error: any) {
      let errorText = "Could not submit rating.";
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorText = data;
        } else if (data.detail) {
          errorText = data.detail;
        } else if (data.non_field_errors?.[0]) {
          errorText = data.non_field_errors[0];
        } else if (Array.isArray(data) && data[0]) {
          errorText = data[0];
        }
      }
      setMsg({ type: "error", text: errorText });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <TbStarFilled size={16} className="text-warning-500" />
        {selected > 0 ? "Update Rating" : "Rate this Project"}
      </h3>

      {/* Star buttons */}
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(star)}
            disabled={submitting}
            className="transition-transform duration-150 hover:scale-125 disabled:cursor-not-allowed"
          >
            {star <= (hover || selected) ? (
              <TbStarFilled size={28} className="text-warning-500" />
            ) : (
              <TbStar size={28} className="text-gray-300" />
            )}
          </button>
        ))}

        {(hover > 0 || selected > 0) && (
          <span className="ml-2 text-xs text-gray-500 font-medium animate-popIn">
            {hover || selected} / 5
          </span>
        )}
      </div>

      {selected > 0 && (
        <p className="text-xs text-gray-500 mb-2">
          Your rating: {selected}/5 {hover > 0 && hover !== selected && `→ Change to ${hover}/5`}
        </p>
      )}

      {/* Feedback */}
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
