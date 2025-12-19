"use strict";
/**
 * ブラウザ再起動時に全タブをリロードするService Worker
 * 起動後5秒待ってからリロードを実行
 */
// セッションストレージキー
const SESSION_KEY = 'browser_session_started';
/**
 * 全タブをリロードする
 */
async function reloadAllTabs() {
    try {
        const tabs = await chrome.tabs.query({});
        console.log(`[Reload Extension] ${tabs.length}個のタブをリロードします`);
        for (const tab of tabs) {
            if (tab.id && tab.url) {
                // chrome:// や edge:// などの内部ページはスキップ
                if (tab.url.startsWith('chrome://') ||
                    tab.url.startsWith('edge://') ||
                    tab.url.startsWith('chrome-extension://')) {
                    console.log(`[Reload Extension] スキップ: ${tab.url}`);
                    continue;
                }
                try {
                    await chrome.tabs.reload(tab.id);
                    console.log(`[Reload Extension] リロード完了: ${tab.url}`);
                }
                catch (error) {
                    console.error(`[Reload Extension] リロード失敗: ${tab.url}`, error);
                }
            }
        }
        console.log('[Reload Extension] 全タブのリロードが完了しました');
    }
    catch (error) {
        console.error('[Reload Extension] タブ取得エラー:', error);
    }
}
/**
 * ブラウザ起動時の処理
 * セッションストレージを使って再起動を検知
 */
async function onBrowserStartup() {
    // セッションストレージをチェック（ブラウザ再起動でクリアされる）
    const result = await chrome.storage.session.get(SESSION_KEY);
    if (!result[SESSION_KEY]) {
        // 新しいセッション = ブラウザが再起動された
        console.log('[Reload Extension] ブラウザ起動を検知しました。5秒後に全タブをリロードします。');
        // セッションフラグを設定
        await chrome.storage.session.set({ [SESSION_KEY]: true });
        // 5秒待ってからリロード
        setTimeout(() => {
            reloadAllTabs();
        }, 5000);
    }
    else {
        console.log('[Reload Extension] 既存セッション - リロードは実行しません');
    }
}
// Service Worker起動時に実行
chrome.runtime.onStartup.addListener(() => {
    console.log('[Reload Extension] onStartup イベント発火');
    onBrowserStartup();
});
// 拡張機能インストール/更新時
chrome.runtime.onInstalled.addListener((details) => {
    console.log(`[Reload Extension] onInstalled: ${details.reason}`);
    // インストール時はセッションフラグを設定するだけ（リロードしない）
    chrome.storage.session.set({ [SESSION_KEY]: true });
});
console.log('[Reload Extension] Service Worker が読み込まれました');
