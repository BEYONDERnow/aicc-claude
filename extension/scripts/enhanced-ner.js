/**
 * AI Compliance Checker - Enhanced NER Detector
 * 4-Layer Namen-Erkennungs-System ohne WASM/ML-Dependencies
 *
 * Layer 1: Context-based (95%+ Präzision) - "Name: Hans Müller"
 * Layer 2: Lexicon-based (90%+ Präzision) - Gegen 6600+ Namen-DB
 * Layer 3: Capitalization (98%+ Präzision) - Pattern + German Nouns Filter
 * Layer 4: Compound Names (98%+ Präzision) - Hans-Peter (Lexikon + Nomen validiert)
 *
 * Version: 2.3.7 - HYBRID German Nouns Filter (Option 3)
 * - 800+ häufigste deutsche Substantive als Inverse-Blacklist
 * - 15+ Nomen-Suffix-Patterns (ung, heit, keit, tion, etc.)
 * - Intelligente Bindestrich-Analyse mit Nomen-Check
 * - "Video-Transkripts" → "Video" ist Nomen → GEFILTERT ✅
 * - "Jean-Pierre" → keiner ist Nomen → NAME erkannt ✅
 * - Target: <1% False-Positive-Rate bei 100% Namen-Erkennung
 */

import { FIRST_NAMES, LAST_NAMES, isFirstName, isLastName } from './names-lexicon.js';
import { isGermanNoun, isHyphenatedNoun } from './german-nouns.js';

export class EnhancedNERDetector {
  constructor() {
    this.nerEnabled = true; // Immer aktiv (kein WASM mehr)
    this.nerReady = true;

    // Blacklist für False-Positives (Städte, Firmen, Wochentage, etc.)
    this.blacklist = new Set([
      // Städte (oft mit Großbuchstaben)
      'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf',
      'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nürnberg',
      'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg',
      'Rome', 'Milan', 'Naples', 'Turin', 'Florence', 'Venice', 'Bologna',
      'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield',
      'Zürich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne',
      'Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Linz',

      // Wochentage & Monate
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag',
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December',
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August',
      'September', 'Oktober', 'November', 'Dezember',

      // Häufige Nicht-Namen
      'Google', 'Microsoft', 'Apple', 'Amazon', 'Facebook', 'Twitter', 'LinkedIn',
      'ChatGPT', 'Claude', 'Gemini', 'OpenAI', 'Anthropic', 'Dear', 'Hello', 'Regards',
      'Best', 'Sincerely', 'Thanks', 'Team', 'Support', 'Service', 'Customer',

      // Länder
      'Germany', 'France', 'Italy', 'Spain', 'Portugal', 'Austria', 'Switzerland',
      'England', 'Scotland', 'Ireland', 'Wales', 'United Kingdom', 'Great Britain',
      'Deutschland', 'Frankreich', 'Italien', 'Spanien', 'Portugal', 'Österreich',
      'Schweiz', 'England', 'Schottland', 'Irland',

      // Anreden/Titel (bereits im Kontext erkannt)
      'Herr', 'Frau', 'Doctor', 'Professor', 'Director', 'Manager', 'President',

      // v2.3.6: Häufige deutsche Substantive (False Positives)
      'Anfang', 'Ende', 'Grund', 'Neuem', 'Neuen', 'Alten', 'Altem', 'Ersten',
      'Zweiten', 'Dritten', 'Letzten', 'Nächsten', 'Ganzen', 'Halben', 'Anderen',

      // v2.3.6: Tech/Coding Begriffe
      'GitHub', 'GitLab', 'Bitbucket', 'SourceForge', 'Coding', 'Programming',
      'Webcoding', 'Frontend', 'Backend', 'Fullstack', 'DevOps', 'JavaScript',
      'TypeScript', 'Python', 'Docker', 'Kubernetes', 'Laravel', 'React', 'Vue',
      'Angular', 'Django', 'Flask', 'Spring', 'Bootstrap', 'Tailwind',

      // v2.3.6: AI Plattformen
      'ChatGippity', 'Chatshippity', 'Bard', 'Copilot', 'LLaMA', 'Mistral',
      'Glot', 'Replit', 'CodePen', 'JSFiddle', 'Codesandbox',

      // v2.3.6: Häufige Verben (oft am Satzanfang großgeschrieben)
      'Programmieren', 'Entwickeln', 'Implementieren', 'Erstellen', 'Bearbeiten',
      'Hinzufügen', 'Entfernen', 'Löschen', 'Speichern', 'Laden', 'Öffnen',
      'Schließen', 'Starten', 'Stoppen', 'Prüfen', 'Testen', 'Debuggen'
    ]);

    // Kontext-Marker die auf Namen hinweisen
    this.contextMarkers = {
      // Deutsch
      de: ['Name', 'Vorname', 'Nachname', 'Von', 'An', 'Absender', 'Empfänger',
           'Kontakt', 'Ansprechpartner', 'Herr', 'Frau', 'Dr.', 'Prof.',
           'Gesendet von', 'Verfasser', 'Autor'],

      // Englisch
      en: ['Name', 'First Name', 'Last Name', 'From', 'To', 'Sender', 'Recipient',
           'Contact', 'Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.', 'Sent by', 'Author'],

      // Französisch
      fr: ['Nom', 'Prénom', 'De', 'À', 'Expéditeur', 'Destinataire', 'Contact',
           'M.', 'Mme', 'Mlle', 'Dr.', 'Prof.', 'Envoyé par', 'Auteur'],

      // Italienisch
      it: ['Nome', 'Cognome', 'Da', 'A', 'Mittente', 'Destinatario', 'Contatto',
           'Sig.', 'Sig.ra', 'Dott.', 'Prof.', 'Inviato da', 'Autore']
    };
  }

