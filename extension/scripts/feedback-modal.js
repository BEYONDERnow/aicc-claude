/**
 * Feedback Modal Manager
 * Verwaltet das Feedback-Formular und GitHub API Integration
 */

class FeedbackModal {
  constructor() {
    this.githubService = new GitHubFeedbackService();
    this.screenshotCapture = new ScreenshotCapture();
    this.currentScreenshot = null;
    this.detectionContext = null; // Für False-Positive/Negative Reports

    // Konfiguration
    this.config = {
      enableScreenshots: true,
      autoCapture: true
    };
  }

  /**
   * Öffnet das Feedback-Modal
   *
   * @param {Object} options
   * @param {string} options.preselectedType - 'bug' | 'false-positive' | 'false-negative' | 'feature-request'
   * @param {Object} options.detection - Erkennungs-Kontext für False-Positive/Negative
   */
  async open(options = {}) {
    // Prüfe ob Modal bereits existiert
    if (document.querySelector('.aicc-feedback-overlay')) {
      return;
    }

    // Detection Context speichern (für False-Positive/Negative)
    this.detectionContext = options.detection || null;

    // Modal HTML erstellen
    const modal = this.createModalHTML(options.preselectedType);
    document.body.appendChild(modal);

    // Event Listeners anhängen
    this.attachEventListeners();

    // Auto-Screenshot (falls aktiviert)
    if (this.config.autoCapture && this.config.enableScreenshots) {
      await this.captureScreenshot();
    }
  }

  /**
   * Erstellt das Modal HTML
   */
  createModalHTML(preselectedType = 'bug') {
    const overlay = document.createElement('div');
    overlay.className = 'aicc-feedback-overlay';
    overlay.innerHTML = `
      <div class="aicc-feedback-modal">
        <div class="aicc-feedback-header">
          <div class="aicc-feedback-header-content">
            <div class="aicc-feedback-icon">💬</div>
            <h2 class="aicc-feedback-title">Beta Feedback</h2>
            <p class="aicc-feedback-subtitle">Hilf uns die Extension zu verbessern</p>
          </div>
        </div>

        <div class="aicc-feedback-body">
          <!-- TYPE SELECTOR -->
          <div class="aicc-feedback-field">
            <label class="aicc-feedback-label">
              Feedback-Typ <span class="required">*</span>
            </label>
            <div class="aicc-feedback-types">
              <div class="aicc-feedback-type">
                <input type="radio" name="feedback-type" value="bug" id="type-bug" ${preselectedType === 'bug' ? 'checked' : ''}>
                <label for="type-bug" class="aicc-feedback-type-label">
                  <div class="aicc-feedback-type-icon">🐛</div>
                  <div class="aicc-feedback-type-text">Bug Report</div>
                </label>
              </div>
              <div class="aicc-feedback-type">
                <input type="radio" name="feedback-type" value="false-positive" id="type-fp" ${preselectedType === 'false-positive' ? 'checked' : ''}>
                <label for="type-fp" class="aicc-feedback-type-label">
                  <div class="aicc-feedback-type-icon">⚠️</div>
                  <div class="aicc-feedback-type-text">False Positive</div>
                </label>
              </div>
              <div class="aicc-feedback-type">
                <input type="radio" name="feedback-type" value="false-negative" id="type-fn" ${preselectedType === 'false-negative' ? 'checked' : ''}>
                <label for="type-fn" class="aicc-feedback-type-label">
                  <div class="aicc-feedback-type-icon">❌</div>
                  <div class="aicc-feedback-type-text">False Negative</div>
                </label>
              </div>
              <div class="aicc-feedback-type">
                <input type="radio" name="feedback-type" value="feature-request" id="type-feature" ${preselectedType === 'feature-request' ? 'checked' : ''}>
                <label for="type-feature" class="aicc-feedback-type-label">
                  <div class="aicc-feedback-type-icon">💡</div>
                  <div class="aicc-feedback-type-text">Feature Request</div>
                </label>
              </div>
            </div>
          </div>

          <!-- DETECTION CONTEXT (für False-Positive/Negative) -->
          ${this.detectionContext ? this.renderDetectionContext() : ''}

          <!-- COMMENT -->
          <div class="aicc-feedback-field">
            <label class="aicc-feedback-label" for="feedback-comment">
              Beschreibung <span class="required">*</span>
            </label>
            <textarea
              id="feedback-comment"
              class="aicc-feedback-textarea"
              placeholder="Beschreibe das Problem oder deinen Vorschlag..."
              required
            ></textarea>
          </div>

          <!-- EMAIL -->
          <div class="aicc-feedback-field">
            <label class="aicc-feedback-label" for="feedback-email">
              E-Mail <span class="optional">(optional für Rückfragen)</span>
            </label>
            <input
              type="email"
              id="feedback-email"
              class="aicc-feedback-input"
              placeholder="deine@email.com"
            >
          </div>

          <!-- SCREENSHOT -->
          ${this.config.enableScreenshots ? this.renderScreenshotSection() : ''}

          <!-- PRIVACY NOTICE -->
          <div class="aicc-feedback-privacy">
            <div class="aicc-feedback-privacy-title">
              🔒 Datenschutz-Information
            </div>
            <p class="aicc-feedback-privacy-text">
              Deine Feedback-Daten werden an GitHub gesendet und als Issue in unserem Repository gespeichert. Folgende Daten werden übertragen:
            </p>
            <ul class="aicc-feedback-privacy-list">
              <li>Feedback-Typ, Kommentar und E-Mail (falls angegeben)</li>
              <li>Screenshot (falls aktiviert)</li>
              <li>Extension-Version, Platform und Browser-Info</li>
              <li>Bei False-Positive/Negative: Erkannter Wert und Kontext</li>
            </ul>
            <p class="aicc-feedback-privacy-text" style="margin-top: 12px;">
              Du kannst das Issue später einsehen unter:
              <a href="https://github.com/${this.githubService.config.owner}/${this.githubService.config.repo}/issues" target="_blank" class="aicc-feedback-privacy-link">
                GitHub Issues
              </a>
            </p>
          </div>

          <!-- OPT-IN -->
          <div class="aicc-feedback-optin">
            <label class="aicc-feedback-checkbox">
              <input type="checkbox" id="feedback-consent" required>
              <span class="aicc-feedback-checkbox-label">
                <strong>Ich stimme der Übertragung meiner Feedback-Daten zu</strong> und habe die Datenschutz-Information gelesen.
              </span>
            </label>
          </div>

          <!-- FOOTER -->
          <div class="aicc-feedback-footer">
            <button class="aicc-feedback-cancel" data-action="cancel">
              Abbrechen
            </button>
            <button class="aicc-feedback-submit" data-action="submit" disabled>
              Feedback senden
            </button>
          </div>
        </div>
      </div>
    `;

    return overlay;
  }

