import { Settings } from "lucide-react";
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
import { FLOATING_BUTTON_POSITION_LABELS } from "@/constants";
import { useSettings } from "@/hooks/use-settings";
import { FloatingButtonPosition } from "@/types";

export const FloatingButtonSettingsCard = () => {
  const { settings, updateSettings } = useSettings();
  const { floating_button } = settings;

  const handleToggle = (enabled: boolean) => {
    updateSettings({
      ...settings,
      floating_button: { ...floating_button, enabled },
    });
  };

  const handlePositionChange = (position: FloatingButtonPosition) => {
    updateSettings({
      ...settings,
      floating_button: { ...floating_button, position },
    });
  };

  return (
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
          checked={floating_button.enabled}
          onCheckedChange={handleToggle}
        />
      </div>

      {floating_button.enabled && (
        <div className="mt-1 pl-1 flex items-center justify-between">
          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            設定ボタンの表示位置
          </Label>
          <Select
            value={floating_button.position}
            onValueChange={(v) =>
              handlePositionChange(v as FloatingButtonPosition)
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
  );
};
