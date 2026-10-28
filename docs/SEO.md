# にじいろ SEO設定

設定日：2026年10月28日

## 正規URL

`https://preschool-nijiiro.pages.dev/`

URLの定義は `src/data/site-config.mjs` に集約。Astro設定、canonical、OGP、JSON-LD、robots.txt、sitemap.xmlはこの値を参照する。

## 検索結果向けの内容

タイトル：旭川のプリスクール・英語学童｜プリスクール・学童 にじいろ

説明文：北海道旭川市3条通の「プリスクール・学童 にじいろ」。遊びや生活の中で自然に英語に触れ、一人ひとりの「やってみたい」を育む対面の教室です。体験入園・体験学童は予約制で随時受付。お問い合わせは0166-67-2500。

検索結果の表示文言や順位を保証するものではない。

## 実装内容

- Astroの`site`に正規URLを設定し、静的出力を指定。
- `src/components/Seo.astro`へメタ情報を集約し、既存ページの重複メタ情報を置き換え。
- canonicalとog:urlを正規URLに統一。
- robotsメタを `index, follow, max-image-preview:large` に設定。
- OGP・X向けのタイトル、説明文、画像、代替テキストを設定。
- OGP画像を支給の `https://preschool-nijiiro.pages.dev/ogp.png` に統一。サイズ1200×628px、MIMEタイプimage/png。
- `Preschool`、`WebSite`、`WebPage`、`ImageObject`、プリスクール／学童の`Service`をJSON-LDで関連付け。
- 教室名、住所、電話、Instagramを掲載内容と共有。ロゴは支給ロゴ、教室画像は支給の活動写真を使用し、本番の絶対URLで出力。
- 受付時間は`ContactPoint`の説明として記載し、保育・預かり時間を示す`openingHours`には転用していない。
- 未提供の対象年齢、対象学年の範囲、料金、地理座標、口コミ、評価、認可情報は追加していない。
- `robots.txt`と`sitemap.xml`はAstroの静的エンドポイントとして生成。
- サイトマップはトップページ1件。ページ内のハッシュリンクを別ページとして登録しない。
- 根拠のない更新日、changefreq、priorityは追加していない。

## 関連ファイル

- `astro.config.mjs`
- `src/data/site-config.mjs`
- `src/data/site.ts`
- `src/data/seo.ts`
- `src/components/Seo.astro`
- `src/pages/index.astro`
- `src/pages/robots.txt.ts`
- `src/pages/sitemap.xml.ts`

## 反映・確認の状況

ローカルソースへの実装のみ。ユーザーのこれまでの指定に従い、実装後のビルド、生成HTML・JSON-LDの検証、ブラウザ表示確認、公開ページの反映確認は行っていない。

作業開始時、Web取得ツールでは公開URLを取得できなかった。これはサイト停止やSEO不備を確認した結果ではなく、公開状態は未判断。

デプロイ、Search Consoleの所有権確認・サイトマップ送信、インデックス登録リクエスト、Googleビジネスプロフィールの操作は実施していない。

## ユーザー側で公開後に確認する項目

1. 公開HTMLのtitle、description、canonical、OGP、JSON-LD。
2. `https://preschool-nijiiro.pages.dev/robots.txt` と `https://preschool-nijiiro.pages.dev/sitemap.xml` の配信。
3. OGP画像および構造化データ内のロゴ・教室画像の公開URL。
4. Search Consoleへサイトマップを送信し、トップページのURL検査でインデックス状態を確認。
5. 必要に応じてSchema.org Validator等で構造化データを確認。Preschool／Serviceの記述が、そのままGoogleのリッチリザルト対象になるとは限らない。

## 公式資料

- Astroのルーティング：https://docs.astro.build/en/guides/routing/
- Astroの静的エンドポイント：https://docs.astro.build/en/guides/endpoints/
- 正規URL：https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- サイトマップ：https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Preschool：https://schema.org/Preschool
- ContactPoint：https://schema.org/ContactPoint
