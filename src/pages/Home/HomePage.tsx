import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../../api/projectsApi';
import type { Category, Project } from '../../types/project.types';
import CategoryCard from '../../components/shared/CategoryCard';
import ImageSlider from '../../components/shared/ImageSlider';
import ProjectCard from '../../components/shared/ProjectCard';

export default function HomePage() {
  const navigate = useNavigate();

  const [topRatedProjects, setTopRatedProjects] = useState<Project[]>([]);
  const [latestProjects, setLatestProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setErrorText('');

        const [topRatedRes, latestRes, featuredRes, categoriesRes] = await Promise.all([
          projectsApi.getTopRatedProjects(),
          projectsApi.getProjects(),
          projectsApi.getFeaturedProjects(),
          projectsApi.getCategories(),
        ]);

        setTopRatedProjects(topRatedRes.data ?? []);
        setLatestProjects((latestRes.data ?? []).slice(0, 5));
        setFeaturedProjects((featuredRes.data ?? []).slice(0, 5));
        setCategories((categoriesRes.data ?? []).slice(0, 12));
      } catch {
        setErrorText('Something went wrong while loading homepage data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = searchText.trim();
    if (!value) return;
    navigate(`/projects?search=${encodeURIComponent(value)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to <span className="text-primary-500">Fundly</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Discover projects, donate, and help bring ideas to life.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by project title or tag..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary-500 text-white font-semibold px-5 py-2.5 hover:bg-primary-600 transition-colors"
          >
            Search
          </button>
        </form>
      </section>

      {isLoading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          Loading homepage data...
        </div>
      )}

      {!isLoading && errorText && (
        <div className="rounded-2xl border border-error-200 bg-error-50 p-4 text-error-700 text-sm">
          {errorText}
        </div>
      )}

      {!isLoading && !errorText && (
        <>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Top Rated Running Projects</h2>
            <ImageSlider projects={topRatedProjects} />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Latest Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {latestProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
