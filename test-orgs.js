import { ComplianceDetector } from './extension/scripts/detector.js';

const tests = [
  'Kunde ist die UBS AG',
  'Vertrag mit Google Switzerland GmbH',
  'Meeting with IBM and Microsoft representatives'
];

async function test() {
  const detector = new ComplianceDetector();

  for (const text of tests) {
    console.log('\n' + '='.repeat(70));
    console.log('Testing:', text);
    const result = await detector.analyze(text);
    console.log('Detections:', result.detections?.length || 0);
    if (result.detections?.length > 0) {
      result.detections.forEach(d => {
        console.log(`  - "${d.matched}" (${d.type}, ${d.id})`);
      });
    }
  }
}

test();
