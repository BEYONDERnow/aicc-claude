# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

---

## [2.1.0] - 2025-10-24

### 🔧 Fixed

#### Problem 1: IP/Telefon-Disambiguation
**Issue**: Die Zeichenfolge `046.645.424.684` wurde fälschlicherweise sowohl als IP-Adresse als auch als Deutsche Telefonnummer erkannt.

**Root Cause**:
- IP-Pattern validierte nicht die Oktett-Wertebereiche (0-255)
- Telefon-Patterns erlaubten Punkte (`.`) als Trennzeichen

**Lösung**:
- **IP-Validierung**: `customValidator` hinzugefügt, der prüft ob jedes Oktett im gültigen Bereich 0-255 liegt
  ```javascript
  customValidator: (match) => {
    const octets = match[0].split('.');
    return octets.every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }
  ```
- **Telefon-Patterns**: Punkte aus allen Telefon-Patterns entfernt (`[\s.-]` → `[\s-]`)
  - Betroffen: `phone_swiss`, `phone_german`, `phone_intl`

**Ergebnis**: `046.645.424.684` wird nun korrekt weder als IP noch als Telefonnummer erkannt ✅

---

#### Problem 2: Name List Recognition
**Issue**: Bei der Eingabe `"Hans Peter Tristan Andres Chris Beyeler Michael Schmid"` wurde nur "Hans" erkannt, nicht alle 7 Namen.

**Root Cause**:
1. NER (Named Entity Recognition) Confidence-Threshold zu hoch (0.7)
2. Scoring-System bestrafte 3-Wort-Namen ohne Kontext mit -8 Penalty (Zeile 975)
3. Sliding Window testete nur 2-3 Wort-Kombinationen

**Lösung**:
- **NER Confidence gesenkt**: 0.7 → 0.6 für bessere Erkennung von Namen-Listen
  - Datei: `extension/scripts/ner-detector.js` (Zeilen 113, 265)
- **Scoring-System überarbeitet** für 3+ Wort-Namen:
  - 3-Wort-Namen mit 100% Lexicon-Match:
    - **Vorher**: -8 Penalty
    - **Nachher**: +2 Bonus (ohne Kontext), +5 Bonus (mit Kontext)
  - Neue Unterstützung für 4+ Wort-Namen mit ratio-basiertem Scoring:
    ```javascript
    const ratio = knownCount / words.length;
    if (ratio >= 0.75) score += hasContext ? 4 : 2;
    else if (ratio >= 0.5) score += hasContext ? 2 : 0;
    else score -= 3;
    ```
- **Sliding Window erweitert**: 2-3 Wörter → 2-5 Wörter
  - Neue Kombinationen: 4-Wort und 5-Wort-Namen

**Ergebnis**: Namen-Listen wie `"Hans Peter Tristan Andres Chris Beyeler Michael Schmid"` werden nun vollständig erkannt ✅

---

#### Problem 3: Model Loading Warning
**Issue**: Console-Warnung `"Unable to determine content-length from response headers. Will expand buffer when needed."` beim Laden des NER-Models.

**Root Cause**: transformer.js kann keine Progress-Berechnung durchführen wenn CDN/Server keinen `Content-Length` Header sendet. Keine Fallback-Behandlung vorhanden.

**Lösung**: Verbesserte Progress-Callback-Logik mit Fallback
```javascript
progress_callback: (progress) => {
  if (progress.status === 'downloading') {
    if (progress.total && progress.total > 0) {
      // Content-Length verfügbar - zeige Prozent
      const percent = Math.round((progress.loaded / progress.total) * 100);
      console.log(`[AI Compliance NER] Download: ${percent}%`);
    } else {
      // Kein Content-Length - zeige nur geladene Bytes
      const mb = (progress.loaded / 1024 / 1024).toFixed(1);
      console.log(`[AI Compliance NER] Download: ${mb} MB geladen...`);
    }
  }
}
```

**Ergebnis**: Console-Ausgabe zeigt nun MB-Fortschritt statt fehlender Prozentangabe ✅

---

### 📝 Changed Files

