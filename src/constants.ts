import { StorageSettings } from "./types";

interface SiteConfig {
  label: string;
  keywordContainer: string;
  elementSelectors: readonly string[];
  forceEnglish?: () => void;
}

export type SiteKey = "google" | "twitter" | "youtube" | "yahoo";

export const SITE_CONFIGS: Record<SiteKey, SiteConfig> = {
  google: {
    label: "Google",
    // *カードの MjjYud というクラス名は明日にも変わっている可能性が高い。
    // カードがsearchの２個下のdivであることは変わらないはず。
    keywordContainer: "#search div[class*='MjjYud'], #search > div > div",
    elementSelectors: [],
    forceEnglish: () => {
      const url = new URL(window.location.href);
      // 1. Googleドメインか確認 (念のため)
      if (!url.hostname.includes("google.")) return;
      // 2. 「トップページ(/)」か「検索ページ(/search)」以外は処理しない
      const isHome = url.pathname === "/";
      const isSearch = url.pathname === "/search";
      if (!isHome && !isSearch) return;

      // 3. すでに英語設定ならループ防止のために何もしない
      if (
        url.searchParams.get("hl") === "en" &&
        url.searchParams.get("gl") === "US"
      )
        return;

      // 4. パラメータを付与
      url.searchParams.set("hl", "en");
      url.searchParams.set("gl", "US");

      // 5. replaceを使うと履歴に残らないため、ブラウザの「戻る」が正常に動く
      window.location.replace(url.toString());
    },
  },
  twitter: {
    label: "X (Twitter)",
    keywordContainer: "article",
    elementSelectors: [
      '[aria-label*="トレンド"]',
      '[aria-label*="Trends"]',
      '[aria-label*="おすすめユーザー"]',
      '[aria-label*="Who to follow"]',
    ],
  },
  youtube: {
    label: "YouTube",
    keywordContainer:
      "ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, .ytd-item-section-renderer",
    elementSelectors: [
      "ytd-rich-section-renderer",
      "ytd-ad-slot-renderer",
      "ytd-banner-promo-renderer",
      "#secondary",
    ],
  },
  yahoo: {
    label: "Yahoo! JAPAN",
    keywordContainer:
      ".sw-Card, .newsFeed-entry, .TopicListItem, .TweetList_item",
    elementSelectors: [],
  },
};

// UIで使うサイト一覧
export const SITES = Object.entries(SITE_CONFIGS).map(([id, cfg]) => ({
  id: id as SiteKey,
  label: cfg.label,
}));

// デフォルトのノイズキーワード
export const NOISE_KEYWORDS = ["海外の反応", "日本絶賛", "日本称賛"];

// 2. ストレージの初期状態（既存のDEFAULT_SETTINGS）
export const DEFAULT_SETTINGS = {
  force_english: {
    enabled: true,
    targets: { google: true, twitter: false, youtube: false, yahoo: false },
  },
  element_filter: {
    enabled: true,
    targets: { google: false, twitter: true, youtube: true, yahoo: false },
  },
  keyword_filter: {
    enabled: true,
    targets: { google: true, twitter: true, youtube: true, yahoo: true },
  },
  noise_keywords: NOISE_KEYWORDS,
} satisfies StorageSettings;

// URLマッチパターン
export const MATCH_URLS = [
  { name: "google", url: "*://*.google.com/*" },
  { name: "twitter", url: "*://*.twitter.com/*" },
  { name: "x", url: "*://*.x.com/*" },
  { name: "youtube", url: "*://*.youtube.com/*" },
  { name: "yahoo", url: "*://*.yahoo.co.jp/*" },
] as const;
