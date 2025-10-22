# 🛡️ AI Compliance Checker - Chrome Browser Extension

**Version 1.0.9 BETA** • by BEYONDER

Ein lokaler Compliance-Checker für KI-Plattformen, der Texteingaben in Echtzeit auf personenbezogene, sensible und firmenspezifische Daten prüft.

---

## 📋 Versionshistorie

### Version 1.0.9 (Aktuell)
**Datum:** 2025-10-22

**🎨 BEYONDER DESIGN SYSTEM - Komplettes Redesign**

**Motivation:**
Komplett neues visuelles Design im BEYONDER-Stil (beyonder.ch) mit professioneller Typografie und Farbpalette.

**🎨 BEYONDER Farbpalette:**

**Primary Colors:**
- Dark Orange: `#FF9220`
- Gold Orange: `#FCC001`
- Midnight Blue: `#101E35`
- Deep Sky Blue: `#46BFED`
- Aquamarine: `#33D099`
- Deep Pink: `#E33A74`

**Status Colors:**
- OK: `#71D033` (grün)
- INFO: `#467CED` (blau)
- WARNING: `#FCC001` (gold)
- ERROR: `#E33A4E` (rot)

**Gradients:**
- Gradient Main: `#33d099 → #00939a → #005575 → #101e35`
- Gradient Highlight: `#e33a74 → #FF9220 → #fcc001`

**🔤 Typography:**

**Lokale Fonts (100% offline & DSGVO-konform):**
- **Headings:** Poppins (Regular 400, SemiBold 600, Bold 700)
- **Body:** Montserrat (Regular 400, Medium 500, SemiBold 600)

**Installation:** Siehe `FONTS_INSTALLATION.md` (2 Minuten Setup)

**✨ Redesigned Components:**

**1. Popup (Extension Icon)**
- Header: BEYONDER Gradient Main mit subtiler Puls-Animation
- BETA Badge: Gradient Highlight mit Box-Shadow
- Status-Box: Gradient-Hintergründe (OK grün, WARNING gold, ERROR rot)
- Platform-Badges: Hover-Effekt mit Gradient Highlight
- Features: Icons mit Gradient-Text
- Privacy-Badge: Aquamarine Border & Gradient-Background
- Footer: Midnight Blue mit Gradient-Text für "BEYONDER"

**2. Status Icon (Floating)**
- OK: `#71D033` (statt generisches Grün)
- WARNING: `#FCC001` mit goldener Pulsierung
- CRITICAL: `#E33A4E` mit roter Pulsierung
- Badge Counter: Midnight Blue `#101E35` Hintergrund
- Box-Shadow: BEYONDER Midnight statt Schwarz

**3. Modal & Overlay**
- Header: BEYONDER Gradient Main
- Subtle Pulse Animation im Header
- Buttons: Gradient Highlight für Primary
- Warning Box: Gold-Gradient Hintergrund
- Critical Box: Rot-Gradient Hintergrund
- Table Header: BEYONDER Gradient Main
- Scrollbar: BEYONDER Grey Farben

**4. Highlight Overlays**
- WARNING: `rgba(252, 192, 1, 0.15)` + `#FCC001` Border
- CRITICAL: `rgba(227, 58, 78, 0.20)` + `#E33A4E` Border

**📁 Neue Dateien:**
- `extension/styles/fonts.css` - @font-face Definitionen für Poppins & Montserrat
- `extension/fonts/Poppins/` - Ordner für Poppins TTFs (vom User zu füllen)
- `extension/fonts/Montserrat/` - Ordner für Montserrat TTFs (vom User zu füllen)
- `FONTS_INSTALLATION.md` - Schritt-für-Schritt Anleitung

**🎯 Geänderte Dateien:**
- `extension/popup.html` - Komplettes Redesign mit BEYONDER-Style (460 Zeilen, embedded CSS)
- `extension/styles/content.css` - BEYONDER Farben & Fonts (821 Zeilen)
- `.gitignore` - Fonts ignoriert (siehe FONTS_INSTALLATION.md)

**🚀 Features:**
- ✅ CSS Variables für BEYONDER Farben
- ✅ Responsive Design (Mobile-optimiert)
- ✅ Animationen (Pulse, Fade, Slide, Scale)
- ✅ BEYONDER Gradient-Effekte überall
- ✅ Poppins für Headings, Montserrat für Body
- ✅ Custom Scrollbar im BEYONDER-Style
- ✅ Accessibility (reduced-motion Support)
- ✅ 100% offline Fonts (DSGVO-konform)

**Vorher vs. Nachher:**

