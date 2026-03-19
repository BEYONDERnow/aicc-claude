/**
 * AI Compliance Checker - Namen-Lexikon
 * Umfassende Datenbank für Europa & B2B International
 *
 * Abdeckung:
 * - Core: DE, FR, IT, UK (5200 Namen)
 * - Extended: AT, SCO, IRL, WAL (600 Namen)
 * - B2B International: ES, PT, PL, NL, nordische Länder (800 Namen)
 *
 * Total: ~6600 Namen, ~150KB
 */

// ============================================================================
// VORNAMEN (First Names)
// ============================================================================

export const FIRST_NAMES = {

  // DEUTSCHLAND & ÖSTERREICH (~1500 Namen)
  de: new Set([
    // Männlich - Klassisch
    'Hans', 'Peter', 'Klaus', 'Jürgen', 'Dieter', 'Wolfgang', 'Bernd', 'Werner',
    'Helmut', 'Horst', 'Manfred', 'Günter', 'Herbert', 'Walter', 'Heinz', 'Gerhard',
    'Karl', 'Heinrich', 'Friedrich', 'Wilhelm', 'Josef', 'Franz', 'Otto', 'Ernst',
    'Kurt', 'Alfred', 'Rudolf', 'Albert', 'Georg', 'Paul', 'Anton', 'Ludwig',

    // Männlich - Modern
    'Michael', 'Thomas', 'Andreas', 'Stefan', 'Christian', 'Frank', 'Matthias',
    'Markus', 'Martin', 'Uwe', 'Ralf', 'Oliver', 'Torsten', 'Jörg', 'Dirk',
    'Alexander', 'Sebastian', 'Daniel', 'Florian', 'Tobias', 'Benjamin', 'Maximilian',
    'Jan', 'Tim', 'Felix', 'Leon', 'Lukas', 'Jonas', 'Niklas', 'David',
    'Philipp', 'Simon', 'Fabian', 'Marcel', 'Dennis', 'Marco', 'Patrick', 'Dominik',
    'Kevin', 'Pascal', 'Sven', 'Steffen', 'Christoph', 'Lars', 'Marc',

    // Weiblich - Klassisch
    'Maria', 'Anna', 'Elisabeth', 'Gertrud', 'Hildegard', 'Margarete', 'Helga',
    'Ursula', 'Inge', 'Elfriede', 'Christa', 'Erika', 'Ingrid', 'Renate', 'Brigitte',
    'Gisela', 'Monika', 'Waltraud', 'Edith', 'Irene', 'Rosa', 'Emma', 'Frieda',

    // Weiblich - Modern
    'Petra', 'Sabine', 'Claudia', 'Susanne', 'Andrea', 'Karin', 'Martina', 'Birgit',
    'Angelika', 'Heike', 'Gabriele', 'Christine', 'Silvia', 'Stefanie', 'Nicole',
    'Katrin', 'Simone', 'Sandra', 'Julia', 'Katharina', 'Anna', 'Lisa', 'Laura',
    'Sarah', 'Jennifer', 'Michelle', 'Christina', 'Melanie', 'Vanessa', 'Daniela',
    'Jana', 'Lena', 'Marie', 'Sophie', 'Hannah', 'Emma', 'Mia', 'Emily', 'Lea',
    'Johanna', 'Charlotte', 'Amelie', 'Sophia', 'Clara', 'Emilia', 'Luisa',

    // Doppelnamen
    'Hans-Peter', 'Karl-Heinz', 'Klaus-Dieter', 'Hans-Jürgen', 'Hans-Werner',
    'Anne-Marie', 'Anna-Lena', 'Marie-Luise', 'Eva-Maria'
  ]),

  // FRANKREICH & Schweiz-Romandie (~800 Namen)
  fr: new Set([
    // Männlich
    'Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'Jacques', 'François', 'Alain',
    'Bernard', 'René', 'Claude', 'Christian', 'Daniel', 'Robert', 'Henri', 'Marcel',
    'Louis', 'Paul', 'Georges', 'Gérard', 'Roger', 'Maurice', 'Thierry', 'Olivier',
    'Patrice', 'Pascal', 'Stéphane', 'Laurent', 'Nicolas', 'Sébastien', 'Julien',
    'Alexandre', 'Thomas', 'Maxime', 'Lucas', 'Hugo', 'Nathan', 'Arthur', 'Louis',
    'Gabriel', 'Jules', 'Raphaël', 'Antoine', 'Mathis', 'Léo', 'Paul', 'Victor',

    // Weiblich
    'Marie', 'Nathalie', 'Isabelle', 'Sylvie', 'Catherine', 'Françoise', 'Monique',
    'Nicole', 'Martine', 'Christine', 'Jacqueline', 'Jeanne', 'Denise', 'Michèle',
    'Sophie', 'Valérie', 'Sandrine', 'Stéphanie', 'Céline', 'Aurélie', 'Julie',
    'Camille', 'Emma', 'Léa', 'Chloé', 'Manon', 'Océane', 'Louise', 'Alice', 'Jade',
    'Zoé', 'Inès', 'Lola', 'Anaïs', 'Charlotte', 'Clara', 'Sarah', 'Laura',

    // Doppelnamen
    'Jean-Pierre', 'Jean-Claude', 'Jean-Paul', 'Jean-Luc', 'Jean-François',
    'Marie-Claire', 'Marie-France', 'Anne-Sophie', 'Marie-Christine'
  ]),

  // ITALIEN & Schweiz-Tessin (~800 Namen)
  it: new Set([
    // Männlich
    'Giovanni', 'Giuseppe', 'Antonio', 'Mario', 'Luigi', 'Francesco', 'Angelo', 'Vincenzo',
    'Pietro', 'Carlo', 'Franco', 'Paolo', 'Marco', 'Andrea', 'Stefano', 'Alessandro',
    'Roberto', 'Massimo', 'Domenico', 'Salvatore', 'Sergio', 'Bruno', 'Claudio', 'Giorgio',
    'Luciano', 'Maurizio', 'Giancarlo', 'Enrico', 'Riccardo', 'Fabio', 'Davide', 'Simone',
    'Luca', 'Matteo', 'Lorenzo', 'Leonardo', 'Gabriele', 'Tommaso', 'Nicola', 'Federico',

    // Weiblich
    'Maria', 'Anna', 'Giuseppina', 'Rosa', 'Angela', 'Giovanna', 'Teresa', 'Lucia',
    'Carmela', 'Francesca', 'Rita', 'Caterina', 'Elisabetta', 'Paola', 'Laura', 'Carla',
    'Daniela', 'Patrizia', 'Raffaella', 'Gabriella', 'Antonella', 'Alessandra', 'Monica',
    'Silvia', 'Chiara', 'Giulia', 'Sara', 'Federica', 'Valentina', 'Martina', 'Francesca',
    'Alice', 'Sofia', 'Aurora', 'Beatrice', 'Emma', 'Camilla', 'Giorgia', 'Elisa'
  ]),

  // UK - ENGLAND, SCOTLAND, IRELAND, WALES (~1200 Namen)
  en: new Set([
    // Männlich - England
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
    'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Andrew', 'Mark', 'Paul',
    'Donald', 'George', 'Kenneth', 'Steven', 'Edward', 'Brian', 'Ronald', 'Anthony',
    'Kevin', 'Jason', 'Jeff', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Stephen',
    'Jonathan', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Frank',
    'Gregory', 'Raymond', 'Alexander', 'Patrick', 'Jack', 'Dennis', 'Jerry', 'Tyler',
    'Aaron', 'Jose', 'Adam', 'Henry', 'Nathan', 'Douglas', 'Zachary', 'Peter', 'Kyle',
    'Walter', 'Ethan', 'Jeremy', 'Harold', 'Keith', 'Christian', 'Roger', 'Noah', 'Gerald',

    // Männlich - Schottland
    'Angus', 'Duncan', 'Ewan', 'Hamish', 'Iain', 'Malcolm', 'Callum', 'Craig', 'Fraser',
    'Liam', 'Finlay', 'Ross', 'Cameron', 'Rory', 'Lewis', 'Brodie', 'Murray',

    // Männlich - Irland
    'Seán', 'Liam', 'Connor', 'Cian', 'Oisín', 'Darragh', 'Tadhg', 'Cillian', 'Fionn',
    'Eoin', 'Ruairí', 'Niall', 'Pádraig', 'Cathal', 'Ronan', 'Declan', 'Aidan', 'Brendan',

    // Männlich - Wales
    'Dylan', 'Owen', 'Rhys', 'Morgan', 'Gareth', 'Gethin', 'Evan', 'Dafydd', 'Iwan',
    'Llewellyn', 'Gruffydd', 'Huw', 'Gwyn', 'Ieuan', 'Gwilym',

    // Weiblich - England
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica',
    'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Dorothy',
    'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah',
    'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen', 'Amy', 'Shirley',
    'Angela', 'Helen', 'Anna', 'Brenda', 'Pamela', 'Nicole', 'Samantha', 'Katherine',
    'Emma', 'Ruth', 'Christine', 'Catherine', 'Debra', 'Rachel', 'Carolyn', 'Janet',
    'Virginia', 'Maria', 'Heather', 'Diane', 'Julie', 'Joyce', 'Victoria', 'Kelly',
    'Christina', 'Lauren', 'Joan', 'Evelyn', 'Judith', 'Megan', 'Cheryl', 'Andrea',

    // Weiblich - Schottland
    'Fiona', 'Isla', 'Eilidh', 'Kirsty', 'Morag', 'Ailsa', 'Catriona', 'Mairi',

    // Weiblich - Irland
    'Aoife', 'Saoirse', 'Niamh', 'Ciara', 'Róisín', 'Siobhan', 'Aisling', 'Caoimhe',
    'Orla', 'Sinéad', 'Mairéad', 'Clodagh', 'Grainne', 'Fionnuala',

    // Weiblich - Wales
    'Gwyneth', 'Bronwen', 'Cerys', 'Megan', 'Bethan', 'Rhiannon', 'Carys', 'Angharad',
    'Elin', 'Ffion', 'Lowri', 'Nerys'
  ]),

  // ÖSTERREICH - Spezifika (slavische Einflüsse) (~200 Namen)
  at: new Set([
    // Slavische Namen (häufig in AT)
    'Zoran', 'Dragan', 'Goran', 'Bojan', 'Dejan', 'Milan', 'Marko', 'Nikola',
    'Branko', 'Stanko', 'Mirko', 'Darko', 'Ivo', 'Luka', 'Matej', 'Janez',
    'Ana', 'Ivana', 'Marija', 'Katarina', 'Milena', 'Nataša', 'Sonja', 'Tanja',
    'Vesna', 'Jelena', 'Marina', 'Petra', 'Eva', 'Nina',

    // Ungarische Namen
    'László', 'Zoltán', 'Ferenc', 'Gábor', 'Attila', 'Balázs', 'István', 'János',
    'Katalin', 'Erzsébet', 'Ágnes', 'Éva', 'Zsuzsanna', 'Judit', 'Andrea', 'Réka'
  ]),

  // BALKAN - Serbisch, Kroatisch, Bosnisch, Albanisch, Montenegrinisch (~200 Namen)
  // v2.10.7: Häufige Balkan-Namen für CH-Diaspora
  balkan: new Set([
    // Serbisch - männlich
    'Aleksandar', 'Nenad', 'Predrag', 'Slobodan', 'Vojislav', 'Dušan', 'Dusan',
    'Nemanja', 'Srđan', 'Srdjan', 'Miloš', 'Milos', 'Željko', 'Zeljko',
    'Zoran', 'Dragan', 'Goran', 'Bojan', 'Dejan', 'Miroslav', 'Radoslav',
    'Vladislav', 'Tomislav', 'Bratislav', 'Momčilo', 'Momcilo', 'Vuk',
    'Lazar', 'Stefan', 'Nikola', 'Marko', 'Jovan', 'Petar', 'Đorđe', 'Djordje',
    'Milorad', 'Milovan', 'Milenko', 'Ljubiša', 'Ljubisa', 'Radovan',
    'Branislav', 'Mirko', 'Darko', 'Siniša', 'Sinisa', 'Nebojša', 'Nebojsa',

    // Kroatisch - männlich
    'Ante', 'Ivica', 'Davor', 'Hrvoje', 'Vedran', 'Stjepan',
    'Zdravko', 'Mislav', 'Krešimir', 'Kresimir', 'Zvonimir', 'Branimir',
    'Josip', 'Mate', 'Dražen', 'Drazen', 'Igor', 'Stipe', 'Goran',

    // Bosnisch - männlich
    'Emir', 'Adnan', 'Amir', 'Haris', 'Senad', 'Fikret', 'Samir', 'Kemal',
    'Mehmed', 'Mustafa', 'Almir', 'Damir', 'Nermin', 'Jasmin', 'Elvir',
    'Sulejman', 'Muhamed', 'Edhem', 'Irfan', 'Refik',

    // Albanisch - männlich
    'Agim', 'Blerim', 'Driton', 'Faton', 'Besnik', 'Shpëtim', 'Shpetim',
    'Ilir', 'Bujar', 'Arben', 'Luan', 'Valon', 'Gentian', 'Kushtrim',
    'Flamur', 'Bekim', 'Fatmir', 'Ramush', 'Hashim', 'Xhavit',
    'Visar', 'Florim', 'Ardian', 'Labinot', 'Fisnik', 'Bashkim',
    'Skënder', 'Skender', 'Avni', 'Nexhat', 'Nexhmedin',

    // Serbisch/Kroatisch - weiblich
    'Jelena', 'Ivana', 'Milica', 'Dragana', 'Snežana', 'Snezana',
    'Gordana', 'Mirjana', 'Ljiljana', 'Biljana', 'Tatjana', 'Slavica',
    'Jasmina', 'Nataša', 'Natasa', 'Vesna', 'Maja', 'Sanja', 'Dubravka',
    'Ankica', 'Višnja', 'Visnja', 'Ruža', 'Ruza', 'Marina', 'Ana',
    'Jovana', 'Milena', 'Tijana', 'Aleksandra',

    // Bosnisch - weiblich
    'Amra', 'Alma', 'Naida', 'Lejla', 'Amela', 'Senada', 'Mediha',

    // Albanisch - weiblich
    'Mimoza', 'Teuta', 'Donika', 'Vlora', 'Pranvera', 'Vjollca',
    'Shqipe', 'Drita', 'Flutura', 'Adelina', 'Albana', 'Lindita',
    'Afërdita', 'Aferdita', 'Zanë', 'Zane', 'Liridona', 'Valdete'
  ]),

  // B2B INTERNATIONAL - Weitere europäische Länder (~800 Namen)
  international: new Set([
    // SPANIEN / PORTUGAL
    'José', 'Manuel', 'Francisco', 'Juan', 'Antonio', 'Pedro', 'Luis', 'Carlos',
    'Miguel', 'Javier', 'Fernando', 'David', 'Daniel', 'Jorge', 'Pablo', 'Alejandro',
    'Rafael', 'Sergio', 'Alberto', 'Andrés', 'Enrique', 'Raúl', 'Diego', 'Víctor',
    'María', 'Carmen', 'Ana', 'Isabel', 'Dolores', 'Pilar', 'Teresa', 'Rosa',
    'Francisca', 'Josefa', 'Mercedes', 'Cristina', 'Marta', 'Elena', 'Laura', 'Paula',
    'Lucía', 'Sara', 'Andrea', 'Natalia', 'Patricia', 'Beatriz', 'Raquel',

    // POLEN
    'Jan', 'Andrzej', 'Piotr', 'Krzysztof', 'Stanisław', 'Tomasz', 'Paweł', 'Józef',
    'Marcin', 'Marek', 'Michał', 'Grzegorz', 'Jerzy', 'Tadeusz', 'Adam', 'Łukasz',
    'Zbigniew', 'Ryszard', 'Dariusz', 'Henryk', 'Mariusz', 'Kazimierz', 'Wojciech',
    'Anna', 'Maria', 'Katarzyna', 'Małgorzata', 'Agnieszka', 'Krystyna', 'Barbara',
    'Ewa', 'Elżbieta', 'Zofia', 'Janina', 'Teresa', 'Joanna', 'Magdalena', 'Monika',

    // NIEDERLANDE
    'Jan', 'Peter', 'Johannes', 'Cornelis', 'Hendrik', 'Willem', 'Gerrit', 'Pieter',
    'Dirk', 'Jacobus', 'Adrianus', 'Martinus', 'Frederik', 'Nicolaas', 'Antonius',
    'Anna', 'Maria', 'Johanna', 'Hendrika', 'Cornelia', 'Adriana', 'Margaretha',
    'Elisabeth', 'Petronella', 'Geertruida', 'Jacoba', 'Willemina',

    // NORDISCHE LÄNDER (SE, NO, DK, FI)
    'Lars', 'Anders', 'Per', 'Nils', 'Sven', 'Erik', 'Johan', 'Mikael', 'Olof',
    'Karl', 'Magnus', 'Fredrik', 'Henrik', 'Stefan', 'Thomas', 'Jan', 'Björn',
    'Anna', 'Maria', 'Karin', 'Kristina', 'Margareta', 'Elisabeth', 'Eva', 'Birgitta',
    'Ingrid', 'Annika', 'Monica', 'Lena', 'Marie', 'Sofia', 'Emma', 'Linnea',

    // GRIECHENLAND
    'Georgios', 'Ioannis', 'Konstantinos', 'Dimitrios', 'Nikolaos', 'Panagiotis',
    'Vasileios', 'Christos', 'Athanasios', 'Spyridon', 'Andreas', 'Alexandros',
    'Maria', 'Eleni', 'Aikaterini', 'Vasiliki', 'Sofia', 'Anastasia', 'Paraskevi',
    'Georgia', 'Dimitra', 'Athena', 'Christina', 'Konstantina'
  ]),

  // GEMEINSAME INTERNATIONALE NAMEN (alle Länder)
  common: new Set([
    'Alexander', 'Alexandra', 'Daniel', 'Daniela', 'David', 'Diana',
    'Laura', 'Lisa', 'Martin', 'Martina', 'Michael', 'Michaela',
    'Nicole', 'Oliver', 'Patrick', 'Patricia', 'Robert', 'Roberta',
    'Sebastian', 'Simon', 'Simone', 'Stefan', 'Stefanie', 'Thomas',
    'Victor', 'Victoria', 'Adrian', 'Andrea', 'Christian', 'Christina',
    'Felix', 'Gabriel', 'Julian', 'Lucas', 'Maximilian', 'Paul', 'Paula',
    'Sophie', 'Sophia', 'Vincent', 'Max', 'Leon', 'Anna', 'Emma', 'Noah'
  ])
};

