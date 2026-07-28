import { SiteKey } from "./constants";

export interface FeatureSettings {
  enabled: boolean;
  targets: Record<SiteKey, boolean>;
}

export interface FeatureSectionDef {
  key: "force_english" | "element_filter" | "keyword_filter";
  title: string;
  description: string;
  allowedSites: SiteKey[];
  detailsMap: Partial<Record<SiteKey, string>>;
}

export type FloatingButtonPosition =
  "bottom-right" | "top-right" | "bottom-left";

export interface FloatingButtonSettings {
  enabled: boolean;
  position: FloatingButtonPosition;
}

export interface StorageSettings {
  force_english: FeatureSettings;
  element_filter: FeatureSettings;
  keyword_filter: FeatureSettings;
  noise_keywords: string[];
  floating_button: FloatingButtonSettings;
}