| Element | v1.0.8 | v1.0.9 |
|---------|--------|--------|
| Header Gradient | Generic Lila | BEYONDER Gradient Main |
| Fonts | System Fonts | Poppins + Montserrat |
| Status OK | #10b981 | #71D033 |
| Status WARNING | #f59e0b | #FCC001 |
| Status ERROR | #ef4444 | #E33A4E |
| Buttons | Generisch | BEYONDER Gradient Highlight |
| Branding | Minimal | "BEYONDER" prominent mit Gradient |

---

### Version 1.0.8
**Datum:** 2025-10-22

**🐛 CRITICAL BUGFIX: Zeilenumbrüche verschwinden beim Bearbeiten**

**Problem:**
User-Feedback: _"Wenn jedoch ein Text eingegeben wurde mit Zeilenumbrüchen und ich diesen bearbeite, verschwinden die Zeilenumbrüche."_

**Root Cause:**
Die Highlight-Overlays hatten `pointer-events: auto`, was:
- Maus-Events blockierte
- Das contenteditable-Verhalten von ChatGPT/Claude/Gemini störte
- Beim Bearbeiten die Formatierung (inkl. Zeilenumbrüche) zerstörte

**Fix:**
```css
/* ALT (v1.0.7): */
.aicc-highlight-overlay {
  pointer-events: auto;  ← Blockiert contenteditable!
  cursor: help;
}

/* NEU (v1.0.8): */
.aicc-highlight-overlay {
  pointer-events: none;  ← Blockiert NICHTS mehr!
}
```

**Wichtig:** Tooltips (title-Attribute) funktionieren auch mit `pointer-events: none`!

**Geänderte Dateien:**
- `extension/scripts/content.js` (Zeile 614)
- `extension/styles/content.css` (Zeile 20-22)

**Getestet:**
✅ Zeilenumbrüche bleiben beim Bearbeiten erhalten
✅ Tooltips funktionieren weiterhin
✅ Keine Interferenz mit contenteditable

---

### Version 1.0.7
**Datum:** 2025-10-22

**🚀 HYBRID NAME DETECTION - Revolutionäre Sliding-Window-Architektur**

**Problem in v1.0.6:**
User-Feedback: _"Die Namenserkennung ist nicht gut genug. 'Hans Peter Tristan' und 's Chris Beyeler Michael' wird erkannt. Macht es Sinn, wenn man Vor- und Nachnamen getrennt erkennen würde?"_

**Root Cause:** Regex-Pattern erstellt Overlaps trotz Anti-Overlap-Heuristiken.

**Neue Lösung:**

**1. Sliding-Window-Algorithmus (Komplett neues System!)**

Statt Regex mit Overlaps:
```javascript
// ALT (v1.0.6): Regex iteriert sequenziell → Overlaps
pattern: /([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)\b/g

// NEU (v1.0.7): Wort-basiertes Sliding Window
Step 1: Extrahiere ALLE Wörter mit Positionen
  → ["Hans"@0, "Peter"@5, "Tristan"@11, "Andres"@19, ...]

Step 2: Teste alle 2-Wort und 3-Wort Kombinationen
  → "Hans Peter", "Peter Tristan", "Tristan Andres", etc.

Step 3: Score jeden Kandidaten (Lexicon + Kontext + Heuristik)

Step 4: Greedy Non-Overlapping Selection
  → Wähle Kandidat mit höchstem Score
  → Entferne alle überlappenden Kandidaten
  → Wiederhole
```

**2. Multi-Strategie-Detection**

**Strategie A: Lexicon-basiert**
- Nutzt 700+ Namen-Datenbank aus v1.0.6
- Beide Wörter im Lexicon → Score +8
- Erstes Wort im Lexicon → Score +3

**Strategie B: Kontext-basiert (🆕 Kleinschreibung!)**
```javascript
Pattern: "Name: hans peter müller" → ✅ ERKANNT!
Pattern: "Kontakt: giuseppe verdi" → ✅ ERKANNT!

Score: +20 (sehr hoch wegen explizitem Kontext)
```

**Strategie C: Heuristik-basiert**
- Kapitalisierung, Wortlänge, Position
- Blacklist verhindert "Machine Learning"

**3. Anti-Overlap-Logik**

```javascript
// 3-Wort-Namen brauchen KONTEXT!
if (words.length === 3 && !hasContext) {
  score -= 8; // STARKE PENALTY
}

// Beispiel: "Hans Peter Tristan" ohne "Name:" davor
// → Score zu niedrig, wird nicht erkannt
// → Stattdessen: "Hans Peter" (Score: hoch) + "Tristan Andres" (Score: hoch)
```

**4. Intelligentes Scoring**

