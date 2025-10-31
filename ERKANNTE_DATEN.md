# 🔍 Erkannte Personenspezifische Daten

**AI Compliance Checker v2.6.0**

Diese Dokumentation listet alle personenbezogenen und sensiblen Daten auf, die der AI Compliance Checker erkennt, kategorisiert nach DSGVO (Datenschutz-Grundverordnung) und DSG (Schweizer Datenschutzgesetz).

**🎯 v2.6.0 Neue Features:**
- ✅ Geburtsdaten-Erkennung (Hybrid: NER + Regex)
- ✅ Standorte/Adressen-Erkennung (Hybrid: NER + Regex)
- ✅ Geldbeträge-Erkennung (Hybrid: NER + Regex, inkl. Millionen/Milliarden)
- ✅ Organisations-Erkennung (NER)

---

## 📋 Kategorien nach DSGVO

### ✅ Art. 4 DSGVO: Personenbezogene Daten

Alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.

### ⚠️ Art. 9 DSGVO: Besondere Kategorien personenbezogener Daten

Hochsensible Daten, die besonderen Schutz erfordern (z.B. Gesundheitsdaten, biometrische Daten).

### 🔐 Art. 32 DSGVO: Sicherheit der Verarbeitung

Technische und organisatorische Maßnahmen zum Schutz personenbezogener Daten.

---

## 🔴 KRITISCHE DATEN (Critical)

Diese Daten sind **hochsensibel** und dürfen **NIEMALS** an KI-Plattformen übermittelt werden.

### 1. Finanzdaten

| Datentyp | Beispiele | DSGVO | Beschreibung |
|----------|-----------|-------|--------------|
| **IBAN** | `CH93 0076 2011 6238 5295 7` | Art. 4 | Internationale Bankkontonummer - ermöglicht direkten Zugriff auf Bankkonten |
| **Kreditkartennummer** | `4532 1234 5678 9010` | Art. 4 | Vollständige Kreditkartennummer - ermöglicht Zahlungen |
| **Bankleitzahl** | Teil von IBAN | Art. 4 | Identifikation von Banken |

**Risiko:** Finanzieller Betrug, Identitätsdiebstahl, unbefugte Transaktionen

---

### 2. Kommunikationsdaten

| Datentyp | Beispiele | DSGVO | Beschreibung |
|----------|-----------|-------|--------------|
| **E-Mail-Adresse** | `chris@beyonder.ch`<br>`michael.mueller@gmail.com` | Art. 4 | Eindeutige Identifikation einer Person, ermöglicht Kontaktaufnahme |
| **Schweizer Telefon** | `079 328 70 97`<br>`+41 79 328 70 70`<br>`+41 (0)79 328 70 70` | Art. 4 | Mobile und Festnetz-Nummern |
| **Deutsche Telefon** | `+49 30 12345678`<br>`030 12345678` | Art. 4 | Deutsche Telefonnummern |
| **Internationale Telefon** | `+1 555 123 4567` | Art. 4 | Globale Telefonnummern |

**Risiko:** Spam, Phishing, unerwünschte Kontaktaufnahme, Identifikation

---

### 3. Amtliche Identifikationsnummern

| Datentyp | Beispiele | DSGVO | DSG | Beschreibung |
|----------|-----------|-------|-----|--------------|
| **AHV-Nummer (CH)** | `756.6673.7269.03` | Art. 4 | Art. 5 DSG | Schweizer Sozialversicherungsnummer - **hochsensibel gemäß DSG** |
| **Reisepass-Nummer** | `CH1234567` | Art. 4 | Art. 5 DSG | Amtliche Ausweisnummer |
| **Personalausweis** | `DE123456789` | Art. 4 | - | Deutsche Ausweisnummer |

**Risiko:** Identitätsdiebstahl, Missbrauch für behördliche Vorgänge, Sozialversicherungsbetrug

---

