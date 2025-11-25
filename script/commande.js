
var shellState = {
    currentUser: "user",
    homeDir: "/home/user",
    currentPath: "/", 
};

const EXECUTABLES = ["sysinfo", "battery", "change_battery_mode", "network_status", "change_network_status"];

const FILES_MOCK = ['passwd', 'shadow', 'hosts']; 
const BUILT_IN_COMMANDS = ['help', 'ls', 'cd', 'clear', 'exit', 'usermod'];
const HOME_DIR_CONTENT = ['scripts.rs', 'Documents', 'Desktop'];

const FILESYSTEM = {
    '/': ['home', 'usr', 'etc', 'bin'], 
    '/home': [shellState.currentUser],
    '/usr': ['bin', 'share'],
    '/usr/bin': EXECUTABLES, 
    '/etc': ['passwd', 'shadow', 'hosts'], 
    '/bin': ['ls', 'cd', 'clear', 'exit', 'usermod'], 
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
        if (HOME_DIR_CONTENT.includes(subDir)) return [];
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
    let list = [...content];

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

function handleLs(args) {
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
            let visited = []; 

            while (stack.length > 0) {
                let current = stack.shift(); 
                
                if (targets.length > 1 || options.recursive) {
                    finalOutput.push(`<br><span class="bat-comment">${current}</span>`);
                }

                let listing = generateLsListing(current, options);
                if (listing) finalOutput.push(listing);

                let content = getPathContent(current);
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
function executeBattery() { return `<span class="bat-color-normal">65% </span>`; }
function executeChangeBatteryMode() { return `<span class="system-message">Mode batterie changé.</span>`; }
function executeNetworkStatus() { return `<span class="net-color-wifi"> MyWaybarWifi</span>`; }
function executeChangeNetworkStatus() { return `<span class="system-message">Mode réseau changé.</span>`; }

function changeDirectory(targetPath) {
    const normalizedPath = normalizePath(targetPath);
    
    if (shellState.currentPath === normalizedPath) return { error: null };
    
    if (isDirectory(normalizedPath)) {
        shellState.currentPath = normalizedPath;
        return { error: null };
    }

    return { error: `zsh: cd: no such file or directory: ${targetPath}` };
}

function handleUsermod(args) {
    let newLogin = shellState.currentUser;
    let newHome = shellState.homeDir;
    let changeMade = false;
    const oldHome = shellState.homeDir; 

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--login' && i + 1 < args.length) {
            newLogin = args[i + 1].replace(/[^a-zA-Z0-9_]/g, '');
            i++; changeMade = true;
        } else if (args[i] === '--home' && i + 1 < args.length) {
            if (!args[i+1].startsWith('/')) return { output: `<span class="bat-color-error">Erreur: Chemin absolu requis.</span>` };
            newHome = args[i + 1];
            i++; changeMade = true;
        }
    }

    if (changeMade) {
        shellState.currentUser = newLogin;
        shellState.homeDir = newHome;
        if (shellState.currentPath.startsWith(oldHome)) {
            shellState.currentPath = newHome + shellState.currentPath.substring(oldHome.length);
        }
        return { output: `<span class="system-message">Utilisateur mis à jour: ${newLogin}. Home: ${newHome}.</span>` };
    }
    return { output: `<span class="bat-color-error">Usage: usermod --login {user} --home {path}</span>` };
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
            return { output: `<span class="system-message">Binaires:</span> ${EXECUTABLES.join(' ')}<br><span class="system-message">Shell:</span> ls, cd, clear, usermod, exit` };
        
        case 'ls':
            return handleLs(args);

        case 'cd':
            const res = changeDirectory(args[0] || '~');
            return { output: res.error ? `<span class="bat-color-error">${res.error}</span>` : (shellState.currentPath === '/home/martin/scripts.rs' ? `<span class="system-message">Bienvenue dans les binaires Waybar.</span>` : "") };

        case 'clear': return { action: 'clear' };
        case 'usermod': return handleUsermod(args);
        case 'exit':
            if (shellState.currentPath === '/') return { action: 'redirect', url: 'index.html' };
            return { output: `<span class="bat-color-error">Erreur: 'exit' doit être fait à la racine (/).</span>` };

        default: return { output: `<span class="bat-color-error">zsh: command not found: ${command}</span>` };
    }
}