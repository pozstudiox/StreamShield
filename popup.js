// popup.js

// Element referansları
const toggle = document.getElementById('toggle-blocking');
const whitelistInput = document.getElementById('whitelist-input');
const addBtn = document.getElementById('add-whitelist');
const listEl = document.getElementById('whitelist-list');
const settingsBtn = document.getElementById('settings-btn');
const backBtn = document.getElementById('back-btn');
const mainSec = document.getElementById('main-section');
const settingsSec = document.getElementById('settings-section');

// Yeni “Web Sitesi” butonu referansı
const visitSiteBtn = document.getElementById('visit-site-btn');
// “Whitelist’i Temizle” butonu
const clearWhitelistBtn = document.getElementById('clear-whitelist-btn');

/**
 * Mevcut whitelist öğelerini listede gösterir.
 */
function renderWhitelist(items) {
  listEl.innerHTML = '';
  items.forEach((url, idx) => {
    const li = document.createElement('li');
    li.textContent = url;
    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.title = 'Kaldır';
    btn.onclick = () => {
      chrome.storage.sync.get('whitelist', data => {
        const updated = data.whitelist.filter((_, i) => i !== idx);
        chrome.storage.sync.set({ whitelist: updated }, renderUI);
      });
    };
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

/**
 * Toggle ve whitelist ayarlarını UI'da günceller.
 */
function renderUI() {
  chrome.storage.sync.get(['enabled', 'whitelist'], data => {
    toggle.checked = data.enabled ?? true;
    renderWhitelist(data.whitelist ?? []);
  });
}

/**
 * Aktif sekmeyi yeniler.
 */
function refreshActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs.length) chrome.tabs.reload(tabs[0].id);
  });
}

// Reklam engelleme toggle'ı değiştiğinde kaydet ve sayfayı yenile
toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked }, refreshActiveTab);
});

// Whitelist'e yeni URL ekle
addBtn.addEventListener('click', () => {
  const url = whitelistInput.value.trim();
  if (!url) return;
  chrome.storage.sync.get('whitelist', data => {
    const list = data.whitelist || [];
    if (!list.includes(url)) {
      list.push(url);
      chrome.storage.sync.set({ whitelist: list }, () => {
        whitelistInput.value = '';
        renderUI();
      });
    }
  });
});

// Ayarlar panelini aç
settingsBtn.addEventListener('click', () => {
  mainSec.classList.add('hidden');
  settingsSec.classList.remove('hidden');
});
// Ayarlar panelinden geri dön
backBtn.addEventListener('click', () => {
  settingsSec.classList.add('hidden');
  mainSec.classList.remove('hidden');
});

// “Web Sitesi” butonu: yeni sekmede doğrudan Vercel URL’sini aç
visitSiteBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://stream-shieldx.vercel.app' });
});

// “Whitelist’i Temizle” butonu: tüm whitelist öğelerini sil
clearWhitelistBtn.addEventListener('click', () => {
  chrome.storage.sync.remove('whitelist', renderUI);
});

// Sayfa yüklendiğinde UI'ı render et
document.addEventListener('DOMContentLoaded', renderUI);
