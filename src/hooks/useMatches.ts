import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { matchesApi } from "@/api/matches";

export const MATCHES_KEY = ["matches"] as const;

/**
 * Provides a cached query for fetching the list of matches.
 *
 * @returns The query result containing the list of matches and its loading/error state
 */
export function useMatches() {
  return useQuery({
    queryKey: MATCHES_KEY,
    queryFn: matchesApi.list,
    staleTime: 1000 * 30,
  });
}

/**
 * Fetches and caches the detail for a specific match identified by `id`.
 *
 * The query is disabled when `id` is falsy and the cached data is considered fresh for 15 seconds.
 *
 * @param id - The match identifier to fetch; if falsy the query will not run
 * @returns The query result containing the match details
 */
export function useMatchDetail(id: string) {
  return useQuery({
    queryKey: [...MATCHES_KEY, id],
    queryFn: () => matchesApi.get(id),
    enabled: Boolean(id),
    staleTime: 1000 * 15,
  });
}

/**
 * Creates a match and invalidates the matches list cache on success.
 *
 * @returns The React Query mutation result for the create-match operation.
 */
export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
    },
  });
}

export function useCancelMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchesApi.cancel,
    onSuccess: (_data, matchId) => {
      queryClient.invalidateQueries({ queryKey: [...MATCHES_KEY, matchId] });
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY });
    },
  });
}
