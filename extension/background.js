/**
 * Service Worker für AI Compliance Checker
 * Manifest V3 Background Script
 *
 * Hauptaufgabe: Screenshot-Capture für Feedback-System
 */

console.log('[AICC Service Worker] Initialized');

/**
 * Message Listener für Content Script
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[AICC Service Worker] Message received:', message.action);

  // Screenshot Capture
  if (message.action === 'captureScreenshot') {
    handleScreenshotCapture(sender.tab?.id)
      .then(dataUrl => {
        sendResponse({ success: true, dataUrl });
      })
      .catch(error => {
        console.error('[AICC Service Worker] Screenshot capture failed:', error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true für asynchrone sendResponse
    return true;
  }

  // Test Connection
  if (message.action === 'testConnection') {
    sendResponse({ success: true, message: 'Service Worker läuft' });
    return true;
  }

  return false;
});

/**
 * Captured Screenshot des aktiven Tabs
 *
 * @param {number} tabId - Optional Tab ID
 * @returns {Promise<string>} Base64 data URL
 */
async function handleScreenshotCapture(tabId) {
  try {
    // Aktuellen Tab finden falls keine ID übergeben
    if (!tabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = tab.id;
    }

    // Screenshot erstellen (PNG format)
    const dataUrl = await chrome.tabs.captureVisibleTab(null, {
      format: 'png',
      quality: 100 // Maximale Quality, Compression erfolgt in screenshot-capture.js
    });

    console.log('[AICC Service Worker] Screenshot captured successfully');
    return dataUrl;

  } catch (error) {
    console.error('[AICC Service Worker] Screenshot capture error:', error);
    throw new Error(`Screenshot capture failed: ${error.message}`);
  }
}

/**
 * Extension Installation/Update Handler
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[AICC Service Worker] Extension installed');
  } else if (details.reason === 'update') {
    const previousVersion = details.previousVersion;
    const currentVersion = chrome.runtime.getManifest().version;
    console.log(`[AICC Service Worker] Updated from ${previousVersion} to ${currentVersion}`);
  }
});

/**
 * Error Handler für unhandled rejections
 */
self.addEventListener('unhandledrejection', (event) => {
  console.error('[AICC Service Worker] Unhandled rejection:', event.reason);
});
