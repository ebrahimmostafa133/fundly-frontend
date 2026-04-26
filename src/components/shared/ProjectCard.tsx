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
    <Link to={`/projects/${project.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">

        <div className="h-48 bg-gray-50 relative overflow-hidden shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
              No Image Available
            </div>
          )}
          {project.category && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                {project.category.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-[17px] font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {project.title}
          </h3>

          <div className="mt-auto pt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="font-extrabold text-lg text-primary-600">
                {Number(project.target || 0).toLocaleString()} <span className="text-sm font-semibold text-gray-500">EGP</span>
              </span>
              <span className="font-bold text-sm text-gray-700">{progress}%</span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
              <span>{Math.floor(Math.random() * 50 + 1)} days left</span>
              
              {project.avg_rating != null && project.avg_rating > 0 && (
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-full">
                  <TbStarFilled size={12} />
                  <span className="font-bold text-yellow-700">{project.avg_rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}