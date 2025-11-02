/**
 * GitHub Feedback Configuration
 *
 * DIESER FILE KANN ÜBERSCHRIEBEN WERDEN:
 * ========================================
 *
 * OPTION 1: Fallback-Modus (Aktuell aktiv)
 * - Keine Änderungen nötig
 * - Feedback öffnet vorausgefülltes GitHub Issue im Browser
 * - Funktioniert sofort ohne Setup
 *
 * OPTION 2: GitHub App (für Public Beta)
 * - Siehe: GITHUB_APP_SETUP.md
 * - Setze useGitHubApp: true
 * - Trage clientId ein
 *
 * OPTION 3: Personal Access Token (für Tests)
 * - Siehe: FEEDBACK_SETUP.md
 * - Trage token ein
 *
 * WICHTIG: Diese Datei steht in .gitignore und wird NICHT committed!
 */

// Setze globale Config (wird von github-feedback.js gelesen)
window.GITHUB_CONFIG = {
  // GitHub Repository
  owner: 'chrisbeyeler',
  repo: 'aicc-claude',

  // API Endpoint
  apiUrl: 'https://api.github.com',

  // ========================================
  // OPTION 1: Fallback-Modus (DEFAULT - Aktuell aktiv)
  // ========================================
  // KEINE Änderungen nötig!
  // Feedback öffnet vorausgefülltes GitHub Issue im Browser

  // ========================================
  // OPTION 2: GitHub App (OPTIONAL)
  // ========================================
  // Setup: Siehe GITHUB_APP_SETUP.md
  //
  // useGitHubApp: true,
  // githubApp: {
  //   clientId: 'DEINE_GITHUB_APP_CLIENT_ID'
  // },

  useGitHubApp: false,
  githubApp: {
    clientId: ''
  },

  oauthCallbackUrl: 'https://chrisbeyeler.github.io/aicc-claude/oauth-callback',

  // ========================================
  // OPTION 3: Personal Access Token (OPTIONAL)
  // ========================================
  // Setup: Siehe FEEDBACK_SETUP.md
  //
  // token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

  token: ''
};