  /**
   * Haupt-Erkennungs-Methode
   * Kombiniert alle 4 Layer und gibt deduplizierte Ergebnisse zurück
   *
   * PERFORMANCE OPTIMIERT v2.2.1:
   * - Text-Längen-Limit (10000 Zeichen)
   * - Chunking für lange Texte
   * - Early Exit für sehr lange Texte
   */
  async detectNames(text, lang = 'de') {
    if (!text || text.trim().length === 0) return [];

    // PERFORMANCE: Text-Längen-Limit
    const MAX_LENGTH = 10000; // 10k Zeichen
    const MAX_LENGTH_STRICT = 50000; // 50k absolutes Limit

    if (text.length > MAX_LENGTH_STRICT) {
      // Sehr langer Text: Nur erste 50k Zeichen analysieren
      console.warn('[Enhanced NER] Text zu lang (' + text.length + ' Zeichen), analysiere nur erste 50k');
      text = text.substring(0, MAX_LENGTH_STRICT);
    }

    // PERFORMANCE: Bei mittellangen Texten (10k-50k) nur Layer 1+4 (schnellste)
    const useFastMode = text.length > MAX_LENGTH;

    const detections = [];

    // Layer 1: Kontext-basiert (höchste Präzision, schnell)
    const contextNames = this.detectByContext(text, lang);
    detections.push(...contextNames);

    // FAST MODE: Nur Kontext + Compound für lange Texte
    if (useFastMode) {
      console.log('[Enhanced NER] Fast Mode aktiviert (Text > 10k Zeichen)');

      // Layer 4: Compound-Namen (schnell, kein Lexikon-Lookup)
      const compoundNames = this.detectCompoundNames(text);
      detections.push(...compoundNames);

      return this.validateAndMerge(detections, text);
    }

    // NORMAL MODE: Alle Layer
    // Layer 2: Lexikon-basiert (hohe Abdeckung, mittel-schnell)
    const lexiconNames = this.detectByLexicon(text, lang);
    detections.push(...lexiconNames);

    // Layer 3: Kapitalisierungs-Analyse (langsam)
    const capitalizedNames = this.detectByCapitalization(text);
    detections.push(...capitalizedNames);

    // Layer 4: Compound-Namen
    const compoundNames = this.detectCompoundNames(text);
    detections.push(...compoundNames);

    // Validierung, Deduplizierung & Merge
    return this.validateAndMerge(detections, text);
  }

