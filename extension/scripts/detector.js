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
    this.commonFirstNames = this.initializeCommonFirstNames();
  }

  /**
   * Initialisiert Liste häufiger Vornamen (DE/EN/CH)
   * Für heuristische Name-Erkennung
   */
  initializeCommonFirstNames() {
    return new Set([
      // Deutsche Vornamen (Top 100+)
      'alexander', 'andreas', 'andres', 'anna', 'ben', 'benjamin', 'bernd', 'beyeler',
      'chris', 'christian', 'christoph', 'clara', 'claudia', 'daniel', 'david', 'dieter',
      'elena', 'elias', 'emily', 'emma', 'eric', 'erik', 'fabian', 'felix', 'finn',
      'florian', 'frank', 'hannah', 'hans', 'heinrich', 'helga', 'hendrik', 'ida', 'jakob',
      'jan', 'jens', 'jonas', 'josef', 'julia', 'jürgen', 'karl', 'katharina', 'klaus',
      'lara', 'lars', 'laura', 'lea', 'leon', 'lena', 'liam', 'lisa', 'lukas', 'luise',
      'manfred', 'manuel', 'maria', 'marie', 'mario', 'markus', 'martin', 'matthias',
      'max', 'maximilian', 'michael', 'mia', 'moritz', 'nick', 'nico', 'nina', 'noah',
      'oliver', 'otto', 'paul', 'paula', 'peter', 'philipp', 'ralf', 'rainer', 'robert',
      'roland', 'sabine', 'sandra', 'sarah', 'schmid', 'sebastian', 'simon', 'sophie',
      'stefan', 'stephan', 'thomas', 'tim', 'timo', 'tobias', 'tom', 'tristan', 'ulrich',
      'uwe', 'werner', 'wilhelm', 'wolfgang',

      // Schweizer Vornamen
      'adrian', 'andres', 'beat', 'christoph', 'claude', 'fabio', 'franz', 'hannes',
      'hanspeter', 'jürg', 'kilian', 'loris', 'lukas', 'marco', 'markus', 'matthias',
      'maurus', 'nils', 'pascal', 'patrik', 'reto', 'silvan', 'sven', 'urs', 'yannick',
      'anouk', 'chantal', 'fabienne', 'joelle', 'ladina', 'léonie', 'mara', 'selina',

      // Englische Vornamen
      'adam', 'alice', 'amy', 'andrew', 'angela', 'anthony', 'barbara', 'betty', 'brian',
      'bruce', 'carol', 'charles', 'charlotte', 'chris', 'christopher', 'daniel', 'deborah',
      'diana', 'donald', 'donna', 'dorothy', 'edward', 'elizabeth', 'emily', 'emma',
      'eric', 'ethan', 'evelyn', 'george', 'grace', 'harold', 'harry', 'helen', 'henry',
      'jack', 'jacob', 'james', 'jane', 'jason', 'jeffrey', 'jennifer', 'jessica', 'john',
      'joseph', 'joshua', 'judy', 'justin', 'karen', 'katherine', 'kenneth', 'kevin',
      'kimberly', 'larry', 'linda', 'lisa', 'margaret', 'maria', 'mark', 'mary', 'matthew',
      'melissa', 'michael', 'michelle', 'nancy', 'nathan', 'nicole', 'olivia', 'pamela',
      'patricia', 'patrick', 'paul', 'peter', 'rachel', 'raymond', 'rebecca', 'richard',
      'robert', 'ronald', 'ruth', 'ryan', 'samuel', 'sandra', 'sarah', 'scott', 'sharon',
      'sophia', 'stephanie', 'steven', 'susan', 'teresa', 'thomas', 'timothy', 'walter',
      'william', 'zachary'
    ]);
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
          nameDE: 'Name (heuristisch)',
          nameEN: 'Name (heuristic)',
          descDE: 'Vollständige Namen sind personenbezogene Daten',
          descEN: 'Full names are personal data',
          customValidator: (match, detector) => {
            return detector.analyzeNameHeuristics(match[0], match[1]);
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
   * Heuristische Analyse ob Text wahrscheinlich ein Name ist
   * Verwendet Scoring-System mit mehreren Faktoren
   *
   * @param {string} fullMatch - Der komplette Match inkl. Whitespace
   * @param {string} name - Der extrahierte Name
   * @returns {boolean} true wenn wahrscheinlich ein Name
   */
  analyzeNameHeuristics(fullMatch, name) {
    let score = 0;
    const words = name.split(/\s+/);

    // NEGATIVER SCORE: Blacklist-Check (sofort ablehnen)
    const isBlacklisted = words.some(word =>
      this.nameBlacklist.has(word.toLowerCase())
    );
    if (isBlacklisted) {
      return false; // Sofort ablehnen
    }

    // NEGATIVER SCORE: Am Satzanfang (könnte beliebiges Wort sein)
    if (/^[.!?]\s+/.test(fullMatch)) {
      score -= 3;
    }

    // NEGATIVER SCORE: Nur ein Wort (zu unspezifisch)
    if (words.length === 1) {
      score -= 5;
    }

    // POSITIVER SCORE: Anzahl Wörter (2-3 ist typisch für Namen)
    if (words.length === 2) {
      score += 3; // Vorname + Nachname
    } else if (words.length === 3) {
      score += 2; // Vorname + Mittelname + Nachname
    }

    // Analysiere jedes Wort
    words.forEach((word, index) => {
      const lowerWord = word.toLowerCase();
      const wordLength = word.length;

      // POSITIVER SCORE: Erstes Wort ist häufiger Vorname
      if (index === 0 && this.commonFirstNames.has(lowerWord)) {
        score += 5; // Starker Indikator!
      }

      // POSITIVER SCORE: Irgendein Wort ist bekannter Vorname
      if (this.commonFirstNames.has(lowerWord)) {
        score += 3;
      }

      // POSITIVER SCORE: Korrekte Kapitalisierung (Erster Buchstabe groß)
      if (/^[A-ZÄÖÜ][a-zäöüß]+$/.test(word)) {
        score += 1;
      }

      // POSITIVER SCORE: Typische Namenslänge (3-15 Zeichen)
      if (wordLength >= 3 && wordLength <= 15) {
        score += 1;
      }

      // NEGATIVER SCORE: Sehr kurz (< 2 Zeichen) oder sehr lang (> 20)
      if (wordLength < 2 || wordLength > 20) {
        score -= 2;
      }

      // NEGATIVER SCORE: Enthält Zahlen (Namen haben keine Zahlen)
      if (/\d/.test(word)) {
        score -= 5;
      }

      // NEGATIVER SCORE: Enthält Sonderzeichen (außer Umlaute)
      if (/[^A-Za-zÄÖÜäöüß]/.test(word)) {
        score -= 3;
      }
    });

    // POSITIVER SCORE: Typische Namensmuster
    // Beispiel: "Hans Peter", "Anna Maria"
    if (words.length === 2) {
      const [first, second] = words.map(w => w.toLowerCase());
      if (this.commonFirstNames.has(first) && this.commonFirstNames.has(second)) {
        score += 4; // Beide sind Vornamen - sehr wahrscheinlich ein Name
      }
    }

    // KONTEXT-ANALYSE: Prüfe Text vor dem Namen
    const contextBefore = fullMatch.substring(0, fullMatch.indexOf(name)).toLowerCase();

    // POSITIVER SCORE: Nach Kontext-Wörtern
    if (/(?:name|kontakt|contact|person|mitarbeiter|employee|kunde|customer|patient|student|benutzer|user|herr|frau|mr|mrs|ms)[\s:]+$/.test(contextBefore)) {
      score += 4;
    }

    // ENTSCHEIDUNG: Score >= 5 = Wahrscheinlich ein Name
    const threshold = 5;
    const isLikelyName = score >= threshold;

    // DEBUG (kann später entfernt werden)
    if (isLikelyName) {
      console.log(`[AICC Name Heuristic] "${name}" -> Score: ${score} (threshold: ${threshold}) ✓ DETECTED`);
    }

    return isLikelyName;
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
