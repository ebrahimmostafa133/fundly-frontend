import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TbStarFilled } from 'react-icons/tb';
import { BACKEND_URL } from '../../config';
import type { Project } from '../../types/project.types';

interface Props {
  projects: Project[];
}

export default function ImageSlider({ projects }: Props) {
  const items = useMemo(() => projects.slice(0, 5), [projects]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timerId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(timerId);
  }, [items.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="h-[300px] rounded-2xl border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-500">
        No running projects available now.
      </div>
    );
  }

  const project = items[activeIndex];
  const imageUrl = project.images?.[0]?.image
    ? project.images[0].image.startsWith('http')
      ? project.images[0].image
      : `${BACKEND_URL}${project.images[0].image}`
    : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <Link to={`/projects/${project.id}`} className="block">
        <div className="relative h-[300px] sm:h-[360px]">
          {imageUrl ? (
            <img src={imageUrl} alt={project.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            {project.category && (
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-2">
                {project.category.name}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-bold line-clamp-2">{project.title}</h2>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span>{project.progress ?? 0}% funded</span>
              {project.avg_rating != null && project.avg_rating > 0 && (
                <span className="flex items-center gap-1">
                  <TbStarFilled />
                  {project.avg_rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-gray-800 hover:bg-white"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-gray-800 hover:bg-white"
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full ${index === activeIndex ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