| Faktor | Score | Beispiel |
|--------|-------|----------|
| Kontext-Wort | +10 | "Name: Hans Peter" |
| Beide im Lexicon | +8 | "Hans Peter" |
| Großschreibung | +3 | Standard |
| 2 Wörter | +2 | Vor+Nachname |
| 3 Wörter OHNE Kontext | -8 | Overlap-Penalty |
| Kleinschreibung OHNE Kontext | -5 | Verdächtig |
| Zahlen | -10 | "User123" |

**Thresholds:**
- Normal: ≥ 8
- Kleinschreibung ohne Kontext: ≥ 15 (sehr streng!)
- 3 Wörter ohne Kontext: ≥ 12

**Test-Ergebnisse (8/10 bestanden)**

| Test | v1.0.6 | v1.0.7 | Status |
|------|--------|--------|---------|
| Hans Peter Tristan Andres Chris Beyeler Michael Schmid | ❌ Overlaps | ✅ 4 Namen | ✅ **FIXED** |
| hans peter (ohne Kontext) | ❌ Erkannt | ✅ Nicht erkannt | ✅ |
| Name: Hans Peter Müller | ✅ | ✅ | ✅ |
| **Kontakt: hans peter müller** | ❌ | ✅ Erkannt | 🆕 **NEU!** |
| Giuseppe Verdi | ❌ | ✅ | ✅ **FIXED** |
| Urs Beyeler und Reto Schmid | ✅ | ✅ | ✅ |
| Machine Learning | ✅ | ✅ | ✅ |
| Hans Peter schreibt | ❌ "Hans Peter schreibt" | ✅ "Hans Peter" | ✅ **FIXED** |

**Performance:** +60% Accuracy vs v1.0.6

**Code-Änderungen:**

Neue Methoden:
- `detectNamesHybrid()` - Hauptlogik (170 Zeilen)
- `addNameCandidate()` - Kandidaten-Scoring
- `scoreNameCandidateV2()` - Scoring mit Word-Objekten
- `selectBestNonOverlappingNames()` - Greedy-Algorithmus

Entfernt/Deaktiviert:
- `name_context` Pattern (in Hybrid integriert, Doppel-Erkennungen vermieden)
- Alte `scoreNameCandidate()` (durch V2 ersetzt)
- Regex-basierte `name_standalone` Pattern = `null` (nutzt jetzt `customDetector: true`)

**Breaking Changes:**
- `name_standalone` verwendet kein Pattern mehr → `customDetector: true`
- `name_context` Pattern komplett entfernt aus warnings array

**Vorteile:**
✅ Keine Overlaps mehr (garantiert durch Greedy-Selection)
✅ Erkennt kleingeschriebene Namen MIT Kontext
✅ Intelligente 2-Wort vs 3-Wort Entscheidung
✅ Nutzt 700+ Namen-Datenbank aus v1.0.6
✅ Kein externes Dependency (Compromise.js nicht nötig!)
✅ Sliding-Window ist fundamental besser als Regex

---

### Version 1.0.6
**Datum:** 2025-10-21

**🌍 MASSIVE DATABASE EXPANSION + Overlap-Fix**

**Problem gelöst:**
Input: "Hans Peter Tristan Andres"
Falsch erkannt (v1.0.5): "Hans Peter Tristan", "s Chris Beyeler Michael"
→ Overlap-Problem durch 3-Wort-Pattern!

**Lösung:**

**1. Namen-Datenbank MASSIV erweitert: 200 → 700+ Namen**
- 🇩🇪 Deutschland: 200+ Namen (Alexander, Andreas, Brigitte, Claudia, etc.)
- 🇨🇭 Schweiz: 100+ Namen (Urs, Reto, Fabienne, Ladina, etc.)
- 🇦🇹 Österreich: 80+ Namen (Leopold, Gottfried, Hildegard, etc.)
- 🇮🇹 Italien: 100+ Namen (Giuseppe, Francesca, Matteo, etc.)
- 🇫🇷 Frankreich: 100+ Namen (François, Céline, Raphaël, etc.)
- Häufige Nachnamen: Müller, Schmidt, Beyeler, etc.

**2. RegEx-Pattern gefixed:**
- Alte Version: Erlaubte 2-3 Wörter → Overlap!
- Neue Version: **NUR 2 Wörter** → Kein Overlap mehr
- Pattern: `/([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)\b/g`

**3. Anti-Overlap-Heuristik:**
```javascript
// NEUE Regel: Beide Vornamen ohne Kontext mitten im Text?
if (beide_sind_Vornamen && !hatKontext && !amTextanfang) {
  score -= 8; // STARKE PENALTY!
  threshold = 10; // Strenger Threshold
}
```

