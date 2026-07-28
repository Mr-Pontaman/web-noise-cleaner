import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MATCH_URLS, SITE_CONFIGS, SiteKey } from "@/constants";
import { applyElementFilter, applyKeywordFilter } from "@/lib/filter";
import { getSettings } from "@/lib/storage";

export default defineContentScript({
  matches: MATCH_URLS.map((item) => item.url),
  cssInjectionMode: "ui",

  async main(ctx) {
    // ─── フィルタリングロジック ─────────────────────────────────
    const siteKey = Object.keys(SITE_CONFIGS).find((key) =>
      window.location.hostname.includes(key)
    ) as SiteKey | undefined;

    const settings = await getSettings();

    if (siteKey) {
      // アクセスしている対象サイトのconfig
      const config = SITE_CONFIGS[siteKey];

      if (
        settings.force_english.enabled &&
        settings.force_english.targets[siteKey] &&
        config.forceEnglish
      ) {
        config.forceEnglish();
      }

      const runFilters = () => {
        if (
          settings.element_filter.enabled &&
          settings.element_filter.targets[siteKey]
        ) {
          applyElementFilter(document, config.elementSelectors);
        }
        if (
          settings.keyword_filter.enabled &&
          settings.keyword_filter.targets[siteKey]
        ) {
          applyKeywordFilter(
            document,
            config.keywordContainer,
            settings.noise_keywords
          );
        }
      };

      runFilters();
      const observer = new MutationObserver(runFilters);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // フローティング設定 -- ShadowDOM
    const ui = await createShadowRootUi(ctx, {
      name: "settings-panel",
      position: "inline",
      anchor: "body",
      onMount(container) {
        const app = document.createElement("div");
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(<App />);
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
