import axiosInstance from "./axiosInstance";
import type { User, ChangePasswordPayload } from "../types/user";

/* ─── Token storage helpers ─── */
export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

/* ═══════════════════════ Auth API ═══════════════════════ */
const authApi = {

  /* ── Login ── */
  login: async (email: string, password: string): Promise<User> => {
    const { data } = await axiosInstance.post("/auth/login/", {
      email,
      password,
    });
    saveTokens(data.tokens.access, data.tokens.refresh);
    return data.user as User;
  },

  /* ── Register ── */
  register: async (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    confirm_password: string;
    phone: string;
  }): Promise<{ message: string; user: User }> => {
    const { data } = await axiosInstance.post("/auth/register/", payload);
    return data;
  },

  /* ── Get profile ── */
  getProfile: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>("/auth/profile/");
    return data;
  },

  /* ── Update profile (text fields + optional picture) ──
     IMPORTANT: do NOT set Content-Type manually.
     Let the browser set multipart/form-data with the correct
     boundary automatically — without it Django can't parse the file.  */
  updateProfile: async (payload: FormData): Promise<User> => {
    const { data } = await axiosInstance.patch<User>(
      "/auth/profile/",
      payload,
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );
    return data;
  },

  /* ── Upload profile picture only ── */
  uploadProfileImage: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    const { data } = await axiosInstance.patch<User>(
      "/auth/profile/",
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );
    return data;
  },

  /* ── Delete account ── */
  deleteAccount: async (password: string): Promise<void> => {
    await axiosInstance.delete("/auth/profile/delete/", {
      data: { password },
    });
    clearTokens();
  },

  /* ── Change password ── */
  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<{ message: string }> => {
    const { data } = await axiosInstance.post(
      "/auth/password/change/",
      payload
    );
    return data;
  },

  /* ── Logout ── */
  logout: async (): Promise<void> => {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      try {
        await axiosInstance.post("/auth/logout/", { refresh });
      } catch {
        // swallow — we clear tokens regardless
      }
    }
    clearTokens();
  },

  /* ── Token refresh (used internally by interceptor) ── */
  refreshToken: async (): Promise<string> => {
    const refresh = localStorage.getItem("refresh");
    const { data } = await axiosInstance.post("/auth/token/refresh/", {
      refresh,
    });
    saveTokens(data.access, data.refresh ?? refresh ?? "");
    return data.access;
  },
};

export default authApi;