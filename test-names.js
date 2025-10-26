/**
 * Test Script für Enhanced NER - Alle 8 Länder
 * Tests Namen-Erkennung für DE, AT, CH, FR, IT, EN, SCO, IRL, WAL
 */

import { EnhancedNERDetector } from './extension/scripts/enhanced-ner.js';
import { getLexiconStats } from './extension/scripts/names-lexicon.js';

const detector = new EnhancedNERDetector();

console.log('='.repeat(80));
console.log('AI COMPLIANCE CHECKER v2.2.0 - Enhanced NER Test');
console.log('='.repeat(80));

// Zeige Lexikon-Statistiken
const stats = getLexiconStats();
console.log('\n📊 LEXIKON-STATISTIKEN:');
console.log(`   Vornamen gesamt: ${stats.firstNames}`);
console.log(`   Nachnamen gesamt: ${stats.lastNames}`);
console.log(`   Total Namen: ${stats.total}`);
console.log('\n   Pro Sprache:');
Object.entries(stats.languages).forEach(([lang, count]) => {
  console.log(`     ${lang}: ${count} Namen`);
});

// Test-Fälle für alle 8 Länder
const testCases = [
  // DEUTSCHLAND
  { lang: 'de', text: 'Name: Hans Müller', expected: 'Hans Müller', country: '🇩🇪 DE' },
  { lang: 'de', text: 'Kontakt: Klaus Schmidt arbeitet in Berlin', expected: 'Klaus Schmidt', country: '🇩🇪 DE' },
  { lang: 'de', text: 'Von: Wolfgang Becker', expected: 'Wolfgang Becker', country: '🇩🇪 DE' },

  // ÖSTERREICH
  { lang: 'de', text: 'Herr Franz Horvath aus Wien', expected: 'Franz Horvath', country: '🇦🇹 AT' },
  { lang: 'de', text: 'Johann Kovács meldet sich', expected: 'Johann Kovács', country: '🇦🇹 AT' },

  // SCHWEIZ (Multi-lingual)
  { lang: 'de', text: 'Kontakt: Beat Meier', expected: 'Beat Meier', country: '🇨🇭 CH-DE' },
  { lang: 'fr', text: 'Nom: Jean-Luc Mercier', expected: 'Jean-Luc Mercier', country: '🇨🇭 CH-FR' },
  { lang: 'it', text: 'Nome: Giovanni Rossi', expected: 'Giovanni Rossi', country: '🇨🇭 CH-IT' },

  // FRANKREICH
  { lang: 'fr', text: 'De: Pierre Dubois', expected: 'Pierre Dubois', country: '🇫🇷 FR' },
  { lang: 'fr', text: 'Contact: Marie-Claire Martin', expected: 'Marie-Claire Martin', country: '🇫🇷 FR' },
  { lang: 'fr', text: 'François Bernard travaille ici', expected: 'François Bernard', country: '🇫🇷 FR' },

  // ITALIEN
  { lang: 'it', text: 'Da: Marco Ferrari', expected: 'Marco Ferrari', country: '🇮🇹 IT' },
  { lang: 'it', text: 'Contatto: Giulia Bianchi', expected: 'Giulia Bianchi', country: '🇮🇹 IT' },
  { lang: 'it', text: 'Giuseppe Esposito ha scritto', expected: 'Giuseppe Esposito', country: '🇮🇹 IT' },

  // ENGLAND
  { lang: 'en', text: 'From: John Smith', expected: 'John Smith', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN' },
  { lang: 'en', text: 'Contact: James Williams', expected: 'James Williams', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN' },
  { lang: 'en', text: 'Mr. Robert Johnson', expected: 'Robert Johnson', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 EN' },

  // SCHOTTLAND
  { lang: 'en', text: 'From: Duncan MacLeod', expected: 'Duncan MacLeod', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 SCO' },
  { lang: 'en', text: 'Angus Campbell works here', expected: 'Angus Campbell', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 SCO' },
  { lang: 'en', text: 'Contact: Hamish Fraser', expected: 'Hamish Fraser', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 SCO' },

  // IRLAND
  { lang: 'en', text: 'Name: Seán O\'Brien', expected: 'Seán O\'Brien', country: '🇮🇪 IRL' },
  { lang: 'en', text: 'From: Connor Murphy', expected: 'Connor Murphy', country: '🇮🇪 IRL' },
  { lang: 'en', text: 'Contact: Niall Kelly', expected: 'Niall Kelly', country: '🇮🇪 IRL' },

  // WALES
  { lang: 'en', text: 'Name: Dylan Jones', expected: 'Dylan Jones', country: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 WAL' },
  { lang: 'en', text: 'From: Rhys Williams', expected: 'Rhys Williams', country: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 WAL' },
  { lang: 'en', text: 'Contact: Owen Davies', expected: 'Owen Davies', country: '🏴󠁧󠁢󠁷󠁬󠁳󠁿 WAL' },

  // EDGE CASES
  { lang: 'de', text: 'Hans-Peter Schneider meldet sich', expected: 'Hans-Peter Schneider', country: '🧪 Compound' },
  { lang: 'fr', text: 'Jean-Luc Dupont écrit', expected: 'Jean-Luc Dupont', country: '🧪 Compound' },
  { lang: 'de', text: 'Hans Peter Müller (ohne Bindestrich)', expected: 'Hans Peter Müller', country: '🧪 Multi-word' },
];

// Führe Tests aus
console.log('\n' + '='.repeat(80));
console.log('🧪 NAMEN-ERKENNUNGS-TESTS');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

async function runTests() {
  for (const testCase of testCases) {
    const names = await detector.detectNames(testCase.text, testCase.lang);

    const detected = names.length > 0 ? names[0].text : '(nichts)';
    const success = names.length > 0 && names[0].text === testCase.expected;

    if (success) {
      console.log(`✅ ${testCase.country.padEnd(12)} | "${testCase.expected}" → Erkannt!`);
      passed++;
    } else {
      console.log(`❌ ${testCase.country.padEnd(12)} | Erwartet: "${testCase.expected}", Erkannt: "${detected}"`);
      failed++;
    }
  }

  // Zusammenfassung
  console.log('\n' + '='.repeat(80));
  console.log('📈 TEST-ZUSAMMENFASSUNG');
  console.log('='.repeat(80));
  console.log(`✅ Erfolgreich: ${passed}/${testCases.length}`);
  console.log(`❌ Fehlgeschlagen: ${failed}/${testCases.length}`);

  const successRate = ((passed / testCases.length) * 100).toFixed(1);
  console.log(`\n🎯 Erfolgsrate: ${successRate}%`);

  if (successRate >= 90) {
    console.log('🎉 EXZELLENT! Namen-Erkennung funktioniert hervorragend!');
  } else if (successRate >= 75) {
    console.log('✅ GUT! Namen-Erkennung ist solide.');
  } else {
    console.log('⚠️ VERBESSERUNGSBEDARF! Erfolgsrate < 75%');
  }

  console.log('='.repeat(80));
}

// Run tests
runTests().catch(console.error);
