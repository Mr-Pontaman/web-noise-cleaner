import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { FeatureSection } from "@/components/feature-section";
import { KeywordManager } from "@/components/keyword-manager";
import { FeatureSettings } from "@/types";
import { useSettings } from "@/hooks/use-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { metadata } from "@/lib/metadata";

const App = () => {
  const { settings, isLoading, mutation } = useSettings();

  if (isLoading) {
    return <Skeleton className="w-80 h-128" />;
  }

  const handleFeatureChange = (
    key: "force_english" | "element_filter" | "keyword_filter",
    updatedConfig: FeatureSettings
  ) => {
    mutation.mutate({ ...settings, [key]: updatedConfig });
  };

  const handleKeywordsChange = (newKeywords: string[]) => {
    mutation.mutate({ ...settings, noise_keywords: newKeywords });
  };

  return (
    <main className="w-80 p-3 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold tracking-tight">
          {metadata.appName}
        </h1>
        <ModeToggle />
      </div>

      <Separator />

      <div className="space-y-3">
        <FeatureSection
          title="要素フィルター"
          description="サイト固有の不要な要素（Xのトレンドなど）を排除"
          config={settings.element_filter}
          onChange={(updated) => handleFeatureChange("element_filter", updated)}
          allowedSites={["twitter", "youtube"]}
          detailsMap={{
            twitter: "広告やトレンド、おすすめユーザーを非表示にします。",
            youtube: "動画終了後のおすすめ動画や、サイドバーを非表示にします。",
          }}
        />

        <FeatureSection
          title="キーワード除去"
          description="指定キーワードが含まれるコンテンツ要素を非表示"
          config={settings.keyword_filter}
          onChange={(updated) => handleFeatureChange("keyword_filter", updated)}
          allowedSites={["google", "twitter", "youtube", "yahoo"]}
          detailsMap={{
            google: "キーワードが含まれる検索結果カードを非表示にします。",
            twitter: "キーワードが含まれるツイートを非表示にします。",
            youtube: "キーワードが含まれる動画を非表示にします。",
            yahoo: "キーワードが含まれるニュース記事を非表示にします。",
          }}
        />

        <KeywordManager
          keywords={settings.noise_keywords}
          onKeywordsChange={handleKeywordsChange}
        />

        <FeatureSection
          title="英語版サイト"
          description="英語版のサイトとして表示"
          config={settings.force_english}
          onChange={(updated) => handleFeatureChange("force_english", updated)}
          allowedSites={["google"]}
          detailsMap={{
            google: "Googleの検索エンジンを英語版にします。",
          }}
        />
      </div>
    </main>
  );
};

export default App;
