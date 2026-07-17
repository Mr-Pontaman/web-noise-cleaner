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
