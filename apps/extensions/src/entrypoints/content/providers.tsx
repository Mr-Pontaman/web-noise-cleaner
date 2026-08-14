import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { browser } from "wxt/browser";
import { DARK_THEME_KEY } from "@/constants";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentThemeWrapper>{children}</ContentThemeWrapper>
    </QueryClientProvider>
  );
};

const ContentThemeWrapper = ({ children }: { children: ReactNode }) => {
  const [themeClass, setThemeClass] = useState<string>("");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (stored: string | undefined) => {
      if (stored === "light") {
        setThemeClass("light");
      } else if (stored === "dark") {
        setThemeClass("dark");
      } else {
        setThemeClass(mediaQuery.matches ? "dark" : "light");
      }
    };

    browser.storage.local.get(DARK_THEME_KEY).then((res) => {
      applyTheme(res[DARK_THEME_KEY] as string | undefined);
    });

    const listener = (
      changes: Record<string, chrome.storage.StorageChange>
    ) => {
      if (changes[DARK_THEME_KEY]) {
        applyTheme(changes[DARK_THEME_KEY].newValue as string | undefined);
      }
    };
    browser.storage.onChanged.addListener(listener);

    const onSystemChange = () => {
      browser.storage.local.get(DARK_THEME_KEY).then((res) => {
        applyTheme(res[DARK_THEME_KEY] as string | undefined);
      });
    };
    mediaQuery.addEventListener("change", onSystemChange);

    return () => {
      browser.storage.onChanged.removeListener(listener);
      mediaQuery.removeEventListener("change", onSystemChange);
    };
  }, []);

  return <div className={themeClass}>{children}</div>;
};
