var shellState = {
    currentUser: "martin",
    homeDir: "/home/martin",
    currentPath: "/", 
};

const EXECUTABLES = ["sysinfo", "battery", "change_battery_mode", "network_status", "change_network_status"];
const FILES_MOCK = ['passwd', 'shadow', 'hosts']; 
const BUILT_IN_COMMANDS = ['help', 'ls', 'cd','bat', 'clear', 'exit', 'usermod'];
const HOME_DIR_CONTENT = ['scripts.rs', 'Documents', 'Desktop', 'github'];

const FILESYSTEM = {
    '/': ['home', 'usr', 'etc', 'bin'], 
    '/home': [shellState.currentUser],
    '/usr': ['bin', 'share'],
    '/usr/bin': EXECUTABLES, 
    '/etc': ['passwd', 'shadow', 'hosts'], 
    '/bin': ['ls', 'cd', 'clear', 'exit', 'usermod'], 
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

function getPathContent(path) {
    if (path === shellState.homeDir) {
        return HOME_DIR_CONTENT;
    }
    if (path === '/home') {
        return [shellState.currentUser];
    }
    if (path.startsWith(shellState.homeDir + '/')) {
        const subDir = path.substring(shellState.homeDir.length + 1);
        if (HOME_DIR_CONTENT.includes(subDir) && subDir !== 'github') {
            return [];
        }
    }
    return FILESYSTEM[path] || [];
}

function normalizePath(targetPath) {
    if (!targetPath) return shellState.currentPath;

    if (targetPath === '~') targetPath = shellState.homeDir;
    else if (targetPath.startsWith('~')) targetPath = shellState.homeDir + targetPath.substring(1);
    
    let path = targetPath;
    if (!targetPath.startsWith('/')) {
        let base = shellState.currentPath === '/' ? '' : shellState.currentPath;
        path = base + '/' + targetPath;
    }

    const segments = path.split('/').filter(s => s.length > 0);
    const resolvedSegments = [];

    for (const segment of segments) {
        if (segment === '.') continue;
        if (segment === '..') {
            if (resolvedSegments.length > 0) resolvedSegments.pop();
        } else {
            resolvedSegments.push(segment);
        }
    }
    
    return '/' + resolvedSegments.join('/');
}

function isDirectory(fullPath) {
    if (FILESYSTEM[fullPath]) return true;
    if (fullPath === shellState.homeDir) return true;
    if (fullPath.startsWith(shellState.homeDir + '/')) {
        const sub = fullPath.substring(shellState.homeDir.length + 1);
        if (HOME_DIR_CONTENT.includes(sub)) return true;
    }
    return false;
}

function getFileSize(item) {
    let size = 0;
    if (EXECUTABLES.includes(item)) size = 4096 + Math.floor(Math.random() * 2000);
    else if (FILES_MOCK.includes(item)) size = 1024 + Math.floor(Math.random() * 500);
    else size = 4096;
    return (size / 1024).toFixed(1) + "KB";
}

function generateLsListing(path, options) {
    const content = getPathContent(path);
    
    let list = options.all ? [...content] : content.filter(item => !item.startsWith('.'));

    if (options.reverse) {
        list.reverse();
    }

    let outputLines = [];

    if (list.length === 0) return "";

    if (options.long) {
        outputLines.push(`<table style="width:100%; text-align:left;">`);
        list.forEach(item => {
            const fullPath = path === '/' ? '/' + item : path + '/' + item;
            const isDir = isDirectory(fullPath);
            const perms = isDir ? "drwxr-xr-x" : "-rwxr-xr-x";
            const size = getFileSize(item);
            const formattedName = formatItemName(item, path);
            
            outputLines.push(`<tr>
                <td class="bat-comment">${perms}</td>
                <td class="bat-comment">martin</td>
                <td class="bat-comment">${size}</td>
                <td>${formattedName}</td>
            </tr>`);
        });
        outputLines.push(`</table>`);
        return outputLines.join('');
    } else {
        let formattedItems = list.map(item => formatItemName(item, path));
        return formattedItems.join('    ');
    }
}

function formatItemName(item, parentPath) {
    const fullPath = parentPath === '/' ? '/' + item : parentPath + '/' + item;
    
    if (EXECUTABLES.includes(item) && (parentPath === '/usr/bin' || parentPath === '/bin')) {
        return `<span class="bat-highlight-lang">${item}</span>`;
    } else if (isDirectory(fullPath)) {
        return `<span class="dir-color">${item}</span>`;
    } else {
        return `<span class="code-color">${item}</span>`;
    }
}

async function handleBat(args) {
    if (args.includes('--help')) {
        return { output: `<span class="system-message">Usage: bat ... [FILE]...</span><br>
        Display the files passed as attributes.<br><br>

        <span class="bat-highlight-lang">-C</span>  show competences implieds with the project<br>
    ` };
    }

    if (args.length === 0) {
        return { output: `<span class="bat-color-error">bat: no input file</span>` };
    }

    const target = args[0];
    const fullPath = normalizePath(target);
    
    const GITHUB_BASE_PATH = "/home/martin/github/BUT1";
    const GITHUB_RAW_URL = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main";

    if (!fullPath.startsWith(GITHUB_BASE_PATH)) {
        return { output: `<span class="bat-color-error">bat: only supported for files in ~/github/BUT1 for now.</span>` };
    }

    const parentDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
    
    if (!isDirectory(parentDir) || !getPathContent(parentDir).includes(fileName) || isDirectory(fullPath)) {
         if (isDirectory(fullPath)) return { output: `<span class="bat-color-error">bat: ${target}: Is a directory</span>` };
         return { output: `<span class="bat-color-error">bat: ${target}: No such file or directory</span>` };
    }

    const relativePath = fullPath.substring(GITHUB_BASE_PATH.length);
    const fileUrl = GITHUB_RAW_URL + relativePath;

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("File not found on GitHub");
        let text = await response.text();
        
        const extension = fileName.split('.').pop();
        let language = 'plaintext';
        if (['c', 'h'].includes(extension)) language = 'c';
        else if (['java', 'class'].includes(extension)) language = 'java';
        else if (['py'].includes(extension)) language = 'python';
        else if (['html', 'xml', 'iml'].includes(extension)) language = 'xml';
        else if (['css'].includes(extension)) language = 'css';
        else if (['js'].includes(extension)) language = 'javascript';
        else if (['sql'].includes(extension)) language = 'sql';
        else if (['php'].includes(extension)) language = 'php';

        text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (window.hljs) {
            try {
                const highlighted = window.hljs.highlight(text, { language: language }).value;
                return { output: `<pre><code class="hljs language-${language}">${highlighted}</code></pre>` };
            } catch (e) {
                return { output: `<pre>${text}</pre>` };
            }
        }
        return { output: `<pre>${text}</pre>` };

    } catch (error) {
        return { output: `<span class="bat-color-error">bat: error fetching file: ${error.message}</span>` };
    }
}

