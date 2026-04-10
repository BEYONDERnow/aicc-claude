/**
 * AI Compliance Checker - Text Anonymizer
 * Version 2.11.0 - Lokale Anonymisierung / Entanonymisierung
 * by BEYONDER
 *
 * Ersetzt erkannte sensible Daten durch typisierte Platzhalter vor dem Senden
 * an KI-Plattformen. Ermöglicht anschließend lokale Entanonymisierung der
 * KI-Antwort. 100% lokal, keine Daten verlassen den Browser.
 *
 * Platzhalter-Format: [TYP_N] z.B. [PERSON_1], [EMAIL_1], [IBAN_1]
 */

class TextAnonymizer {
  constructor() {
    // Mapping: placeholder → original value
    this.mapping = new Map();
    // Reverse mapping: original value → placeholder (für Deduplizierung)
    this.reverseMapping = new Map();
    // Counters per type for numbered placeholders
    this.typeCounters = {};
    // Flag whether active anonymization mapping exists
    this.hasActiveMapping = false;

    // Restore mapping from session storage if available
    this._restoreMapping();
  }

  /**
   * Mapping der Detection-IDs zu menschenlesbaren Platzhalter-Typen
   */
  static get TYPE_MAP() {
    return {
      // Namen
      'name_ner': 'PERSON',
      'name_standalone': 'PERSON',
      'name_context': 'PERSON',

      // E-Mail
      'email': 'EMAIL',

      // Finanzen
      'iban': 'IBAN',
      'credit_card': 'KREDITKARTE',
      'currency_amount': 'BETRAG',
      'money_nlp': 'BETRAG',
      'salary': 'GEHALT',

      // Telefon
      'phone_swiss': 'TELEFON',
      'phone_german': 'TELEFON',
      'phone_intl': 'TELEFON',

      // Adressen / Orte
      'address_street': 'ADRESSE',
      'zip_swiss': 'PLZ',
      'location_nlp': 'ORT',

      // Identifikation
      'ssn_swiss': 'AHV_NR',
      'passport': 'AUSWEIS_NR',

      // Zugangsdaten
      'password': 'PASSWORT',
      'api_key_stripe': 'API_KEY',
      'api_key_stripe_test': 'API_KEY',
      'api_key_aws': 'API_KEY',
      'api_key_google': 'API_KEY',
      'api_key_github': 'API_KEY',
      'api_key_generic': 'API_KEY',

      // Datum
      'date_of_birth': 'GEBURTSDATUM',
      'birthdate_nlp': 'GEBURTSDATUM',

      // IP
      'ip_address': 'IP_ADRESSE',

      // Vertraulich
      'company_confidential': 'VERTRAULICH',

      // Organisationen
      'organization_nlp': 'ORGANISATION',

      // Dateianhänge
      'file_attachment': 'DATEI'
    };
  }

  /**
   * Anonymisiert erkannte sensible Daten im Text
   *
   * @param {string} text - Der Originaltext
   * @param {Array} detections - Array von Detection-Objekten mit {id, match, start, end}
   * @returns {string} Anonymisierter Text mit Platzhaltern
   */
  anonymize(text, detections) {
    if (!text || !detections || detections.length === 0) {
      return text;
    }

    // Reset für neue Anonymisierung
    this.mapping.clear();
    this.reverseMapping.clear();
    this.typeCounters = {};

    // Sortiere Detections nach Position (absteigend) für rückwärtige Ersetzung
    // Dadurch bleiben Start/End-Positionen korrekt
    const sortedDetections = [...detections]
      .filter(d => d.match && d.start !== undefined && d.end !== undefined)
      // Filtere Dateianhänge (haben start=0, end=0 und sind kein Text)
      .filter(d => d.id !== 'file_attachment')
      // Entferne Duplikate (gleiche Position)
      .filter((d, index, arr) => {
        return !arr.some((other, otherIndex) =>
          otherIndex < index &&
          other.start === d.start &&
          other.end === d.end
        );
      })
      .sort((a, b) => b.start - a.start);

    let anonymizedText = text;

    for (const detection of sortedDetections) {
      const originalValue = detection.match;
      const placeholder = this._getOrCreatePlaceholder(originalValue, detection.id);

      // Ersetze an der spezifischen Position
      const before = anonymizedText.substring(0, detection.start);
      const after = anonymizedText.substring(detection.end);
      anonymizedText = before + placeholder + after;
    }

    // Speichere Mapping
    this.hasActiveMapping = this.mapping.size > 0;
    this._saveMapping();

    console.log(`[AICC Anonymizer] ${this.mapping.size} Werte anonymisiert`);
    console.log('[AICC Anonymizer] Mapping:', Object.fromEntries(this.mapping));

    return anonymizedText;
  }