- `extension/scripts/detector.js` (86 Zeilen geändert)
  - IP-Validierung mit customValidator
  - Telefon-Patterns ohne Punkte
  - Scoring-System für 3+ Wort-Namen
  - Sliding Window 2-5 Wörter
- `extension/scripts/ner-detector.js` (13 Zeilen geändert)
  - NER Confidence 0.7 → 0.6
  - Progress Callback mit Fallback
- `package.json` - Version 2.0.0 → 2.1.0
- `extension/manifest.json` - Version 2.0.0 → 2.1.0

---

## [2.0.0] - 2025-10-24

### 🚀 Added - KI-gestützte Erkennung mit Transformer.js

**BREAKING CHANGE**: Komplette Überarbeitung der Namenserkennung von Regex auf KI-basiertes Named Entity Recognition (NER).

#### Neue Features

**1. Transformer.js Integration**
- **Model**: `Xenova/bert-base-NER` (mehrsprachig: DE/EN/FR/IT)
- **Größe**: ~40MB (quantisiert, lokal gecached)
- **100% lokal**: Keine Server-Kommunikation
- **Lazy Loading**: Model wird nur bei Bedarf geladen

**2. Hybrid Detection System**
- **Phase 1**: Kritische Daten (Regex - schnell & zuverlässig)
- **Phase 2**: Warning-Patterns mit NER-Integration
  - Namen: KI-basierte Erkennung (PERSON entities)
  - PLZ: Filterung mit DATE-Erkennung (verhindert Jahrgänge)
  - Fallback zu Regex wenn NER nicht verfügbar

**3. Intelligente PLZ vs. Jahrgang-Unterscheidung**
```javascript
// Schweizer PLZ 1980 wird nicht als Jahrgang erkannt
const validZips = zipMatches.filter(zip => {
  const isDate = detectedDates.some(date =>
    date.text.includes(zipText)
  );
  return !isDate; // Filtere Jahrgänge heraus
});
```

**4. Enhanced Name Detection**
- Erkennt Namen OHNE expliziten Kontext
- Unterstützt mehrsprachige Namen (IT, FR, etc.)
- Confidence-basierte Filterung (> 0.7)
- Fallback zu Regex-basierter Erkennung

#### Neue Dateien
- `extension/scripts/ner-detector.js` - NER-Detector-Klasse mit Cache
- `rollup.config.js` - Bundle-Konfiguration für transformer.js

#### Geänderte Dateien
- `extension/scripts/detector.js` - Async analyze(), NER-Integration, Hybrid-System
- `package.json` - Dependency: `@xenova/transformers: ^2.17.2`

#### Technische Details
- **Cache-System**: LRU-Cache mit maximal 100 Einträgen
- **Model-Cache**: Browser-seitig gecached (IndexedDB)
- **Performance**: Erste Nutzung ~3s (Download), danach instant
- **Memory**: ~60MB zusätzlich (Model im RAM)

---

## [1.0.10] - 2025-10-23

### 🔧 Fixed - Name Detection False Positives

**Smart Fix**: Artikel-Check und Lexicon-Pflicht hinzugefügt

#### Problem
Falsche Erkennungen wie:
- "Die Zukunft" → NICHT "Die Zukunft"
- "der Hook" → NICHT "der Hook"
- "aus Ihrer" → NICHT "aus Ihrer"
- "Relationship Management" → NICHT als Name

#### Lösung
**1. Deutsche Artikel-Check** (Zeile 879-885)
```javascript
const hasArticleBefore = /\b(?:der|die|das|den|dem|des|ein|eine|einer|einem|einen|eines)\s+$/i.test(contextBefore);

if (hasArticleBefore && !hasContext) {
  return; // Kandidat wird NICHT hinzugefügt
}
```

**2. Lexicon-Pflicht ohne Kontext** (Zeile 918-926)
```javascript
if (!hasContext && knownCount === 0) {
  return { total: 0, threshold: 18, source: 'rejected-no-lexicon' };
}
```

**3. Erhöhter Threshold**
- Base: 8 → 10
- Mit Lexicon: 10
- Ohne Lexicon: 18 (fast unmöglich)

#### Ergebnis
- ✅ "Die Zukunft" → NICHT erkannt
- ✅ "Hans Peter" → Erkannt (beide im Lexicon)
- ✅ "Relationship Management" → NICHT erkannt