function handleLs(args) {
    if (args.includes('--help')) {
        return { output: `<span class="system-message">Usage: ls [OPTION]... [DIRECTORY]...</span><br>
        List information about the FILEs (the current directory by default).<br><br>
        <span class="bat-highlight-lang">-a</span>  show every files<br>
        <span class="bat-highlight-lang">-l</span>  use a long listing format<br>
        <span class="bat-highlight-lang">-r</span>  reverse printing order<br>
        <span class="bat-highlight-lang">-R</span>  list subdirectories recursively<br>
        <span class="bat-highlight-lang">--help</span>  display this help and exit` };
    }

    let options = { recursive: false, reverse: false, long: false, all: false };
    let targets = [];

    args.forEach(arg => {
        if (arg.startsWith('-')) {
            if (arg.includes('R')) options.recursive = true;
            if (arg.includes('r')) options.reverse = true;
            if (arg.includes('l')) options.long = true;
            if (arg.includes('a')) options.all = true;
        } else {
            targets.push(arg);
        }
    });

    if (targets.length === 0) {
        targets.push('.');
    }

    let finalOutput = [];

    targets.forEach(target => {
        const fullPath = normalizePath(target);
        
        if (!isDirectory(fullPath)) {
            finalOutput.push(`<span class="bat-color-error">ls: cannot access '${target}': No such file or directory</span>`);
            return;
        }

        if (options.recursive) {
            let stack = [fullPath];

            while (stack.length > 0) {
                let current = stack.shift(); 
                
                if (targets.length > 1 || options.recursive) {
                    finalOutput.push(`<br><span class="bat-comment">${current}:</span>`);
                }

                let listing = generateLsListing(current, options);
                if (listing) finalOutput.push(listing);

                let content = getPathContent(current);
                if (!options.all) {
                    content = content.filter(item => !item.startsWith('.'));
                }
                
                if (options.reverse) content.reverse(); 

                content.forEach(item => {
                    const itemPath = current === '/' ? '/' + item : current + '/' + item;
                    if (isDirectory(itemPath)) {
                        stack.push(itemPath);
                    }
                });
            }

        } else {
            if (targets.length > 1) finalOutput.push(`<span class="bat-comment">${target}:</span>`);
            finalOutput.push(generateLsListing(fullPath, options));
        }
    });

    return { output: finalOutput.join('<br>') };
}

