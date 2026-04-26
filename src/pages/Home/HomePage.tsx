import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHomeData } from './hooks/useHomeData';
import { CategoryWallet } from './components/CategoryWallet';
import { ProjectCard } from './components/ProjectCard';
import { SectionHead } from './components/SectionHead';
import { EmptySlot } from './components/EmptySlot';
import { STYLES, CAT_EMOJIS, P, PD, PL } from './styles/homeStyles';
import type { Category } from '../../types/project.types';
import type { ExtendedProject } from './types/home.types';

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { allProjects, featured, categories, projectsByCategory, categoryTotals, loading, error } = useHomeData();
  
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<ExtendedProject[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Inject styles
  useEffect(() => {
    const id = 'home-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
    return () => document.getElementById(id)?.remove();
  }, []);

  // Read URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catId = params.get('category');
    const searchQuery = params.get('search');
    
    if (catId) setSelectedCategoryId(parseInt(catId, 10));
    if (searchQuery) setSearch(searchQuery);
  }, [location.search]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    if (allProjects.length === 0) return;
    
    let filtered = [...allProjects] as ExtendedProject[];
    
    if (selectedCategoryId) {
      filtered = filtered.filter((p: ExtendedProject) => {
        const projectCatId = p.category?.id || (p as any).category;
        return projectCatId === selectedCategoryId;
      });
    }
    
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter((p: ExtendedProject) => 
        p.title?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProjects(filtered);
    setIsFiltering(!!(selectedCategoryId || search.trim()));
  }, [allProjects, selectedCategoryId, search]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search);
    if (selectedCategoryId) params.set('category', String(selectedCategoryId));
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleCategoryClick = (categoryId: number | null) => {
    const newSelectedId = categoryId === selectedCategoryId ? null : categoryId;
    setSelectedCategoryId(newSelectedId);
    
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search);
    if (newSelectedId) params.set('category', String(newSelectedId));
    navigate(`?${params.toString()}`, { replace: true });
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSearch('');
    navigate('', { replace: true });
  };

  const removeCategoryFilter = () => {
    setSelectedCategoryId(null);
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const removeSearchFilter = () => {
    setSearch('');
    const params = new URLSearchParams();
    if (selectedCategoryId) params.set('category', String(selectedCategoryId));
    navigate(`?${params.toString()}`, { replace: true });
  };

  const displayProjects: ExtendedProject[] = isFiltering 
    ? filteredProjects 
    : (allProjects as ExtendedProject[]).filter(p => !p.is_featured).slice(0, 4);
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div style={{
      maxWidth: 1280, margin: '0 auto', padding: '40px 20px 80px',
      fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#F7FAFC', minHeight: '100vh',
    }}>
      <HeroSection search={search} setSearch={setSearch} onSubmit={handleSearchSubmit} />
      
      {isFiltering && (
        <ActiveFiltersBar 
          selectedCategory={selectedCategory}
          search={search}
          resultCount={filteredProjects.length}
          onClear={clearFilters}
          onRemoveCategory={removeCategoryFilter}
          onRemoveSearch={removeSearchFilter}
        />
      )}

      {!isFiltering && (
        <CategoryWalletsSection 
          projectsByCategory={projectsByCategory}
          categories={categories}
          categoryTotals={categoryTotals}
        />
      )}

      <ProjectsSection 
        title={isFiltering ? 'Filtered Results' : 'Latest Projects'}
        subtitle={isFiltering ? `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found` : 'Fresh campaigns just launched'}
        projects={displayProjects}
        icon={isFiltering ? '🔍' : '✨'}
      />

      {!isFiltering && featured.length > 0 && (
        <div style={{
          background: 'linear-gradient(180deg, transparent 0%, #f0f9ff 50%, transparent 100%)',
          margin: '0 -20px 64px',
          padding: '20px',
          borderRadius: 40,
        }}>
          <ProjectsSection 
            title="Featured Projects"
            subtitle="Hand-picked by our team"
            projects={featured as ExtendedProject[]}
            icon="⭐"
            featured
          />
        </div>
      )}

      <BrowseCategoriesSection 
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryClick={handleCategoryClick}
      />
    </div>
  );
}