  /**
   * Entanonymisiert Text - ersetzt Platzhalter durch Originalwerte
   *
   * @param {string} text - Text mit Platzhaltern
   * @returns {string} Text mit wiederhergestellten Originalwerten
   */
  deanonymize(text) {
    if (!text || this.mapping.size === 0) {
      return text;
    }

    let result = text;

    // Sortiere Platzhalter nach Länge (längste zuerst) um Teilersetzungen zu vermeiden
    // z.B. [PERSON_10] vor [PERSON_1]
    const sortedEntries = [...this.mapping.entries()]
      .sort((a, b) => b[0].length - a[0].length);

    for (const [placeholder, original] of sortedEntries) {
      // Ersetze ALLE Vorkommen des Platzhalters (global)
      const escapedPlaceholder = placeholder.replace(/[[\]]/g, '\\$&');
      const regex = new RegExp(escapedPlaceholder, 'g');
      result = result.replace(regex, original);
    }

    console.log(`[AICC Anonymizer] Text entanonymisiert (${this.mapping.size} Werte)`);

    return result;
  }

  /**
   * Entanonymisiert DOM-Element - ersetzt Platzhalter in allen Text-Knoten
   *
   * @param {HTMLElement} element - Das DOM-Element dessen Text entanonymisiert werden soll
   */
  deanonymizeElement(element) {
    if (!element || this.mapping.size === 0) return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    // Sortiere Platzhalter nach Länge (längste zuerst)
    const sortedEntries = [...this.mapping.entries()]
      .sort((a, b) => b[0].length - a[0].length);

    let replacedCount = 0;

    for (const textNode of textNodes) {
      let content = textNode.textContent;
      let changed = false;

      for (const [placeholder, original] of sortedEntries) {
        if (content.includes(placeholder)) {
          const escapedPlaceholder = placeholder.replace(/[[\]]/g, '\\$&');
          content = content.replace(new RegExp(escapedPlaceholder, 'g'), original);
          changed = true;
          replacedCount++;
        }
      }

      if (changed) {
        textNode.textContent = content;
      }
    }

    console.log(`[AICC Anonymizer] DOM entanonymisiert (${replacedCount} Ersetzungen)`);
  }

  /**
   * Löscht das aktuelle Mapping
   */
  clearMapping() {
    this.mapping.clear();
    this.reverseMapping.clear();
    this.typeCounters = {};
    this.hasActiveMapping = false;
    this._removeStoredMapping();
    console.log('[AICC Anonymizer] Mapping gelöscht');
  }

  /**
   * Prüft ob ein aktives Mapping existiert
   * @returns {boolean}
   */
  hasMapping() {
    return this.hasActiveMapping && this.mapping.size > 0;
  }

  /**
   * Gibt die Anzahl der gemappten Platzhalter zurück
   * @returns {number}
   */
  getMappingCount() {
    return this.mapping.size;
  }

  /**
   * Gibt alle Platzhalter als Array zurück (für UI-Anzeige)
   * @returns {Array<{placeholder: string, original: string}>}
   */
  getMappingEntries() {
    return [...this.mapping.entries()].map(([placeholder, original]) => ({
      placeholder,
      original
    }));
  }

  // === Private Methoden ===

