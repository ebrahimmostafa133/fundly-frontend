import axiosInstance from "./axiosInstance";

export const projectsApi = {
  getProjects: (params?: {
    category?: string;
    tag?: string;
    search?: string;
  }) => {
    return axiosInstance.get("/projects/", { params });
  },

  getTopRatedProjects: () => {
    return axiosInstance.get("/projects/top-rated/");
  },

  getFeaturedProjects: () => {
    return axiosInstance.get("/projects/featured/");
  },

  getProject: (id: number) => {
    return axiosInstance.get(`/projects/${id}/`);
  },

  createProject: (data: FormData) => {
    return axiosInstance.post("/projects/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateProject: (id: number, data: FormData) => {
    return axiosInstance.put(`/projects/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getCategories: () => {
    return axiosInstance.get("/projects/categories/");
  },

  getTags: () => {
    return axiosInstance.get("/projects/tags/");
  },

  cancelProject: (id: number) => {
    return axiosInstance.post(`/projects/${id}/cancel/`);
  },

  getSimilarProjects: (id: number) => {
    return axiosInstance.get(`/projects/${id}/similar/`);
  },
};
