/**
 * AI Compliance Checker - Central Version Management
 *
 * Single source of truth for version information.
 * Update this file when releasing new versions.
 */

export const VERSION = '2.10.5';
export const VERSION_LABEL = 'BETA';
export const VERSION_FULL = `${VERSION} ${VERSION_LABEL}`;

// Storage Keys
export const STORAGE_KEYS = {
  DEVELOPER_MODE: 'aicc_developer_mode',
  EXTENSION_ENABLED: 'aicc_extension_enabled'
};

// Export for use in manifest.json generation (if needed)
export const VERSION_INFO = {
  version: VERSION,
  label: VERSION_LABEL,
  full: VERSION_FULL
};
