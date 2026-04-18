import { useState } from "react";
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
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleRate(value: number) {
    setSelected(value);
    setSubmitting(true);
    setMsg(null);

    try {
      await ratingsApi.createRating(projectId, value);
      setMsg({ type: "success", text: "Rating submitted!" });
      onRated();
    } catch {
      setMsg({
        type: "error",
        text: "Could not submit rating. You may have already rated this project.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <TbStarFilled size={16} className="text-warning-500" />
        Rate this Project
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
