import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api";

export function useGetAdminDashboard() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/dashboard");
      return data.data;
    },
    enabled: !!localStorage.getItem("accessToken"),
  });
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useListUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: ["adminUsers", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/users", { params });
      return data;
    },
    enabled: !!localStorage.getItem("accessToken"),
  });
}

export function useSetUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "banned" }) => {
      const { data } = await axiosInstance.patch(`/admin/users/${id}`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/admin/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}
