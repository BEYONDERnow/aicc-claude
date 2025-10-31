/**
 * AI Compliance Checker - Popup Script
 */

import { VERSION_FULL } from './scripts/version.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[AI Compliance Checker] Popup loaded - Version:', VERSION_FULL);

  // Update version dynamically
  const versionElement = document.querySelector('.version');
  if (versionElement) {
    versionElement.textContent = `Version ${VERSION_FULL}`;
  }

  // Könnte hier Stats von localStorage laden
  // Für v1 ist das Popup informativ
});
