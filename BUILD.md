# 🏗️ Build Instructions

## Version 2.0.0 - KI-gestützte Erkennung

Ab Version 2.0.0 nutzt die Extension **Transformer.js** für lokale Named Entity Recognition (NER). Dies erfordert einen Build-Schritt.

---

## Voraussetzungen

- **Node.js** ≥ 16.x (empfohlen: 18.x oder 20.x)
- **npm** ≥ 8.x

**Installation prüfen:**
```bash
node --version
npm --version
```

---

## 🚀 Quick Start

### 1. Dependencies installieren

```bash
npm install
```

Dies installiert:
- `@xenova/transformers` (~500 KB) - Transformer.js für NER
- Rollup + Plugins - Build-System

**Größe:** ~15 MB node_modules (nur für Development)

---

### 2. Build ausführen

```bash
npm run build
```

Dies erstellt:
- `extension/dist/detector.bundle.js` - Gebündelter Code mit Transformer.js
- **Größe:** ~600 KB (minifiziert)

**Output:**
```
extension/dist/detector.bundle.js
```

---

### 3. Extension in Chrome laden

1. Öffne `chrome://extensions/`
2. Aktiviere **Entwicklermodus** (Toggle oben rechts)
3. Klicke **Entpackte Extension laden**
4. Wähle den Ordner `extension/`

✅ Fertig!

---

## 📝 Development Workflow

### Watch Mode (automatischer Re-Build)

Während der Entwicklung:

```bash
npm run watch
```

Dies überwacht Änderungen an:
- `extension/scripts/detector.js`
- `extension/scripts/ner-detector.js`

Und rebuildet automatisch bei Änderungen.

**Workflow:**
1. Terminal 1: `npm run watch`
2. Code ändern in `extension/scripts/`
3. Browser: Extension neu laden (Reload-Button bei `chrome://extensions`)

---

## 🔍 Was passiert beim Build?

**Rollup bundelt:**
1. `extension/scripts/detector.js` (Hauptlogik)
2. `extension/scripts/ner-detector.js` (NER-Integration)
3. `@xenova/transformers` (Transformer.js Library)

**Output:**
- `extension/dist/detector.bundle.js` - Ein einzelnes Bundle
- **Format:** IIFE (Immediately Invoked Function Expression)
- **Minifiziert:** Ja (mit Terser)
- **Source Maps:** Nein (für Production)

---

## 📦 Struktur nach Build

```
extension/
├── dist/
│   └── detector.bundle.js       ← Gebündelter Code (wird geladen)
├── scripts/
│   ├── detector.js              ← Source Code (nicht geladen)
│   ├── ner-detector.js          ← Source Code (nicht geladen)
│   └── content.js               ← Wird separat geladen
├── styles/
├── fonts/
├── icons/
├── popup.html
└── manifest.json
```

**Wichtig:** `manifest.json` lädt `dist/detector.bundle.js`, nicht `scripts/detector.js`!

---

## 🧹 Cleanup

### Build-Artefakte löschen

```bash
rm -rf extension/dist/
```

### node_modules löschen

```bash
rm -rf node_modules/
```

### Alles neu aufsetzen

```bash
rm -rf node_modules/ extension/dist/
npm install
npm run build
```

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"

**Lösung:** Node.js installieren
```bash
# macOS (Homebrew)
brew install node

# Ubuntu/Debian
sudo apt install nodejs npm

# Windows
# Download von https://nodejs.org
```

---

### Problem: "Cannot find module '@xenova/transformers'"

**Lösung:** Dependencies neu installieren
```bash
rm -rf node_modules/
npm install
```

---

### Problem: "Extension lädt nicht"

**Checkliste:**
1. ✅ `npm run build` erfolgreich ausgeführt?
2. ✅ `extension/dist/detector.bundle.js` existiert?
3. ✅ Chrome Extension neu geladen (Reload-Button)?
4. ✅ Console-Errors prüfen (F12 → Console)

**Debug:**
```bash
# Build-Output prüfen
ls -lh extension/dist/

# Sollte zeigen:
# detector.bundle.js (~600 KB)
```

---

### Problem: "NER funktioniert nicht"

**Symptome:**
- Console zeigt: `[AI Compliance NER] Lade Model...`
- Aber keine Namen werden erkannt

**Lösung 1:** Warten (erstes Laden dauert 5-10 Sekunden)
- Das Model wird beim ersten Mal heruntergeladen (~40 MB)
- Danach wird es gecached

**Lösung 2:** Browser-Cache prüfen
```
F12 → Application → Cache Storage
→ Sollte "transformers-cache" zeigen
```

**Lösung 3:** Fallback prüfen
- Console sollte zeigen: `[AI Compliance] Fallback: Nutze Regex-basierte Namenserkennung`
- Extension funktioniert auch OHNE NER (mit reduzierter Genauigkeit)

---

## 🔧 Scripts Übersicht

| Script | Beschreibung |
|--------|-------------|
| `npm run build` | Einmaliger Build |
| `npm run watch` | Watch Mode (auto-rebuild) |
| `npm run dev` | Alias für `watch` |

---

## 📊 Bundle-Analyse

### Größen

| Datei | Größe | Zweck |
|-------|-------|-------|
| `detector.bundle.js` | ~600 KB | Gebündelter Code (minifiziert) |
| NER Model (lazy loaded) | ~40 MB | Wird beim ersten Mal geladen, dann gecached |

**Total Impact:** ~40.6 MB (nur beim ersten Laden)

### Performance

- **Initiales Laden:** ~5-10 Sekunden (Model Download)
- **Folgende Ladevorgänge:** ~instant (Browser-Cache)
- **Runtime:** ~50-200ms pro Analyse

---

## 🚀 Production Build

Für Production-Releases:

1. **Build ausführen:**
   ```bash
   npm run build
   ```

2. **Extension-Ordner zippen:**
   ```bash
   cd extension
   zip -r ../ai-compliance-checker-v2.0.0.zip . -x "*.git*" -x "*node_modules*" -x "*.DS_Store"
   ```

3. **Upload zum Chrome Web Store:**
   - Login: [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload: `ai-compliance-checker-v2.0.0.zip`

---

## 🆘 Support

Bei Problemen:
1. Check Console-Logs (F12)
2. Prüfe Build-Output
3. Siehe Troubleshooting oben
4. GitHub Issues: [Repository Issues]

---

**Version:** 2.0.0
**Build System:** Rollup
**Letzte Aktualisierung:** 2025-10-24
