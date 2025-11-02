# 📋 Versionierungssystem - Richtlinien für Claude Code

> **🎯 PFLICHT:** Diese Richtlinien sind bei **JEDEM Commit** zu befolgen.

---

## 🔑 Grundprinzipien

### Single Source of Truth
- **`extension/scripts/version.js`** ist die **einzige** Versionsdefinition
- Alle anderen Dateien werden **automatisch** synchronisiert
- **NIEMALS** manuell Versionsnummern in andere Dateien schreiben

### Automatische Versionierung
- **Jeder Commit** = **neue Version**
- Standardmäßig: **Patch-Erhöhung** (2.9.3 → 2.9.4)
- Bei größeren Features: **Minor-Erhöhung** (2.9.3 → 2.10.0)
- Bei Breaking Changes: **Major-Erhöhung** (2.9.3 → 3.0.0)

---

## ⚙️ Workflow: Schritt für Schritt

### 1. Vor dem Commit

**Automatisch durch Pre-Commit Hook:**
```bash
# Der Hook führt automatisch aus:
npm run version:patch
npm run build
```

**Du musst nichts manuell tun!** Der Git Hook übernimmt:
- ✅ Version erhöhen (patch)
- ✅ Alle Dateien synchronisieren
- ✅ Bundle neu bauen
- ✅ Geänderte Dateien zum Commit hinzufügen

### 2. Commit Message Format

```bash
git commit -m "<type>: <description> (v<new-version>)"
```

**Types:**
- `fix:` - Bugfixes (Patch)
- `feat:` - Neue Features (Minor)
- `refactor:` - Code-Umstrukturierung (Patch)
- `docs:` - Dokumentation (Patch)
- `style:` - Styling/Formatierung (Patch)
- `perf:` - Performance-Verbesserung (Patch)
- `test:` - Tests (Patch)
- `chore:` - Wartung/Build (Patch)
- `BREAKING:` - Breaking Changes (Major)

**Beispiele:**
```bash
git commit -m "fix: TypeError bei chrome.storage Zugriff (v2.9.4)"
git commit -m "feat: Neue Versionierungssystem (v2.10.0)"
git commit -m "BREAKING: API-Änderung für detector.js (v3.0.0)"
```

### 3. Push

```bash
git push -u origin <branch-name>
```

---

## 📂 Synchronisierte Dateien

Der `update-version.js` Script synchronisiert **automatisch** diese Dateien:

| Datei | Pattern | Beispiel |
|-------|---------|----------|
| `extension/manifest.json` | `"version": "X.X.X"` | `"version": "2.9.4"` |
| `package.json` | `"version": "X.X.X"` | `"version": "2.9.4"` |
| `extension/scripts/version.js` | `export const VERSION = 'X.X.X'` | `export const VERSION = '2.9.4'` |
| `extension/popup.html` | `Version X.X.X BETA` | `Version 2.9.4 BETA` |
| `README.md` | `**Version X.X.X**` (mehrfach) | `**Version 2.9.4**` |
| `extension/scripts/content.js` | `Validierungsreport vX.X.X` | `Validierungsreport v2.9.4` |
| `CHANGELOG.md` | Neuer Eintrag | `## [2.9.4] - 2025-11-02` |

---

## 🚫 Verboten: Versionsnummern in Code-Headern

**Alte Praxis (VERBOTEN):**
```javascript
/**
 * AI Compliance Checker - Detector
 * Version 2.9.3 - Accuracy: ~97%  ← NICHT MEHR!
 */
```

**Neue Praxis (KORREKT):**
```javascript
/**
 * AI Compliance Checker - Detector
 * Accuracy: ~97% (kritische Daten: 100%, Warnungen: ~96%)
 */

import { VERSION } from './version.js';  // ← Single Source of Truth
```

**Wenn Version im Code benötigt wird:**
```javascript
import { VERSION, VERSION_FULL } from './version.js';
console.log(`AI Compliance Checker ${VERSION_FULL}`);
```

---

## 🛠️ Manuelle Versionierung (falls nötig)

### Standard (automatisch durch Hook):
```bash
npm run version:patch   # 2.9.3 → 2.9.4
```

