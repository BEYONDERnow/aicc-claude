/**
 * AI Compliance Checker - Popup Script
 * v2.8.1 - Extension Enabled & Developer Mode Settings
 */

import { VERSION_FULL, STORAGE_KEYS } from './scripts/version.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[AI Compliance Checker] Popup loaded - Version:', VERSION_FULL);

  // Update version dynamically
  const versionElement = document.querySelector('.version');
  if (versionElement) {
    versionElement.textContent = `Version ${VERSION_FULL}`;
  }

  // Extension Enabled Toggle
  const extensionEnabledToggle = document.getElementById('extension-enabled-toggle');
  const extensionStatus = document.getElementById('extension-status');
  const statusTitle = document.getElementById('status-title');
  const statusDescription = document.getElementById('status-description');

  if (extensionEnabledToggle) {
    // Load current setting (default: true)
    try {
      const result = await chrome.storage.local.get([STORAGE_KEYS.EXTENSION_ENABLED]);
      const isEnabled = result[STORAGE_KEYS.EXTENSION_ENABLED] !== false; // Default: true
      extensionEnabledToggle.checked = isEnabled;
      updateStatusDisplay(isEnabled);
      console.log('[AI Compliance Checker] Extension Enabled:', isEnabled);
    } catch (error) {
      console.error('[AI Compliance Checker] Error loading settings:', error);
    }

    // Save on change
    extensionEnabledToggle.addEventListener('change', async (e) => {
      const isEnabled = e.target.checked;
      try {
        await chrome.storage.local.set({ [STORAGE_KEYS.EXTENSION_ENABLED]: isEnabled });
        console.log('[AI Compliance Checker] Extension Enabled updated:', isEnabled);

        // Update Status Display
        updateStatusDisplay(isEnabled);

        // Visual feedback
        const settingInfo = extensionEnabledToggle.closest('.setting-item').querySelector('.setting-info p');
        const originalText = settingInfo.textContent;
        settingInfo.textContent = isEnabled
          ? '✅ Extension aktiviert - Überwachung läuft'
          : '✅ Extension deaktiviert';
        settingInfo.style.color = 'var(--status-ok)';

        setTimeout(() => {
          settingInfo.textContent = originalText;
          settingInfo.style.color = '';
        }, 2000);
      } catch (error) {
        console.error('[AI Compliance Checker] Error saving settings:', error);
      }
    });
  }

  function updateStatusDisplay(isEnabled) {
    if (isEnabled) {
      extensionStatus.className = 'status status-safe';
      extensionStatus.querySelector('.status-icon').textContent = '✓';
      statusTitle.textContent = 'Aktiv & Überwacht';
      statusDescription.textContent = 'Extension läuft im Hintergrund';
    } else {
      extensionStatus.className = 'status status-warning';
      extensionStatus.querySelector('.status-icon').textContent = '⏸';
      statusTitle.textContent = 'Deaktiviert';
      statusDescription.textContent = 'Extension ist pausiert';
    }
  }

  // Developer Mode Toggle
  const developerModeToggle = document.getElementById('developer-mode-toggle');

  if (developerModeToggle) {
    // Load current setting
    try {
      const result = await chrome.storage.local.get([STORAGE_KEYS.DEVELOPER_MODE]);
      const isDeveloperMode = result[STORAGE_KEYS.DEVELOPER_MODE] || false;
      developerModeToggle.checked = isDeveloperMode;
      console.log('[AI Compliance Checker] Developer Mode:', isDeveloperMode);
    } catch (error) {
      console.error('[AI Compliance Checker] Error loading settings:', error);
    }

    // Save on change
    developerModeToggle.addEventListener('change', async (e) => {
      const isEnabled = e.target.checked;
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
    });
  }
});