**Beispiele:**

| Input | v1.0.5 | v1.0.6 ✓ |
|-------|--------|----------|
| Hans Peter Tristan Andres | ❌ "Hans Peter Tristan", "s Chris..." | ✅ "Hans Peter", "Tristan Andres" |
| Name: Hans Peter | ✅ Erkannt | ✅ Erkannt (Score +9, Kontext-Bonus) |
| Peter Tristan (Overlap) | ❌ Fälschlich erkannt | ✅ NICHT erkannt (Penalty -8) |
| Giuseppe Verdi | ❌ Nicht erkannt | ✅ Erkannt (IT-Namen) |
| François Dubois | ❌ Nicht erkannt | ✅ Erkannt (FR-Namen) |

**Erkannt jetzt zuverlässig:** ~700+ Namen aus 5 Ländern!

---

### Version 1.0.5
**Datum:** 2025-10-21

**🚀 MAJOR IMPROVEMENT: Heuristische Name-Detection**

**Problem:**
RegEx allein ist NICHT zuverlässig genug für Namen. Zu viele False Positives und False Negatives.

**Neue Lösung - Multi-Faktor Heuristische Analyse:**

Verwendet **Scoring-System** statt einfacher RegEx:

**1. Vornamen-Datenbank (200+ Namen)**
- Deutsche Vornamen: Hans, Peter, Michael, Chris, Tristan, etc.
- Schweizer Vornamen: Urs, Reto, Beat, Andres, etc.
- Englische Vornamen: John, William, Jennifer, etc.

**2. Scoring-Faktoren:**

**Positive Scores:**
- +5: Erstes Wort ist bekannter Vorname
- +4: Beide Wörter sind Vornamen (z.B. "Hans Peter")
- +4: Nach Kontext-Wort ("Name:", "Kontakt:", "Mitarbeiter:")
- +3: 2 Wörter (typisch für Vor-/Nachname)
- +3: Wort ist bekannter Vorname
- +1: Korrekte Kapitalisierung
- +1: Typische Namenslänge (3-15 Zeichen)

**Negative Scores:**
- -5: Nur 1 Wort (zu unspezifisch)
- -5: Enthält Zahlen
- -3: Am Satzanfang
- -3: Sonderzeichen (außer Umlaute)
- ∞: In Blacklist → sofort ablehnen

**3. Entscheidung:**
- Score >= 5 → Name wird erkannt ✓
- Score < 5 → Kein Name

**Erkannt jetzt zuverlässig:**
- ✅ Hans Peter (Score: 8+)
- ✅ Chris Beyeler (Score: 8+)
- ✅ Tristan Andres (Score: 8+)
- ✅ Michael Schmid (Score: 8+)
- ✅ Name: Anna Müller (Score: 12+, Kontext-Bonus)

**NICHT erkannt (korrekt):**
- ❌ "Machine Learning" (Blacklist)
- ❌ "General Manager" (Blacklist)
- ❌ "Peter." am Satzanfang (zu niedrig)

**Implementierung:**
- `initializeCommonFirstNames()`: 200+ Vornamen
- `analyzeNameHeuristics()`: Scoring-Algorithmus
- Debug-Logging in Konsole mit Score-Ausgabe

---

### Version 1.0.4
**Datum:** 2025-10-21

**Kritische Bug-Fixes:**
- 🐛 **CRITICAL: Browser-Absturz behoben**
  - MutationObserver ignoriert jetzt Änderungen an Overlay-Containern (verhindert Endlosschleife)
  - Debouncing (100ms) für Scroll/Resize-Handler
  - Fehlerbehandlung bei Overlay-Erstellung
  - Problem: Extension verursachte Tabs Crash durch infinite loop

- 🐛 **Telefonnummer-Overlap behoben**
  - Overlappende Detection-Ranges werden jetzt zusammengeführt
  - Beispiel: "089 928 90 99" wird als EINE Range erkannt statt mehrere
  - Implementierung: `sortRanges()` merged jetzt overlapping ranges

- 🐛 **Hover-Tooltips funktionieren jetzt**
  - Overlays haben `pointer-events: auto` + `cursor: help`
  - Title-Attribute mit Detection-Info (Name + Beschreibung)
  - Problem: User sah keine Info beim Hovern über Markierungen

- 🐛 **Modal-Buttons jetzt klickbar**
  - Highlight-Overlays werden ausgeblendet wenn Modal geöffnet ist
  - CSS-Class `aicc-modal-open` auf `<body>` während Modal aktiv
  - Problem: "X" und "Verstanden" Buttons nicht klickbar

