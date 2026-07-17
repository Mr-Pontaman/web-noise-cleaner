## Stack

TypeScript + Tailwind CSS + WXT(react,vite) + Shadcn UI

## Working rules

- Do not introduce new dependencies without explaining why
- Target WCAG 2.1 AA compliance for all interactive elements

- バリデーションにはzodを使用してください。
- エラーハンドリングはtry-catchブロックを使用して行ってください。
- フロントエンドでグローバルな状態管理が必要な場合はzustandを使用してください。
- サーバーからのデータを状態管理するにはtanstack-react-queryを使用してください。
- コンポーネントのスタイリングにはTailwind CSSを使用してください。
- 可能な限りShadCnのコンポーネントを用いてデザインを作成してください。
- typeは３箇所以上で使用される場合はfeatureに応じたtypeファイルに切り分けてください。それ以下の場合は切り分けなくてもいいです。
- ファイル名は小文字で、単語の区切りはハイフン（-）を使用してください。
- 関数はアロー関数で定義してください。
- 巨大なコンポーネントの作成を避け、適度に切り分けてください。
- AIが生成するような難読でクリーンなコードよりも、人間にとって可読性が高いコードを作成するよう心がけてください。
- ディレクトリ構成やコードを提案する際、export { default } from '...' のような再エクスポート（Re-export）だけを行うファイル（中継ファイルやバレルファイル）は作成しないでください。
