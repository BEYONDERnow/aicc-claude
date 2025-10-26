const text = `=== KONTAKTDATEN ===

Hans Peter Tristan Andres

=== FINANZDATEN ===

=== NAMENSLISTE (ohne Kontext) ===`;

// Pattern aus detectByCapitalization (Zeile 301)
// Matched 2-3 kapitalisierte Wörter hintereinander
const capPattern = /\b([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+(?:\s+[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+){1,2})\b/g;

console.log("=== Capitalization Pattern Matches ===");
let match;
while ((match = capPattern.exec(text)) !== null) {
  const name = match[1];
  console.log(`Matched: "${name}"`);
}

// Test: Matched "KONTAKTDATEN" oder "DATEN"?
console.log("\n=== Einzeltest ===");
console.log("'KONTAKTDATEN' matched:", /\b([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+)/.test("KONTAKTDATEN"));
console.log("'DATEN' matched:", /\b([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+)/.test("DATEN"));
console.log("'Daten' matched:", /\b([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+)/.test("Daten"));