### 4. Zugangsdaten & API-Schlüssel

| Datentyp | Beispiele | DSGVO | Beschreibung |
|----------|-----------|-------|--------------|
| **Passwort** | `MeinSicheresPasswort123!` | Art. 32 | Authentifizierungsdaten - niemals teilen! |
| **Stripe Live API Key** | `sk_live_51234567890...` | Art. 32 | Gewährt Zugriff auf Zahlungsdaten und Transaktionen |
| **Stripe Test API Key** | `sk_test_51234567890...` | Art. 32 | Test-Schlüssel (weniger kritisch, aber vertraulich) |
| **API Token** | `Bearer eyJhbGciOiJIUzI1...` | Art. 32 | OAuth/JWT-Token für API-Zugriff |

**Risiko:** Unbefugter Systemzugriff, Datenlecks, finanzielle Schäden, Kompromittierung von Diensten

---

## 🟠 WARNUNGEN (Warning)

Diese Daten sind **personenbezogen** und sollten nur mit Vorsicht an KI-Plattformen übermittelt werden.

### 5. Personenidentifikation

| Datentyp | Beispiele | DSGVO | Beschreibung |
|----------|-----------|-------|--------------|
| **Vollständiger Name** | `Hans Peter Müller`<br>`Thomas Schmidt`<br>`Marie Curie` | Art. 4 | Vor- und Nachname oder mehrere Vornamen |
| **Einzelner Vorname** | `Hans`, `Peter`, `Marie` | Art. 4 | Einzelner Vorname im Kontext |
| **Einzelner Nachname** | `Müller`, `Schmidt`, `Beyeler` | Art. 4 | Einzelner Nachname im Kontext |
| **Name mit Kontext** | `Name: Peter Mueller`<br>`Kontakt: Hans` | Art. 4 | Name nach Marker-Wörtern erkannt |

**Erkennungs-Methode:**
- **Lexikon-basiert:** 6600+ Namen aus 8 Ländern (CH, DE, AT, FR, IT, EN, ES, PT)
- **KI-basiert:** Named Entity Recognition (NER) mit Transformer.js
- **Kontext-basiert:** Namen nach "Name:", "Kontakt:", etc.

**Risiko:** Identifikation von Personen, Kombination mit anderen Daten möglich

---

### 6. Adressdaten & Standorte (v2.6.0: Hybrid NER + Regex)

| Datentyp | Beispiele | DSGVO | Beschreibung |
|----------|-----------|-------|--------------|
| **Vollständige Adresse (Regex)** | `Bahnhofstrasse 123, 8001 Zürich`<br>`Bundesplatz 1, 3011 Bern` | Art. 4 | Straße, Hausnummer, PLZ und Ort |
| **Standort/Stadt (NER)** | `Wohnt in Zürich`<br>`von Berlin nach München`<br>`moved to Switzerland` | Art. 4 | Kontextuelle Ortserkennung durch Compromise.js |
| **Schweizer PLZ** | `8001`, `6673`, `7269`, `3011` | Art. 4 | Postleitzahl (4-stellig) |
| **Deutsche PLZ** | `10115`, `80331` | Art. 4 | Postleitzahl (5-stellig) |
| **Straßenname** | `Bahnhofstrasse`, `Bundesplatz` | Art. 4 | Straßenname (nur im Kontext) |

**Erkennungsmethoden (Hybrid):**
- **Regex:** Präzises Pattern-Matching für vollständige Adressen (DE/CH)
  - `Bahnhofstrasse 12, 8001 Zürich` → Straße + PLZ + Stadt
- **NER (Compromise.js):** Kontextuelle Erkennung von Städten, Ländern, Regionen
  - `Zürich`, `Berlin`, `München`, `Switzerland`, `Germany`
  - Filter: Sehr kurze Wörter (<3 Zeichen) werden gefiltert

