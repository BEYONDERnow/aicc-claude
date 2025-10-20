# Icons

Die Extension benötigt PNG-Icons in folgenden Größen:
- 16x16 (icon16.png)
- 48x48 (icon48.png)
- 128x128 (icon128.png)

## Icon-Generierung

Die SVG-Datei `icon.svg` kann mit ImageMagick in PNG konvertiert werden:

```bash
# Install ImageMagick (if needed)
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick

# Convert SVG to PNG
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

## Alternative: Online-Tools

Nutzen Sie einen Online SVG-zu-PNG Konverter:
- https://cloudconvert.com/svg-to-png
- https://svgtopng.com/

Oder erstellen Sie eigene Icons mit einem Design-Tool Ihrer Wahl.

## Temporäre Lösung

Für Entwicklungszwecke können Sie einfache einfarbige PNG-Dateien erstellen oder die Chrome Extension wird mit den SVG-Pfaden funktionieren (eingeschränkte Kompatibilität).
