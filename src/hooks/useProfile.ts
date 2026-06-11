import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "@/api/users";
import type { UpdateProfileRequest } from "@/types/api";

export const PROFILE_KEY = ["profile"] as const;

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: usersApi.me,
    staleTime: 1000 * 60,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => usersApi.updateMe(data),
    onSuccess: (user) => {
      queryClient.setQueryData(PROFILE_KEY, user);
    },
  });
}
