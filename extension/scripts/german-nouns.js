/**
 * German Nouns Database (Top Frequency)
 * Kuratierte Liste häufiger deutscher Substantive
 *
 * Quellen:
 * - Linguistic frequency data
 * - User-reported false positives
 * - Common German nouns from various domains
 *
 * Zweck: Filtern von False Positives bei Namen-Erkennung
 * "Video" ist Nomen → kein Name
 * "Jean" ist NICHT in Liste → möglicherweise Name
 */

export const GERMAN_NOUNS = new Set([
  // A
  'Abend', 'Abteilung', 'Adresse', 'Adressen', 'Anfang', 'Anfrage', 'Angebot',
  'Angelegenheit', 'Anmeldung', 'Antwort', 'Anwendung', 'App', 'Arbeit',
  'Arbeiten', 'Art', 'Artikel', 'Aufgabe', 'Aufgaben', 'Aufnahme', 'Auge',
  'Augen', 'Ausbildung', 'Ausdruck', 'Ausnahme', 'Aussage', 'Ausstellung',
  'Auswahl', 'Auto', 'Autor',

  // B
  'Band', 'Bank', 'Basis', 'Baum', 'Bedeutung', 'Bedingung', 'Befehl',
  'Begriff', 'Beispiel', 'Beitrag', 'Benutzer', 'Benutzerin', 'Beratung',
  'Bereich', 'Berg', 'Bericht', 'Beruf', 'Beschreibung', 'Besuch', 'Besucher',
  'Betrag', 'Betrieb', 'Bewegung', 'Bewerbung', 'Bezeichnung', 'Beziehung',
  'Bibliothek', 'Bild', 'Bilder', 'Bildung', 'Brief', 'Browser', 'Buch',
  'Bücher', 'Buchstabe', 'Button',

  // C
  'Chance', 'Chat', 'Check', 'Chrome', 'Cloud', 'Code', 'Computer', 'Container',

  // D
  'Darstellung', 'Datei', 'Dateien', 'Daten', 'Datenbank', 'Datum', 'Design',
  'Detail', 'Details', 'Dienst', 'Ding', 'Dinge', 'Direktor', 'Diskussion',
  'Dokument', 'Dokumentation', 'Download',

  // E
  'Ebene', 'Edition', 'Eigenschaft', 'Einkauf', 'Einrichtung', 'Einsatz',
  'Eintrag', 'Element', 'Elemente', 'Ende', 'Energie', 'Entwicklung',
  'Ereignis', 'Erfahrung', 'Erfolg', 'Ergebnis', 'Ergebnisse', 'Erhalt',
  'Erklärung', 'Erlaubnis', 'Error', 'Ersteller', 'Erstellung', 'Erwartung',
  'Essen', 'Event', 'Extension',

  // F
  'Fach', 'Fähigkeit', 'Fall', 'Fälle', 'Familie', 'Farbe', 'Fehler', 'Feld',
  'Felder', 'Fenster', 'Fest', 'Figur', 'File', 'Film', 'Firma', 'Fläche',
  'Folge', 'Form', 'Format', 'Forschung', 'Fortschritt', 'Forum', 'Foto',
  'Frage', 'Fragen', 'Frau', 'Frauen', 'Freiheit', 'Freund', 'Frontend', 'Funktion',

  // G
  'Ganze', 'Ganzen', 'Garantie', 'Garten', 'Gebäude', 'Gebiet', 'Gebrauch',
  'Gedanke', 'Geld', 'Gelegenheit', 'Gemeinde', 'Gemeinschaft', 'Gericht',
  'Gerät', 'Geschäft', 'Geschichte', 'Geschwindigkeit', 'Gesellschaft',
  'Gesetz', 'Gespräch', 'Gestalt', 'Gesundheit', 'Gewicht', 'Gewinn',
  'Glas', 'Glück', 'Grad', 'Grafik', 'Grenze', 'Größe', 'Grund', 'Gründe',
  'Gruppe', 'Gruß',

  // H
  'Haar', 'Haare', 'Hälfte', 'Halle', 'Haltung', 'Hand', 'Hände', 'Handel',
  'Handlung', 'Haus', 'Häuser', 'Herr', 'Herren', 'Herz', 'Hilfe', 'Himmel',
  'Hinweis', 'Homepage', 'Hotel',

  // I
  'Icon', 'Idee', 'Ideen', 'Image', 'Import', 'Index', 'Info', 'Information',
  'Informationen', 'Inhalt', 'Inhalte', 'Input', 'Institut', 'Interface',
  'Internet', 'Interview',

  // J
  'Jahr', 'Jahre', 'Jahrhundert', 'Job',

  // K
  'Kampf', 'Kapitel', 'Karte', 'Karten', 'Kategorie', 'Kauf', 'Kind', 'Kinder',
  'Kirche', 'Klasse', 'Klick', 'Kommentar', 'Kommunikation', 'Komponente',
  'Konflikt', 'Kontrolle', 'Konzept', 'Kopf', 'Körper', 'Kosten', 'Kraft',
  'Kreis', 'Kredit', 'Kreditkarte', 'Krieg', 'Kultur', 'Kunde', 'Kunden',
  'Kunst', 'Kurs',

  // L
  'Laden', 'Lage', 'Land', 'Länder', 'Landschaft', 'Länge', 'Layout', 'Leben',
  'Lehrer', 'Lehrerin', 'Leistung', 'Leitung', 'Lern', 'Library', 'Licht',
  'Liebe', 'Lied', 'Link', 'Liste', 'Literatur', 'Login', 'Loop', 'Lösung',
  'Luft',

  // M
  'Macht', 'Mail', 'Maß', 'Maßnahme', 'Material', 'Media', 'Medium', 'Meer',
  'Meinung', 'Mensch', 'Menschen', 'Menge', 'Merkmal', 'Methode', 'Minute',
  'Minuten', 'Mitarbeiter', 'Mitglied', 'Mittel', 'Mitteilung', 'Modal',
  'Modell', 'Modul', 'Möglichkeit', 'Moment', 'Monat', 'Monate', 'Morgen', 'Musik',

  // N
  'Nachricht', 'Nachrichten', 'Nähe', 'Name', 'Namen', 'Natur', 'Netz',
  'Niveau', 'Note', 'Notiz', 'Nummer', 'Nutzung', 'Nutzer',

  // O
  'Objekt', 'Ort', 'Orte', 'Output',

  // P
  'Paar', 'Page', 'Papier', 'Parameter', 'Partei', 'Partner', 'Person',
  'Personen', 'Pflicht', 'Phase', 'Platz', 'Plugin', 'Politik', 'Position',
  'Post', 'Praxis', 'Preis', 'Presse', 'Prinzip', 'Problem', 'Probleme',
  'Produkt', 'Produkte', 'Produktion', 'Profil', 'Programm', 'Programme',
  'Projekt', 'Projekte', 'Prompt', 'Protokoll', 'Prozent', 'Prozess', 'Prüfung',
  'Punkt', 'Punkte',

  // Q
  'Qualität', 'Quelle',

  // R
  'Rahmen', 'Rand', 'Raum', 'Räume', 'Reaktion', 'Recht', 'Rechte', 'Rechnung',
  'Rede', 'Referenz', 'Regel', 'Regeln', 'Regierung', 'Region', 'Reihe',
  'Reise', 'Remote', 'Repository', 'Ressource', 'Resultat', 'Richtung', 'Risiko', 'Rolle', 'Route',

  // S
  'Sache', 'Sachen', 'Satz', 'Schicht', 'Schiff', 'Schritt', 'Schritte',
  'Schule', 'Schulung', 'Schüler', 'Script', 'Section', 'Seite', 'Seiten',
  'Sekunde', 'Sekunden', 'Sensor', 'Server', 'Service', 'Setup', 'Sicherheit',
  'Sinn', 'Situation', 'Sitz', 'Software', 'Sohn', 'Sommer', 'Sortierung',
  'Sozial', 'Spiel', 'Sprache', 'Staat', 'Staaten', 'Stadt', 'Städte',
  'Stand', 'Start', 'Stelle', 'Stellung', 'Stimme', 'Stock', 'Stoff', 'Story',
  'Straße', 'Struktur', 'Stück', 'Stücke', 'Student', 'Studie', 'Studium',
  'Stufe', 'Stunde', 'Stunden', 'Style', 'Suche', 'System', 'Systeme',

  // T
  'Tabelle', 'Tag', 'Tage', 'Taste', 'Task', 'Tasks', 'Tätigkeit', 'Team',
  'Technik', 'Teil', 'Teile', 'Teilnahme', 'Teilnehmer', 'Telefon', 'Template',
  'Termin', 'Test', 'Text', 'Texte', 'Thema', 'Theorie', 'Tier', 'Tiere',
  'Tisch', 'Titel', 'Tochter', 'Tod', 'Tool', 'Tor', 'Training', 'Transkript',
  'Transkripts', 'Typ', 'Typen',

  // U
  'Überblick', 'Übersicht', 'Übung', 'Umfang', 'Umgebung', 'Umstand',
  'Umstände', 'Umsatz', 'Umwelt', 'Universität', 'Unternehmen', 'Unterschied',
  'Untersuchung', 'Unterstützung', 'Update', 'Upload', 'Ursache', 'Urteil',

  // V
  'Variante', 'Vater', 'Verband', 'Verbindung', 'Verfahren', 'Verfügung',
  'Vergleich', 'Verhalten', 'Verhältnis', 'Verkauf', 'Verkehr', 'Verlauf',
  'Vermögen', 'Version', 'Versuch', 'Vertrag', 'Vertrauen', 'Vertretung',
  'Vertreter', 'Verwaltung', 'Verwendung', 'Video', 'View', 'Volk',
  'Vollständig', 'Vorbereitung', 'Vorgang', 'Vorhaben', 'Vorschlag',
  'Vorschläge', 'Vorschrift', 'Vorsitz', 'Vorstellung', 'Vorteil', 'Vorwort',

  // W
  'Wahl', 'Wahrheit', 'Wald', 'Wand', 'Ware', 'Wasser', 'Weg', 'Wege',
  'Weise', 'Welt', 'Werk', 'Werke', 'Wert', 'Werte', 'Wesen', 'Wetter',
  'Wettbewerb', 'Widget', 'Wind', 'Winter', 'Wirkung', 'Wirtschaft',
  'Wissenschaft', 'Woche', 'Wochen', 'Wohnung', 'Wort', 'Wörter', 'Wunsch',

  // Z
  'Zahl', 'Zahlen', 'Zeit', 'Zeiten', 'Zeile', 'Zeilen', 'Zeitung',
  'Zeitschrift', 'Zentrum', 'Zeug', 'Zeugnis', 'Ziel', 'Ziele', 'Zimmer',
  'Zugang', 'Zukunft', 'Zustand', 'Zusammenarbeit', 'Zusammenhang', 'Zweck'
]);

