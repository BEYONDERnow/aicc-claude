/**
 * AI Compliance Checker - Content Script
 * Überwacht Texteingaben in Echtzeit auf KI-Plattformen
 */

class ComplianceMonitor {
  constructor() {
    this.detector = new ComplianceDetector();
    this.currentLang = this.detectLanguage();
    this.monitoredElements = new Map();
    this.statusIndicators = new Map();
    this.tooltips = new Map();
    this.isModalShown = false;

    // Debounce Timer für Performance
    this.analyzeTimer = null;
    this.debounceDelay = 300;

    // Platform-spezifische Selektoren
    this.platforms = this.detectPlatform();

    this.init();
  }

  /**
   * Initialisiert den Monitor
   */
  init() {
    console.log('[AI Compliance Checker] Initialized on', this.platforms.name);

    // Warte auf DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startMonitoring());
    } else {
      this.startMonitoring();
    }
  }

  /**
   * Startet die Überwachung
   */
  startMonitoring() {
    // Finde und überwache Eingabefelder
    this.findAndMonitorInputs();

    // Beobachte DOM-Änderungen für dynamisch hinzugefügte Elemente
    this.observeDOM();
  }

  /**
   * Erkennt die aktuelle Plattform
   */
  detectPlatform() {
    const hostname = window.location.hostname;

    if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) {
      return {
        name: 'ChatGPT',
        inputSelectors: [
          '#prompt-textarea',
          'textarea[data-id]',
          'textarea[placeholder*="Message"]',
          'textarea[placeholder*="Nachricht"]'
        ],
        submitSelectors: [
          'button[data-testid="send-button"]',
          'button[aria-label*="Send"]',
          'button[aria-label*="Senden"]'
        ]
      };
    } else if (hostname.includes('gemini.google.com')) {
      return {
        name: 'Gemini',
        inputSelectors: [
          '.ql-editor[contenteditable="true"]',
          'div[contenteditable="true"][role="textbox"]',
          'textarea'
        ],
        submitSelectors: [
          'button[aria-label*="Send"]',
          'button[mattooltip*="Send"]'
        ]
      };
    } else if (hostname.includes('claude.ai')) {
      return {
        name: 'Claude',
        inputSelectors: [
          'div[contenteditable="true"]',
          'textarea[placeholder*="Talk to Claude"]',
          'textarea',
          '.ProseMirror'
        ],
        submitSelectors: [
          'button[aria-label*="Send"]',
          'button[type="submit"]'
        ]
      };
    }

    return {
      name: 'Unknown',
      inputSelectors: ['textarea', 'div[contenteditable="true"]'],
      submitSelectors: ['button[type="submit"]']
    };
  }

  /**
   * Findet und überwacht alle Eingabefelder
   */
  findAndMonitorInputs() {
    this.platforms.inputSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (!this.monitoredElements.has(element)) {
          this.attachToElement(element);
        }
      });
    });
  }

  /**
   * Hängt Event-Listener an ein Element
   */
  attachToElement(element) {
    this.monitoredElements.set(element, {
      lastAnalysis: null,
      isContentEditable: element.contentEditable === 'true'
    });

    // Event Listener
    element.addEventListener('input', (e) => this.handleInput(element));
    element.addEventListener('keydown', (e) => this.handleKeyDown(element, e));
    element.addEventListener('paste', (e) => this.handlePaste(element, e));

    // Erstelle Status-Indikator
    this.createStatusIndicator(element);

    console.log('[AI Compliance Checker] Monitoring element:', element);
  }

  /**
   * Erstellt visuellen Status-Indikator neben dem Eingabefeld
   */
  createStatusIndicator(element) {
    if (this.statusIndicators.has(element)) return;

    const indicator = document.createElement('div');
    indicator.className = 'aicc-status-indicator';
    indicator.setAttribute('data-status', 'safe');
    indicator.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" class="aicc-status-circle"/>
        <path class="aicc-status-icon" d="M6 10l3 3 5-6" stroke="white" stroke-width="2" fill="none"/>
      </svg>
    `;

    // Positioniere den Indikator
    this.positionIndicator(element, indicator);
    document.body.appendChild(indicator);

    this.statusIndicators.set(element, indicator);

    // Update Position bei Scroll/Resize
    window.addEventListener('scroll', () => this.positionIndicator(element, indicator), true);
    window.addEventListener('resize', () => this.positionIndicator(element, indicator));
  }

  /**
   * Positioniert den Status-Indikator relativ zum Element
   */
  positionIndicator(element, indicator) {
    const rect = element.getBoundingClientRect();
    indicator.style.position = 'fixed';
    indicator.style.top = `${rect.top + 10}px`;
    indicator.style.right = `${window.innerWidth - rect.right + 10}px`;
    indicator.style.zIndex = '10000';
  }

  /**
   * Handle Input Event
   */
  handleInput(element) {
    clearTimeout(this.analyzeTimer);
    this.analyzeTimer = setTimeout(() => {
      this.analyzeElement(element);
    }, this.debounceDelay);
  }

  /**
   * Handle Paste Event
   */
  handlePaste(element, event) {
    setTimeout(() => {
      this.analyzeElement(element);
    }, 100);
  }

  /**
   * Handle KeyDown Event - Prüfe Enter-Taste
   */
  handleKeyDown(element, event) {
    // Enter ohne Shift = Absenden
    if (event.key === 'Enter' && !event.shiftKey) {
      const info = this.monitoredElements.get(element);
      if (info && info.lastAnalysis) {
        if (info.lastAnalysis.status === 'critical' || info.lastAnalysis.status === 'warning') {
          event.preventDefault();
          event.stopPropagation();
          this.showWarningModal(info.lastAnalysis, element);
        }
      }
    }
  }

  /**
   * Analysiert den Inhalt eines Elements
   */
  analyzeElement(element) {
    const text = this.getElementText(element);
    const analysis = this.detector.analyze(text, this.currentLang);

    // Speichere Analyse
    const info = this.monitoredElements.get(element);
    if (info) {
      info.lastAnalysis = analysis;
    }

    // Update visuelles Feedback
    this.updateStatusIndicator(element, analysis);
    this.highlightText(element, analysis);
  }

  /**
   * Holt Text aus Element (textarea oder contenteditable)
   */
  getElementText(element) {
    if (element.contentEditable === 'true') {
      return element.innerText || element.textContent || '';
    }
    return element.value || '';
  }

  /**
   * Updated den Status-Indikator
   */
  updateStatusIndicator(element, analysis) {
    const indicator = this.statusIndicators.get(element);
    if (!indicator) return;

    indicator.setAttribute('data-status', analysis.status);

    // Update Icon basierend auf Status
    let iconPath;
    let statusText;

    switch (analysis.status) {
      case 'safe':
        iconPath = 'M6 10l3 3 5-6';
        statusText = this.detector.t('status.safe', this.currentLang);
        break;
      case 'warning':
        iconPath = 'M10 6v6M10 14h.01';
        statusText = this.detector.t('status.warning', this.currentLang);
        break;
      case 'critical':
        iconPath = 'M6 6l8 8M6 14l8-8';
        statusText = this.detector.t('status.critical', this.currentLang);
        break;
    }

    indicator.querySelector('.aicc-status-icon').setAttribute('d', iconPath);
    indicator.title = `${statusText}\n${analysis.detections.length} ${this.currentLang === 'de' ? 'Erkennungen' : 'detections'}`;
  }

  /**
   * Markiert erkannte sensible Daten im Text
   */
  highlightText(element, analysis) {
    if (element.contentEditable !== 'true') {
      // Für textarea können wir keine Inline-Highlights machen
      // Stattdessen Tooltip beim Hovern zeigen
      this.attachHoverTooltip(element, analysis);
      return;
    }

    // Für contenteditable könnten wir Spans einfügen
    // Das ist komplexer und kann die Cursor-Position beeinflussen
    // Für v1 verwenden wir nur Tooltips
    this.attachHoverTooltip(element, analysis);
  }

  /**
   * Fügt Hover-Tooltip zu Element hinzu
   */
  attachHoverTooltip(element, analysis) {
    // Entferne alten Tooltip
    if (this.tooltips.has(element)) {
      const oldTooltip = this.tooltips.get(element);
      if (oldTooltip && oldTooltip.parentNode) {
        oldTooltip.parentNode.removeChild(oldTooltip);
      }
    }

    if (analysis.detections.length === 0) return;

    // Erstelle neuen Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'aicc-tooltip';
    tooltip.innerHTML = this.generateTooltipContent(analysis);

    // Event Listener
    element.addEventListener('mouseenter', () => {
      if (analysis.detections.length > 0) {
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.display = 'block';
        document.body.appendChild(tooltip);
      }
    });

    element.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    });

    this.tooltips.set(element, tooltip);
  }

  /**
   * Generiert Tooltip-Inhalt
   */
  generateTooltipContent(analysis) {
    if (analysis.detections.length === 0) {
      return `<div class="aicc-tooltip-safe">✓ ${this.detector.t('status.safe', this.currentLang)}</div>`;
    }

    let html = '<div class="aicc-tooltip-header">';
    html += analysis.status === 'critical'
      ? `⛔ ${this.detector.t('status.critical', this.currentLang)}`
      : `⚠️ ${this.detector.t('status.warning', this.currentLang)}`;
    html += '</div>';

    html += '<div class="aicc-tooltip-items">';

    // Gruppiere nach Kategorie
    const byCategory = {};
    analysis.detections.forEach(d => {
      if (!byCategory[d.category]) {
        byCategory[d.category] = [];
      }
      byCategory[d.category].push(d);
    });

    Object.keys(byCategory).forEach(category => {
      const items = byCategory[category];
      html += `<div class="aicc-tooltip-category">`;
      html += `<strong>${this.detector.t(`categories.${category}`, this.currentLang)}:</strong>`;
      html += '<ul>';
      items.forEach(item => {
        html += `<li><span class="aicc-severity-${item.severity}">${item.name}</span>: ${item.description}</li>`;
      });
      html += '</ul>';
      html += '</div>';
    });

    html += '</div>';

    return html;
  }

  /**
   * Zeigt Warning Modal vor dem Absenden
   */
  showWarningModal(analysis, element) {
    if (this.isModalShown) return;
    this.isModalShown = true;

    const modal = document.createElement('div');
    modal.className = 'aicc-modal';
    modal.innerHTML = `
      <div class="aicc-modal-overlay"></div>
      <div class="aicc-modal-content">
        <div class="aicc-modal-header">
          <h2>
            ${analysis.status === 'critical' ? '⛔' : '⚠️'}
            ${this.currentLang === 'de' ? 'Compliance-Warnung' : 'Compliance Warning'}
          </h2>
          <button class="aicc-modal-close">&times;</button>
        </div>
        <div class="aicc-modal-body">
          <p class="aicc-modal-intro">
            ${this.currentLang === 'de'
              ? 'Ihre Nachricht enthält möglicherweise sensible Daten. Bitte überprüfen Sie folgende Erkennungen:'
              : 'Your message may contain sensitive data. Please review the following detections:'}
          </p>
          ${this.generateModalDetectionList(analysis)}
          <div class="aicc-modal-warning">
            <strong>${this.currentLang === 'de' ? 'Hinweis:' : 'Note:'}</strong>
            ${this.currentLang === 'de'
              ? 'Personenbezogene und sensible Daten sollten nicht an KI-Systeme übermittelt werden. Dies kann gegen Datenschutzbestimmungen (DSGVO/DSG) verstoßen.'
              : 'Personal and sensitive data should not be transmitted to AI systems. This may violate data protection regulations (GDPR).'}
          </div>
        </div>
        <div class="aicc-modal-footer">
          <button class="aicc-btn aicc-btn-secondary aicc-modal-cancel">
            ${this.currentLang === 'de' ? 'Abbrechen' : 'Cancel'}
          </button>
          <button class="aicc-btn aicc-btn-primary aicc-modal-edit">
            ${this.currentLang === 'de' ? 'Text bearbeiten' : 'Edit Text'}
          </button>
          ${analysis.status === 'warning' ? `
            <button class="aicc-btn aicc-btn-warning aicc-modal-send">
              ${this.currentLang === 'de' ? 'Trotzdem senden' : 'Send Anyway'}
            </button>
          ` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event Handlers
    const close = () => {
      modal.remove();
      this.isModalShown = false;
    };

    modal.querySelector('.aicc-modal-close').addEventListener('click', close);
    modal.querySelector('.aicc-modal-overlay').addEventListener('click', close);
    modal.querySelector('.aicc-modal-cancel').addEventListener('click', close);
    modal.querySelector('.aicc-modal-edit').addEventListener('click', () => {
      close();
      element.focus();
    });

    const sendBtn = modal.querySelector('.aicc-modal-send');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        close();
        this.submitForm(element);
      });
    }

    // Prevent modal close on content click
    modal.querySelector('.aicc-modal-content').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Generiert die Erkennungs-Liste für das Modal
   */
  generateModalDetectionList(analysis) {
    let html = '<div class="aicc-detection-list">';

    // Gruppiere nach Severity
    const critical = analysis.detections.filter(d => d.severity === 'critical');
    const warnings = analysis.detections.filter(d => d.severity === 'warning');

    if (critical.length > 0) {
      html += `<div class="aicc-detection-group aicc-detection-critical">`;
      html += `<h3>⛔ ${this.detector.t('critical', this.currentLang)} (${critical.length})</h3>`;
      html += '<ul>';
      critical.forEach(d => {
        html += `<li>
          <strong>${d.name}</strong>: <code>${this.escapeHtml(d.match)}</code>
          <br><small>${d.description}</small>
        </li>`;
      });
      html += '</ul></div>';
    }

    if (warnings.length > 0) {
      html += `<div class="aicc-detection-group aicc-detection-warning">`;
      html += `<h3>⚠️ ${this.detector.t('warning', this.currentLang)} (${warnings.length})</h3>`;
      html += '<ul>';
      warnings.forEach(d => {
        html += `<li>
          <strong>${d.name}</strong>: <code>${this.escapeHtml(d.match)}</code>
          <br><small>${d.description}</small>
        </li>`;
      });
      html += '</ul></div>';
    }

    html += '</div>';
    return html;
  }

  /**
   * Versucht das Formular abzusenden (für "Send Anyway")
   */
  submitForm(element) {
    // Finde Submit-Button
    const submitButton = this.findSubmitButton(element);
    if (submitButton) {
      submitButton.click();
    } else {
      // Fallback: Enter-Event simulieren
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
      });
      element.dispatchEvent(event);
    }
  }

  /**
   * Findet den Submit-Button für ein Element
   */
  findSubmitButton(element) {
    // Suche in Eltern-Elementen
    let parent = element.parentElement;
    while (parent) {
      for (const selector of this.platforms.submitSelectors) {
        const button = parent.querySelector(selector);
        if (button) return button;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  /**
   * Beobachtet DOM für neue Eingabefelder
   */
  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Prüfe ob das Element selbst ein Input ist
            this.platforms.inputSelectors.forEach(selector => {
              if (node.matches && node.matches(selector)) {
                if (!this.monitoredElements.has(node)) {
                  this.attachToElement(node);
                }
              }
              // Prüfe Kinder
              const children = node.querySelectorAll(selector);
              children.forEach(child => {
                if (!this.monitoredElements.has(child)) {
                  this.attachToElement(child);
                }
              });
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Erkennt Browser-Sprache
   */
  detectLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('de') ? 'de' : 'en';
  }

  /**
   * HTML escapen
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Starte Monitor wenn Seite geladen ist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ComplianceMonitor();
  });
} else {
  new ComplianceMonitor();
}
