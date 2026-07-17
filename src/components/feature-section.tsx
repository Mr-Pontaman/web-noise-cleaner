import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SITE_CONFIGS, SiteKey } from "@/constants";
import { FeatureSettings } from "@/types";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  title: string;
  description: string;
  config: FeatureSettings;
  onChange: (updatedConfig: FeatureSettings) => void;
  allowedSites: SiteKey[];
  detailsMap: Partial<Record<SiteKey, string>>;
}

export const FeatureSection = ({
  title,
  description,
  config,
  onChange,
  allowedSites,
  detailsMap,
}: FeatureSectionProps) => {
  const handleToggleEnabled = (checked: boolean) => {
    onChange({ ...config, enabled: checked });
  };

  const handleToggleTarget = (site: SiteKey, checked: boolean) => {
    onChange({
      ...config,
      targets: { ...config.targets, [site]: checked },
    });
  };

  const handleSelectAll = () => {
    const allChecked = allowedSites.every((site) => config.targets[site]);
    const nextTargets = { ...config.targets };
    allowedSites.forEach((site) => {
      nextTargets[site] = !allChecked;
    });
    onChange({ ...config, targets: nextTargets });
  };

  const isAllSelected = allowedSites.every((site) => config.targets[site]);

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5 pr-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold leading-none">{title}</h3>
            <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "hover:opacity-80"
                )}
              >
                <Info className="size-3.5" />
              </PopoverTrigger>
              <PopoverContent className="w-64 text-[11px] p-3 space-y-2">
                <p className="font-semibold text-xs border-b pb-1">
                  機能の詳細
                </p>
                {allowedSites.map((site) => (
                  <div key={site}>
                    <span className="font-bold text-foreground">
                      {SITE_CONFIGS[site].label}
                    </span>
                    ：
                    <span className="text-muted-foreground">
                      {detailsMap[site] ?? ""}
                    </span>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={handleToggleEnabled}
        />
      </div>

      {/* 設定詳細エリア（有効時のみ表示） */}
      {config.enabled && (
        <div className="mt-1 pl-1 space-y-2 border-t border-zinc-100 dark:border-zinc-900 pt-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              対象サイト
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
              onClick={handleSelectAll}
            >
              {isAllSelected ? "すべて外す" : "すべて選択"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {allowedSites.map((siteId) => (
              <div
                key={siteId}
                className="flex items-center space-x-2 rounded hover:bg-accent/50 p-1 transition-colors"
              >
                <Checkbox
                  id={`${title}-${siteId}`}
                  checked={config.targets[siteId]}
                  onCheckedChange={(checked) =>
                    handleToggleTarget(siteId, !!checked)
                  }
                />
                <Label
                  htmlFor={`${title}-${siteId}`}
                  className="text-xs font-normal cursor-pointer select-none"
                >
                  {SITE_CONFIGS[siteId].label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
