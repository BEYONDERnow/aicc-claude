# 🚀 GitHub App Setup für Feedback-System

Diese Anleitung zeigt dir, wie du eine **GitHub App** für das Feedback-System erstellst.

**Vorteil:** Beta-Nutzer können selbst Feedback senden, ohne dass du ihnen einen Token geben musst!

---

## 📋 Übersicht

**Was ist eine GitHub App?**
- Eine App, die im Namen deiner Nutzer GitHub Issues erstellen kann
- Nutzer autorisieren die App beim ersten Feedback (OAuth)
- Sicherer als Personal Access Token (nur Issues-Zugriff)

**Was brauchst du?**
- GitHub Account mit Admin-Rechten auf `chrisbeyeler/aicc-claude`
- 15 Minuten Zeit
- Chrome Extension ist bereits installiert

---

## 🔧 Schritt 1: GitHub App erstellen

### 1.1 Öffne GitHub App Settings

**Gehe zu:** https://github.com/settings/apps

Oder:
1. GitHub → Dein Profilbild (oben rechts)
2. **Settings**
3. Linke Sidebar: **Developer settings** (ganz unten)
4. **GitHub Apps**

### 1.2 Neue App erstellen

Klicke **"New GitHub App"**

### 1.3 App-Informationen

**GitHub App name** (Pflicht):
```
AI Compliance Checker Beta Feedback
```
*Hinweis: Name muss eindeutig sein, falls vergeben füge "(by YourName)" hinzu*

**Homepage URL** (Pflicht):
```
https://github.com/chrisbeyeler/aicc-claude
```

**Description** (Optional):
```
Beta Feedback System für AI Compliance Checker Browser Extension. Ermöglicht Nutzern Bug-Reports und False-Positive/Negative Meldungen direkt aus der Extension.
```

### 1.4 Callback URL (OAuth)

**Callback URL** (Pflicht):
```
https://chrisbeyeler.github.io/aicc-claude/oauth-callback
```

*Hinweis: Wir erstellen später eine einfache GitHub Pages Seite für den Callback*

**Oder falls du eine eigene Domain hast:**
```
https://deine-domain.com/oauth-callback
```

### 1.5 Setup URL (Optional)

**Setup URL** (Optional, leer lassen)

**Redirect on update** (Optional):
- ☐ Nicht aktivieren

### 1.6 Webhook

**Webhook**:
- ☐ **Active** (NICHT aktivieren)

*Wir brauchen keine Webhooks für Feedback*

### 1.7 Permissions

**Repository permissions:**

| Permission | Access | Warum? |
|------------|--------|---------|
| **Issues** | **Read and write** | Feedback als Issues erstellen |
| **Metadata** | **Read-only** | Automatisch aktiviert |

**Alle anderen Permissions:** Nicht aktivieren!

**Organization permissions:** Keine
**Account permissions:** Keine

### 1.8 Where can this GitHub App be installed?

Wähle:
- ◉ **Only on this account** (chrisbeyeler)

*Für Public Beta später auf "Any account" ändern*

### 1.9 App erstellen

Klicke **"Create GitHub App"** (ganz unten)

---

## 🔑 Schritt 2: Credentials kopieren

Nach der Erstellung siehst du die App-Details.

### 2.1 App ID

Kopiere die **App ID**:
```
App ID: 123456
```

### 2.2 Client ID

Kopiere die **Client ID**:
```
Client ID: Iv1.xxxxxxxxxxxxxxxxxxxx
```

### 2.3 Client Secret generieren

