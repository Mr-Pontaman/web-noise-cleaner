import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { browser } from "wxt/browser";
import { StorageSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/constants";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery<StorageSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await browser.storage.local.get(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        DEFAULT_SETTINGS as Record<string, any>
      );
      return res as unknown as StorageSettings;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newSettings: StorageSettings) => {
      await browser.storage.local.set(newSettings);
      return newSettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
    },
  });

  return {
    settings: query.data ?? DEFAULT_SETTINGS,
    isLoading: query.isLoading,
    mutation,
  };
};
