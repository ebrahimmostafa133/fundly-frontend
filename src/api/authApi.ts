import axiosClient from "./axiosInstance";
import type {
  User,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/user";

const authApi = {
  /**
   * GET /auth/profile/
   * Fetch authenticated user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await axiosClient.get<User>("/auth/profile/");
    return response.data;
  },

  /**
   * PATCH /auth/profile/
   * Update user profile
   */
  updateProfile: async (
    payload: UpdateProfilePayload
  ): Promise<User> => {
    const response = await axiosClient.patch<User>(
      "/auth/profile/",
      payload
    );
    return response.data;
  },

  /**
   * DELETE /auth/profile/delete/
   */
  deleteAccount: async (): Promise<void> => {
    await axiosClient.delete("/auth/profile/delete/");
  },

  /**
   * POST /auth/password/change/
   */
  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<{ detail: string }> => {
    const response = await axiosClient.post(
      "/auth/password/change/",
      payload
    );
    return response.data;
  },

  /**
   * POST /auth/logout/
   */
  logout: async (refreshToken: string): Promise<void> => {
    await axiosClient.post("/auth/logout/", {
      refresh: refreshToken,
    });
  },
};

export default authApi;