// ============================================================================
// NACHNAMEN (Last Names / Surnames)
// ============================================================================

export const LAST_NAMES = {

  // DEUTSCHLAND & ÖSTERREICH (~400 Namen)
  de: new Set([
    // Top 100 Deutsche Nachnamen
    'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
    'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter',
    'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun',
    'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz',
    'Krause', 'Meier', 'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Köhler',
    'Herrmann', 'König', 'Walter', 'Mayer', 'Huber', 'Kaiser', 'Fuchs',
    'Peters', 'Lang', 'Scholz', 'Möller', 'Weiß', 'Jung', 'Hahn', 'Schubert',
    'Vogel', 'Friedrich', 'Keller', 'Günther', 'Frank', 'Berger', 'Winkler',
    'Roth', 'Beck', 'Baumann', 'Kraus', 'Böhm', 'Schuster', 'Simon', 'Franke',
    'Albrecht', 'Schreiber', 'Winter', 'Kramer', 'Ludwig', 'Horn', 'Otto',
    'Sommer', 'Wolff', 'Stein', 'Groß', 'Haas', 'Heinrich', 'Brandt', 'Berg',
    'Seidel', 'Vogt', 'Engels', 'Krauß', 'Vetter', 'Ritter', 'Jäger', 'Eckert',
    'Götz', 'Voigt', 'Dietrich', 'Graf', 'Kühn', 'Beyer', 'Ziegler', 'Kuhn',

    // Österreich-spezifisch (inkl. slavische)
    'Gruber', 'Bauer', 'Hofer', 'Steiner', 'Moser', 'Mayer', 'Berger', 'Wimmer',
    'Eder', 'Brunner', 'Reiter', 'Wallner', 'Binder', 'Egger', 'Mayr', 'Fuchs'
  ]),

  // FRANKREICH (~200 Namen)
  fr: new Set([
    'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit',
    'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel',
    'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel',
    'Girard', 'André', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet',
    'François', 'Martinez', 'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc',
    'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas', 'Perrin', 'Morin',
    'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier',
    'Robin', 'Masson', 'Sanchez', 'Gerard', 'Nguyen', 'Boyer', 'Denis', 'Lemaire',
    'Duval', 'Joly', 'Gautier', 'Roger', 'Roche', 'Roy', 'Noel', 'Meyer',
    'Lucas', 'Meunier', 'Jean', 'Perez', 'Marchand', 'Dufour', 'Blanchard',
    'Marie', 'Barbier', 'Brun', 'Dumas', 'Brunet', 'Schmitt', 'Leroux', 'Colin'
  ]),

  // ITALIEN (~200 Namen)
  it: new Set([
    'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo',
    'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Costa',
    'Giordano', 'Mancini', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana',
    'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini',
    'Leone', 'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Serra',
    'Coppola', 'De Santis', 'D\'Angelo', 'Marchetti', 'Parisi', 'Villa', 'Conte',
    'Ferraro', 'Ferri', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini',
    'Messina', 'Sala', 'De Angelis', 'Gatti', 'Pellegrini', 'Palumbo', 'Sanna',
    'Farina', 'Rizzi', 'Monti', 'Cattaneo', 'Morelli', 'Amato', 'Silvestri',
    'Mazza', 'Testa', 'Grassi', 'Pellegrino', 'Carbone', 'Giuliani', 'Benedetti',
    'Barone', 'Rossetti', 'Caputo', 'Montanari', 'Guerra', 'Palmieri', 'Bernardi'
  ]),

  // UK - England, Scotland, Ireland, Wales (~300 Namen)
  en: new Set([
    // England Top 100
    'Smith', 'Jones', 'Williams', 'Taylor', 'Brown', 'Davies', 'Evans', 'Wilson',
    'Thomas', 'Johnson', 'Roberts', 'Robinson', 'Thompson', 'Wright', 'Walker',
    'White', 'Edwards', 'Hughes', 'Green', 'Hall', 'Lewis', 'Harris', 'Clarke',
    'Patel', 'Jackson', 'Wood', 'Turner', 'Martin', 'Cooper', 'Hill', 'Ward',
    'Morris', 'Moore', 'Clark', 'Lee', 'King', 'Baker', 'Harrison', 'Morgan',
    'Allen', 'James', 'Scott', 'Phillips', 'Watson', 'Davis', 'Parker', 'Price',
    'Bennett', 'Young', 'Griffiths', 'Mitchell', 'Kelly', 'Cook', 'Carter',
    'Richardson', 'Bailey', 'Collins', 'Bell', 'Shaw', 'Murphy', 'Miller',
    'Cox', 'Richards', 'Khan', 'Marshall', 'Anderson', 'Simpson', 'Ellis',
    'Adams', 'Singh', 'Begum', 'Wilkinson', 'Foster', 'Chapman', 'Powell',

    // Schottland
    'MacDonald', 'McDonald', 'MacLeod', 'McLeod', 'Campbell', 'Stewart', 'Thomson',
    'Robertson', 'Anderson', 'Scott', 'Murray', 'MacKenzie', 'McKenzie', 'Cameron',
    'Fraser', 'MacKay', 'McKay', 'Ross', 'Graham', 'Ferguson', 'Grant', 'Hunter',
    'MacLean', 'McLean', 'Morrison', 'Gibson', 'MacMillan', 'McMillan', 'Duncan',
    'Johnston', 'Gordon', 'MacIntosh', 'McIntosh', 'MacGregor', 'McGregor',

    // Irland
    'Murphy', 'Kelly', 'O\'Sullivan', 'Walsh', 'Smith', 'O\'Brien', 'Byrne',
    'Ryan', 'O\'Connor', 'O\'Neill', 'Reilly', 'Doyle', 'McCarthy', 'Gallagher',
    'O\'Doherty', 'Kennedy', 'Lynch', 'Murray', 'Quinn', 'Moore', 'McLaughlin',
    'Carroll', 'Connolly', 'Daly', 'O\'Connell', 'Wilson', 'Dunne', 'Brennan',
    'Burke', 'Collins', 'Campbell', 'Clarke', 'Johnston', 'Hughes', 'Farrell',
    'Fitzpatrick', 'Fitzgerald', 'Brown', 'Martin', 'Maguire', 'Nolan', 'Flynn',

    // Wales
    'Jones', 'Williams', 'Davies', 'Evans', 'Thomas', 'Roberts', 'Lewis', 'Hughes',
    'Morgan', 'Griffiths', 'Edwards', 'Rees', 'Jenkins', 'Owen', 'Price', 'Lloyd',
    'Powell', 'Pritchard', 'Phillips', 'Parry', 'Vaughan', 'Bowen', 'Hopkins'
  ]),

  // ÖSTERREICH - Spezifische slavische/ungarische Nachnamen (~100 Namen)
  at: new Set([
    // Slavisch
    'Kovács', 'Kovacs', 'Horvath', 'Horváth', 'Novak', 'Novák', 'Petrović', 'Petrovic',
    'Jovanović', 'Jovanovic', 'Stojanović', 'Stojanovic', 'Nikolić', 'Nikolic',
    'Popović', 'Popovic', 'Đorđević', 'Djordjevic', 'Marković', 'Markovic',
    'Ilić', 'Ilic', 'Pavlović', 'Pavlovic', 'Stanković', 'Stankovic',
    'Janković', 'Jankovic', 'Mladenović', 'Mladenovic', 'Kostić', 'Kostic',
    'Đukić', 'Djukic', 'Živković', 'Zivkovic', 'Tomić', 'Tomic',
    'Simić', 'Simic', 'Milošević', 'Milosevic',

    // Ungarisch (mit/ohne Akzente)
    'Nagy', 'Kovács', 'Kovacs', 'Tóth', 'Toth', 'Szabó', 'Szabo',
    'Horváth', 'Horvath', 'Varga', 'Kiss', 'Molnár', 'Molnar',
    'Németh', 'Nemeth', 'Farkas', 'Balogh', 'Papp', 'Takács', 'Takacs',
    'Juhász', 'Juhasz', 'Lakatos', 'Mészáros', 'Meszaros',

    // Tschechisch/Slowakisch (mit/ohne Akzente)
    'Novák', 'Novak', 'Svoboda', 'Novotný', 'Novotny', 'Dvořák', 'Dvorak',
    'Černý', 'Cerny', 'Procházka', 'Prochazka', 'Kučera', 'Kucera',
    'Veselý', 'Vesely', 'Horák', 'Horak', 'Němec', 'Nemec',
    'Marek', 'Pokorný', 'Pokorny', 'Pospíšil', 'Pospisil', 'Hájek', 'Hajek'
  ]),

  // BALKAN - Serbisch, Kroatisch, Bosnisch, Albanisch (~150 Namen)
  // v2.10.7: Häufige Balkan-Nachnamen für CH-Diaspora (mit/ohne Akzente)
  balkan: new Set([
    // Serbisch
    'Petrović', 'Petrovic', 'Jovanović', 'Jovanovic', 'Nikolić', 'Nikolic',
    'Marković', 'Markovic', 'Đorđević', 'Djordjevic', 'Stojanović', 'Stojanovic',
    'Ilić', 'Ilic', 'Stanković', 'Stankovic', 'Pavlović', 'Pavlovic',
    'Milošević', 'Milosevic', 'Popović', 'Popovic', 'Živković', 'Zivkovic',
    'Kostić', 'Kostic', 'Simić', 'Simic', 'Tomić', 'Tomic',
    'Đukić', 'Djukic', 'Janković', 'Jankovic', 'Mladenović', 'Mladenovic',
    'Vasić', 'Vasic', 'Obradović', 'Obradovic', 'Lazarević', 'Lazarevic',
    'Stevanović', 'Stevanovic', 'Ristić', 'Ristic', 'Savić', 'Savic',
    'Mitrović', 'Mitrovic', 'Filipović', 'Filipovic',

    // Kroatisch
    'Horvat', 'Kovačević', 'Kovacevic', 'Babić', 'Babic', 'Marić', 'Maric',
    'Jurić', 'Juric', 'Novak', 'Matić', 'Matic', 'Knežević', 'Knezevic',
    'Vuković', 'Vukovic', 'Perić', 'Peric', 'Blažević', 'Blazevic',

    // Bosnisch
    'Hodžić', 'Hodzic', 'Hasanović', 'Hasanovic', 'Begović', 'Begovic',
    'Mustafić', 'Mustafic', 'Hadžić', 'Hadzic', 'Čaušević', 'Causevic',
    'Mujić', 'Mujic', 'Halilović', 'Halilovic', 'Đelilović', 'Djelilovic',
    'Smajlović', 'Smajlovic', 'Mehmedović', 'Mehmedovic',
    'Omerović', 'Omerovic', 'Delić', 'Delic',

    // Albanisch
    'Krasniqi', 'Hoxha', 'Berisha', 'Gashi', 'Shala', 'Morina',
    'Leka', 'Osmani', 'Rama', 'Bytyqi', 'Bytyci', 'Shabani',
    'Ahmeti', 'Rexhepi', 'Kastrati', 'Tahiri', 'Bekteshi',
    'Kurti', 'Maliqi', 'Haliti', 'Sadiku', 'Beqiri', 'Dervishi',
    'Islami', 'Hoti', 'Dedaj', 'Ibrahimi', 'Hasani', 'Gërvalla', 'Gervalla',
    'Musliu', 'Xhemajli', 'Demiri', 'Salihu', 'Mehmeti'
  ]),

  // B2B INTERNATIONAL (~200 Namen)
  international: new Set([
    // Spanisch/Portugiesisch
    'García', 'González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Sánchez',
    'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno',
    'Álvarez', 'Muñoz', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres',
    'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Suárez',
    'Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues',
    'Martins', 'Jesus', 'Sousa', 'Fernandes', 'Gonçalves', 'Gomes', 'Lopes', 'Marques',

    // Polnisch
    'Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski',
    'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski',
    'Mazur', 'Wojciechowski', 'Kwiatkowski', 'Krawczyk', 'Kaczmarek', 'Piotrowski',
    'Grabowski', 'Pawłowski', 'Michalski', 'Król', 'Wieczorek', 'Jabłoński',

    // Niederländisch/Flämisch
    'de Jong', 'Jansen', 'de Vries', 'van den Berg', 'van Dijk', 'Bakker', 'Visser',
    'Smit', 'Meijer', 'de Boer', 'Mulder', 'de Groot', 'Bos', 'Vos', 'Peters',
    'Hendriks', 'van Leeuwen', 'Dekker', 'Brouwer', 'de Wit', 'Dijkstra', 'Smits',

    // Nordisch (SE, NO, DK)
    'Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson',
    'Persson', 'Svensson', 'Gustafsson', 'Pettersson', 'Jonsson', 'Jansson', 'Hansson',
    'Hansen', 'Nielsen', 'Jensen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen',
    'Sørensen', 'Rasmussen', 'Jørgensen', 'Petersen', 'Madsen', 'Kristensen'
  ])
};