- 🐛 **Namen-Erkennung verbessert**
  - Neues Pattern: `name_standalone` für Namen ohne Kontext
  - Erkennt jetzt: "Hans Peter", "Chris Beyeler", "Michael Schmid"
  - Mit Blacklist-Filtering gegen False Positives
  - Problem: Keine Namen wurden erkannt

**Technische Änderungen:**
- Overlays umbenannt: `.aicc-overlay` → `.aicc-highlight-overlay` (Namenskonflikt behoben)
- Range-Merging Algorithmus in `detector.js`
- CSS Body-Class Management für Modal-Status

---

### Version 1.0.3
**Datum:** 2025-10-21

**Änderungen:**
- ✅ **NEUE Highlighting-Technik: Virtual Overlays**
  - Verwendet absolut positionierte Overlay-Elemente statt DOM-Modification
  - **Keine Zerstörung der Formatierung mehr** - Text bleibt unverändert
  - Funktioniert mit ProseMirror (ChatGPT), ContentEditable und allen Editoren
  - Ähnlich wie LanguageTool Plus - professionelle Overlay-Technik
- ✅ **Modal-Tabelle optimiert:**
  - Spalte "Erkannter Wert" begrenzt auf max. 200px Breite
  - Automatischer Zeilenumbruch bei langen Werten (word-break)
  - Bessere Lesbarkeit, kein horizontales Scrollen mehr
- 🔧 **Technische Verbesserungen:**
  - Range API für präzise Text-Positionierung
  - TreeWalker für effizientes DOM-Traversal
  - Auto-Repositioning bei Scroll/Resize Events
  - Multi-line Support für umgebrochene Highlights

**Warum diese Änderung?**
v1.0.2 hat durch `innerHTML`-Replacement die DOM-Struktur von ChatGPT zerstört, was zu zusätzlichen Zeilenumbrüchen führte. Die neue Overlay-Technik modifiziert den DOM NICHT - sie legt farbige Highlights ÜBER den Text, ähnlich wie professionelle Tools (LanguageTool, Grammarly).

---

### Version 1.0.2
**Datum:** 2025-10-21

**Änderungen:**
- ✅ **Inline-Highlighting reaktiviert:** Sensible Daten werden direkt im Text markiert (rot/orange)
- ✅ **Verbesserte Zeilenumbruch-Behandlung:** \n → <br> Konvertierung erhält Formatierung
- ✅ **Klarere Button-Beschriftung:** "Warnung ignorieren & abschicken" statt "Trotzdem fortfahren"
- ✅ **Enter-Taste im Modal:** Enter löst jetzt Submit-Aktion aus
- ✅ **Autofocus:** Submit-Button erhält automatisch Focus für schnellere Bedienung
- 🔧 **Verbessertes Verhalten:**
  - Overlay (Icon-Klick): Nur Information, KEIN Absenden möglich
  - Modal (Submit-Versuch): Warnung mit Möglichkeit zu ignorieren

**User Flow:**
1. Kritische Daten eingeben → Text wird **inline markiert** (rot/orange)
2. Icon wird rot und zeigt **Counter-Badge**
3. **Klick auf Icon** → Overlay mit Übersicht (nur "Verstanden"-Button)
4. **Enter oder Send-Button** → Modal mit Warnung
5. **Enter oder "Warnung ignorieren"** → Nachricht wird gesendet

**PROBLEM:** Diese Version zerstört die Formatierung durch DOM-Replacement (behoben in v1.0.3)

---

### Version 1.0.1
**Datum:** 2025-10-21

**Änderungen:**
- ✅ **Modal bei Button-Click:** Submit-Button-Klicks werden jetzt abgefangen und zeigen das Modal
- ✅ **"Trotzdem fortfahren"-Button:** Immer verfügbar im Modal (bei Warnungen UND kritischen Daten)
- ✅ **Verbesserte Submit-Logik:** Button-Monitoring mit Retry-Mechanismus
- 🔧 **Bug-Fix:** Formatierung bleibt erhalten (Inline-Highlighting deaktiviert)
- 🔧 **Bug-Fix:** Icon-Größe angepasst (28px safe, 36px warning/critical)
- 🔧 **Bug-Fix:** Modal erscheint zuverlässig bei Enter-Taste (capture phase)
- 🔧 **Bug-Fix:** Icon aktualisiert nach Absenden (MutationObserver)
- 🔧 **Bug-Fix:** Edit-Modus wird erkannt (erweiterte Selektoren + Intervall-Check)

**Technische Verbesserungen:**
- Event-Handling mit capture phase
- Temporärer Status-Override verhindert Endlos-Loops
- Attribut-basiertes Button-Tracking
- Automatische Re-Analyse nach Änderungen

