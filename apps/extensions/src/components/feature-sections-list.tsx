import { FeatureSection } from "@/components/feature-section";
import { KeywordManager } from "@/components/keyword-manager";
import { FEATURE_SECTIONS } from "@/constants";
import { FeatureKey, FeatureSettings, StorageSettings } from "@/types";

interface FeatureSectionsListProps {
  settings: StorageSettings;
  onFeatureChange: (key: FeatureKey, updatedConfig: FeatureSettings) => void;
  onKeywordsChange: (newKeywords: string[]) => void;
}

export const FeatureSectionsList = ({
  settings,
  onFeatureChange,
  onKeywordsChange,
}: FeatureSectionsListProps) => {
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
        onKeywordsChange={onKeywordsChange}
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
};
