import { DEFAULT_SETTINGS } from "@/constants";
import { StorageSettings } from "@/types";
import { browser } from "wxt/browser";

export const getSettings = async (): Promise<StorageSettings> => {
  try {
    const res = await browser.storage.local.get(DEFAULT_SETTINGS);
    return (res as unknown as StorageSettings) ?? DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Failed to load settings, using defaults:", error);
    return DEFAULT_SETTINGS;
  }
};
