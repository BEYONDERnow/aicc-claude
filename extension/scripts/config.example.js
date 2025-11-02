/**
 * Feedback System Configuration
 *
 * SETUP-ANLEITUNG:
 * ================
 *
 * 1. Kopiere diese Datei zu: config.js
 *    (im gleichen Ordner: extension/scripts/config.js)
 *
 * 2. Trage deinen GitHub Personal Access Token ein (siehe unten)
 *
 * 3. Speichere die Datei
 *
 * 4. Lade die Extension neu (chrome://extensions/)
 *
 * WICHTIG: config.js wird NICHT ins Git committed (ist in .gitignore)!
 */

/**
 * GitHub Personal Access Token erstellen
 * =======================================
 *
 * Schritt 1: Öffne GitHub
 * - Gehe zu: https://github.com/settings/tokens
 * - ODER: GitHub → Dein Profilbild (oben rechts) → Settings → Developer settings (ganz unten) → Personal access tokens → Tokens (classic)
 *
 * Schritt 2: Token erstellen
 * - Klicke "Generate new token" → "Generate new token (classic)"
 * - Note: "AI Compliance Checker Beta Feedback"
 * - Expiration: 90 days (oder länger)
 * - Scopes: Aktiviere NUR "public_repo" (erste Checkbox unter "repo")
 *
 * Schritt 3: Token kopieren
 * - Klicke "Generate token" (ganz unten)
 * - WICHTIG: Kopiere den Token SOFORT (wird nur einmal angezeigt!)
 * - Format: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *
 * Schritt 4: Token hier eintragen
 * - Kopiere diese Datei zu config.js
 * - Trage den Token unten ein
 * - Speichere und lade Extension neu
 */

export const GITHUB_CONFIG = {
  // GitHub Repository
  owner: 'chrisbeyeler',
  repo: 'aicc-claude',

  // Personal Access Token (hier eintragen!)
  token: 'HIER_DEINEN_TOKEN_EINFÜGEN',  // Format: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // API Endpoint (nicht ändern)
  apiUrl: 'https://api.github.com'
};

/**
 * Test-Funktion
 * =============
 *
 * Nach dem Setup kannst du testen ob der Token funktioniert:
 *
 * 1. Öffne eine AI-Plattform (ChatGPT/Claude/Gemini)
 * 2. Öffne die Browser-Console (F12)
 * 3. Führe aus:
 *
 *    new GitHubFeedbackService().testConnection().then(console.log)
 *
 * Erwartete Ausgabe:
 *    { success: true, repo: { name: "chrisbeyeler/aicc-claude", ... } }
 */
