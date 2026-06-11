import { apiClient } from "@/api/client";
import type { CreateMatchRequest, MatchResponse } from "@/types/api";

export const matchesApi = {
  async list(): Promise<MatchResponse[]> {
    const response = await apiClient.get<MatchResponse[]>("/matches");
    return response.data;
  },

  async get(id: string): Promise<MatchResponse> {
    const response = await apiClient.get<MatchResponse>(`/matches/${id}`);
    return response.data;
  },

  async create(data: CreateMatchRequest): Promise<MatchResponse> {
    const response = await apiClient.post<MatchResponse>("/matches", data);
    return response.data;
  },

  async cancel(id: string): Promise<void> {
    await apiClient.delete(`/matches/${id}`);
  },
};
