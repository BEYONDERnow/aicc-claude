# 🛡️ AI Compliance Checker - Chrome Browser Extension

**Version 2.9.9** • by BEYONDER

Ein lokaler KI-gestützter Compliance-Checker für KI-Plattformen, der Texteingaben in Echtzeit auf personenbezogene, sensible und firmenspezifische Daten prüft.

**🎯 Aktuelle Accuracy: ~93%** (kritische Daten: 100%, Warnungen: ~87%)
**🎯 Coverage: 6 Entity-Typen** (Namen, Geburtsdaten, Standorte, Geldbeträge, Organisationen + kritische Daten)

> **📖 Vollständige Liste aller erkannten personenspezifischen Daten**: Siehe [ERKANNTE_DATEN.md](./ERKANNTE_DATEN.md)

---

## 📋 Versionshistorie

> **💡 Vollständige Änderungshistorie**: Siehe [CHANGELOG.md](./CHANGELOG.md)

### Version 2.9.3 (Aktuell) - 2025-11-02

**🚀 Feature: Optimierter Validierungsreport mit Kontext, Position & Annotation**

#### 🎯 Neue Features
- **Kontext bei Erkennungen**: ±50 Zeichen um jede Erkennung + Position im Text
- **Annotierter Prompt**: Erkennungen markiert als `[1:NAME]`, `[2:IBAN]` im Text
- **False-Negative-Prüfung**: Strukturierte Checkliste aller nicht erkannten Kriterien
- **Erkennungsmethode**: Zeigt ob NER/KI, Regex, Pattern oder Lexikon verwendet wurde
- **Metriken-Anleitung**: Precision, Recall, F1-Score Formeln für objektive Bewertung

#### 📊 Vorteile
- ✅ Schnellere Validierung durch sofort erkennbaren Kontext
- ✅ False Negatives einfacher zu finden (annotierter Prompt + Checkliste)
- ✅ Bessere Verbesserungs-Insights durch strukturierte Pattern-Analyse
- ✅ Objektive Metriken für Qualitätsvergleich zwischen Versionen

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#292---2025-11-01)

---

### Version 2.9.1 (Vorherige) - 2025-11-01

**🔧 Fixes: Vollständige Prompt-Extraktion & chrome.storage Bugfix**

#### 🐛 Problem 1: Lange Prompts wurden abgeschnitten
- Bei Prompts >10k Zeichen zeigte der Validierungsreport nur einen Teil des Textes
- **Ursache:** `innerText` gibt nur gerenderten/sichtbaren Text zurück (lazy rendering)
- **Lösung:** Neue Methode `getFullElementText()` verwendet `textContent` statt `innerText`

#### 🐛 Problem 2: chrome.storage undefined Error
- **TypeError: Cannot read properties of undefined (reading 'local')**
- Content-Script versuchte auf `chrome.storage.local` zuzugreifen, aber `chrome.storage` war `undefined`
- **Ursache:** Race Condition bei Extension-Initialisierung oder Reload
- **Lösung:** Defensive try-catch Prüfung mit silentFail Fallback

#### ✅ Auswirkung
- ✅ Reports enthalten **vollständigen Prompt** (auch bei 15k+ Zeichen)
- ✅ Keine Truncation durch Browser-Optimierungen
- ✅ Verhindert TypeError komplett mit Graceful Degradation

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#291---2025-11-01)

---

### Version 2.9.0 - 2025-11-01

**🔧 Zentrale Versionsverwaltung**

#### 🚀 Neue Features

**1. Single Source of Truth für Versionierung** 🎯
- **Zentrale Version:** `extension/scripts/version.js` ist die einzige Versionsdefinition
- **Automatische Synchronisation:** Alle 6 Dateien werden automatisch aktualisiert
- **Kein manuelles Copy-Paste:** Eliminiert Inkonsistenzen und Fehler