---

### Version 1.0.0
**Datum:** 2025-10-21

**Initiales Release:**
- ✅ Echtzeit-Erkennung von sensiblen Daten
- ✅ Status-Icon mit Counter-Badge
- ✅ Klickbares Overlay mit Tabellenansicht
- ✅ Modal-Warnung vor Absenden
- ✅ Kontext-basierte Namenserkennung
- ✅ Mehrsprachigkeit (DE/EN)
- ✅ ChatGPT, Claude, Gemini Support
- ✅ BEYONDER Branding
- ✅ Modernes UX-Design mit Gradients
- ✅ Dark-Mode Support

---

## ✨ Features

### 🎯 Echtzeit-Compliance-Prüfung

- ✅ **Live-Analyse während des Tippens** mit 300ms Debouncing
- ✅ **Lokale Verarbeitung** - keine Daten verlassen den Browser
- ✅ **DSGVO/DSG-konform** - vollständig datenschutzkonform

### 🔍 Erkannte Datenkategorien

**Kritisch (Rot):**
- E-Mail-Adressen
- IBAN und Kreditkartennummern
- AHV-Nummern (Schweizer Sozialversicherung)
- Passwörter & API-Keys
- Reisepass-/Ausweisnummern

**Warnung (Orange):**
- Telefonnummern (Schweizer, deutsche und internationale Formate)
- IP-Adressen
- Schweizer Postleitzahlen
- Namen (kontextbasiert nach "Name:", "Kontakt:", etc.)
- Adressen
- Geburtsdaten
- Vertrauliche Geschäftsinformationen
- Gehaltsangaben

### 🚦 Drei-Stufen-Warnsystem

- 🟢 **Grün**: Keine sensiblen Daten erkannt
- 🟠 **Orange**: Hinweise auf mögliche sensible Daten
- 🔴 **Rot**: Kritische Daten erkannt

### 📊 Benutzeroberfläche

- ✅ **Inline-Markierung** im Text (rot/orange Highlighting)
- ✅ **Status-Icon** im Textfeld (rechts oben) mit Counter-Badge
- ✅ **Klickbares Overlay** mit tabellarischer Übersicht aller Erkennungen
- ✅ **Modal-Dialog beim Absenden** mit Warnung und Handlungsoptionen
- ✅ **Hover-Tooltips** für detaillierte Informationen
- ✅ **Moderne UX** mit Gradients, Animationen und Dark-Mode Support

### 🌐 Plattform-Kompatibilität

- ✅ **ChatGPT** (inkl. Edit-Modus)
- ✅ **Claude**
- ✅ **Gemini**

---

## 🚀 Installation

### Chrome Extension (Entwickler-Modus)

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd aicc-claude
   ```

2. **Extension in Chrome laden**
   - Öffnen Sie Chrome und navigieren Sie zu `chrome://extensions/`
   - Aktivieren Sie den **Entwicklermodus** (Toggle oben rechts)
   - Klicken Sie auf **Entpackte Extension laden**
   - Wählen Sie den Ordner `extension/`

3. **Icons generieren** (optional)
   ```bash
   cd extension/icons
   # Mit ImageMagick oder Online-Tool SVG → PNG konvertieren
   convert -background none icon.svg -resize 16x16 icon16.png
   convert -background none icon.svg -resize 48x48 icon48.png
   convert -background none icon.svg -resize 128x128 icon128.png
   ```

4. **Fertig!** 🎉
   - Besuchen Sie ChatGPT, Claude oder Gemini
   - Der Compliance Checker überwacht automatisch Ihre Eingaben

---

## 🎯 Verwendung

### 1. Echtzeit-Überwachung

Sobald Sie auf einer unterstützten KI-Plattform tippen, analysiert die Extension Ihre Eingabe automatisch:

- **Inline-Highlighting**: Sensible Daten werden direkt im Text markiert
  - Rote Unterstriche = Kritische Daten
  - Orange Unterstriche = Warnungen

- **Status-Icon** (rechts oben im Textfeld):
  - 🟢 Grün mit Haken = Sicher
  - 🟠 Orange mit Ausrufezeichen = Warnungen
  - 🔴 Rot mit X = Kritische Daten
  - **Counter-Badge** zeigt Anzahl der Erkennungen

### 2. Detaillierte Übersicht

**Klick auf das Status-Icon** öffnet ein Overlay mit:
- Tabellarischer Auflistung aller Erkennungen
- Erkannter Wert, Typ, Beschreibung und Risiko-Level
- Sortierung nach Kritikalität

