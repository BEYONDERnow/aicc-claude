/**
 * AI Compliance Checker - Popup Script
 * v2.7.0 - Developer Mode Settings
 */

import { VERSION_FULL, STORAGE_KEYS } from './scripts/version.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[AI Compliance Checker] Popup loaded - Version:', VERSION_FULL);

  // Update version dynamically
  const versionElement = document.querySelector('.version');
  if (versionElement) {
    versionElement.textContent = `Version ${VERSION_FULL}`;
  }

  // Developer Mode Toggle
  const developerModeToggle = document.getElementById('developer-mode-toggle');

  if (developerModeToggle) {
    // Load current setting
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.DEVELOPER_MODE]);
        const isDeveloperMode = result[STORAGE_KEYS.DEVELOPER_MODE] || false;
        developerModeToggle.checked = isDeveloperMode;
        console.log('[AI Compliance Checker] Developer Mode:', isDeveloperMode);
      } catch (error) {
        console.error('[AI Compliance Checker] Error loading settings:', error);
      }
    }

    // Save on change
    developerModeToggle.addEventListener('change', async (e) => {
      const isEnabled = e.target.checked;
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        try {
          await chrome.storage.local.set({ [STORAGE_KEYS.DEVELOPER_MODE]: isEnabled });
          console.log('[AI Compliance Checker] Developer Mode updated:', isEnabled);

          // Optional: Visual feedback
          const settingInfo = developerModeToggle.closest('.setting-item').querySelector('.setting-info p');
          const originalText = settingInfo.textContent;
          settingInfo.textContent = isEnabled
            ? '✅ Aktiviert - Erweiterter Validierungsreport wird angezeigt'
            : '✅ Deaktiviert';
          settingInfo.style.color = 'var(--status-ok)';

          setTimeout(() => {
            settingInfo.textContent = originalText;
            settingInfo.style.color = '';
          }, 2000);
        } catch (error) {
          console.error('[AI Compliance Checker] Error saving settings:', error);
        }
      }
    });
  }
});
