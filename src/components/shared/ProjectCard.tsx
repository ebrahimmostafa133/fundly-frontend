import { Link } from 'react-router-dom';
import type { Project } from '../../types/project.types';
import { TbStarFilled } from "react-icons/tb";
import { BACKEND_URL } from '../../config';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const progress = project.progress ?? 0;

  // build the image url django returns a relative path like /media/...
  const imageUrl = project.images?.[0]?.image
    ? project.images[0].image.startsWith('http')
      ? project.images[0].image
      : `${BACKEND_URL}${project.images[0].image}`
    : null;

  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">


        <div className="h-44 bg-gray-100 overflow-hidden shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
              No Image
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">

          {project.category && (
            <span className="text-xs font-semibold text-primary-500 uppercase mb-1">
              {project.category.name}
            </span>
          )}

          <h3 className="text-base font-bold text-gray-800 line-clamp-2 mb-3">
            {project.title}
          </h3>

          <div className="mt-auto">
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
              <div
                className="bg-primary-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span className="font-medium text-primary-600">{progress}% funded</span>
              <span>{Number(project.target || 0).toLocaleString()} EGP</span>
            </div>

            {project.avg_rating != null && project.avg_rating > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-warning-500">
                <span><TbStarFilled /></span>
                <span>{project.avg_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
}