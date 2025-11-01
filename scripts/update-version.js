#!/usr/bin/env node

/**
 * AI Compliance Checker - Zentrale Versionsverwaltung
 *
 * Dieses Script verwaltet die Version zentral und synchronisiert sie über alle Dateien.
 *
 * Usage:
 *   npm run version:patch  # 2.9.0 → 2.9.1 (Bugfixes)
 *   npm run version:minor  # 2.9.0 → 2.10.0 (Neue Features)
 *   npm run version:major  # 2.9.0 → 3.0.0 (Breaking Changes)
 *   npm run version:sync   # Synchronisiert aktuelle Version ohne Erhöhung
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Farben für Console-Output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Liest die aktuelle Version aus version.js
 */
function getCurrentVersion() {
  const versionFile = join(ROOT_DIR, 'extension/scripts/version.js');
  const content = readFileSync(versionFile, 'utf-8');
  const match = content.match(/export const VERSION = '([0-9.]+)'/);

  if (!match) {
    throw new Error('Konnte Version nicht aus version.js extrahieren');
  }

  return match[1];
}

/**
 * Erhöht die Version basierend auf Semantic Versioning
 */
function bumpVersion(currentVersion, type) {
  const parts = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
      parts[2]++;
      break;
    default:
      throw new Error(`Unbekannter Versions-Typ: ${type}`);
  }

  return parts.join('.');
}

/**
 * Aktualisiert eine Datei mit der neuen Version
 */
function updateFile(filePath, replacements) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let updated = false;

    for (const [pattern, replacement] of replacements) {
      const regex = new RegExp(pattern, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        updated = true;
      }
    }

    if (updated) {
      writeFileSync(filePath, content, 'utf-8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`${colors.red}Fehler beim Aktualisieren von ${filePath}:${colors.reset}`, error.message);
    return false;
  }
}

/**
 * Findet die Zeilennummer eines Patterns in einer Datei
 */
function findLineNumber(filePath, pattern) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const regex = new RegExp(pattern);

    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        return i + 1;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Synchronisiert die Version über alle Dateien
 */
function syncVersion(newVersion) {
  const updates = [
    {
      file: 'extension/manifest.json',
      replacements: [
        ['"version": "[0-9.]+"', `"version": "${newVersion}"`]
      ]
    },
    {
      file: 'package.json',
      replacements: [
        ['"version": "[0-9.]+"', `"version": "${newVersion}"`]
      ]
    },
    {
      file: 'extension/scripts/version.js',
      replacements: [
        ["export const VERSION = '[0-9.]+'", `export const VERSION = '${newVersion}'`]
      ]
    },
    {
      file: 'extension/popup.html',
      replacements: [
        ['Version [0-9.]+ BETA', `Version ${newVersion} BETA`]
      ]
    },
    {
      file: 'README.md',
      replacements: [
        ['\\*\\*Version [0-9.]+\\*\\*', `**Version ${newVersion}**`],
        ['Version [0-9.]+ BETA', `Version ${newVersion} BETA`]
      ]
    }
  ];

  console.log(`\n${colors.bold}${colors.cyan}📝 Aktualisiere Dateien auf Version ${newVersion}...${colors.reset}\n`);

  const results = [];

  for (const { file, replacements } of updates) {
    const filePath = join(ROOT_DIR, file);
    const updated = updateFile(filePath, replacements);

    if (updated) {
      const lineNumber = findLineNumber(filePath, replacements[0][0]);
      const lineInfo = lineNumber ? ` ${colors.yellow}(Zeile ${lineNumber})${colors.reset}` : '';
      console.log(`  ${colors.green}✓${colors.reset} ${file}${lineInfo}`);
      results.push({ file, success: true });
    } else {
      console.log(`  ${colors.yellow}⚠${colors.reset} ${file} ${colors.yellow}(keine Änderungen)${colors.reset}`);
      results.push({ file, success: false });
    }
  }

  return results;
}

/**
 * Aktualisiert CHANGELOG.md mit neuem Versions-Eintrag
 */
