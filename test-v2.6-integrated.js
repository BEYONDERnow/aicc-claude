/**
 * Test v2.6.0 - Integrated System Test
 * Testet das gesamte Hybrid-System (Regex + NER)
 *
 * Das Hybrid-System kombiniert:
 * - Regex-Patterns für präzise Pattern-Matching (z.B. deutsche Zahlenwörter)
 * - Compromise.js NER für kontextuelle Erkennung (z.B. Namen im Satzkontext)
 */

import { ComplianceDetector } from './extension/scripts/detector.js';

async function testIntegrated(name, text, expectedTypes) {
  console.log('\n' + '='.repeat(80));
  console.log(`TEST: ${name}`);
  console.log('='.repeat(80));
  console.log(`\nTest-Text:\n"${text}"\n`);

  const detector = new ComplianceDetector();
  const result = await detector.analyze(text, 'de');

  console.log(`\n✅ Status: ${result.status.toUpperCase()}`);
  console.log(`✅ Gefunden: ${result.detections.length} Erkennungen\n`);

  if (result.detections.length > 0) {
    result.detections.forEach((detection, i) => {
      console.log(`   ${i + 1}. "${detection.match}"`);
      console.log(`      Typ: ${detection.name}`);
      console.log(`      Kategorie: ${detection.category}`);
      console.log(`      Severity: ${detection.severity}`);
    });
  }

  // Validierung: Für jede erwartete Gruppe, prüfe ob mindestens einer gefunden wurde
  // Gruppiere expectedTypes mit | als ODER-Operator (z.B. "date_of_birth|birthdate_nlp")
  const foundTypes = new Set(result.detections.map(d => d.id));

  // Split by | to allow OR logic: "date_of_birth|birthdate_nlp" means either is fine
  const checkTypes = expectedTypes.map(type => {
    if (type.includes('|')) {
      const alternatives = type.split('|');
      return alternatives.some(alt => foundTypes.has(alt)) ? type : null;
    } else {
      return foundTypes.has(type) ? type : null;
    }
  });

  const foundAll = checkTypes.every(t => t !== null);

  console.log('\n🎯 Erwartete Entity-Typen:');
  expectedTypes.forEach(type => {
    if (type.includes('|')) {
      const alternatives = type.split('|');
      const found = alternatives.some(alt => foundTypes.has(alt));
      const foundAlt = alternatives.find(alt => foundTypes.has(alt));
      console.log(`   ${found ? '✅' : '❌'} ${type} ${found ? `(gefunden: ${foundAlt})` : ''}`);
    } else {
      const found = foundTypes.has(type);
      console.log(`   ${found ? '✅' : '❌'} ${type}`);
    }
  });

  if (!foundAll) {
    const missing = expectedTypes.filter((type, i) => checkTypes[i] === null);
    console.log('\n⚠️  Fehlende Erkennungen:');
    missing.forEach(type => {
      console.log(`   - ${type}`);
    });
  }

  return foundAll ? '✅ PASS' : '❌ FAIL';
}

