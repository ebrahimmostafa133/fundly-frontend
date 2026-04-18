import axios, { type InternalAxiosRequestConfig } from "axios";

/* ─── Public routes that must NEVER carry an Authorization header ─── */
const PUBLIC_ENDPOINTS = [
  "/auth/login/",
  "/auth/register/",
  "/auth/token/refresh/",
  "/auth/password/reset/",
];

const isPublic = (url?: string) =>
  !url || PUBLIC_ENDPOINTS.some((p) => url.includes(p));

/* ─── Axios instance ─── */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ─── Request interceptor ─────────────────────────────────────────── */
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Never attach a token to public endpoints — a stale/expired token
  // causes SimpleJWT to return 401 even on AllowAny views.
  if (isPublic(config.url)) return config;

  const token = localStorage.getItem("access");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ─── Response interceptor — silent token refresh on 401 ─────────── */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const is401       = error.response?.status === 401;
    const alreadyRetried = originalRequest._retry;
    const isRefreshCall  = originalRequest.url?.includes("/auth/token/refresh/");

    if (is401 && !alreadyRetried && !isRefreshCall) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const { data } = await axiosInstance.post("/auth/token/refresh/", {
            refresh,
          });

          // Store the new access token (and rotated refresh if returned)
          localStorage.setItem("access", data.access);
          if (data.refresh) localStorage.setItem("refresh", data.refresh);

          // Retry the original request with the new token
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return axiosInstance(originalRequest);
        } catch {
          // Refresh failed — clear session and redirect to login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
      } else {
        // No refresh token — send to login
        localStorage.removeItem("access");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;