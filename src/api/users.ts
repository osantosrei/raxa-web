import { apiClient } from "@/api/client";
import type { UpdateProfileRequest, UserResponse } from "@/types/api";

export const usersApi = {
  async me(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>("/users/me");
    return response.data;
  },

  async updateMe(data: UpdateProfileRequest): Promise<UserResponse> {
    const response = await apiClient.put<UserResponse>("/users/me", data);
    return response.data;
  },
};