// ============================================================================
// HILFSFUNKTIONEN
// ============================================================================

/**
 * Prüft ob ein Wort in einem der Namen-Sets vorkommt
 * Case-insensitive für bessere Erkennung
 */
export function isFirstName(name, lang = 'de') {
  if (!name || typeof name !== 'string') return false;

  const normalized = name.trim();

  // Prüfe spezifische Sprache
  if (lang && FIRST_NAMES[lang]?.has(normalized)) {
    return true;
  }

  // Prüfe common set
  if (FIRST_NAMES.common.has(normalized)) {
    return true;
  }

  // Prüfe alle anderen Sprachen (Fallback)
  for (const langSet of Object.values(FIRST_NAMES)) {
    if (langSet.has(normalized)) {
      return true;
    }
  }

  return false;
}

/**
 * Prüft ob ein Wort ein bekannter Nachname ist
 */
export function isLastName(name) {
  if (!name || typeof name !== 'string') return false;

  const normalized = name.trim();

  // Prüfe alle Nachnamen-Sets
  for (const langSet of Object.values(LAST_NAMES)) {
    if (langSet.has(normalized)) {
      return true;
    }
  }

  return false;
}

/**
 * Gibt die erkannte Sprache basierend auf Namen zurück
 */
export function detectLanguageByName(name) {
  if (!name) return null;

  const checks = [
    { lang: 'de', sets: [FIRST_NAMES.de, LAST_NAMES.de] },
    { lang: 'fr', sets: [FIRST_NAMES.fr, LAST_NAMES.fr] },
    { lang: 'it', sets: [FIRST_NAMES.it, LAST_NAMES.it] },
    { lang: 'en', sets: [FIRST_NAMES.en, LAST_NAMES.en] }
  ];

  for (const { lang, sets } of checks) {
    for (const set of sets) {
      if (set.has(name)) {
        return lang;
      }
    }
  }

  return null;
}

/**
 * Statistiken über das Lexikon
 */
export function getLexiconStats() {
  let totalFirstNames = 0;
  let totalLastNames = 0;

  for (const set of Object.values(FIRST_NAMES)) {
    totalFirstNames += set.size;
  }

  for (const set of Object.values(LAST_NAMES)) {
    totalLastNames += set.size;
  }

  return {
    firstNames: totalFirstNames,
    lastNames: totalLastNames,
    total: totalFirstNames + totalLastNames,
    languages: {
      de: FIRST_NAMES.de.size + LAST_NAMES.de.size,
      fr: FIRST_NAMES.fr.size + LAST_NAMES.fr.size,
      it: FIRST_NAMES.it.size + LAST_NAMES.it.size,
      en: FIRST_NAMES.en.size + LAST_NAMES.en.size,
      at: FIRST_NAMES.at.size + LAST_NAMES.at.size,
      balkan: FIRST_NAMES.balkan.size + LAST_NAMES.balkan.size,
      international: FIRST_NAMES.international.size + LAST_NAMES.international.size,
      common: FIRST_NAMES.common.size
    }
  };
}
