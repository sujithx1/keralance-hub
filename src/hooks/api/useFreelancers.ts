import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api";

export interface SearchFreelancersFilters {
  category?: string;
  location?: string;
  searchQuery?: string;
  onlyAvailable?: boolean;
  page?: number;
  limit?: number;
}

export function useSearchFreelancers(filters: SearchFreelancersFilters) {
  return useQuery({
    queryKey: ["freelancers", filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/freelancers", { params: filters });
      return data;
    },
  });
}

export function useGetFreelancerProfile(userId: string) {
  return useQuery({
    queryKey: ["freelancerProfile", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/freelancers/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
}

export interface FreelancerProfileInput {
  title?: string;
  bio?: string;
  hourlyRate?: number;
  location?: string;
  availability?: "available" | "busy" | "unavailable";
}

export function useUpdateFreelancerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: FreelancerProfileInput) => {
      const { data } = await axiosInstance.patch("/freelancers/profile", profileData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["freelancerProfile"] });
    },
  });
}

export function useAddSkills() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (skills: string[]) => {
      const { data } = await axiosInstance.post("/freelancers/skills", { skills });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancerProfile"] });
    },
  });
}

export interface PortfolioInput {
  title: string;
  description: string;
  projectUrl?: string;
}

export function useAddPortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (portfolioItem: PortfolioInput) => {
      const { data } = await axiosInstance.post("/freelancers/portfolio", portfolioItem);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancerProfile"] });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/freelancers/portfolio/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancerProfile"] });
    },
  });
}

export interface CreateReviewInput {
  freelancerId: string;
  rating: number;
  comment: string;
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewData: CreateReviewInput) => {
      const { data } = await axiosInstance.post("/reviews", reviewData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["freelancerProfile", variables.freelancerId] });
    },
  });
}
