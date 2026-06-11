import { apiClient } from "@/api/client";
import type { PlayerResponse } from "@/types/api";

export const playersApi = {
  async list(matchId: string): Promise<PlayerResponse[]> {
    const response = await apiClient.get<PlayerResponse[]>(
      `/matches/${matchId}/players`,
    );
    return response.data;
  },

  async join(matchId: string): Promise<void> {
    await apiClient.post(`/matches/${matchId}/join`);
  },

  async leave(matchId: string): Promise<void> {
    await apiClient.delete(`/matches/${matchId}/leave`);
  },
};
