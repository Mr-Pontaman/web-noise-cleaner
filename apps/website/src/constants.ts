export const GITHUB_REPO = "/web-noise-cleaner";
export const GITHUB_FULL_REPO = `https://github.com/Mr-Pontaman${GITHUB_REPO}`;
export const RELEASE_URL = `${GITHUB_FULL_REPO}/releases/continuous`;

export const metadata = {
  title: "Web Noise Cleaner",
  description:
    "X（Twitter）・YouTube・Google・Yahoo! JAPAN から不要なノイズを除去",
};

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
      "ダウンロードリンクをクリックし、「Assets」の一番上にある `web-noise-cleaner-{{browser}}-v{{version}}.zip` という形式のzipファイルをDLし、解凍する。",
  },
  {
    step: "02",
    title: "拡張機能の読み込み",
    description:
      "ブラウザの拡張機能管理画面（chrome://extensions）を開き、右上の「デベロッパーモード」を有効にする。",
  },
  {
    step: "03",
    title: "フォルダの選択",
    description:
      "「パッケージ化されていない拡張機能を読み込む」をクリックし、解凍したフォルダを選択して完了。",
  },
];

type FaqItem = {
  question: string;
  answer: string;
};
export const faqs: FaqItem[] = [
  {
    question: "Chrome Web Storeからインストールできますか？",
    answer:
      "いいえ、ストアで配布するには料金がかかるため 直接zipファイルとして配布しています。",
  },
  {
    question: "自動でアップデートされますか？",
    answer:
      "ストア版ではないため自動更新はされません。最新版を利用するにはダウンロードリンクから新しいzipファイルをダウンロードし、古い拡張機能を削除してから新しいものを読み込んでください",
  },
  {
    question: "どのブラウザで動作しますか？",
    answer: "Google Chrome、Brave で動作確認済み ",
  },
];
type IssueItem = {
  issue: string;
  detail: string;
};
export const issues: IssueItem[] = [
  {
    issue: "拡張機能が機能しなくなった",
    detail: `1. 対象サイト側で消したい要素の '識別子' が変わる可能性があります。その場合は対象サイトで拡張機能が動作しなくなります。
2. 対象サイト側のBot検知が厳格になった場合、拡張機能が動作しなくなる可能性があります。 
3. 解凍したフォルダを削除した場合、拡張機能が読み込まれなくなります。`,
  },
];
