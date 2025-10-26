const text = `=== KONTAKTDATEN ===

Hans Peter`;

// Simuliere detectByContext Pattern (Zeile 148-151)
const markers = ['Name', 'Vorname', 'Kontakt'];
const markerPattern = markers.map(m => m.replace(/\./g, '\\.')).join('|');

const pattern = new RegExp(
  `(?:${markerPattern})\\s*[:]?\\s*([A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüßáéíóú-]+(?:\\s+[A-ZÄÖÜÀÂÆÇÉÈÊËÏÎÔŒÙÛÜ][a-zäöüàâæçéèêëïîôœùûüßáéíóú-]+){0,2})`,
  'gi'  // CASE-INSENSITIVE!
);

console.log("=== Context Pattern Matches ===");
console.log("Pattern:", pattern);

let match;
while ((match = pattern.exec(text)) !== null) {
  console.log(`Full match: "${match[0]}"`);
  console.log(`Captured name: "${match[1]}"`);
  console.log(`Position: ${match.index}`);
  console.log('---');
}

// Test ob "KONTAKT" den Marker "Kontakt" matched (case-insensitive)
console.log("\n=== Case-Insensitive Test ===");
console.log("'KONTAKT' matches /Kontakt/gi:", /Kontakt/gi.test("KONTAKT"));
console.log("'kontakt' matches /Kontakt/gi:", /Kontakt/gi.test("kontakt"));
