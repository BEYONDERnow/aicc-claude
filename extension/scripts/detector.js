/**
 * AI Compliance Checker - Detection Engine
 * Version 2.0.0 - KI-gestützte Erkennung mit Transformer.js
 * by BEYONDER
 * Erkennt personenbezogene und sensible Daten in Text-Eingaben
 * 100% lokal, keine Server-Kommunikation
 */

import { NERDetector } from './ner-detector.js';

class ComplianceDetector {
  constructor() {
    this.patterns = this.initializePatterns();
    this.translations = this.initializeTranslations();
    this.nameBlacklist = this.initializeNameBlacklist();
    this.commonFirstNames = this.initializeCommonFirstNames();

    // VERSION 2.0.0: NER-Detector für intelligente Namenserkennung
    this.nerDetector = new NERDetector();
    this.nerAvailable = false;
    this.nerEnabled = true; // Kann deaktiviert werden für Fallback

    console.log('[AI Compliance Checker] v2.0.0 - KI-gestützte Erkennung aktiv');
  }

  /**
   * Initialisiert Liste häufiger Vornamen (DE/EN/CH)
   * Für heuristische Name-Erkennung
   */
  initializeCommonFirstNames() {
    return new Set([
      // ========== DEUTSCHLAND (Top 200) ==========
      'alexander', 'andreas', 'andrea', 'anna', 'anne', 'antje', 'anja', 'axel',
      'ben', 'benjamin', 'bernd', 'bianca', 'birgit', 'brigitte',
      'carla', 'carmen', 'chris', 'christian', 'christiane', 'christina', 'christine', 'christoph',
      'clara', 'claudia', 'claus', 'cornelia',
      'daniel', 'daniela', 'david', 'dennis', 'diana', 'dieter', 'dirk', 'dominik', 'doris',
      'elena', 'elias', 'elke', 'emily', 'emma', 'eric', 'erik', 'ernst', 'eva',
      'fabian', 'felix', 'finn', 'florian', 'frank', 'franziska', 'friedrich', 'fritz',
      'gabriele', 'georg', 'gerd', 'gerhard', 'gisela', 'gudrun', 'günter', 'grit',
      'hanna', 'hannah', 'hans', 'harald', 'heike', 'heiko', 'heinrich', 'heinz', 'helga',
      'helge', 'helmut', 'hendrik', 'henning', 'herbert', 'hermann', 'holger', 'horst',
      'ida', 'ilse', 'ines', 'inga', 'inge', 'ingrid', 'irene', 'iris', 'isabelle',
      'jakob', 'jan', 'jana', 'jens', 'jessica', 'joachim', 'jochen', 'johannes', 'jonas',
      'jonathan', 'jörg', 'josef', 'julia', 'juliane', 'jürgen', 'jutta',
      'kai', 'karin', 'karl', 'karla', 'katharina', 'kathrin', 'katja', 'klaus', 'konstantin',
      'kristin', 'kurt',
      'lara', 'lars', 'laura', 'lea', 'lena', 'leon', 'leonard', 'liam', 'lisa', 'lotte',
      'lukas', 'luise', 'lutz',
      'manfred', 'manuel', 'manuela', 'marcel', 'marco', 'margarete', 'maria', 'marie',
      'marion', 'mario', 'markus', 'marlene', 'martin', 'martina', 'matthias', 'max',
      'maximilian', 'melanie', 'michael', 'michaela', 'mia', 'miriam', 'monika', 'moritz',
      'nadine', 'natalie', 'nick', 'nico', 'nicole', 'nils', 'nina', 'noah', 'norbert',
      'oliver', 'olaf', 'otto',
      'patrick', 'paul', 'paula', 'peter', 'petra', 'philipp', 'ralf', 'rainer', 'ralf',
      'reiner', 'reinhard', 'renate', 'richard', 'robert', 'roland', 'rolf', 'rudolf', 'ruth',
      'sabine', 'sabrina', 'sandra', 'sara', 'sarah', 'sebastian', 'silke', 'simon', 'simone',
      'sonja', 'sophie', 'stefan', 'stefanie', 'stephan', 'stephanie', 'susanne', 'sven',
      'theo', 'thomas', 'thorsten', 'till', 'tim', 'timo', 'tina', 'tobias', 'tom',
      'torsten', 'tristan',
      'ulrich', 'ulrike', 'ursula', 'ute', 'uwe',
      'valentin', 'vanessa', 'vera', 'veronika', 'volker',
      'walter', 'werner', 'wilhelm', 'wilfried', 'willi', 'wolfgang',

      // ========== SCHWEIZ (Top 100) ==========
      'adrian', 'aldo', 'alessio', 'andres', 'andrin', 'anita', 'annina', 'annik',
      'beat', 'beda', 'beni', 'benoît',
      'céline', 'christoph', 'claude', 'claudio',
      'damian', 'damien', 'dario', 'davide', 'diego', 'dominic', 'dominique',
      'eliane', 'elio', 'emilie', 'enzo', 'estelle',
      'fabio', 'fabian', 'fabienne', 'flavio', 'florence', 'florent', 'flurin', 'françois', 'franz',
      'gianluca', 'gian', 'gino', 'giulia', 'giuliano',
      'hannes', 'hanspeter', 'hans', 'heidi',
      'isabelle', 'ivan',
      'jan', 'janine', 'jean', 'jérôme', 'joanna', 'joël', 'joelle', 'jonas', 'jonathan',
      'jürg', 'julian',
      'karin', 'kevin', 'kilian',
      'ladina', 'lara', 'lena', 'léa', 'léonie', 'lian', 'linus', 'loic', 'loris', 'luca',
      'lukas', 'lynn',
      'manuela', 'mara', 'marc', 'marcel', 'marco', 'margrit', 'marie', 'mario', 'markus',
      'martin', 'mathieu', 'matteo', 'matthias', 'maurus', 'melanie', 'michelle', 'mirco',
      'nadine', 'nathan', 'nico', 'nicolas', 'niklaus', 'nils', 'noémie', 'noah',
      'olivier', 'oskar',
      'pascal', 'patrick', 'patrik', 'paul', 'peter', 'philippe', 'pierre',
      'raffael', 'raphael', 'rené', 'reto', 'roger', 'roman', 'ruedi', 'rolf',
      'samuel', 'sandra', 'sara', 'sebastian', 'selina', 'sepp', 'seraina', 'silvan',
      'simone', 'simon', 'sophie', 'stefan', 'stephan', 'sven', 'sylvia',
      'tanja', 'tatjana', 'thomas', 'till', 'tim', 'timo', 'tobias', 'tom',
      'urs', 'ursula',
      'valentin', 'vera', 'verena', 'viktor',
      'walter', 'werner',
      'yannick', 'yves',
      'zoe',

      // ========== ÖSTERREICH (Top 80) ==========
      'adolf', 'agnes', 'albert', 'alois', 'andreas', 'angelika', 'anna', 'anton',
      'barbara', 'bernhard', 'brigitte',
      'christian', 'christoph', 'christine',
      'daniel', 'david', 'dietmar',
      'elisabeth', 'elfriede', 'elias', 'erich', 'ernst', 'eva',
      'florian', 'franz', 'friedrich', 'fritz',
      'georg', 'gerhard', 'gottfried', 'günter', 'günther',
      'hans', 'harald', 'heidi', 'heinrich', 'helmut', 'herbert', 'hermann', 'hildegard',
      'ingrid', 'irene',
      'jakob', 'johann', 'johannes', 'josef', 'julian',
      'karl', 'katharina', 'klaus', 'konrad', 'kurt',
      'leopold', 'lukas',
      'manfred', 'margarete', 'maria', 'marianne', 'markus', 'martin', 'matthias', 'max',
      'maximilian', 'michael', 'monika',
      'niklas', 'nikolaus',
      'otto',
      'paul', 'peter', 'petra', 'philipp',
      'reinhard', 'richard', 'robert', 'roland', 'rudolf', 'ruth',
      'sabine', 'sebastian', 'stefan', 'susanne',
      'thomas', 'tobias',
      'ursula',
      'walter', 'werner', 'wolfgang',

      // ========== ITALIEN (Top 100) ==========
      'adriano', 'alberto', 'aldo', 'alessandro', 'alessandra', 'alessia', 'alessandro', 'alfredo',
      'andrea', 'angela', 'angelo', 'anna', 'antonella', 'antonia', 'antonio',
      'barbara', 'beatrice', 'benedetta', 'bruno',
      'camilla', 'carla', 'carlo', 'carmela', 'carolina', 'caterina', 'cecilia', 'chiara',
      'claudio', 'cristiana', 'cristina',
      'daniela', 'daniele', 'dario', 'davide', 'diego', 'domenico', 'donatella',
      'elena', 'eleonora', 'elisa', 'elisabetta', 'emanuele', 'emilia', 'enrico', 'enzo',
      'fabio', 'fabrizio', 'federico', 'fernanda', 'filippo', 'francesca', 'francesco', 'franco',
      'gabriele', 'gabriella', 'giacomo', 'giancarlo', 'gianluca', 'gianmarco', 'gianni',
      'giorgio', 'giovanna', 'giovanni', 'giulia', 'giuliana', 'giuliano', 'giuseppe', 'giuseppina',
      'grazia', 'guido',
      'ida', 'irene', 'isabella', 'ivana', 'ivo',
      'laura', 'leonardo', 'lidia', 'lorenzo', 'luca', 'lucia', 'luciano', 'luigi', 'luisa',
      'manuela', 'marcello', 'marco', 'margherita', 'maria', 'marina', 'mario', 'marta',
      'martina', 'massimiliano', 'massimo', 'matteo', 'mattia', 'maurizio', 'mauro', 'michele',
      'miriam', 'monica',
      'nicola', 'nicoletta', 'nino',
      'paola', 'paolo', 'patrizia', 'piero', 'pietro',
      'raffaele', 'renato', 'riccardo', 'rita', 'roberta', 'roberto', 'rocco', 'rosa',
      'rosanna', 'rosaria', 'salvatore', 'sandra', 'sara', 'sergio', 'silvia', 'simona',
      'simone', 'sofia', 'stefania', 'stefano',
      'teresa', 'tommaso',
      'umberto',
      'valeria', 'valerio', 'vanessa', 'vincenzo', 'vittoria', 'vittorio',

      // ========== FRANKREICH (Top 100) ==========
      'adèle', 'adrien', 'alain', 'albert', 'alexandre', 'alexis', 'alice', 'amélie',
      'andré', 'andrée', 'antoine', 'arnaud', 'arthur', 'audrey',
      'baptiste', 'barbara', 'benoît', 'bernard', 'bertrand', 'brigitte', 'bruno',
      'camille', 'catherine', 'cécile', 'céline', 'charles', 'charlotte', 'chloé',
      'christian', 'christiane', 'christine', 'christophe', 'claire', 'claude', 'clément',
      'corinne',
      'daniel', 'danielle', 'david', 'denis', 'denise', 'didier', 'dominique',
      'édith', 'élise', 'émile', 'émilie', 'emmanuel', 'éric', 'étienne', 'éva',
      'fabien', 'fabienne', 'florence', 'francis', 'françoise', 'françois', 'franck', 'frédéric',
      'gérard', 'gilles', 'grégory', 'guillaume', 'guy',
      'hélène', 'henri', 'hervé', 'hubert',
      'isabelle',
      'jacqueline', 'jacques', 'jean', 'jeanne', 'jérôme', 'joël', 'joséphine', 'julien',
      'juliette',
      'laurent', 'léa', 'léon', 'louis', 'louise', 'luc', 'lucas', 'lucie',
      'madeleine', 'manon', 'marc', 'marcel', 'marguerite', 'marie', 'marine', 'marion',
      'martin', 'martine', 'mathieu', 'mathilde', 'maxime', 'michel', 'michèle', 'monique',
      'nathalie', 'nicolas', 'nicole', 'noémie',
      'océane', 'odette', 'olivier',
      'pascal', 'patricia', 'patrick', 'paul', 'pauline', 'philippe', 'pierre',
      'quentin',
      'raphaël', 'raymond', 'régine', 'rené', 'richard', 'robert', 'romain', 'rosalie', 'rose',
      'sandrine', 'sébastien', 'serge', 'simone', 'simon', 'solène', 'sophie', 'stéphane',
      'stéphanie', 'sylvain', 'sylvie',
      'théo', 'thérèse', 'thierry', 'thomas',
      'valérie', 'valentin', 'valentine', 'véronique', 'victor', 'vincent', 'virginie',
      'yves', 'yvette', 'yvonne',

      // Zusätzliche häufige Nachnamen als Vornamen (Doppelnamen)
      'müller', 'schmidt', 'schmid', 'schneider', 'fischer', 'weber', 'meyer', 'wagner',
      'becker', 'schulz', 'hoffmann', 'koch', 'beyeler', 'huber', 'mayer', 'lehmann'
    ]);
  }

