# 📋 Versionierungssystem - Richtlinien für Claude Code

> **🎯 PFLICHT:** Diese Richtlinien sind bei **JEDEM Commit** zu befolgen.

---

## ⚠️ KRITISCHE REGEL: NIE --no-verify VERWENDEN!

**🚨 NIEMALS `--no-verify` beim Committen verwenden! 🚨**

```bash
# ❌ FALSCH - Hook wird umgangen, Version wird NICHT erhöht!
git commit -m "fix: Bug XYZ (v2.9.8)" --no-verify

# ✅ RICHTIG - Hook läuft automatisch, Version wird erhöht
git commit -m "fix: Bug XYZ"
```

### Warum ist --no-verify problematisch?

**Problem:** Version-Inkonsistenz zwischen Code und Commit-Message

**Beispiel aus der Praxis (v2.9.5-2.9.8 Incident):**
```bash
# Commits mit --no-verify gemacht:
git commit -m "feat: UX improvements (v2.9.6)" --no-verify
git commit -m "fix: Icon bug (v2.9.7)" --no-verify
git commit -m "fix: Syntax error (v2.9.8)" --no-verify

# Resultat:
# - Commit Messages: v2.9.6, v2.9.7, v2.9.8
# - Tatsächliche Version in App: 2.9.5 ❌
# - User sieht falsche Version!
```

**Lösung:** Pre-Commit Hook IMMER laufen lassen
- Hook erhöht Version automatisch
- Alle Dateien werden synchronisiert
- Garantierte Konsistenz

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
git commit -m "<type>: <description>"
```

**⚠️ WICHTIG:** Version NICHT in Commit-Message schreiben!
- Hook erhöht die Version automatisch
- Du kannst die neue Version NICHT vorhersagen (Hook könnte sie ändern)
- Nach dem Commit: Prüfe `git log -1` für die tatsächliche Version

**Types:**
- `fix:` - Bugfixes (Patch → 2.9.8 → 2.9.9)
- `feat:` - Neue Features (Minor → 2.9.8 → 2.10.0)
- `refactor:` - Code-Umstrukturierung (Patch)
- `docs:` - Dokumentation (Patch)
- `style:` - Styling/Formatierung (Patch)
- `perf:` - Performance-Verbesserung (Patch)
- `test:` - Tests (Patch)
- `chore:` - Wartung/Build (Patch)
- `BREAKING:` - Breaking Changes (Major → 2.9.8 → 3.0.0)

**Beispiele:**
```bash
# ✅ RICHTIG - Keine Version angeben
git commit -m "fix: TypeError bei chrome.storage Zugriff"
git commit -m "feat: Globales Icon-System"
git commit -m "BREAKING: API-Änderung für detector.js"

# ❌ FALSCH - Version angegeben (kann falsch sein!)
git commit -m "fix: Bug XYZ (v2.9.10)"  # Hook macht v2.9.9!
```

**Nach dem Commit:**
```bash
# Prüfe die tatsächlich verwendete Version:
git log -1 --oneline
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
- [ ] **🚨 NIE `--no-verify` verwenden!**
- [ ] Commit Message folgt Format: `<type>: <description>` (OHNE Version!)
- [ ] Keine manuellen Versionsnummern in Code-Dateien

---

## 🐛 Troubleshooting

### Problem: "Commits mit --no-verify gemacht - Version stimmt nicht!"

**Symptome:**
- Commit Messages sagen v2.9.8, aber App zeigt v2.9.5
- Mehrere Commits ohne Versionierung

**Diagnose:**
```bash
# Prüfe aktuelle Version in allen Dateien
grep "version" extension/manifest.json
grep "VERSION =" extension/scripts/version.js
grep "Version.*BETA" extension/popup.html
```

**Lösung:**
```bash
# 1. Ermittle wie viele Versionen fehlen
# Beispiel: Commits sagen v2.9.6, v2.9.7, v2.9.8 aber Version ist 2.9.5
# → 3 Versionen fehlen

# 2. Erhöhe Version entsprechend oft
npm run version:patch  # 2.9.5 → 2.9.6
npm run version:patch  # 2.9.6 → 2.9.7
npm run version:patch  # 2.9.7 → 2.9.8

# 3. Build
npm run build

# 4. Sync-Commit OHNE --no-verify!
git add -A
git commit -m "chore: Sync version to 2.9.8 - fix after --no-verify incident"

# 5. Push
git push -u origin <branch>
```

**Prävention:**
- ❌ NIE MEHR `--no-verify` verwenden!
- ✅ Immer Hook laufen lassen

---

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
2. **Commit Message:** Erstelle aussagekräftige Message mit Type (OHNE Version!)
3. **Push:** Mit `-u origin <branch-name>`

### Beispiel-Workflow:

```bash
# Änderungen gemacht...
git add -A

# Commit (Hook erhöht Version automatisch - NIE --no-verify!)
git commit -m "fix: Chrome storage race condition"

# Push
git push -u origin claude/feature-branch-xyz

# Prüfe die verwendete Version
git log -1 --oneline
# Output: abc1234 fix: Chrome storage race condition
```

**🚨 KRITISCH: NIE `--no-verify` verwenden!**
```bash
# ❌ NIEMALS SO:
git commit -m "fix: Bug" --no-verify

# ✅ IMMER SO:
git commit -m "fix: Bug"
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
- Nutze Pre-Commit Hook (immer!)
- Importiere `VERSION` aus `version.js` wenn benötigt
- Folge SemVer Konventionen
- Schreibe aussagekräftige Commit Messages (ohne Version!)
- Prüfe `git log -1` nach Commit für tatsächliche Version

### ❌ DON'T

- **🚨 NIEMALS `--no-verify` verwenden** (führt zu Inkonsistenzen!)
- Versionsnummern manuell in Dateien schreiben
- Versionsnummern in Code-Header-Kommentaren
- Version in Commit-Message angeben (Hook macht das!)
- Commits ohne Versionierung
- Commits ohne Build
- Force-Push ohne Absprache

### ⚠️ Lessons Learned (v2.9.5-2.9.8 Incident)

**Was passiert ist:**
- 3 Commits mit `--no-verify` gemacht
- Commit Messages: v2.9.6, v2.9.7, v2.9.8
- Tatsächliche Version blieb: 2.9.5
- User sah falsche Version in der App

**Lösung:**
- Version manuell 3x erhöht (npm run version:patch)
- Sync-Commit erstellt
- **Regel etabliert: NIE MEHR --no-verify!**

---

## 🔗 Ressourcen

- **Update-Script:** `scripts/update-version.js`
- **Version Source:** `extension/scripts/version.js`
- **Pre-Commit Hook:** `.git/hooks/pre-commit`
- **Changelog:** `CHANGELOG.md`
- **Semantic Versioning:** https://semver.org/

---

**Made with ❤️ for consistent versioning by BEYONDER**
