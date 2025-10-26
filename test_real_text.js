const text = `=== KONTAKTDATEN ===

Hans Peter Tristan Andres chris@beyonder.ch

=== FINANZDATEN ===

Bankverbindung: IBAN: CH93

=== NAMENSLISTE (ohne Kontext) ===

Giuseppe Verdi

Kontext-Name: Name: Peter Mueller`;

// Test Pattern aus detectByLexicon (Zeile 218)
const lexiconPattern = /[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜÁÉÍÓÚÝ][a-zäöüàâæçéèêëïîôœùûüßáéíóúý-]+/g;

console.log("=== Lexicon Pattern Matches ===");
let match;
while ((match = lexiconPattern.exec(text)) !== null) {
  const word = match[0];
  const pos = match.index;
  
  // Simuliere v2.3.0 Filter
  const isAllCaps = (word === word.toUpperCase() && word.length > 2);
  const isLowercase = (word === word.toLowerCase());
  const blacklist = ['CH', 'EUR', 'USD', 'CHF', 'Name', 'Tel'];
  const isBlacklisted = blacklist.includes(word);
  
  console.log(`"${word}" (pos: ${pos}) - ALL-CAPS: ${isAllCaps}, lowercase: ${isLowercase}, blacklisted: ${isBlacklisted}`);
}
