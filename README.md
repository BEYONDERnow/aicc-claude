# 🛡️ AI Compliance Checker - Chrome Browser Extension

Ein lokaler Compliance-Checker für KI-Plattformen, der Texteingaben in Echtzeit auf personenbezogene, sensible und firmenspezifische Daten prüft.

## ✨ Features

### Kernfunktionen
- ✅ **Lokale Echtzeit-Prüfung** beim Tippen und vor dem Senden
- ✅ **Erkennung sensibler Daten** (Regex-basiert)
  - Personenbezogene Daten (E-Mail, Telefon, Namen, Adressen)
  - Finanzdaten (IBAN, Kreditkarten)
  - Zugangsdaten (Passwörter, API-Keys)
  - Schweizer Sozialversicherungsnummern (AHV)
  - IP-Adressen und technische Daten
  - Vertrauliche Geschäftsinformationen

### Benutzerfreundlichkeit
- 🟢 **Status-Indikator** im Textfeld (Grün/Orange/Rot)
- ⚠️ **Tooltip-Warnungen** beim Hovern über erkannte Daten
- 🚫 **Modal-Dialog** vor dem Absenden mit detaillierter Übersicht
- 🌍 **Mehrsprachig** (DE/EN, erweiterbar auf FR/IT)

### Plattform-Unterstützung
- 💬 ChatGPT (OpenAI)
- 🤖 Claude (Anthropic)
- ✨ Gemini (Google)

### Datenschutz & Compliance
- 🔒 **100% lokal** - Keine Server-Kommunikation
- ✅ **DSGVO & DSG konform**
- 🔐 Alle Daten bleiben im Browser

## 📦 Installation

### Entwickler-Modus (Chrome)

1. **Repository klonen oder herunterladen**
   ```bash
   git clone <repository-url>
   cd aicc-claude
   ```

