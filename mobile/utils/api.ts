import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { Platform } from "react-native";

const API_BASE_URL = process.env.EXPO_PLUBIC_API_URL || "https://x-clone-five-lyart.vercel.app/api";

// this will basically create an authenticated api, pass the token into our headers
export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "User-Agent": "X-Clone-Mobile",
      "X-Arcjet-Allow": "mobile-app",
      "X-App-Platform": Platform.OS,
      "X-App-Version": "1.0.0",
    }
  
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  getUserProfile: (api: AxiosInstance, targetUsername: string) => api.get(`/users/profile/${targetUsername}`),
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", data),
  updateProfileBanner: (api: AxiosInstance, data: any) => api.put("/users/profile/banner", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProfilePicture: (api: AxiosInstance, data: any) => api.put("/users/profile/picture", data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  followUser: (api: AxiosInstance, targetUserId: string) => api.post(`/users/follow/${targetUserId}`),
};

export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) => api.post("/posts", data),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) => api.get(`/posts/user/${username}`),
  likePost: (api: AxiosInstance, postId: string) => api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) => api.delete(`/posts/${postId}`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) => api.post(`/comments/post/${postId}`, { content }),
  deleteComment: (api: AxiosInstance, commentId: string) => api.delete(`/comments/${commentId}`),
  likeComment: (api: AxiosInstance, commentId: string) => api.post(`/comments/${commentId}/like`),
};