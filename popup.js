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
const visitSiteBtn = document.getElementById('visit-site-btn');
const clearWhitelistBtn = document.getElementById('clear-whitelist-btn');

/** Whitelist’i render eder */
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

/** UI’ı güncelle: toggle + whitelist */
function renderUI() {
  chrome.storage.sync.get(['enabled','whitelist'], data => {
    // Default false olacak
    toggle.checked = data.enabled ?? false;
    renderWhitelist(data.whitelist ?? []);
  });
}

/** Aktif sekmeyi yeniler */
function refreshActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) chrome.tabs.reload(tabs[0].id);
  });
}

// Toggle değiştiğinde storage’a kaydet (true/false)
toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked }, refreshActiveTab);
});

// Whitelist’e ekle
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

// Ayarlar panelini aç / kapat
settingsBtn.addEventListener('click', () => {
  mainSec.classList.add('hidden');
  settingsSec.classList.remove('hidden');
});
backBtn.addEventListener('click', () => {
  settingsSec.classList.add('hidden');
  mainSec.classList.remove('hidden');
});

// Web Sitesi ve Whitelist temizle
visitSiteBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://stream-shieldx.vercel.app' });
});
clearWhitelistBtn.addEventListener('click', () => {
  chrome.storage.sync.remove('whitelist', renderUI);
});

// İlk yüklemede UI’ı render et
document.addEventListener('DOMContentLoaded', renderUI);
