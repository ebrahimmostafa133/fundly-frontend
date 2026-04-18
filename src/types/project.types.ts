export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  created_at?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: Category;
  images: ProjectImage[];
  target: number;
  tags: Tag[];
  start_time: string;
  end_time: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  owner?: any;
  avg_rating: number;
  progress: number;
  status: string;
  is_featured: boolean;
  created_at?: string;
}

export interface ProjectsResponse {
  count: number;
  results: Project[];
}
