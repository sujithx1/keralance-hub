import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api";

export interface SearchJobsFilters {
  searchQuery?: string;
  location?: string;
  remoteOnly?: boolean;
  page?: number;
  limit?: number;
}

export function useSearchJobs(filters: SearchJobsFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/jobs", { params: filters });
      return data;
    },
  });
}

export function useGetJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/jobs/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export interface CreateJobInput {
  title: string;
  description: string;
  budget: number;
  category: string;
  deadline?: string;
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobData: CreateJobInput) => {
      const { data } = await axiosInstance.post("/jobs", jobData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/jobs/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export interface SubmitApplicationInput {
  jobId: string;
  proposal: string;
  amount: number;
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appData: SubmitApplicationInput) => {
      const { data } = await axiosInstance.post("/applications", appData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "rejected" }) => {
      const { data } = await axiosInstance.patch(`/applications/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useListJobApplications(jobId: string) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/applications/job/${jobId}`);
      return data.data;
    },
    enabled: !!jobId,
  });
}
