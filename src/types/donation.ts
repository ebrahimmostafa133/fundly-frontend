export interface Donation {
  id: number;
  project: {
    id: number;
    title: string;
    image?: string;
  };
  amount: string;
  created_at: string;
  status?: "completed" | "pending" | "failed";
}

export interface DonationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Donation[];
}