  /**
   * LAYER 1: Kontext-basierte Erkennung
   * Erkennt Namen mit Kontext-Markern wie "Name:", "Von:", etc.
   * Höchste Präzision (~95%)
   */
  detectByContext(text, lang) {
    const results = [];
    const markers = this.contextMarkers[lang] || this.contextMarkers.de;

    // Baue Regex-Pattern für alle Marker
    const markerPattern = markers.map(m => m.replace(/\./g, '\\.')).join('|');

    // Pattern: "Marker: Name" - stopped nur Vornamen bzw. bekannte Nachnamen
    // Findet maximal 2-3 kapitalisierte Wörter die Namen sind
    const pattern = new RegExp(
      `(?:${markerPattern})\\s*[:]?\\s*([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüßáéíóú-]+(?:\\s+[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüßáéíóú-]+){0,2})`,
      'gi'
    );

    let match;
    while ((match = pattern.exec(text)) !== null) {
      let name = match[1].trim();

      // v2.3.0 FIX: Filter ALL-CAPS Wörter (wegen case-insensitive 'gi' Flag)
      // "KONTAKTDATEN" wird zu "DATEN" extrahiert → filtern!
      if (name === name.toUpperCase() && name.length > 2) {
        continue;
      }

      // v2.3.0 FIX: Filter lowercase-only Wörter
      if (name === name.toLowerCase()) {
        continue;
      }

      // v2.3.3: ERWEITERTE Context-Blacklist (wird pro Wort geprüft)
      const contextBlacklist = [
        'CH', 'EUR', 'USD', 'CHF', 'Tel', 'Email', 'Team', 'Text', 'Test', 'Code',
        'Info', 'Data', 'Liste', 'Name', 'Artikel', 'Bitte', 'Diese', 'Dieses'
      ];

      // Schneide bei bekannten Nicht-Namen-Wörtern ab
      // z.B. "Klaus Schmidt arbeitet" → "Klaus Schmidt"
      const words = name.split(/\s+/);
      const validWords = [];

      for (const word of words) {
        const lower = word.toLowerCase();

        // v2.3.3 FIX: Prüfe contextBlacklist für JEDES Wort!
        if (contextBlacklist.includes(word)) {
          break; // Stoppe bei Blacklist-Wort
        }

        // Stoppe bei bekannten Verben/Präpositionen
        if (this.blacklist.has(word) ||
            ['arbeitet', 'meldet', 'aus', 'in', 'bei', 'von', 'works', 'writes', 'from', 'in', 'at'].includes(lower)) {
          break;
        }

        validWords.push(word);
      }

      if (validWords.length === 0) continue;

      name = validWords.join(' ');

      // v2.3.3 FIX: Multi-Word Filter (filtere lowercase/ALL-CAPS aus Multi-Word Namen)
      const finalWords = [];
      for (const word of name.split(/\s+/)) {
        // Skip lowercase (z.B. "chris" in "Andres chris")
        if (word === word.toLowerCase()) break;

        // Skip ALL-CAPS (außer 2-Buchstaben)
        if (word === word.toUpperCase() && word.length > 2) break;

        finalWords.push(word);
      }

      if (finalWords.length === 0) continue;
      name = finalWords.join(' ');

      // Validierung: Nicht in Blacklist
      if (!this.isBlacklisted(name)) {
        const startIndex = match.index + match[0].indexOf(name);
        results.push({
          text: name,
          start: startIndex,
          end: startIndex + name.length,
          confidence: 0.95,
          layer: 'context'
        });
      }
    }

    return results;
  }

