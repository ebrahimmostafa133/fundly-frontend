import type { User } from "./user";

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug?: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  created_at?: string;
}

/**
 * Main Project Type
 * NOTE:
 * Backend is inconsistent, so we keep some fields optional
 * to avoid runtime/type mismatch issues.
 */
export interface Project {
  id: number;
  title: string;
  description: string;

  category: Category;
  images: ProjectImage[];

  tags: Tag[];

  target: number;

  start_time: string;
  end_time: string;

  owner?: Partial<User> | null;

  avg_rating: number;
  progress: number;
  status: string;
  is_featured: boolean;

  created_at?: string;

  /**
   * Funding fields (backend may use different names)
   */
  total_donations?: number;
  raised_amount?: number;
  goal?: number;

  /**
   * Optional convenience fields (if backend ever adds them)
   */
  currency?: string;
}

/**
 * API Response for project list endpoints
 */
export interface ProjectsResponse {
  count: number;
  results: Project[];
}