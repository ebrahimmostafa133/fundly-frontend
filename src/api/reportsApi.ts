import axiosInstance from "./axiosInstance";

const reportsApi = {
  /** POST /api/reports/create/ */
  createReport: async (data: {
    project?: number;
    comment?: number;
    reason: string;
  }) => {
    const response = await axiosInstance.post("/reports/create/", data);
    return response.data;
  },
};

export default reportsApi;
