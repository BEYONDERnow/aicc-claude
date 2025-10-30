/**
 * Test: Erkennung von Namen in langen Texten (>7000 Zeichen)
 * Problem: Bei >7000 Zeichen wurden nicht alle Namen erkannt
 * Ursache: indexOf() fand nur das erste Vorkommen eines Namens
 */

import { CompromiseNER } from './extension/scripts/compromise-ner.js';

// Generiere einen langen Text mit mehrfach vorkommenden Namen
function generateLongText() {
  const sections = [
    // Sektion 1: Position ~0-500
    "Maria Schmidt arbeitet in der IT-Abteilung. Sie traf ihren Kollegen Thomas Müller zum Meeting. " +
    "Das Projekt läuft gut und alle sind zufrieden. Die Zusammenarbeit ist sehr produktiv. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. ",

    // Fülltext 1 (~500 Zeichen)
    "Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes. " +
    "Nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus. " +
    "Nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. " +
    "Cras mattis consectetur purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. ",

    // Sektion 2: Position ~1000-1500
    "Anna Weber führte die Präsentation durch. Sie erklärte die neuen Features sehr detailliert. " +
    "Die Stakeholder waren beeindruckt von den Fortschritten. Das Team hat ausgezeichnete Arbeit geleistet. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. " +
    "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. ",

    // Fülltext 2 (~500 Zeichen)
    "Vestibulum id ligula porta felis euismod semper. Maecenas sed diam eget risus varius blandit sit amet non magna. " +
    "Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. " +
    "Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis. " +
    "Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. ",

    // Sektion 3: Position ~2000-2500
    "Peter Hoffmann organisierte das Event. Die Veranstaltung war ein großer Erfolg. " +
    "Viele Teilnehmer zeigten großes Interesse an den vorgestellten Themen. Die Diskussionen waren sehr bereichernd. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus, tellus ac cursus commodo. " +
    "Tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. ",

    // Fülltext 3 (~500 Zeichen)
    "Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes. " +
    "Nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. " +
    "Sed posuere consectetur est at lobortis. Fusce dapibus, tellus ac cursus commodo, tortor mauris. " +
    "Condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. ",

    // Sektion 4: Position ~3000-3500
    "Sarah Klein leitete das Workshop-Team. Die Workshop-Teilnehmer lernten viele neue Techniken. " +
    "Die praktischen Übungen waren besonders wertvoll. Alle Teilnehmer erhielten Zertifikate. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id elit non mi porta gravida at eget metus. " +
    "Maecenas faucibus mollis interdum. Morbi leo risus, porta ac consectetur ac. ",

    // Fülltext 4 (~500 Zeichen)
    "Vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. " +
    "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur. " +
    "Sed posuere consectetur est at lobortis. Fusce dapibus, tellus ac cursus commodo. " +
    "Tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Nullam quis risus eget urna mollis ornare. ",

    // Sektion 5: Position ~4000-4500
    "Michael Becker präsentierte die Quartalszahlen. Die Zahlen zeigten ein positives Wachstum. " +
    "Die Investoren waren sehr zufrieden mit der Entwicklung. Das Management erhielt viel Lob. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. " +
    "Cras justo odio, dapibus ac facilisis in, egestas eget quam. ",

    // Fülltext 5 (~500 Zeichen)
    "Nullam id dolor id nibh ultricies vehicula ut id elit. Sed posuere consectetur est at lobortis. " +
    "Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla. " +
    "Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. " +
    "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. ",

    // Sektion 6: Position ~5000-5500
    "Julia Fischer koordinierte das Marketing. Die Kampagne erreichte viele Menschen. " +
    "Die Social Media Strategie war sehr erfolgreich. Das Budget wurde optimal genutzt. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. " +
    "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ",

    // Fülltext 6 (~500 Zeichen)
    "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. " +
    "Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula. " +
    "Eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. " +
    "Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes. ",

    // Sektion 7: Position ~6000-6500
    "Laura Zimmermann schrieb den Bericht. Der Bericht enthielt alle wichtigen Erkenntnisse. " +
    "Die Analyse war sehr gründlich und detailliert. Die Empfehlungen wurden gut aufgenommen. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. " +
    "Maecenas faucibus mollis interdum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. ",

    // Fülltext 7 (~500 Zeichen)
    "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet. " +
    "Rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula. " +
    "Eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Fusce dapibus, tellus ac cursus commodo. " +
    "Tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. ",

    // KRITISCH: Sektion 8 - Position ~7000+ (hier ist das Problem!)
    "Maria Schmidt kam wieder vorbei. Sie berichtete von neuen Entwicklungen. " +
    "Der Kollege Thomas Müller unterstützte sie bei der Planung. Anna Weber half bei der Koordination. " +
    "Peter Hoffmann übernahm die technische Umsetzung. Sarah Klein dokumentierte alles. " +
    "Michael Becker reviewte die Resultate. Julia Fischer kommunizierte die Erfolge. " +
    "Laura Zimmermann archivierte die Unterlagen. Das Team war hochzufrieden. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. ",

    // Zusätzlicher Fülltext um >7000 Zeichen zu erreichen
    "Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes. " +
    "Nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus. " +
    "Nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. " +
    "Cras mattis consectetur purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. " +
    "Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. " +
    "Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis interdum. " +
    "Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna. " +
    "Vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. ",

    // Fülltext 8 (~500 Zeichen)
    "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. " +
    "Aenean lacinia bibendum nulla sed consectetur. Sed posuere consectetur est at lobortis. " +
    "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh. " +
    "Nullam id dolor id nibh ultricies vehicula ut id elit. Integer posuere erat a ante venenatis. " +
    "Dapibus posuere velit aliquet. Cum sociis natoque penatibus et magnis dis parturient montes. " +
    "Nascetur ridiculus mus. Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. "
  ];

  return sections.join('');
}

