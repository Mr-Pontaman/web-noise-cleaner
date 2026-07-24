export const GITHUB_REPO = "https://github.com/Mr-Pontaman/web-noise-cleaner";
export const RELEASE_URL = `${GITHUB_REPO}/releases/continuous`;

export const metadata = {
  title: "Web Noise Cleaner",
  description:
    "X（Twitter）・YouTube・Google・Yahoo! JAPAN から不要なノイズを除去",
};

// HERO
export const features = [
  {
    title: "キーワードフィルター",
    description: "指定したキーワードが含まれる投稿や記事を自動的に非表示に。",
  },
  {
    title: "要素フィルター",
    description:
      "Xのトレンドやおすすめユーザー、YouTubeのサイドバーやおすすめ動画などを非表示に。",
  },
  {
    title: "英語版サイト",
    description: "Google検索を自動的に英語版に切り替え。",
  },
];

export const supportedSites = [
  { name: "X (Twitter)", icon: "𝕏" },
  { name: "YouTube", icon: "▶" },
  { name: "Google", icon: "G" },
  { name: "Yahoo! JAPAN", icon: "Y!" },
];

export const installSteps = [
  {
    step: "01",
    title: "ZIPのダウンロード",
    description:
      "ダウンロードリンクの「Assets」の一番上にある `web-noise-cleaner-{{browser}}-v{{version}}.zip` という形式のzipファイルをDLし、解凍します。",
  },
  {
    step: "02",
    title: "拡張機能の読み込み",
    description:
      "ブラウザの拡張機能管理画面（chrome://extensions）を開き、右上の「デベロッパーモード」を有効にします。",
  },
  {
    step: "03",
    title: "フォルダの選択",
    description:
      "「パッケージ化されていない拡張機能を読み込む」をクリックし、解凍したフォルダを選択して完了です。",
  },
];
