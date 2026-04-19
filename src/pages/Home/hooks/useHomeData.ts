import { useState, useEffect } from 'react';
import { projectsApi } from '../../../api/projectsApi';
import type { Category, Project } from '../../../types/project.types';

interface ExtendedProject extends Project {
  total_donations: number;
  calculated_progress: number;
  average_rating: number;
  donations_count: number;
}

export function useHomeData() {
  const [allProjects, setAllProjects] = useState<ExtendedProject[]>([]);
  const [featured, setFeatured] = useState<ExtendedProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projectsByCategory, setProjectsByCategory] = useState<Map<number, ExtendedProject[]>>(new Map());
  const [categoryTotals, setCategoryTotals] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Calculate raised amount from progress and target
  /*const calculateRaisedAmount = (project: any): number => {
    const progress = project.progress || 0;
    const target = project.target || 1;
    return (progress / 100) * target;
  };*/

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        const [projectsRes, featuredRes, categoriesRes] = await Promise.all([
          projectsApi.getProjects(),
          projectsApi.getFeaturedProjects(),
          projectsApi.getCategories(),
        ]);

        let projectsData = projectsRes.data;
        let featuredData = featuredRes.data;
        
        // Handle paginated response if needed
        if (projectsData && projectsData.results) {
          projectsData = projectsData.results;
        }
        if (featuredData && featuredData.results) {
          featuredData = featuredData.results;
        }
        
        if (!Array.isArray(projectsData)) projectsData = [];
        if (!Array.isArray(featuredData)) featuredData = [];
        
        const categoriesList = categoriesRes.data || [];
        if (!Array.isArray(categoriesList)) {
          console.error('Categories is not an array:', categoriesList);
          setError('Invalid categories data');
          setLoading(false);
          return;
        }

        console.log('Projects data sample:', projectsData[0]);

        // Process projects - use progress field from API
        const processedProjects: ExtendedProject[] = projectsData.map((project: any) => {
          // Use progress from API (already a percentage)
          const progress = project.progress || 0;
          const targetAmount = project.target || project.goal || 1;
          // Calculate raised amount from progress percentage
          const raisedAmount = (progress / 100) * targetAmount;
          const averageRating = project.avg_rating || project.average_rating || 0;
          
          return {
            ...project,
            total_donations: raisedAmount,
            donations_count: project.donations_count || 0,
            target: targetAmount,
            progress: progress,
            calculated_progress: progress,
            average_rating: averageRating,
            category: project.category || { id: project.category_id, name: project.category_name || 'Uncategorized' }
          };
        });

        const processedFeatured: ExtendedProject[] = featuredData.map((project: any) => {
          const progress = project.progress || 0;
          const targetAmount = project.target || project.goal || 1;
          const raisedAmount = (progress / 100) * targetAmount;
          const averageRating = project.avg_rating || project.average_rating || 0;
          
          return {
            ...project,
            total_donations: raisedAmount,
            donations_count: project.donations_count || 0,
            target: targetAmount,
            progress: progress,
            calculated_progress: progress,
            average_rating: averageRating,
            category: project.category || { id: project.category_id, name: project.category_name || 'Uncategorized' }
          };
        });

        // Group projects by category and calculate totals
        const projectsByCat = new Map<number, ExtendedProject[]>();
        const catTotals = new Map<number, number>();
        
        categoriesList.forEach((cat: Category) => {
          const catProjects = processedProjects.filter((project: ExtendedProject) => {
            const projectCatId = project.category?.id || (project as any).category_id;
            return projectCatId === cat.id;
          });
          
          if (catProjects.length > 0) {
            // Sort by raised amount (highest first) for the wallet display
            const sortedProjects = [...catProjects].sort((a: ExtendedProject, b: ExtendedProject) => 
              (b.total_donations || 0) - (a.total_donations || 0)
            );
            projectsByCat.set(cat.id, sortedProjects.slice(0, 3));
            
            // Calculate total raised for this category
            const totalRaised = catProjects.reduce((sum: number, project: ExtendedProject) => sum + (project.total_donations || 0), 0);
            catTotals.set(cat.id, totalRaised);
            
            console.log(`Category ${cat.name}: ${catProjects.length} projects, total raised: EGP ${totalRaised.toLocaleString()}`);
          }
        });

        // Log donation data for debugging
        console.log('Processed projects:', processedProjects.map((p: ExtendedProject) => ({
          title: p.title,
          progress: p.progress,
          target: p.target,
          total_donations: p.total_donations,
          average_rating: p.average_rating
        })));

        setProjectsByCategory(projectsByCat);
        setCategoryTotals(catTotals);
        setAllProjects(processedProjects);
        setFeatured(processedFeatured.slice(0, 6));
        setCategories(categoriesList);
        
      } catch (err) {
        console.error('API Error:', err);
        setError('Something went wrong loading homepage data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    allProjects,
    featured,
    categories,
    projectsByCategory,
    categoryTotals,
    loading,
    error
  };
}