  /**
   * Initialisiert Blacklist für häufige Wörter die keine Namen sind
   */
  initializeNameBlacklist() {
    return new Set([
      // Allgemeine Begriffe (EN)
      'general', 'manager', 'director', 'officer', 'agent', 'assistant', 'consultant',
      'specialist', 'coordinator', 'administrator', 'supervisor', 'representative',
      'first', 'second', 'third', 'last', 'next', 'previous', 'current', 'former',
      'senior', 'junior', 'chief', 'head', 'lead', 'principal', 'vice', 'deputy',

      // Titel (EN/DE)
      'mister', 'misses', 'doctor', 'professor', 'lieutenant', 'captain', 'major',
      'colonel', 'sergeant', 'private', 'master', 'miss',

      // KI/Tech Begriffe (EN/DE)
      'artificial', 'intelligence', 'machine', 'learning', 'deep', 'neural', 'network',
      'model', 'system', 'algorithm', 'data', 'science', 'computer', 'software',
      'hardware', 'internet', 'digital', 'virtual', 'cyber', 'online',
      'digitaler', 'digitale', 'digitales',

      // Häufige Adjektive (EN)
      'great', 'good', 'bad', 'nice', 'beautiful', 'wonderful', 'excellent',
      'perfect', 'terrible', 'awesome', 'amazing', 'incredible', 'fantastic',

      // Monate/Tage (EN/DE)
      'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
      'september', 'october', 'november', 'december', 'monday', 'tuesday',
      'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'januar', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august',
      'september', 'oktober', 'november', 'dezember', 'montag', 'dienstag',
      'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag',

      // ========== DEUTSCHE ERWEITERUNG (+150 Wörter) ==========

      // Artikel (DE)
      'der', 'die', 'das', 'den', 'dem', 'des',
      'ein', 'eine', 'einer', 'einem', 'einen', 'eines',

      // Präpositionen (DE)
      'mit', 'aus', 'bei', 'nach', 'von', 'zu', 'vor', 'über', 'unter', 'zwischen',
      'durch', 'für', 'gegen', 'ohne', 'um', 'an', 'auf', 'hinter', 'neben',
      'in', 'binnen', 'seit', 'während', 'wegen',

      // Konjunktionen (DE)
      'und', 'oder', 'aber', 'denn', 'sondern', 'doch', 'jedoch', 'als', 'wenn',
      'weil', 'da', 'obwohl', 'damit', 'dass', 'falls', 'bevor', 'nachdem',

      // Pronomen (DE)
      'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'mein', 'dein', 'sein', 'ihr',
      'unser', 'euer', 'dieser', 'jener', 'welcher', 'alle', 'einige', 'manche',
      'keine', 'jeder', 'jede', 'jedes', 'solche', 'andere',
      'ihrer', 'seine', 'ihre',

      // Verben (DE - häufige)
      'werden', 'sollten', 'beginnt', 'wurde', 'waren', 'haben', 'hatte', 'hätte',
      'sein', 'gewesen', 'machen', 'gehen', 'kommen', 'sagen', 'können', 'müssen',
      'dürfen', 'wollen', 'sollen', 'mögen',

      // Adjektive (DE)
      'bewährte', 'praxisnah', 'neue', 'alten', 'große', 'kleine', 'gute', 'beste',
      'letzte', 'erste', 'nächste', 'weitere', 'eigene', 'verschiedene', 'mehrere',

      // Substantive (DE - häufig)
      'zukunft', 'vergangenheit', 'gegenwart', 'zeit', 'jahr', 'monat', 'woche', 'tag',
      'stunde', 'minute', 'anfang', 'ende', 'mitte',
      'haus', 'raum', 'tür', 'fenster', 'tisch', 'stuhl',
      'mann', 'frau', 'kind', 'leute', 'menschen', 'person', 'gruppe', 'team',
      'firma', 'unternehmen', 'betrieb', 'gesellschaft', 'organisation',
      'arbeit', 'job', 'stelle', 'position', 'aufgabe', 'projekt',
      'geld', 'preis', 'kosten', 'wert', 'summe', 'betrag',
      'wochen',

      // Business-Begriffe (EN/DE)
      'management', 'relationship', 'customer', 'business', 'strategy', 'marketing',
      'sales', 'service', 'support', 'product', 'solution', 'platform',
      'journey', 'experience', 'engagement', 'retention', 'acquisition',
      'performance', 'efficiency', 'productivity', 'quality', 'innovation',
      'transformation', 'optimization', 'automation', 'integration',
      'kommunikationsmuster', 'kommunikation', 'muster', 'prozess', 'prozesse',
      'strategie', 'konzept', 'methode', 'ansatz', 'lösung', 'system',
      'konkurrenten', 'konkurrenz', 'wettbewerb', 'markt',

      // Tech/KI-Begriffe (EN/DE)
      'prompts', 'prompt', 'hook', 'hooks', 'api', 'code', 'function', 'class',
      'variable', 'parameter', 'argument', 'return', 'value', 'type',
      'string', 'number', 'boolean', 'array', 'object', 'null', 'undefined',

      // Zeitangaben
      'heute', 'morgen', 'gestern', 'jetzt', 'bald', 'später', 'vorher', 'nachher',
      'immer', 'nie', 'manchmal', 'oft', 'selten', 'usually', 'sometimes', 'never',

      // Zahlen als Wörter
      'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht',
      'neun', 'zehn', 'elf', 'zwölf', 'hundert', 'tausend', 'million',
      'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
      'ten', 'eleven', 'twelve', 'hundred', 'thousand', 'million'
    ]);
  }

