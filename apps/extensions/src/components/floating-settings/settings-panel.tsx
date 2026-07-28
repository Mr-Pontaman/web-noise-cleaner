import { Settings, X } from "lucide-react";
import { Skeleton } from "@web-noise-cleaner/ui/components/ui/skeleton";
import { Button } from "@web-noise-cleaner/ui/components/ui/button";
import { FeatureSectionsList } from "@/components/feature-sections-list";
import { useSettings } from "@/hooks/use-settings";
import { metadata } from "@/lib/metadata";
import { FeatureSettings } from "@/types";

interface SettingsPanelProps {
  onClose: () => void;
}

// ShadowDOM で表示される設定画面
export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, isLoading, updateSettings } = useSettings();

  const handleFeatureChange = (
    key: "force_english" | "element_filter" | "keyword_filter",
    updatedConfig: FeatureSettings
  ) => {
    updateSettings({ ...settings, [key]: updatedConfig });
  };

  const handleKeywordsChange = (newKeywords: string[]) => {
    updateSettings({ ...settings, noise_keywords: newKeywords });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Settings className="size-4 text-muted-foreground" />
          <h2 className="text-lg font-bold tracking-tight text-muted-foreground">
            {metadata.appName}
          </h2>
        </div>
        <Button
          variant="default"
          size="icon"
          className="size-7"
          onClick={onClose}
          aria-label="閉じる"
        >
          <X className="size-4" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <Skeleton className="w-full h-96" />
        ) : (
          <FeatureSectionsList
            settings={settings}
            onFeatureChange={handleFeatureChange}
            onKeywordsChange={handleKeywordsChange}
          />
        )}
      </main>
    </div>
  );
}
