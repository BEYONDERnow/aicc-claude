# AI Compliance Checker - Validierungsreport Template

## Testprompt

```
Hallo Team,

ich möchte euch über die neuen Mitarbeiter informieren:

=== KONTAKTDATEN ===

Hans Peter Tristan Andres chris@beyonder.ch michael.mueller@gmail.com

Telefon: 079 328 70 97 Mobile: +41 79 328 70 70 Alternative: +41 (0)79 328 70 70 Festnetz: +41 (0) 44 123 45 67

Deutsche Kollegen: Thomas Schmidt Tel: +49 30 12345678 Email: thomas.schmidt@firma.de

=== ADRESSEN ===

Büro Zürich: Bahnhofstrasse 123, 8001 Zürich PLZ: 8000, 6673, 7269

Büro Bern: Bundesplatz 1, 3011 Bern

=== FINANZDATEN ===

Gehalt: 120'000 CHF Bonus: 15'000 CHF Spesen: 2'308 CHF Reisekosten: 1.500 € Budget: 250 CHF Projektkosten: CHF 50'000 Investition: $ 10,000.00 Umsatz: 2.981 €

Bankverbindung: IBAN: CH93 0076 2011 6238 5295 7 Kreditkarte: 4532 1234 5678 9010

=== PERSONALDATEN ===

AHV-Nummer: 756.6673.7269.03 Geburtsdatum: geboren 15.03.1985 Reisepass: CH1234567

=== TECHNISCHE DATEN ===

Server IP: 192.168.1.1 API Key: sk_live_51234567890abcdefghijklmnop Passwort: MeinSicheresPasswort123!

Test IP (ungültig): 046.645.424.684

=== VERTRAULICH ===

Dieses Dokument ist STRENG VERTRAULICH und nur für interne Zwecke bestimmt.

Salary Information: Lohn: 8'500 CHF Verdienst: 95'000 CHF pro Jahr

=== NAMENSLISTE (ohne Kontext) ===

Giuseppe Verdi Marie Curie Albert Einstein Chris Beyeler Michael Schmid Sarah Connor Max Mustermann

=== GEMISCHTE FORMATE ===

Schweizer Mobile: 076 123 45 67 International: +1 555 123 4567 Deutschland: 030 12345678

Beträge: 200 CHF 99.99 EUR $ 1,500.00 Fr. 2'500 € 3.450,50

=== EDGE CASES ===

Jahr (kein PLZ): 1980 Zahl: 046.645.424.684 (weder IP noch Telefon) Artikel-Test: Die Zukunft ist digital (kein Name!) Kontext-Name: Name: Peter Mueller

Bitte behandelt diese Informationen vertraulich.

Grüsse, Max
```

---

## Ground Truth - Was SOLLTE erkannt werden

### ✅ KRITISCH (9 Erkennungen erwartet)

| # | Typ | Wert | Erwartete Einstufung | Kommentar |
|---|-----|------|----------------------|-----------|
| 1 | E-Mail | `chris@beyonder.ch` | Kritisch | Echte Email |
| 2 | E-Mail | `michael.mueller@gmail.com` | Kritisch | Echte Email |
| 3 | E-Mail | `thomas.schmidt@firma.de` | Kritisch | Echte Email |
| 4 | IBAN | `CH93 0076 2011 6238 5295 7` | Kritisch | Echte IBAN |
| 5 | Kreditkarte | `4532 1234 5678 9010` | Kritisch | Echte Kreditkartennummer |
| 6 | AHV-Nummer | `756.6673.7269.03` | Kritisch | Schweizer Sozialversicherungsnummer |
| 7 | Reisepass | `CH1234567` | Kritisch | NUR die Nummer, OHNE "Reisepass:" |
| 8 | API Key | `sk_live_51234567890abcdefghijklmnop` | Kritisch | Stripe Live API Key |
| 9 | Passwort | `MeinSicheresPasswort123!` | Kritisch | NUR Passwort, OHNE "Passwort:" und OHNE "Test" Suffix! |

### ⚠️ WARNUNG - Namen (14 Erkennungen erwartet)