1. Scrolle zu **"Client secrets"**
2. Klicke **"Generate a new client secret"**
3. Kopiere das Secret (wird nur einmal angezeigt!):
```
Client secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2.4 Private Key generieren

1. Scrolle zu **"Private keys"**
2. Klicke **"Generate a private key"**
3. Eine `.pem` Datei wird heruntergeladen
4. **Speichere sie sicher!** (nicht ins Git committen)

---

## 📝 Schritt 3: App auf Repo installieren

### 3.1 Installation starten

1. Oben auf der App-Seite: Klicke **"Install App"** (linke Sidebar)
2. Wähle **"chrisbeyeler"** (dein Account)

### 3.2 Repository-Zugriff

Wähle:
- ◉ **Only select repositories**
- Wähle: **`aicc-claude`**

Klicke **"Install"**

---

## ⚙️ Schritt 4: Config in Extension eintragen

### 4.1 Config-Datei öffnen

```bash
cd /home/user/aicc-claude
cp extension/scripts/config.example.js extension/scripts/config.js
```

Öffne `extension/scripts/config.js`

### 4.2 GitHub App Credentials eintragen

Finde die Sektion `GITHUB_APP` und trage ein:

```javascript
export const GITHUB_CONFIG = {
  // Repository
  owner: 'chrisbeyeler',
  repo: 'aicc-claude',

  // GitHub App Credentials (von Schritt 2)
  useGitHubApp: true,  // ← Aktiviere GitHub App

  githubApp: {
    appId: '123456',                              // App ID
    clientId: 'Iv1.xxxxxxxxxxxxxxxxxxxx',        // Client ID
    clientSecret: 'xxxxxxxxxxxxxxxxxxxx',        // Client Secret
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...dein private key hier...
-----END RSA PRIVATE KEY-----`,
  },

  // Fallback: Personal Access Token (optional)
  token: '',  // Leer lassen wenn GitHub App verwendet wird

  apiUrl: 'https://api.github.com'
};
```

**Hinweis zum Private Key:**
- Öffne die `.pem` Datei mit Texteditor
- Kopiere den KOMPLETTEN Inhalt (inkl. `-----BEGIN...` und `-----END...`)
- Füge ihn als Multi-Line String ein

### 4.3 Speichern

Speichere die Datei (Strg+S)

---

## 🌐 Schritt 5: OAuth Callback Page erstellen (Optional)

### 5.1 GitHub Pages aktivieren

1. Gehe zu: https://github.com/chrisbeyeler/aicc-claude/settings/pages
2. **Source:** `Deploy from a branch`
3. **Branch:** `main` (oder `master`)
4. **Folder:** `/ (root)`
5. Klicke **"Save"**

### 5.2 Callback-Seite erstellen

Erstelle Datei: `oauth-callback.html` im Root:

```html
<!DOCTYPE html>
<html>
<head>
  <title>AI Compliance Checker - Autorisierung</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #33d099 0%, #101e35 100%);
      color: white;
      text-align: center;
    }
    .container {
      max-width: 500px;
      padding: 40px;
      background: rgba(255,255,255,0.1);
      border-radius: 24px;
      backdrop-filter: blur(10px);
    }
    h1 { font-size: 32px; margin-bottom: 16px; }
    p { font-size: 18px; margin-bottom: 24px; }
    .success { font-size: 64px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">✅</div>
    <h1>Autorisierung erfolgreich!</h1>
    <p>Du kannst dieses Fenster jetzt schließen und zurück zur Extension gehen.</p>
  </div>
  <script>
    // Extrahiere OAuth Code aus URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Sende Code zurück zur Extension (via postMessage)
      if (window.opener) {
        window.opener.postMessage({ type: 'github-oauth-callback', code }, '*');
      }

      // Auto-Close nach 3 Sekunden
      setTimeout(() => window.close(), 3000);
    }
  </script>
</body>
</html>
```

Committe und pushe die Datei.

---

## ✅ Schritt 6: Testen

### 6.1 Extension neu laden

1. Chrome → `chrome://extensions/`
2. Finde "AI Compliance Checker"
3. Klicke **"Neu laden"**

### 6.2 Feedback senden (Test)

1. Öffne ChatGPT/Claude/Gemini
2. Klicke Extension-Icon
3. Klicke **"💬 Feedback senden"**

**Erwartetes Verhalten:**
1. Feedback-Modal öffnet sich
2. Du füllst das Formular aus
3. Beim ersten Mal: **GitHub Autorisierung öffnet sich**
4. Du autorisierst die App
5. Feedback wird als GitHub Issue erstellt

### 6.3 Erfolg prüfen

Gehe zu: https://github.com/chrisbeyeler/aicc-claude/issues

→ Dein Test-Issue sollte dort erscheinen!

---

## 🔒 Sicherheit

✅ **Nur Issues-Zugriff** - Die App kann NICHTS anderes im Repo ändern
✅ **OAuth-Flow** - Jeder Nutzer autorisiert selbst
✅ **Credentials lokal** - `config.js` wird nicht ins Git committed
✅ **Private Key sicher** - Nur lokal bei dir

⚠️ **Wichtig:**
- Teile niemals dein **Client Secret** oder **Private Key**
- Die `config.js` steht in `.gitignore` (wird NICHT committed)
- Falls Credentials geleaked werden: App auf GitHub löschen und neu erstellen

---

## 🐛 Troubleshooting

### Problem: "App not found"
**Lösung:** Prüfe ob App auf Repo `chrisbeyeler/aicc-claude` installiert ist

### Problem: "OAuth callback failed"
**Lösung:**
1. Prüfe Callback URL in GitHub App Settings
2. Prüfe ob `oauth-callback.html` auf GitHub Pages erreichbar ist

### Problem: "Invalid credentials"
**Lösung:**
1. Prüfe ob Client ID, Client Secret und Private Key korrekt eingetragen sind
2. Keine Leerzeichen am Anfang/Ende
3. Private Key komplett (inkl. BEGIN/END)

---

## 📊 GitHub App vs. PAT - Nochmal der Vergleich

| Feature | Personal Access Token | GitHub App |
|---------|----------------------|------------|
| Setup-Zeit | 5 Min | 15 Min |
| Nutzer-Autorisierung | ❌ Nur du | ✅ Jeder Beta-Nutzer |
| Sicherheit | ⚠️ Voller Repo-Zugriff | ✅ Nur Issues |
| Credentials | Manuell in Code | OAuth (automatisch) |
| Public Beta | ❌ Nicht geeignet | ✅ Professionell |

---

## 🎉 Fertig!

Deine GitHub App ist jetzt einsatzbereit!

**Für Beta-Nutzer:**
- Beim ersten Feedback: GitHub Autorisierung
- Danach: Feedback senden ohne weitere Autorisierung
- Jeder kann selbstständig Feedback senden

**Nächste Schritte:**
1. Teste ausführlich
2. Lade Beta-Nutzer ein
3. Sammle Feedback über die Extension

---

## 📧 Hilfe

Bei Problemen:
- GitHub Issues: https://github.com/chrisbeyeler/aicc-claude/issues
- GitHub Apps Dokumentation: https://docs.github.com/en/apps
