import { FeatureSection } from "@/components/feature-section";
import { KeywordManager } from "@/components/keyword-manager";
import { FEATURE_SECTIONS } from "@/constants";
import { FeatureSettings } from "@/types";

interface FeatureSectionsListProps {
  settings: {
    element_filter: FeatureSettings;
    keyword_filter: FeatureSettings;
    force_english: FeatureSettings;
    noise_keywords: string[];
  };
  onFeatureChange: (
    key: "force_english" | "element_filter" | "keyword_filter",
    updatedConfig: FeatureSettings
  ) => void;
  onKeywordsChange: (newKeywords: string[]) => void;
}

/**
 * popup と content/SettingsPanel の両方で共通利用
 */
export function FeatureSectionsList({
  settings,
  onFeatureChange,
  onKeywordsChange,
}: FeatureSectionsListProps) {
  const handleKeywordsChange = (newKeywords: string[]) => {
    onKeywordsChange(newKeywords);
  };

  // forceEnglish と 他 でグループを分けるのは、forceEnglishは一番下に置きたいため
  const sectionsBeforeKeywords = FEATURE_SECTIONS.filter(
    (d) => d.key !== "force_english"
  );
  const forceEnglishDef = FEATURE_SECTIONS.find(
    (d) => d.key === "force_english"
  )!;

  return (
    <>
      {sectionsBeforeKeywords.map((def) => (
        <FeatureSection
          key={def.key}
          title={def.title}
          description={def.description}
          config={settings[def.key]}
          onChange={(updated) => onFeatureChange(def.key, updated)}
          allowedSites={def.allowedSites}
          detailsMap={def.detailsMap}
        />
      ))}

      <KeywordManager
        keywords={settings.noise_keywords}
        onKeywordsChange={handleKeywordsChange}
      />

      <FeatureSection
        key="force_english"
        title={forceEnglishDef.title}
        description={forceEnglishDef.description}
        config={settings.force_english}
        onChange={(updated) => onFeatureChange("force_english", updated)}
        allowedSites={forceEnglishDef.allowedSites}
        detailsMap={forceEnglishDef.detailsMap}
      />
    </>
  );
}
