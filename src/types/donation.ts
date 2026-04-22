export interface Donation {
  id: number;
  project_title: string;
  project_id: number;
  amount: string;
  created_at: string;
}

export interface DonationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Donation[];
}