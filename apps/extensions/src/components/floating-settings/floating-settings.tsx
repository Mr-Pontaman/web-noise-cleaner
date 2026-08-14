import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@web-noise-cleaner/ui/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { FLOATING_BUTTON_POSITION_CLASSES } from "@/constants";
import { SettingsPanel } from "@/components/floating-settings/settings-panel";

type AnimationState = "closed" | "open" | "closing";

export const FloatingSettings = () => {
  const { settings } = useSettings();
  const [animState, setAnimState] = useState<AnimationState>("closed");

  const open = () => setAnimState("open");
  const close = () => {
    setAnimState("closing");
    setTimeout(() => setAnimState("closed"), 200);
  };

  if (!settings.floating_button.enabled) return null;

  const position = settings.floating_button.position;
  const buttonClass = FLOATING_BUTTON_POSITION_CLASSES[position];

  const isRight = position.endsWith("right");
  const panelSide = isRight ? "right-0 border-l" : "left-0 border-r";
  const panelAnim =
    animState === "closing"
      ? isRight
        ? "slide-panel-exit"
        : "slide-panel-exit-left"
      : isRight
        ? "slide-panel-enter"
        : "slide-panel-enter-left";

  return (
    <>
      <Button
        onClick={open}
        className={`fixed ${buttonClass} size-10 z-214748364 rounded-full ${animState !== "closed" ? "hidden" : ""}`}
        aria-label="設定を開く"
      >
        <Settings className="size-5" />
      </Button>

      {animState !== "closed" && (
        <>
          <div
            className={`fixed inset-0 z-2147483645 bg-black/40 ${
              animState === "closing" ? "overlay-exit" : "overlay-enter"
            }`}
            onClick={close}
            aria-hidden="true"
          />

          <div
            className={`fixed top-0 ${panelSide} z-2147483646 border-border shadow-2xl settings-panel-width ${panelAnim}`}
          >
            <SettingsPanel onClose={close} />
          </div>
        </>
      )}
    </>
  );
};
