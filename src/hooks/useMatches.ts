import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { matchesApi } from "@/api/matches";

export const MATCHES_KEY = ["matches"] as const;

export function useMatches() {
  return useQuery({
    queryKey: MATCHES_KEY,
    queryFn: matchesApi.list,
    staleTime: 1000 * 30,
  });
}

export function useMatchDetail(id: string) {
  return useQuery({
    queryKey: [...MATCHES_KEY, id],
    queryFn: () => matchesApi.get(id),
    enabled: Boolean(id),
    staleTime: 1000 * 15,
  });
}

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