function executeSysinfo() { return `<span class="cpu-color">CPU 15%</span> | <span class="mem-color">MEM 45%</span>`; }
function executeBattery() { return `<span class="bat-color-normal">65%</span>`; }
function executeChangeBatteryMode() { return `<span class="system-message">Mode batterie changé.</span>`; }
function executeNetworkStatus() { return `<span class="net-color-wifi"> PortfolioMartin</span>`; }
function executeChangeNetworkStatus() { return `<span class="system-message">Mode réseau changé.</span>`; }

function changeDirectory(targetPath) {
    const normalizedPath = normalizePath(targetPath);
    
    if (shellState.currentPath === normalizedPath) return { error: null };
    
    if (isDirectory(normalizedPath)) {
        shellState.currentPath = normalizedPath;
        return { error: null };
    }

    return { error: `zsh: bad pattern: ${targetPath}` };
}

function handleUsermod(args) {

    let newLogin = shellState.currentUser;
    let newHome = shellState.homeDir;
    let changeMade = false;
    let homeExplicitlySet = false;
    const oldHome = shellState.homeDir; 

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--login' && i + 1 < args.length) {
            newLogin = args[i + 1].replace(/[^a-zA-Z0-9_]/g, '');
            i++; changeMade = true;
        } else if (args[i] === '--home' && i + 1 < args.length) {
            if (!args[i+1].startsWith('/')) return { output: `<span class="bat-color-error">Erreur: Chemin absolu requis.</span>` };
            newHome = args[i + 1];
            homeExplicitlySet = true;
            i++; changeMade = true;
        }
    }

    if (changeMade) {
        if (!homeExplicitlySet && newLogin !== shellState.currentUser) {
            newHome = '/home/' + newLogin;
        }

        Object.keys(FILESYSTEM).forEach(path => {
            if (path.startsWith(oldHome + '/')) {
                const newPath = newHome + path.substring(oldHome.length);
                FILESYSTEM[newPath] = FILESYSTEM[path];
                delete FILESYSTEM[path];
            }
        });

        shellState.currentUser = newLogin;
        shellState.homeDir = newHome;
        
        if (shellState.currentPath.startsWith(oldHome)) {
            shellState.currentPath = newHome + shellState.currentPath.substring(oldHome.length);
        }
        
        return { output: `<span class="system-message">Utilisateur mis à jour: ${newLogin}. Home: ${newHome}.</span>` };
    }
    
    return { output: `<span class="system-message">Usage: usermod [OPTION]... [VALUE]...</span><br>
        Change the current user and their directory.<br><br>
        <span class="bat-highlight-lang">--login</span>  Needed. This is the new user name<br>
        <span class="bat-highlight-lang">--home</span>  Optionnal. This is the new user's directory<br><br>` };
    }


function executeCommand(command, args) {
    if (EXECUTABLES.includes(command)) {
        switch (command) {
            case 'sysinfo': return { output: executeSysinfo() };
            case 'battery': return { output: executeBattery() };
            case 'change_battery_mode': return { output: executeChangeBatteryMode() };
            case 'network_status': return { output: executeNetworkStatus() };
            case 'change_network_status': return { output: executeChangeNetworkStatus() };
        }
    }
    
    switch (command) {
        case 'help':
            return { 
                output: `<span class="system-message">Binaires:</span> ${EXECUTABLES.join(' ')}<br>
                <span class="system-message">Shell:</span> ls, cd, bat, clear, usermod, exit<br>
                <span class="system-message">Type <span class="command-text">{command} --help </span>to show a complete list of attributes for the command</span><br>` 
            };
        
        case 'ls':
            return handleLs(args);

        case 'cd':
            const res = changeDirectory(args[0] || '~');
            return { output: res.error ? `<span class="bat-color-error">${res.error}</span>` : (shellState.currentPath === '/home/martin/scripts.rs' ? `<span class="system-message">Bienvenue dans les binaires Waybar.</span>` : "") };

        case 'clear': return { action: 'clear' };
        case 'usermod': return handleUsermod(args);
        case 'bat': return handleBat(args);
        case 'exit':
            if (shellState.currentPath === '/') return { action: 'redirect', url: 'index.html' };
            return { output: `<span class="bat-color-error">Erreur: 'exit' doit être fait à la racine (/).</span>` };

        default: return { output: `<span class="bat-color-error">zsh: command not found: ${command}</span>` };
    }
}