### Größere Features (manuell vor Commit):
```bash
npm run version:minor   # 2.9.3 → 2.10.0
git add -A
git commit -m "feat: Neue Feature X (v2.10.0)"
git push -u origin <branch>
```

### Breaking Changes (manuell vor Commit):
```bash
npm run version:major   # 2.9.3 → 3.0.0
git add -A
git commit -m "BREAKING: API-Änderung (v3.0.0)"
git push -u origin <branch>
```

### Nur synchronisieren (ohne Erhöhung):
```bash
npm run version:sync
```

---

## 🔍 Checkliste vor jedem Commit

- [ ] Änderungen funktional getestet?
- [ ] Build läuft ohne Fehler? (`npm run build`)
- [ ] **Versionierung erfolgt automatisch durch Pre-Commit Hook**
- [ ] Commit Message folgt Format: `<type>: <description> (v<version>)`
- [ ] Keine manuellen Versionsnummern in Code-Dateien

---

## 🐛 Troubleshooting

### Problem: "Version wurde nicht erhöht"
**Lösung:**
```bash
npm run version:patch
npm run build
git add -A
```

### Problem: "Inkonsistente Versionen"
**Lösung:**
```bash
npm run version:sync  # Synchronisiert auf version.js
```

### Problem: "Pre-Commit Hook funktioniert nicht"
**Lösung:**
```bash
chmod +x .git/hooks/pre-commit
```

### Problem: "Build schlägt fehl"
**Lösung:**
```bash
npm install
npm run build
```

---

## 📊 Semantic Versioning (SemVer)

Format: **MAJOR.MINOR.PATCH**

### MAJOR (X.0.0)
- Breaking Changes
- API-Änderungen (nicht rückwärtskompatibel)
- Grundlegende Architekturänderungen
- **Beispiel:** `2.9.3 → 3.0.0`

### MINOR (0.X.0)
- Neue Features
- Erweiterte Funktionalität
- Rückwärtskompatibel
- **Beispiel:** `2.9.3 → 2.10.0`

### PATCH (0.0.X)
- Bugfixes
- Performance-Verbesserungen
- Refactorings
- Dokumentation
- **Beispiel:** `2.9.3 → 2.9.4` ← **Standard**

---

## 🎯 Für Claude Code Agent

### Bei jedem Task mit Code-Änderungen:

1. **Vor dem Commit:** Pre-Commit Hook läuft automatisch
2. **Commit Message:** Erstelle aussagekräftige Message mit Type + Version
3. **Push:** Mit `-u origin <branch-name>`

### Beispiel-Workflow:

```bash
# Änderungen gemacht...
git add -A

# Commit (Hook erhöht Version automatisch)
git commit -m "fix: Chrome storage race condition (v2.9.4)"

# Push
git push -u origin claude/feature-branch-xyz
```

### Ausnahmen:

- **Nur Dokumentation** (README, CHANGELOG): Auch Patch erhöhen
- **Nur Kommentare/Whitespace**: Auch Patch erhöhen (Konsistenz!)
- **Git Hooks/Scripts**: Patch erhöhen

**Merke:** Bei JEDEM Commit wird die Version erhöht!

---

## 📈 Best Practices

### ✅ DO

- Vertraue dem automatischen System
- Nutze Pre-Commit Hook
- Importiere `VERSION` aus `version.js` wenn benötigt
- Folge SemVer Konventionen
- Schreibe aussagekräftige Commit Messages

### ❌ DON'T

- Versionsnummern manuell in Dateien schreiben
- Versionsnummern in Code-Header-Kommentaren
- Commits ohne Versionierung
- Commits ohne Build
- Force-Push ohne Absprache

---

## 🔗 Ressourcen

- **Update-Script:** `scripts/update-version.js`
- **Version Source:** `extension/scripts/version.js`
- **Pre-Commit Hook:** `.git/hooks/pre-commit`
- **Changelog:** `CHANGELOG.md`
- **Semantic Versioning:** https://semver.org/

---

**Made with ❤️ for consistent versioning by BEYONDER**
