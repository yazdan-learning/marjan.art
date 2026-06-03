import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AboutSettings {
  bioText: string | null;
  imageUrl: string | null;
}

const ABOUT_QUERY_KEY = ["aboutSettings"];

export function useGetAboutSettings() {
  return useQuery({
    queryKey: ABOUT_QUERY_KEY,
    queryFn: async (): Promise<AboutSettings> => {
      const res = await fetch("/api/settings/about");
      if (!res.ok) throw new Error("Failed to fetch about settings");
      return res.json();
    },
  });
}

export function useUpdateAboutSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<AboutSettings>): Promise<AboutSettings> => {
      const res = await fetch("/api/settings/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update about settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ABOUT_QUERY_KEY });
    },
  });
}
