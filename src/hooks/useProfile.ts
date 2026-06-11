import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "@/api/users";
import type { UpdateProfileRequest } from "@/types/api";

export const PROFILE_KEY = ["profile"] as const;

/**
 * Provides a React Query hook for fetching the current user's profile.
 *
 * @returns The query result for the current user's profile. Data is cached under `PROFILE_KEY` and considered fresh for 60 seconds.
 */
export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: usersApi.me,
    staleTime: 1000 * 60,
  });
}

/**
 * Create a mutation hook to update the current user's profile and refresh the cached profile.
 *
 * @returns A React Query mutation result that calls the API to update the profile; on success the cached value for `PROFILE_KEY` is replaced with the returned user.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => usersApi.updateMe(data),
    onSuccess: (user) => {
      queryClient.setQueryData(PROFILE_KEY, user);
    },
  });
}
