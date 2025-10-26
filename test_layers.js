// Test welcher Layer "DATEN" erkennt

const text = "=== KONTAKTDATEN ===\n\nHans Peter";

// Layer 2: detectByLexicon Pattern
const lexiconPattern = /[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜÁÉÍÓÚÝ][a-zäöüàâæçéèêëïîôœùûüßáéíóúý-]+/g;
console.log("Layer 2 (Lexicon) matches:", text.match(lexiconPattern));

// Layer 3: detectByCapitalization Pattern  
const capPattern = /\b([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+(?:\s+[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+){1,2})\b/g;
console.log("Layer 3 (Capitalization) matches:", text.match(capPattern));

// Layer 4: detectCompoundNames Pattern
const compoundPattern = /\b([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß]+-[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüß-]+)\b/g;
console.log("Layer 4 (Compound) matches:", text.match(compoundPattern));

// Test ALL-CAPS
console.log("\n=== ALL-CAPS Tests ===");
console.log("'DATEN' matches lexicon pattern:", lexiconPattern.test("DATEN"));
console.log("'Daten' matches lexicon pattern:", /[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜÁÉÍÓÚÝ][a-zäöüàâæçéèêëïîôœùûüßáéíóúý-]+/g.test("Daten"));