/**
 * Deutsche Nomen-Suffixe (Wortbildungs-Endungen)
 * Wörter mit diesen Endungen sind typischerweise Substantive
 */
export const GERMAN_NOUN_SUFFIXES = [
  // Häufigste Nomen-Suffixe
  'ung',      // Bildung, Meinung, Zeitung
  'heit',     // Freiheit, Gesundheit, Schönheit
  'keit',     // Möglichkeit, Tätigkeit, Geschwindigkeit
  'schaft',   // Gesellschaft, Wirtschaft, Wissenschaft
  'tum',      // Christentum, Eigentum, Wachstum
  'nis',      // Ergebnis, Bedürfnis, Verhältnis
  'tion',     // Information, Kommunikation, Produktion
  'sion',     // Diskussion, Version, Dimension
  'ität',     // Qualität, Quantität, Universität
  'enz',      // Intelligenz, Kompetenz, Differenz
  'anz',      // Toleranz, Distanz, Instanz
  'ur',       // Kultur, Natur, Struktur
  'ie',       // Theorie, Philosophie, Energie
  'ik',       // Politik, Musik, Technik
  'ismus',    // Kapitalismus, Tourismus, Optimismus

  // Diminutive
  'chen',     // Mädchen, Häuschen, Märchen
  'lein',     // Fräulein, Büchlein, Tischlein

  // Berufe & Personen
  'er',       // Lehrer, Arbeiter, Computer
  'erin',     // Lehrerin, Arbeiterin, Nutzerin
  'ler',      // Künstler, Sportler, Wissenschaftler
  'ling',     // Frühling, Lehrling, Schmetterling

  // Abstrakte Konzepte
  'sal',      // Schicksal
  'tel',      // Viertel, Drittel
  'tät',      // Universität, Aktivität

  // Tech/Business (moderne Entlehnungen)
  'ware',     // Software, Hardware,Ware
  'werk',     // Netzwerk, Kunstwerk, Handwerk
];

