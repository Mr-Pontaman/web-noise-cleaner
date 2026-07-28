import { FloatingSettings } from "@/components/floating-settings/floating-settings";
import { Providers } from "./providers";
import { Toaster } from "@web-noise-cleaner/ui/components/ui/sonner";

export default function App() {
  return (
    <Providers>
      <FloatingSettings />
      <Toaster />
    </Providers>
  );
}
