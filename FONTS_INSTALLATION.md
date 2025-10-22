# 🔤 Font Installation Guide

## Benötigte Fonts

Die Extension benötigt **6 TTF-Dateien**:

### Poppins (3 Dateien)
- `Poppins-Regular.ttf` (Weight 400)
- `Poppins-SemiBold.ttf` (Weight 600)
- `Poppins-Bold.ttf` (Weight 700)

### Montserrat (3 Dateien)
- `Montserrat-Regular.ttf` (Weight 400)
- `Montserrat-Medium.ttf` (Weight 500)
- `Montserrat-SemiBold.ttf` (Weight 600)

---

## ✅ Installation (2 Minuten)

### Schritt 1: Fonts herunterladen

**Option A: Google Fonts (Empfohlen)**

1. Gehe zu [Google Fonts](https://fonts.google.com/)

2. **Poppins:**
   - Suche nach "Poppins"
   - Klicke "Download family"
   - Entpacke die ZIP
   - Kopiere diese 3 Dateien nach `extension/fonts/Poppins/`:
     - `Poppins-Regular.ttf`
     - `Poppins-SemiBold.ttf`
     - `Poppins-Bold.ttf`

3. **Montserrat:**
   - Suche nach "Montserrat"
   - Klicke "Download family"
   - Entpacke die ZIP
   - Kopiere diese 3 Dateien nach `extension/fonts/Montserrat/`:
     - `Montserrat-Regular.ttf`
     - `Montserrat-Medium.ttf`
     - `Montserrat-SemiBold.ttf`

**Option B: Direkte Links**

Alternativ kannst du die Fonts hier runterladen:
- [Poppins](https://fonts.google.com/specimen/Poppins?query=poppins)
- [Montserrat](https://fonts.google.com/specimen/Montserrat?query=montserrat)

---

### Schritt 2: Überprüfen

Die Ordnerstruktur sollte so aussehen:

```
extension/
├── fonts/
│   ├── Poppins/
│   │   ├── Poppins-Regular.ttf
│   │   ├── Poppins-SemiBold.ttf
│   │   └── Poppins-Bold.ttf
│   └── Montserrat/
│       ├── Montserrat-Regular.ttf
│       ├── Montserrat-Medium.ttf
│       └── Montserrat-SemiBold.ttf
├── icons/
├── scripts/
├── styles/
│   └── fonts.css  ← (bereits vorhanden)
└── manifest.json
```

---

### Schritt 3: Extension neu laden

1. Öffne `chrome://extensions`
2. Klicke auf 🔄 **Reload** bei "AI Compliance Checker"
3. ✅ **Fertig!** Die BEYONDER-Fonts werden jetzt verwendet

---

## 🔍 Troubleshooting

### Fonts werden nicht geladen?

**Prüfe die Dateinamen:** Die Namen müssen **exakt** so lauten:
```
✅ Poppins-Regular.ttf
✅ Poppins-SemiBold.ttf
✅ Poppins-Bold.ttf
✅ Montserrat-Regular.ttf
✅ Montserrat-Medium.ttf
✅ Montserrat-SemiBold.ttf

❌ poppins-regular.ttf (kleingeschrieben)
❌ Poppins Regular.ttf (mit Leerzeichen)
❌ Poppins-SemiBold.otf (falsche Endung)
```

**Prüfe die Ordnerstruktur:**
```bash
cd extension/fonts
ls Poppins/
# Sollte ausgeben: Poppins-Regular.ttf  Poppins-SemiBold.ttf  Poppins-Bold.ttf

ls Montserrat/
# Sollte ausgeben: Montserrat-Regular.ttf  Montserrat-Medium.ttf  Montserrat-SemiBold.ttf
```

**Chrome DevTools Console:**
1. Öffne die Extension (z.B. Popup)
2. Rechtsklick → "Inspect"
3. Gehe zu "Console" Tab
4. Schaue nach Fehlern wie "Failed to load font"

---

## 💡 Warum lokale Fonts?

✅ **100% Offline** - Extension funktioniert ohne Internet
✅ **Privacy** - Keine Requests zu Google Fonts
✅ **DSGVO-konform** - Keine Third-Party-Verbindungen
✅ **Schneller** - Kein Network-Overhead
✅ **Konsistent** - Funktioniert immer, auch in Firmen-Netzwerken

---

## 📝 Hinweise

- Die Fonts sind **nicht** im Git-Repository (`.gitignore`)
- Dateigröße: ~500KB total (sehr klein!)
- Falls du die Fonts nicht installierst, verwendet die Extension die System-Schrift
