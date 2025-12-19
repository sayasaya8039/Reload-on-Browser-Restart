# Reload on Browser Restart

ブラウザ再起動時に5秒待って全タブを自動リロードするChrome拡張機能です。

## 機能

- ブラウザ再起動を自動検知
- 起動後5秒間待機してから全タブをリロード
- Chrome内部ページ（chrome://、edge://）はスキップ
- 軽量なService Worker実装

## インストール方法

### CRXファイルからインストール

1. [Releases](../../releases)から最新の`.crx`ファイルをダウンロード
2. Chromeで`chrome://extensions/`を開く
3. 右上の「デベロッパーモード」を有効化
4. `.crx`ファイルをドラッグ＆ドロップ

### 開発版のインストール

1. このリポジトリをクローン
2. `npm install`で依存関係をインストール
3. `npm run build`でビルド
4. Chromeで`chrome://extensions/`を開く
5. 「パッケージ化されていない拡張機能を読み込む」をクリック
6. `Reload_when_browser_restarts`フォルダを選択

## 使い方

インストール後、拡張機能は自動で動作します。

1. ブラウザを再起動すると、起動を検知
2. 5秒間待機（ページ読み込み完了を待つため）
3. 全タブを自動でリロード

## 技術スタック

- TypeScript
- Chrome Extensions Manifest V3
- Service Worker

## 開発

```bash
# 依存関係インストール
npm install

# 型チェック
npm run lint

# ビルド
npm run build
```

## ライセンス

MIT

## バージョン

v1.0.0