| # | Wert | Erwartete Einstufung | Kommentar |
|---|------|----------------------|-----------|
| 10 | `Hans` | Warnung | Einzelner Vorname |
| 11 | `Peter` | Warnung | Einzelner Vorname |
| 12 | `Tristan` | Warnung | Einzelner Vorname |
| 13 | `Andres` | Warnung | Einzelner Vorname (OHNE "chris"!) |
| 14 | `Thomas Schmidt` | Warnung | Vollständiger Name |
| 15 | `Giuseppe` | Warnung | Einzelner Vorname |
| 16 | `Verdi` | Warnung | Einzelner Nachname |
| 17 | `Marie` | Warnung | Einzelner Vorname |
| 18 | `Curie` | Warnung | Einzelner Nachname |
| 19 | `Albert` | Warnung | Einzelner Vorname |
| 20 | `Einstein` | Warnung | Einzelner Nachname |
| 21 | `Chris` | Warnung | Einzelner Vorname |
| 22 | `Beyeler` | Warnung | Einzelner Nachname |
| 23 | `Michael` | Warnung | Einzelner Vorname |
| 24 | `Schmid` | Warnung | Einzelner Nachname |
| 25 | `Sarah` | Warnung | Einzelner Vorname |
| 26 | `Connor` | Warnung | Einzelner Nachname |
| 27 | `Max` | Warnung | 2x: Mustermann + Unterschrift |
| 28 | `Mustermann` | Warnung | Nachname |
| 29 | `Peter` | Warnung | Aus "Name: Peter Mueller" |
| 30 | `Mueller` | Warnung | Aus "Name: Peter Mueller" |

**Alternativ:** Multi-Word Namen wie `"Hans Peter"`, `"Giuseppe Verdi"`, etc. (dann ~10-12 Erkennungen)

### ⚠️ WARNUNG - Adressen (2 Erkennungen erwartet)

| # | Wert | Erwartete Einstufung | Kommentar |
|---|------|----------------------|-----------|
| 31 | `Bahnhofstrasse 123, 8001 Zürich` | Warnung | VOLLSTÄNDIGE Adresse |
| 32 | `Bundesplatz 1, 3011 Bern` | Warnung | VOLLSTÄNDIGE Adresse |

### ⚠️ WARNUNG - PLZ (4 Erkennungen erwartet)

| # | Wert | Erwartete Einstufung | Kommentar |
|---|------|----------------------|-----------|
| 33 | `8000` | Warnung | Aus "PLZ: 8000, 6673, 7269" |
| 34 | `6673` | Warnung | Aus "PLZ: 8000, 6673, 7269" |
| 35 | `7269` | Warnung | Aus "PLZ: 8000, 6673, 7269" |
| 36 | `3011` | Warnung | Aus "Bundesplatz 1, 3011 Bern" |
| 37 | `8001` | Warnung | Aus "Bahnhofstrasse 123, 8001 Zürich" |

**HINWEIS:** `8001` ist möglicherweise schon in der Adresse enthalten → 4 statt 5 Erkennungen

### ⚠️ WARNUNG - Telefonnummern (9 Erkennungen erwartet)

| # | Wert | Erwartete Einstufung | Kommentar |
|---|------|----------------------|-----------|
| 38 | `079 328 70 97` | Warnung | Schweizer Mobile |
| 39 | `+41 79 328 70 70` | Warnung | Schweizer Mobile (international) |
| 40 | `+41 (0)79 328 70 70` | Warnung | Schweizer Mobile (mit Klammern) |
| 41 | `+41 (0) 44 123 45 67` | Warnung | Schweizer Festnetz |
| 42 | `+49 30 12345678` | Warnung | Deutsche Telefonnummer |
| 43 | `076 123 45 67` | Warnung | Schweizer Mobile |
| 44 | `+1 555 123 4567` | Warnung | Internationale Nummer (USA) |
| 45 | `030 12345678` | Warnung | Deutsche Telefonnummer |

**HINWEIS:** `+41 (0) 44 123 45 67` könnte als unvollständig erkannt werden

### ⚠️ WARNUNG - Geldbeträge (13+ Erkennungen erwartet)

