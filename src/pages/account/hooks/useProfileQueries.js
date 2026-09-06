import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import profileService from "../services/profileService";
import { useAuthStore } from "../../../store/useAuthStore";

export const useProfileQuery = (userId) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => profileService.getById(userId),
    enabled: !!userId,
  });
};

export const useUpdateProfile = (userId) => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data) => profileService.update(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile", userId], updatedUser);
      setAuth({
        user: updatedUser,
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      });
    },
  });
};
