import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { invitesApi } from "@/api/invites";
import { MATCHES_KEY } from "@/hooks/useMatches";

export function useInvitePreview(code: string) {
  return useQuery({
    queryKey: ["invite", code],
    queryFn: () => invitesApi.resolve(code),
    enabled: Boolean(code),
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useJoinViaInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invitesApi.join,
    onSuccess: (match) => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
      queryClient.invalidateQueries({ queryKey: [...MATCHES_KEY, match.id] });
      queryClient.invalidateQueries({
        queryKey: [...MATCHES_KEY, match.id, "players"],
      });
    },
  });
}