| # | Wert | Erwartete Einstufung | Kommentar |
|---|------|----------------------|-----------|
| 46 | `120'000 CHF` | Warnung | CHF mit Apostroph |
| 47 | `15'000 CHF` | Warnung | CHF mit Apostroph |
| 48 | `2'308 CHF` | Warnung | CHF mit Apostroph |
| 49 | `1.500 €` | Warnung | Euro mit Punkt |
| 50 | `250 CHF` | Warnung | Einfacher Betrag |
| 51 | `CHF 50'000` | Warnung | CHF vorangestellt |
| 52 | `$ 10,000.00` | Warnung | Dollar mit Komma |
| 53 | `2.981 €` | Warnung | Euro mit Punkt |
| 54 | `8'500 CHF` | Warnung | CHF mit Apostroph |
| 55 | `95'000 CHF` | Warnung | CHF mit Apostroph |
| 56 | `200 CHF` | Warnung | Einfacher Betrag |
| 57 | `99.99 EUR` | Warnung | Euro mit Punkt |
| 58 | `$ 1,500.00` | Warnung | Dollar mit Komma |
| 59 | `Fr. 2'500` | Warnung | Franken abgekürzt |
| 60 | `€ 3.450,50` | Warnung | Euro mit Punkt UND Komma |

### ⚠️ WARNUNG - Gehaltsangaben (3 Erkennungen erwartet)

| # | Wert | Erwartete Einstufung | Kommentar |
|---|------|----------------------|-----------|
| 61 | `Gehalt: 120'000` | Warnung | Mit "Gehalt:"-Prefix |
| 62 | `Lohn: 8'500` | Warnung | Mit "Lohn:"-Prefix |
| 63 | `Verdienst: 95'000` | Warnung | Mit "Verdienst:"-Prefix |

### ⚠️ WARNUNG - Sonstige (4 Erkennungen erwartet)

| # | Wert | Erwartete Einstufung | Kommentar |
|---|------|----------------------|-----------|
| 64 | `192.168.1.1` | Warnung | IP-Adresse |
| 65 | `15.03.1985` | Warnung | Geburtsdatum (NUR das Datum!) |
| 66 | `VERTRAULICH` | Warnung | Vertraulichkeits-Kennzeichnung |
| 67 | `STRENG VERTRAULICH` | Warnung | Vertraulichkeits-Kennzeichnung |

---

## ❌ SOLLTE NICHT erkannt werden (False Positives)

| # | Wert | Grund | Kommentar |
|---|------|-------|-----------|
| ❌ | `KONTAKTDATEN` | ALL-CAPS | Kein Name, Überschrift |
| ❌ | `ADRESSEN` | ALL-CAPS | Kein Name, Überschrift |
| ❌ | `FINANZDATEN` | ALL-CAPS | Kein Name, Überschrift |
| ❌ | `PERSONALDATEN` | ALL-CAPS | Kein Name, Überschrift |
| ❌ | `VERTRAULICH` als Name | Kontext | Ist Kennzeichnung, kein Name |
| ❌ | `NAMENSLISTE` | ALL-CAPS | Kein Name, Überschrift |
| ❌ | `DATEN` | Wortteil | Teil von "KONTAKTDATEN" etc. |
| ❌ | `ZDATEN` | Wortteil | Teil von "FINANZDATEN" |
| ❌ | `CH` | Länderkürzel | Blacklist |
| ❌ | `Name` | Blacklist | Das Wort "Name" aus "Name: Peter Mueller" |
| ❌ | `Tel` | Blacklist | Abkürzung, kein Name |
| ❌ | `Email` | Blacklist | Das Wort "Email", kein Name |
| ❌ | `Team` | Blacklist | Aus "Hallo Team" |
| ❌ | `Die` | Artikel | Aus "Die Zukunft ist digital" |
| ❌ | `Artikel-Test` | Edge Case | Explizit KEIN Name! |
| ❌ | `delt diese Informationen` | Wortteil | Teil von "behandelt diese" |
| ❌ | `kverbindung` | Wortteil | Teil von "Bankverbindung" |
| ❌ | `chris` in "Andres chris" | lowercase | Email-Teil, kein Name |
| ❌ | `Bitte` | Blacklist | Aus "Bitte behandelt" |
| ❌ | `1980` | Jahr | Explizit: "Jahr (kein PLZ): 1980" |
| ❌ | `1985` | Geburtsdatum | Teil vom Datum "15.03.1985" |
| ❌ | `046.645.424.684` | Ungültig | Explizit: "(weder IP noch Telefon)" |
| ❌ | `0076 2011 6238` | IBAN-Teil | Teil der IBAN, NICHT Telefonnummer! |
| ❌ | `Bahnhofstrasse` ALLEINE | Unvollständig | Nur wenn OHNE Nummer/PLZ/Ort |
| ❌ | `Bundesplatz` ALLEINE | Unvollständig | Nur wenn OHNE Nummer/PLZ/Ort |
| ❌ | Suffix `Test` bei Passwort | Fehler | "MeinSicheresPasswort123!Test" → sollte "MeinSicheresPasswort123!" sein |
| ❌ | Suffix `Telefon` bei Email | Fehler | "michael.mueller@gmail.comTelefon" → sollte "michael.mueller@gmail.com" sein |

