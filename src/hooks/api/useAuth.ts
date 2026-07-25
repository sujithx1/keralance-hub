import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api";

export function useSendOtp() {
  return useMutation({
    mutationFn: async (phone: string) => {
      const { data } = await axiosInstance.post("/auth/otp/send", { phone });
      return data;
    },
  });
}

export interface VerifyOtpParams {
  phone: string;
  code: string;
  name?: string;
  role?: "admin" | "user" | "freelancer";
}

export function useVerifyOtp(onSuccessCallback?: (data: any) => void) {
  return useMutation({
    mutationFn: async (payload: VerifyOtpParams) => {
      const { data } = await axiosInstance.post("/auth/otp/verify", payload);
      return data;
    },
    onSuccess: (data) => {
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      const { data } = await axiosInstance.post("/auth/logout", { refreshToken });
      return data;
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
    },
  });
}

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/profile");
      return data.data;
    },
    enabled: !!localStorage.getItem("accessToken"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: { name?: string; phone?: string; avatarUrl?: string }) => {
      const { data } = await axiosInstance.patch("/users/profile", profileData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
