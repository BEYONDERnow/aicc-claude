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

    // Overlay containers for virtual highlighting
    this.overlayContainers = new Map();

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
        ],
        // v2.3.5: File-Upload Detection
        fileInputSelectors: [
          'input[type="file"]',
          'button[aria-label*="Attach"]',
          'button[aria-label*="Upload"]'
        ],
        attachedFilesSelectors: [
          '[data-testid="attachment"]',
          '.attachment',
          '.file-attachment',
          '[class*="attachment"]',
          '[class*="file-preview"]'
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
        ],
        // v2.3.5: File-Upload Detection
        fileInputSelectors: [
          'input[type="file"]',
          'button[aria-label*="Attach"]',
          'button[aria-label*="Upload"]'
        ],
        attachedFilesSelectors: [
          '.attachment',
          '[class*="upload"]',
          '[class*="file"]',
          'img[src*="upload"]'
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
        ],
        // v2.3.5: File-Upload Detection
        fileInputSelectors: [
          'input[type="file"]',
          'button[aria-label*="Attach"]',
          'button[aria-label*="file"]'
        ],
        attachedFilesSelectors: [
          '[data-value*=".pdf"]',
          '[data-value*=".doc"]',
          '[data-value*=".txt"]',
          '.file-pill',
          '[class*="attachment"]',
          '[class*="file-card"]'
        ]
      };
    }

    return {
      name: 'Unknown',
      inputSelectors: ['textarea', 'div[contenteditable="true"]'],
      submitSelectors: ['button[type="submit"]'],
      // v2.3.5: Generic file detection
      fileInputSelectors: ['input[type="file"]'],
      attachedFilesSelectors: [
        '[class*="attach"]',
        '[class*="file"]',
        '[class*="upload"]'
      ]
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

    console.log('[AICC] Attached event listeners to element:', element.tagName, element.className || element.id || '(no id/class)');

    // Beobachte Änderungen am Element (z.B. wenn Text gelöscht wird nach Absenden)
    const observer = new MutationObserver((mutations) => {
      // WICHTIG: Ignoriere Änderungen an unseren eigenen Overlays!
      const relevantMutation = mutations.some(mutation => {
        // Prüfe ob die Änderung an unseren Overlay-Containern ist
        if (mutation.target.classList && mutation.target.classList.contains('aicc-overlay-container')) {
          return false;
        }
        // Prüfe ob ein hinzugefügter Node ein Overlay-Container ist
        if (mutation.addedNodes.length > 0) {
          for (let node of mutation.addedNodes) {
            if (node.classList && node.classList.contains('aicc-overlay-container')) {
              return false;
            }
          }
        }
        return true;
      });

      if (!relevantMutation) {
        return; // Ignoriere diese Mutation
      }

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

    // v2.3.5: Überwache File-Inputs für Datei-Attachments
    this.attachFileInputHandler(element);

    // Event Handler für Overlay-Repositioning (mit Throttling für bessere Performance!)
    let overlayUpdateTimer = null;
    let lastOverlayUpdate = 0;
    const throttleDelay = 150; // 150ms Throttle

    const updateOverlays = () => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastOverlayUpdate;

      if (timeSinceLastUpdate < throttleDelay) {
        // Throttle: Ignoriere zu häufige Aufrufe
        clearTimeout(overlayUpdateTimer);
        overlayUpdateTimer = setTimeout(updateOverlays, throttleDelay - timeSinceLastUpdate);
        return;
      }

      lastOverlayUpdate = now;

      // Verwende requestAnimationFrame für flüssige Updates
      requestAnimationFrame(() => {
        const analysis = this.currentAnalysis.get(element);
        if (analysis && analysis.highlightRanges.length > 0) {
          this.highlightText(element, analysis);
        }
      });
    };

    // Update Overlays bei Scroll/Resize (aber throttled!)
    window.addEventListener('scroll', updateOverlays, { passive: true, capture: true });
    window.addEventListener('resize', updateOverlays, { passive: true });

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
        // v2.3.5: Prüfe SOFORT auf Dateien (synchron!)
        const attachedFiles = this.detectAttachedFiles(element);

        let analysis = this.currentAnalysis.get(element);

        // Wenn Dateien gefunden wurden, aber Analysis noch nicht aktualisiert
        if (attachedFiles.length > 0) {
          console.log('[AICC Submit] Files detected:', attachedFiles.length);

          // Blockiere Submit und führe volle Analyse durch
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Führe Analyse mit File-Detection durch
          this.analyzeElement(element).then(() => {
            const newAnalysis = this.currentAnalysis.get(element);
            if (newAnalysis && (newAnalysis.status === 'critical' || newAnalysis.status === 'warning')) {
              this.showWarningModal(newAnalysis, element, submitButton);
            } else {
              // Sende nach Analyse
              this.simulateSubmit(element);
            }
          });

          return false;
        }

        // v2.6.0 FIX: Wenn KEINE Analyse vorhanden ODER Warnungen erkannt
        if (!analysis || analysis.status === 'critical' || analysis.status === 'warning') {
          console.log('[AICC Submit] BLOCKING - Analysis:', analysis ? analysis.status : 'NONE');

          // Blockiere den originalen Click
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Wenn keine Analyse vorhanden, führe sie jetzt durch
          if (!analysis) {
            console.log('[AICC Submit] No analysis found - running analysis...');
            this.analyzeElement(element).then(() => {
              const newAnalysis = this.currentAnalysis.get(element);
              if (newAnalysis && (newAnalysis.status === 'critical' || newAnalysis.status === 'warning')) {
                this.showWarningModal(newAnalysis, element, submitButton);
              } else {
                // Keine Warnungen, sende normal
                this.simulateSubmit(element);
              }
            });
          } else {
            // Analyse vorhanden mit Warnungen - zeige Modal
            this.showWarningModal(analysis, element, submitButton);
          }

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
   * Überwacht File-Inputs für Datei-Attachments
   * VERSION 2.3.5: File Attachment Detection
   */
  attachFileInputHandler(element) {
    // Finde alle File-Input-Elemente im Dokument
    const fileInputSelectors = this.platforms.fileInputSelectors || ['input[type="file"]'];

    const attachFileListener = () => {
      fileInputSelectors.forEach(selector => {
        const fileInputs = document.querySelectorAll(selector);

        fileInputs.forEach(input => {
          if (!input.hasAttribute('data-aicc-file-monitored')) {
            input.setAttribute('data-aicc-file-monitored', 'true');

            // Change-Event wenn Datei ausgewählt wird
            input.addEventListener('change', (e) => {
              console.log('[AICC File Input] File attached, triggering analysis...');

              // Führe sofort Analyse durch
              setTimeout(() => {
                this.analyzeElement(element);
              }, 100);
            });

            console.log('[AICC] Monitoring file input:', input);
          }
        });
      });
    };

    // Initial attachment
    attachFileListener();

    // Wiederhole alle 2 Sekunden (falls File-Input dynamisch hinzugefügt wird)
    setInterval(attachFileListener, 2000);
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

    // Position unten rechts im Viewport (nicht am Textfeld!)
    iconWrapper.style.bottom = '20px';
    iconWrapper.style.right = '20px';
    iconWrapper.style.top = 'auto';
    iconWrapper.style.zIndex = '999999';
  }

  /**
   * Handle Input Event
   */
  handleInput(element) {
    clearTimeout(this.analyzeTimer);

    // Dynamisches Debouncing basierend auf Textlänge
    const text = this.getElementText(element);
    const textLength = text.length;

    // Performance-Optimierung: Längeres Debouncing bei langem Text
    let delay = this.debounceDelay;
    if (textLength > 5000) {
      delay = 800; // 800ms für sehr langen Text
    } else if (textLength > 2000) {
      delay = 500; // 500ms für langen Text
    }

    this.analyzeTimer = setTimeout(() => {
      // Verwende requestAnimationFrame für UI-Updates
      requestAnimationFrame(() => {
        this.analyzeElement(element);
      });
    }, delay);
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
      console.log('[AICC KeyDown] Enter pressed, checking analysis...');

      // v2.3.5: Prüfe SOFORT auf Dateien (synchron!)
      const attachedFiles = this.detectAttachedFiles(element);

      let analysis = this.currentAnalysis.get(element);
      console.log('[AICC KeyDown] Analysis:', analysis ? `Status: ${analysis.status}, Detections: ${analysis.detections?.length || 0}` : 'NONE');
      console.log('[AICC KeyDown] Files:', attachedFiles.length);

      // Wenn Dateien gefunden ODER keine Analysis vorhanden ODER Warnungen
      if (attachedFiles.length > 0 || !analysis || (analysis && (analysis.status === 'critical' || analysis.status === 'warning'))) {
        console.log('[AICC KeyDown] BLOCKING - Running analysis...');
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // Analysiere (inkl. File-Detection) und zeige dann Modal falls nötig
        this.analyzeElement(element).then(() => {
          const newAnalysis = this.currentAnalysis.get(element);
          if (newAnalysis && (newAnalysis.status === 'critical' || newAnalysis.status === 'warning')) {
            this.showWarningModal(newAnalysis, element);
          } else {
            // Keine Warnungen, sende normal
            this.simulateSubmit(element);
          }
        });
        return false;
      }

      console.log('[AICC KeyDown] Safe - Allowing submit');
    }
  }

  /**
   * Simuliert das Absenden (wenn Analyse safe ist)
   */
  simulateSubmit(element) {
    console.log('[AICC] Simulating submit after analysis...');

    // Temporär: Status auf safe setzen
    const tempAnalysis = { status: 'safe', detections: [], highlightRanges: [] };
    this.currentAnalysis.set(element, tempAnalysis);

    // Suche Submit-Button
    const submitButton = this.findSubmitButton(element);
    if (submitButton) {
      submitButton.click();
    } else {
      // Fallback: Trigger Enter event
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

    // Nach 1 Sekunde: Analysiere neu
    setTimeout(() => {
      this.analyzeElement(element);
    }, 1000);
  }

  /**
   * Analysiert den Inhalt eines Elements
   * VERSION 2.0.0: Async für KI-gestützte Analyse
   * VERSION 2.3.5: + File Attachment Detection
   * VERSION 2.4.0: Fix NER position bug when trimming whitespace
   */
  async analyzeElement(element) {
    const text = this.getElementText(element);
    const analysis = await this.detector.analyze(text, this.currentLang);
    console.log('[AICC Analyze] Result:', {
      status: analysis.status,
      detections: analysis.detections.length,
      critical: analysis.detections.filter(d => d.severity === 'critical').length,
      warning: analysis.detections.filter(d => d.severity === 'warning').length
    });

    // v2.3.5: Prüfe auf angehängte Dateien
    const attachedFiles = this.detectAttachedFiles(element);
    analysis.attachedFiles = attachedFiles;

    // Füge File-Warning zu Detections hinzu wenn Dateien vorhanden
    if (attachedFiles.length > 0) {
      const fileDetection = {
        id: 'file_attachment',
        severity: 'warning',
        category: 'files',
        name: this.currentLang === 'de' ? 'Dateianhang' : 'File Attachment',
        description: this.currentLang === 'de'
          ? `${attachedFiles.length} Datei(en) angehängt - Inhalte können sensible Daten enthalten!`
          : `${attachedFiles.length} file(s) attached - may contain sensitive data!`,
        match: attachedFiles.map(f => f.name).join(', '),
        start: 0,
        end: 0,
        files: attachedFiles
      };

      analysis.detections.push(fileDetection);

      // Update Status auf warning wenn safe
      if (analysis.status === 'safe') {
        analysis.status = 'warning';
      }

      console.log('[AICC File Detection] Added file warning:', fileDetection);
    }

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
      // v2.3.9 CRITICAL FIX: Verwende innerText statt normalizeTextWithSpaces!
      // Problem: normalizeTextWithSpaces() mit TreeWalker liest ALLE TextNodes inkl. alte Chat-Messages
      // → 7002 chars statt 68 chars!
      // → Wörter werden abgeschnitten: "Hans-Peter" → "s-Peter"

      // innerText extrahiert nur sichtbaren Text des Elements (ohne Children die nicht dazu gehören)
      return element.innerText || element.textContent || '';
    }
    return element.value || '';
  }

  /**
   * v2.3.4: Normalisiert Text mit Leerzeichen zwischen Block-Elementen
   * Verhindert Wort-Zusammenführung wie bei innerText, aber behält Offset-Konsistenz
   */
  normalizeTextWithSpaces(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let result = '';
    let previousNode = null;
    let node;

    while (node = walker.nextNode()) {
      const text = node.textContent;

      // Wenn vorheriger Node existiert, prüfe ob Leerzeichen nötig ist
      if (previousNode) {
        // Prüfe ob zwischen previousNode und node ein Block-Element ist
        const needsSpace = this.needsSpaceBetweenNodes(previousNode, node);
        if (needsSpace) {
          result += ' '; // Füge Leerzeichen ein
        }
      }

      result += text;
      previousNode = node;
    }

    return result;
  }

  /**
   * v2.3.4: Prüft ob zwischen zwei TextNodes ein Leerzeichen nötig ist
   */
  needsSpaceBetweenNodes(node1, node2) {
    // Wenn letztes Zeichen von node1 oder erstes Zeichen von node2 bereits Whitespace ist
    const text1 = node1.textContent;
    const text2 = node2.textContent;

    if (!text1 || !text2) return false;
    if (/\s$/.test(text1) || /^\s/.test(text2)) return false;

    // Finde gemeinsamen Parent
    let parent1 = node1.parentElement;
    let parent2 = node2.parentElement;

    // Wenn unterschiedliche Block-Parents → Leerzeichen nötig
    const blockElements = ['DIV', 'P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'];

    if (parent1 !== parent2) {
      // Prüfe ob eines der Parents ein Block-Element ist
      while (parent1 && !blockElements.includes(parent1.tagName)) {
        parent1 = parent1.parentElement;
      }
      while (parent2 && !blockElements.includes(parent2.tagName)) {
        parent2 = parent2.parentElement;
      }

      if (parent1 !== parent2) {
        return true; // Unterschiedliche Block-Parents → Leerzeichen
      }
    }

    return false;
  }

  /**
   * v2.3.5: Erkennt angehängte Dateien
   * Prüft ob Dateien an die Nachricht angehängt sind
   */
  detectAttachedFiles(element) {
    const files = [];

    // Methode 1: Suche nach File-Input mit .files Property
    const fileInputs = document.querySelectorAll(
      this.platforms.fileInputSelectors?.join(',') || 'input[type="file"]'
    );

    fileInputs.forEach(input => {
      if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach(file => {
          files.push({
            name: file.name,
            size: file.size,
            type: file.type || this.getFileTypeFromName(file.name),
            lastModified: file.lastModified,
            source: 'file-input'
          });
        });
      }
    });

    // Methode 2: Suche nach visuell dargestellten Attachments
    if (this.platforms.attachedFilesSelectors) {
      const attachedContainers = document.querySelectorAll(
        this.platforms.attachedFilesSelectors.join(',')
      );

      attachedContainers.forEach(container => {
        // Skip wenn bereits via File-Input erfasst
        const fileName = container.textContent?.trim() ||
                        container.getAttribute('data-filename') ||
                        container.getAttribute('data-value') ||
                        container.getAttribute('aria-label');

        if (fileName && fileName.length > 0 && fileName.length < 200) {
          // Prüfe ob es ein Dateiname ist (hat Extension)
          if (/\.[a-zA-Z0-9]{2,4}$/.test(fileName)) {
            // Vermeide Duplikate
            if (!files.some(f => f.name === fileName)) {
              files.push({
                name: fileName,
                size: container.getAttribute('data-size') || 'Unbekannt',
                type: this.getFileTypeFromName(fileName),
                source: 'visual',
                element: container
              });
            }
          }
        }
      });
    }

    console.log('[AICC File Detection]', files.length, 'file(s) detected:', files);
    return files;
  }

  /**
   * v2.3.5: Bestimmt Dateityp aus Dateiname
   */
  getFileTypeFromName(fileName) {
    if (!fileName) return 'unknown';
    const ext = fileName.split('.').pop()?.toLowerCase();

    const typeMap = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'zip': 'application/zip'
    };

    return typeMap[ext] || 'unknown';
  }

  /**
   * v2.3.5: Formatiert Dateigröße für Anzeige
   */
  formatFileSize(bytes) {
    if (bytes === 'Unbekannt' || bytes === 'unknown') return 'Unbekannt';
    if (typeof bytes === 'string') return bytes;

    const num = Number(bytes);
    if (isNaN(num)) return 'Unbekannt';

    if (num < 1024) return num + ' B';
    if (num < 1024 * 1024) return (num / 1024).toFixed(1) + ' KB';
    return (num / 1024 / 1024).toFixed(1) + ' MB';
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
   * NEUE IMPLEMENTIERUNG: Verwendet Overlay-Technik ohne DOM-Modification
   */
  highlightText(element, analysis) {
    // Erstelle oder hole Overlay-Container für dieses Element
    let overlayContainer = this.overlayContainers.get(element);

    // Prüfe ob Container noch im DOM ist
    if (overlayContainer && !document.body.contains(overlayContainer)) {
      overlayContainer = null;
      this.overlayContainers.delete(element);
    }

    if (!overlayContainer) {
      overlayContainer = this.createOverlayContainer(element);
      if (!overlayContainer) {
        // Konnte keinen Container erstellen
        return;
      }
      this.overlayContainers.set(element, overlayContainer);
    }

    // Clear existing overlays (aber nur innerHTML, nicht den Container selbst)
    overlayContainer.innerHTML = '';

    if (analysis.highlightRanges.length === 0) {
      return;
    }

    // Erstelle Overlays für jede erkannte Stelle
    this.createHighlightOverlays(element, analysis, overlayContainer);
  }

  /**
   * Erstellt einen Container für Highlight-Overlays
   */
  createOverlayContainer(element) {
    try {
      // Finde das Parent-Element für relative Positionierung
      const parent = element.parentElement;
      if (!parent) {
        console.warn('[AICC] Element has no parent, cannot create overlay');
        return null;
      }

      const container = document.createElement('div');
      container.className = 'aicc-overlay-container';
      container.setAttribute('data-aicc-overlay', 'true'); // Marker für MutationObserver
      container.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      `;

      // Stelle sicher, dass Parent position: relative hat
      const parentPosition = window.getComputedStyle(parent).position;
      if (parentPosition === 'static') {
        parent.style.position = 'relative';
      }

      // Füge Container als Sibling hinzu (nicht als Child von element!)
      parent.insertBefore(container, element);

      return container;
    } catch (e) {
      console.error('[AICC] Error creating overlay container:', e);
      return null;
    }
  }

  /**
   * Erstellt Overlay-Highlights basierend auf Range API
   */
  createHighlightOverlays(element, analysis, container) {
    // v2.3.4: Verwende normalizeTextWithSpaces (konsistent mit getElementText)
    const text = this.normalizeTextWithSpaces(element);

    // TreeWalker zum Durchlaufen aller TextNodes
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentOffset = 0;
    const textNodes = [];
    let previousNode = null;

    // v2.3.4: Sammle alle TextNodes mit ihren Offsets (inkl. eingefügte Leerzeichen)
    let node;
    while (node = walker.nextNode()) {
      const nodeText = node.textContent;

      // Prüfe ob Leerzeichen vor diesem Node eingefügt wurde
      if (previousNode) {
        const needsSpace = this.needsSpaceBetweenNodes(previousNode, node);
        if (needsSpace) {
          currentOffset += 1; // Berücksichtige eingefügtes Leerzeichen
        }
      }

      textNodes.push({
        node: node,
        start: currentOffset,
        end: currentOffset + nodeText.length,
        text: nodeText
      });
      currentOffset += nodeText.length;
      previousNode = node;
    }

    // Erstelle Overlays für jede Highlight-Range
    analysis.highlightRanges.forEach(highlightRange => {
      const { start, end, severity } = highlightRange;

      // Finde zugehörige Detection für Tooltip
      const detection = analysis.detections.find(d =>
        d.start === start && d.end === end
      ) || analysis.detections.find(d =>
        d.start >= start && d.end <= end
      );

      // Finde TextNodes die diese Range enthalten
      textNodes.forEach(({ node, start: nodeStart, end: nodeEnd }) => {
        // Prüfe ob dieser TextNode die Range überlappt
        if (nodeEnd <= start || nodeStart >= end) {
          return; // Kein Overlap
        }

        // Berechne lokale Offsets innerhalb des TextNodes
        const localStart = Math.max(0, start - nodeStart);
        const localEnd = Math.min(node.textContent.length, end - nodeStart);

        // Erstelle Range für getBoundingClientRect
        try {
          const range = document.createRange();
          range.setStart(node, localStart);
          range.setEnd(node, localEnd);

          const rects = range.getClientRects();

          // Erstelle Overlay für jedes Rect (multi-line support)
          for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            this.createOverlayElement(container, rect, severity, element, detection);
          }
        } catch (e) {
          console.warn('[AICC] Could not create highlight range:', e);
        }
      });
    });
  }

  /**
   * Erstellt ein einzelnes Overlay-Element
   */
  createOverlayElement(container, rect, severity, element, detection) {
    const overlay = document.createElement('div');
    overlay.className = `aicc-highlight-overlay aicc-highlight-overlay-${severity}`;

    // Tooltip-Text aus Detection-Info
    if (detection) {
      const tooltipText = `${detection.name}: ${detection.description}`;
      overlay.setAttribute('title', tooltipText);
      overlay.setAttribute('data-tooltip', tooltipText);
    }

    // Berechne Position relativ zum Element
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const top = rect.top - containerRect.top;
    const left = rect.left - containerRect.left;

    overlay.style.cssText = `
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      pointer-events: none;
      border-radius: 2px;
    `;

    container.appendChild(overlay);
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

    // WICHTIG: Blende alle Highlight-Overlays aus während Info-Overlay offen ist
    document.body.classList.add('aicc-modal-open');

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

          <div class="aicc-validation-report-section">
            <h3>
              ${this.currentLang === 'de' ? '📋 Validierungs-Report für Claude' : '📋 Validation Report for Claude'}
            </h3>
            <p style="margin: 8px 0; font-size: 13px; color: #666;">
              ${this.currentLang === 'de'
                ? 'Kopiere diesen Report und sende ihn an Claude zum Überprüfen der Erkennungen:'
                : 'Copy this report and send it to Claude to validate the detections:'}
            </p>
            <div class="aicc-code-window">
              <div class="aicc-code-header">
                <span class="aicc-code-label">Markdown</span>
                <button class="aicc-copy-btn-overlay" data-copy-target="validation-report-overlay">
                  ${this.currentLang === 'de' ? '📋 Kopieren' : '📋 Copy'}
                </button>
              </div>
              <pre class="aicc-code-content" id="aicc-validation-report-overlay"><code>${this.escapeHtml(this.generateValidationReport(analysis, element))}</code></pre>
            </div>
          </div>
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
    const close = () => {
      overlay.remove();
      // Zeige Highlight-Overlays wieder an
      document.body.classList.remove('aicc-modal-open');
    };
    overlay.querySelector('.aicc-overlay-close').addEventListener('click', close);
    overlay.querySelector('.aicc-overlay-backdrop').addEventListener('click', close);
    overlay.querySelector('.aicc-overlay-ok').addEventListener('click', close);

    // Prevent close on content click
    overlay.querySelector('.aicc-overlay-content').addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Copy button handler
    const copyBtn = overlay.querySelector('.aicc-copy-btn-overlay');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const reportText = this.generateValidationReport(analysis, element);
        navigator.clipboard.writeText(reportText).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = this.currentLang === 'de' ? '✅ Kopiert!' : '✅ Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy:', err);
          copyBtn.textContent = this.currentLang === 'de' ? '❌ Fehler' : '❌ Error';
        });
      });
    }
  }

  /**
   * Generiert Validierungs-Report für Claude
   */
  generateValidationReport(analysis, element = null) {
    const lang = this.currentLang;

    // Gruppiere wie in der Tabelle
    const grouped = {};
    analysis.detections.forEach(detection => {
      const key = detection.match.toLowerCase().trim();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(detection);
    });

    const sortedGroups = Object.entries(grouped).sort((a, b) => {
      const aSeverity = a[1].some(d => d.severity === 'critical') ? 0 : 1;
      const bSeverity = b[1].some(d => d.severity === 'critical') ? 0 : 1;
      return aSeverity - bSeverity;
    });

    // Extrahiere eingegebenen Text
    const inputText = element ? this.getElementText(element) : '';
    const textPreview = inputText.length > 1000
      ? inputText.substring(0, 1000) + '\n\n[... Text gekürzt, insgesamt ' + inputText.length + ' Zeichen ...]'
      : inputText;

    // Erstelle Markdown-Tabelle
    let report = `# AI Compliance Checker - Validierungsreport

## Rolle
Du bist ein Experte für Datenschutz, DSGVO/DSG-Compliance und PII (Personally Identifiable Information) Erkennung.

## Aufgabe
Überprüfe die folgenden ${analysis.detections.length} erkannten sensiblen Daten und validiere ob die Erkennungen korrekt sind.

Zähle am Ende wie viele Erkennungen korrekt (✅) und wie viele falsch (❌) sind.

## Eingegebener Prompt

Der Benutzer hat folgenden Text eingegeben:

\`\`\`
${textPreview}
\`\`\`

## Erkannte Daten

| # | Typ | Wert | Kategorie | Beschreibung | Risiko | Korrekt? |
|---|-----|------|-----------|--------------|--------|----------|
`;

    let counter = 1;
    sortedGroups.forEach(([matchKey, detections]) => {
      const maxSeverity = detections.some(d => d.severity === 'critical') ? 'critical' : 'warning';
      const types = [...new Set(detections.map(d => d.name))].join(', ');
      const categories = [...new Set(detections.map(d => d.category))];
      const categoryText = categories.map(cat =>
        this.detector.t(`categories.${cat}`, lang)
      ).join(', ');
      const descriptions = [...new Set(detections.map(d => d.description))].join(' • ');
      const riskText = this.detector.t(maxSeverity, lang);

      report += `| ${counter} | ${types} | \`${detections[0].match}\` | ${categoryText} | ${descriptions} | ${riskText} | ⬜ |\n`;
      counter++;
    });

    report += `
## Anweisungen
1. **Prüfe jeden Eintrag** ob er tatsächlich sensible Daten enthält
2. **Ersetze ⬜** mit:
   - ✅ wenn korrekt erkannt (True Positive)
   - ❌ wenn falsch erkannt (False Positive)
3. **Ergänze Kommentare** bei:
   - Fehlenden Erkennungen (False Negatives)
   - Zweifelhaften Fällen
4. **Zähle am Ende**:
   - Anzahl ✅ (korrekt)
   - Anzahl ❌ (falsch)
   - Accuracy = ✅ / (✅ + ❌)

## Kontext
- **Tool**: AI Compliance Checker v2.2.2
- **Sprache**: ${lang === 'de' ? 'Deutsch' : 'English'}
- **Textlänge**: ${inputText.length} Zeichen
- **Erkennungen**: ${analysis.detections.length} total (${analysis.detections.filter(d => d.severity === 'critical').length} kritisch, ${analysis.detections.filter(d => d.severity === 'warning').length} Warnungen)
- **Status**: ${analysis.status === 'critical' ? '🔴 Kritisch' : '🟠 Warnung'}

---

Beginne mit der Validierung!`;

    return report;
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

    // Gruppiere Detections nach erkanntem Wert
    const grouped = {};
    analysis.detections.forEach(detection => {
      const key = detection.match.toLowerCase().trim();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(detection);
    });

    // Sortiere Gruppen nach höchster Severity
    const sortedGroups = Object.entries(grouped).sort((a, b) => {
      const aSeverity = a[1].some(d => d.severity === 'critical') ? 0 : 1;
      const bSeverity = b[1].some(d => d.severity === 'critical') ? 0 : 1;
      return aSeverity - bSeverity;
    });

    sortedGroups.forEach(([matchKey, detections]) => {
      // Nimm die höchste Severity
      const maxSeverity = detections.some(d => d.severity === 'critical') ? 'critical' : 'warning';

      // Sammle alle Typ-Namen
      const types = [...new Set(detections.map(d => d.name))].join(', ');

      // Sammle alle Kategorien
      const categories = [...new Set(detections.map(d => d.category))];
      const categoryText = categories.map(cat =>
        this.detector.t(`categories.${cat}`, this.currentLang)
      ).join(', ');

      // Sammle alle Beschreibungen (eindeutige)
      const descriptions = [...new Set(detections.map(d => d.description))].join(' • ');

      html += '<tr>';
      html += `<td><strong>${this.escapeHtml(types)}</strong><br><small class="aicc-category">${categoryText}</small></td>`;
      html += `<td><code>${this.escapeHtml(detections[0].match)}</code></td>`;
      html += `<td>${this.escapeHtml(descriptions)}</td>`;
      html += `<td><span class="aicc-severity-badge aicc-severity-${maxSeverity}">${this.detector.t(maxSeverity, this.currentLang)}</span></td>`;
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

    // WICHTIG: Blende alle Highlight-Overlays aus während Modal offen ist
    document.body.classList.add('aicc-modal-open');

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
          ${analysis.attachedFiles && analysis.attachedFiles.length > 0 ? this.generateFileWarningSection(analysis.attachedFiles) : ''}
          ${this.generateOverlayTable(analysis)}

          <div class="aicc-validation-report-section">
            <h3>
              ${this.currentLang === 'de' ? '📋 Validierungs-Report für Claude' : '📋 Validation Report for Claude'}
            </h3>
            <p style="margin: 8px 0; font-size: 13px; color: #666;">
              ${this.currentLang === 'de'
                ? 'Kopiere diesen Report und sende ihn an Claude zum Überprüfen der Erkennungen:'
                : 'Copy this report and send it to Claude to validate the detections:'}
            </p>
            <div class="aicc-code-window">
              <div class="aicc-code-header">
                <span class="aicc-code-label">Markdown</span>
                <button class="aicc-copy-btn" data-copy-target="validation-report">
                  ${this.currentLang === 'de' ? '📋 Kopieren' : '📋 Copy'}
                </button>
              </div>
              <pre class="aicc-code-content" id="aicc-validation-report"><code>${this.escapeHtml(this.generateValidationReport(analysis, element))}</code></pre>
            </div>
          </div>
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
      // Zeige Highlight-Overlays wieder an
      document.body.classList.remove('aicc-modal-open');
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

    // Copy button handler
    const copyBtn = modal.querySelector('.aicc-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const reportText = this.generateValidationReport(analysis, element);
        navigator.clipboard.writeText(reportText).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = this.currentLang === 'de' ? '✅ Kopiert!' : '✅ Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy:', err);
          copyBtn.textContent = this.currentLang === 'de' ? '❌ Fehler' : '❌ Error';
        });
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
   * v2.3.5: Generiert File-Warning-Sektion für Modal
   */
  generateFileWarningSection(attachedFiles) {
    return `
      <div class="aicc-file-warning-section">
        <h3>
          📎 ${this.currentLang === 'de' ? 'Dateianhänge erkannt' : 'File Attachments Detected'}
        </h3>
        <p class="aicc-file-warning-text">
          ${this.currentLang === 'de'
            ? 'Folgende Dateien sind angehängt. Diese können sensible Daten enthalten:'
            : 'The following files are attached. They may contain sensitive data:'}
        </p>
        <ul class="aicc-file-list">
          ${attachedFiles.map(file => `
            <li class="aicc-file-item">
              <span class="aicc-file-icon">${this.getFileIcon(file.type)}</span>
              <div class="aicc-file-details">
                <strong class="aicc-file-name">${this.escapeHtml(file.name)}</strong>
                <span class="aicc-file-size">${this.formatFileSize(file.size)}</span>
              </div>
            </li>
          `).join('')}
        </ul>
        <div class="aicc-file-warning-note">
          ⚠️ <strong>${this.currentLang === 'de' ? 'Wichtig:' : 'Important:'}</strong>
          ${this.currentLang === 'de'
            ? 'Bitte prüfen Sie die Dateiinhalte manuell auf personenbezogene oder sensible Daten (Namen, E-Mails, IBAN, etc.) bevor Sie diese teilen!'
            : 'Please manually check file contents for personal or sensitive data (names, emails, IBAN, etc.) before sharing!'}
        </div>
      </div>
    `;
  }

  /**
   * v2.3.5: Gibt passendes Icon für Dateityp zurück
   */
  getFileIcon(type) {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('image') || type.includes('png') || type.includes('jpg')) return '🖼️';
    if (type.includes('text')) return '📃';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('json')) return '📋';
    return '📎';
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
