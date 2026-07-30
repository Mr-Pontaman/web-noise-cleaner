# WTX

- エントリーポイントの`entrypoints/content.ts`のようなフォルダ・ファイル名はWTXの仕様上、その名前で固定する。
- フォルダ毎に分ける場合

```
   📂 entrypoints/
   📂 popup/
      📄 index.html     ← This file is the entrypoint
      📄 main.ts
      📄 style.css
   📂 background/
      📄 index.ts       ← This file is the entrypoint
      📄 alarms.ts
      📄 messaging.ts
   📂 youtube.content/
      📄 index.ts       ← This file is the entrypoint
      📄 style.css
```

## メモ

**ShadowDOM**:

ブラウザ内で表示したHTMLのフォントサイズが小さいと感じた場合の対処

-> https://wxt.dev/guide/resources/faq.html#my-content-script-ui-looks-different-on-certain-websites

```
-D postcss-rem-to-responsive-pixel
```

## TODO

iframe

- ShadowDOMだと Toast や Dialog と相性が悪い

## 拡張機能

- store でデプロイしない場合、zipファイルを解凍してできたフォルダをPCから削除すると拡張機能が読み込まれなくなる。
