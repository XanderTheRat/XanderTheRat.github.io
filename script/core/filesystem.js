window.VirtualFileSystem = (function() {
    const EXECUTABLES = ["sysinfo", "battery", "change_battery_mode", "network_status", "change_network_status"];
    const FILES_MOCK = ["passwd", "shadow", "hosts"];
    const HOME_DIR_CONTENT = ["scripts.rs", "Documents", "Desktop", "github"];

    const filesystem = {
    '/': ['home', 'usr', 'bin'],
    '/home': ['martin'],
    '/usr': ['bin', 'share'],
    '/usr/bin': EXECUTABLES,
    '/bin': ['ls', 'cd', 'clear', 'exit', 'usermod', 'cat', 'tree'],
    '/home/martin/github': ['BUT1', 'BUT2', 'but2-presentations-r304', 'enseignement-but2-developpement', 'Just-Another-Coffee', 'R5A04', 'waybar', 'XanderTheRat', 'XanderTheRat.github.io'],
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
    '/home/martin/github/BUT1/web/Halloween/style': ['responsive.css', 'style.css'],
    '/home/martin/github/BUT2': ['PHP', 'RUST', 'TP3', 'crypto', 'dev_mobile', 'java', 'rezo'],
    '/home/martin/github/BUT2/PHP': ['controle'],
    '/home/martin/github/BUT2/PHP/controle': ['README.md', 'bdd.sql', 'composer.json', 'public', 'src', 'vendor'],
    '/home/martin/github/BUT2/PHP/controle/public': ['index.php', 'script.js', 'style.css'],
    '/home/martin/github/BUT2/PHP/controle/src': ['Controller', 'Model', 'View'],
    '/home/martin/github/BUT2/PHP/controle/src/Controller': ['AuthController.php', 'SocialController.php'],
    '/home/martin/github/BUT2/PHP/controle/src/Model': ['Comment.php', 'Database.php', 'Notification.php', 'Post.php', 'User.php'],
    '/home/martin/github/BUT2/PHP/controle/src/View': ['View.php', 'layout.php', 'login.php', 'register.php', 'social.php'],
    '/home/martin/github/BUT2/PHP/controle/vendor': ['autoload.php', 'composer'],
    '/home/martin/github/BUT2/PHP/controle/vendor/composer': ['ClassLoader.php', 'LICENSE', 'autoload_classmap.php', 'autoload_namespaces.php', 'autoload_psr4.php', 'autoload_real.php', 'autoload_static.php'],
    '/home/martin/github/BUT2/RUST': ['TP1', 'TP2', 'concurrency', 'network_services', 'options_and_results', 'spaghettis'],
    '/home/martin/github/BUT2/RUST/TP1': ['ownership'],
    '/home/martin/github/BUT2/RUST/TP1/ownership': ['src'],
    '/home/martin/github/BUT2/RUST/TP1/ownership/src': ['main.rs'],
    '/home/martin/github/BUT2/RUST/TP2': ['options_and_result'],
    '/home/martin/github/BUT2/RUST/TP2/options_and_result': ['Cargo.toml'],
    '/home/martin/github/BUT2/RUST/concurrency': ['Cargo.toml', 'src'],
    '/home/martin/github/BUT2/RUST/concurrency/src': ['bin'],
    '/home/martin/github/BUT2/RUST/concurrency/src/bin': ['copies.rs', 'deadlock.rs', 'multitasked_hellors.rs', 'sequential_hellos.rs', 'shared_read.rs', 'shared_static.rs', 'shared_writes.rs', 'static_writes.rs'],
    '/home/martin/github/BUT2/RUST/network_services': ['src'],
    '/home/martin/github/BUT2/RUST/network_services/src': ['bin'],
    '/home/martin/github/BUT2/RUST/network_services/src/bin': ['tcp_echo_server.rs', 'udp_echo_server.rs', 'udp_ncat_client.rs', 'udp_ping_client.rs', 'udp_pong_server.rs'],
    '/home/martin/github/BUT2/RUST/options_and_results': ['src'],
    '/home/martin/github/BUT2/RUST/options_and_results/src': ['bin'],
    '/home/martin/github/BUT2/RUST/options_and_results/src/bin': ['options.rs', 'results.rs'],
    '/home/martin/github/BUT2/RUST/spaghettis': ['Cargo.toml', 'src'],
    '/home/martin/github/BUT2/RUST/spaghettis/src': ['app_builder.rs', 'bin', 'configurations.rs', 'domain.rs', 'lib.rs'],
    '/home/martin/github/BUT2/RUST/spaghettis/src/bin': ['vote.rs'],
    '/home/martin/github/BUT2/TP3': ['TP3'],
    '/home/martin/github/BUT2/TP3/TP3': ['src'],
    '/home/martin/github/BUT2/TP3/TP3/src': ['main'],
    '/home/martin/github/BUT2/TP3/TP3/src/main': ['java'],
    '/home/martin/github/BUT2/TP3/TP3/src/main/java': ['bruteforce', 'utf8'],
    '/home/martin/github/BUT2/TP3/TP3/src/main/java/bruteforce': ['BruteForceCollision.java', 'BruteForceCollisionBinaire.java', 'BruteForcePreimageBinaire.java', 'MainBruteForce.java'],
    '/home/martin/github/BUT2/TP3/TP3/src/main/java/utf8': ['Convertisseur.java', 'HashageXOR.java', 'HasheurBinaire.java', 'MainHashage.java'],
    '/home/martin/github/BUT2/crypto': ['TP4_et_5'],
    '/home/martin/github/BUT2/crypto/TP4_et_5': ['TP4_TP5'],
    '/home/martin/github/BUT2/crypto/TP4_et_5/TP4_TP5': ['src'],
    '/home/martin/github/BUT2/crypto/TP4_et_5/TP4_TP5/src': ['main'],
    '/home/martin/github/BUT2/crypto/TP4_et_5/TP4_TP5/src/main': ['java'],
    '/home/martin/github/BUT2/crypto/TP4_et_5/TP4_TP5/src/main/java': ['mdp'],
    '/home/martin/github/BUT2/crypto/TP4_et_5/TP4_TP5/src/main/java/mdp': ['Exercice.java', 'GenerateurMDP.java', 'Main.java'],
    '/home/martin/github/BUT2/dev_mobile': ['MyApplication', 'TP1', 'TP2'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication': ['.gitignore', 'app', 'build.gradle.kts', 'gradle', 'gradle.properties', 'gradlew', 'gradlew.bat', 'settings.gradle.kts'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app': ['.gitignore', 'build.gradle.kts', 'proguard-rules.pro', 'src'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src': ['androidTest', 'main', 'test'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/androidTest': ['java'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/androidTest/java': ['iut'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/androidTest/java/iut': ['mobile'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/androidTest/java/iut/mobile': ['myapplication'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/androidTest/java/iut/mobile/myapplication': ['ExampleInstrumentedTest.kt'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main': ['AndroidManifest.xml', 'java', 'res'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/java': ['iut'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/java/iut': ['mobile'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/java/iut/mobile': ['myapplication'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/java/iut/mobile/myapplication': ['MainActivity.kt', 'ui'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/java/iut/mobile/myapplication/ui': ['theme'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/java/iut/mobile/myapplication/ui/theme': ['Color.kt', 'Theme.kt', 'Type.kt'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res': ['drawable', 'mipmap-anydpi', 'mipmap-hdpi', 'mipmap-mdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi', 'values', 'xml'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/drawable': ['ic_launcher_background.xml', 'ic_launcher_foreground.xml'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/mipmap-anydpi': ['ic_launcher.xml', 'ic_launcher_round.xml'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/mipmap-hdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/mipmap-mdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/mipmap-xhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/mipmap-xxhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/mipmap-xxxhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/values': ['colors.xml', 'strings.xml', 'themes.xml'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/main/res/xml': ['backup_rules.xml', 'data_extraction_rules.xml'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/test': ['java'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/test/java': ['iut'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/test/java/iut': ['mobile'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/test/java/iut/mobile': ['myapplication'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/app/src/test/java/iut/mobile/myapplication': ['ExampleUnitTest.kt'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/gradle': ['libs.versions.toml', 'wrapper'],
    '/home/martin/github/BUT2/dev_mobile/MyApplication/gradle/wrapper': ['gradle-wrapper.jar', 'gradle-wrapper.properties'],
    '/home/martin/github/BUT2/dev_mobile/TP1': ['app'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app': ['src'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src': ['main'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main': ['AndroidManifest.xml', 'java', 'res'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/java': ['iut'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/java/iut': ['mobile'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/java/iut/mobile': ['tp1'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/java/iut/mobile/tp1': ['MainActivity.kt', 'MainActivity2.kt'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res': ['drawable', 'layout', 'mipmap-anydpi', 'mipmap-hdpi', 'mipmap-mdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi', 'values', 'values-night', 'xml'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/drawable': ['ic_launcher_background.xml', 'ic_launcher_foreground.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/layout': ['activity_main.xml', 'activity_main2.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/mipmap-anydpi': ['ic_launcher.xml', 'ic_launcher_round.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/mipmap-hdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/mipmap-mdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/mipmap-xhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/mipmap-xxhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/mipmap-xxxhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/values': ['bouton.xml', 'colors.xml', 'strings.xml', 'themes.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/values-night': ['themes.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP1/app/src/main/res/xml': ['backup_rules.xml', 'data_extraction_rules.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP2': ['app', 'build.gradle.kts', 'gradle'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app': ['.gitignore', 'build.gradle.kts', 'proguard-rules.pro', 'src'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src': ['androidTest', 'main', 'test'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/androidTest': ['java'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/androidTest/java': ['iut'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/androidTest/java/iut': ['mobile'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/androidTest/java/iut/mobile': ['tp2'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/androidTest/java/iut/mobile/tp2': ['ExampleInstrumentedTest.kt'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main': ['AndroidManifest.xml', 'java', 'res'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/java': ['iut'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/java/iut': ['mobile'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/java/iut/mobile': ['tp2'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/java/iut/mobile/tp2': ['MainActivity.kt', 'ui'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/java/iut/mobile/tp2/ui': ['theme'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/java/iut/mobile/tp2/ui/theme': ['Color.kt', 'Theme.kt', 'Type.kt'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res': ['drawable', 'layout', 'mipmap-anydpi', 'mipmap-hdpi', 'mipmap-mdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi', 'values', 'values-night', 'xml'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/drawable': ['ic_launcher_background.xml', 'ic_launcher_foreground.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/layout': ['activity_main.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/mipmap-anydpi': ['ic_launcher.xml', 'ic_launcher_round.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/mipmap-hdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/mipmap-mdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/mipmap-xhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/mipmap-xxhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/mipmap-xxxhdpi': ['ic_launcher.webp', 'ic_launcher_round.webp'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/values': ['colors.xml', 'strings.xml', 'themes.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/values-night': ['themes.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/main/res/xml': ['backup_rules.xml', 'data_extraction_rules.xml'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/test': ['java'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/test/java': ['iut'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/test/java/iut': ['mobile'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/test/java/iut/mobile': ['tp2'],
    '/home/martin/github/BUT2/dev_mobile/TP2/app/src/test/java/iut/mobile/tp2': ['ExampleUnitTest.kt'],
    '/home/martin/github/BUT2/dev_mobile/TP2/gradle': ['libs.versions.toml'],
    '/home/martin/github/BUT2/java': ['TP_Mars_Rover_Jacquet_Valet'],
    '/home/martin/github/BUT2/java/TP_Mars_Rover_Jacquet_Valet': ['src'],
    '/home/martin/github/BUT2/java/TP_Mars_Rover_Jacquet_Valet/src': ['main'],
    '/home/martin/github/BUT2/java/TP_Mars_Rover_Jacquet_Valet/src/main': ['java'],
    '/home/martin/github/BUT2/java/TP_Mars_Rover_Jacquet_Valet/src/main/java': ['Main.java', 'map', 'rover'],
    '/home/martin/github/BUT2/java/TP_Mars_Rover_Jacquet_Valet/src/main/java/map': ['Direction.java', 'Map.java', 'Obstacle.java'],
    '/home/martin/github/BUT2/java/TP_Mars_Rover_Jacquet_Valet/src/main/java/rover': ['Rover.java', 'RoverController.java'],
    '/home/martin/github/BUT2/rezo': ['TP1', 'TP2'],
    '/home/martin/github/BUT2/rezo/TP1': ['lab.conf', 'pca.startup', 'pcb.startup', 'pcc.startup', 'pcd.startup', 'r1.startup', 'r2.startup'],
    '/home/martin/github/BUT2/rezo/TP2': ['lab.conf', 'r0.startup', 'r1.startup'],
    '/home/martin/github/but2-presentations-r304': ['2024', '2025', 'README.md', 'nweji', 'ressources'],
    '/home/martin/github/but2-presentations-r304/2024': ['presentation', 'qcm', 'resume'],
    '/home/martin/github/but2-presentations-r304/2024/presentation': ['DDDTechnique.pdf', 'adapter.pdf', 'builder.pdf', 'command.pdf', 'composite.pdf', 'decorator.pdf', 'design.pdf', 'immutable.pdf', 'null.pdf', 'observer.pdf', 'state.pdf', 'strategy.pdf', 'visitor.pdf'],
    '/home/martin/github/but2-presentations-r304/2024/qcm': ['DDDTechniqueQcm.pdf', 'adapterQcm.pdf', 'builderQcm.pdf', 'commandQcm.pdf', 'decoratorQcm.pdf', 'designQcm.pdf', 'immutableQCM.pdf', 'nullQcm.pdf', 'observerQcm.pdf', 'stateQcm.pdf', 'strategyQcm.pdf', 'visitorQcm.pdf'],
    '/home/martin/github/but2-presentations-r304/2024/resume': ['DDDTechniqueResume.pdf', 'adapterResume.pdf', 'builderResume.pdf', 'commandResume.pdf', 'compositeResume.pdf', 'decoratorResume.pdf', 'designResume.pdf', 'immutableResume.pdf', 'nullResume.pdf', 'observerResume.pdf', 'stateResume.pdf', 'strategyResume.pdf', 'visitorResume.pdf'],
    '/home/martin/github/but2-presentations-r304/2025': ['presentation', 'qcm', 'resume'],
    '/home/martin/github/but2-presentations-r304/2025/presentation': ['DDDTechnique.pdf', 'builder.pdf', 'composite.pdf', 'decorator.pdf', 'immutable.pdf', 'state.pdf', 'strategy.pdf', 'visitor.pdf'],
    '/home/martin/github/but2-presentations-r304/2025/qcm': ['DDDTechniqueQcm.pdf', 'builderQcm.pdf', 'compositeQCM.pdf', 'decoratorQcm.pdf', 'immutableQCM.pdf', 'stateQcm.pdf', 'strategyQcm.pdf', 'visitorQCM.pdf'],
    '/home/martin/github/but2-presentations-r304/2025/resume': ['DDDTechniqueResume.pdf', 'builderResume.pdf', 'compositeResume.pdf', 'decoratorResume.pdf', 'immutableResume.pdf', 'stateResume.pdf', 'strategyResume.pdf', 'visitorResume.pdf'],
    '/home/martin/github/but2-presentations-r304/ressources': ['references_patterns.md', 'resumeGof.pdf'],
    '/home/martin/github/enseignement-but2-developpement': ['R303_Analyse_CadrageAgile.md', 'R304_QualiteDeveloppement.md', 'README.md', 'TP', 'cours', 'ressources'],
    '/home/martin/github/enseignement-but2-developpement/TP': ['R3_04'],
    '/home/martin/github/enseignement-but2-developpement/TP/R3_04': ['R3_04_BonnesPratiques_KataTennis.pdf', 'R3_04_CarRacing_SRP_CleanTest_Builder.pdf', 'R3_04_CoR_ATM.pdf', 'R3_04_Composite.pdf', 'R3_04_KataKebab_SauceVisiteur.pdf', 'R3_04_MarsRover.pdf', 'R3_04_Mockito_PriseEnMain.pdf', 'R3_04_SOLID_Kata_Car_Racing.pdf', 'R3_04_SOLID_Polymorphism_KataParrot.pdf', 'R3_04_SOLID_Revue.pdf'],
    '/home/martin/github/enseignement-but2-developpement/cours': ['DecrirePremiere_Story.pdf', 'DoDKards.pdf', 'ImpactMapping.pdf', 'QuidDocumentation.pdf', 'SOLID.pdf', 'StoryMapping.pdf', 'TestDouble_Mockito.pdf', 'VisionProduit.pdf'],
    '/home/martin/github/enseignement-but2-developpement/ressources': ['atm', 'kataparrot', 'katatennis', 'pizza', 'tirepressuremonitoringsystem'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm': ['pom.xml', 'src'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src': ['main', 'test'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/main': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/main/java': ['fr'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/main/java/fr': ['unilim'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/main/java/fr/unilim': ['iut'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/main/java/fr/unilim/iut': ['atm'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/main/java/fr/unilim/iut/atm': ['ATM.java', 'BankNote.java', 'BankNotesBundle.java', 'Money.java', 'TestATM.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/test': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/test/java': ['fr'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/test/java/fr': ['unilim'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/test/java/fr/unilim': ['iut'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/test/java/fr/unilim/iut': ['atm'],
    '/home/martin/github/enseignement-but2-developpement/ressources/atm/src/test/java/fr/unilim/iut/atm': ['ATMTest.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot': ['pom.xml', 'src'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src': ['main', 'test'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/main': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/main/java': ['fr'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/main/java/fr': ['unilim'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/main/java/fr/unilim': ['iut'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/main/java/fr/unilim/iut': ['kataparrot'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/main/java/fr/unilim/iut/kataparrot': ['Parrot.java', 'ParrotTypeEnum.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/test': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/test/java': ['fr'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/test/java/fr': ['unilim'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/test/java/fr/unilim': ['iut'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/test/java/fr/unilim/iut': ['kataparrot'],
    '/home/martin/github/enseignement-but2-developpement/ressources/kataparrot/src/test/java/fr/unilim/iut/kataparrot': ['ParrotTest.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/katatennis': ['pom.xml', 'src'],
    '/home/martin/github/enseignement-but2-developpement/ressources/katatennis/src': ['main', 'test'],
    '/home/martin/github/enseignement-but2-developpement/ressources/katatennis/src/main': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/katatennis/src/main/java': ['katatennis'],
    '/home/martin/github/enseignement-but2-developpement/ressources/katatennis/src/main/java/katatennis': ['TennisGame.java', 'TennisGame1.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/katatennis/src/test': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/katatennis/src/test/java': ['katatennis'],
    '/home/martin/github/enseignement-but2-developpement/ressources/katatennis/src/test/java/katatennis': ['TennisTest.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/pizza': ['pom.xml', 'src'],
    '/home/martin/github/enseignement-but2-developpement/ressources/pizza/src': ['main', 'test'],
    '/home/martin/github/enseignement-but2-developpement/ressources/pizza/src/main': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/pizza/src/main/java': ['pizza'],
    '/home/martin/github/enseignement-but2-developpement/ressources/pizza/src/main/java/pizza': ['Pizza.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/pizza/src/test': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/pizza/src/test/java': ['pizza'],
    '/home/martin/github/enseignement-but2-developpement/ressources/pizza/src/test/java/pizza': ['PizzaTest.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem': ['pom.xml', 'src'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src': ['main', 'test'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/main': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/main/java': ['fr'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/main/java/fr': ['unilim'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/main/java/fr/unilim': ['iut'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/main/java/fr/unilim/iut': ['tirepressuremonitoringsystem'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/main/java/fr/unilim/iut/tirepressuremonitoringsystem': ['Alarm.java', 'Sensor.java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/test': ['java'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/test/java': ['fr'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/test/java/fr': ['unilim'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/test/java/fr/unilim': ['iut'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/test/java/fr/unilim/iut': ['tirepressuremonitoringsystem'],
    '/home/martin/github/enseignement-but2-developpement/ressources/tirepressuremonitoringsystem/src/test/java/fr/unilim/iut/tirepressuremonitoringsystem': ['AlarmTest.java'],
    '/home/martin/github/Just-Another-Coffee': ['.gitignore', 'Cargo.toml', 'README.md', 'coffee', 'src'],
    '/home/martin/github/Just-Another-Coffee/src': ['asset', 'bin', 'lib.rs'],
    '/home/martin/github/Just-Another-Coffee/src/asset': ['front.rs', 'mod.rs', 'structures.rs'],
    '/home/martin/github/Just-Another-Coffee/src/bin': ['jac.rs'],
    '/home/martin/github/R5A04': ['src'],
    '/home/martin/github/R5A04/src': ['main.rs'],
    '/home/martin/github/waybar': ['config.jsonc', 'scripts', 'style.css', 'theme.css'],
    '/home/martin/github/waybar/scripts': ['Cargo.toml', 'battery_state', 'network_status', 'src'],
    '/home/martin/github/waybar/scripts/src': ['bin', 'edt.rs', 'lib.rs'],
    '/home/martin/github/waybar/scripts/src/bin': ['battery.rs', 'change_battery_mode.rs', 'change_network_status.rs', 'cpu.rs', 'edt.rs', 'group.rs', 'network_status.rs', 'ram.rs', 'room.rs'],
    '/home/martin/github/XanderTheRat': ['README.md'],
    '/home/martin/github/XanderTheRat.github.io': ['img', 'index.html', 'portfolio.html', 'script', 'style'],
    '/home/martin/github/XanderTheRat.github.io/img': ['C.png', 'CSS.png', 'HTML.png', 'JS.png', 'PostgreSQL.png', 'icon', 'java.png', 'python.png', 'sql.png'],
    '/home/martin/github/XanderTheRat.github.io/img/icon': ['document_icon_transparent.webp', 'main_icon.webp', 'menu_icon_transparent.webp'],
    '/home/martin/github/XanderTheRat.github.io/script': ['assets.js', 'commande.js', 'terminal.js'],
    '/home/martin/github/XanderTheRat.github.io/style': ['terminal.css'],
};

    function isDirectory(fullPath, state) {
        if (!fullPath) return false;
        if (filesystem[fullPath]) return true;
        const homeDir = state ? state.getHomeDir() : "/home/martin";
        if (fullPath === homeDir) return true;
        if (fullPath.startsWith(homeDir + "/")) {
            const sub = fullPath.substring(homeDir.length + 1);
            if (HOME_DIR_CONTENT.includes(sub)) return true;
        }
        return false;
    }

    function getContent(path, state) {
        const homeDir = state ? state.getHomeDir() : "/home/martin";
        const currentUser = state ? state.getCurrentUser() : "martin";

        if (path === homeDir) {
            return [...HOME_DIR_CONTENT];
        }
        if (path === "/home") {
            return [currentUser];
        }
        return filesystem[path] ? [...filesystem[path]] : [];
    }

    function getFileSize(item) {
        let size = 4096;
        if (EXECUTABLES.includes(item)) {
            size = 4096 + Math.floor(Math.random() * 2000);
        } else if (FILES_MOCK.includes(item)) {
            size = 1024 + Math.floor(Math.random() * 500);
        }
        return (size / 1024).toFixed(1) + "KB";
    }

    function updateHomePath(oldHome, newHome) {
        Object.keys(filesystem).forEach(path => {
            if (path.startsWith(oldHome + "/")) {
                const newPath = newHome + path.substring(oldHome.length);
                filesystem[newPath] = filesystem[path];
                delete filesystem[path];
            }
        });
    }

    function buildHierarchy(rootPath, currentDepth, maxDepth, state) {
        const isDir = isDirectory(rootPath, state);
        const name = rootPath === "/" ? "/" : rootPath.substring(rootPath.lastIndexOf("/") + 1);
        const node = {
            name: name || "/",
            path: rootPath,
            isDir: isDir,
            expanded: currentDepth < maxDepth,
            children: []
        };

        if (isDir) {
            const content = getContent(rootPath, state).filter(item => item !== "." && item !== "..");
            node.children = content.map(childName => {
                const childPath = rootPath === "/" ? "/" + childName : rootPath + "/" + childName;
                const childIsDir = isDirectory(childPath, state);
                if (childIsDir) {
                    return buildHierarchy(childPath, currentDepth + 1, maxDepth, state);
                }
                return {
                    name: childName,
                    path: childPath,
                    isDir: false,
                    expanded: false,
                    children: []
                };
            });

            node.children.sort((a, b) => {
                if (a.isDir && !b.isDir) return -1;
                if (!a.isDir && b.isDir) return 1;
                return a.name.localeCompare(b.name);
            });
        }

        return node;
    }

    function getRawFilesystem() {
        return filesystem;
    }

    function getExecutables() {
        return EXECUTABLES;
    }

    return {
        isDirectory,
        getContent,
        getFileSize,
        updateHomePath,
        buildHierarchy,
        getRawFilesystem,
        getExecutables
    };
})();