async function runIntegratedTests() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║  AI Compliance Checker v2.6.0 - Integrated System Tests                  ║');
  console.log('║  (Regex + NER Hybrid)                                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝');

  const results = [];

  // ========== GEBURTSDATEN ==========
  results.push(await testIntegrated(
    'Geburtsdaten - Mit Kontext',
    'Geburtsdatum: 15.03.1985',
    ['date_of_birth|birthdate_nlp'] // Regex ODER NER (beide sind valide)
  ));

  results.push(await testIntegrated(
    'Geburtsdaten - Englisch mit NER',
    'Date of birth: March 15, 1985',
    ['date_of_birth|birthdate_nlp'] // Regex ODER NER
  ));

  results.push(await testIntegrated(
    'Geburtsdaten - Nur Jahr',
    'Geboren 1990',
    ['date_of_birth']
  ));

  // ========== ORTE/ADRESSEN ==========
  results.push(await testIntegrated(
    'Orte - Vollständige Adresse',
    'Wohnt in der Bahnhofstrasse 12, 8001 Zürich',
    ['address_street', 'zip_swiss']
  ));

  results.push(await testIntegrated(
    'Orte - Stadt mit NER',
    'Wohnt in Zürich',
    ['location_nlp']
  ));

  results.push(await testIntegrated(
    'Orte - Mehrere Städte',
    'Reist von Berlin nach München',
    ['location_nlp']
  ));

  // ========== GELDBETRÄGE ==========
  results.push(await testIntegrated(
    'Geld - Schweizer Format',
    'Umsatz von 1.5 Millionen CHF',
    ['currency_amount'] // Regex sollte matchen
  ));

  results.push(await testIntegrated(
    'Geld - Euro Format',
    'Budget beträgt 2.3 Milliarden Euro',
    ['currency_amount']
  ));

  results.push(await testIntegrated(
    'Geld - Englisch mit NER',
    'Revenue reached 5 million dollars',
    ['money_nlp'] // NER sollte matchen
  ));

  results.push(await testIntegrated(
    'Geld - Gehalt',
    'Gehalt: 85.000 CHF',
    ['salary']
  ));

  // ========== ORGANISATIONEN ==========
  results.push(await testIntegrated(
    'Organisationen - Bank',
    'Kunde ist die UBS AG',
    ['organization_nlp']
  ));

  results.push(await testIntegrated(
    'Organisationen - Tech',
    'Vertrag mit Google Switzerland GmbH',
    ['organization_nlp']
  ));

  results.push(await testIntegrated(
    'Organisationen - Multiple',
    'Meeting with IBM and Microsoft representatives',
    ['organization_nlp']
  ));

  // ========== KOMPLEXE SZENARIEN ==========
  results.push(await testIntegrated(
    'Komplex - Persönliche Daten',
    'Name: Hans Müller, geboren 15.03.1985, wohnt in der Bahnhofstrasse 12, 8001 Zürich, Gehalt: 120.000 CHF',
    ['name_ner', 'date_of_birth', 'address_street', 'zip_swiss', 'salary']
  ));

  results.push(await testIntegrated(
    'Komplex - Business Daten',
    'Kunde UBS AG, Umsatz 1.5 Millionen CHF, Standort: Zürich',
    ['organization_nlp', 'currency_amount', 'location_nlp']
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
    console.log('   🎉 ALL TESTS PASSED! v2.6.0 Hybrid System works correctly.');
  } else {
    console.log('   ⚠️  Some tests failed. Check output above.');
  }

  console.log('');
  console.log('─'.repeat(79));
  console.log('');

  // Details pro Feature
  console.log('📊 Feature Breakdown:\n');

  const featureGroups = {
    'Geburtsdaten': results.slice(0, 3),
    'Orte/Adressen': results.slice(3, 6),
    'Geldbeträge': results.slice(6, 10),
    'Organisationen': results.slice(10, 13),
    'Komplexe Szenarien': results.slice(13, 15)
  };

  Object.entries(featureGroups).forEach(([feature, tests]) => {
    const passed = tests.filter(r => r.includes('PASS')).length;
    const total = tests.length;
    const icon = passed === total ? '✅' : (passed > 0 ? '⚠️' : '❌');
    console.log(`   ${icon} ${feature}: ${passed}/${total} tests passed`);
  });

  console.log('');
  console.log('═'.repeat(79));
  console.log('');

  // Technische Details
  console.log('🔧 System Architecture:\n');
  console.log('   ✅ Regex Patterns: Präzise Pattern-Matching (CH/DE spezifisch)');
  console.log('   ✅ Compromise.js NER: Kontextuelle Entity-Erkennung (EN optimiert)');
  console.log('   ✅ Hybrid Strategy: Beste Abdeckung durch Kombination beider Systeme');
  console.log('');
  console.log('═'.repeat(79));
}

runIntegratedTests().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
