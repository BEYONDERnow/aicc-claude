// Test: Macht 'gi' Flag character classes case-insensitive?

const text = "DATEN";

// Mit gi Flag
const patternGI = /[A-Z][a-z]+/gi;
console.log("Pattern /[A-Z][a-z]+/gi matches 'DATEN':", patternGI.test("DATEN"));

// Ohne gi Flag  
const pattern = /[A-Z][a-z]+/g;
console.log("Pattern /[A-Z][a-z]+/g matches 'DATEN':", pattern.test("DATEN"));

// Test mit echtem Text
const testText = "KONTAKTDATEN";
const testPattern = /KONTAKT([A-Z][a-z]+)/gi;
const match = testPattern.exec(testText);
console.log("\nTest 'KONTAKTDATEN' with /KONTAKT([A-Z][a-z]+)/gi:");
console.log("Match:", match);
if (match) console.log("Captured:", match[1]);
