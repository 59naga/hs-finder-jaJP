[ハースストーン日本語カード検索機](http://jsrun.it/59naga/hscdje)
---

![2015-12-22 09 20 22](https://cloud.githubusercontent.com/assets/1548478/11944902/485df5e2-a88d-11e5-8357-52e41d6b2802.png)

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
