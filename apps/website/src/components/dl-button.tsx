import { RELEASE_URL } from "@/constants";
import { buttonVariants } from "@web-noise-cleaner/ui/components/ui/button";
import { cn } from "@web-noise-cleaner/ui/lib/utils";
import { Download } from "lucide-react";

export const DlButton = () => {
  return (
    <a
      href={RELEASE_URL}
      target="_blank"
      className={cn(
        buttonVariants({ variant: "default", size: "lg" }),
        "px-6 py-3 text-lg font-semibold",
      )}
    >
      <Download />
      ダウンロード
    </a>
  );
};