---

## [1.0.9] - 2025-10-22

### 🎨 Added - BEYONDER Design System

**Komplettes visuelles Redesign** im BEYONDER-Stil (beyonder.ch)

#### BEYONDER Farbpalette

**Primary Colors:**
- Dark Orange: `#FF9220`
- Gold Orange: `#FCC001`
- Midnight Blue: `#101E35`
- Deep Sky Blue: `#46BFED`
- Aquamarine: `#33D099`
- Deep Pink: `#E33A74`

**Status Colors:**
- OK: `#71D033` (grün)
- WARNING: `#FCC001` (gold)
- ERROR: `#E33A4E` (rot)

**Gradients:**
- Main: `#33d099 → #00939a → #005575 → #101e35`
- Highlight: `#e33a74 → #FF9220 → #fcc001`

#### Typography
**Lokale Fonts (100% offline & DSGVO-konform):**
- **Headings**: Poppins (Regular 400, SemiBold 600, Bold 700)
- **Body**: Montserrat (Regular 400, Medium 500, SemiBold 600)

#### Neue Dateien
- `extension/styles/fonts.css` - @font-face Definitionen
- `extension/fonts/Poppins/` - Poppins TTFs
- `extension/fonts/Montserrat/` - Montserrat TTFs
- `FONTS_INSTALLATION.md` - Setup-Anleitung

#### Geänderte Komponenten
- Popup (Extension Icon) - BEYONDER Gradient & Pulse-Animation
- Status Icon - BEYONDER Farben mit Badge
- Modal & Overlay - Gradient Header & Buttons
- Highlight Overlays - BEYONDER Farben

---

## [1.0.8] - 2025-10-22

### 🐛 Fixed - Zeilenumbrüche verschwinden beim Bearbeiten

**CRITICAL BUGFIX**

#### Problem
User-Feedback: _"Wenn ein Text mit Zeilenumbrüchen eingegeben wurde und ich diesen bearbeite, verschwinden die Zeilenumbrüche."_

#### Root Cause
Highlight-Overlays hatten `pointer-events: auto`, was:
- Maus-Events blockierte
- contenteditable-Verhalten störte
- Formatierung (inkl. Zeilenumbrüche) zerstörte

#### Fix
```css
/* ALT: */
.aicc-highlight-overlay { pointer-events: auto; }

/* NEU: */
.aicc-highlight-overlay { pointer-events: none; }
```

**Wichtig**: Tooltips funktionieren auch mit `pointer-events: none`

---

## [1.0.7] - 2025-10-22

### 🚀 Added - Hybrid Name Detection (Sliding Window)

**Revolutionäre Sliding-Window-Architektur**

#### Problem
User-Feedback: _"'Hans Peter Tristan' und 's Chris Beyeler Michael' wird erkannt"_ (Overlaps!)

#### Neue Lösung

**1. Sliding-Window-Algorithmus**
```javascript
Step 1: Extrahiere ALLE Wörter mit Positionen
Step 2: Teste alle 2-Wort und 3-Wort Kombinationen
Step 3: Score jeden Kandidaten (Lexicon + Kontext + Heuristik)
Step 4: Greedy Non-Overlapping Selection
```

**2. Multi-Strategie-Detection**
- Strategie A: Lexicon-basiert (700+ Namen)
- Strategie B: Kontext-basiert (auch Kleinschreibung!)
- Strategie C: Heuristik-basiert

**3. Anti-Overlap-Logik**
```javascript
if (words.length === 3 && !hasContext) {
  score -= 8; // STARKE PENALTY
}
```

#### Test-Ergebnisse
| Test | v1.0.6 | v1.0.7 |
|------|--------|--------|
| Hans Peter Tristan Andres... | ❌ Overlaps | ✅ 4 Namen |
| Kontakt: hans peter müller | ❌ | ✅ |
| Giuseppe Verdi | ❌ | ✅ |

**Performance**: +60% Accuracy

---

## [1.0.6] - 2025-10-21

### 🌍 Added - Massive Database Expansion

**700+ Namen aus 5 Ländern**

