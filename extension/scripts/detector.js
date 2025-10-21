/**
 * AI Compliance Checker - Detection Engine
 * Beta by BEYONDER
 * Erkennt personenbezogene und sensible Daten in Text-Eingaben
 * 100% lokal, keine Server-Kommunikation
 */

class ComplianceDetector {
  constructor() {
    this.patterns = this.initializePatterns();
    this.translations = this.initializeTranslations();
    this.nameBlacklist = this.initializeNameBlacklist();
  }

  /**
   * Initialisiert Blacklist für häufige Wörter die keine Namen sind
   */
  initializeNameBlacklist() {
    return new Set([
      // Allgemeine Begriffe
      'general', 'manager', 'director', 'officer', 'agent', 'assistant', 'consultant',
      'specialist', 'coordinator', 'administrator', 'supervisor', 'representative',
      'first', 'second', 'third', 'last', 'next', 'previous', 'current', 'former',
      'senior', 'junior', 'chief', 'head', 'lead', 'principal', 'vice', 'deputy',

      // Titel
      'mister', 'misses', 'doctor', 'professor', 'lieutenant', 'captain', 'major',
      'colonel', 'sergeant', 'private', 'master', 'miss',

      // KI/Tech Begriffe
      'artificial', 'intelligence', 'machine', 'learning', 'deep', 'neural', 'network',
      'model', 'system', 'algorithm', 'data', 'science', 'computer', 'software',
      'hardware', 'internet', 'digital', 'virtual', 'cyber', 'online',

      // Häufige Adjektive
      'great', 'good', 'bad', 'nice', 'beautiful', 'wonderful', 'excellent',
      'perfect', 'terrible', 'awesome', 'amazing', 'incredible', 'fantastic',

      // Monate/Tage
      'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
      'september', 'october', 'november', 'december', 'monday', 'tuesday',
      'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'januar', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august',
      'september', 'oktober', 'november', 'dezember', 'montag', 'dienstag',
      'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'
    ]);
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
          pattern: /\b[A-Z]{2}[0-9]{2}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{0,2}\b/g,
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
          pattern: /\b756[\s.-]?\d{4}[\s.-]?\d{4}[\s.-]?\d{2}\b/g,
          severity: 'critical',
          category: 'pii',
          nameDE: 'AHV-Nummer (CH)',
          nameEN: 'Swiss Social Security Number (AHV)',
          descDE: 'Schweizer Sozialversicherungsnummer - hochsensibel gemäss DSG',
          descEN: 'Swiss social security number - highly sensitive under DSG'
        },
        {
          id: 'passport',
          pattern: /\b(?:passport|pass|reisepass|ausweis)[\s:]+([A-Z]{1,2}\d{6,9})\b/gi,
          severity: 'critical',
          category: 'pii',
          nameDE: 'Reisepass-/Ausweisnummer',
          nameEN: 'Passport/ID Number',
          descDE: 'Ausweisnummern sind personenbezogene Daten',
          descEN: 'ID numbers are personal data'
        },
        {
          id: 'api_key',
          pattern: /\b(?:api[_-]?key|apikey|access[_-]?token|secret[_-]?key|bearer)[\s:=]+['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
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
          id: 'phone_swiss',
          pattern: /\b(?:\+41|0041|0)[\s.-]?(?:\(0\)[\s.-]?)?(?:7[6-9]|[2-9]\d)[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Schweizer Telefonnummer',
          nameEN: 'Swiss Phone Number',
          descDE: 'Telefonnummern können zur Identifikation verwendet werden',
          descEN: 'Phone numbers can be used for identification'
        },
        {
          id: 'phone_german',
          pattern: /\b(?:\+49|0049|0)[\s.-]?\d{2,5}[\s.-]?\d{3,}[\s.-]?\d{2,}\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Deutsche Telefonnummer',
          nameEN: 'German Phone Number',
          descDE: 'Telefonnummern können zur Identifikation verwendet werden',
          descEN: 'Phone numbers can be used for identification'
        },
        {
          id: 'phone_intl',
          pattern: /\b\+\d{1,3}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Internationale Telefonnummer',
          nameEN: 'International Phone Number',
          descDE: 'Telefonnummern können zur Identifikation verwendet werden',
          descEN: 'Phone numbers can be used for identification'
        },
        {
          id: 'ip_address',
          pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
          severity: 'warning',
          category: 'technical',
          nameDE: 'IP-Adresse',
          nameEN: 'IP Address',
          descDE: 'IP-Adressen können zur Identifikation verwendet werden (DSGVO)',
          descEN: 'IP addresses can be used for identification (GDPR)'
        },
        {
          id: 'zip_swiss',
          pattern: /\b(?:CH-)?[1-9]\d{3}\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Schweizer PLZ',
          nameEN: 'Swiss ZIP Code',
          descDE: 'Postleitzahlen können Teil einer Adresse sein',
          descEN: 'ZIP codes may be part of an address'
        },
        {
          id: 'name_context',
          pattern: /(?:name|kontakt|contact|person|mitarbeiter|employee|kunde|customer|patient|student|benutzer|user)[\s:]+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)+)/gi,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Name (kontextbasiert)',
          nameEN: 'Name (context-based)',
          descDE: 'Vollständige Namen sind personenbezogene Daten',
          descEN: 'Full names are personal data',
          customValidator: (match, detector) => {
            const name = match[1];
            const words = name.split(/\s+/);
            // Prüfe ob Wörter in Blacklist sind
            const isBlacklisted = words.some(word =>
              detector.nameBlacklist.has(word.toLowerCase())
            );
            return !isBlacklisted;
          }
        },
        {
          id: 'name_standalone',
          pattern: /(?:^|[^.!?]\s+)([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)?)\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Name (eigenständig)',
          nameEN: 'Name (standalone)',
          descDE: 'Vollständige Namen sind personenbezogene Daten',
          descEN: 'Full names are personal data',
          customValidator: (match, detector) => {
            const fullMatch = match[0];
            const name = match[1];

            // Nicht am Satzanfang (nach Punkt, Fragezeichen, etc.)
            if (/^[.!?]\s+/.test(fullMatch)) {
              return false;
            }

            const words = name.split(/\s+/);

            // Prüfe ob Wörter in Blacklist sind
            const isBlacklisted = words.some(word =>
              detector.nameBlacklist.has(word.toLowerCase())
            );

            return !isBlacklisted;
          }
        },
        {
          id: 'address',
          pattern: /\b\d+[\s,]+[A-ZÄÖÜ][a-zäöüß]+(?:straße|strasse|str\.|weg|gasse|platz|allee|avenue|street|road|way)\b/gi,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Adresse',
          nameEN: 'Address',
          descDE: 'Adressen sind personenbezogene Daten',
          descEN: 'Addresses are personal data'
        },
        {
          id: 'date_of_birth',
          pattern: /\b(?:geboren|born|geburtsdatum|date of birth|dob|geb\.)[\s:]+(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/gi,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Geburtsdatum',
          nameEN: 'Date of Birth',
          descDE: 'Geburtsdaten sind personenbezogene Daten',
          descEN: 'Dates of birth are personal data'
        },
        {
          id: 'company_confidential',
          pattern: /\b(?:vertraulich|confidential|intern|internal|geheim|secret|streng\s+vertraulich|strictly\s+confidential|classified)\b/gi,
          severity: 'warning',
          category: 'business',
          nameDE: 'Vertraulichkeits-Kennzeichnung',
          nameEN: 'Confidentiality Marking',
          descDE: 'Dokument könnte als vertraulich gekennzeichnet sein',
          descEN: 'Document may be marked as confidential'
        },
        {
          id: 'salary',
          pattern: /\b(?:gehalt|salary|lohn|wage|verdienst|einkommen)[\s:]+(?:CHF|EUR|USD|€|\$|Fr\.)?\s*[\d',\.]+\b/gi,
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
          warning: 'Hinweise auf sensible Daten',
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
          warning: 'Possible sensitive data detected',
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
        id: m.id,
        text: m.match
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
        id: m.id,
        text: m.match
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
      highlightRanges: this.sortRanges(highlightRanges)
    };
  }

  /**
   * Findet alle Matches für ein Pattern im Text
   */
  findMatches(text, patternDef, lang) {
    const matches = [];
    const regex = new RegExp(patternDef.pattern.source, patternDef.pattern.flags);
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Wenn Pattern einen Custom Validator hat, prüfe ihn
      if (patternDef.customValidator) {
        if (!patternDef.customValidator(match, this)) {
          continue; // Skip diesen Match
        }
      }

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
      const key = `${d.start}-${d.end}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Sortiert Ranges nach Start-Position und merged overlapping ranges
   */
  sortRanges(ranges) {
    if (ranges.length === 0) {
      return ranges;
    }

    // Sortiere nach Start-Position
    const sorted = ranges.sort((a, b) => a.start - b.start);

    // Merge overlapping ranges
    const merged = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      // Prüfe ob current und last überlappen oder aneinandergrenzen
      if (current.start <= last.end) {
        // Overlapping oder angrenzend - merge sie
        // Wähle die höhere Severity
        const severity = (last.severity === 'critical' || current.severity === 'critical')
          ? 'critical'
          : 'warning';

        // Erweitere den letzten Range
        merged[merged.length - 1] = {
          start: Math.min(last.start, current.start),
          end: Math.max(last.end, current.end),
          severity: severity,
          id: last.id, // Behalte ID des ersten
          text: last.text // Behalte Text des ersten
        };
      } else {
        // Kein Overlap - füge als neuen Range hinzu
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