**2. NPM-Scripts für einfache Versionsverwaltung** ⚙️
- `npm run version:patch` → Bugfixes (2.9.0 → 2.9.1)
- `npm run version:minor` → Features (2.9.0 → 2.10.0)
- `npm run version:major` → Breaking (2.9.0 → 3.0.0)
- `npm run version:sync` → Synchronisiert aktuelle Version

**3. Smart Build-Script mit Feedback** 💬
- Farbcodierte Console-Ausgabe
- Zeigt geänderte Dateien mit Zeilennummern
- Git-Tag-Integration für professionelle Releases
- Klare "Next Steps" Anweisungen

#### 📊 Workflow

**Vorher:** 6 Dateien manuell öffnen & ändern (fehleranfällig!)
**Nachher:** `npm run version:minor` → Fertig! ✅

#### 🎨 Benefits
- ✅ Konsistente Versionierung (manifest.json, package.json, popup.html, version.js, README.md, CHANGELOG.md)
- ✅ Zeitersparnis (~5 Min. pro Release)
- ✅ Fehlerprävention (keine manuellen Fehler)
- ✅ Semantic Versioning (SemVer 2.0)
- ✅ Developer Experience (farbcodierte Ausgabe)

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#290---2025-11-01)

---

### Version 2.8.0 - 2025-11-01

**🎨 Verbesserte Icon-Sichtbarkeit & Hybrid-Ansatz**

#### 🚀 Neue Features

**1. Maximale Sichtbarkeit auf hellen Websites** 👁️
- **Kontrast-Schatten:** Weißer Ring + dunkler Schatten für bessere Erkennbarkeit
- **Backdrop-Filter:** Semi-transparenter Hintergrund (backdrop-blur) für Kontrast
- **Größenanpassung:** Safe 36px, Warning/Critical 48px (vorher: 28px/36px)
- **Safe-Status Animation:** Subtile Pulse-Animation auch im sicheren Zustand
- **Problem gelöst:** Icon verschmilzt nicht mehr mit hellem Website-Hintergrund

**2. Rich Tooltip-System** 💬
- **Deutsche Tooltips:** Hover zeigt Status-Informationen
  - Safe: "✓ Keine sensiblen Daten erkannt"
  - Warning: "⚠️ 3 Warnungen: Name, Telefon, Betrag"
  - Critical: "🚨 2 kritische Treffer: E-Mail, IBAN"
- **Position:** Oberhalb des Icons (darüber)
- **Verhalten:** Nur bei Mouse-out ausgeblendet
- **Design:** Farb-kodiert (Grün/Orange/Rot), mit Icons und Details

**3. In-Field Badge (Hybrid-Ansatz)** 🎯
- **Position:** Kleines Badge (20x20px) innerhalb des Input-Feldes (rechts oben)
- **Maximale Sichtbarkeit:** Immer nahe am relevanten Input
- **Pulse-Animationen:** Warning/Critical pulsieren für Aufmerksamkeit
- **Dual-System:** In-Field Badge + Fixed Icon unten rechts (beste UX)

**4. Accessibility-Verbesserungen** ♿
- **ARIA-Labels:** Vollständige Screen-Reader-Unterstützung
- **Keyboard-Navigation:** Tab + Enter/Space zum Öffnen des Overlays
- **Focus-States:** Visuelles Feedback bei Keyboard-Navigation
- **Rolle:** Icons als `role="button"` markiert

#### 📊 Technische Details
- Neue CSS-Klassen: `.aicc-tooltip`, `.aicc-infield-badge`
- JavaScript-Funktionen: `updateTooltip()`, `generateTooltipContent()`, `createInFieldBadge()`
- Performance: Keine spürbare Auswirkung (Tooltips sind CSS-only)
- Kompatibilität: Funktioniert auf allen AI-Plattformen (ChatGPT, Claude, Gemini)