/**
 * Prüft ob ein Wort ein deutsches Nomen ist
 * @param {string} word - Das zu prüfende Wort
 * @returns {boolean} true wenn Nomen, false sonst
 */
export function isGermanNoun(word) {
  if (!word || word.length < 2) return false;

  // 1. Direkt in Nomen-DB
  if (GERMAN_NOUNS.has(word)) return true;

  // 2. Prüfe Nomen-Suffix
  const lowerWord = word.toLowerCase();
  for (const suffix of GERMAN_NOUN_SUFFIXES) {
    if (lowerWord.endsWith(suffix)) {
      // Zusätzliche Prüfung: Mindestlänge (nicht nur Suffix)
      if (word.length > suffix.length + 2) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Prüft ob ein Bindestrich-Wort ein Nomen-Kompositum ist
 * Beispiel: "Video-Transkripts" → beide Teile sind Nomen → true
 * @param {string} word - Das Bindestrich-Wort
 * @param {Function} isName - Optional: Funktion um zu prüfen ob ein Name (isFirstName oder isLastName)
 * @returns {boolean} true wenn Nomen-Kompositum, false sonst
 *
 * v2.4.1 FIX: Prüfe Namen ZUERST, bevor Nomen geprüft werden
 * - "Hans-Peter": Beide sind Namen (trotz "-er" Suffix) → KEIN Nomen
 * - "Video-Transkripts": "Video" ist Nomen → Nomen-Kompositum
 */
export function isHyphenatedNoun(word, isName = null) {
  if (!word.includes('-')) return false;

  const parts = word.split('-');

  // Filtere sehr kurze Teile (z.B. "k-Kreditkarten")
  if (parts.some(part => part.length < 2)) return true; // Wahrscheinlich Nomen

  // v2.4.1: ZUERST prüfen ob ALLE Teile Namen sind (wenn isName-Funktion gegeben)
  // Falls ja: Dann ist es EIN NAME, kein Nomen!
  if (isName && parts.every(part => part.length >= 3 && isName(part))) {
    return false; // Alle Teile sind Namen → KEIN Nomen-Kompositum
  }

  // Wenn MINDESTENS EIN Teil ein bekanntes Nomen ist → Kompositum ist Nomen
  // "Video-Transkripts": Video ✅ → Nomen
  // "Jean-Pierre": Jean ❌, Pierre ❌ (aber im obigen Check als Name erkannt) → kein Nomen
  return parts.some(part => isGermanNoun(part));
}