---

## 📊 Erwartete Statistik (Ground Truth)

### Zusammenfassung
- **Kritische Erkennungen:** 9
- **Warnungen:** ~50-60 (abhängig von Namen-Gruppierung)
- **Gesamt:** ~60-70 Erkennungen
- **False Positives sollten:** 0 sein

### Accuracy-Berechnung

**Formel:**
```
True Positives (TP) = Korrekt erkannte Daten
False Positives (FP) = Fälschlich erkannte Daten (siehe Liste oben)
False Negatives (FN) = Übersehene Daten (z.B. fehlende Emails)

Accuracy = TP / (TP + FP + FN)
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
```

**Ziel:**
- Accuracy: ≥ 90%
- Precision: ≥ 95%
- Recall: ≥ 90%

---

## ✅ Validierungsanweisungen

1. **Kopiere tatsächliche Erkennungen** aus dem Tool-Report hierher
2. **Vergleiche mit Ground Truth:**
   - ✅ = Korrekt erkannt (in Ground Truth)
   - ❌ = False Positive (in "SOLLTE NICHT" Liste)
   - ⚠️ = Falsche Einstufung (z.B. Critical statt Warning)
   - 🔴 = False Negative (fehlt im Report, aber in Ground Truth)
3. **Berechne Metriken**
4. **Dokumentiere Probleme**

---

## 🔍 Typische Probleme checken

### Kritische Checks
- [ ] Sind ALLE 3 Emails erkannt?
- [ ] Ist Passwort OHNE "Test" Suffix?
- [ ] Ist Reisepass NUR die Nummer (OHNE "Reisepass:")?
- [ ] Sind Adressen VOLLSTÄNDIG (mit Nummer, PLZ, Ort)?

### False Positive Checks
- [ ] Sind ALL-CAPS Überschriften (KONTAKTDATEN, FINANZDATEN, etc.) NICHT als Namen erkannt?
- [ ] Ist "Name", "Tel", "Email", "Team" NICHT als Name erkannt?
- [ ] Ist "Artikel-Test" NICHT als Name erkannt?
- [ ] Ist "1980" (Jahr) NICHT als PLZ erkannt?
- [ ] Ist "1985" (Geburtsdatum) NICHT als PLZ erkannt?
- [ ] Ist "0076 2011 6238" (IBAN-Teil) NICHT als Telefon erkannt?

### Qualitäts-Checks
- [ ] Sind Multi-Word Namen sinnvoll gruppiert? (z.B. "Thomas Schmidt" statt "Thomas" + "Schmidt")
- [ ] Sind lowercase Teile gefiltert? (z.B. "Andres" statt "Andres chris")
- [ ] Sind Wortteile gefiltert? (z.B. KEIN "delt", "kverbindung", "alysen")

---

## 📝 Report-Format

Nach dem Test, fülle diese Tabelle aus:

| Metrik | Wert | Ziel | Status |
|--------|------|------|--------|
| Total Erkennungen | ? | ~60-70 | ? |
| True Positives | ? | ~60-70 | ? |
| False Positives | ? | 0 | ? |
| False Negatives | ? | 0 | ? |
| **Accuracy** | ?% | ≥90% | ? |
| **Precision** | ?% | ≥95% | ? |
| **Recall** | ?% | ≥90% | ? |

---

**Version:** 2.3.3
**Datum:** 2025-10-26
**Erstellt von:** Claude Code