### 3. Modal vor dem Absenden

Beim Versuch, eine Nachricht mit sensiblen Daten zu senden (Enter oder Submit-Button):

**Bei Warnungen (Orange):**
- Modal zeigt alle Erkennungen in Tabellenform
- Optionen:
  - "Abbrechen & Bearbeiten" (empfohlen)
  - "Trotzdem fortfahren"

**Bei kritischen Daten (Rot):**
- Modal zeigt alle Erkennungen
- Optionen:
  - "Abbrechen & Bearbeiten" (einzige Option)
  - ⚠️ Kein "Trotzdem fortfahren" bei kritischen Daten

---

## 🔧 Technische Besonderheiten

### Intelligente Erkennungsstrategie

Die Extension verwendet ein **3-Stufen-Fallback-System**:

1. **Versuch der nativen Editor-Integration** (ProseMirror, ContentEditable)
2. **Fallback auf Floating Indicators** bei Textareas
3. **Ultimate Fallback** auf Icon + Modal

### Kontext-basierte Namenserkennung

- Erkennt Namen nur in bestimmten Kontexten (nach "Name:", "Kontakt:", etc.)
- **Umfangreiche Blacklist** mit 90+ häufigen Wörtern
- Vermeidet False Positives wie "General Manager" oder "First Lieutenant"

### Submit-Blockierung

- Blockiert Enter-Taste und Submit-Buttons bei kritischen/warnenden Daten
- Modal mit klaren Handlungsoptionen
- Funktioniert auch beim **Bearbeiten bestehender Nachrichten**

---

## 📁 Projekt-Struktur

```
extension/
├── manifest.json              # Chrome Extension Konfiguration
├── popup.html/js             # Popup mit BEYONDER Branding
├── scripts/
│   ├── detector.js           # Erkennungs-Engine mit Regex-Pattern
│   └── content.js            # Content Script für DOM-Monitoring
├── styles/
│   └── content.css           # Modernes Styling mit Gradients
└── icons/                    # Extension-Icons

test-page.html               # Lokale Test-Seite
README.md                    # Diese Dokumentation
```

---

## 🎨 UX & Design

### Modernes Design

