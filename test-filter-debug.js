import { CompromiseNER } from './extension/scripts/compromise-ner.js';

const ner = new CompromiseNER();

const testCases = [
  'UBS',
  'IBM',
  'Microsoft',
  'Google Switzerland',
  'über'
];

console.log('\nTesting Stopword/Technical Filter:\n');

for (const text of testCases) {
  const isFiltered = ner.isStopwordOrTechnical(text);
  const length = text.length;
  const isAcronym = /^[A-Z]{2,4}$/.test(text);

  console.log(`"${text}":`);
  console.log(`  Length: ${length}`);
  console.log(`  Is Acronym: ${isAcronym}`);
  console.log(`  Is Filtered (stopword/technical): ${isFiltered}`);
  console.log(`  Would pass length filter (<4): ${length >= 4 || isAcronym}`);
  console.log(`  FINAL: ${!isFiltered && (length >= 4 || isAcronym) ? '✅ PASS' : '❌ BLOCKED'}`);
  console.log('');
}
