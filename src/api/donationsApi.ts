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

  /**
   * POST /api/donations/donate/:projectId/
   * Donate to a specific project.
   */
  donateToProject: async (projectId: number, amount: number) => {
    const response = await axiosClient.post(`/donations/donate/${projectId}/`, {
      amount,
    });
    return response.data;
  },

  /**
   * GET /api/donations/project/:projectId/
   * Fetch donation summary for a specific project.
   */
  getProjectDonations: async (projectId: number) => {
    const response = await axiosClient.get(`/donations/project/${projectId}/`);
    return response.data;
  },
};

export default donationsApi;