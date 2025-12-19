/**
 * ブラウザ再起動時に全タブをリロードするService Worker
 * 起動後5秒待ってからリロードを実行
 *
 * 注意: Service Workerは非アクティブ時に停止されるため、
 * setTimeout ではなく chrome.alarms API を使用
 */

// アラーム名
const RELOAD_ALARM = 'reload_all_tabs';

/**
 * 全タブをリロードする
 */
async function reloadAllTabs(): Promise<void> {
  try {
    const tabs = await chrome.tabs.query({});

    console.log(`[Reload Extension] ${tabs.length}個のタブをリロードします`);

    for (const tab of tabs) {
      if (tab.id) {
        // URLがない場合もリロードを試みる（復元中のタブ対応）
        const url = tab.url || tab.pendingUrl || '';

        // chrome:// や edge:// などの内部ページはスキップ
        if (url.startsWith('chrome://') ||
            url.startsWith('edge://') ||
            url.startsWith('chrome-extension://') ||
            url.startsWith('about:')) {
          console.log(`[Reload Extension] スキップ: ${url || '(URL不明)'}`);
          continue;
        }

        try {
          await chrome.tabs.reload(tab.id);
          console.log(`[Reload Extension] リロード完了: ${url || '(URL不明)'}`);
        } catch (error) {
          console.error(`[Reload Extension] リロード失敗: ${url}`, error);
        }
      }
    }

    console.log('[Reload Extension] 全タブのリロードが完了しました');
  } catch (error) {
    console.error('[Reload Extension] タブ取得エラー:', error);
  }
}

/**
 * ブラウザ起動時の処理
 */
async function onBrowserStartup(): Promise<void> {
  console.log('[Reload Extension] ブラウザ起動を検知しました。5秒後に全タブをリロードします。');

  // 5秒後にアラームを発火（Service Workerが停止しても確実に実行）
  await chrome.alarms.create(RELOAD_ALARM, {
    delayInMinutes: 5 / 60  // 5秒 = 5/60分
  });
}

// アラーム発火時の処理
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(`[Reload Extension] アラーム発火: ${alarm.name}`);

  if (alarm.name === RELOAD_ALARM) {
    reloadAllTabs();
  }
});

// Service Worker起動時に実行
chrome.runtime.onStartup.addListener(() => {
  console.log('[Reload Extension] onStartup イベント発火');
  onBrowserStartup();
});

// 拡張機能インストール/更新時
chrome.runtime.onInstalled.addListener((details) => {
  console.log(`[Reload Extension] onInstalled: ${details.reason}`);
  // インストール時は何もしない（リロード不要）
});

console.log('[Reload Extension] Service Worker が読み込まれました');
