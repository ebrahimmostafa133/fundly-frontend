import { TbCalendar, TbCategory, TbTag, TbUser } from "react-icons/tb";
import type { Project } from "../../../types/project.types";
import DetailChip from "./DetailChip";

interface ProjectAboutProps {
  project: Project;
}

export default function ProjectAbout({ project }: ProjectAboutProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeUp"
      style={{ animationDelay: "0.1s" }}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-3">
        About this Project
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-100">
        {project.category && (
          <DetailChip icon={<TbCategory size={14} />} label={project.category.name} />
        )}
        {project.tags?.map((tag) => (
          <DetailChip key={tag.id} icon={<TbTag size={14} />} label={tag.name} />
        ))}
        {project.owner && (
          <DetailChip
            icon={<TbUser size={14} />}
            label={
              `${project.owner.first_name ?? ""} ${project.owner.last_name ?? ""}`.trim() ||
              "Creator"
            }
          />
        )}
        <DetailChip
          icon={<TbCalendar size={14} />}
          label={`Ends ${new Date(project.end_time).toLocaleDateString()}`}
        />
      </div>
    </div>
  );
}
