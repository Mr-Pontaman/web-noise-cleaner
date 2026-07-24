import { SiteKey } from "./constants";

export interface FeatureSettings {
  enabled: boolean;
  targets: Record<SiteKey, boolean>;
}

export interface StorageSettings {
  force_english: FeatureSettings;
  element_filter: FeatureSettings;
  keyword_filter: FeatureSettings;
  noise_keywords: string[];
}
