import { Link } from "react-router-dom";

interface BreadcrumbProps {
  title: string;
}

export default function Breadcrumb({ title }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-2 text-sm text-gray-400 mb-6 animate-fadeUp"
      style={{ animationDelay: "0s" }}
    >
      <Link to="/projects" className="hover:text-primary-500 transition-colors">
        Projects
      </Link>
      <span>/</span>
      <span className="text-gray-700 font-medium truncate max-w-[200px]">
        {title}
      </span>
    </nav>
  );
}
