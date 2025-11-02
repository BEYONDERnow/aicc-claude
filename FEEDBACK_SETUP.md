# 🔧 Feedback-System Setup-Anleitung

Diese Anleitung hilft dir, das GitHub Feedback-System zu konfigurieren.

---

## 📋 Was du brauchst

- Einen GitHub Account (chrisbeyeler)
- Zugriff auf das Repository `chrisbeyeler/aicc-claude`
- 5 Minuten Zeit

---

## 🚀 Setup in 4 Schritten

### Schritt 1: GitHub Personal Access Token erstellen

1. **Öffne GitHub Token-Seite**:
   - Direktlink: https://github.com/settings/tokens
   - ODER: GitHub → Dein Profilbild (oben rechts) → **Settings** → **Developer settings** (ganz unten in der linken Sidebar) → **Personal access tokens** → **Tokens (classic)**

2. **Token erstellen**:
   - Klicke **"Generate new token"** → **"Generate new token (classic)"**
   - **Note**: `AI Compliance Checker Beta Feedback`
   - **Expiration**: `90 days` (oder länger, z.B. `No expiration` für Beta)
   - **Scopes**: Aktiviere **NUR** ✅ **`public_repo`** (erste Checkbox unter "repo")
     - ⚠️ NICHT "repo" (voll), nur "public_repo"!

3. **Token generieren und kopieren**:
   - Scrolle runter und klicke **"Generate token"**
   - ⚠️ **WICHTIG**: Kopiere den Token **SOFORT** (wird nur einmal angezeigt!)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Speichere ihn temporär in einem Texteditor (z.B. Notepad)

---

### Schritt 2: Config-Datei erstellen

1. **Öffne dein Projekt-Verzeichnis**:
   ```
   aicc-claude/extension/scripts/
   ```

2. **Kopiere die Template-Datei**:
   - Finde die Datei: `config.example.js`
   - Kopiere sie (Strg+C / Cmd+C)
   - Füge sie im gleichen Ordner ein (Strg+V / Cmd+V)
   - Benenne die Kopie um zu: **`config.js`**

   **Ergebnis:**
   ```
   extension/scripts/
   ├── config.example.js  (bleibt unverändert)
   └── config.js          (neu erstellt, hier trägst du Token ein)
   ```

---

### Schritt 3: Token eintragen

1. **Öffne `config.js` in einem Texteditor** (z.B. VS Code, Notepad++)

2. **Finde die Zeile** (ca. Zeile 50):
   ```javascript
   token: 'HIER_DEINEN_TOKEN_EINFÜGEN',
   ```

3. **Ersetze den Platzhalter** mit deinem Token:
   ```javascript
   token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
   ```

4. **Speichere die Datei** (Strg+S / Cmd+S)

---

### Schritt 4: Extension testen

1. **Öffne Chrome**:
   - Gehe zu: `chrome://extensions/`
   - Finde "AI Compliance Checker"
   - Klicke **"Neu laden"** (Reload-Icon)

2. **Öffne eine AI-Plattform**:
   - Z.B. https://chatgpt.com
   - Öffne die Browser-Console (F12 oder Rechtsklick → "Untersuchen" → Tab "Console")

3. **Teste die GitHub-Verbindung**:
   - Kopiere diesen Code in die Console:
     ```javascript
     new GitHubFeedbackService().testConnection().then(console.log)
     ```
   - Drücke Enter

4. **Erwartete Ausgabe**:
   ```javascript
   {
     success: true,
     repo: {
       name: "chrisbeyeler/aicc-claude",
       private: false,
       hasIssues: true
     }
   }
   ```

   ✅ **Wenn du das siehst**: Alles funktioniert!
   ❌ **Wenn Fehler**: Siehe "Troubleshooting" unten

---

## 🎯 Feedback-System testen

1. **Klicke auf das Extension-Icon** (oben rechts in Chrome)
2. **Klicke "💬 Feedback senden"**
3. **Wähle einen Typ** (z.B. "Bug Report")
4. **Gib einen Test-Kommentar ein**: "Test vom Setup"
5. **Aktiviere die Opt-In Checkbox**
6. **Klicke "Feedback senden"**

**Erwartetes Ergebnis:**
- Success-Message erscheint
- Link zum GitHub Issue wird angezeigt
- Issue ist auf GitHub sichtbar: https://github.com/chrisbeyeler/aicc-claude/issues

---

## 🔒 Sicherheit

✅ **Deine `config.js` wird NIEMALS ins Git committed!**
- Sie steht in der `.gitignore`
- Nur die Template-Datei `config.example.js` wird ins Git committed (ohne Token)

⚠️ **WICHTIG:**
- Teile deinen Token NIEMALS mit anderen
- Committed die `config.js` NIEMALS ins Git
- Falls der Token leaked: Lösche ihn sofort auf GitHub (https://github.com/settings/tokens)

---

## 🐛 Troubleshooting

### Problem: "Token nicht konfiguriert"
**Ursache:** `config.js` existiert nicht oder Token ist leer
**Lösung:**
1. Prüfe ob `config.js` existiert (nicht nur `config.example.js`!)
2. Öffne `config.js` und prüfe ob Token eingetragen ist
3. Extension neu laden

---

### Problem: "GitHub API Error: 401"
**Ursache:** Token ist ungültig oder hat falsche Permissions
**Lösung:**
1. Prüfe ob Token richtig kopiert wurde (kein Leerzeichen am Anfang/Ende)
2. Prüfe auf GitHub ob Token noch existiert: https://github.com/settings/tokens
3. Erstelle neuen Token mit `public_repo` Scope

---

### Problem: "GitHub API Error: 403"
**Ursache:** Token hat keine Berechtigung für das Repo
**Lösung:**
1. Prüfe ob du Zugriff auf `chrisbeyeler/aicc-claude` hast
2. Falls privates Repo: Token braucht `repo` Scope (statt `public_repo`)

---

### Problem: "Module not found: config.js"
**Ursache:** Browser findet `config.js` nicht
**Lösung:**
1. Prüfe ob `config.js` im richtigen Ordner ist: `extension/scripts/config.js`
2. Extension neu laden
3. Falls weiterhin Fehler: Chrome Console öffnen (F12) und Fehlermeldung lesen

---

## 📧 Hilfe

Falls du nicht weiterkommst:
- Öffne ein GitHub Issue: https://github.com/chrisbeyeler/aicc-claude/issues
- Beschreibe das Problem + Fehlermeldung aus der Console (F12)

---

**Fertig! Dein Feedback-System ist jetzt einsatzbereit 🎉**