function updateChangelog(newVersion) {
  const changelogPath = join(ROOT_DIR, 'CHANGELOG.md');

  try {
    let content = readFileSync(changelogPath, 'utf-8');

    // Prüfe ob Version bereits existiert
    if (content.includes(`## [${newVersion}]`)) {
      console.log(`\n${colors.yellow}⚠ CHANGELOG.md enthält bereits Version ${newVersion}${colors.reset}`);
      return false;
    }

    // Finde die Position nach dem Header
    const headerEnd = content.indexOf('---', content.indexOf('---') + 3);

    if (headerEnd === -1) {
      console.log(`\n${colors.red}✗ Konnte CHANGELOG.md Header nicht finden${colors.reset}`);
      return false;
    }

    // Erstelle neuen Versions-Eintrag
    const today = new Date().toISOString().split('T')[0];
    const newEntry = `\n\n## [${newVersion}] - ${today}\n\n### 🔧 Zentrale Versionsverwaltung\n\n#### Zusammenfassung\n\nEinführung eines zentralen Versionsverwaltungssystems für konsistente Versionierung über alle Dateien hinweg.\n\n#### ✅ Neue Features\n\n**1. Zentrale Version Management** 🎯\n\n- **Single Source of Truth:** \`extension/scripts/version.js\` ist die zentrale Versionsdefinition\n- **Automatische Synchronisation:** Alle Dateien werden automatisch aktualisiert\n- **Git-Integration:** Unterstützt Git-Tags für Versionierung\n- **Build-Script:** \`scripts/update-version.js\` verwaltet den Prozess\n\n**2. NPM-Scripts für Versionierung** ⚙️\n\n- \`npm run version:patch\` - Bugfixes (2.9.0 → 2.9.1)\n- \`npm run version:minor\` - Neue Features (2.9.0 → 2.10.0)\n- \`npm run version:major\` - Breaking Changes (2.9.0 → 3.0.0)\n- \`npm run version:sync\` - Synchronisiert aktuelle Version\n\n**3. Aktualisierte Dateien** 📝\n\n- \`extension/manifest.json\` - Chrome Extension Version\n- \`package.json\` - NPM Package Version\n- \`extension/popup.html\` - Angezeigter Version String\n- \`extension/scripts/version.js\` - Zentrale Versionsdefinition\n- \`README.md\` - Dokumentierte Version\n- \`CHANGELOG.md\` - Automatischer Versions-Eintrag\n\n#### 📊 Technische Details\n\n- **Semantic Versioning:** MAJOR.MINOR.PATCH Format\n- **Konsistenz:** Alle Dateien nutzen dieselbe Version\n- **Automatisierung:** Ein Kommando aktualisiert alles\n- **Fehlerprävention:** Keine manuelle Copy-Paste Fehler mehr\n\n#### 🎨 Workflow-Verbesserungen\n\n1. Entwickler führt \`npm run version:minor\` aus\n2. Script erhöht Version und aktualisiert alle Dateien\n3. \`npm run build\` erstellt Bundle mit neuer Version\n4. Git Commit & Push\n5. Extension in Chrome zeigt korrekte Version\n\n**Benefits:**\n- ✅ Konsistente Versionierung\n- ✅ Fehlerfreie Synchronisation\n- ✅ Einfacher Workflow\n- ✅ Git-freundlich\n\n`;

    // Füge neuen Eintrag nach dem Header ein
    content = content.slice(0, headerEnd + 3) + newEntry + content.slice(headerEnd + 3);

    writeFileSync(changelogPath, content, 'utf-8');
    console.log(`\n${colors.green}✓ CHANGELOG.md aktualisiert${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`\n${colors.red}✗ Fehler beim Aktualisieren von CHANGELOG.md:${colors.reset}`, error.message);
    return false;
  }
}

/**
 * Erstellt Git-Tag für die neue Version
 */
function createGitTag(version) {
  try {
    // Prüfe ob Git verfügbar ist
    execSync('git --version', { stdio: 'ignore' });

    // Prüfe ob Tag bereits existiert
    try {
      execSync(`git rev-parse v${version}`, { stdio: 'ignore' });
      console.log(`\n${colors.yellow}⚠ Git-Tag v${version} existiert bereits${colors.reset}`);
      return false;
    } catch {
      // Tag existiert nicht, gut!
    }

    // Erstelle Tag
    execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'ignore' });
    console.log(`\n${colors.green}✓ Git-Tag v${version} erstellt${colors.reset}`);
    console.log(`${colors.cyan}  Pushe mit: git push origin v${version}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`\n${colors.yellow}⚠ Git-Tag konnte nicht erstellt werden${colors.reset}`);
    return false;
  }
}

/**
 * Hauptfunktion
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log(`\n${colors.bold}${colors.blue}🛡️  AI Compliance Checker - Versionsverwaltung${colors.reset}\n`);

  try {
    const currentVersion = getCurrentVersion();
    let newVersion;

    if (command === 'sync') {
      console.log(`${colors.cyan}Synchronisiere aktuelle Version: ${currentVersion}${colors.reset}`);
      newVersion = currentVersion;
    } else if (['patch', 'minor', 'major'].includes(command)) {
      newVersion = bumpVersion(currentVersion, command);
      console.log(`${colors.cyan}Version erhöht: ${colors.bold}${currentVersion}${colors.reset}${colors.cyan} → ${colors.bold}${colors.green}${newVersion}${colors.reset}`);
    } else {
      console.error(`${colors.red}Fehler: Unbekannter Befehl "${command}"${colors.reset}`);
      console.log(`\n${colors.yellow}Usage:${colors.reset}`);
      console.log(`  npm run version:patch  # Bugfixes (2.9.0 → 2.9.1)`);
      console.log(`  npm run version:minor  # Features (2.9.0 → 2.10.0)`);
      console.log(`  npm run version:major  # Breaking (2.9.0 → 3.0.0)`);
      console.log(`  npm run version:sync   # Synchronisieren`);
      process.exit(1);
    }

    // Synchronisiere Version
    const results = syncVersion(newVersion);
    const successCount = results.filter(r => r.success).length;

    // Aktualisiere CHANGELOG nur bei Versionserhöhung
    if (command !== 'sync' && newVersion !== currentVersion) {
      updateChangelog(newVersion);
    }

    // Zusammenfassung
    console.log(`\n${colors.bold}${colors.green}✅ Version ${newVersion} erfolgreich synchronisiert!${colors.reset}`);
    console.log(`${colors.cyan}   ${successCount} von ${results.length} Dateien aktualisiert${colors.reset}\n`);

    // Nächste Schritte
    console.log(`${colors.bold}🚀 Nächste Schritte:${colors.reset}`);
    console.log(`  1. ${colors.yellow}npm run build${colors.reset} - Bundle erstellen`);
    console.log(`  2. ${colors.yellow}git add -A && git commit -m "chore: bump version to ${newVersion}"${colors.reset}`);
    console.log(`  3. ${colors.yellow}git push${colors.reset}\n`);

    // Optional: Git-Tag erstellen
    if (command !== 'sync' && newVersion !== currentVersion) {
      createGitTag(newVersion);
    }

  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}✗ Fehler:${colors.reset} ${error.message}\n`);
    process.exit(1);
  }
}

main();