2. **Icons generieren** (optional, siehe [Icons](#icons))
   ```bash
   cd extension/icons
   # Nutzen Sie ImageMagick oder Online-Tools
   convert -background none icon.svg -resize 16x16 icon16.png
   convert -background none icon.svg -resize 48x48 icon48.png
   convert -background none icon.svg -resize 128x128 icon128.png
   ```

3. **Extension in Chrome laden**
   - Öffnen Sie Chrome und navigieren Sie zu `chrome://extensions/`
   - Aktivieren Sie den **Entwicklermodus** (Toggle oben rechts)
   - Klicken Sie auf **Entpackte Extension laden**
   - Wählen Sie den Ordner `extension/`

4. **Fertig!** 🎉
   - Die Extension ist nun aktiv
   - Besuchen Sie ChatGPT, Claude oder Gemini
   - Der Compliance Checker überwacht automatisch Ihre Eingaben

## 🎯 Verwendung

### 1. Echtzeit-Überwachung
Sobald Sie auf einer unterstützten KI-Plattform tippen, analysiert die Extension Ihre Eingabe automatisch:

- **Grüner Kreis** 🟢: Keine sensiblen Daten erkannt
- **Oranger Kreis** 🟠: Verdächtige/warnende Daten erkannt
- **Roter Kreis** 🔴: Kritische Daten erkannt

### 2. Tooltip-Information
Bewegen Sie die Maus über das Eingabefeld, um Details zu sehen:
- Welche Datentypen wurden erkannt
- Warum sie als sensibel eingestuft werden
- Kategorie (Personenbezogen, Finanzdaten, etc.)

### 3. Modal vor dem Absenden
Beim Versuch, eine Nachricht mit sensiblen Daten zu senden (Enter oder Submit-Button):

**Bei Warnungen (Orange):**
- Modal zeigt alle Erkennungen
- Option: Text bearbeiten
- Option: Trotzdem senden
- Option: Abbrechen

**Bei kritischen Daten (Rot):**
- Modal zeigt alle Erkennungen
- Option: Text bearbeiten
- Option: Abbrechen
- ⚠️ Kein "Trotzdem senden" bei kritischen Daten

## 🔍 Erkannte Datentypen

### Kritisch (Rot)
| Datentyp | Beispiel | Beschreibung |
|----------|----------|--------------|
| E-Mail | `max@example.com` | Personenbezogene Daten (DSGVO Art. 4) |
| IBAN | `CH93 0076 2011 6238 5295 7` | Bankverbindungen |
| Kreditkarte | `4532 1234 5678 9010` | Zahlungsmittel |
| AHV-Nummer | `756.1234.5678.90` | Schweizer Sozialversicherung |
| Passwort | `password: abc123` | Zugangsdaten |
| API-Key | `api_key: sk-...` | Geheime Tokens |
| Passnummer | `C12345678` | Ausweisdokumente |

### Warnung (Orange)
| Datentyp | Beispiel | Beschreibung |
|----------|----------|--------------|
| Telefon | `+41 79 123 45 67` | Kontaktdaten |
| IP-Adresse | `192.168.1.1` | Netzwerk-Identifikation |
| Name | `Herr Max Mustermann` | Vollständige Namen mit Anrede |
| Adresse | `Hauptstrasse 123` | Wohnanschrift |
| Geburtsdatum | `geboren 01.01.1990` | Persönliche Zeitangaben |
| Vertraulich | `VERTRAULICH` | Klassifizierte Dokumente |
| Gehalt | `Gehalt: CHF 80'000` | Sensible Geschäftsdaten |

## ⚙️ Konfiguration

### Anpassung der Regex-Pattern
Die Erkennungsmuster können in `extension/scripts/detector.js` angepasst werden:

```javascript
// Beispiel: Neues Pattern hinzufügen
{
  id: 'custom_pattern',
  pattern: /your-regex-here/g,
  severity: 'critical', // oder 'warning'
  category: 'custom',
  nameDE: 'Deutsche Bezeichnung',
  nameEN: 'English Name',
  descDE: 'Beschreibung auf Deutsch',
  descEN: 'Description in English'
}
```

### Sprache
Die Sprache wird automatisch aus dem Browser erkannt:
- Deutsch (de): Standard für de-DE, de-CH, de-AT
- Englisch (en): Standard für alle anderen Sprachen

## 🏗️ Architektur

```
extension/
├── manifest.json           # Extension-Konfiguration
├── popup.html             # Popup-UI beim Klick auf Icon
├── popup.js               # Popup-Logik
├── icons/                 # Extension-Icons
│   ├── icon.svg          # Quell-Icon (SVG)
│   ├── icon16.png        # 16x16 Icon
│   ├── icon48.png        # 48x48 Icon
│   └── icon128.png       # 128x128 Icon
├── scripts/
│   ├── detector.js       # Erkennungs-Engine (Regex-Pattern)
│   └── content.js        # Content Script (DOM-Monitoring)
└── styles/
    └── content.css       # Styling (Indikatoren, Tooltips, Modal)
```

### Komponenten

#### 1. `detector.js` - Erkennungs-Engine
- **ComplianceDetector-Klasse**
- Verwaltet alle Regex-Pattern für verschiedene Datentypen
- Analysiert Text und gibt Erkennungen zurück
- Mehrsprachige Übersetzungen
- Kategorisierung nach Severity (critical/warning)

#### 2. `content.js` - Content Script
- **ComplianceMonitor-Klasse**
- Findet und überwacht Eingabefelder auf KI-Plattformen
- Real-time Analyse bei Input-Events
- Erstellt und managed visuelle Indikatoren
- Zeigt Tooltips und Modal-Dialoge
- Plattform-spezifische Selektoren

#### 3. `content.css` - Styling
- Status-Indikator (Grün/Orange/Rot mit Pulse-Animation)
- Tooltip-Styling
- Modal-Dialog Design
- Dark-Mode Support
- Responsive Design

## 🔐 Datenschutz & Sicherheit

### Lokale Verarbeitung
- **Keine Netzwerk-Requests**: Alle Analysen erfolgen im Browser
- **Keine Speicherung**: Eingaben werden nicht gespeichert
- **Keine Telemetrie**: Keine Nutzungsdaten werden gesammelt

### DSGVO-Konformität
- Art. 25 DSGVO: Datenschutz durch Technikgestaltung
- Art. 32 DSGVO: Sicherheit der Verarbeitung
- Keine personenbezogenen Daten verlassen das Gerät

### Code-Audit
Der gesamte Code ist Open Source und kann auditiert werden:
- Transparente Regex-Pattern
- Keine Obfuscation
- Klare Dokumentation

## 🚀 Roadmap

### Version 1.0 (Aktuell)
- ✅ Basis-Erkennung (DE/EN)
- ✅ ChatGPT, Claude, Gemini Support
- ✅ Status-Indikator & Tooltips
- ✅ Modal-Warnung vor Absenden

### Version 1.1 (Geplant)
- [ ] Französisch & Italienisch Support
- [ ] Benutzerdefinierte Regex-Pattern über UI
- [ ] Whitelist für vertrauenswürdige Pattern
- [ ] Statistiken über erkannte Daten
- [ ] Export/Import von Konfigurationen

### Version 2.0 (Zukunft)
- [ ] KI-basierte Erkennung (lokal, mit TensorFlow.js)
- [ ] Kontext-basierte Analyse
- [ ] Anonymisierungs-Vorschläge
- [ ] Browser-übergreifender Support (Firefox, Edge)
- [ ] Enterprise-Features (zentrales Policy Management)

## 🛠️ Entwicklung

### Voraussetzungen
- Chrome Browser (Version 88+)
- Grundkenntnisse in JavaScript
- (Optional) ImageMagick für Icon-Generierung

### Lokale Entwicklung
1. Änderungen in den Dateien vornehmen
2. Extension in `chrome://extensions/` neu laden (Reload-Button)
3. Testen auf einer unterstützten Plattform

### Pattern testen
Öffnen Sie die Browser-Console (F12) um Debug-Logs zu sehen:
```javascript
// Im Content Script wird geloggt:
// - Welche Elemente überwacht werden
// - Welche Erkennungen gefunden wurden
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

## 📝 Lizenz

[Lizenz hier einfügen - z.B. MIT License]

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

## 📧 Support & Kontakt

Bei Fragen, Problemen oder Feedback:
- GitHub Issues: [Link zum Repository]
- E-Mail: [Kontakt-E-Mail]

## 🙏 Danksagungen

- Regex-Pattern basierend auf öffentlich verfügbaren Datenschutz-Standards
- Icons erstellt mit SVG
- Inspiriert von Datenschutz-Best-Practices der DSGVO/DSG

---

**Made with ❤️ for Privacy & Compliance**
