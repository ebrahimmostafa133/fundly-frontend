import { useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";
import type { User } from "../types/user";

interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<boolean>;
  updating: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("access");

    // 🚨 IMPORTANT FIX: stop request if not logged in
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await authApi.getProfile();
      setUser(data);
    } catch (err) {
      setUser(null);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: FormData): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);

      const updated = await authApi.updateProfile(data);
      setUser(updated);

      return true;
    } catch {
      setError("Failed to update profile.");
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    updating,
  };
};