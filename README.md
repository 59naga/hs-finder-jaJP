ハースストーン日本語カード検索機
---

[デモ](http://jsrun.it/59naga/hscdje)

開発環境
---

gitおよびNodeJSのインストールが終了していることが前提です。ターミナル／cmder環境下で

```bash
git clone https://github.com/59naga/hs-finder-jaJP.git hsfinder
cd hsfinder

npm install
npm start
# webpack: bundle is now VALID
```

とすることで、`http://localhost:8080/webpack-dev-server/`上に、開発環境を起動します。

```bash
npm run build
```

とすることで、出荷用のコードを生成します。`index.html`と`bundle.js`をアップロードすることで何処にでも設置可能です。

留意点
---

* 動作保証ブラウザは現在、`GoogleChrome`, `Firefox`の最新版のみです。
* `https://hearthstonejson.com/json/AllSetsAllLanguages.json.zip`に依存します。

License
---
[MIT](http://59naga.mit-license.org/)