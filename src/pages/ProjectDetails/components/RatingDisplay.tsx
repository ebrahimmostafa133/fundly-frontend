import { TbStarFilled, TbStar } from "react-icons/tb";

interface Props {
  avgRating: number;
  ratingCount: number;
}

export default function RatingDisplay({ avgRating, ratingCount }: Props) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-warning-500">
            {star <= Math.round(avgRating) ? (
              <TbStarFilled size={18} />
            ) : (
              <TbStar size={18} />
            )}
          </span>
        ))}
      </div>

      <span className="text-sm font-semibold text-gray-800">
        {avgRating > 0 ? avgRating.toFixed(1) : "—"}
      </span>

      <span className="text-xs text-gray-400">
        ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
      </span>
    </div>
  );
}