async function runTest() {
  console.log('='.repeat(80));
  console.log('TEST: Namenserkennung in langen Texten (>7000 Zeichen)');
  console.log('='.repeat(80));

  const text = generateLongText();
  console.log('\n📊 Text-Statistik:');
  console.log(`   Länge: ${text.length} Zeichen`);
  console.log(`   Erwartete Namen-Vorkommen:`);
  console.log(`   - Maria Schmidt: 2x (Position ~100 und ~7000)`);
  console.log(`   - Thomas Müller: 2x (Position ~150 und ~7050)`);
  console.log(`   - Anna Weber: 2x (Position ~1000 und ~7100)`);
  console.log(`   - Peter Hoffmann: 2x (Position ~2000 und ~7150)`);
  console.log(`   - Sarah Klein: 2x (Position ~3000 und ~7200)`);
  console.log(`   - Michael Becker: 2x (Position ~4000 und ~7250)`);
  console.log(`   - Julia Fischer: 2x (Position ~5000 und ~7300)`);
  console.log(`   - Laura Zimmermann: 2x (Position ~6000 und ~7350)`);

  const ner = new CompromiseNER();
  console.log('\n🔍 Starte NER-Analyse...\n');

  const results = await ner.detectNames(text, 'de');

  console.log(`✅ Gefundene Namen: ${results.length}`);
  console.log('\n📋 Detaillierte Ergebnisse:\n');

  // Gruppiere nach Namen
  const groupedResults = {};
  results.forEach(result => {
    if (!groupedResults[result.text]) {
      groupedResults[result.text] = [];
    }
    groupedResults[result.text].push(result.start);
  });

  // Sortiere alphabetisch
  const sortedNames = Object.keys(groupedResults).sort();

  sortedNames.forEach(name => {
    const positions = groupedResults[name];
    console.log(`   ✓ ${name}:`);
    console.log(`     Vorkommen: ${positions.length}x`);
    console.log(`     Positionen: ${positions.join(', ')}`);

    // Zeige Kontext für jede Position
    positions.forEach(pos => {
      const contextStart = Math.max(0, pos - 20);
      const contextEnd = Math.min(text.length, pos + name.length + 20);
      const context = text.substring(contextStart, contextEnd);
      const highlight = context.replace(
        new RegExp(name, 'i'),
        `→${name}←`
      );
      console.log(`       Kontext: "${highlight.replace(/\n/g, ' ')}"`);
    });
    console.log('');
  });

  // Prüfe ob alle erwarteten Namen gefunden wurden
  console.log('\n🎯 Validierung:');
  const expectedNames = [
    'Maria Schmidt',
    'Thomas Müller',
    'Anna Weber',
    'Peter Hoffmann',
    'Sarah Klein',
    'Michael Becker',
    'Julia Fischer',
    'Laura Zimmermann'
  ];

  let allFound = true;
  expectedNames.forEach(expectedName => {
    const found = groupedResults[expectedName];
    const expectedCount = 2;
    const actualCount = found ? found.length : 0;

    if (actualCount === expectedCount) {
      console.log(`   ✅ ${expectedName}: ${actualCount}/${expectedCount} Vorkommen gefunden`);
    } else {
      console.log(`   ❌ ${expectedName}: ${actualCount}/${expectedCount} Vorkommen gefunden`);
      allFound = false;
    }
  });

  console.log('\n' + '='.repeat(80));
  if (allFound && results.length === expectedNames.length * 2) {
    console.log('✅ TEST ERFOLGREICH: Alle Namen wurden korrekt erkannt!');
  } else {
    console.log('❌ TEST FEHLGESCHLAGEN: Nicht alle Namen wurden erkannt!');
  }
  console.log('='.repeat(80));
}

runTest().catch(error => {
  console.error('Test-Fehler:', error);
  process.exit(1);
});