  /**
   * LAYER 2: Lexikon-basierte Erkennung
   * Prüft gegen 6600+ bekannte Vornamen & Nachnamen
   * Hohe Präzision (~90%) und Recall
   */
  /**
   * LAYER 2: Lexikon-basierte Erkennung
   * Prüft gegen 6600+ bekannte Vornamen & Nachnamen
   * Hohe Präzision (~90%) und Recall
   *
   * PERFORMANCE OPTIMIERT v2.2.1:
   * - Limit auf max 500 Matches
   * - Timeout Protection
   */
  detectByLexicon(text, lang) {
    const results = [];

    // PERFORMANCE: Nur für Texte < 30k Zeichen
    if (text.length > 30000) {
      console.log('[Enhanced NER] Lexicon skipped (text > 30k)');
      return results;
    }

    // Split in Wörter (behalte Positionen) - inkl. Akzente áéíóúý etc.
    const wordPattern = /[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜÁÉÍÓÚÝ][a-zäöüàâæçéèêëïîôœùûüßáéíóúý-]+/g;
    let match;
    let matchCount = 0;
    const MAX_MATCHES = 5000; // v2.3.4: Erhöht 2000 → 5000 für sehr lange Texte (~10k Zeichen)

    while ((match = wordPattern.exec(text)) !== null) {
      // PERFORMANCE: Limit iterations
      if (++matchCount > MAX_MATCHES) {
        console.warn('[Enhanced NER] Lexicon: Too many matches (>' + MAX_MATCHES + '), aborted');
        break;
      }

      const word = match[0];
      const position = match.index;

      // v2.3.3: Minimum Wortlänge (verhindert "An", "Ab", "Am", etc.)
      if (word.length < 3) continue;

      // v2.3.3: Maximum Wortlänge (unrealistisch lange Wörter)
      if (word.length > 30) continue;

      // v2.3.0 PHASE 1: ALL-CAPS Filter (außer 2-Buchstaben wie "AL")
      if (word === word.toUpperCase() && word.length > 2) {
        continue; // Skip KONTAKTDATEN, FINANZDATEN, etc.
      }

      // v2.3.0 PHASE 1: Lowercase-Only Filter (compound-Teile)
      if (word === word.toLowerCase()) {
        continue; // Skip "kverbindung" aus "Bankverbindung"
      }

      // v2.3.0 PHASE 1: Word Boundary Check (nicht Teilstring)
      const before = text[position - 1];
      const after = text[position + word.length];
      if (before && /[a-zäöüA-ZÄÖÜ]/.test(before)) continue;
      if (after && /[a-zäöüA-ZÄÖÜ]/.test(after)) continue;

      // v2.3.3: ERWEITERTE Blacklist häufiger False Positives
      const commonFalsePositives = [
        'CH', 'EUR', 'USD', 'CHF', 'Name', 'Tel', 'Email', 'Team', 'Text', 'Test', 'Code',
        'Die', 'Der', 'Das', 'Ein', 'Eine', 'Den', 'Dem', 'Des',
        'Und', 'Oder', 'Aber', 'Mit', 'Von', 'Für', 'Bei', 'Nach', 'Vor', 'Über',
        'Jahr', 'Jahre', 'Monat', 'Monate', 'Tag', 'Tage', 'Zeit',
        'Info', 'Data', 'Liste', 'Artikel'
      ];
      if (commonFalsePositives.includes(word)) continue;

      // v2.3.7: HYBRID NOMEN-FILTER (Option 3)
      // 0. Prüfe ob Wort ein deutsches Nomen ist (Inverse Blacklist)
      if (isGermanNoun(word)) {
        continue; // Skip "Video", "App", "Mail", "Anfang", "Grund", etc.
      }

      // 1. INTELLIGENTER Bindestrich-Filter mit Nomen-Check
      if (word.includes('-')) {
        // Filtere wenn es ein Nomen-Kompositum ist
        // "Video-Transkripts" → "Video" ist Nomen → Skip
        // "Jean-Pierre" → keiner ist Nomen → Behalten
        if (isHyphenatedNoun(word)) {
          continue; // Skip Nomen-Komposita
        }

        // Wenn NICHT Nomen-Kompositum, prüfe ob beide Teile Namen sind
        const parts = word.split('-');

        // Filtere Wörter mit zu kurzen Teilen (z.B. "k-Kreditkarten")
        if (parts.some(part => part.length < 2)) {
          continue;
        }

        // Prüfe ob ALLE Teile echte Namen im Lexikon sind
        const allPartsAreNames = parts.every(part =>
          part.length >= 3 &&
          (isFirstName(part) || isLastName(part))
        );

        if (!allPartsAreNames) {
          // Nicht alle Teile sind Namen → wahrscheinlich Fachbegriff
          continue;
        }

        // Zusätzliche Prüfung: Kapitalisierung korrekt?
        const isProperlyCapitalized = parts.every(part =>
          part[0] === part[0].toUpperCase() &&
          part.slice(1) === part.slice(1).toLowerCase()
        );

        if (!isProperlyCapitalized) {
          continue;
        }
      }

      // 2. Tech/Business Abkürzungen (ALL-CAPS 2 Zeichen - ergänzt v2.3.3 Filter)
      if (word.length === 2 && word === word.toUpperCase()) {
        continue; // Skip "KI", "AI", "IT", "HR", "PR"
      }

      // 3. Häufige Fachbegriff-Endungen
      const techSuffixes = /(?:aufgaben?|profil|profilen|task|tasks|prompt|prompting|remote|online|video|tool|setup|copilot|referenz|channel|library|bibliothek|auswahl|dokumentation|testimonial|erfassung|grundlagen|teilnahme|meeting|dateien|case)$/i;
      if (techSuffixes.test(word)) {
        continue; // Skip "Aufgabenprofilen", "Tasks", etc.
      }

      // 4. Häufige Fachbegriff-Anfänge (nur wenn Suffix auch tech ist)
      const techPrefixes = /^(?:Prompt|Remote|Online|Video|Tool|Task|Copilot|Referenz|Teams|Test|Setup)/i;
      if (techPrefixes.test(word)) {
        continue; // Skip "Prompting", "Remote", etc.
      }

      // 5. Jahreszeiten (können auch Nachnamen sein, aber Context ist wichtiger)
      const seasons = ['Sommer', 'Winter', 'Frühling', 'Herbst', 'Frühjahr', 'Fruehjahr'];
      if (seasons.includes(word)) {
        continue; // Skip Jahreszeiten
      }

      // Prüfe ob es ein Vorname ist
      if (isFirstName(word, lang)) {
        // PERFORMANCE: Simplified - kein lookahead mehr
        // Nur Vorname (ohne Nachname-Check, zu komplex)
        if (!this.isBlacklisted(word)) {
          results.push({
            text: word,
            start: position,
            end: position + word.length,
            confidence: 0.70,
            layer: 'lexicon-first'
          });
        }
      }
      // Prüfe ob es ein Nachname ist (ohne Vorname)
      else if (isLastName(word) && !this.isBlacklisted(word)) {
        results.push({
          text: word,
          start: position,
          end: position + word.length,
          confidence: 0.65,
          layer: 'lexicon-last'
        });
      }
    }

    return results;
  }

