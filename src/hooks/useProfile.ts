import { useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";
import type { User, UpdateProfilePayload } from "../types/user";

interface UseProfileReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
  updating: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authApi.getProfile();
      setUser(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e?.response?.data?.detail || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<boolean> => {
      try {
        setUpdating(true);
        setError(null);
        const updated = await authApi.updateProfile(payload);
        setUser(updated);
        return true;
      } catch (err: unknown) {
        const e = err as { response?: { data?: { detail?: string } } };
        setError(e?.response?.data?.detail || "Failed to update profile.");
        return false;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, loading, error, refetch: fetchProfile, updateProfile, updating };
};