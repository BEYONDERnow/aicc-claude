/**
 * AI Compliance Checker - Content Script
 * Beta by BEYONDER
 * Überwacht Texteingaben in Echtzeit auf KI-Plattformen
 */

class ComplianceMonitor {
  constructor() {
    this.detector = new ComplianceDetector();
    this.currentLang = this.detectLanguage();
    this.monitoredElements = new Map();
    this.statusIcons = new Map();
    this.isModalShown = false;

    // Debounce Timer für Performance
    this.analyzeTimer = null;
    this.debounceDelay = 300;

    // Platform-spezifische Selektoren
    this.platforms = this.detectPlatform();

    // Current analysis results per element
    this.currentAnalysis = new Map();

    this.init();
  }

  /**
   * Initialisiert den Monitor
   */
  init() {
    console.log('[AI Compliance Checker by BEYONDER] Initialized on', this.platforms.name);

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
          'textarea[placeholder*="Nachricht"]',
          'div[contenteditable="true"][role="textbox"]',
          '.ProseMirror',
          // Edit-Modus spezifische Selektoren
          'textarea[placeholder*="Edit"]',
          'div[contenteditable="true"]'
        ],
        submitSelectors: [
          'button[data-testid="send-button"]',
          'button[data-testid="fruitjuice-send-button"]',
          'button[aria-label*="Send"]',
          'button[aria-label*="Senden"]',
          'button[aria-label*="Save"]'
        ]
      };
    } else if (hostname.includes('gemini.google.com')) {
      return {
        name: 'Gemini',
        inputSelectors: [
          '.ql-editor[contenteditable="true"]',
          'div[contenteditable="true"][role="textbox"]',
          'rich-textarea',
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
    const info = {
      lastAnalysis: null,
      isContentEditable: element.contentEditable === 'true',
      originalContent: null,
      observer: null
    };

    this.monitoredElements.set(element, info);

    // Event Listener
    element.addEventListener('input', () => this.handleInput(element));
    // Wichtig: capture:true damit unser Handler vor ChatGPT's Handler greift
    element.addEventListener('keydown', (e) => this.handleKeyDown(element, e), { capture: true });
    element.addEventListener('paste', () => this.handlePaste(element));

    // Beobachte Änderungen am Element (z.B. wenn Text gelöscht wird nach Absenden)
    const observer = new MutationObserver(() => {
      // Verzögert neu analysieren
      clearTimeout(this.analyzeTimer);
      this.analyzeTimer = setTimeout(() => {
        this.analyzeElement(element);
      }, this.debounceDelay);
    });
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Speichere Observer
    info.observer = observer;

    // Erstelle Status-Icon
    this.createStatusIcon(element);

    // Überwache Submit-Button für dieses Element
    this.attachSubmitButtonHandler(element);

    // Initial analysis
    setTimeout(() => this.analyzeElement(element), 100);

    console.log('[AI Compliance Checker] Monitoring element:', element);
  }

  /**
   * Hängt Click-Handler an Submit-Buttons an
   */
  attachSubmitButtonHandler(element) {
    // Finde Submit-Button für dieses Element
    const submitButton = this.findSubmitButton(element);

    if (submitButton && !submitButton.hasAttribute('data-aicc-monitored')) {
      // Markiere Button als überwacht
      submitButton.setAttribute('data-aicc-monitored', 'true');

      // Füge Click-Handler hinzu (capture phase!)
      submitButton.addEventListener('click', (e) => {
        const analysis = this.currentAnalysis.get(element);

        // Wenn Warnungen oder kritische Daten erkannt wurden
        if (analysis && (analysis.status === 'critical' || analysis.status === 'warning')) {
          // Blockiere den originalen Click
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Zeige Modal
          this.showWarningModal(analysis, element, submitButton);

          return false;
        }
      }, { capture: true });

      console.log('[AI Compliance Checker] Monitoring submit button:', submitButton);
    }

    // Fallback: Wenn Button noch nicht existiert, versuche später nochmal
    if (!submitButton) {
      setTimeout(() => this.attachSubmitButtonHandler(element), 500);
    }
  }

  /**
   * Erstellt Status-Icon neben dem Eingabefeld
   */
  createStatusIcon(element) {
    if (this.statusIcons.has(element)) return;

    // Create wrapper for icon
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'aicc-status-icon-wrapper';
    iconWrapper.setAttribute('data-status', 'safe');

    iconWrapper.innerHTML = `
      <div class="aicc-status-icon" data-status="safe">
        <svg width="24" height="24" viewBox="0 0 24 24" class="aicc-icon-svg">
          <circle cx="12" cy="12" r="10" class="aicc-icon-circle"/>
          <path d="M8 12l3 3 5-5" class="aicc-icon-check" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="aicc-badge" style="display: none;">0</div>
      </div>
    `;

    // Positioniere das Icon
    this.positionIcon(element, iconWrapper);
    document.body.appendChild(iconWrapper);

    // Click handler für Icon
    const icon = iconWrapper.querySelector('.aicc-status-icon');
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showOverlay(element);
    });

    this.statusIcons.set(element, iconWrapper);

    // Update Position bei Scroll/Resize
    const updatePosition = () => this.positionIcon(element, iconWrapper);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    // Hide when element is not visible
    const checkVisibility = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        iconWrapper.style.display = 'none';
      } else {
        iconWrapper.style.display = 'block';
        updatePosition();
      }
    };
    setInterval(checkVisibility, 500);
  }

  /**
   * Positioniert das Status-Icon
   */
  positionIcon(element, iconWrapper) {
    const rect = element.getBoundingClientRect();

    // Stelle sicher Element ist sichtbar
    if (rect.width === 0 || rect.height === 0) {
      iconWrapper.style.display = 'none';
      return;
    }

    iconWrapper.style.display = 'block';
    iconWrapper.style.position = 'fixed';
    iconWrapper.style.top = `${rect.top + 8}px`;
    iconWrapper.style.right = `${window.innerWidth - rect.right + 8}px`;
    iconWrapper.style.zIndex = '999999';
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
  handlePaste(element) {
    setTimeout(() => {
      this.analyzeElement(element);
    }, 100);
  }

  /**
   * Handle KeyDown Event - Prüfe Enter-Taste
   */
  handleKeyDown(element, event) {
    // Enter ohne Shift = Absenden
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      const analysis = this.currentAnalysis.get(element);
      if (analysis && (analysis.status === 'critical' || analysis.status === 'warning')) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.showWarningModal(analysis, element);
        return false;
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
    this.currentAnalysis.set(element, analysis);

    const info = this.monitoredElements.get(element);
    if (info) {
      info.lastAnalysis = analysis;
    }

    // Update visuelles Feedback
    this.updateStatusIcon(element, analysis);
    this.highlightText(element, analysis);
  }

  /**
   * Holt Text aus Element
   */
  getElementText(element) {
    if (element.contentEditable === 'true') {
      return element.innerText || element.textContent || '';
    }
    return element.value || '';
  }

  /**
   * Updated das Status-Icon
   */
  updateStatusIcon(element, analysis) {
    const iconWrapper = this.statusIcons.get(element);
    if (!iconWrapper) return;

    const icon = iconWrapper.querySelector('.aicc-status-icon');
    const badge = iconWrapper.querySelector('.aicc-badge');
    const svg = iconWrapper.querySelector('.aicc-icon-svg');

    // Update Status
    icon.setAttribute('data-status', analysis.status);
    iconWrapper.setAttribute('data-status', analysis.status);

    // Update Badge
    if (analysis.detections.length > 0) {
      badge.textContent = analysis.detections.length;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }

    // Update Icon SVG basierend auf Status
    let iconPath;
    switch (analysis.status) {
      case 'safe':
        iconPath = 'M8 12l3 3 5-5';
        break;
      case 'warning':
        iconPath = 'M12 8v4M12 16h.01';
        break;
      case 'critical':
        iconPath = 'M8 8l8 8M8 16l8-8';
        break;
    }

    const checkPath = svg.querySelector('.aicc-icon-check');
    checkPath.setAttribute('d', iconPath);

    // Tooltip
    const statusText = this.detector.t(`status.${analysis.status}`, this.currentLang);
    icon.title = `${statusText} (${analysis.detections.length})`;
  }

  /**
   * Markiert erkannte sensible Daten im Text
   */
  highlightText(element, analysis) {
    if (element.contentEditable !== 'true') {
      // Für textarea können wir keine Inline-Highlights erstellen
      return;
    }

    // Für contenteditable Elemente - verwende verbesserten Ansatz
    this.highlightContentEditable(element, analysis);
  }

  /**
   * Highlightet Text in contenteditable Element
   * VERBESSERT: Erhält Zeilenumbrüche durch \n → <br> Konvertierung
   */
  highlightContentEditable(element, analysis) {
    if (analysis.highlightRanges.length === 0) {
      // Entferne alle highlights
      const highlights = element.querySelectorAll('.aicc-highlight');
      highlights.forEach(h => {
        const text = h.textContent;
        h.replaceWith(document.createTextNode(text));
      });
      element.normalize();
      return;
    }

    // Hole aktuellen Text mit innerText (erhält \n für Zeilenumbrüche)
    const text = element.innerText || element.textContent || '';

    // Speichere Cursor-Position
    const selection = window.getSelection();
    let cursorOffset = 0;
    if (selection.rangeCount > 0) {
      try {
        const range = selection.getRangeAt(0);
        cursorOffset = range.startOffset;
      } catch (e) {
        // Ignore cursor errors
      }
    }

    // Erstelle neue HTML mit Highlights
    let lastIndex = 0;
    let html = '';

    analysis.highlightRanges.forEach(range => {
      // Text vor dem Highlight (konvertiere \n zu <br>)
      const beforeText = text.substring(lastIndex, range.start);
      html += this.escapeHtml(beforeText).replace(/\n/g, '<br>');

      // Highlighted text
      const highlightedText = text.substring(range.start, range.end);
      const detection = analysis.detections.find(d => d.match === highlightedText);
      const title = detection ? `${detection.name}: ${detection.description}` : '';

      html += `<mark class="aicc-highlight aicc-highlight-${range.severity}" data-severity="${range.severity}" title="${this.escapeHtml(title)}">${this.escapeHtml(highlightedText)}</mark>`;

      lastIndex = range.end;
    });

    // Restlicher Text (konvertiere \n zu <br>)
    const remainingText = text.substring(lastIndex);
    html += this.escapeHtml(remainingText).replace(/\n/g, '<br>');

    // Update DOM nur wenn nötig
    const currentHtml = element.innerHTML;

    if (this.stripMarks(currentHtml) !== this.stripMarks(html)) {
      element.innerHTML = html;

      // Versuche Cursor wiederherzustellen
      try {
        const range = document.createRange();
        const sel = window.getSelection();
        const textNode = this.findTextNode(element, cursorOffset);
        if (textNode) {
          range.setStart(textNode.node, Math.min(textNode.offset, textNode.node.length));
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } catch (e) {
        // Cursor konnte nicht wiederhergestellt werden - nicht kritisch
      }
    }
  }

  /**
   * Findet TextNode an bestimmter Position
   */
  findTextNode(element, targetOffset) {
    let currentOffset = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      if (currentOffset + nodeLength >= targetOffset) {
        return {
          node: node,
          offset: targetOffset - currentOffset
        };
      }
      currentOffset += nodeLength;
    }

    return null;
  }

  /**
   * Entfernt <mark> Tags für Vergleich
   */
  stripMarks(html) {
    return html.replace(/<mark[^>]*>/g, '').replace(/<\/mark>/g, '');
  }

  /**
   * Zeigt Overlay mit detaillierter Analyse
   */
  showOverlay(element) {
    const analysis = this.currentAnalysis.get(element);
    if (!analysis || analysis.detections.length === 0) {
      return;
    }

    // Entferne existierendes Overlay
    const existingOverlay = document.querySelector('.aicc-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'aicc-overlay';
    overlay.innerHTML = `
      <div class="aicc-overlay-backdrop"></div>
      <div class="aicc-overlay-content">
        <div class="aicc-overlay-header">
          <h2>
            ${analysis.status === 'critical' ? '🔴' : '🟠'}
            ${this.currentLang === 'de' ? 'Erkannte sensible Daten' : 'Detected Sensitive Data'}
          </h2>
          <button class="aicc-overlay-close">&times;</button>
        </div>
        <div class="aicc-overlay-body">
          ${this.generateOverlayTable(analysis)}
        </div>
        <div class="aicc-overlay-footer">
          <div class="aicc-overlay-branding">
            <div class="aicc-branding-text">
              <strong>AI Compliance Checker</strong> • Beta by <strong>BEYONDER</strong>
            </div>
            <div class="aicc-branding-subtext">
              ${this.currentLang === 'de'
                ? '100% lokal • DSGVO/DSG-konform • Keine Datenübertragung'
                : '100% local • GDPR compliant • No data transmission'}
            </div>
          </div>
          <button class="aicc-btn aicc-btn-primary aicc-overlay-ok">
            ${this.currentLang === 'de' ? 'Verstanden' : 'Got it'}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Event handlers
    const close = () => overlay.remove();
    overlay.querySelector('.aicc-overlay-close').addEventListener('click', close);
    overlay.querySelector('.aicc-overlay-backdrop').addEventListener('click', close);
    overlay.querySelector('.aicc-overlay-ok').addEventListener('click', close);

    // Prevent close on content click
    overlay.querySelector('.aicc-overlay-content').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Generiert Tabelle für Overlay
   */
  generateOverlayTable(analysis) {
    let html = '<table class="aicc-detection-table">';
    html += '<thead><tr>';
    html += `<th>${this.currentLang === 'de' ? 'Typ' : 'Type'}</th>`;
    html += `<th>${this.currentLang === 'de' ? 'Erkannter Wert' : 'Detected Value'}</th>`;
    html += `<th>${this.currentLang === 'de' ? 'Beschreibung' : 'Description'}</th>`;
    html += `<th>${this.currentLang === 'de' ? 'Risiko' : 'Risk'}</th>`;
    html += '</tr></thead>';
    html += '<tbody>';

    // Sortiere nach Severity
    const sorted = [...analysis.detections].sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (a.severity !== 'critical' && b.severity === 'critical') return 1;
      return 0;
    });

    sorted.forEach(detection => {
      html += '<tr>';
      html += `<td><strong>${this.escapeHtml(detection.name)}</strong><br><small class="aicc-category">${this.detector.t(`categories.${detection.category}`, this.currentLang)}</small></td>`;
      html += `<td><code>${this.escapeHtml(detection.match)}</code></td>`;
      html += `<td>${this.escapeHtml(detection.description)}</td>`;
      html += `<td><span class="aicc-severity-badge aicc-severity-${detection.severity}">${this.detector.t(detection.severity, this.currentLang)}</span></td>`;
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }

  /**
   * Zeigt Warning Modal vor dem Absenden
   * @param {Object} analysis - Analyse-Ergebnis
   * @param {HTMLElement} element - Das Textfeld
   * @param {HTMLElement} submitButton - Optional: Der Submit-Button (falls vom Button geklickt)
   */
  showWarningModal(analysis, element, submitButton = null) {
    if (this.isModalShown) return;
    this.isModalShown = true;

    const modal = document.createElement('div');
    modal.className = 'aicc-modal';
    modal.innerHTML = `
      <div class="aicc-modal-overlay"></div>
      <div class="aicc-modal-content">
        <div class="aicc-modal-header">
          <h2>
            ${analysis.status === 'critical' ? '🛑' : '⚠️'}
            ${this.currentLang === 'de' ? 'Achtung: Sensible Daten erkannt' : 'Warning: Sensitive Data Detected'}
          </h2>
          <button class="aicc-modal-close">&times;</button>
        </div>
        <div class="aicc-modal-body">
          <div class="aicc-modal-warning-box ${analysis.status === 'critical' ? 'aicc-critical-box' : 'aicc-warning-box'}">
            <strong>${this.currentLang === 'de' ? 'Warnung:' : 'Warning:'}</strong>
            ${analysis.status === 'critical'
              ? (this.currentLang === 'de'
                ? 'Ihre Nachricht enthält kritische personenbezogene oder sensible Daten. Das Teilen dieser Informationen mit KI-Systemen kann gegen Datenschutzbestimmungen (DSGVO/DSG) verstoßen.'
                : 'Your message contains critical personal or sensitive data. Sharing this information with AI systems may violate data protection regulations (GDPR).')
              : (this.currentLang === 'de'
                ? 'Ihre Nachricht könnte sensible Daten enthalten. Bitte überprüfen Sie die folgenden Erkennungen.'
                : 'Your message may contain sensitive data. Please review the following detections.')}
          </div>
          ${this.generateOverlayTable(analysis)}
        </div>
        <div class="aicc-modal-footer">
          <div class="aicc-modal-branding">
            <strong>AI Compliance Checker</strong> • Beta by <strong>BEYONDER</strong>
          </div>
          <div class="aicc-modal-actions">
            <button class="aicc-btn aicc-btn-secondary aicc-modal-cancel">
              ${this.currentLang === 'de' ? 'Abbrechen & Bearbeiten' : 'Cancel & Edit'}
            </button>
            <button class="aicc-btn aicc-btn-warning aicc-modal-send" autofocus>
              ${this.currentLang === 'de' ? 'Warnung ignorieren & abschicken' : 'Ignore Warning & Send'}
            </button>
          </div>
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
    modal.querySelector('.aicc-modal-cancel').addEventListener('click', () => {
      close();
      element.focus();
    });

    // Enter-Taste im Modal abfangen
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Klicke den Send-Button
        const sendBtn = modal.querySelector('.aicc-modal-send');
        if (sendBtn) {
          sendBtn.click();
        }
      }
    });

    const sendBtn = modal.querySelector('.aicc-modal-send');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        close();

        // Warte kurz, dann simuliere das Absenden
        setTimeout(() => {
          // Temporär: Analysestatus auf "safe" setzen, damit unser Handler nicht nochmal greift
          const tempAnalysis = { status: 'safe', detections: [], highlightRanges: [] };
          this.currentAnalysis.set(element, tempAnalysis);

          // Wenn Submit-Button übergeben wurde, klicke darauf
          if (submitButton) {
            // Entferne temporär unser Monitoring-Attribut
            const wasMonitored = submitButton.getAttribute('data-aicc-monitored');
            submitButton.removeAttribute('data-aicc-monitored');

            // Klicke Button
            submitButton.click();

            // Stelle Monitoring wieder her (nach kurzer Verzögerung)
            setTimeout(() => {
              if (wasMonitored) {
                submitButton.setAttribute('data-aicc-monitored', 'true');
              }
            }, 500);
          } else {
            // Fallback: Suche Submit-Button oder simuliere Enter
            const foundButton = this.findSubmitButton(element);
            if (foundButton) {
              foundButton.click();
            } else {
              // Trigger Enter event
              const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
              });
              element.dispatchEvent(event);
            }
          }

          // Nach 1 Sekunde: Analysiere neu (für nächste Nachricht)
          setTimeout(() => {
            this.analyzeElement(element);
          }, 1000);
        }, 100);
      });
    }

    // Prevent modal close on content click
    modal.querySelector('.aicc-modal-content').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Findet den Submit-Button
   */
  findSubmitButton(element) {
    let parent = element.parentElement;
    let attempts = 0;
    while (parent && attempts < 10) {
      for (const selector of this.platforms.submitSelectors) {
        const button = parent.querySelector(selector);
        if (button) return button;
      }
      parent = parent.parentElement;
      attempts++;
    }
    return null;
  }

  /**
   * Beobachtet DOM für neue Eingabefelder
   */
  observeDOM() {
    const observer = new MutationObserver((mutations) => {
      // Debounce - kürzeres Intervall für schnellere Erkennung von Edit-Feldern
      clearTimeout(this.observerTimeout);
      this.observerTimeout = setTimeout(() => {
        this.findAndMonitorInputs();
      }, 200);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Zusätzlich: Prüfe regelmäßig auf neue Felder (Fallback)
    setInterval(() => {
      this.findAndMonitorInputs();
    }, 2000);
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
