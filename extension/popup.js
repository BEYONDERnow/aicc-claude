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

  // Feedback Button
  const feedbackButton = document.getElementById('feedback-button');

  if (feedbackButton) {
    feedbackButton.addEventListener('click', async () => {
      try {
        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Check if tab is a supported platform
        const supportedHosts = ['openai.com', 'chatgpt.com', 'claude.ai', 'gemini.google.com'];
        const isSupported = supportedHosts.some(host => tab.url.includes(host));

        if (!isSupported) {
          // Open GitHub Issues directly if not on supported platform
          chrome.tabs.create({
            url: 'https://github.com/chrisbeyeler/aicc-claude/issues/new?labels=beta-feedback'
          });
          window.close();
          return;
        }

        // Send message to content script to open feedback modal
        chrome.tabs.sendMessage(tab.id, {
          action: 'openFeedbackModal',
          options: {
            preselectedType: 'bug'
          }
        });

        // Close popup
        window.close();

      } catch (error) {
        console.error('[AI Compliance Checker] Error opening feedback modal:', error);
        // Fallback: Open GitHub Issues
        chrome.tabs.create({
          url: 'https://github.com/chrisbeyeler/aicc-claude/issues/new?labels=beta-feedback'
        });
        window.close();
      }
    });

    // Hover effect
    feedbackButton.addEventListener('mouseenter', () => {
      feedbackButton.style.transform = 'translateY(-2px)';
      feedbackButton.style.boxShadow = '0 4px 16px rgba(227, 58, 116, 0.4)';
    });

    feedbackButton.addEventListener('mouseleave', () => {
      feedbackButton.style.transform = 'translateY(0)';
      feedbackButton.style.boxShadow = '0 2px 8px rgba(227, 58, 116, 0.3)';
    });
  }
});
