import {
  FeatureSectionDef,
  FloatingButtonPosition,
  StorageSettings,
} from "./types";

interface SiteConfig {
  label: string;
  keywordContainer: string;
  elementSelectors: readonly string[];
  forceEnglish?: () => void;
}

export const DARK_THEME_KEY = "vite-ui-theme";

export type SiteKey = "google" | "x" | "youtube" | "yahoo";

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
  x: {
    label: "X (Twitter)",
    keywordContainer: 'article[data-testid="tweet"]',
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
      "ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer", // .ytd-item-section-renderer を外す
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

// デフォルトのノイズキーワード
export const NOISE_KEYWORDS = ["海外の反応", "日本絶賛", "日本称賛"];

// 2. ストレージの初期状態（既存のDEFAULT_SETTINGS）
export const DEFAULT_SETTINGS = {
  force_english: {
    enabled: true,
    targets: { google: true, x: false, youtube: false, yahoo: false },
  },
  element_filter: {
    enabled: true,
    targets: { google: false, x: true, youtube: true, yahoo: false },
  },
  keyword_filter: {
    enabled: true,
    targets: { google: true, x: true, youtube: true, yahoo: true },
  },
  noise_keywords: NOISE_KEYWORDS,
  floating_button: {
    enabled: true,
    position: "bottom-right",
  },
} satisfies StorageSettings;

// ─── FeatureSection 共通定義 ────────────────────────────────────────
// popup / content 両方で共有
export const FEATURE_SECTIONS: FeatureSectionDef[] = [
  {
    key: "element_filter",
    title: "要素フィルター",
    description: "サイト固有の不要な要素（Xのトレンドなど）を排除",
    allowedSites: ["x", "youtube"],
    detailsMap: {
      x: "広告やトレンド、おすすめユーザーを非表示にします。",
      youtube: "動画終了後のおすすめ動画や、サイドバーを非表示にします。",
    },
  },
  {
    key: "keyword_filter",
    title: "キーワード除去",
    description: "指定キーワードが含まれるコンテンツ要素を非表示",
    allowedSites: ["google", "x", "youtube", "yahoo"],
    detailsMap: {
      google: "キーワードが含まれる検索結果カードを非表示にします。",
      x: "キーワードが含まれるツイートを非表示にします。",
      youtube: "キーワードが含まれる動画を非表示にします。",
      yahoo: "キーワードが含まれるニュース記事を非表示にします。",
    },
  },
  {
    key: "force_english",
    title: "英語版サイト",
    description: "英語版のサイトとして表示",
    allowedSites: ["google"],
    detailsMap: {
      google: "Googleの検索エンジンを英語版にします。",
    },
  },
];

export const FLOATING_BUTTON_POSITION_LABELS: Record<
  FloatingButtonPosition,
  string
> = {
  "bottom-right": "右下",
  "top-right": "右上",
  "bottom-left": "左下",
};

export const FLOATING_BUTTON_POSITION_CLASSES: Record<
  FloatingButtonPosition,
  string
> = {
  "bottom-right": "bottom-4 right-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

// URLマッチパターン（wxt.config.ts の host_permissions と同期すること）
export const MATCH_URLS = [
  { name: "google", url: "*://*.google.com/*" },
  { name: "x", url: "*://*.x.com/*" },
  { name: "youtube", url: "*://*.youtube.com/*" },
  { name: "yahoo", url: "*://*.yahoo.co.jp/*" },
] as const;