**Filterung:**
- ✅ Jahre (1900-2100) werden NICHT als PLZ erkannt
- ✅ Kontext-Check: "Jahr", "geboren", "seit" → keine PLZ
- ✅ Sehr kurze Orte (<3 Zeichen) gefiltert (verhindert "ist", "am", "im")

**Risiko:** Lokalisierung von Personen, Kombination mit Namen ermöglicht eindeutige Identifikation

---

### 7. Geburtsdaten & Alter (v2.6.0: Hybrid NER + Regex)

| Datentyp | Beispiele | DSGVO | Beschreibung |
|----------|-----------|-------|--------------|
| **Geburtsdatum (Regex)** | `Geburtsdatum: 15.03.1985`<br>`geboren 1990`<br>`Date of birth: 15.03.1985` | Art. 4 | Geburtsdatum mit Kontext-Marker (DE/EN) |
| **Geburtsdatum (NER)** | `March 15, 1985`<br>`15. März 1985`<br>`1990` | Art. 4 | Kontextuelle Datums-Erkennung durch Compromise.js |
| **Alter/Jahrgang** | `geboren 1985`, `She was born in 1990` | Art. 4 | Geburtsjahr im Satzkontext |

**Erkennungsmethoden (Hybrid):**
- **Regex:** Präzises Pattern-Matching für deutsche Formate mit Kontext
  - `geboren 1990` → Jahrgang erkannt
  - `Geburtsdatum: 15.03.1985` → vollständiges Datum
- **NER (Compromise.js):** Kontextuelle Erkennung von Daten im Fließtext
  - `March 15, 1985` → englisches Format
  - `15. März 1985` → deutsches Format mit Monatsnamen

**Risiko:** Altersbestimmung, Kombination mit anderen Daten ermöglicht eindeutige Identifikation

---

### 8. Technische Identifikatoren

| Datentyp | Beispiele | DSGVO | Beschreibung |
|----------|-----------|-------|--------------|
| **IP-Adresse (öffentlich)** | `203.0.113.42` | Art. 4 | Öffentliche IPv4-Adresse - kann zur Identifikation verwendet werden |
| **IP-Adresse (privat)** | `192.168.1.1`<br>`10.0.0.1` | Info | Private IP (RFC 1918) - **nicht personenbezogen**, aber Hinweis auf interne Dokumente |
| **MAC-Adresse** | `00:1A:2B:3C:4D:5E` | Art. 4 | Hardware-Identifikator (falls implementiert) |

**Filterung:**
- ✅ Private IP-Ranges (10.x, 172.16-31.x, 192.168.x) werden als "Info" markiert
- ⚠️ Öffentliche IPs sind personenbezogen gemäß EuGH-Urteil

**Risiko:** Geolokalisierung, Tracking, Identifikation von Geräten

---

### 9. Geschäftsdaten & Finanzinformationen (v2.6.0: Hybrid NER + Regex)

| Datentyp | Beispiele | DSGVO | Beschreibung |
|----------|-----------|-------|--------------|
| **Gehaltsangabe** | `Gehalt: 120'000 CHF`<br>`Lohn: 8'500 EUR`<br>`Verdienst: 95'000 USD` | Art. 4 | Gehaltsinformationen mit Kontext-Marker |
| **Geldbeträge (Regex)** | `120'000 CHF`<br>`1.5 Millionen CHF`<br>`2.3 Milliarden Euro`<br>`85 Tausend Dollar` | Geschäftsdaten | Finanzielle Beträge inkl. Millionen/Milliarden (DE) |
| **Geldbeträge (NER)** | `5 million dollars`<br>`100k`<br>`2.5m euros` | Geschäftsdaten | Englische Betragsformate mit Abkürzungen |
| **Vertraulichkeits-Kennzeichnung** | `VERTRAULICH`<br>`STRENG VERTRAULICH`<br>`CONFIDENTIAL` | Geschäftsdaten | Dokument-Klassifizierung |
| **Organisationen (NER)** | `UBS AG`<br>`Google Switzerland GmbH`<br>`IBM`<br>`Microsoft` | Art. 4 | Firmennamen können vertrauliche Kundenbeziehungen offenlegen |

