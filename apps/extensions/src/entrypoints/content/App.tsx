import { FloatingSettings } from "@/components/floating-settings/floating-settings";
import { Providers } from "./providers";
import { Toaster } from "@web-noise-cleaner/ui/components/ui/sonner";

const App = () => {
  return (
    <Providers>
      <FloatingSettings />
      <Toaster />
    </Providers>
  );
};

export default App;
