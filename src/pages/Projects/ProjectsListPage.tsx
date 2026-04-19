import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { projectsApi } from '../../api/projectsApi'
import ProjectCard from '../../components/shared/ProjectCard'
import type { Project, Category } from '../../types/project.types'
import { useProfile } from '../../hooks/useProfile'

export default function ProjectsListPage() {
  const [searchParams] = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [err, setErr] = useState('')
  const [searchText, setSearchText] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [showMineOnly, setShowMineOnly] = useState(false)
  const { user } = useProfile()

  // Initialize filters from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')

    if (categoryParam) {
      setCatFilter(categoryParam)
    }
    if (searchParam) {
      setSearchText(searchParam)
    }
  }, [])

  useEffect(() => {

    const getData = async () => {
      try {
        setIsLoading(true)
        setErr('')

        const res1 = await projectsApi.getProjects({
          search: searchText || undefined,
          category: catFilter || undefined,
          owner: showMineOnly && user ? user.id : undefined,
        })
        const res2 = await projectsApi.getCategories()

        setProjects(res1.data)
        setCats(res2.data)

      } catch {
        setErr('somthing went wrong, try again')
      } finally {
        setIsLoading(false)
      }
    }

    // wait little time before send request so not send on every letter
    const t = setTimeout(getData, 500)
    return () => clearTimeout(t)

  }, [searchText, catFilter, showMineOnly, user?.id])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Explore <span className="text-primary-500">Projects</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Discover campaigns and support what matters.
          </p>
        </div>
        <Link
          to="/projects/create"
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200"
        >
          + Start a Project
        </Link>
      </div>

      {/* search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
        >
          <option value="">All Categories</option>
          {cats.map((cat) => (
            <option key={cat.id} value={cat.slug || cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {user && (
          <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden p-1">
            <button
              onClick={() => setShowMineOnly(false)}
              className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${!showMineOnly ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setShowMineOnly(true)}
              className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${showMineOnly ? 'bg-primary-500 shadow text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Mine
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      )}

      {!isLoading && err && (
        <div className="text-center py-20">
          <p className="text-error-500">{err}</p>
          <button
            onClick={() => setSearchText('')}
            className="mt-3 text-sm text-primary-500 underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !err && projects.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold text-gray-700">No projects found</h2>
          <p className="text-gray-400 text-sm mt-1">Try different search or category.</p>
        </div>
      )}

      {!isLoading && !err && projects.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-5">
            Showing <strong>{projects.length}</strong> project{projects.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}

    </div>
  )
}