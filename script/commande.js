var shellState = {
    currentUser: "martin",
    homeDir: "/home/martin",
    currentPath: "/", 
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
    } else if (isDirectory(fullPath) || item === '.' || item === '..') {
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
    
    const GITHUB_PAGE_PATH = "/home/martin/github/XanderTheRat.github.io";
    const GITHUB_PAGE_RAW = "https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio_V2";

    const GITHUB_BASE_PATH = "/home/martin/github/BUT1";
    const GITHUB_RAW_URL = "https://raw.githubusercontent.com/XanderTheRat/BUT1/main";

    if (!fullPath.startsWith(GITHUB_BASE_PATH) && !fullPath.startsWith(GITHUB_PAGE_PATH) ){
        return { output: `<span class="bat-color-error">bat: only supported for files in ~/github/BUT1 for now.</span>` };
    }

    const parentDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
    
    if (!isDirectory(parentDir) || !getPathContent(parentDir).includes(fileName) || isDirectory(fullPath)) {
         if (isDirectory(fullPath)) return { output: `<span class="bat-color-error">bat: ${target}: Is a directory</span>` };
         return { output: `<span class="bat-color-error">bat: ${target}: No such file or directory</span>` };
    }
    let fileUrl;
    let relativePath;


    if (fullPath.startsWith(GITHUB_BASE_PATH)) {
        relativePath = fullPath.substring(GITHUB_BASE_PATH.length);
        fileUrl = GITHUB_RAW_URL + relativePath;    
    } 
    if (fullPath.startsWith(GITHUB_PAGE_PATH)) {
        relativePath = fullPath.substring(GITHUB_PAGE_PATH.length);
        fileUrl = GITHUB_PAGE_RAW + relativePath;
    }
    
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
        else if (['rs'].includes(extension)) language = 'rust';
        else if (['md'].includes(extension)) language = 'markdown';

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

function generateLsListing(path, options) {
    const content = getPathContent(path);
    let list = [...content];

    if (options.all) {
        if (path !== '/') {
             list.unshift('..');
        }
        list.unshift('.');
    } else if (options.almostAll) {}
     else {
        list = list.filter(item => !item.startsWith('.'));
    }

    if (options.reverse) {
        list.reverse();
    }

    let outputLines = [];

    if (list.length === 0) return "";

    if (options.long) {
        outputLines.push(`<table style="width:100%; text-align:left;">`);
        list.forEach(item => {
            const fullPath = path === '/' ? '/' + item : path + '/' + item;
            
            let isDir = (item === '.' || item === '..') ? true : isDirectory(fullPath);
            
            const perms = isDir ? "drwxr-xr-x" : "-rwxr-xr-x";
            const size = (item === '.' || item === '..') ? "4.0KB" : getFileSize(item);
            const formattedName = formatItemName(item, path);
            
            outputLines.push(`<tr>
                <td class="bat-comment">${perms}</td>
                <td class="bat-comment">${shellState.currentUser}</td>
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
function handleLs(args) {
    if (args.includes('--help')) {
        return { output: `<span class="system-message">Usage: ls [OPTION]... [FILE]...</span><br>
        List information about the FILEs (the current directory by default).<br><br>
        <span class="bat-highlight-lang">-a</span>  do not ignore entries starting with .<br>
        <span class="bat-highlight-lang">-A</span>  do not list implied . and ..<br>
        <span class="bat-highlight-lang">-l</span>  use a long listing format<br>
        <span class="bat-highlight-lang">-r</span>  reverse order while sorting<br>
        <span class="bat-highlight-lang">-R</span>  list subdirectories recursively<br>
        <span class="bat-highlight-lang">--help</span>     display this help and exit` };
    }

    let options = { recursive: false, reverse: false, long: false, all: false, almostAll: false };
    let targets = [];

    args.forEach(arg => {
        if (arg.startsWith('-')) {
            if (arg.includes('R')) options.recursive = true;
            if (arg.includes('r')) options.reverse = true;
            if (arg.includes('l')) options.long = true;
            if (arg.includes('a')) options.all = true;
            if (arg.includes('A')) options.almostAll = true;
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
        
        let isSpecial = (target === '.' || target === '..');
        if (!isSpecial && !isDirectory(fullPath)) {
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
                
                if (!options.all && !options.almostAll) {
                    content = content.filter(item => !item.startsWith('.'));
                }
                
                if (options.reverse) content.reverse(); 

                content.forEach(item => {
                    const itemPath = current === '/' ? '/' + item : current + '/' + item;
                    if (item !== '.' && item !== '..' && isDirectory(itemPath)) {
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

function getAutocompleteData(token, isCommand) {
    let matches = [];
    let parentPath = ''; 

    if (isCommand) {
        const allCommands = [...BUILT_IN_COMMANDS, ...EXECUTABLES];
        matches = allCommands.filter(cmd => cmd.startsWith(token));
        parentPath = '/bin'; 
    } else {
        
        let dirToSearch = shellState.currentPath; 
        let partialName = token;

        const lastSlashIndex = token.lastIndexOf('/');
        
        if (lastSlashIndex !== -1) {
            const pathPart = token.substring(0, lastSlashIndex + 1);
            partialName = token.substring(lastSlashIndex + 1);
            
            dirToSearch = normalizePath(pathPart);
        } else if (token === '~') {
             dirToSearch = '/home';
             partialName = shellState.currentUser;
        }

        if (isDirectory(dirToSearch)) {
            const content = getPathContent(dirToSearch);
            let candidates = [...content];
            matches = candidates.filter(item => item.startsWith(partialName));
            parentPath = dirToSearch;
        }
    }

    return { matches, parentPath };
}

function getCommonPrefix(strings) {
    if (!strings.length) return '';
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
        while (strings[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (!prefix) return '';
        }
    }
    return prefix;
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
                output: `<span class="system-message">Commands Shell:</span> ls, cd, bat, clear, usermod<br>
                <span class="system-message">Type <span class="command-text">{command} --help </span>to show a complete list of attributes for the command<br>In the <span class="command-text">~/github/{project}/README.md </span>file, you can see the competences implieds in the project</span><br>` 
            };
        
        case 'ls':
            return handleLs(args);

        case 'cd':
            if (args.includes('--help')) {
                return { output: `<span class="system-message">Usage: cd [DIRECTORY]...</span><br>
                Change the current directory.<br>
                Accept absolute and relative path.` };
            }
            const res = changeDirectory(args[0] || '~');
            return { output: res.error ? `<span class="bat-color-error">${res.error}</span>` : (shellState.currentPath === '/home/martin/scripts.rs' ? `<span class="system-message">Bienvenue dans les binaires Waybar.</span>` : "") };

        case 'clear': {
            if (args.includes('--help')) {
                return { output: `<span class="system-message">Usage: clear</span><br>
                Clear the visual historic of commands in the screen.<br><br>
                ` };
            }
            return { action: 'clear' };
        }

        case 'usermod': return handleUsermod(args);
        case 'bat': return handleBat(args);

        default: return { output: `<span class="bat-color-error">zsh: command not found: ${command}</span>` };
    }
}