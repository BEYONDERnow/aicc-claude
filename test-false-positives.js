/**
 * Test False Positives in v2.6.0
 * Prüft, ob häufige deutsche Wörter und technische Begriffe fälschlicherweise erkannt werden
 */

import { ComplianceDetector } from './extension/scripts/detector.js';

const testCases = [
  {
    text: 'ist',
    shouldDetect: false,
    description: 'Häufiges deutsches Wort "ist"'
  },
  {
    text: 'nur',
    shouldDetect: false,
    description: 'Häufiges deutsches Wort "nur"'
  },
  {
    text: 'Thomas Schmidt Tel: 079 123 45 67',
    shouldDetect: true, // Name + Telefon sollten erkannt werden
    description: 'Name mit Telefon-Kontext'
  },
  {
    text: 'den',
    shouldDetect: false,
    description: 'Häufiges deutsches Wort "den"'
  },
  {
    text: 'über',
    shouldDetect: false,
    description: 'Häufiges deutsches Wort "über"'
  },
  {
    text: 'Quality-Assurance',
    shouldDetect: false,
    description: 'Technischer Begriff (nicht sensibel)'
  },
  {
    text: 'Memory-Management',
    shouldDetect: false,
    description: 'Technischer Begriff (nicht sensibel)'
  },
  {
    text: 'Information über',
    shouldDetect: false,
    description: 'Normale deutsche Phrase'
  }
];

async function runTests() {
  const detector = new ComplianceDetector();

  console.log('🔍 Testing False Positives in v2.6.0\n');
  console.log('═'.repeat(70));

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const result = await detector.analyze(testCase.text);
    const hasDetections = result.detections && result.detections.length > 0;

    const testPassed = hasDetections === testCase.shouldDetect;

    if (testPassed) {
      console.log(`✅ PASS: ${testCase.description}`);
      console.log(`   Text: "${testCase.text}"`);
      console.log(`   Detections: ${result.detections?.length || 0}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${testCase.description}`);
      console.log(`   Text: "${testCase.text}"`);
      console.log(`   Expected detections: ${testCase.shouldDetect ? 'YES' : 'NO'}`);
      console.log(`   Actual detections: ${hasDetections ? 'YES' : 'NO'} (${result.detections?.length || 0})`);

      if (hasDetections) {
        console.log(`   Detected entities:`);
        result.detections.forEach(d => {
          console.log(`     - "${d.matched}" (${d.type}, ${d.id})`);
        });
      }
      failed++;
    }
    console.log('');
  }

  console.log('═'.repeat(70));
  console.log(`\n📊 Results: ${passed}/${testCases.length} passed (${failed} failed)`);

  if (failed > 0) {
    console.log('\n⚠️  False positives detected! Filters need improvement.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
  }
}

runTests().catch(err => {
  console.error('Error running tests:', err);
  process.exit(1);
});