// Sub-components
function PageLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '60px 0' }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${PL}`, borderTopColor: P, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>Loading Fundly…</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div style={{
      padding: '20px 24px', borderRadius: 16,
      background: '#fef2f2', border: '1.5px solid #fca5a5',
      color: '#b91c1c', fontSize: 14, fontWeight: 600, marginBottom: 40,
    }}>
      😕 {message}
    </div>
  );
}

function HeroSection({ search, setSearch, onSubmit }: { search: string; setSearch: (v: string) => void; onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="relative mb-20 animate-[fadeUp_0.4s_ease_both] rounded-3xl overflow-hidden bg-primary-700 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531206715517-5c0ba140b4b8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-700/90 to-transparent"></div>
      
      <div className="relative z-10 px-8 py-16 md:py-24 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 text-sm font-semibold tracking-wide uppercase text-primary-50">
          <span className="text-xl">✨</span> Fund Your Future
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Bring creative projects <br className="hidden md:block"/> to life.
        </h1>
        
        <p className="text-lg md:text-xl text-primary-50 mb-10 max-w-2xl font-medium leading-relaxed">
          Join thousands of people funding the next big idea. Whether it's a personal emergency, a community project, or a startup, Fundly helps you make it happen.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl">
          <div className="relative w-full flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for projects, categories, or keywords..." 
              className="w-full pl-11 pr-4 py-4 rounded-xl text-gray-900 bg-white shadow-lg border-2 border-transparent focus:border-primary-500 focus:ring-0 focus:outline-none transition-all font-medium text-[15px]"
            />
          </div>
          <button type="submit" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-900 text-white font-bold text-[15px] hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap">
            Search Projects
          </button>
        </form>
        
        <div className="mt-8 flex items-center gap-6 text-sm font-semibold text-primary-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Trust & Safety
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Secure Payments
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Global Community
          </div>
        </div>
      </div>
    </section>
  );
}

function ActiveFiltersBar({ 
  selectedCategory, 
  search, 
  resultCount, 
  onClear, 
  onRemoveCategory, 
  onRemoveSearch 
}: {
  selectedCategory: Category | undefined;
  search: string;
  resultCount: number;
  onClear: () => void;
  onRemoveCategory: () => void;
  onRemoveSearch: () => void;
}) {
  return (
    <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {selectedCategory && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: PL, borderRadius: 100,
            fontSize: 13, color: PD,
          }}>
            📁 {selectedCategory.name}
            <button onClick={onRemoveCategory} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>
          </span>
        )}
        {search && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: PL, borderRadius: 100,
            fontSize: 13, color: PD,
          }}>
            🔍 "{search}"
            <button onClick={onRemoveSearch} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>×</button>
          </span>
        )}
      </div>
      <button onClick={onClear} style={{
        padding: '8px 16px', background: '#fff', border: '1px solid #e5e7eb',
        borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#6b7280',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        ✕ Clear all filters ({resultCount} results)
      </button>
    </div>
  );
}

function CategoryWalletsSection({ 
  projectsByCategory, 
  categories, 
  categoryTotals 
}: { 
  projectsByCategory: Map<number, ExtendedProject[]>; 
  categories: Category[]; 
  categoryTotals: Map<number, number>;
}) {
  // Convert Map to array properly
  const categoryEntries: [number, ExtendedProject[]][] = Array.from(projectsByCategory.entries());
  
  if (categoryEntries.length === 0) {
    return (
      <section style={{ marginBottom: 64 }}>
        <SectionHead emoji="💼" title="Projects by Category" sub="Each wallet holds top projects from a category" />
        <EmptySlot label="No projects found in any category yet" />
      </section>
    );
  }

  return (
    <section style={{ marginBottom: 64, animation: 'fadeUp .4s ease .1s both' }}>
      <SectionHead emoji="💼" title="Projects by Category" sub="Each wallet holds top projects from a category" />
      <div className="category-wallet-grid">
        {categoryEntries.map((entry, idx: number) => {
          const catId = entry[0];
          const projs = entry[1];
          const category = categories.find((c: Category) => c.id === catId);
          if (!category || projs.length === 0) return null;
          return (
            <CategoryWallet
              key={catId}
              category={category}
              projects={projs}
              totalRaised={categoryTotals.get(catId) || 0}
              index={idx}
            />
          );
        })}
      </div>
    </section>
  );
}

function ProjectsSection({ 
  title, 
  subtitle, 
  projects, 
  icon, 
  featured = false 
}: { 
  title: string; 
  subtitle: string; 
  projects: ExtendedProject[]; 
  icon: string; 
  featured?: boolean;
}) {
  if (projects.length === 0 && !featured) {
    return (
      <section style={{ marginBottom: 64 }}>
        <SectionHead emoji={icon} title={title} sub={subtitle} />
        <EmptySlot label="No projects match your filters" />
      </section>
    );
  }
  if (projects.length === 0) return null;
  
  return (
    <section style={{ marginBottom: featured ? 0 : 64, animation: 'fadeUp .4s ease .18s both' }}>
      <SectionHead emoji={icon} title={title} sub={subtitle} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 20 }}>
        {projects.map((project: ExtendedProject, i: number) => (
          <ProjectCard key={project.id} project={project} index={i} featured={featured} />
        ))}
      </div>
    </section>
  );
}

function BrowseCategoriesSection({ 
  categories, 
  selectedCategoryId, 
  onCategoryClick 
}: { 
  categories: Category[]; 
  selectedCategoryId: number | null; 
  onCategoryClick: (categoryId: number | null) => void;
}) {
  if (categories.length === 0) return null;
  
  return (
    <section style={{ animation: 'fadeUp .4s ease .34s both' }}>
      <SectionHead emoji="🔍" title="Browse by Category" sub="Click to filter projects" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <button
          onClick={() => onCategoryClick(null)}
          className={`cat-pill ${!selectedCategoryId ? 'cat-pill-active' : ''}`}
          style={{
            background: !selectedCategoryId ? P : '#fff',
            color: !selectedCategoryId ? '#fff' : PD,
          }}
        >
          🎯 All Projects
        </button>
        {categories.map((cat: Category, i: number) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className={`cat-pill ${selectedCategoryId === cat.id ? 'cat-pill-active' : ''}`}
            style={{ 
              animationDelay: `${i * 0.04}s`, 
              animation: 'fadeUp .35s ease both',
              background: selectedCategoryId === cat.id ? P : '#fff',
              color: selectedCategoryId === cat.id ? '#fff' : PD,
            }}
          >
            <span style={{ fontSize: 16 }}>{CAT_EMOJIS[i % CAT_EMOJIS.length]}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}