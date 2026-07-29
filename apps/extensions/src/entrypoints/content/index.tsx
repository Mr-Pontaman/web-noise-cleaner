import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MATCH_URLS, SITE_CONFIGS, SiteKey } from "@/constants";
import { processNode, resetProcessed } from "@/lib/filter";
import { getSettings } from "@/lib/storage";

export default defineContentScript({
  matches: MATCH_URLS.map((item) => item.url),
  cssInjectionMode: "ui",

  async main(ctx) {
    const siteKey = Object.keys(SITE_CONFIGS).find((key) =>
      window.location.hostname.includes(key)
    ) as SiteKey | undefined;

    // 対象サイトにアクセスしていない
    if (!siteKey) return;

    const config = SITE_CONFIGS[siteKey];
    let settings = await getSettings();

    if (
      settings.force_english.enabled &&
      settings.force_english.targets[siteKey] &&
      config.forceEnglish
    ) {
      config.forceEnglish();
    }

    const runFullProcess = () => {
      const elSelectors =
        settings.element_filter.enabled &&
        settings.element_filter.targets[siteKey]
          ? config.elementSelectors
          : [];

      const kwContainer =
        settings.keyword_filter.enabled &&
        settings.keyword_filter.targets[siteKey]
          ? config.keywordContainer
          : "";

      const keywords = settings.noise_keywords || [];

      processNode(document.body, elSelectors, kwContainer, keywords);
    };

    // 初回実行
    runFullProcess();

    // 追加されたノードのみを監視・処理
    const observer = new MutationObserver((mutations) => {
      const elSelectors =
        settings.element_filter.enabled &&
        settings.element_filter.targets[siteKey]
          ? config.elementSelectors
          : [];

      const kwContainer =
        settings.keyword_filter.enabled &&
        settings.keyword_filter.targets[siteKey]
          ? config.keywordContainer
          : "";

      const keywords = settings.noise_keywords || [];

      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          processNode(node, elSelectors, kwContainer, keywords);
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("yt-navigate-finish", () => {
      resetProcessed();
      runFullProcess();
    });

    // ストレージ変更時のリアルタイム反映
    browser.storage.onChanged.addListener(async (_, area) => {
      if (area !== "local") return;
      settings = await getSettings();
      // 設定が変わったときは、一度古い処理済み状態をリセットしてから全体を再走査
      resetProcessed();
      runFullProcess();
    });

    // フローティング設定 - ShadowDOM
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
