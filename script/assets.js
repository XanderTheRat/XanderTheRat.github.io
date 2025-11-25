var shellState = {
    currentUser: "martin",
    homeDir: "/home/martin",
    currentPath: "/", 
};


const EXECUTABLES = ["sysinfo", "battery", "change_battery_mode", "network_status", "change_network_status"];
const FILES_MOCK = ['passwd', 'shadow', 'hosts'];
const BUILT_IN_COMMANDS = ['help', 'ls', 'cd', 'clear', 'exit', 'usermod', 'bat'];
const HOME_DIR_CONTENT = ['scripts.rs', 'Documents', 'Desktop', 'github'];

const GITHUB_BASE_PATH = "/home/martin/github/BUT1";
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main";

const FILESYSTEM = {
    '/': ['home', 'usr', 'etc', 'bin'],
    '/home': ['martin'],
    '/usr': ['bin', 'share'],
    '/usr/bin': EXECUTABLES,
    '/etc': ['passwd', 'shadow', 'hosts'],
    '/bin': ['ls', 'cd', 'clear', 'exit', 'usermod', 'bat'],
    '/home/martin/github': ['BUT1'],
    '/home/martin/github/BUT1': ['.gitattributes', 'C', 'Java', 'Python', 'SQL', 'web'],
    '/home/martin/github/BUT1/C': ['C', 'R2.04'],
    '/home/martin/github/BUT1/C/C': ['.idea', 'cmake-build-debug'],
    '/home/martin/github/BUT1/C/R2.04': ['.idea', 'CMakeLists.txt', 'TP1', 'TP1.exe', 'TP2', 'TP2.exe', 'TP3', 'cmake-build-debug'],
    '/home/martin/github/BUT1/C/R2.04/TP1': ['TP1.c'],
    '/home/martin/github/BUT1/C/R2.04/TP2': ['tp2.c'],
    '/home/martin/github/BUT1/C/R2.04/TP3': ['TP3.c'],
    '/home/martin/github/BUT1/Java': ['.idea', 'TP1', 'TP2', 'TP3', 'TP4', 'TP5', 'TP6', 'TP7', 'out', 'pers', 'td2', 'td3', 'td4', 'td5', 'td6', 'td7', 'utils'],
    '/home/martin/github/BUT1/Java/TP1': ['TP1.iml', 'src'],
    '/home/martin/github/BUT1/Java/TP1/src': ['HelloWorld.java'],
    '/home/martin/github/BUT1/Java/TP2': ['TP2.iml', 'src'],
    '/home/martin/github/BUT1/Java/TP2/src': ['Direction.java', 'Main.java', 'Position.java', 'Robot.java'],
    '/home/martin/github/BUT1/Java/TP3': ['TP3.iml', 'src'],
    '/home/martin/github/BUT1/Java/TP3/src': ['Main.java', 'test.puml'],
    '/home/martin/github/BUT1/Java/TP4': ['TP4.iml', 'src'],
    '/home/martin/github/BUT1/Java/TP4/src': ['cardgames'],
    '/home/martin/github/BUT1/Java/TP4/src/cardgames': ['application', 'model'],
    '/home/martin/github/BUT1/Java/TP4/src/cardgames/application': ['Main.java'],
    '/home/martin/github/BUT1/Java/TP4/src/cardgames/model': ['Card.java', 'Rank.java', 'Suit.java'],
    '/home/martin/github/BUT1/Java/TP5': ['TP5.iml', 'src'],
    '/home/martin/github/BUT1/Java/TP5/src': ['farwest', 'zoo'],
    '/home/martin/github/BUT1/Java/TP5/src/farwest': ['Bandit.java', 'Bourgeois.java', 'Cheval.java', 'Enfant.java', 'EtreCapableDeTirerAvecUneArmeAFeu.java', 'FarWestMain.java', 'Heros.java', 'PersonnageFarWest.java'],
    '/home/martin/github/BUT1/Java/TP5/src/zoo': ['application', 'model'],
    '/home/martin/github/BUT1/Java/TP5/src/zoo/application': ['ZooMain.java'],
    '/home/martin/github/BUT1/Java/TP5/src/zoo/model': ['Noisy.java', 'ZooGarden.java', 'animal', 'visitor'],
    '/home/martin/github/BUT1/Java/TP5/src/zoo/model/animal': ['Animal.java', 'Duck.java', 'Lion.java', 'Pig.java'],
    '/home/martin/github/BUT1/Java/TP5/src/zoo/model/visitor': ['Adult.java', 'Baby.java', 'Child.java', 'SchoolAge.java', 'Teenager.java', 'Toddler.java', 'Visitor.java'],
    '/home/martin/github/BUT1/Java/TP6': ['TP6.iml', 'src', 'test'],
    '/home/martin/github/BUT1/Java/TP6/src': ['model', 'util'],
    '/home/martin/github/BUT1/Java/TP6/src/model': ['Calculatrice.java'],
    '/home/martin/github/BUT1/Java/TP6/src/util': ['DivisionParZeroException.java'],
    '/home/martin/github/BUT1/Java/TP6/test': ['calculatrice'],
    '/home/martin/github/BUT1/Java/TP6/test/calculatrice': ['CalculatriceTest.java'],
    '/home/martin/github/BUT1/Java/TP7': ['TP7.iml', 'maven', 'test'],
    '/home/martin/github/BUT1/Java/TP7/maven': ['canards', 'pom.xml', 'src', 'target'],
    '/home/martin/github/BUT1/Java/TP7/test': ['fizzbuzz', 'test.iml'],
    '/home/martin/github/BUT1/Python': ['Chronometre_amélioré.py', 'Demineur_upgrade.py'],
    '/home/martin/github/BUT1/SQL': ['BDD.sql', 'Exos.sql', 'Requete.sql', 'creation_table.sql', 'nbLignes.sql', 'remplissage.sql', 'supression.sql', 'tables.sql'],
    '/home/martin/github/BUT1/web': ['1', '2', 'Halloween'],
    '/home/martin/github/BUT1/web/1': ['Images', 'Styles', 'balade.html', 'surprise.html', 'types.html'],
    '/home/martin/github/BUT1/web/1/Images': ['Hydro.png', 'foret_jade.png', 'magicarpe.png', 'osselait.png', 'pikachu.png', 'professeur_chen.png', 'roucool.png'],
    '/home/martin/github/BUT1/web/1/Styles': ['Petit_plus.css', 'Style3.css', 'style1.css', 'style2.css'],
    '/home/martin/github/BUT1/web/2': ['form.html', 'formPremNSI.php', 'gnome.png', 'index.html', 'style.css'],
    '/home/martin/github/BUT1/web/Halloween': ['img', 'index.html', 'msq', 'script', 'style', 'test.html'],
    '/home/martin/github/BUT1/web/Halloween/img': ['logo.png'],
    '/home/martin/github/BUT1/web/Halloween/msq': ['Musique.mp3'],
    '/home/martin/github/BUT1/web/Halloween/script': ['script.js'],
    '/home/martin/github/BUT1/web/Halloween/style': ['responsive.css', 'style.css']
};