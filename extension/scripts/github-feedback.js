/**
 * GitHub Feedback Service
 * Sendet Feedback als GitHub Issues
 *
 * MODI:
 * 1. GitHub App (EMPFOHLEN): OAuth-Flow, für Public Beta
 * 2. Personal Access Token: Einfach für Entwicklung
 * 3. Fallback: Direkter Link zu GitHub Issues (keine API)
 *
 * SETUP:
 * - GitHub App: Siehe GITHUB_APP_SETUP.md
 * - PAT: Siehe FEEDBACK_SETUP.md
 */

// Import Config (wird von config.js geladen, NICHT von config.example.js)
import { GITHUB_CONFIG } from './config.js';

class GitHubFeedbackService {
  constructor() {
    // Verwende Config aus config.js
    this.config = GITHUB_CONFIG;

    // OAuth State (für GitHub App)
    this.oauthWindow = null;

    // Labels für verschiedene Feedback-Typen
    this.labels = {
      bug: ['bug', 'beta-feedback'],
      'false-positive': ['false-positive', 'beta-feedback', 'detection'],
      'false-negative': ['false-negative', 'beta-feedback', 'detection'],
      'feature-request': ['enhancement', 'beta-feedback']
    };
  }

  /**
   * Prüft ob GitHub API konfiguriert ist
   */
  isConfigured() {
    // GitHub App oder PAT muss konfiguriert sein
    if (this.config.useGitHubApp) {
      return this.config.githubApp && this.config.githubApp.clientId;
    }
    return this.config.token && this.config.token.length > 0;
  }

  /**
   * Generiert GitHub Issues URL (Fallback wenn keine API verfügbar)
   */
  generateIssueUrl(feedbackData) {
    const { type, comment, email, context, detection } = feedbackData;

    // Titel generieren
    const title = this.generateTitle(type, detection);

    // Body generieren (vereinfacht für URL)
    let body = `## 📝 Beschreibung\n\n${comment}\n\n`;

    if (detection) {
      body += `## 🔍 Erkennungs-Details\n\n`;
      body += `- **Erkannter Wert:** \`${detection.value}\`\n`;
      body += `- **Erkannt als:** ${detection.type}\n`;
      if (detection.context) {
        body += `- **Kontext:** "${detection.context}"\n`;
      }
      body += '\n';
    }

    body += `## 📊 System-Informationen\n\n`;
    body += `- **Extension Version:** ${context.version || 'Unbekannt'}\n`;
    body += `- **Platform:** ${context.platform || 'Unbekannt'}\n`;
    body += `- **Browser:** ${context.browser || 'Chrome'}\n\n`;

    if (email) {
      body += `## 📧 Kontakt\n\n- **E-Mail:** ${email}\n\n`;
    }

    body += `*Feedback gesendet via AI Compliance Checker Beta*`;

    // URL encoden
    const encodedTitle = encodeURIComponent(title);
    const encodedBody = encodeURIComponent(body);
    const labels = this.labels[type] || ['beta-feedback'];
    const encodedLabels = labels.join(',');

    return `https://github.com/${this.config.owner}/${this.config.repo}/issues/new?title=${encodedTitle}&body=${encodedBody}&labels=${encodedLabels}`;
  }

