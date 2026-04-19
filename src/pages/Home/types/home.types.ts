import type { Project, Category } from '../../../types/project.types';

export interface ExtendedProject extends Project {
  total_donations: number;
  calculated_progress: number;
  average_rating: number;
  donations_count: number;
}

export type { Category };
