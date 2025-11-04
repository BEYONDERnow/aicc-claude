# 🛡️ AI Compliance Checker - Public Beta

Willkommen zur **Public Beta** des AI Compliance Checkers! Danke, dass du uns hilfst, die Extension zu verbessern.

---

## 📥 Installation

1. **Lade die Extension** [(Aktuelle Version)](https://github.com/chrisbeyeler/aicc-claude/releases/tag/2.10.4)
2. **Chrome öffnen:** `chrome://extensions/`
3. **Entwicklermodus aktivieren** (Toggle oben rechts)
4. **"Entpackte Extension laden"** klicken
5. **Extension-Ordner auswählen**
6. **Fertig!** Das Shield-Icon 🛡️ erscheint oben rechts

---

## 💬 Feedback senden - So geht's

### Bug gefunden? Falsch erkannte Daten? Verbesserungsideen?

**Feedback senden ist super einfach:**

#### Variante 1: Über das Extension-Icon
1. **Klicke** auf das Shield-Icon 🛡️ (oben rechts in Chrome)
2. **Klicke** auf "💬 Feedback senden"
3. **Wähle** den Typ:
   - 🐛 **Bug Report** - Etwas funktioniert nicht
   - ⚠️ **False Positive** - Die Extension hat etwas FÄLSCHLICH als sensibel markiert
   - ❌ **False Negative** - Die Extension hat etwas NICHT erkannt (aber sollte)
   - 💡 **Feature Request** - Idee für neue Funktion
4. **Beschreibe** das Problem oder deinen Vorschlag
5. **Optional:** E-Mail angeben (für Rückfragen)
6. **Optional:** Screenshot anhängen (wird automatisch erstellt)
7. **Datenschutz-Checkbox** aktivieren
8. **"Feedback senden"** klicken

**Was passiert dann?**
- Ein **vorausgefülltes GitHub Issue** öffnet sich in deinem Browser
- Alle deine Angaben sind bereits eingetragen
- Du klickst einfach **"Submit new issue"** auf GitHub
- Fertig! 🎉

#### Variante 2: Direkt aus einer Warnung
Wenn die Extension etwas erkannt hat:
1. **Klicke** auf das Status-Icon (oranges/rotes Symbol im Textfeld)
2. **Overlay öffnet sich** mit allen Erkennungen
3. **Klicke** "💬 Falsch erkannt melden" (unten)
4. **Formular ist bereits vorausgefüllt** mit dem erkannten Wert!
5. **Füge deine Erklärung hinzu**
6. **"Feedback senden"** klicken

---

## 🔒 Datenschutz beim Feedback

**Was wird übertragen?**
- Dein Kommentar
- E-Mail (nur wenn du sie angibst)
- Screenshot (nur wenn du ihn aktivierst)
- Extension-Version & Browser-Info
- Bei False-Positive/Negative: Der erkannte Wert + Kontext

**Wichtig:**
- ✅ Alle Daten werden **öffentlich auf GitHub** als Issue gespeichert
- ✅ Du kannst sensible Daten **vor dem Absenden entfernen**
- ✅ Screenshot kannst du **deaktivieren**
- ✅ **Nur senden, was du teilen möchtest!**

---

## 🎯 Was uns besonders hilft

### Bei False Positives (falsch erkannt):
- **Was wurde erkannt?** (z.B. "Hans" als NAME)
- **Warum ist es KEIN sensibler Wert?** (z.B. "Hans ist hier ein Stadtname")
- **Kontext:** Was wolltest du eingeben?

**Beispiel:**
> Die Extension hat "Paris" als NAME erkannt, aber ich meinte die Stadt Paris (Standort).

### Bei False Negatives (nicht erkannt):
- **Was sollte erkannt werden?** (z.B. "Telefonnummer im Format 0041 79...")
- **Format:** Wie sah der Wert aus?

**Beispiel:**
> Telefonnummer "0041 79 123 45 67" wurde nicht erkannt (Schweiz mit Ländercode 0041).

### Bei Bugs:
- **Was hast du gemacht?** (Schritte zum Reproduzieren)
- **Was ist passiert?** (Fehlermeldung, falsches Verhalten)
- **Was sollte passieren?** (erwartetes Verhalten)

**Beispiel:**
> Wenn ich Text kopiere und einfüge (Strg+V), verschwindet die Warnung nicht. Erst beim nächsten Tippen erscheint sie wieder.

---

## 📊 Wie du die Extension testest

### 1. Teste die Erkennung
Probiere diese Beispiele aus (auf ChatGPT/Claude/Gemini):

```
Mein Name ist Max Mustermann und meine E-Mail ist max@example.com.
Telefon: 079 123 45 67
IBAN: CH93 0076 2011 6238 5295 7
Geboren: 15.03.1990
```

**Erwartung:**
- Orange/Rote Markierungen im Text
- Status-Icon zeigt Warnungen
- Klick auf Icon → Overlay mit Details

### 2. Teste False Positives
Probiere Werte, die NICHT sensibel sind:

```
Paris ist eine schöne Stadt.
Mein Auto ist ein Mercedes.
Ich arbeite bei Google.
```

**Falls erkannt:** Bitte als False Positive melden!

### 3. Teste False Negatives
Probiere sensible Daten in ungewöhnlichen Formaten:

```
Tel: +41 (0) 79 123 45 67
Mail: john.doe[at]example.com
IBAN CH9300762011623852957 (ohne Leerzeichen)
```

**Falls NICHT erkannt:** Bitte als False Negative melden!

---

## 🐛 Bekannte Probleme / Limitationen

- Namen-Erkennung: ~93% Genauigkeit (kann False Positives/Negatives geben)
- Nur Deutsch & Englisch unterstützt
- Funktioniert auf: ChatGPT, Claude, Gemini
- Andere Plattformen werden später ergänzt

---

## 🙏 Vielen Dank!

Dein Feedback ist **extrem wertvoll** für die Weiterentwicklung!

Jedes gemeldete False Positive/Negative hilft uns, die Erkennung zu verbessern.

---

## 📧 Fragen?

- **GitHub Issues:** https://github.com/chrisbeyeler/aicc-claude/issues
- **Direkter Kontakt:** [Deine E-Mail oder andere Kontaktinfo]

---

**Made with ❤️ by BEYONDER**

Version 2.10.0 BETA