  /**
   * Gibt einen existierenden Platzhalter zurück oder erstellt einen neuen
   * Dedupliziert: Gleiche Originalwerte erhalten denselben Platzhalter
   *
   * @param {string} originalValue - Der Originalwert
   * @param {string} detectionId - Die Detection-ID (z.B. 'email', 'name_ner')
   * @returns {string} Der Platzhalter (z.B. '[PERSON_1]')
   */
  _getOrCreatePlaceholder(originalValue, detectionId) {
    // Prüfe ob dieser Wert bereits einen Platzhalter hat
    const normalizedValue = originalValue.trim();
    if (this.reverseMapping.has(normalizedValue)) {
      return this.reverseMapping.get(normalizedValue);
    }

    // Bestimme Typ-Name aus Detection-ID
    const typeName = TextAnonymizer.TYPE_MAP[detectionId] || 'DATEN';

    // Inkrementiere Counter für diesen Typ
    if (!this.typeCounters[typeName]) {
      this.typeCounters[typeName] = 0;
    }
    this.typeCounters[typeName]++;

    const placeholder = `[${typeName}_${this.typeCounters[typeName]}]`;

    // Speichere Mapping bidirektional
    this.mapping.set(placeholder, normalizedValue);
    this.reverseMapping.set(normalizedValue, placeholder);

    return placeholder;
  }

  /**
   * Speichert das Mapping in chrome.storage.session
   * Session-Storage lebt nur so lange wie der Browser geöffnet ist
   */
  async _saveMapping() {
    const data = {
      aicc_anonymization_mapping: Object.fromEntries(this.mapping),
      aicc_anonymization_active: this.hasActiveMapping,
      aicc_anonymization_timestamp: Date.now()
    };

    const storage = await this._getStorage();
    if (!storage) return;

    try {
      await storage.set(data);
    } catch (error) {
      console.warn('[AICC Anonymizer] Konnte Mapping nicht speichern:', error);
    }
  }

  /**
   * Stellt das Mapping aus chrome.storage wieder her
   */
  async _restoreMapping() {
    const storage = await this._getStorage();
    if (!storage) return;

    try {
      const result = await storage.get([
        'aicc_anonymization_mapping',
        'aicc_anonymization_active',
        'aicc_anonymization_timestamp'
      ]);

      if (result.aicc_anonymization_mapping && result.aicc_anonymization_active) {
        // Prüfe ob Mapping nicht zu alt ist (max 1 Stunde)
        const age = Date.now() - (result.aicc_anonymization_timestamp || 0);
        const MAX_AGE = 60 * 60 * 1000; // 1 Stunde

        if (age < MAX_AGE) {
          this.mapping = new Map(Object.entries(result.aicc_anonymization_mapping));
          this.hasActiveMapping = true;

          // Reverse Mapping aufbauen
          for (const [placeholder, original] of this.mapping) {
            this.reverseMapping.set(original, placeholder);
          }

          console.log(`[AICC Anonymizer] Mapping wiederhergestellt (${this.mapping.size} Einträge)`);
        } else {
          console.log('[AICC Anonymizer] Mapping zu alt, wird gelöscht');
          this._removeStoredMapping();
        }
      }
    } catch (error) {
      console.warn('[AICC Anonymizer] Konnte Mapping nicht wiederherstellen:', error);
    }
  }

  /**
   * Entfernt gespeichertes Mapping aus Storage
   */
  async _removeStoredMapping() {
    const storage = await this._getStorage();
    if (!storage) return;

    try {
      await storage.remove([
        'aicc_anonymization_mapping',
        'aicc_anonymization_active',
        'aicc_anonymization_timestamp'
      ]);
    } catch (error) {
      console.warn('[AICC Anonymizer] Konnte Mapping nicht entfernen:', error);
    }
  }

  /**
   * Ermittelt verfügbaren Storage mit robuster Fallback-Logik.
   * Probiert session zuerst (Daten sterben mit Browser-Session), fällt auf local zurück.
   * @returns {Promise<chrome.storage.StorageArea|null>}
   */
  async _getStorage() {
    if (typeof chrome === 'undefined' || !chrome.storage) return null;

    // Session-Storage bevorzugt (stirbt mit Browser-Session = ideal für Anonymisierungs-Mapping)
    if (chrome.storage.session) {
      try {
        // Probe-Zugriff um "Access not allowed" zu erkennen
        await chrome.storage.session.get([]);
        return chrome.storage.session;
      } catch {
        // Fallthrough zu local
      }
    }

    if (chrome.storage.local) {
      return chrome.storage.local;
    }

    return null;
  }
}

// Globale Instanz
const textAnonymizer = new TextAnonymizer();
