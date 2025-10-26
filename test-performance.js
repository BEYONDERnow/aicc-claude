/**
 * Performance Test für Enhanced NER v2.2.1
 * Testet verschiedene Text-Längen
 */

import { EnhancedNERDetector } from './extension/scripts/enhanced-ner.js';

const detector = new EnhancedNERDetector();

console.log('='.repeat(80));
console.log('AI COMPLIANCE CHECKER v2.2.1 - Performance Test');
console.log('='.repeat(80));

// Test-Texte mit verschiedenen Längen
const testCases = [
  {
    name: 'Kurzer Text (100 Zeichen)',
    text: 'Name: Hans Müller\nKontakt: Klaus Schmidt\nVon: Peter Meier\nTelefon: +41 79 123 45 67',
    expectedNames: ['Hans Müller', 'Klaus Schmidt', 'Peter Meier']
  },
  {
    name: 'Mittellanger Text (1000 Zeichen)',
    text: `
      Sehr geehrter Herr Hans Müller,

      vielen Dank für Ihre Anfrage. Ich habe mit Klaus Schmidt und Peter Meier
      gesprochen. Die Termine sind wie folgt:

      - Montag: Treffen mit Franz Horvath
      - Dienstag: Call mit Jean-Luc Dupont
      - Mittwoch: Workshop mit Giovanni Rossi

      Kontaktdaten:
      Hans Müller: +41 79 123 45 67
      Klaus Schmidt: klaus.schmidt@example.com
      Peter Meier: Bahnhofstrasse 123, 8000 Zürich

      Mit freundlichen Grüssen,
      Wolfgang Becker

      P.S. Bitte leiten Sie diese Information auch an Marie-Claire Martin weiter.
    `.repeat(1), // ~1000 Zeichen
    expectedNames: ['Hans Müller', 'Klaus Schmidt', 'Peter Meier', 'Franz Horvath',
                    'Jean-Luc Dupont', 'Giovanni Rossi', 'Wolfgang Becker', 'Marie-Claire Martin']
  },
  {
    name: 'Langer Text (10.000 Zeichen) - Fast Mode',
    text: `
      Sehr geehrter Herr Hans Müller,

      vielen Dank für Ihre Anfrage. Ich habe mit Klaus Schmidt gesprochen.
      Die Details besprechen wir am Montag.

      Mit freundlichen Grüssen,
      Wolfgang Becker
    `.repeat(100), // ~10k Zeichen
    expectedNames: ['Hans Müller', 'Klaus Schmidt', 'Wolfgang Becker']
  },
  {
    name: 'Sehr langer Text (50.000 Zeichen) - Limit Test',
    text: `
      Name: Hans Müller
      Kontakt: Klaus Schmidt
      Von: Peter Meier
    `.repeat(500), // ~50k Zeichen
    expectedNames: ['Hans Müller', 'Klaus Schmidt', 'Peter Meier']
  },
  {
    name: 'Extrem langer Text (100.000 Zeichen) - Truncation Test',
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `.repeat(2000), // ~100k Zeichen
    expectedNames: [] // Keine Namen in Lorem ipsum
  }
];

async function runPerformanceTests() {
  for (const testCase of testCases) {
    const textLength = testCase.text.length;

    console.log('\n' + '-'.repeat(80));
    console.log(`📝 ${testCase.name} (${textLength.toLocaleString()} Zeichen)`);
    console.log('-'.repeat(80));

    // Zeitmessung
    const startTime = performance.now();

    try {
      const names = await detector.detectNames(testCase.text, 'de');

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);

      // Ergebnisse
      const uniqueNames = [...new Set(names.map(n => n.text))];

      console.log(`⏱️  Zeit: ${duration}ms`);
      console.log(`📊 Gefunden: ${uniqueNames.length} Namen`);

      if (uniqueNames.length > 0) {
        console.log(`   Names: ${uniqueNames.slice(0, 5).join(', ')}${uniqueNames.length > 5 ? '...' : ''}`);
      }

      // Performance-Bewertung
      let status = '✅ OK';
      if (duration > 1000) {
        status = '🐌 LANGSAM (>1s)';
      } else if (duration > 500) {
        status = '⚠️  MITTEL (>500ms)';
      } else if (duration > 200) {
        status = '👌 GUT (>200ms)';
      } else {
        status = '🚀 SCHNELL (<200ms)';
      }

      console.log(`🎯 Performance: ${status}`);

      // Erwartungs-Check (nur für Tests mit erwarteten Namen)
      if (testCase.expectedNames.length > 0) {
        const foundExpected = testCase.expectedNames.filter(expected =>
          uniqueNames.some(found => found.includes(expected.split(' ')[0]))
        );
        console.log(`✅ Erwartete Namen gefunden: ${foundExpected.length}/${testCase.expectedNames.length}`);
      }

    } catch (error) {
      console.error('❌ Fehler:', error.message);
    }
  }

  // Zusammenfassung
  console.log('\n' + '='.repeat(80));
  console.log('📈 PERFORMANCE ZUSAMMENFASSUNG');
  console.log('='.repeat(80));
  console.log('✅ Kurze Texte (<1k):     < 50ms erwartet');
  console.log('✅ Mittlere Texte (1-10k): < 200ms erwartet');
  console.log('✅ Lange Texte (10-50k):   < 500ms erwartet (Fast Mode)');
  console.log('✅ Sehr lange (>50k):      Truncation auf 50k');
  console.log('\n🎯 Ziel: Keine Browser-Abstürze, auch bei sehr langen Texten!');
  console.log('='.repeat(80));
}

// Run tests
runPerformanceTests().catch(console.error);