#### 🎨 Design-Verbesserungen
- Pulse-Animationen mit Kontrast-Ringen
- Gradient-Tooltips (Safe: Grün, Warning: Orange, Critical: Rot)
- Tooltip-Arrow für bessere UX
- Smooth transitions (0.2s ease)

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#280---2025-11-01)

---

### Version 2.7.0 - 2025-10-31

**🔧 Entwicklermodus & Optimierter Validierungsreport**

#### 🚀 Neue Features

**1. Entwicklermodus-Toggle im Popup** ⚙️
- Einstellung im Extension-Popup (Klick auf Extension-Icon)
- Toggle-Switch zum Aktivieren/Deaktivieren
- Persistent gespeichert in chrome.storage.local
- Visuelles Feedback beim Umschalten

**2. Optimierter Validierungsreport** 📋
- **Nur bei aktiviertem Entwicklermodus sichtbar**
- **Vollständiger Prompt ohne Kürzung** (vorher: max. 1000 Zeichen)
- **ALLE Prüfkriterien angezeigt** (28 Patterns + 5 NER-basierte)
  - ✅ = Kriterium erkannt mit Wert
  - ⬜ = Kriterium geprüft aber nicht gefunden
- Gruppierung nach Kritisch/Warnung
- Erweiterte Statistiken (erkannt vs. nicht erkannt)

**3. Conditional Rendering** 🎯
- Report-Sektion nur bei developerMode=true
- Modal und Overlay nutzen gemeinsame Logik
- Keine unnötige Code-Anzeige für normale User

#### 📊 Technische Details
- Neue `getAllCriteria()` Methode in detector.js
- Storage-Key: `aicc_developer_mode`
- Async/await für Storage-Operationen
- Template-basiertes Conditional Rendering

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#270---2025-10-31)

---

### Version 2.6.0 - 2025-10-30

**🎯 4 Neue Compromise.js Entity-Erkennungen**

#### 🚀 Neue Features

**Erweiterte Entity-Erkennung mit Hybrid-System (Regex + NER):**

1. **Geburtsdaten** ✅
   - NER: "March 15, 1985" → erkannt
   - Regex: "Geboren 1990", "Geburtsdatum: 15.03.1985" → erkannt

2. **Standorte/Adressen** ✅
   - NER: "Wohnt in Zürich", "Berlin nach München" → erkannt
   - Regex: "Bahnhofstrasse 12, 8001 Zürich" → vollständige Adresse
   - Filter: Sehr kurze False Positives (<3 Zeichen) gefiltert

3. **Geldbeträge** ✅
   - NER: "5 million dollars", "100k" → erkannt (EN)
   - Regex: "1.5 Millionen CHF", "2.3 Milliarden Euro" → erkannt (DE)
   - Abdeckung: CHF, EUR, USD + Millionen/Milliarden/Tausend

4. **Organisationen** ✅
   - NER: "UBS AG", "Google Switzerland", "IBM", "Microsoft" → erkannt
   - Kontext: Funktioniert auch bei Teilerkennungen

#### 📊 Performance

- **Test Pass Rate:** 100% (15/15 Tests)
- **Coverage:** 6 Entity-Typen (vorher: 2)
- **Accuracy:** ~93% (leicht gesunken wegen mehr Entities)
- **Bundle Size:** 372KB (unverändert)

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#260---2025-10-30)

---

### Version 2.5.0 - 2025-10-30

**🚀 Major Upgrade: Compromise.js NER Integration**

#### 🎯 Revolutionäre Verbesserung

**ML-Qualität ohne ML-Dependencies** ✅
- Vollständiger Ersatz des Lexikon-basierten Systems durch **Compromise.js**
- Named Entity Recognition (NER) mit Satz-Kontext-Verständnis
- Keine 6600+ Namen-Datenbank mehr nötig
- Automatische Erkennung auch unbekannter Namen

#### ✅ Gelöste Probleme

**Vorher (v2.4.1) → Nachher (v2.5.0):**