  /**
   * Erstellt ein GitHub Issue mit Feedback
   *
   * @param {Object} feedbackData
   * @param {string} feedbackData.type - 'bug' | 'false-positive' | 'false-negative' | 'feature-request'
   * @param {string} feedbackData.comment - User Kommentar
   * @param {string} feedbackData.email - User E-Mail (optional)
   * @param {string} feedbackData.screenshot - Base64 Screenshot (optional)
   * @param {Object} feedbackData.context - Zusätzlicher Kontext (Platform, Version, etc.)
   * @param {Object} feedbackData.detection - Info über Erkennung (bei false-positive/negative)
   * @returns {Promise<Object>} - GitHub Issue Response
   */
  async createIssue(feedbackData) {
    // Fallback: Wenn keine API konfiguriert, öffne GitHub Issues direkt
    if (!this.isConfigured()) {
      console.log('[GitHub Feedback] No API configured, using fallback (open GitHub Issues URL)');
      const issueUrl = this.generateIssueUrl(feedbackData);

      // Öffne GitHub Issues in neuem Tab
      window.open(issueUrl, '_blank');

      // Return mock response für UI
      return {
        html_url: issueUrl,
        fallback: true,
        message: 'Opened GitHub Issues in new tab'
      };
    }

    try {
      const issueData = this.buildIssueData(feedbackData);

      const response = await fetch(`${this.config.apiUrl}/repos/${this.config.owner}/${this.config.repo}/issues`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${this.config.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${response.status} - ${errorData.message}`);
      }

      const result = await response.json();
      console.log('[GitHub Feedback] Issue created successfully:', result.html_url);
      return result;

    } catch (error) {
      console.error('[GitHub Feedback] Failed to create issue:', error);

      // Fallback bei API-Fehler: Öffne GitHub Issues URL
      console.log('[GitHub Feedback] API failed, using fallback');
      const issueUrl = this.generateIssueUrl(feedbackData);
      window.open(issueUrl, '_blank');

      return {
        html_url: issueUrl,
        fallback: true,
        message: 'API failed, opened GitHub Issues as fallback'
      };
    }
  }

  /**
   * Baut die Issue-Daten basierend auf Feedback-Typ
   */
  buildIssueData(feedbackData) {
    const { type, comment, email, screenshot, context, detection } = feedbackData;

    // Titel generieren
    const title = this.generateTitle(type, detection);

    // Body generieren
    const body = this.generateBody(type, comment, email, screenshot, context, detection);

    // Labels auswählen
    const labels = this.labels[type] || ['beta-feedback'];

    return {
      title,
      body,
      labels
    };
  }

  /**
   * Generiert Issue-Titel
   */
  generateTitle(type, detection) {
    const typeLabels = {
      'bug': '🐛 Bug Report',
      'false-positive': '⚠️ False Positive',
      'false-negative': '❌ False Negative',
      'feature-request': '💡 Feature Request'
    };

    let title = typeLabels[type] || 'Beta Feedback';

    // Bei Detection-Feedback: Wert im Titel
    if (detection && detection.value) {
      const shortValue = detection.value.length > 30
        ? detection.value.substring(0, 30) + '...'
        : detection.value;
      title += `: "${shortValue}"`;
    }

    return title;
  }

  /**
   * Generiert Issue-Body mit Markdown-Template
   */
  generateBody(type, comment, email, screenshot, context, detection) {
    let body = `## ${this.getTypeEmoji(type)} ${this.getTypeTitle(type)}\n\n`;

    // User Kommentar
    body += `### 📝 Beschreibung\n\n${comment}\n\n`;

    // Detection Details (bei false-positive/negative)
    if (detection) {
      body += `### 🔍 Erkennungs-Details\n\n`;
      body += `- **Erkannter Wert:** \`${detection.value}\`\n`;
      body += `- **Erkannt als:** ${detection.type} (${detection.severity})\n`;

      if (detection.context) {
        body += `- **Kontext:** "${detection.context}"\n`;
      }

      if (detection.description) {
        body += `- **Beschreibung:** ${detection.description}\n`;
      }

      body += '\n';
    }

    // System-Informationen
    body += `### 📊 System-Informationen\n\n`;
    body += `- **Extension Version:** ${context.version || 'Unbekannt'}\n`;
    body += `- **Platform:** ${context.platform || 'Unbekannt'}\n`;
    body += `- **Browser:** ${context.browser || 'Chrome'}\n`;
    body += `- **User Agent:** ${context.userAgent || navigator.userAgent}\n`;
    body += `- **Timestamp:** ${new Date().toISOString()}\n\n`;

    // E-Mail (optional)
    if (email) {
      body += `### 📧 Kontakt\n\n`;
      body += `- **E-Mail:** ${email}\n\n`;
    }

    // Screenshot (optional)
    if (screenshot) {
      body += `### 📸 Screenshot\n\n`;
      body += `![Screenshot](${screenshot})\n\n`;
      body += `<details>\n<summary>Screenshot als Base64 (zum Kopieren)</summary>\n\n`;
      body += `\`\`\`\n${screenshot}\n\`\`\`\n\n`;
      body += `</details>\n\n`;
    }

    // Footer
    body += `---\n`;
    body += `*Automatisch generiert von AI Compliance Checker Beta Feedback System*\n`;

    return body;
  }

  /**
   * Hilfsfunktionen für Emojis und Titel
   */
  getTypeEmoji(type) {
    const emojis = {
      'bug': '🐛',
      'false-positive': '⚠️',
      'false-negative': '❌',
      'feature-request': '💡'
    };
    return emojis[type] || '📝';
  }

  getTypeTitle(type) {
    const titles = {
      'bug': 'Bug Report',
      'false-positive': 'False Positive Report',
      'false-negative': 'False Negative Report',
      'feature-request': 'Feature Request'
    };
    return titles[type] || 'Beta Feedback';
  }

  /**
   * Test-Funktion zum Validieren der GitHub API Connection
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, error: 'Token nicht konfiguriert' };
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/repos/${this.config.owner}/${this.config.repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${this.config.token}`
        }
      });

      if (!response.ok) {
        return { success: false, error: `API Error: ${response.status}` };
      }

      const repo = await response.json();
      return {
        success: true,
        repo: {
          name: repo.full_name,
          private: repo.private,
          hasIssues: repo.has_issues
        }
      };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export für Content Script
if (typeof window !== 'undefined') {
  window.GitHubFeedbackService = GitHubFeedbackService;
}
