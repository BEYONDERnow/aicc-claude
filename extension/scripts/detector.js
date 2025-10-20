/**
 * AI Compliance Checker - Detection Engine
 * Erkennt personenbezogene und sensible Daten in Text-Eingaben
 * 100% lokal, keine Server-Kommunikation
 */

class ComplianceDetector {
  constructor() {
    this.patterns = this.initializePatterns();
    this.translations = this.initializeTranslations();
  }

  /**
   * Initialisiert alle Erkennungs-Pattern für verschiedene Datentypen
   */
  initializePatterns() {
    return {
      // KRITISCH - Rote Warnungen
      critical: [
        {
          id: 'email',
          pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
          severity: 'critical',
          category: 'pii',
          nameDE: 'E-Mail-Adresse',
          nameEN: 'Email Address',
          descDE: 'E-Mail-Adressen sind personenbezogene Daten (DSGVO Art. 4)',
          descEN: 'Email addresses are personal data (GDPR Art. 4)'
        },
        {
          id: 'iban',
          pattern: /\b[A-Z]{2}[0-9]{2}[A-Z0-9]{12,30}\b/g,
          severity: 'critical',
          category: 'financial',
          nameDE: 'IBAN',
          nameEN: 'IBAN',
          descDE: 'Bankverbindungen sind hochsensible Finanzdaten',
          descEN: 'Bank account details are highly sensitive financial data'
        },
        {
          id: 'credit_card',
          pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
          severity: 'critical',
          category: 'financial',
          nameDE: 'Kreditkartennummer',
          nameEN: 'Credit Card Number',
          descDE: 'Kreditkartendaten dürfen niemals geteilt werden',
          descEN: 'Credit card data must never be shared'
        },
        {
          id: 'ssn_swiss',
          pattern: /\b756\.\d{4}\.\d{4}\.\d{2}\b/g,
          severity: 'critical',
          category: 'pii',
          nameDE: 'AHV-Nummer (CH)',
          nameEN: 'Swiss Social Security Number',
          descDE: 'Schweizer Sozialversicherungsnummer - hochsensibel',
          descEN: 'Swiss social security number - highly sensitive'
        },
        {
          id: 'passport',
          pattern: /\b[A-Z]{1,2}[0-9]{6,9}\b/g,
          severity: 'critical',
          category: 'pii',
          nameDE: 'Mögliche Passnummer',
          nameEN: 'Possible Passport Number',
          descDE: 'Ausweisnummern sind personenbezogene Daten',
          descEN: 'ID numbers are personal data'
        },
        {
          id: 'api_key',
          pattern: /\b(?:api[_-]?key|apikey|access[_-]?token|secret[_-]?key)[\s:=]+['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
          severity: 'critical',
          category: 'credentials',
          nameDE: 'API-Schlüssel / Token',
          nameEN: 'API Key / Token',
          descDE: 'API-Schlüssel sind geheime Zugangsdaten',
          descEN: 'API keys are secret credentials'
        },
        {
          id: 'password',
          pattern: /\b(?:password|passwort|pwd|kennwort)[\s:=]+['"]?([^\s'"]{6,})['"]?/gi,
          severity: 'critical',
          category: 'credentials',
          nameDE: 'Passwort',
          nameEN: 'Password',
          descDE: 'Passwörter dürfen niemals geteilt werden',
          descEN: 'Passwords must never be shared'
        }
      ],

      // WARNUNG - Orange Warnungen
      warning: [
        {
          id: 'phone_intl',
          pattern: /\b\+?[1-9]\d{0,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Telefonnummer',
          nameEN: 'Phone Number',
          descDE: 'Telefonnummern können personenbezogene Daten sein',
          descEN: 'Phone numbers may be personal data'
        },
        {
          id: 'ip_address',
          pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
          severity: 'warning',
          category: 'technical',
          nameDE: 'IP-Adresse',
          nameEN: 'IP Address',
          descDE: 'IP-Adressen können zur Identifikation verwendet werden',
          descEN: 'IP addresses can be used for identification'
        },
        {
          id: 'name_pattern',
          pattern: /\b(?:Herr|Frau|Mr\.|Mrs\.|Ms\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Möglicher vollständiger Name',
          nameEN: 'Possible Full Name',
          descDE: 'Namen mit Anrede können personenbezogene Daten sein',
          descEN: 'Names with salutation may be personal data'
        },
        {
          id: 'address',
          pattern: /\b\d+\s+[A-Z][a-zäöüß]+(?:straße|strasse|str\.|weg|weg|gasse|platz|allee)\b/gi,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Mögliche Adresse',
          nameEN: 'Possible Address',
          descDE: 'Adressen sind personenbezogene Daten',
          descEN: 'Addresses are personal data'
        },
        {
          id: 'date_of_birth',
          pattern: /\b(?:geboren|born|geburtsdatum|date of birth|dob)[\s:]+(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/gi,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Geburtsdatum',
          nameEN: 'Date of Birth',
          descDE: 'Geburtsdaten sind personenbezogene Daten',
          descEN: 'Dates of birth are personal data'
        },
        {
          id: 'company_confidential',
          pattern: /\b(?:vertraulich|confidential|intern|internal|geheim|secret|streng\s+vertraulich|strictly\s+confidential)\b/gi,
          severity: 'warning',
          category: 'business',
          nameDE: 'Vertraulichkeits-Kennzeichnung',
          nameEN: 'Confidentiality Marking',
          descDE: 'Dokument könnte als vertraulich gekennzeichnet sein',
          descEN: 'Document may be marked as confidential'
        },
        {
          id: 'salary',
          pattern: /\b(?:gehalt|salary|lohn|wage)[\s:]+(?:CHF|EUR|USD|€|\$)?\s*[\d,.]+\b/gi,
          severity: 'warning',
          category: 'business',
          nameDE: 'Gehaltsangabe',
          nameEN: 'Salary Information',
          descDE: 'Gehaltsinformationen sind sensible Geschäftsdaten',
          descEN: 'Salary information is sensitive business data'
        }
      ]
    };
  }

  /**
   * Initialisiert Übersetzungen für UI-Elemente
   */
  initializeTranslations() {
    return {
      de: {
        critical: 'Kritisch',
        warning: 'Warnung',
        categories: {
          pii: 'Personenbezogene Daten',
          financial: 'Finanzdaten',
          credentials: 'Zugangsdaten',
          technical: 'Technische Daten',
          business: 'Geschäftsdaten'
        },
        status: {
          safe: 'Keine sensiblen Daten erkannt',
          warning: 'Verdächtige Daten erkannt',
          critical: 'Kritische Daten erkannt'
        }
      },
      en: {
        critical: 'Critical',
        warning: 'Warning',
        categories: {
          pii: 'Personal Data',
          financial: 'Financial Data',
          credentials: 'Credentials',
          technical: 'Technical Data',
          business: 'Business Data'
        },
        status: {
          safe: 'No sensitive data detected',
          warning: 'Suspicious data detected',
          critical: 'Critical data detected'
        }
      }
    };
  }

  /**
   * Analysiert Text und gibt alle Erkennungen zurück
   * @param {string} text - Der zu analysierende Text
   * @param {string} lang - Sprache ('de' oder 'en')
   * @returns {Object} Analyse-Ergebnis mit Erkennungen und Status
   */
  analyze(text, lang = 'de') {
    if (!text || text.trim().length === 0) {
      return {
        status: 'safe',
        detections: [],
        highlightRanges: []
      };
    }

    const detections = [];
    const highlightRanges = [];

    // Prüfe alle kritischen Pattern
    this.patterns.critical.forEach(patternDef => {
      const matches = this.findMatches(text, patternDef, lang);
      detections.push(...matches);
      highlightRanges.push(...matches.map(m => ({
        start: m.start,
        end: m.end,
        severity: m.severity,
        id: m.id
      })));
    });

    // Prüfe alle Warn-Pattern
    this.patterns.warning.forEach(patternDef => {
      const matches = this.findMatches(text, patternDef, lang);
      detections.push(...matches);
      highlightRanges.push(...matches.map(m => ({
        start: m.start,
        end: m.end,
        severity: m.severity,
        id: m.id
      })));
    });

    // Bestimme Gesamt-Status
    let status = 'safe';
    if (detections.some(d => d.severity === 'critical')) {
      status = 'critical';
    } else if (detections.some(d => d.severity === 'warning')) {
      status = 'warning';
    }

    return {
      status,
      detections: this.deduplicateDetections(detections),
      highlightRanges: this.mergeOverlappingRanges(highlightRanges)
    };
  }

  /**
   * Findet alle Matches für ein Pattern im Text
   */
  findMatches(text, patternDef, lang) {
    const matches = [];
    const regex = new RegExp(patternDef.pattern);
    let match;

    // Reset regex state
    const globalRegex = new RegExp(patternDef.pattern.source, patternDef.pattern.flags);

    while ((match = globalRegex.exec(text)) !== null) {
      matches.push({
        id: patternDef.id,
        severity: patternDef.severity,
        category: patternDef.category,
        name: lang === 'de' ? patternDef.nameDE : patternDef.nameEN,
        description: lang === 'de' ? patternDef.descDE : patternDef.descEN,
        match: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return matches;
  }

  /**
   * Entfernt duplizierte Erkennungen
   */
  deduplicateDetections(detections) {
    const seen = new Set();
    return detections.filter(d => {
      const key = `${d.id}-${d.start}-${d.end}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Merged überlappende Ranges für Highlighting
   */
  mergeOverlappingRanges(ranges) {
    if (ranges.length === 0) return [];

    // Sortiere nach Start-Position
    ranges.sort((a, b) => a.start - b.start);

    const merged = [ranges[0]];

    for (let i = 1; i < ranges.length; i++) {
      const current = ranges[i];
      const last = merged[merged.length - 1];

      if (current.start <= last.end) {
        // Überlappung - merge und behalte höheren Severity
        last.end = Math.max(last.end, current.end);
        if (current.severity === 'critical') {
          last.severity = 'critical';
        }
      } else {
        merged.push(current);
      }
    }

    return merged;
  }

  /**
   * Holt Übersetzung für gegebenen Schlüssel
   */
  t(key, lang = 'de') {
    const keys = key.split('.');
    let value = this.translations[lang];

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }

    return value;
  }
}

// Export für Content Script
if (typeof window !== 'undefined') {
  window.ComplianceDetector = ComplianceDetector;
}
