# 🚀 GitHub App Setup - Quick Guide für dich

## Schritt 1: GitHub App erstellen (5 Min)

1. **Öffne:** https://github.com/settings/apps/new

2. **Fülle aus:**
   ```
   GitHub App name: AI Compliance Checker Feedback
   Homepage URL: https://github.com/chrisbeyeler/aicc-claude
   Callback URL: https://chrisbeyeler.github.io/aicc-claude/oauth-callback

   Description (optional):
   Beta Feedback System für AI Compliance Checker.
   Ermöglicht Beta-Nutzern Bug-Reports und Verbesserungsvorschläge.
   ```

3. **Webhook:** ☐ NICHT aktivieren

4. **Permissions:**
   - Issues: **Read and write** ✅
   - (Alle anderen: keine)

5. **Where can this app be installed?**
   - ◉ Only on this account

6. **Klicke:** "Create GitHub App"

---

## Schritt 2: Credentials kopieren (2 Min)

Nach der Erstellung:

1. **App ID:** Notiere die Nummer (z.B. `123456`)

2. **Client ID:** Kopiere (z.B. `Iv1.xxxxxxxxxxxxx`)

3. **Client Secret:**
   - Klicke "Generate a new client secret"
   - Kopiere sofort (wird nur einmal angezeigt!)

4. **Private Key:**
   - Klicke "Generate a private key"
   - `.pem` Datei wird heruntergeladen
   - Speichere sicher!

---

## Schritt 3: App installieren (1 Min)

1. Oben: Klicke **"Install App"** (linke Sidebar)
2. Wähle **"chrisbeyeler"** (dein Account)
3. **Repository-Zugriff:**
   - ◉ Only select repositories
   - ✅ `aicc-claude`
4. Klicke **"Install"**

---

## Schritt 4: Config in Extension eintragen (3 Min)

1. **Öffne:** `extension/scripts/config.js`

2. **Ändere:**
   ```javascript
   window.GITHUB_CONFIG = {
     owner: 'chrisbeyeler',
     repo: 'aicc-claude',
     apiUrl: 'https://api.github.com',

     // GitHub App aktivieren
     useGitHubApp: true,  // ← true setzen!

     githubApp: {
       clientId: 'Iv1.xxxxxxxxxxxxx'  // ← Deine Client ID
     },

     oauthCallbackUrl: 'https://chrisbeyeler.github.io/aicc-claude/oauth-callback',

     token: ''  // Leer lassen
   };
   ```

3. **Speichern**

---

## Schritt 5: OAuth Callback deployen (5 Min)

Die Datei `oauth-callback.html` muss auf GitHub Pages erreichbar sein.

### Option A: GitHub Pages aktivieren

1. **Repo Settings:** https://github.com/chrisbeyeler/aicc-claude/settings/pages
2. **Source:** Deploy from a branch
3. **Branch:** `main` oder den Branch mit `oauth-callback.html`
4. **Folder:** `/ (root)`
5. **Klicke:** "Save"
6. **Warte 2 Min**, dann teste: https://chrisbeyeler.github.io/aicc-claude/oauth-callback

### Option B: Alternative Domain

Falls du eine eigene Domain hast:
1. Hoste `oauth-callback.html` dort
2. Ändere in GitHub App Settings die Callback URL
3. Ändere in `config.js` die `oauthCallbackUrl`

---

## Schritt 6: Extension neu laden & testen (2 Min)

1. **Chrome:** `chrome://extensions/`
2. **Neu laden:** AI Compliance Checker
3. **Öffne:** ChatGPT/Claude/Gemini
4. **Console öffnen:** F12
5. **Check:** `[GitHub Feedback] Custom config loaded` (sollte erscheinen)

---

## Schritt 7: Feedback testen (3 Min)

1. **Klicke:** Extension-Icon → "💬 Feedback senden"
2. **Fülle aus:** Test-Feedback
3. **Erwartung beim ersten Mal:**
   - GitHub Autorisierung öffnet sich
   - Du autorisierst die App
   - Issue wird automatisch via API erstellt
4. **Check:** GitHub Issue ist da!

---

## ⏱️ Gesamt-Zeit: ~20 Minuten

---

## 🐛 Troubleshooting

### Problem: "OAuth callback failed"
**Lösung:**
- Prüfe ob `oauth-callback.html` erreichbar ist
- Öffne: https://chrisbeyeler.github.io/aicc-claude/oauth-callback
- Sollte eine Seite mit "Autorisierung erfolgreich" zeigen

### Problem: "App not found"
**Lösung:**
- Prüfe ob App auf Repo `aicc-claude` installiert ist
- GitHub → Settings → Installations → AI Compliance Checker Feedback

### Problem: "Invalid credentials"
**Lösung:**
- Prüfe Client ID in `config.js`
- Keine Leerzeichen am Anfang/Ende

---

## ✅ Fertig!

Beta-User können jetzt Feedback senden via OAuth-Flow!

Beim ersten Feedback:
1. GitHub Autorisierung
2. User akzeptiert
3. Automatische Issue-Erstellung

Danach: Keine Autorisierung mehr nötig!
