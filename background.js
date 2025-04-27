// background.js

// Uzantı yüklendiğinde bir kez çalışır
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Ad Blocker yüklendi – reklam engelleme rules.json üzerinden çalışıyor.');
});

// Tarayıcı yeniden başlatıldığında storage’daki ayara göre ruleset’i devre dışı bırakabiliriz
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get('enabled', data => {
    const enabled = data.enabled ?? true;
    if (!enabled) {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ['ruleset_1']
      });
    }
  });
});

// Popup’tan “Reklam Engelleme” toggle’ı değiştiğinde ruleset’i aç/kapat
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) {
    const enabled = changes.enabled.newValue;
    if (enabled) {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ['ruleset_1'],
        disableRulesetIds: []
      });
    } else {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [],
        disableRulesetIds: ['ruleset_1']
      });
    }
  }
});
