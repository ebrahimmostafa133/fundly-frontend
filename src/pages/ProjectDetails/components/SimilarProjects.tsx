import ProjectCard from "../../../components/shared/ProjectCard";
import type { Project } from "../../../types/project.types";

interface Props {
  projects: Project[];
}

export default function SimilarProjects({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-12 animate-fadeUp" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Similar <span className="text-primary-500">Projects</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.slice(0, 4).map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
