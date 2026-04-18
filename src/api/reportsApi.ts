import axiosInstance from "./axiosInstance";

interface ReasonChoice {
  value: string;
  label: string;
}

const reportsApi = {
  /** GET /api/reports/reasons/ */
  getReasonChoices: async (): Promise<ReasonChoice[]> => {
    const response = await axiosInstance.get("/reports/reasons/");
    return response.data;
  },

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
export type { ReasonChoice };
