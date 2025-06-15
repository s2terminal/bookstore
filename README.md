# Bookstore
ブックマークレットをTypeScriptで記述してGit管理するためのリポジトリ。

## 起動方法

```
$ npm install
$ npm run dev
```

http://localhost:5173

## 構成

```
packages
├── bookmarklet # ブックマークレット本体のTypeScriptファイル
├── builder     # packages/bookmarkletにあるTypeScriptをビルドしてブックマークレット形式にする
└── web         # ブックマークレットを表示するWebページ
```

## Test
```
$ npm run test
```