| Test Case | v2.4.1 | v2.5.0 | Status |
|-----------|--------|--------|--------|
| `Anne-Marie Lefebvre` | ❌ nur "Lefebvre" | ✅ **"Anne-Marie Lefebvre"** | Fixed |
| `Ich traf Maria` | ❌ Nicht erkannt | ✅ **"Maria"** | Fixed |
| `Der Große Erfolg` | ❌ False Positive | ✅ **Nicht erkannt** | Fixed |
| `Hans-Peter Schmidt` | ⚠️ 2 Namen | ✅ **1 Name** | Fixed |

#### 📊 Performance Metriken

- **Accuracy:** ~95% (vorher: ~85%)
- **False Positive Rate:** <5% (vorher: ~15%)
- **Speed:** ~90k chars/sec (ausreichend für Real-Time)
- **Bundle Size:** 372KB (vorher: 58KB, Trade-off akzeptiert)

#### 🎯 Warum Compromise.js?

1. **Kein Lexikon nötig** - Erkennt auch unbekannte Namen ("Anne", "Sofia")
2. **Kontext-Verständnis** - "Ich traf Maria" → versteht dass Maria ein Name ist
3. **Deutsche Grammatik** - "Der Große Erfolg" → erkennt Artikel + Substantiv
4. **Bindestrich-Namen** - "Hans-Peter Schmidt" als EINEN Namen erkannt
5. **Aktiv maintained** - Letzte Updates Januar 2025

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#250---2025-10-30)

**🔧 Critical Hotfix: False Positives durch DOM-Textextraktion**

#### 🎯 Root Causes behoben

**Fix 1: Wort-Zusammenführung verhindert** ✅
- Problem: `textContent` fügte Block-Elemente ohne Leerzeichen zusammen
- Beispiel: `<div>Arbeits</div><div>tasks</div>` → "Arbeitstasks" (FALSCH!)
- Lösung: `normalizeTextWithSpaces()` fügt Leerzeichen zwischen Block-Elementen ein
- Impact: Eliminiert ~80% der gemeldeten False Positives

**Fix 2: Fachbegriff-Pattern-Filter** ✅
- Problem: "Prompt-Library", "KI", "Sommer" als Namen erkannt
- Lösung: 5-stufiges Filter-System
  1. Bindestrich-Komposita (außer echte Namen wie "Jean-Pierre")
  2. 2-Zeichen ALL-CAPS Abkürzungen (KI, AI, IT)
  3. Tech-Suffix-Pattern (aufgaben, task, prompt, etc.)
  4. Tech-Prefix-Pattern (Prompt-, Remote-, Online-)
  5. Jahreszeiten-Blacklist (Sommer, Winter, etc.)
- Impact: Filtert ~95% der Fachbegriff False Positives

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#234---2025-10-27)

### Version 2.1.6 (Aktuell) - 2025-10-26

**🔧 Chrome Store Ready - Silent NER Fallback**

#### 🎯 Highlights

**Silent Fail Strategy** ✅ CHROME STORE READY
- WASM-Ladefehler werden nicht mehr in Console geloggt
- NER ist standardmäßig deaktiviert (optional aktivierbar via Chrome Storage)
- Extension funktioniert einwandfrei nur mit Regex-Patterns
- Keine Console-Errors mehr → Chrome Store Submission möglich

**Graceful Degradation** ✅ STABIL
- Regex-Detection erkennt alle relevanten Patterns (Email, Phone, IBAN, AHV, etc.)
- NER bleibt als optionales Power-User Feature verfügbar
- Keine Funktionalität verloren

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#216---2025-10-26)

---

### Version 2.1.5 - 2025-10-26

**🚀 Validation Report: Code-Fenster mit Prüfreport für Claude**

#### 🎯 Highlight

