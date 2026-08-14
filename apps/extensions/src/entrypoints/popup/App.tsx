import { Separator } from "@web-noise-cleaner/ui/components/ui/separator";
import { Skeleton } from "@web-noise-cleaner/ui/components/ui/skeleton";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { FeatureSectionsList } from "@/components/feature-sections-list";
import { FloatingButtonSettingsCard } from "@/components/floating-button-settings-card";
import { useSettings } from "@/hooks/use-settings";
import { metadata } from "@/lib/metadata";

const App = () => {
  const {
    settings,
    isLoading,
    updateFeatureSettings,
    updateKeywords,
  } = useSettings();

  if (isLoading) {
    return <Skeleton className="w-80 h-128" />;
  }

  return (
    <main className="w-80 p-3 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold tracking-tight">
          {metadata.appName}
        </h1>
        <ModeToggle />
      </div>

      <Separator />

      <div className="space-y-3">
        <FeatureSectionsList
          settings={settings}
          onFeatureChange={updateFeatureSettings}
          onKeywordsChange={updateKeywords}
        />

        <Separator />

        <FloatingButtonSettingsCard />
      </div>
    </main>
  );
};

export default App;
