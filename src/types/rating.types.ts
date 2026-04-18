export interface Rating {
  id: number;
  user: number;
  project: number;
  value: number;
  created_at: string;
}

export interface RatingsResponse {
  average: number;
  count: number;
  results: Rating[];
}