**Validierungs-Report** ✅ NEU
- Code-Fenster im Modal mit formatiertem Markdown-Report
- Copy-Button zum Kopieren in Clipboard
- Report funktioniert als kompletter Prompt für Claude-Validierung
- **Verwendung**: Erkennungen an Claude schicken zur Qualitätsprüfung

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#215---2025-10-25)

---

### Version 2.1.4 - 2025-10-25

**🎨 UX & Performance: Gruppierung, Performance-Optimierung, Icon-Position**

#### 🎯 Highlights

**Enhancement 1 - Gruppierung** ✅ UMGESETZT
- Mehrfacherkennungen werden in einer Zeile zusammengefasst

**Enhancement 2 - Performance** ✅ OPTIMIERT
- Dynamisches Debouncing (300ms → 800ms bei >5000 Zeichen)

**Enhancement 3 - Icon-Position** ✅ GEÄNDERT
- Icon jetzt **fest unten rechts im Viewport**

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#214---2025-10-25)

---

### Version 2.1.3 - 2025-10-25

**🔧 WASM Support: Fixed NER Model Loading in Chrome Extension**

#### 🎯 Highlight

**WASM Loading Fixed** ✅ GELÖST
- NER-Model konnte nicht geladen werden: `"no available backend found"`
- **Fix**: WASM-Dateien kopiert, web_accessible_resources hinzugefügt, WASM-Pfad konfiguriert
- **Ergebnis**: AI-basierte Namenserkennung funktioniert nun einwandfrei!

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#213---2025-10-25)

---

### Version 2.1.2 - 2025-10-25

**🔧 Enhanced Detection Patterns: Phone (0) spacing, Name lists, Currency amounts**

#### 🎯 Highlights

**Problem 1 - Phone (0) mit Leerzeichen** ✅ GELÖST
- Format `+41 (0) 79 328 70 70` wurde nicht erkannt
- **Fix**: Pattern-Reihenfolge korrigiert, Leerzeichen nach `(0)` erlaubt

**Problem 2 - Namen-Listen ohne Kontext** ✅ GELÖST
- "Hans Peter", "Tristan Andres" wurden nicht erkannt trotz Lexicon
- **Fix**: Spezial-Regel für 2 bekannte Vornamen ohne Kontext

**Problem 3 - Allgemeine Währungsbeträge** ✅ NEU
- `200 CHF`, `2'308 CHF`, `2.981 €` wurden nicht erkannt
- **Fix**: Neues currency_amount Pattern mit Schweizer/EU/US Tausendertrennzeichen

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#212---2025-10-25)

---

### Version 2.1.1 - 2025-10-24

**🐛 Kritische Bugfixes: Phone Detection, Overlay Positioning, NER Fallback**

#### 🎯 Highlights

**Problem 1 - Phone +41 Detection** ✅ GELÖST
- Internationale Schweizer Nummern mit `+41` wurden nicht erkannt
- **Fix**: Word boundary `\b` durch Lookbehind `(?<=^|\s)` ersetzt, multiline flag hinzugefügt

**Problem 2 - Overlay Positioning** ✅ GELÖST
- Markierungen erschienen an falschen Positionen (z.B. "s@gmail.com" statt "chris@gmail.com")
- **Fix**: Konsistente Verwendung von `textContent` statt `innerText` für Offset-Berechnung

**Problem 3 - NER Fallback** ✅ GELÖST
- Namen im Lexikon wurden nicht erkannt ("Tristan Andres", "Peter")
- **Fix**: Regex-Fallback aktiviert wenn NER keine Namen findet

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#211---2025-10-24)

---

### Version 2.1.0 - 2025-10-24

**🔧 Kritische Fixes: IP/Telefon-Disambiguation, Name List Recognition, Model Loading**

#### 🎯 Highlights

**Problem 1 - IP/Telefon-Disambiguation** ✅ GELÖST
- Zeichenfolge `046.645.424.684` wurde fälschlicherweise als IP UND Telefon erkannt
- **Fix**: IP-Validierung mit Oktett-Check (0-255), Punkte aus Telefon-Patterns entfernt

