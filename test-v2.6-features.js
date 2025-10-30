/**
 * Test v2.6.0 Features
 * Testet die 4 neuen Compromise.js Erkennungen:
 * 1. Geburtsdaten (.dates())
 * 2. Orte/Adressen (.places())
 * 3. Geldbeträge (.money())
 * 4. Organisationen (.organizations())
 */

import { CompromiseNER } from './extension/scripts/compromise-ner.js';

async function testFeature(name, text, expectedEntities, entityType) {
  console.log('\n' + '='.repeat(80));
  console.log(`TEST: ${name}`);
  console.log('='.repeat(80));
  console.log(`\nTest-Text: "${text}"\n`);

  const ner = new CompromiseNER();
  const entities = await ner.detectAll(text);
  const results = entities[entityType] || [];

  console.log(`✅ Gefunden: ${results.length} ${entityType}\n`);

  if (results.length > 0) {
    results.forEach((entity, i) => {
      console.log(`   ${i + 1}. "${entity.text}"`);
      console.log(`      Position: ${entity.start}-${entity.end}`);
      console.log(`      Confidence: ${Math.round(entity.confidence * 100)}%`);
      if (entity.currency) console.log(`      Currency: ${entity.currency}`);
      if (entity.value) console.log(`      Value: ${entity.value}`);
    });
  }

  // Validierung
  const foundAll = expectedEntities.every(expected =>
    results.some(r => r.text.toLowerCase().includes(expected.toLowerCase()))
  );

  console.log('\n🎯 Erwartete Erkennungen:');
  expectedEntities.forEach(expected => {
    const found = results.some(r => r.text.toLowerCase().includes(expected.toLowerCase()));
    console.log(`   ${found ? '✅' : '❌'} "${expected}"`);
  });

  return foundAll ? '✅ PASS' : '❌ FAIL';
}

async function runAllTests() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║  AI Compliance Checker v2.6.0 - Feature Tests                             ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝');

  const results = [];

  // ========== TEST 1: GEBURTSDATEN ==========
  results.push(await testFeature(
    'Geburtsdaten - Strukturiert',
    'Geboren am 15. März 1985 in Zürich.',
    ['15. März 1985'],
    'dates'
  ));

  results.push(await testFeature(
    'Geburtsdaten - Kontext',
    'Geburtsdatum: März 1985',
    ['März 1985'],
    'dates'
  ));

  results.push(await testFeature(
    'Geburtsdaten - Englisch',
    'Date of birth: March 15, 1985',
    ['March 15, 1985'],
    'dates'
  ));

  results.push(await testFeature(
    'Geburtsdaten - Jahrgang',
    'She was born in 1990.',
    ['1990'],
    'dates'
  ));

  // ========== TEST 2: ORTE/ADRESSEN ==========
  results.push(await testFeature(
    'Orte - Stadt',
    'Wohnt in Zürich an der Bahnhofstrasse.',
    ['Zürich'],
    'places'
  ));

  results.push(await testFeature(
    'Orte - Mehrere',
    'Reist von Berlin nach München.',
    ['Berlin', 'München'],
    'places'
  ));

  results.push(await testFeature(
    'Orte - Land',
    'Moved from Switzerland to Germany.',
    ['Switzerland', 'Germany'],
    'places'
  ));

  results.push(await testFeature(
    'Orte - Standort',
    'Standort: Kanton Zürich, Schweiz',
    ['Zürich', 'Schweiz'],
    'places'
  ));

  // ========== TEST 3: GELDBETRÄGE ==========
  results.push(await testFeature(
    'Geld - Millionen',
    'Umsatz von 1.5 Millionen CHF im letzten Quartal.',
    ['1.5 Millionen CHF'],
    'money'
  ));

  results.push(await testFeature(
    'Geld - Milliarden',
    'Das Budget beträgt 2.3 Milliarden Euro.',
    ['2.3 Milliarden Euro'],
    'money'
  ));

  results.push(await testFeature(
    'Geld - Tausend',
    'Lohn: etwa 85 Tausend Dollar pro Jahr.',
    ['85 Tausend Dollar'],
    'money'
  ));

  results.push(await testFeature(
    'Geld - Englisch',
    'Revenue reached 5 million dollars.',
    ['5 million dollars'],
    'money'
  ));

  results.push(await testFeature(
    'Geld - k-Notation',
    'Between 100k and 200k CHF budget.',
    ['100k', '200k'],
    'money'
  ));

  // ========== TEST 4: ORGANISATIONEN ==========
  results.push(await testFeature(
    'Organisationen - Bank',
    'Kunde ist die UBS AG.',
    ['UBS AG'],
    'organizations'
  ));

  results.push(await testFeature(
    'Organisationen - Tech',
    'Vertrag mit Google Switzerland GmbH.',
    ['Google Switzerland GmbH'],
    'organizations'
  ));

  results.push(await testFeature(
    'Organisationen - Retail',
    'Partner: Migros-Genossenschafts-Bund.',
    ['Migros'],
    'organizations'
  ));

  results.push(await testFeature(
    'Organisationen - Bank 2',
    'Account at Credit Suisse.',
    ['Credit Suisse'],
    'organizations'
  ));

  results.push(await testFeature(
    'Organisationen - Multiple',
    'Meeting with IBM and Microsoft representatives.',
    ['IBM', 'Microsoft'],
    'organizations'
  ));

  // ========== ZUSAMMENFASSUNG ==========
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║  TEST SUMMARY                                                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝');
  console.log('');

  const passed = results.filter(r => r.includes('PASS')).length;
  const failed = results.filter(r => r.includes('FAIL')).length;
  const total = results.length;

  console.log(`   Total Tests: ${total}`);
  console.log(`   ✅ Passed: ${passed} (${Math.round(passed/total*100)}%)`);
  console.log(`   ❌ Failed: ${failed} (${Math.round(failed/total*100)}%)`);
  console.log('');

  if (failed === 0) {
    console.log('   🎉 ALL TESTS PASSED! v2.6.0 Features work correctly.');
  } else {
    console.log('   ⚠️  Some tests failed. Check output above.');
  }

  console.log('');
  console.log('─'.repeat(79));
  console.log('');

  // Details pro Feature
  console.log('📊 Feature Breakdown:\n');

  const featureGroups = {
    'Geburtsdaten': results.slice(0, 4),
    'Orte/Adressen': results.slice(4, 8),
    'Geldbeträge': results.slice(8, 13),
    'Organisationen': results.slice(13, 18)
  };

  Object.entries(featureGroups).forEach(([feature, tests]) => {
    const passed = tests.filter(r => r.includes('PASS')).length;
    const total = tests.length;
    const icon = passed === total ? '✅' : '⚠️';
    console.log(`   ${icon} ${feature}: ${passed}/${total} tests passed`);
  });

  console.log('');
  console.log('═'.repeat(79));
}

runAllTests().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
