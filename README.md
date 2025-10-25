# 🛡️ AI Compliance Checker - Chrome Browser Extension

**Version 2.1.3** • by BEYONDER

Ein lokaler KI-gestützter Compliance-Checker für KI-Plattformen, der Texteingaben in Echtzeit auf personenbezogene, sensible und firmenspezifische Daten prüft.

**NEU in v2.x**: 🤖 **Transformer.js Integration** mit Named Entity Recognition (NER) für intelligente Namenserkennung!

---

## 📋 Versionshistorie

> **💡 Vollständige Änderungshistorie**: Siehe [CHANGELOG.md](./CHANGELOG.md)

### Version 2.1.3 (Aktuell) - 2025-10-25

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

**Version 2.1.3**
