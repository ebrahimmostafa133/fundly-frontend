import type { Project } from "../../../types/project.types";
import { PRIMARY, PRIMARY_DARK } from "../utils/constants";
import RatingDisplay from "./RatingDisplay";
import DonateSection from "./DonateSection";

interface FundingCardProps {
  project: Project;
  progress: number;
  totalFunded: number;
  avgRating: number;
  ratingCount: number;
  projectId: number;
  isLoggedIn: boolean;
  onDonated: () => void;
}

export default function FundingCard({
  project,
  progress,
  totalFunded,
  avgRating,
  ratingCount,
  projectId,
  isLoggedIn,
  onDonated,
}: FundingCardProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeUp"
      style={{ animationDelay: "0.05s" }}
    >
      <h1 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h1>

      {project.status && (
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4 ${
            project.status === "active"
              ? "bg-success-50 text-success-700"
              : project.status === "cancelled"
              ? "bg-error-50 text-error-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-bold text-primary-600">
            {totalFunded.toLocaleString()} EGP
          </span>
          <span className="text-gray-400">
            of {Number(project.target).toLocaleString()} EGP
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})`,
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{progress}% funded</p>
      </div>

      <RatingDisplay avgRating={avgRating} ratingCount={ratingCount} />

      <DonateSection
        projectId={projectId}
        isLoggedIn={isLoggedIn}
        onDonated={onDonated}
      />
    </div>
  );
}
