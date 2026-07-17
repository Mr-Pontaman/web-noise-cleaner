import { SITE_CONFIGS, SiteKey } from "@/constants";
import { applyElementFilter, applyKeywordFilter } from "@/lib/filter";
import { getSettings } from "@/lib/storage";

export default defineContentScript({
  matches: [
    "*://*.google.com/*",
    "*://*.twitter.com/*",
    "*://*.x.com/*",
    "*://*.youtube.com/*",
    "*://*.yahoo.co.jp/*",
  ],
  async main() {
    const siteKey = Object.keys(SITE_CONFIGS).find((key) =>
      window.location.hostname.includes(key)
    ) as SiteKey;
    if (!siteKey) return;

    const config = SITE_CONFIGS[siteKey];
    const settings = await getSettings();

    if (
      settings.force_english.enabled &&
      settings.force_english.targets[siteKey] &&
      config.forceEnglish
    ) {
      config.forceEnglish();
    }

    // 2. フィルター適用ロジック
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
  },
});
