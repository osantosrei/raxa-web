import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { invitesApi } from "@/api/invites";
import { MATCHES_KEY } from "@/hooks/useMatches";

/**
 * Fetches preview data for an invite code.
 *
 * @param code - The invite code to resolve; if falsy the query is not executed.
 * @returns The query result object for the invite preview, containing `data`, `status`, and related query fields.
 */
export function useInvitePreview(code: string) {
  return useQuery({
    queryKey: ["invite", code],
    queryFn: () => invitesApi.resolve(code),
    enabled: Boolean(code),
    staleTime: 1000 * 30,
    retry: false,
  });
}

/**
 * Creates a mutation hook that joins a match using an invite code and refreshes related match queries on success.
 *
 * @returns The React Query mutation object for joining via invite; on success it invalidates the matches list, the specific match, and that match's players cache entries.
 */
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