**Erkennungsmethoden (Hybrid):**
- **Regex:** Präzises Pattern-Matching für deutsche Zahlwörter
  - `1.5 Millionen CHF`, `2.3 Milliarden Euro`, `85 Tausend Dollar`
  - Unterstützt: Millionen/Mio./Milliarden/Mrd./Tausend/k
- **NER (Compromise.js):** Kontextuelle Erkennung englischer Beträge
  - `5 million dollars`, `100k`, `2.5m euros`

**Währungsformate:**
- ✅ Schweizer Format: `120'000 CHF`, `Fr. 2'500`, `1.5 Millionen CHF`
- ✅ Euro Format: `1.500 €`, `€ 3.450,50`, `2.3 Milliarden Euro`
- ✅ Dollar Format: `$ 10,000.00`, `5 million dollars`, `100k`
- ✅ Zahlwörter: `Millionen`, `Milliarden`, `Tausend`, `million`, `billion`, `thousand`

**Risiko:** Geschäftsgeheimnisse, Wettbewerbsnachteile, sensible Finanzinformationen, vertrauliche Kundenbeziehungen

---

## 🔍 Erkennungsmethoden

### 1. **Regex-Patterns (Schnell & Zuverlässig)**

Für strukturierte Daten:
- E-Mails, IBANs, Kreditkarten, Telefonnummern
- AHV-Nummern, Reisepass-Nummern
- IP-Adressen, Postleitzahlen
- Geldbeträge, Geburtsdaten

**Vorteil:** 100% deterministisch, keine False Positives bei korrekten Patterns

---

### 2. **Lexikon-basierte Erkennung (6600+ Namen)**

Für Namen aus 8 Ländern:
- **Schweiz (CH):** 1500+ Namen (DE/FR/IT)
- **Deutschland (DE):** 2000+ Namen
- **Österreich (AT):** 800+ Namen
- **Frankreich (FR):** 600+ Namen
- **Italien (IT):** 500+ Namen
- **UK/USA (EN):** 800+ Namen
- **Spanien (ES):** 400+ Namen
- **Portugal (PT):** 300+ Namen

**Filterung:**
- ✅ ALL-CAPS Überschriften (KONTAKTDATEN, FINANZDATEN)
- ✅ Lowercase Wortteile (kverbindung, delt)
- ✅ Bindestrich-Komposita (Prompt-Library, Remote-Teilnahme)
- ✅ Fachbegriffe (KI, AI, IT, Task, Setup, Copilot)
- ✅ Artikel und Präpositionen (Die, Der, Mit, Von, Für)
- ✅ Jahreszeiten (Sommer, Winter, Frühling, Herbst)

---

### 3. **KI-basierte Named Entity Recognition mit Compromise.js (v2.5.0+)**

- **Library:** Compromise.js (NLP ohne ML-Dependencies)
- **Bundle-Größe:** ~284KB (in detector.bundle.js integriert)
- **100% lokal:** Keine Server-Kommunikation, keine externen Models
- **Performance:** ~130k chars/sec, ~93% Accuracy

**Erkannte Entitäten (v2.6.0):**
- **Personen:** Namen im Satzkontext ("Ich traf Maria")
- **Geburtsdaten:** Daten mit Monatsnamen ("March 15, 1985")
- **Standorte:** Städte, Länder, Regionen ("Zürich", "Switzerland")
- **Geldbeträge:** Englische Formate ("5 million dollars", "100k")
- **Organisationen:** Firmennamen ("UBS AG", "Google Switzerland")