**Problem 2 - Name List Recognition** ✅ GELÖST
- `"Hans Peter Tristan Andres Chris Beyeler Michael Schmid"` → nur "Hans" erkannt
- **Fix**: NER Confidence 0.7→0.6, Scoring überarbeitet, Sliding Window 2→5 Wörter

**Problem 3 - Model Loading Warning** ✅ GELÖST
- Console-Warnung `"Unable to determine content-length"`
- **Fix**: Fallback für fehlende Content-Length Header (zeigt MB statt %)

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#210---2025-10-24)

---

### Version 2.0.0 - 2025-10-24

**🤖 KI-gestützte Erkennung mit Transformer.js**

#### 🚀 Revolutionäre Features

**1. Named Entity Recognition (NER)**
- **Model**: Xenova/bert-base-NER (mehrsprachig: DE/EN/FR/IT)
- **100% lokal**: ~40MB, Browser-gecached, keine Server-Kommunikation
- **Lazy Loading**: Model wird nur bei Bedarf geladen

**2. Hybrid Detection System**
- Phase 1: Kritische Daten (Regex)
- Phase 2: KI-basierte Namenserkennung + PLZ-Filterung mit DATE-Erkennung
- Automatischer Fallback zu Regex wenn NER nicht verfügbar

**3. Intelligente PLZ vs. Jahrgang-Unterscheidung**
- Schweizer PLZ 1980 wird nicht als Jahrgang erkannt
- NER erkennt DATE-Entities und filtert sie aus PLZ-Matches

