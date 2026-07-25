import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api";

export function useGetConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/messages/conversations");
      return data.data;
    },
    enabled: !!localStorage.getItem("accessToken"),
    refetchInterval: 5000, // Poll every 5s for chat updates
  });
}

export function useGetChatHistory(otherUserId: string) {
  return useQuery({
    queryKey: ["chatHistory", otherUserId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/messages/history/${otherUserId}`);
      return data.data;
    },
    enabled: !!otherUserId && !!localStorage.getItem("accessToken"),
    refetchInterval: 3000, // Poll faster for active chat threads
  });
}

export interface SendMessageInput {
  receiverId: string;
  content: string;
  attachments?: string[];
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (messageData: SendMessageInput) => {
      const { data } = await axiosInstance.post("/messages", messageData);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory", variables.receiverId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
