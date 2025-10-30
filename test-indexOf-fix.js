/**
 * Test: Beweis dass indexOf-Problem behoben ist
 * Demonstriert: Vorher wurde nur das erste Vorkommen gefunden
 */

import { CompromiseNER } from './extension/scripts/compromise-ner.js';

async function runSimpleTest() {
  console.log('='.repeat(80));
  console.log('TEST: indexOf-Problem ist behoben');
  console.log('='.repeat(80));

  // Einfacher Test-Text mit genau 7500 Zeichen
  const filler = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100); // ~5700 Zeichen

  const text =
    "Maria Schmidt arbeitet hier. " + // Position ~0
    filler.substring(0, 3000) + // Fülltext
    "Peter Müller ist auch dabei. " + // Position ~3000
    filler.substring(0, 3000) + // Mehr Fülltext
    "Maria Schmidt kam wieder. " + // Position ~6000+ ← KRITISCH!
    "Peter Müller half ihr."; // Position ~6030+ ← KRITISCH!

  console.log(`\n📊 Text-Länge: ${text.length} Zeichen`);
  console.log(`\n🎯 Erwartung:`);
  console.log(`   - Maria Schmidt: 2x (Position ~0 und ~6000+)`);
  console.log(`   - Peter Müller: 2x (Position ~3000 und ~6030+)`);

  console.log(`\n📍 Tatsächliche Positionen im Text:`);

  // Manuell prüfen wo die Namen sind
  let pos = 0;
  while ((pos = text.indexOf('Maria Schmidt', pos)) !== -1) {
    console.log(`   - "Maria Schmidt" bei Position ${pos}`);
    pos++;
  }

  pos = 0;
  while ((pos = text.indexOf('Peter Müller', pos)) !== -1) {
    console.log(`   - "Peter Müller" bei Position ${pos}`);
    pos++;
  }

  const ner = new CompromiseNER();
  console.log('\n🔍 NER-Analyse läuft...\n');

  const results = await ner.detectNames(text, 'de');

  console.log(`✅ Gefundene Namen-Vorkommen: ${results.length}\n`);

  // Gruppiere Ergebnisse
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.text]) grouped[r.text] = [];
    grouped[r.text].push(r.start);
  });

  Object.keys(grouped).sort().forEach(name => {
    const positions = grouped[name];
    console.log(`   ✓ ${name}:`);
    console.log(`     Vorkommen: ${positions.length}x`);
    console.log(`     Positionen: ${positions.join(', ')}`);

    // Zeige ob Position >6000 erkannt wurde
    const hasLatePosition = positions.some(p => p > 6000);
    if (hasLatePosition) {
      console.log(`     ✅ Position >6000 gefunden! (indexOf-Bug ist behoben)`);
    } else {
      console.log(`     ❌ Keine Position >6000 (indexOf-Bug noch aktiv)`);
    }
  });

  console.log('\n' + '='.repeat(80));

  // Validierung
  const mariaCount = grouped['Maria Schmidt'] ? grouped['Maria Schmidt'].length : 0;
  const peterCount = grouped['Peter Müller'] ? grouped['Peter Müller'].length : 0;

  const mariaHasLate = grouped['Maria Schmidt'] ? grouped['Maria Schmidt'].some(p => p > 6000) : false;
  const peterHasLate = grouped['Peter Müller'] ? grouped['Peter Müller'].some(p => p > 6000) : false;

  if (mariaCount === 2 && peterCount === 2 && mariaHasLate && peterHasLate) {
    console.log('✅ TEST ERFOLGREICH!');
    console.log('   Alle Namen wurden gefunden, auch bei Position >6000 Zeichen.');
    console.log('   Das indexOf-Problem ist behoben!');
  } else {
    console.log('❌ TEST FEHLGESCHLAGEN!');
    if (!mariaHasLate || !peterHasLate) {
      console.log('   Namen nach 6000 Zeichen wurden NICHT gefunden.');
      console.log('   Das indexOf-Problem besteht noch!');
    }
  }
  console.log('='.repeat(80));
}

runSimpleTest().catch(error => {
  console.error('Fehler:', error);
  process.exit(1);
});