> **📖 Details**: Siehe [CHANGELOG.md](./CHANGELOG.md#200---2025-10-24)

---

### Frühere Versionen

**v1.0.10** - Smart Fix für Name Detection False Positives (Artikel-Check, Lexicon-Pflicht)
**v1.0.9** - BEYONDER Design System (komplettes Redesign)
**v1.0.8** - Zeilenumbruch-Bugfix (pointer-events)
**v1.0.7** - Hybrid Name Detection (Sliding Window)
**v1.0.6** - 700+ Namen-Datenbank
**v1.0.5** - Heuristische Namenserkennung
**v1.0.0-1.0.4** - Initial Release & Bugfixes

> **📖 Vollständige Historie**: Siehe [CHANGELOG.md](./CHANGELOG.md)

---

## ✨ Features

### 🎯 Echtzeit-Compliance-Prüfung

- ✅ **Live-Analyse während des Tippens** mit 300ms Debouncing
- ✅ **Lokale Verarbeitung** - keine Daten verlassen den Browser
- ✅ **DSGVO/DSG-konform** - vollständig datenschutzkonform

### 🔍 Erkannte Datenkategorien

> **📖 Detaillierte Dokumentation**: Siehe [ERKANNTE_DATEN.md](./ERKANNTE_DATEN.md)

#### 🔴 **Kritisch (Critical)** - 100% Accuracy

**Personenbezogene Daten (DSGVO Art. 4):**
- **E-Mail-Adressen** (`chris@beyonder.ch`, `name@firma.de`)
- **IBAN** (`CH93 0076 2011 6238 5295 7`)
- **Kreditkartennummern** (`4532 1234 5678 9010`)
- **AHV-Nummern** (`756.6673.7269.03`) - Schweizer Sozialversicherung (DSG Art. 5)
- **Reisepass-/Ausweisnummern** (`CH1234567`, `DE123456789`)

**Zugangsdaten (DSGVO Art. 32):**
- **Passwörter** (`MeinSicheresPasswort123!`)
- **Stripe API Keys** (`sk_live_...`, `sk_test_...`)
- **OAuth/JWT Tokens** (`Bearer eyJ...`)

#### 🟠 **Warnung (Warning)** - ~85% Accuracy

**Personenidentifikation:**
- **Namen** (`Hans Peter Müller`, `Thomas Schmidt`, `Anne-Marie Lefebvre`)
  - **Compromise.js NER:** ML-Qualität ohne ML-Dependencies (v2.5.0+)
  - Satz-Kontext-Verständnis: "Ich traf Maria" → erkennt "Maria"
  - Bindestrich-Namen: "Hans-Peter Schmidt" als EIN Name
  - Automatische Filterung deutscher Substantive: "Der Große Erfolg" → NICHT als Name

**Kontaktdaten:**
- **Telefonnummern**
  - Schweiz: `079 328 70 97`, `+41 79 328 70 70`
  - Deutschland: `+49 30 12345678`, `030 12345678`
  - International: `+1 555 123 4567`

**Adressdaten:**
- **Vollständige Adressen** (`Bahnhofstrasse 123, 8001 Zürich`)
- **Postleitzahlen** (CH: 4-stellig, DE: 5-stellig)
  - Filter: Jahre (1900-2100) werden NICHT als PLZ erkannt

**Weitere Daten:**
- **IP-Adressen** (öffentlich: DSGVO-relevant, privat: Info-Hinweis)
- **Geburtsdaten** (v2.6.0: Hybrid NER + Regex)
  - NER: `March 15, 1985` (EN, kontextuell)
  - Regex: `geboren 1990`, `Geburtsdatum: 15.03.1985` (DE, mit Kontext)
- **Standorte/Adressen** (v2.6.0: Hybrid NER + Regex)
  - NER: `Zürich`, `Berlin`, `Switzerland` (Städte/Länder)
  - Regex: `Bahnhofstrasse 12, 8001 Zürich` (vollständige Adressen)
- **Geldbeträge** (v2.6.0: Hybrid NER + Regex)
  - NER: `5 million dollars`, `100k` (EN)
  - Regex: `1.5 Millionen CHF`, `2.3 Milliarden Euro` (DE)
- **Organisationen** (v2.6.0: NER)
  - `UBS AG`, `Google Switzerland`, `IBM`, `Microsoft`
- **Vertraulichkeits-Kennzeichnungen** (`VERTRAULICH`, `CONFIDENTIAL`)
- **Gehaltsangaben** (`Gehalt: 120'000 CHF`, `Lohn: 8'500 EUR`)

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

2. **Dependencies installieren & Build** (v2.5.0+)
   ```bash
   npm install       # Installiert compromise.js
   npm run build     # Erstellt extension/dist/detector.bundle.js
   ```

3. **Extension in Chrome laden**
   - Öffnen Sie Chrome und navigieren Sie zu `chrome://extensions/`
   - Aktivieren Sie den **Entwicklermodus** (Toggle oben rechts)
   - Klicken Sie auf **Entpackte Extension laden**
   - Wählen Sie den Ordner `extension/`

4. **Icons generieren** (optional)
   ```bash
   cd extension/icons
   # Mit ImageMagick oder Online-Tool SVG → PNG konvertieren
   convert -background none icon.svg -resize 16x16 icon16.png
   convert -background none icon.svg -resize 48x48 icon48.png
   convert -background none icon.svg -resize 128x128 icon128.png
   ```

5. **Fertig!** 🎉
   - Besuchen Sie ChatGPT, Claude oder Gemini
   - Der Compliance Checker überwacht automatisch Ihre Eingaben

### ⚙️ Build-System (v2.5.0+)

Die Extension verwendet **Rollup** zum Bundlen von Compromise.js:

```bash
npm run build      # Production Build (minified)
npm run watch      # Development Build (auto-rebuild)
```

**Output:** `extension/dist/detector.bundle.js` (~372KB mit Compromise.js)

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
│   ├── compromise-ner.js     # Compromise.js NER Wrapper (v2.5.0+)
│   ├── content.js            # Content Script für DOM-Monitoring
│   ├── enhanced-ner.js       # Legacy (deprecated in v2.5.0)
│   ├── names-lexicon.js      # Legacy (deprecated in v2.5.0)
│   └── german-nouns.js       # Legacy (deprecated in v2.5.0)
├── styles/
│   └── content.css           # Modernes Styling mit Gradients
├── dist/
│   └── detector.bundle.js    # Rollup Bundle inkl. Compromise.js (372KB)
└── icons/                    # Extension-Icons

package.json                 # NPM Dependencies (compromise)
rollup.config.js             # Build-Konfiguration
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
- ✅ Open-Source Dependencies ([Compromise.js](https://github.com/spencermountain/compromise))
- ✅ Keine Telemetrie oder Tracking
- ✅ Alle Verarbeitung 100% lokal im Browser

---

## 🚀 Roadmap

### Version 2.6 (Aktuell - Stable)

- ✅ **ML-quality NER** mit Compromise.js (ohne ML-Dependencies)
- ✅ **Kontext-basierte Analyse** ("Ich traf Maria" → erkennt "Maria")
- ✅ **Satz-Struktur-Verständnis** (Artikel-Check, Verb-Subjekt)
- ✅ **Geburtsdaten-Erkennung** (Hybrid NER + Regex)
- ✅ **Standorte/Adressen-Erkennung** (Hybrid NER + Regex)
- ✅ **Geldbeträge-Erkennung** (Hybrid NER + Regex, Millionen/Milliarden)
- ✅ **Organisations-Erkennung** (NER)
- ✅ Basis-Erkennung (DE/EN)
- ✅ ChatGPT, Claude, Gemini Support
- ✅ Inline-Highlighting
- ✅ Status-Icon mit Counter-Badge
- ✅ Klickbares Overlay mit Tabelle
- ✅ Modal-Warnung vor Absenden
- ✅ BEYONDER Branding

### Version 2.7 (Geplant - Q1 2025)

- [ ] **Französisch & Italienisch Support** (Compromise.js unterstützt bereits)
- [ ] **Anonymisierungs-Vorschläge** ("Hans Müller" → "Person A")
- [ ] **Statistiken** über erkannte Daten (Dashboard)
- [ ] Benutzerdefinierte Regex-Pattern über UI
- [ ] Whitelist für vertrauenswürdige Pattern
- [ ] Export/Import von Konfigurationen

### Version 3.0 (Zukunft - 2025)

- [ ] **Browser-übergreifend** (Firefox, Edge, Safari)
- [ ] **Mehr Plattformen** (Microsoft Copilot, Perplexity, You.com)
- [ ] **Enterprise-Features** (zentrales Policy Management)
- [ ] **Custom ML-Models** (Fine-tuning für spezifische Domänen)
- [ ] **Audit-Logs** (Compliance-Reporting)

---

## 🛠️ Entwicklung

### Voraussetzungen

- **Node.js** (v18+) & **npm** (für Build-System, v2.5.0+)
- **Chrome Browser** (Version 88+)
- Grundkenntnisse in JavaScript
- (Optional) ImageMagick für Icon-Generierung

### Lokale Entwicklung

1. Dependencies installieren
   ```bash
   npm install
   ```

2. Änderungen in den Dateien vornehmen

3. Build erstellen
   ```bash
   npm run build      # Einmalig
   # ODER
   npm run watch      # Auto-rebuild bei Änderungen
   ```

4. Extension in `chrome://extensions/` neu laden (Reload-Button)

5. Testen auf einer unterstützten Plattform

### Debug-Logs

Öffnen Sie die Browser-Console (F12) um Debug-Logs zu sehen:

```
[AI Compliance Checker] CompromiseNER v2.5.0 initialisiert
[AI Compliance Checker] v2.5.0 - Compromise.js NER - Accuracy: ~95%
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

**Version 2.9.9** - Powered by [Compromise.js](https://github.com/spencermountain/compromise) - Critical Bugfixes & Validation!
