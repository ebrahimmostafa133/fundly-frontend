import { Link } from "react-router-dom";

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FAFC] gap-4">
      <div className="text-error-500 bg-error-50 border border-error-200 p-4 rounded-xl text-sm">
        {message}
      </div>
      <Link
        to="/projects"
        className="text-sm text-primary-500 font-semibold hover:underline"
      >
        ← Back to Projects
      </Link>
    </div>
  );
}
