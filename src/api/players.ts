import { apiClient } from "@/api/client";
import type { PlayerResponse } from "@/types/api";

export const playersApi = {
  async list(matchId: string): Promise<PlayerResponse[]> {
    const response = await apiClient.get<PlayerResponse[]>(
      `/matches/${matchId}/players`,
    );
    return response.data;
  },
};
