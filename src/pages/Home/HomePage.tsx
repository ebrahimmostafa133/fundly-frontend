import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHomeData } from './hooks/useHomeData';
import { GooeySearch } from './components/GooeySearch';
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

  const displayProjects: ExtendedProject[] = isFiltering ? filteredProjects : (allProjects as ExtendedProject[]).slice(0, 6);
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
        <ProjectsSection 
          title="Featured Projects"
          subtitle="Hand-picked by our team"
          projects={featured as ExtendedProject[]}
          icon="⭐"
          featured
        />
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
    <section style={{ marginBottom: 64, animation: 'fadeUp .4s ease both' }}>
      <div style={{ position: 'relative', marginBottom: 36 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 100,
            background: PL, border: `1.5px solid ${P}33`,
            marginBottom: 16, fontSize: 12, fontWeight: 700,
            color: PD, letterSpacing: '.5px',
          }}>
            <span style={{ animation: 'floatBob 2.5s ease-in-out infinite', fontSize: 14 }}>💙</span>
            FUNDLY — CROWDFUNDING PLATFORM
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem,5vw,3.4rem)', fontWeight: 800,
            color: '#111827', margin: '0 0 12px', lineHeight: 1.1,
          }}>
            Discover Projects,<br />
            <span style={{
              background: `linear-gradient(135deg, ${PD}, ${P}, #4FD1FF)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Fund Dreams.
            </span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: 16, margin: '0 0 32px', maxWidth: 480 }}>
            Browse campaigns you believe in and help bring ideas to life — one donation at a time.
          </p>

          <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <GooeySearch value={search} onChange={setSearch} />
            <button type="submit" style={{
              padding: '14px 28px', borderRadius: 14,
              background: P, border: 'none', color: '#fff',
              fontWeight: 800, fontSize: 14, cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              whiteSpace: 'nowrap',
            }}>Search →</button>
          </form>
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
    <section style={{ marginBottom: 64, animation: 'fadeUp .4s ease .18s both' }}>
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