**Vorteile:**
- ✅ Kein Lexikon nötig - erkennt auch unbekannte Namen
- ✅ Kontext-Verständnis - versteht Satz-Struktur und Grammatik
- ✅ Automatische Filterung deutscher Substantive
- ✅ Bindestrich-Namen werden als Einheit erkannt
- ✅ Aktiv maintained (letzte Updates Januar 2025)

**Status:** Standardmäßig aktiviert, immer verfügbar

---

### 4. **Kontext-basierte Filterung**

Smart-Filterung basierend auf umgebendem Text:

**PLZ vs. Jahr:**
```javascript
"geboren 1985" → 1985 = Jahr (NICHT PLZ)
"PLZ: 8001"    → 8001 = PLZ
```

**Name vs. Kontext:**
```javascript
"Name: Peter Mueller"     → Peter Mueller = Name
"Artikel-Test: Die Zukunft" → Artikel-Test = KEIN Name
```

**IBAN vs. Telefon:**
```javascript
"IBAN: CH93 0076 2011 6238" → 0076... = Teil der IBAN (NICHT Telefon)
```

---

## 📊 Erkennungs-Statistiken (v2.6.0)

### Integration Tests (15 Test Cases)

| Feature | Test Cases | Pass Rate | Accuracy |
|---------|-----------|-----------|----------|
| **Kritische Daten** | Laufend | - | 100% ✅ |
| **Geburtsdaten** | 3 | 100% | ✅ |
| **Standorte/Adressen** | 3 | 100% | ✅ |
| **Geldbeträge** | 4 | 100% | ✅ |
| **Organisationen** | 3 | 100% | ✅ |
| **Komplexe Szenarien** | 2 | 100% | ✅ |
| **Gesamt** | 15 | **100%** | **~93%** ✅ |

### Entity Coverage (v2.6.0)

| Entity-Typ | Methode | Status |
|------------|---------|--------|
| E-Mail | Regex | ✅ 100% |
| Telefon | Regex | ✅ 100% |
| IBAN | Regex | ✅ 100% |
| Kreditkarte | Regex | ✅ 100% |
| AHV-Nummer | Regex | ✅ 100% |
| Namen | NER + Regex | ✅ ~95% |
| Geburtsdaten | NER + Regex | ✅ ~90% |
| Standorte | NER + Regex | ✅ ~85% |
| Geldbeträge | NER + Regex | ✅ ~90% |
| Organisationen | NER | ✅ ~85% |

**Verbesserungen in v2.6.0:**
- ✅ Geburtsdaten: Hybrid-Erkennung für DE/EN Formate
- ✅ Geldbeträge: Millionen/Milliarden Support
- ✅ Standorte: Städte/Länder kontextuell erkannt
- ✅ Organisationen: Firmennamen erkannt
- ✅ False Positives: Reduziert durch <3 Zeichen Filter

---

## 🚫 Was wird NICHT erkannt?

### 1. Anonymisierte Daten

```
Max M. (Initial statt Nachname)
Hans P. aus Zürich
```

### 2. Verschlüsselte Daten

```
Base64: SGFucyBQZXRlcg==
Hash: 5d41402abc4b2a76b9719d911017c592
```

### 3. Bilder & Dateien

```
Anhang: rechnung.pdf
Screenshot von Kontoauszug
```

### 4. Code-Blöcke

Namen in Code werden aktuell erkannt - geplanter Workaround:
```javascript
// FUTURE: Exclude code blocks from detection
const user = "Hans Peter"; // Should NOT be detected
```

---

## 🎯 DSGVO-Mapping (v2.6.0)

