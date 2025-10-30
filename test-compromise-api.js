/**
 * Test: Welche Methoden sind in Compromise.js verfügbar?
 */

import nlp from 'compromise';

const text = "John Smith was born on March 15, 1985 in New York. He earned 5 million dollars at Google Inc.";

console.log('Testing Compromise.js API\n');
console.log('Text:', text, '\n');

const doc = nlp(text);

// Test alle Methoden
const methods = [
  'people',
  'places',
  'dates',
  'money',
  'organizations',
  'numbers',
  'match'
];

methods.forEach(method => {
  try {
    const result = doc[method]();
    if (result && typeof result.json === 'function') {
      const json = result.json();
      console.log(`✅ .${method}(): ${JSON.stringify(json.slice(0, 2))}`);
    } else if (result) {
      console.log(`⚠️  .${method}(): Exists but no .json() method`);
    }
  } catch (error) {
    console.log(`❌ .${method}(): ${error.message}`);
  }
});

// Test match patterns
console.log('\n--- Testing .match() patterns ---\n');

const patterns = [
  '#Date',
  '#Money',
  '#Place',
  '#Organization',
  '#Value'
];

patterns.forEach(pattern => {
  try {
    const result = doc.match(pattern).json();
    console.log(`${pattern}: ${result.length > 0 ? JSON.stringify(result) : 'No matches'}`);
  } catch (error) {
    console.log(`${pattern}: Error - ${error.message}`);
  }
});
