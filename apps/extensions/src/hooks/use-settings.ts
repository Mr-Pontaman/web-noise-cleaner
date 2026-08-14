import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { browser } from "wxt/browser";
import { FeatureKey, FeatureSettings, StorageSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/constants";
import { getSettings } from "@/lib/storage";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery<StorageSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await getSettings();
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

  const settings = query.data ?? DEFAULT_SETTINGS;

  const updateSettings = (newSettings: StorageSettings) => {
    mutation.mutate(newSettings);
  };

  const updateFeatureSettings = (key: FeatureKey, config: FeatureSettings) => {
    updateSettings({ ...settings, [key]: config });
  };

  const updateKeywords = (keywords: string[]) => {
    updateSettings({ ...settings, noise_keywords: keywords });
  };

  return {
    settings,
    isLoading: query.isLoading,
    mutation,
    updateSettings,
    updateFeatureSettings,
    updateKeywords,
  };
};