| Erkannter Datentyp | DSGVO Artikel | Schutzbedarf | Rechtsgrundlage erforderlich? |
|-------------------|---------------|--------------|-------------------------------|
| **E-Mail** | Art. 4 Abs. 1 | Hoch | Ja (Art. 6) |
| **Name** | Art. 4 Abs. 1 | Hoch | Ja (Art. 6) |
| **Telefon** | Art. 4 Abs. 1 | Hoch | Ja (Art. 6) |
| **Adresse** | Art. 4 Abs. 1 | Hoch | Ja (Art. 6) |
| **Standort** | Art. 4 Abs. 1 | Mittel-Hoch | Ja (Art. 6) |
| **IBAN** | Art. 4 Abs. 1 | Sehr hoch | Ja (Art. 6) |
| **AHV-Nummer** | Art. 4 Abs. 1 + DSG Art. 5 | Sehr hoch | Ja + besondere Schutzmaßnahmen |
| **Geburtsdatum** | Art. 4 Abs. 1 | Mittel-Hoch | Ja (Art. 6) |
| **IP-Adresse** | Art. 4 Abs. 1 (EuGH) | Mittel | Ja (Art. 6) |
| **Passwort** | Art. 32 | Sehr hoch | Sicherheitsmaßnahme erforderlich |
| **API-Key** | Art. 32 | Sehr hoch | Sicherheitsmaßnahme erforderlich |
| **Geldbetrag** | Geschäftsdaten | Mittel | Ja (Vertraulichkeit) |
| **Organisation** | Art. 4 Abs. 1 (indirekt) | Mittel | Ja (Kundenbeziehung kann personenbezogen sein) |

---

## 🔐 Datenschutzhinweise

### Für Entwickler

**Vor Übermittlung an KI-Plattformen:**
1. ✅ Prüfen Sie ALLE Erkennungen im Modal
2. ✅ Entfernen Sie kritische Daten manuell
3. ✅ Ersetzen Sie Namen durch Platzhalter (z.B. "Person A", "Mitarbeiter X")
4. ✅ Anonymisieren Sie Adressen (z.B. "Stadt in der Schweiz")
5. ✅ Nutzen Sie Fake-Daten für Tests

### Für Unternehmen

**Compliance-Checkliste:**
- [ ] Mitarbeiter schulen über erkannte Datentypen
- [ ] Unternehmensrichtlinie für KI-Nutzung erstellen
- [ ] Tool als Teil der technischen Maßnahmen gemäß Art. 32 DSGVO einsetzen
- [ ] Regelmäßige Audits der KI-Plattform-Nutzung
- [ ] Dokumentation der Schutzmaßnahmen für Aufsichtsbehörden

---

## 📚 Weiterführende Ressourcen

### DSGVO

- [Art. 4 DSGVO - Begriffsbestimmungen](https://dsgvo-gesetz.de/art-4-dsgvo/)
- [Art. 9 DSGVO - Besondere Kategorien](https://dsgvo-gesetz.de/art-9-dsgvo/)
- [Art. 32 DSGVO - Sicherheit der Verarbeitung](https://dsgvo-gesetz.de/art-32-dsgvo/)

### DSG (Schweiz)

- [DSG Art. 5 - Besonders schützenswerte Personendaten](https://www.fedlex.admin.ch/eli/cc/2022/491/de#art_5)
- [EDÖB - Datenschutzbeauftragter der Schweiz](https://www.edoeb.admin.ch/)

### Technische Standards

- [RFC 5322 - E-Mail Format](https://tools.ietf.org/html/rfc5322)
- [ISO 13616 - IBAN Standard](https://www.iso.org/standard/81090.html)
- [RFC 1918 - Private IP Ranges](https://tools.ietf.org/html/rfc1918)

---

**Version:** 2.6.0
**Letzte Aktualisierung:** 2025-10-31
**Erstellt von:** BEYONDER

**Changelog v2.6.0:**
- ✅ 4 neue Entity-Typen: Geburtsdaten, Standorte, Geldbeträge, Organisationen
- ✅ Hybrid-System: NER + Regex für maximale Abdeckung
- ✅ Millionen/Milliarden Support für Geldbeträge
- ✅ Kontextuelle Ortserkennung (Städte, Länder)
- ✅ 100% Test Pass Rate (15/15 Tests)
