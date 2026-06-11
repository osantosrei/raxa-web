import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { playersApi } from "@/api/players";
import { MATCHES_KEY } from "@/hooks/useMatches";

/**
 * Fetches and caches the players for a match using React Query.
 *
 * @param matchId - Match identifier used to fetch players; the query will not run if this is falsy.
 * @returns The React Query result object containing `data` (players list), `status`, `error`, and related fields.
 */
export function usePlayers(matchId: string) {
  return useQuery({
    queryKey: [...MATCHES_KEY, matchId, "players"],
    queryFn: () => playersApi.list(matchId),
    enabled: Boolean(matchId),
    staleTime: 1000 * 15,
  });
}

/**
 * Creates a React Query mutation that joins the specified match and refreshes related match data.
 *
 * @param matchId - The identifier of the match to join
 * @returns A mutation object which, when executed, joins the match and invalidates the match details, the match's player list, and the global matches query on success
 */
export function useJoinMatch(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => playersApi.join(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...MATCHES_KEY, matchId] });
      queryClient.invalidateQueries({
        queryKey: [...MATCHES_KEY, matchId, "players"],
      });
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
    },
  });
}

/**
 * Creates a mutation hook to leave the specified match and refresh related match data on success.
 *
 * @param matchId - The identifier of the match to leave
 * @returns The React Query mutation object that performs the leave operation; on success it invalidates the match details, the match's player list, and the matches list
 */
export function useLeaveMatch(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => playersApi.leave(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...MATCHES_KEY, matchId] });
      queryClient.invalidateQueries({
        queryKey: [...MATCHES_KEY, matchId, "players"],
      });
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
    },
  });
}