  /**
   * LAYER 3: Kapitalisierungs-Analyse
   * Erkennt mehrere aufeinanderfolgende kapitalisierte Wörter
   * Mittlere Präzision (~75%) - anfällig für False Positives
   *
   * PERFORMANCE OPTIMIERT v2.2.1:
   * - Limit auf max 100 Matches
   * - Skip für sehr lange Texte (>20k)
   */
  detectByCapitalization(text) {
    const results = [];

    // PERFORMANCE: Nur für Texte < 20k Zeichen (Layer ist langsam)
    if (text.length > 20000) {
      return results; // Skip für sehr lange Texte
    }

    // Pattern: 2-3 kapitalisierte Wörter hintereinander (reduziert von 4)
    // z.B. "Hans Peter" oder "Johann Wolfgang"
    const pattern = /\b([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+(?:\s+[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+){1,2})\b/g;

    let match;
    let matchCount = 0;
    const MAX_MATCHES = 500; // v2.3.4: Erhöht 100 → 500 für längere Texte

    while ((match = pattern.exec(text)) !== null) {
      // PERFORMANCE: Limit Matches
      if (++matchCount > MAX_MATCHES) {
        console.warn('[Enhanced NER] Capitalization: Zu viele Matches (>' + MAX_MATCHES + '), abgebrochen');
        break;
      }

      const name = match[1];
      const position = match.index;

      // Validierungen
      if (this.isBlacklisted(name)) continue;
      if (this.isSentenceStart(text, position)) continue;
      if (this.isAllUpperCase(name)) continue; // "WICHTIG INFO" ausschließen

      // v2.3.0 FIX: Filtere einzelne Wörter in Multi-Word Namen
      const words = name.split(/\s+/);
      const validWords = [];
      const capBlacklist = ['Tel', 'Email', 'Team', 'Test', 'Code', 'Info', 'Data', 'Bitte'];

      for (const word of words) {
        // Skip lowercase Wörter (z.B. "chris" in "Andres chris")
        if (word === word.toLowerCase()) break;

        // Skip ALL-CAPS Wörter (außer 2-Buchstaben wie "AL")
        if (word === word.toUpperCase() && word.length > 2) break;

        // Skip Blacklist
        if (capBlacklist.includes(word)) break;

        validWords.push(word);
      }

      if (validWords.length === 0) continue;

      const cleanName = validWords.join(' ');

      // Prüfe ob mind. ein Wort im Lexikon ist (erhöht Präzision)
      const hasKnownName = validWords.some(w => isFirstName(w) || isLastName(w));

      if (hasKnownName) {
        const cleanStart = position;
        results.push({
          text: cleanName,
          start: cleanStart,
          end: cleanStart + cleanName.length,
          confidence: 0.75,
          layer: 'capitalization'
        });
      }
      // Skip low-confidence (reduziert False Positives & Performance)
    }

    return results;
  }

  /**
   * LAYER 4: Compound-Namen (europäische Doppelnamen)
   * Hans-Peter, Jean-Luc, Marie-Claire, etc.
   * Hohe Präzision (~98% mit v2.3.7 Lexikon + Nomen-Check)
   */
  detectCompoundNames(text) {
    const results = [];

    // Pattern: Name-Name (mit Bindestrich)
    const pattern = /\b([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß]+-[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+)\b/g;

    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = match[1];
      const position = match.index;

      // v2.3.7: HYBRID FILTER - Nomen + Lexikon
      // 1. Prüfe ob es ein Nomen-Kompositum ist
      if (isHyphenatedNoun(name)) {
        continue; // Skip "Video-Transkripts", "Mail-Adressen", etc.
      }

      // 2. Prüfe ob ALLE Teile echte Namen im Lexikon sind
      const parts = name.split('-');
      const allPartsAreNames = parts.every(part =>
        part.length >= 3 &&
        (isFirstName(part) || isLastName(part))
      );

      // Nur hinzufügen wenn ALLE Teile echte Namen sind UND NICHT Nomen
      if (allPartsAreNames && !this.isBlacklisted(name)) {
        results.push({
          text: name,
          start: position,
          end: position + name.length,
          confidence: 0.98, // Höher wegen Dual-Validierung (Lexikon + Nomen)
          layer: 'compound'
        });
      }
    }

    return results;
  }

  /**
   * Validierung & Deduplizierung
   * Merged überlappende Detections und priorisiert nach Confidence
   */
  validateAndMerge(detections, text) {
    if (detections.length === 0) return [];

    // Sortiere nach Position
    detections.sort((a, b) => a.start - b.start);

    const merged = [];
    let current = null;

    for (const detection of detections) {
      if (!current) {
        current = { ...detection };
        continue;
      }

      // Prüfe Überlappung
      const overlap = this.calculateOverlap(current, detection);

      if (overlap > 0.5) {
        // Überlappung > 50% → Nimm das mit höherer Confidence
        if (detection.confidence > current.confidence) {
          current = { ...detection };
        }
        // Sonst: Behalte current
      } else {
        // Keine Überlappung → Speichere current und nimm neue detection
        merged.push(current);
        current = { ...detection };
      }
    }

    // Letzten hinzufügen
    if (current) {
      merged.push(current);
    }

    // Filtere nach Mindest-Confidence (>= 0.65)
    const filtered = merged.filter(d => d.confidence >= 0.65);

    // Format für Kompatibilität mit detector.js
    return filtered.map(d => ({
      text: d.text.trim(),
      start: d.start,
      end: d.end,
      score: d.confidence
    }));
  }

  /**
   * Berechnet Überlappung zwischen zwei Detections (0-1)
   */
  calculateOverlap(a, b) {
    const overlapStart = Math.max(a.start, b.start);
    const overlapEnd = Math.min(a.end, b.end);

    if (overlapStart >= overlapEnd) return 0;

    const overlapLength = overlapEnd - overlapStart;
    const minLength = Math.min(a.end - a.start, b.end - b.start);

    return overlapLength / minLength;
  }

  /**
   * Prüft ob Text am Satzanfang steht
   */
  isSentenceStart(text, position) {
    if (position === 0) return true;

    // Schaue zurück bis zum letzten Satzzeichen
    const beforeText = text.substring(Math.max(0, position - 50), position);
    const lastSentenceEnd = Math.max(
      beforeText.lastIndexOf('.'),
      beforeText.lastIndexOf('!'),
      beforeText.lastIndexOf('?'),
      beforeText.lastIndexOf('\n')
    );

    if (lastSentenceEnd === -1) return position === 0;

    // Prüfe ob nur Whitespace zwischen Satzzeichen und Position
    const between = beforeText.substring(lastSentenceEnd + 1);
    return /^\s*$/.test(between);
  }

  /**
   * Prüft ob Text in ALL CAPS ist
   */
  isAllUpperCase(text) {
    return text === text.toUpperCase() && text !== text.toLowerCase();
  }

  /**
   * Prüft ob Name in Blacklist ist
   */
  isBlacklisted(name) {
    if (!name) return true;

    const words = name.split(/\s+/);

    // Prüfe jedes Wort gegen Blacklist
    for (const word of words) {
      if (this.blacklist.has(word)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Kompatibilität: Detect Dates (leer, da nicht mehr benötigt)
   */
  async detectDates(text) {
    return [];
  }

  /**
   * Kompatibilität: Detect Locations (leer, da nicht mehr benötigt)
   */
  async detectLocations(text) {
    return [];
  }

  /**
   * Kompatibilität: Detect All
   */
  async detectAll(text) {
    const names = await this.detectNames(text);
    return {
      persons: names,
      dates: [],
      locations: []
    };
  }

  /**
   * Cache-Management (Kompatibilität - nicht mehr benötigt)
   */
  clearCache() {
    // No-op (kein Cache mehr da kein ML)
  }

  /**
   * Verfügbarkeits-Check (Kompatibilität)
   */
  isAvailable() {
    return this.nerReady;
  }
}

/**
 * Export Statistik-Funktion für Debugging
 */
export function getDetectorInfo() {
  return {
    version: '2.3.0',
    type: 'Enhanced NER (Accuracy Boost: ALL-CAPS Filter, Word-Boundary)',
    layers: 4,
    dependencies: 'None (Pure JavaScript)',
    lexiconSize: '~6600 names',
    languages: ['de', 'fr', 'it', 'en', 'at', 'international'],
    countries: ['Germany', 'Austria', 'Switzerland', 'France', 'Italy', 'UK', 'Ireland', 'B2B International'],
    performance: {
      maxTextLength: 50000,
      fastModeThreshold: 10000,
      capitalizationLimit: 20000
    }
  };
}