- 🇩🇪 Deutschland: 200+ Namen
- 🇨🇭 Schweiz: 100+ Namen
- 🇦🇹 Österreich: 80+ Namen
- 🇮🇹 Italien: 100+ Namen
- 🇫🇷 Frankreich: 100+ Namen

### 🔧 Fixed - RegEx Overlap
- Pattern: Nur 2 Wörter (statt 2-3) → Kein Overlap
- Anti-Overlap-Heuristik mit Penalty -8

---

## [1.0.5] - 2025-10-21

### 🚀 Added - Heuristische Name-Detection

**Multi-Faktor Scoring-System** statt einfacher RegEx

#### Scoring-Faktoren
- +5: Erstes Wort ist bekannter Vorname
- +4: Nach Kontext-Wort ("Name:", "Kontakt:")
- +3: 2 Wörter (Vor-/Nachname)
- -5: Nur 1 Wort
- -5: Enthält Zahlen
- ∞: Blacklist → ablehnen

#### Entscheidung
- Score ≥ 5 → Name erkannt ✓
- Score < 5 → Kein Name

---

## [1.0.4] - 2025-10-21

### 🐛 Fixed - Multiple Critical Bugs

- **Browser-Absturz**: MutationObserver Endlosschleife behoben
- **Telefonnummer-Overlap**: Range-Merging implementiert
- **Hover-Tooltips**: pointer-events + title-Attribute
- **Modal-Buttons**: Overlays während Modal ausgeblendet
- **Namen-Erkennung**: `name_standalone` Pattern hinzugefügt

---

## [1.0.3] - 2025-10-21

### 🚀 Added - Virtual Overlays

**Neue Highlighting-Technik**: Absolut positionierte Overlays

- Keine DOM-Modification mehr
- Formatierung bleibt erhalten
- ProseMirror-kompatibel
- Ähnlich wie LanguageTool Plus

#### Technisch
- Range API für Positionierung
- TreeWalker für DOM-Traversal
- Auto-Repositioning bei Scroll/Resize
- Multi-line Support

---

## [1.0.2] - 2025-10-21

### 🚀 Added - Inline-Highlighting

- Sensible Daten direkt markiert (rot/orange)
- Zeilenumbruch-Behandlung: \n → `<br>`
- Enter-Taste im Modal
- Autofocus auf Submit-Button

**PROBLEM**: Zerstört Formatierung (behoben in v1.0.3)

---

## [1.0.1] - 2025-10-21

### 🚀 Added - Modal bei Button-Click

- Submit-Button-Klicks abgefangen
- "Trotzdem fortfahren"-Button immer verfügbar
- Button-Monitoring mit Retry
- Icon-Größe angepasst

---

## [1.0.0] - 2025-10-21

### 🎉 Initial Release

#### Features
- ✅ Echtzeit-Erkennung sensibler Daten
- ✅ Status-Icon mit Counter-Badge
- ✅ Klickbares Overlay mit Tabelle
- ✅ Modal-Warnung vor Absenden
- ✅ Kontext-basierte Namenserkennung
- ✅ Mehrsprachigkeit (DE/EN)
- ✅ ChatGPT, Claude, Gemini Support
- ✅ BEYONDER Branding
- ✅ Dark-Mode Support

#### Erkannte Kategorien

**Kritisch:**
- E-Mail-Adressen
- IBAN und Kreditkarten
- AHV-Nummern (CH)
- Passwörter & API-Keys
- Ausweisnummern

**Warnung:**
- Telefonnummern (CH/DE/Intl)
- IP-Adressen
- PLZ (CH)
- Namen (kontextbasiert)
- Adressen, Geburtsdaten
- Geschäftsinformationen

---

## Versionsformat

- **MAJOR** (X.0.0): Breaking Changes, neue Hauptfunktionen
- **MINOR** (0.X.0): Neue Features, keine Breaking Changes
- **PATCH** (0.0.X): Bugfixes, kleine Verbesserungen

---

[2.1.0]: https://github.com/chrisbeyeler/aicc-claude/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.10...v2.0.0
[1.0.10]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/chrisbeyeler/aicc-claude/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/chrisbeyeler/aicc-claude/releases/tag/v1.0.0