  /**
   * Rendert Detection Context (für False-Positive/Negative)
   */
  renderDetectionContext() {
    if (!this.detectionContext) return '';

    return `
      <div class="aicc-feedback-detection">
        <div class="aicc-feedback-detection-title">
          🔍 Erkannte Daten
        </div>
        <div class="aicc-feedback-detection-item">
          <strong>Wert:</strong> <span class="aicc-feedback-detection-value">${this.escapeHtml(this.detectionContext.value)}</span>
        </div>
        <div class="aicc-feedback-detection-item">
          <strong>Typ:</strong> ${this.detectionContext.type || 'Unbekannt'}
        </div>
        <div class="aicc-feedback-detection-item">
          <strong>Schweregrad:</strong> ${this.detectionContext.severity || 'Unbekannt'}
        </div>
        ${this.detectionContext.context ? `
          <div class="aicc-feedback-detection-item">
            <strong>Kontext:</strong> "${this.escapeHtml(this.detectionContext.context)}"
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Rendert Screenshot Section
   */
  renderScreenshotSection() {
    return `
      <div class="aicc-feedback-screenshot">
        <label class="aicc-feedback-checkbox">
          <input type="checkbox" id="feedback-screenshot" checked>
          <span class="aicc-feedback-checkbox-label">
            Screenshot anhängen (automatisch erfasst)
          </span>
        </label>
        <div class="aicc-feedback-screenshot-preview" id="screenshot-preview" style="display: none;">
          <!-- Screenshot wird hier eingefügt -->
        </div>
      </div>
    `;
  }

  /**
   * Hängt Event Listeners an
   */
  attachEventListeners() {
    const overlay = document.querySelector('.aicc-feedback-overlay');
    if (!overlay) return;

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });

