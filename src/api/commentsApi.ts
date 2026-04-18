import axiosInstance from "./axiosInstance";
import type { Comment } from "../types/comment.types";

const commentsApi = {
  /** GET /api/comments/project/:id/ */
  getProjectComments: async (projectId: number): Promise<Comment[]> => {
    const response = await axiosInstance.get<Comment[]>(
      `/comments/project/${projectId}/`
    );
    return response.data;
  },

  /** POST /api/comments/project/:id/ */
  addComment: async (
    projectId: number,
    content: string
  ): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(
      `/comments/project/${projectId}/`,
      { content }
    );
    return response.data;
  },

  /** POST /api/comments/:id/reply/ */
  replyToComment: async (
    commentId: number,
    content: string
  ): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(
      `/comments/${commentId}/reply/`,
      { content }
    );
    return response.data;
  },

  /** DELETE /api/comments/:id/ */
  deleteComment: async (commentId: number): Promise<void> => {
    await axiosInstance.delete(`/comments/${commentId}/`);
  },
};

export default commentsApi;
