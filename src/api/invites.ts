import { apiClient } from "@/api/client";
import type { InvitePreviewResponse, MatchResponse } from "@/types/api";

export const invitesApi = {
  async resolve(code: string): Promise<InvitePreviewResponse> {
    const response = await apiClient.get<InvitePreviewResponse>(
      `/invites/${code}/resolve`,
    );
    return response.data;
  },

  async join(code: string): Promise<MatchResponse> {
    const response = await apiClient.post<MatchResponse>(
      `/invites/${code}/join`,
    );
    return response.data;
  },
};
