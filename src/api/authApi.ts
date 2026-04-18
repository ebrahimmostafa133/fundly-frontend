import axiosClient from "./axiosInstance";
import type {
  User,
  //UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/user";

const authApi = {
  /* ───── Get profile ───── */
  getProfile: async (): Promise<User> => {
    const response = await axiosClient.get<User>("/auth/profile/");
    return response.data;
  },

  /* ───── Update text profile only ───── */
  updateProfile: async (payload: FormData): Promise<User> => {
  const response = await axiosClient.patch<User>(
    "/auth/profile/",
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
},

  /* ───── Upload profile image ───── */
  uploadProfileImage: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await axiosClient.patch<User>(
      "/auth/profile/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  },

  /* ───── Delete account ───── */
  deleteAccount: async (): Promise<void> => {
    await axiosClient.delete("/auth/profile/delete/");
  },

  /* ───── Change password ───── */
  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<{ detail: string }> => {
    const response = await axiosClient.post(
      "/auth/password/change/",
      payload
    );
    return response.data;
  },

  /* ───── Logout ───── */
  logout: async (refreshToken: string): Promise<void> => {
    await axiosClient.post("/auth/logout/", {
      refresh: refreshToken,
    });
  },
};

export default authApi;
