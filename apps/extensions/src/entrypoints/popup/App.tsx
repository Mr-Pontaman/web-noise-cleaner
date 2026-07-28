import { Separator } from "@web-noise-cleaner/ui/components/ui/separator";
import { Skeleton } from "@web-noise-cleaner/ui/components/ui/skeleton";
import { Card } from "@web-noise-cleaner/ui/components/ui/card";
import { Label } from "@web-noise-cleaner/ui/components/ui/label";
import { Switch } from "@web-noise-cleaner/ui/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web-noise-cleaner/ui/components/ui/select";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { FeatureSectionsList } from "@/components/feature-sections-list";
import { FLOATING_BUTTON_POSITION_LABELS } from "@/constants";
import { FeatureSettings, FloatingButtonPosition } from "@/types";
import { useSettings } from "@/hooks/use-settings";
import { metadata } from "@/lib/metadata";
import { Settings } from "lucide-react";

const App = () => {
  const { settings, isLoading, updateSettings } = useSettings();

  if (isLoading) {
    return <Skeleton className="w-80 h-128" />;
  }

  const handleFeatureChange = (
    key: "force_english" | "element_filter" | "keyword_filter",
    updatedConfig: FeatureSettings
  ) => {
    updateSettings({ ...settings, [key]: updatedConfig });
  };

  const handleKeywordsChange = (newKeywords: string[]) => {
    updateSettings({ ...settings, noise_keywords: newKeywords });
  };

  const handleFloatingButtonToggle = (enabled: boolean) => {
    updateSettings({
      ...settings,
      floating_button: { ...settings.floating_button, enabled },
    });
  };

  const handleFloatingButtonPosition = (position: FloatingButtonPosition) => {
    updateSettings({
      ...settings,
      floating_button: { ...settings.floating_button, position },
    });
  };

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
          onFeatureChange={handleFeatureChange}
          onKeywordsChange={handleKeywordsChange}
        />

        <Separator />

        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5 pr-1">
              <h3 className="text-sm font-semibold leading-none flex items-center gap-x-1">
                <Settings size={14} />
                サイト上の設定ボタン
              </h3>
              <p className="text-[11px] text-muted-foreground">
                対象サイト上に設定を開くボタンを表示します
              </p>
            </div>
            <Switch
              checked={settings.floating_button.enabled}
              onCheckedChange={handleFloatingButtonToggle}
            />
          </div>

          {settings.floating_button.enabled && (
            <div className="mt-1 pl-1 flex items-center justify-between">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                設定ボタンの表示位置
              </Label>
              <Select
                value={settings.floating_button.position}
                onValueChange={(v) =>
                  handleFloatingButtonPosition(v as FloatingButtonPosition)
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(FLOATING_BUTTON_POSITION_LABELS) as [
                      FloatingButtonPosition,
                      string,
                    ][]
                  ).map(([value, label]) => (
                    <SelectItem key={value} className="text-xs" value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default App;