  /**
   * Initialisiert alle Erkennungs-Pattern für verschiedene Datentypen
   */
  initializePatterns() {
    return {
      // KRITISCH - Rote Warnungen
      critical: [
        {
          id: 'email',
          pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
          severity: 'critical',
          category: 'pii',
          nameDE: 'E-Mail-Adresse',
          nameEN: 'Email Address',
          descDE: 'E-Mail-Adressen sind personenbezogene Daten (DSGVO Art. 4)',
          descEN: 'Email addresses are personal data (GDPR Art. 4)'
        },
        {
          id: 'iban',
          pattern: /\b[A-Z]{2}[0-9]{2}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{0,2}\b/g,
          severity: 'critical',
          category: 'financial',
          nameDE: 'IBAN',
          nameEN: 'IBAN',
          descDE: 'Bankverbindungen sind hochsensible Finanzdaten',
          descEN: 'Bank account details are highly sensitive financial data'
        },
        {
          id: 'credit_card',
          pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
          severity: 'critical',
          category: 'financial',
          nameDE: 'Kreditkartennummer',
          nameEN: 'Credit Card Number',
          descDE: 'Kreditkartendaten dürfen niemals geteilt werden',
          descEN: 'Credit card data must never be shared'
        },
        {
          id: 'ssn_swiss',
          pattern: /\b756[\s.-]?\d{4}[\s.-]?\d{4}[\s.-]?\d{2}\b/g,
          severity: 'critical',
          category: 'pii',
          nameDE: 'AHV-Nummer (CH)',
          nameEN: 'Swiss Social Security Number (AHV)',
          descDE: 'Schweizer Sozialversicherungsnummer - hochsensibel gemäss DSG',
          descEN: 'Swiss social security number - highly sensitive under DSG'
        },
        {
          id: 'passport',
          pattern: /\b(?:passport|pass|reisepass|ausweis)[\s:]+([A-Z]{1,2}\d{6,9})\b/gi,
          severity: 'critical',
          category: 'pii',
          nameDE: 'Reisepass-/Ausweisnummer',
          nameEN: 'Passport/ID Number',
          descDE: 'Ausweisnummern sind personenbezogene Daten',
          descEN: 'ID numbers are personal data'
        },
        {
          id: 'api_key',
          pattern: /\b(?:api[_-]?key|apikey|access[_-]?token|secret[_-]?key|bearer)[\s:=]+['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
          severity: 'critical',
          category: 'credentials',
          nameDE: 'API-Schlüssel / Token',
          nameEN: 'API Key / Token',
          descDE: 'API-Schlüssel sind geheime Zugangsdaten',
          descEN: 'API keys are secret credentials'
        },
        {
          id: 'password',
          pattern: /\b(?:password|passwort|pwd|kennwort)[\s:=]+['"]?([^\s'"]{6,})['"]?/gi,
          severity: 'critical',
          category: 'credentials',
          nameDE: 'Passwort',
          nameEN: 'Password',
          descDE: 'Passwörter dürfen niemals geteilt werden',
          descEN: 'Passwords must never be shared'
        }
      ],

      // WARNUNG - Orange Warnungen
      warning: [
        {
          id: 'suspicious_number_sequence',
          pattern: /\b\d{3}[.\s-]\d{3}[.\s-]\d{3}[.\s-]\d{2,4}\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Verdächtige Zahlenfolge (mögl. AHV/Versicherungsnummer)',
          nameEN: 'Suspicious Number Sequence (possible SSN/Insurance Number)',
          descDE: 'Diese Zahlenfolge könnte eine AHV-Nummer oder andere Identifikationsnummer sein',
          descEN: 'This number sequence might be a social security or identification number',
          customValidator: (match) => {
            // Filtere echte AHV-Nummern aus (die werden von ssn_swiss erkannt)
            const cleaned = match[0].replace(/[.\s-]/g, '');
            if (cleaned.startsWith('756')) {
              return false; // Echte AHV, wird von ssn_swiss erkannt
            }
            // Nur Zahlenfolgen mit mind. 10 Stellen
            return cleaned.length >= 10;
          }
        },
        {
          id: 'phone_swiss',
          pattern: /(?<=^|\s)(?:\+41|0041|0)[\s-]?(?:\(0\)[\s-]?)?(?:7[6-9]|[2-9]\d)[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b/gm,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Schweizer Telefonnummer',
          nameEN: 'Swiss Phone Number',
          descDE: 'Telefonnummern können zur Identifikation verwendet werden',
          descEN: 'Phone numbers can be used for identification'
        },
        {
          id: 'phone_german',
          pattern: /(?<=^|\s)(?:\+49|0049|0)[\s-]?\d{2,5}[\s-]?\d{3,}[\s-]?\d{2,}\b/gm,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Deutsche Telefonnummer',
          nameEN: 'German Phone Number',
          descDE: 'Telefonnummern können zur Identifikation verwendet werden',
          descEN: 'Phone numbers can be used for identification'
        },
        {
          id: 'phone_intl',
          pattern: /(?<=^|\s)\+\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}\b/gm,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Internationale Telefonnummer',
          nameEN: 'International Phone Number',
          descDE: 'Telefonnummern können zur Identifikation verwendet werden',
          descEN: 'Phone numbers can be used for identification'
        },
        {
          id: 'ip_address',
          pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
          severity: 'warning',
          category: 'technical',
          nameDE: 'IP-Adresse',
          nameEN: 'IP Address',
          descDE: 'IP-Adressen können zur Identifikation verwendet werden (DSGVO)',
          descEN: 'IP addresses can be used for identification (GDPR)',
          customValidator: (match) => {
            // Prüfe ob jedes Oktett im gültigen Bereich 0-255 liegt
            const octets = match[0].split('.');
            return octets.every(octet => {
              const num = parseInt(octet, 10);
              return num >= 0 && num <= 255;
            });
          }
        },
        {
          id: 'zip_swiss',
          pattern: /\b(?:CH-)?[1-9]\d{3}\b/g,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Schweizer PLZ',
          nameEN: 'Swiss ZIP Code',
          descDE: 'Postleitzahlen können Teil einer Adresse sein',
          descEN: 'ZIP codes may be part of an address'
        },
        // NOTE: name_context ist jetzt in der Hybrid-Detection integriert und wird hier DEAKTIVIERT
        // um Doppel-Erkennungen zu vermeiden
        {
          id: 'name_standalone',
          // HYBRID NAME DETECTION - wird in findMatches() speziell behandelt
          pattern: null, // Kein Pattern - nutzt custom Detection
          severity: 'warning',
          category: 'pii',
          nameDE: 'Name (hybrid)',
          nameEN: 'Name (hybrid)',
          descDE: 'Vollständige Namen sind personenbezogene Daten',
          descEN: 'Full names are personal data',
          customDetector: true // Marker für spezielle Behandlung
        },
        {
          id: 'address',
          pattern: /\b\d+[\s,]+[A-ZÄÖÜ][a-zäöüß]+(?:straße|strasse|str\.|weg|gasse|platz|allee|avenue|street|road|way)\b/gi,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Adresse',
          nameEN: 'Address',
          descDE: 'Adressen sind personenbezogene Daten',
          descEN: 'Addresses are personal data'
        },
        {
          id: 'date_of_birth',
          pattern: /\b(?:geboren|born|geburtsdatum|date of birth|dob|geb\.)[\s:]+(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/gi,
          severity: 'warning',
          category: 'pii',
          nameDE: 'Geburtsdatum',
          nameEN: 'Date of Birth',
          descDE: 'Geburtsdaten sind personenbezogene Daten',
          descEN: 'Dates of birth are personal data'
        },
        {
          id: 'company_confidential',
          pattern: /\b(?:vertraulich|confidential|intern|internal|geheim|secret|streng\s+vertraulich|strictly\s+confidential|classified)\b/gi,
          severity: 'warning',
          category: 'business',
          nameDE: 'Vertraulichkeits-Kennzeichnung',
          nameEN: 'Confidentiality Marking',
          descDE: 'Dokument könnte als vertraulich gekennzeichnet sein',
          descEN: 'Document may be marked as confidential'
        },
        {
          id: 'salary',
          pattern: /\b(?:gehalt|salary|lohn|wage|verdienst|einkommen)[\s:]+(?:CHF|EUR|USD|€|\$|Fr\.)?\s*[\d',\.]+\b/gi,
          severity: 'warning',
          category: 'business',
          nameDE: 'Gehaltsangabe',
          nameEN: 'Salary Information',
          descDE: 'Gehaltsinformationen sind sensible Geschäftsdaten',
          descEN: 'Salary information is sensitive business data'
        },
        {
          id: 'money_amount',
          pattern: /\b\d{1,3}(?:['\s]?\d{3})*(?:[.,]\d{1,2})?\s*(?:CHF|EUR|USD|€|\$|Fr\.|Franken|Euro|Dollar)\b/gi,
          severity: 'warning',
          category: 'business',
          nameDE: 'Geldbetrag',
          nameEN: 'Money Amount',
          descDE: 'Geldbeträge können sensible Geschäftsinformationen darstellen',
          descEN: 'Money amounts may represent sensitive business information'
        }
      ]
    };
  }

  /**
   * Initialisiert Übersetzungen für UI-Elemente
   */
  initializeTranslations() {
    return {
      de: {
        critical: 'Kritisch',
        warning: 'Warnung',
        categories: {
          pii: 'Personenbezogene Daten',
          financial: 'Finanzdaten',
          credentials: 'Zugangsdaten',
          technical: 'Technische Daten',
          business: 'Geschäftsdaten'
        },
        status: {
          safe: 'Keine sensiblen Daten erkannt',
          warning: 'Hinweise auf sensible Daten',
          critical: 'Kritische Daten erkannt'
        }
      },
      en: {
        critical: 'Critical',
        warning: 'Warning',
        categories: {
          pii: 'Personal Data',
          financial: 'Financial Data',
          credentials: 'Credentials',
          technical: 'Technical Data',
          business: 'Business Data'
        },
        status: {
          safe: 'No sensitive data detected',
          warning: 'Possible sensitive data detected',
          critical: 'Critical data detected'
        }
      }
    };
  }

  /**
   * Analysiert Text und gibt alle Erkennungen zurück
   * VERSION 2.0.0: Async mit KI-gestützter Erkennung (Transformer.js)
   *
   * @param {string} text - Der zu analysierende Text
   * @param {string} lang - Sprache ('de' oder 'en')
   * @returns {Promise<Object>} Analyse-Ergebnis mit Erkennungen und Status
   */
  async analyze(text, lang = 'de') {
    if (!text || text.trim().length === 0) {
      return {
        status: 'safe',
        detections: [],
        highlightRanges: []
      };
    }

    const detections = [];
    const highlightRanges = [];

    // === PHASE 1: KRITISCHE DATEN (Regex - schnell & zuverlässig) ===
    this.patterns.critical.forEach(patternDef => {
      const matches = this.findMatches(text, patternDef, lang);
      detections.push(...matches);
      highlightRanges.push(...matches.map(m => ({
        start: m.start,
        end: m.end,
        severity: m.severity,
        id: m.id,
        text: m.match
      })));
    });

    // === PHASE 2: WARN-PATTERN (Mix aus Regex & NER) ===

    // 2a) Sammle Dates mit NER für PLZ-Unterscheidung
    let detectedDates = [];
    let entities = { persons: [], dates: [], locations: [] }; // Initialisiere entities
    if (this.nerEnabled) {
      try {
        entities = await this.nerDetector.detectAll(text);
        detectedDates = entities.dates || [];

        // 2b) Namen mit NER (ersetzt detectNamesHybrid!)
        if (entities.persons && entities.persons.length > 0) {
          console.log('[AI Compliance] NER Namen erkannt:', entities.persons.map(p => p.text));

          entities.persons.forEach(person => {
            detections.push({
              id: 'name_ner',
              severity: 'warning',
              category: 'pii',
              name: lang === 'de' ? 'Name (KI)' : 'Name (AI)',
              description: lang === 'de'
                ? `Vollständige Namen sind personenbezogene Daten (erkannt mit KI, Konfidenz: ${Math.round(person.score * 100)}%)`
                : `Full names are personal data (detected with AI, confidence: ${Math.round(person.score * 100)}%)`,
              match: person.text,
              start: person.start,
              end: person.end
            });

            highlightRanges.push({
              start: person.start,
              end: person.end,
              severity: 'warning',
              id: 'name_ner',
              text: person.text
            });
          });

          this.nerAvailable = true;
        }
      } catch (error) {
        console.warn('[AI Compliance] NER nicht verfügbar, verwende Fallback:', error.message);
        this.nerAvailable = false;
      }
    }

    // 2c) Andere Warning-Patterns (außer Namen & PLZ)
    this.patterns.warning.forEach(patternDef => {
      // Namen: Verwende Regex als Fallback wenn NER keine Namen gefunden hat
      if (patternDef.id === 'name_standalone' && this.nerAvailable) {
        // Prüfe ob NER Namen gefunden hat
        const nerFoundNames = entities.persons && entities.persons.length > 0;
        if (nerFoundNames) {
          console.log('[AI Compliance] Überspringe Regex-Namen, NER hat Namen erkannt');
          return;
        }
        // Falls NER keine Namen fand, nutze Regex-Fallback
        console.log('[AI Compliance] NER fand keine Namen, nutze Regex-Fallback');
      }

      // PLZ mit Date-Filterung
      if (patternDef.id === 'zip_swiss') {
        const zipMatches = this.findMatches(text, patternDef, lang);

        // Filtere Zahlen die als DATE erkannt wurden (Jahrgänge!)
        const validZips = zipMatches.filter(zip => {
          const zipText = zip.match.toString();

          // Prüfe ob diese Zahl in den erkannten Dates vorkommt
          const isDate = detectedDates.some(date => {
            return date.text.includes(zipText) ||
                   (date.start <= zip.start && date.end >= zip.end);
          });

          if (isDate) {
            console.log(`[AI Compliance] ${zipText} ist ein Datum, KEINE PLZ`);
            return false;
          }

          return true;
        });

        detections.push(...validZips);
        highlightRanges.push(...validZips.map(m => ({
          start: m.start,
          end: m.end,
          severity: m.severity,
          id: m.id,
          text: m.match
        })));
      } else {
        // Alle anderen Patterns normal
        const matches = this.findMatches(text, patternDef, lang);
        detections.push(...matches);
        highlightRanges.push(...matches.map(m => ({
          start: m.start,
          end: m.end,
          severity: m.severity,
          id: m.id,
          text: m.match
        })));
      }
    });

    // FALLBACK: Wenn NER nicht verfügbar, nutze alte Hybrid-Detection
    if (!this.nerAvailable && this.nerEnabled) {
      console.log('[AI Compliance] Fallback: Nutze Regex-basierte Namenserkennung');

      const namePattern = this.patterns.warning.find(p => p.id === 'name_standalone');
      if (namePattern) {
        const nameMatches = this.findMatches(text, namePattern, lang);
        detections.push(...nameMatches);
        highlightRanges.push(...nameMatches.map(m => ({
          start: m.start,
          end: m.end,
          severity: m.severity,
          id: m.id,
          text: m.match
        })));
      }
    }

    // Bestimme Gesamt-Status
    let status = 'safe';
    if (detections.some(d => d.severity === 'critical')) {
      status = 'critical';
    } else if (detections.some(d => d.severity === 'warning')) {
      status = 'warning';
    }

    // Gruppiere Erkennungen (verhindert Duplikate in der UI)
    const groupedDetections = this.groupDetections(detections);

    return {
      status,
      detections: groupedDetections,
      highlightRanges: this.sortRanges(highlightRanges),
      // Für Backward-Kompatibilität: Flache Liste
      detectionsFlat: detections
    };
  }

  /**
   * Findet alle Matches für ein Pattern im Text
   */
  findMatches(text, patternDef, lang) {
    // Spezial-Behandlung für Custom Detectors (z.B. Hybrid Name Detection)
    if (patternDef.customDetector) {
      return this.detectNamesHybrid(text, patternDef, lang);
    }

    const matches = [];
    const regex = new RegExp(patternDef.pattern.source, patternDef.pattern.flags);
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Wenn Pattern einen Custom Validator hat, prüfe ihn
      if (patternDef.customValidator) {
        if (!patternDef.customValidator(match, this)) {
          continue; // Skip diesen Match
        }
      }

      matches.push({
        id: patternDef.id,
        severity: patternDef.severity,
        category: patternDef.category,
        name: lang === 'de' ? patternDef.nameDE : patternDef.nameEN,
        description: lang === 'de' ? patternDef.descDE : patternDef.descEN,
        match: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return matches;
  }

  /**
   * Entfernt duplizierte Erkennungen
   * DEPRECATED: Wird durch groupDetections() ersetzt
   */
  deduplicateDetections(detections) {
    const seen = new Set();
    return detections.filter(d => {
      const key = `${d.start}-${d.end}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Gruppiert Erkennungen basierend auf Position und Text
   * Verhindert mehrfache Zeilen für dasselbe erkannte Objekt
   *
   * @param {Array} detections - Flache Liste von Erkennungen
   * @returns {Array} - Gruppierte Erkennungen mit Observations
   */
  groupDetections(detections) {
    const groups = new Map();

    detections.forEach(detection => {
      // Gruppierungs-Schlüssel: Position + Text
      const key = `${detection.start}-${detection.end}-${detection.match}`;

      if (!groups.has(key)) {
        // Neue Gruppe erstellen
        groups.set(key, {
          id: `detection-${groups.size + 1}`,
          match: detection.match,
          start: detection.start,
          end: detection.end,
          // Höchste Severity der Gruppe
          severity: detection.severity,
          // Alle verschiedenen Beobachtungen
          observations: []
        });
      }

      const group = groups.get(key);

      // Füge Beobachtung hinzu
      group.observations.push({
        type: detection.id,
        name: detection.name,
        description: detection.description,
        severity: detection.severity,
        category: detection.category
      });

      // Update Severity auf höchste (critical > warning)
      if (detection.severity === 'critical') {
        group.severity = 'critical';
      } else if (detection.severity === 'warning' && group.severity !== 'critical') {
        group.severity = 'warning';
      }
    });

    // Konvertiere Map zu Array und sortiere nach Position
    return Array.from(groups.values()).sort((a, b) => a.start - b.start);
  }

  /**
   * Sortiert Ranges nach Start-Position und merged overlapping ranges
   */
  sortRanges(ranges) {
    if (ranges.length === 0) {
      return ranges;
    }

    // Sortiere nach Start-Position
    const sorted = ranges.sort((a, b) => a.start - b.start);

    // Merge overlapping ranges
    const merged = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      // Prüfe ob current und last überlappen oder aneinandergrenzen
      if (current.start <= last.end) {
        // Overlapping oder angrenzend - merge sie
        // Wähle die höhere Severity
        const severity = (last.severity === 'critical' || current.severity === 'critical')
          ? 'critical'
          : 'warning';

        // Erweitere den letzten Range
        merged[merged.length - 1] = {
          start: Math.min(last.start, current.start),
          end: Math.max(last.end, current.end),
          severity: severity,
          id: last.id, // Behalte ID des ersten
          text: last.text // Behalte Text des ersten
        };
      } else {
        // Kein Overlap - füge als neuen Range hinzu
        merged.push(current);
      }
    }

    return merged;
  }

  /**
   * HYBRID NAME DETECTION
   * Sliding-Window-Ansatz ohne Regex-Overlaps
   * Erkennt sowohl GROß als auch klein (mit Lexicon)
   */
  detectNamesHybrid(text, patternDef, lang) {
    const candidates = [];

    // Schritt 1: Extrahiere ALLE Wörter mit Positionen
    const allWords = [];
    const wordRegex = /\b([A-ZÄÖÜa-zäöüß][a-zäöüß]{1,})\b/g;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
      const word = match[1];
      const wordLower = word.toLowerCase();

      // Skip Blacklist
      if (this.nameBlacklist.has(wordLower)) continue;

      allWords.push({
        text: word,
        lower: wordLower,
        start: match.index,
        end: match.index + word.length,
        isCapitalized: /^[A-ZÄÖÜ]/.test(word),
        isInLexicon: this.commonFirstNames.has(wordLower)
      });
    }

    // Schritt 2: Sliding Window - teste 1-5 Wort Kombinationen
    for (let i = 0; i < allWords.length; i++) {
      // 1-Wort-Kandidat (Einzelname wie "Peter")
      const w1 = allWords[i];
      this.addNameCandidate(candidates, text, [w1]);

      // 2-Wort-Kombination
      if (i + 1 < allWords.length) {
        const w1 = allWords[i];
        const w2 = allWords[i + 1];

        // Prüfe ob Wörter direkt aufeinander folgen (max 1 Space)
        if (w2.start - w1.end <= 1) {
          this.addNameCandidate(candidates, text, [w1, w2]);
        }
      }

      // 3-Wort-Kombination
      if (i + 2 < allWords.length) {
        const w1 = allWords[i];
        const w2 = allWords[i + 1];
        const w3 = allWords[i + 2];

        // Alle 3 Wörter müssen aufeinander folgen
        if (w2.start - w1.end <= 1 && w3.start - w2.end <= 1) {
          this.addNameCandidate(candidates, text, [w1, w2, w3]);
        }
      }

      // 4-Wort-Kombination (für Namen-Listen)
      if (i + 3 < allWords.length) {
        const words = [allWords[i], allWords[i + 1], allWords[i + 2], allWords[i + 3]];

        // Alle 4 Wörter müssen aufeinander folgen
        if (words[1].start - words[0].end <= 1 &&
            words[2].start - words[1].end <= 1 &&
            words[3].start - words[2].end <= 1) {
          this.addNameCandidate(candidates, text, words);
        }
      }

      // 5-Wort-Kombination (für lange Namen-Listen)
      if (i + 4 < allWords.length) {
        const words = [allWords[i], allWords[i + 1], allWords[i + 2], allWords[i + 3], allWords[i + 4]];

        // Alle 5 Wörter müssen aufeinander folgen
        if (words[1].start - words[0].end <= 1 &&
            words[2].start - words[1].end <= 1 &&
            words[3].start - words[2].end <= 1 &&
            words[4].start - words[3].end <= 1) {
          this.addNameCandidate(candidates, text, words);
        }
      }
    }

    // Schritt 3: Kontext-basierte Erkennung für kleingeschriebene Namen
    const contextPattern = /(?:name|kontakt|contact|person|mitarbeiter|employee|kunde|customer)[\s:]+([a-zäöüß]+(?:\s+[a-zäöüß]+){1,2})\b/gi;

    while ((match = contextPattern.exec(text)) !== null) {
      const name = match[1];
      const startPos = match.index + match[0].indexOf(name);
      const endPos = startPos + name.length;
      const words = name.split(/\s+/);

      // Blacklist
      if (words.some(w => this.nameBlacklist.has(w))) continue;

      // Mindestens ein bekannter Vorname
      if (words.some(w => this.commonFirstNames.has(w))) {
        candidates.push({
          text: name,
          start: startPos,
          end: endPos,
          score: 20, // SEHR hoch wegen Kontext!
          source: 'context-lowercase'
        });
      }
    }

    // Schritt 4: Wähle beste non-overlapping Kandidaten
    const selected = this.selectBestNonOverlappingNames(candidates);

    // Konvertiere zu Match-Format
    return selected.map(candidate => ({
      id: patternDef.id,
      severity: patternDef.severity,
      category: patternDef.category,
      name: lang === 'de' ? patternDef.nameDE : patternDef.nameEN,
      description: lang === 'de' ? patternDef.descDE : patternDef.descEN,
      match: candidate.text,
      start: candidate.start,
      end: candidate.end
    }));
  }

  /**
   * Fügt einen Namen-Kandidaten hinzu mit Scoring
   *
   * VERSION 1.0.10 - Artikel-Check hinzugefügt
   */
  addNameCandidate(candidates, text, words) {
    const first = words[0];
    const last = words[words.length - 1];
    const startPos = first.start;
    const endPos = last.end;
    const fullText = text.substring(startPos, endPos);

    // Prüfe Kontext VORHER
    const contextStart = Math.max(0, startPos - 50);
    const contextBefore = text.substring(contextStart, startPos).toLowerCase();
    const hasContext = /(?:name|kontakt|contact|person|mitarbeiter|employee|kunde|customer|patient|student|benutzer|user|herr|frau|mr|mrs|ms)[\s:]+$/.test(contextBefore);

    // === NEUE REGEL: Deutsche Artikel-Check ===
    // "Die Zukunft", "der Hook", "aus Ihrer", etc. → SOFORT ABLEHNEN
    const hasArticleBefore = /\b(?:der|die|das|den|dem|des|ein|eine|einer|einem|einen|eines)\s+$/i.test(contextBefore);

    if (hasArticleBefore && !hasContext) {
      // Artikel ohne Name-Kontext → KEIN Name!
      return; // Kandidat wird NICHT hinzugefügt
    }

    // Scoring
    const score = this.scoreNameCandidateV2(words, hasContext, startPos === 0);

    if (score.total >= score.threshold) {
      candidates.push({
        text: fullText,
        start: startPos,
        end: endPos,
        score: score.total,
        source: score.source
      });
    }
  }

  /**
   * Scoring V2 - arbeitet mit Word-Objekten statt Strings
   *
   * VERSION 1.0.10 - Smart Fix für False Positives:
   * - Lexicon-Pflicht: Mind. 1 Wort muss im Lexicon sein (ohne Kontext)
   * - 2-Stufen-Threshold: Mit Lexicon 10, ohne Lexicon 18
   * - Base Threshold erhöht: 8 → 10
   */
  scoreNameCandidateV2(words, hasContext, isAtStart) {
    let score = 0;
    let source = '';

    // Anzahl bekannte Vornamen
    const knownCount = words.filter(w => w.isInLexicon).length;
    const allCapitalized = words.every(w => w.isCapitalized);
    const allLowercase = words.every(w => !w.isCapitalized);

    // === NEUE REGEL: Ohne Kontext MUSS mind. 1 Wort im Lexicon sein! ===
    if (!hasContext && knownCount === 0) {
      // SOFORT ABLEHNEN - verhindert "Relationship Management", "Die Zukunft", etc.
      return {
        total: 0,
        threshold: 18,
        source: 'rejected-no-lexicon'
      };
    }

    // === SCORING ===

    // Kontext
    if (hasContext) {
      score += 10;
      source = 'context';
    }

    // Lexicon
    if (knownCount === words.length) {
      score += 8;
      source = source || 'lexicon-full';
    } else if (knownCount > 0) {
      score += 5;
      source = source || 'lexicon-partial';
    }

    // Erstes Wort ist Vorname
    if (words[0].isInLexicon) {
      score += 3;
    }

    // Kapitalisierung
    if (allCapitalized) {
      score += 3;
    } else if (allLowercase && hasContext) {
      score += 2;
    } else if (allLowercase && !hasContext) {
      score -= 5;
    }

    // Wortanzahl
    if (words.length === 1) {
      // Einzelname (z.B. "Peter")
      if (knownCount === 1) {
        // Im Lexicon -> sehr wahrscheinlich ein Name
        if (hasContext) {
          score += 6; // "Name: Peter"
        } else if (allCapitalized) {
          score += 4; // "Peter" am Satzanfang oder alleinstehend
        } else {
          score += 2; // "peter" kleingeschrieben
        }
      } else {
        // Nicht im Lexicon
        if (hasContext) {
          score += 3; // Kontext hilft
        } else {
          score -= 3; // Wahrscheinlich kein Name
        }
      }
    } else if (words.length === 2) {
      score += 2;
    } else if (words.length === 3) {
      // 3-Wort-Namen: Unterstütze Listen UND Kontext-Namen
      if (knownCount === 3) {
        // Alle 3 Wörter im Lexicon - sehr wahrscheinlich ein Name
        if (hasContext) {
          score += 5; // "Name: Hans Peter Müller"
        } else {
          score += 2; // "Hans Peter Tristan" in einer Liste
        }
      } else if (knownCount === 2) {
        // 2 von 3 im Lexicon
        if (hasContext) {
          score += 3;
        } else {
          score += 1;
        }
      } else if (knownCount === 1) {
        // Nur 1 im Lexicon
        if (hasContext) {
          score += 1;
        } else {
          score -= 2; // Leichte Penalty
        }
      } else {
        // Kein Wort im Lexicon
        score -= 5;
      }
    } else if (words.length >= 4) {
      // 4+ Wort-Namen: Sehr selten, aber möglich bei Listen
      const ratio = knownCount / words.length;
      if (ratio >= 0.75) {
        // Mind. 75% im Lexicon
        score += hasContext ? 4 : 2;
      } else if (ratio >= 0.5) {
        // Mind. 50% im Lexicon
        score += hasContext ? 2 : 0;
      } else {
        // Weniger als 50%
        score -= 3;
      }
    }

    // Position
    if (isAtStart && allCapitalized) {
      score += 2;
    }

    // Wortlängen
    words.forEach(w => {
      const len = w.text.length;
      if (len >= 3 && len <= 15) score += 1;
      if (len < 2 || len > 20) score -= 3;
      if (/\d/.test(w.text)) score -= 10;
    });

    // === THRESHOLD (2-Stufen-System) ===
    let threshold;

    if (knownCount > 0) {
      // Mit Lexicon-Match: Threshold 10 (erhöht von 8)
      threshold = 10;
    } else {
      // Ohne Lexicon-Match: Threshold 18 (fast unmöglich ohne Kontext)
      threshold = 18;
    }

    // Strenger bei kleingeschrieben ohne Kontext
    if (allLowercase && !hasContext) {
      threshold = 15;
    }

    // Strenger bei "beide Vornamen ohne Kontext mitten im Text"
    if (words.length === 2 && knownCount === 2 && !hasContext && !isAtStart) {
      score -= 5;
      threshold = 12;
    }

    return {
      total: score,
      threshold: threshold,
      source: source || 'heuristic'
    };
  }

  /**
   * Wählt beste non-overlapping Namen-Kandidaten
   * Verwendet Greedy-Algorithmus: Höchster Score zuerst, skippe Overlaps
   */
  selectBestNonOverlappingNames(candidates) {
    if (candidates.length === 0) return [];

    // Sortiere nach Score (höchste zuerst)
    const sorted = candidates.sort((a, b) => b.score - a.score);

    const selected = [];

    for (const candidate of sorted) {
      // Prüfe ob dieser Kandidat mit bereits ausgewählten überlappt
      const hasOverlap = selected.some(s => {
        return !(candidate.end <= s.start || candidate.start >= s.end);
      });

      if (!hasOverlap) {
        selected.push(candidate);
      }
    }

    // Sortiere Ergebnis nach Position im Text
    return selected.sort((a, b) => a.start - b.start);
  }

  /**
   * Heuristische Analyse ob Text wahrscheinlich ein Name ist
   * Verwendet Scoring-System mit mehreren Faktoren
   *
   * @param {string} fullMatch - Der komplette Match inkl. Whitespace
   * @param {string} name - Der extrahierte Name
   * @returns {boolean} true wenn wahrscheinlich ein Name
   */
  analyzeNameHeuristics(fullMatch, name) {
    let score = 0;
    const words = name.split(/\s+/);

    // NEGATIVER SCORE: Blacklist-Check (sofort ablehnen)
    const isBlacklisted = words.some(word =>
      this.nameBlacklist.has(word.toLowerCase())
    );
    if (isBlacklisted) {
      return false; // Sofort ablehnen
    }

    // NEGATIVER SCORE: Am Satzanfang (könnte beliebiges Wort sein)
    if (/^[.!?]\s+/.test(fullMatch)) {
      score -= 3;
    }

    // NEGATIVER SCORE: Nur ein Wort (zu unspezifisch)
    if (words.length === 1) {
      score -= 5;
    }

    // POSITIVER SCORE: Anzahl Wörter (2-3 ist typisch für Namen)
    if (words.length === 2) {
      score += 3; // Vorname + Nachname
    } else if (words.length === 3) {
      score += 2; // Vorname + Mittelname + Nachname
    }

    // Analysiere jedes Wort
    words.forEach((word, index) => {
      const lowerWord = word.toLowerCase();
      const wordLength = word.length;

      // POSITIVER SCORE: Erstes Wort ist häufiger Vorname
      if (index === 0 && this.commonFirstNames.has(lowerWord)) {
        score += 5; // Starker Indikator!
      }

      // POSITIVER SCORE: Irgendein Wort ist bekannter Vorname
      if (this.commonFirstNames.has(lowerWord)) {
        score += 3;
      }

      // POSITIVER SCORE: Korrekte Kapitalisierung (Erster Buchstabe groß)
      if (/^[A-ZÄÖÜ][a-zäöüß]+$/.test(word)) {
        score += 1;
      }

      // POSITIVER SCORE: Typische Namenslänge (3-15 Zeichen)
      if (wordLength >= 3 && wordLength <= 15) {
        score += 1;
      }

      // NEGATIVER SCORE: Sehr kurz (< 2 Zeichen) oder sehr lang (> 20)
      if (wordLength < 2 || wordLength > 20) {
        score -= 2;
      }

      // NEGATIVER SCORE: Enthält Zahlen (Namen haben keine Zahlen)
      if (/\d/.test(word)) {
        score -= 5;
      }

      // NEGATIVER SCORE: Enthält Sonderzeichen (außer Umlaute)
      if (/[^A-Za-zÄÖÜäöüß]/.test(word)) {
        score -= 3;
      }
    });

    // KONTEXT-ANALYSE: Prüfe Text vor dem Namen
    const contextBefore = fullMatch.substring(0, fullMatch.indexOf(name)).toLowerCase();
    const hasContext = /(?:name|kontakt|contact|person|mitarbeiter|employee|kunde|customer|patient|student|benutzer|user|herr|frau|mr|mrs|ms)[\s:]+$/.test(contextBefore);

    // POSITIVER SCORE: Nach Kontext-Wörtern
    if (hasContext) {
      score += 4;
    }

    // SPEZIAL-REGEL: Beide Wörter sind Vornamen
    if (words.length === 2) {
      const [first, second] = words.map(w => w.toLowerCase());
      const bothAreFirstNames = this.commonFirstNames.has(first) && this.commonFirstNames.has(second);

      if (bothAreFirstNames) {
        if (hasContext) {
          // MIT Kontext: Klar ein Doppelname wie "Name: Hans Peter"
          score += 5;
        } else {
          // OHNE Kontext: Könnte Overlap sein
          // Prüfe ob am Textanfang (= okay) oder mitten im Text (= verdächtig)
          const isAtStart = fullMatch.trimStart() === fullMatch; // Kein Whitespace davor

          if (isAtStart) {
            // Am Textanfang: Wahrscheinlich echter Name
            score += 2;
          } else {
            // Mitten im Text ohne Kontext: SEHR verdächtig (Overlap!)
            score -= 8; // STARKE PENALTY - verhindert "Peter Tristan" Overlaps!
          }
        }
      }
    }

    // ENTSCHEIDUNG:
    // - Normaler Threshold: 5
    // - Beide Vornamen ohne Kontext: Threshold 10 (SEHR streng, verhindert Overlaps!)
    let threshold = 5;
    if (words.length === 2) {
      const [first, second] = words.map(w => w.toLowerCase());
      if (this.commonFirstNames.has(first) && this.commonFirstNames.has(second) && !hasContext) {
        threshold = 10; // SEHR streng für potentielle Overlaps wie "Peter Tristan"
      }
    }

    const isLikelyName = score >= threshold;

    // DEBUG (kann später entfernt werden)
    if (isLikelyName) {
      console.log(`[AICC Name Heuristic] "${name}" -> Score: ${score} (threshold: ${threshold}) ✓ DETECTED`);
    }

    return isLikelyName;
  }

  /**
   * Holt Übersetzung für gegebenen Schlüssel
   */
  t(key, lang = 'de') {
    const keys = key.split('.');
    let value = this.translations[lang];

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }

    return value;
  }
}

// Export für ES Modules (wird von Rollup gebündelt)
export { ComplianceDetector };

// Fallback für globales window-Object
if (typeof window !== 'undefined') {
  window.ComplianceDetector = ComplianceDetector;
}
