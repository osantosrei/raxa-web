import { useQuery } from "@tanstack/react-query";

import { playersApi } from "@/api/players";
import { MATCHES_KEY } from "@/hooks/useMatches";

export function usePlayers(matchId: string) {
  return useQuery({
    queryKey: [...MATCHES_KEY, matchId, "players"],
    queryFn: () => playersApi.list(matchId),
    enabled: Boolean(matchId),
    staleTime: 1000 * 15,
  });
}
