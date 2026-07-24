import { DEFAULT_SETTINGS } from "@/constants";
import { StorageSettings } from "@/types";
import { browser } from "wxt/browser";

export const getSettings = async (): Promise<StorageSettings> => {
  try {
    // localStorageと異なりkeyだけ渡さずオブジェクトを丸ごと渡しているが、
    // ブラウザに保存されている値で上書きされる仕組みになっている。
    const res = await browser.storage.local.get(DEFAULT_SETTINGS);
    return (res as unknown as StorageSettings) ?? DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Failed to load settings, using defaults:", error);
    return DEFAULT_SETTINGS;
  }
};