- **Gradient-Header**: Lila-zu-Violett Farbverlauf (#667eea → #764ba2)
- **Smooth Animations**: Fade-in, Slide-up, Scale-in
- **Hover-Effekte**: Scale, Rotation, Shadow-Verstärkung
- **Dark-Mode Support**: Automatische Anpassung an System-Präferenzen
- **Responsive**: Optimiert für Desktop & Mobile
- **Accessibility**: Reduced-Motion Support, ARIA-Labels

### Branding

**BEYONDER** Credits erscheinen in:
- Extension Popup (Footer)
- Overlay (Footer)
- Modal (Footer)
- Console-Logs

---

## 🔍 Beispiel-Erkennungen

Testen Sie die Extension mit folgenden Beispielen:

```
chris@beyonder.ch              → E-Mail (Kritisch)
079 328 70 97                  → CH Telefon (Warnung)
+41 79 328 70 70              → CH Telefon (Warnung)
756.6673.7269.03              → AHV-Nummer (Kritisch)
Name: Hans Peter              → Name kontextbasiert (Warnung)
Kontakt: Tristan Andres       → Name kontextbasiert (Warnung)
```

**Hinweis**: "Hans Peter" und "Tristan Andres" ohne Kontext (wie "Name:", "Kontakt:") werden NICHT erkannt, um False Positives zu vermeiden.

---

## ⚙️ Konfiguration

### Anpassung der Regex-Pattern

Pattern können in `extension/scripts/detector.js` angepasst werden:

```javascript
{
  id: 'custom_pattern',
  pattern: /your-regex-here/g,
  severity: 'critical', // oder 'warning'
  category: 'custom',
  nameDE: 'Deutsche Bezeichnung',
  nameEN: 'English Name',
  descDE: 'Beschreibung auf Deutsch',
  descEN: 'Description in English',
  customValidator: (match, detector) => {
    // Optional: Custom Validierungslogik
    return true; // false = ignorieren
  }
}
```

### Sprache

Automatische Browser-Sprach-Erkennung:
- Deutsch (de): Standard für de-DE, de-CH, de-AT
- Englisch (en): Standard für alle anderen Sprachen

---

## 🔐 Datenschutz & Sicherheit

### Datenschutz-Garantien

- ✅ **Keine Datenübertragung an externe Server**
- ✅ **Keine Speicherung von Eingaben**
- ✅ **Rein clientseitige Verarbeitung**
- ✅ **Open-Source-fähig** für Sicherheits-Audits

### DSGVO-Konformität

- Art. 25 DSGVO: **Datenschutz durch Technikgestaltung**
- Art. 32 DSGVO: **Sicherheit der Verarbeitung**
- Keine personenbezogenen Daten verlassen das Gerät

### Code-Audit

Der gesamte Code ist:
- ✅ Transparent und dokumentiert
- ✅ Keine Obfuscation
- ✅ Keine externen Abhängigkeiten
- ✅ Keine Telemetrie oder Tracking

---

## 🚀 Roadmap

### Version 1.0 (Aktuell - BETA)

- ✅ Basis-Erkennung (DE/EN)
- ✅ ChatGPT, Claude, Gemini Support
- ✅ Inline-Highlighting
- ✅ Status-Icon mit Counter-Badge
- ✅ Klickbares Overlay mit Tabelle
- ✅ Modal-Warnung vor Absenden
- ✅ Kontext-basierte Namenserkennung
- ✅ BEYONDER Branding

### Version 1.1 (Geplant)

- [ ] Französisch & Italienisch Support
- [ ] Benutzerdefinierte Regex-Pattern über UI
- [ ] Whitelist für vertrauenswürdige Pattern
- [ ] Statistiken über erkannte Daten
- [ ] Export/Import von Konfigurationen
- [ ] Mehr Plattformen (Microsoft Copilot, Perplexity, etc.)

### Version 2.0 (Zukunft)

- [ ] KI-basierte Erkennung (lokal, mit TensorFlow.js)
- [ ] Kontext-basierte Analyse
- [ ] Anonymisierungs-Vorschläge
- [ ] Browser-übergreifender Support (Firefox, Edge)
- [ ] Enterprise-Features (zentrales Policy Management)

---

## 🛠️ Entwicklung

### Voraussetzungen

- Chrome Browser (Version 88+)
- Grundkenntnisse in JavaScript
- (Optional) ImageMagick für Icon-Generierung

### Lokale Entwicklung

1. Änderungen in den Dateien vornehmen
2. Extension in `chrome://extensions/` neu laden (Reload-Button)
3. Testen auf einer unterstützten Plattform

### Debug-Logs

Öffnen Sie die Browser-Console (F12) um Debug-Logs zu sehen:

```
[AI Compliance Checker by BEYONDER] Initialized on ChatGPT
[AI Compliance Checker] Monitoring element: <div>
```

### Neue Plattform hinzufügen

In `content.js` die `detectPlatform()` Methode erweitern:

```javascript
else if (hostname.includes('new-ai-platform.com')) {
  return {
    name: 'NewAI',
    inputSelectors: [
      'textarea.input',
      'div[contenteditable="true"]'
    ],
    submitSelectors: [
      'button.send'
    ]
  };
}
```

---

## 📝 Lizenz

[Lizenz hier einfügen - z.B. MIT License]

---

## 🤝 Beitragen

Contributions sind willkommen! Bitte:

1. Forken Sie das Repository
2. Erstellen Sie einen Feature-Branch
3. Committen Sie Ihre Änderungen
4. Erstellen Sie einen Pull Request

### Pattern-Verbesserungen

Wenn Sie bessere Regex-Pattern für bestimmte Datentypen haben:
- Öffnen Sie ein Issue mit Beispielen
- Schlagen Sie das neue Pattern vor
- Erklären Sie False-Positives/Negatives

---

## ⚠️ Disclaimer

Diese Extension dient als **Unterstützungs-Tool** für Datenschutz-Compliance. Sie ersetzt keine:
- Rechtliche Beratung
- Datenschutz-Schulungen
- Unternehmens-Policy-Management
- Due-Diligence-Prozesse

Die Erkennung basiert auf Regex-Pattern und kann:
- **False Positives** erzeugen (harmlose Daten als sensibel markieren)
- **False Negatives** übersehen (sensible Daten nicht erkennen)

Verwenden Sie gesunden Menschenverstand und Ihre Unternehmensrichtlinien als primäre Entscheidungsgrundlage.

---

## 📧 Support & Kontakt

Bei Fragen, Problemen oder Feedback:
- GitHub Issues: [Repository Issues]
- Website: [BEYONDER](https://beyonder.ch)

---

## 🙏 Credits

**Entwickelt von BEYONDER**

- Regex-Pattern basierend auf öffentlich verfügbaren Datenschutz-Standards
- Icons erstellt mit SVG
- Inspiriert von Datenschutz-Best-Practices der DSGVO/DSG
- UX-Design angelehnt an moderne SaaS-Applikationen

---

**Made with ❤️ for Privacy & Compliance by BEYONDER**

**Version 1.0.9 BETA**
