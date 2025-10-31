import nlp from 'compromise';

const tests = [
  'Kunde ist die UBS AG',
  'Vertrag mit Google Switzerland GmbH',
  'Meeting with IBM and Microsoft representatives'
];

for (const text of tests) {
  console.log('\n' + '='.repeat(70));
  console.log('Text:', text);

  const doc = nlp(text);

  const orgsMethod = doc.organizations().json();
  const orgsMatch = doc.match('#Organization+').json();

  console.log('organizations():', orgsMethod.map(o => o.text));
  console.log('match(#Organization+):', orgsMatch.map(o => o.text));
}
