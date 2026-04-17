import axiosClient from "./axiosInstance";
import type { DonationsResponse } from "../types/donation";

const donationsApi = {
  /**
   * GET /api/donations/my-donations/
   * Fetch all donations made by the authenticated user.
   */
  getMyDonations: async (): Promise<DonationsResponse> => {
    const response = await axiosClient.get<DonationsResponse>("/donations/my-donations/");
    return response.data;
  },
};

export default donationsApi;