    // Cancel button
    overlay.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
      this.close();
    });

    // Submit button
    overlay.querySelector('[data-action="submit"]')?.addEventListener('click', () => {
      this.submit();
    });

    // Consent checkbox (aktiviert Submit-Button)
    const consentCheckbox = overlay.querySelector('#feedback-consent');
    const submitButton = overlay.querySelector('[data-action="submit"]');

    consentCheckbox?.addEventListener('change', (e) => {
      submitButton.disabled = !e.target.checked;
    });

    // Screenshot checkbox
    overlay.querySelector('#feedback-screenshot')?.addEventListener('change', (e) => {
      if (e.target.checked && !this.currentScreenshot) {
        this.captureScreenshot();
      }
    });
  }

  /**
   * Captured Screenshot
   */
  async captureScreenshot() {
    const previewContainer = document.querySelector('#screenshot-preview');
    if (!previewContainer) return;

    try {
      previewContainer.style.display = 'block';
      previewContainer.innerHTML = '<div class="aicc-feedback-screenshot-loading">📸 Screenshot wird erfasst...</div>';

      const screenshot = await this.screenshotCapture.captureTab();
      this.currentScreenshot = screenshot;

      previewContainer.innerHTML = `<img src="${screenshot}" alt="Screenshot Preview">`;

    } catch (error) {
      console.error('[Feedback Modal] Screenshot capture failed:', error);
      previewContainer.innerHTML = `
        <div class="aicc-feedback-screenshot-error">
          ❌ Screenshot konnte nicht erstellt werden: ${error.message}
        </div>
      `;
      this.currentScreenshot = null;
    }
  }

  /**
   * Sendet das Feedback
   */
  async submit() {
    const overlay = document.querySelector('.aicc-feedback-overlay');
    if (!overlay) return;

    const submitButton = overlay.querySelector('[data-action="submit"]');
    const originalText = submitButton.textContent;

    try {
      // Validierung
      const type = overlay.querySelector('input[name="feedback-type"]:checked')?.value;
      const comment = overlay.querySelector('#feedback-comment')?.value.trim();
      const email = overlay.querySelector('#feedback-email')?.value.trim();
      const includeScreenshot = overlay.querySelector('#feedback-screenshot')?.checked;

      if (!type || !comment) {
        alert('Bitte fülle alle Pflichtfelder aus.');
        return;
      }

      // Loading State
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="aicc-feedback-loading"></span> Sende...';

      // Feedback-Daten zusammenstellen
      const feedbackData = {
        type,
        comment,
        email: email || undefined,
        screenshot: (includeScreenshot && this.currentScreenshot) ? this.currentScreenshot : undefined,
        context: {
          version: chrome.runtime.getManifest().version,
          platform: this.detectPlatform(),
          browser: this.detectBrowser(),
          userAgent: navigator.userAgent
        },
        detection: this.detectionContext || undefined
      };

      // GitHub Issue erstellen
      const result = await this.githubService.createIssue(feedbackData);

      // Success State
      this.showSuccess(result.html_url);

    } catch (error) {
      console.error('[Feedback Modal] Submit failed:', error);

      submitButton.disabled = false;
      submitButton.textContent = originalText;

      alert(`Fehler beim Senden: ${error.message}\n\nBitte versuche es später erneut oder kontaktiere uns direkt.`);
    }
  }

  /**
   * Zeigt Success Message
   */
  showSuccess(issueUrl) {
    const overlay = document.querySelector('.aicc-feedback-overlay');
    if (!overlay) return;

    const modal = overlay.querySelector('.aicc-feedback-modal');
    modal.innerHTML = `
      <div class="aicc-feedback-header">
        <div class="aicc-feedback-header-content">
          <div class="aicc-feedback-icon">✅</div>
          <h2 class="aicc-feedback-title">Vielen Dank!</h2>
          <p class="aicc-feedback-subtitle">Dein Feedback wurde erfolgreich übermittelt</p>
        </div>
      </div>
      <div class="aicc-feedback-body">
        <div class="aicc-feedback-success">
          <div class="aicc-feedback-success-icon">🎉</div>
          <h3 class="aicc-feedback-success-title">Feedback erfolgreich gesendet</h3>
          <p class="aicc-feedback-success-text">
            Dein Feedback hilft uns, die Extension zu verbessern.<br>
            Du kannst den Status deines Feedbacks auf GitHub verfolgen:
          </p>
          <a href="${issueUrl}" target="_blank" class="aicc-feedback-success-link">
            📝 Issue auf GitHub ansehen
          </a>
          <div style="margin-top: 24px;">
            <button class="aicc-feedback-cancel" onclick="document.querySelector('.aicc-feedback-overlay').remove()">
              Schließen
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Schließt das Modal
   */
  close() {
    const overlay = document.querySelector('.aicc-feedback-overlay');
    overlay?.remove();
    this.currentScreenshot = null;
    this.detectionContext = null;
  }

  /**
   * Hilfsfunktionen
   */
  detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) return 'ChatGPT';
    if (hostname.includes('claude.ai')) return 'Claude';
    if (hostname.includes('gemini.google.com')) return 'Gemini';
    return 'Unknown';
  }

  detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome/')) return 'Chrome';
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Safari/')) return 'Safari';
    return 'Unknown';
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Export für Content Script
if (typeof window !== 'undefined') {
  window.FeedbackModal = FeedbackModal;
}
