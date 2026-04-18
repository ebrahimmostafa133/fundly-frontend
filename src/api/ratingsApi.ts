import axiosInstance from "./axiosInstance";

const ratingsApi = {
  /** GET /api/ratings/project/:id/ */
  getProjectRatings: async (projectId: number) => {
    const response = await axiosInstance.get(`/ratings/project/${projectId}/`);
    return response.data;
  },

  /** GET /api/ratings/user/:id/ - Get current user's rating for a project */
  getUserRating: async (projectId: number) => {
    const response = await axiosInstance.get(`/ratings/user/${projectId}/`);
    return response.data;
  },

  /** POST /api/ratings/create/ */
  createRating: async (projectId: number, value: number) => {
    const response = await axiosInstance.post("/ratings/create/", {
      project: projectId,
      value,
    });
    return response.data;
  },

  /** PUT /api/ratings/user/:id/ - Update current user's rating for a project */
  updateRating: async (projectId: number, value: number) => {
    const response = await axiosInstance.put(`/ratings/user/${projectId}/`, {
      value,
    });
    return response.data;
  },
};

export default ratingsApi;
