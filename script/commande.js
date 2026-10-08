var shellState = window.ShellState ? window.ShellState.getRawState() : {
    currentUser: "martin",
    homeDir: "/home/martin",
    currentPath: "/"
};

function getPathContent(path) {
    if (window.VirtualFileSystem) {
        return window.VirtualFileSystem.getContent(path, window.ShellState);
    }
    if (path === shellState.homeDir) {
        return typeof HOME_DIR_CONTENT !== 'undefined' ? HOME_DIR_CONTENT : [];
    }
    if (path === '/home') {
        return [shellState.currentUser];
    }
    return (typeof FILESYSTEM !== 'undefined' && FILESYSTEM[path]) ? FILESYSTEM[path] : [];
}

function normalizePath(targetPath) {
    if (window.PathUtils) {
        return window.PathUtils.normalize(targetPath, shellState.currentPath, shellState.homeDir);
    }
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
    if (window.VirtualFileSystem) {
        return window.VirtualFileSystem.isDirectory(fullPath, window.ShellState);
    }
    if (typeof FILESYSTEM !== 'undefined' && FILESYSTEM[fullPath]) return true;
    if (fullPath === shellState.homeDir) return true;
    if (fullPath.startsWith(shellState.homeDir + '/')) {
        const sub = fullPath.substring(shellState.homeDir.length + 1);
        if (typeof HOME_DIR_CONTENT !== 'undefined' && HOME_DIR_CONTENT.includes(sub)) return true;
    }
    return false;
}

function getFileSize(item) {
    if (window.VirtualFileSystem) {
        return window.VirtualFileSystem.getFileSize(item);
    }
    let size = 4096;
    if (typeof EXECUTABLES !== 'undefined' && EXECUTABLES.includes(item)) size = 4096 + Math.floor(Math.random() * 2000);
    else if (typeof FILES_MOCK !== 'undefined' && FILES_MOCK.includes(item)) size = 1024 + Math.floor(Math.random() * 500);
    return (size / 1024).toFixed(1) + "KB";
}

function formatItemName(item, parentPath) {
    const fullPath = parentPath === '/' ? '/' + item : parentPath + '/' + item;
    if (typeof EXECUTABLES !== 'undefined' && EXECUTABLES.includes(item) && (parentPath === '/usr/bin' || parentPath === '/bin')) {
        return '<span class="cat-highlight-lang">' + item + '</span>';
    } else if (isDirectory(fullPath) || item === '.' || item === '..') {
        return '<span class="dir-color">' + item + '</span>';
    } else {
        return '<span class="code-color">' + item + '</span>';
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
    } else if (!options.almostAll) {
        list = list.filter(item => !item.startsWith('.'));
    }

    if (options.reverse) {
        list.reverse();
    }

    if (list.length === 0) return "";

    if (options.long) {
        let outputLines = ['<table style="width:100%; text-align:left;">'];
        list.forEach(item => {
            const fullPath = path === '/' ? '/' + item : path + '/' + item;
            let isDir = (item === '.' || item === '..') ? true : isDirectory(fullPath);
            const perms = isDir ? "drwxr-xr-x" : "-rwxr-xr-x";
            const size = (item === '.' || item === '..') ? "4.0KB" : getFileSize(item);
            const formattedName = formatItemName(item, path);
            outputLines.push('<tr><td class="cat-comment">' + perms + '</td><td class="cat-comment">' + shellState.currentUser + '</td><td class="cat-comment">' + size + '</td><td>' + formattedName + '</td></tr>');
        });
        outputLines.push('</table>');
        return outputLines.join('');
    } else {
        return list.map(item => formatItemName(item, path)).join('    ');
    }
}

function handleLs(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return {
            output: '<span class="system-message">Usage: ls [OPTION]... [FILE]...</span><br>' +
                'List information about the FILEs (the current directory by default).<br><br>' +
                '<span class="cat-highlight-lang">-a</span>  do not ignore entries starting with .<br>' +
                '<span class="cat-highlight-lang">-A</span>  do not list implied . and ..<br>' +
                '<span class="cat-highlight-lang">-l</span>  use a long listing format<br>' +
                '<span class="cat-highlight-lang">-r</span>  reverse order while sorting<br>' +
                '<span class="cat-highlight-lang">-R</span>  list subdirectories recursively<br>' +
                '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
        };
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
            finalOutput.push('<span class="cat-color-error">ls: cannot access \'' + target + '\': No such file or directory</span>');
            return;
        }

        if (options.recursive) {
            let stack = [fullPath];
            while (stack.length > 0) {
                let current = stack.shift();
                if (targets.length > 1 || options.recursive) {
                    finalOutput.push('<br><span class="cat-comment">' + current + ':</span>');
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
            if (targets.length > 1) finalOutput.push('<span class="cat-comment">' + target + ':</span>');
            finalOutput.push(generateLsListing(fullPath, options));
        }
    });

    return { output: finalOutput.join('<br>') };
}

async function handleCat(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return {
            output: '<span class="system-message">Usage: cat ... [FILE]...</span><br>' +
                'Display the files passed as attributes.<br><br>' +
                '<span class="cat-highlight-lang">-C</span> show competences implied with the project<br>' +
                '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
        };
    }

    if (args.length === 0) {
        return { output: '<span class="cat-color-error">cat: no input file</span>' };
    }

    const target = args[0];
    const fullPath = normalizePath(target);

    if (fullPath.startsWith('/bin/') || fullPath.startsWith('/usr/bin/')) {
        const binName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
        return executeCommand(binName, ['--help']);
    }

    if (isDirectory(fullPath)) {
        return { output: '<span class="cat-color-error">cat: ' + target + ': Is a directory</span>' };
    }

    if (!fullPath.startsWith('/home/martin/github/')) {
        return { output: '<span class="cat-color-error">cat: only supported for files in ~/github/ for now.</span>' };
    }

    const parentDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);

    if (!isDirectory(parentDir) || !getPathContent(parentDir).includes(fileName)) {
        return { output: '<span class="cat-color-error">cat: ' + target + ': No such file or directory</span>' };
    }

    const pathAfterGithub = fullPath.substring('/home/martin/github/'.length);
    const slashIdx = pathAfterGithub.indexOf('/');
    const repoName = slashIdx === -1 ? pathAfterGithub : pathAfterGithub.substring(0, slashIdx);
    const relativePath = slashIdx === -1 ? '' : pathAfterGithub.substring(slashIdx);

    let rawBaseUrl;
    if (typeof GITHUB_PROJECTS !== 'undefined' && GITHUB_PROJECTS[repoName]) {
        rawBaseUrl = GITHUB_PROJECTS[repoName].raw;
    } else {
        rawBaseUrl = 'https://raw.githubusercontent.com/XanderTheRat/' + repoName + '/main';
    }

    const fileUrl = rawBaseUrl + relativePath;

    try {
        const extension = fileName.split('.').pop().toLowerCase();

        if (['png', 'webp', 'jpg', 'jpeg', 'gif', 'ico'].includes(extension)) {
            return { output: '<img src="' + fileUrl + '" alt="' + fileName + '" style="max-width: 100%; max-height: 400px; display: block; margin: 8px 0; border-radius: 6px;">' };
        }
        if (extension === 'pdf') {
            return { output: '<span class="system-message">PDF document: <a href="' + fileUrl + '" target="_blank" style="color: #51a2da; text-decoration: underline;">Open ' + fileName + ' in new tab</a></span>' };
        }

        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("File not found on GitHub");
        let text = await response.text();

        let language = 'plaintext';
        const langMap = {
            'c': 'c', 'h': 'c',
            'java': 'java',
            'kt': 'kotlin',
            'py': 'python',
            'html': 'xml', 'xml': 'xml', 'iml': 'xml', 'svg': 'xml',
            'css': 'css',
            'js': 'javascript',
            'json': 'json', 'jsonc': 'json',
            'sql': 'sql',
            'php': 'php',
            'rs': 'rust',
            'md': 'markdown',
            'toml': 'toml',
            'sh': 'bash', 'bash': 'bash',
            'yaml': 'yaml', 'yml': 'yaml',
            'conf': 'ini', 'properties': 'ini',
            'gradle': 'groovy'
        };
        language = langMap[extension] || 'plaintext';

        text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (window.hljs) {
            try {
                const highlighted = window.hljs.highlight(text, { language: language }).value;
                return { output: '<pre><code class="hljs language-' + language + '">' + highlighted + '</code></pre>' };
            } catch (e) {
                return { output: '<pre>' + text + '</pre>' };
            }
        }
        return { output: '<pre>' + text + '</pre>' };

    } catch (error) {
        return { output: '<span class="cat-color-error">cat: error fetching file: ' + error.message + '</span>' };
    }
}
const handleBat = handleCat;

function handleTree(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return {
            output: '<span class="system-message">Usage: tree [DIRECTORY]</span><br>' +
                'Display an interactive graphical tree view of the filesystem in another window.<br>' +
                'Click on a branch to navigate to a folder, or click on a leaf to print the file.<br><br>' +
                '<span class="cat-highlight-lang">DIRECTORY</span>  Optional target directory (current path by default)<br>' +
                '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
        };
    }

    const target = args[0] ? normalizePath(args[0]) : shellState.currentPath;
    if (typeof openTreeWindow === 'function') {
        openTreeWindow(target);
    } else if (window.TreeWindow) {
        window.TreeWindow.open(target);
    }
    return { output: '<span class="system-message">Tree window opened for <span class="path">' + target + '</span>. Click on a branch to cd, or a leaf to cat the file.</span>' };
}

function changeDirectory(targetPath) {
    const normalizedPath = normalizePath(targetPath);
    if (shellState.currentPath === normalizedPath) return { error: null };
    if (isDirectory(normalizedPath)) {
        shellState.currentPath = normalizedPath;
        if (window.ShellState) window.ShellState.setCurrentPath(normalizedPath);
        return { error: null };
    }
    return { error: 'sh: bad pattern: ' + targetPath };
}

function handleUsermod(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return {
            output: '<span class="system-message">Usage: usermod [OPTION]... [VALUE]...</span><br>' +
                'Change the current user and their directory.<br><br>' +
                '<span class="cat-highlight-lang">--login</span>  Needed. This is the new user name<br>' +
                '<span class="cat-highlight-lang">--home</span>  Optional. This is the new user\'s directory<br><br>' +
                '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
        };
    }

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
            if (!args[i+1].startsWith('/')) return { output: '<span class="cat-color-error">Erreur: Chemin absolu requis.</span>' };
            newHome = args[i + 1];
            homeExplicitlySet = true;
            i++; changeMade = true;
        }
    }

    if (changeMade) {
        if (!homeExplicitlySet && newLogin !== shellState.currentUser) {
            newHome = '/home/' + newLogin;
        }

        if (typeof FILESYSTEM !== 'undefined') {
            Object.keys(FILESYSTEM).forEach(path => {
                if (path.startsWith(oldHome + '/')) {
                    const newPath = newHome + path.substring(oldHome.length);
                    FILESYSTEM[newPath] = FILESYSTEM[path];
                    delete FILESYSTEM[path];
                }
            });
        }

        shellState.currentUser = newLogin;
        shellState.homeDir = newHome;

        if (shellState.currentPath.startsWith(oldHome)) {
            shellState.currentPath = newHome + shellState.currentPath.substring(oldHome.length);
        }

        if (window.ShellState) {
            window.ShellState.setUser(newLogin, newHome);
            window.ShellState.setCurrentPath(shellState.currentPath);
        }

        return { output: '<span class="system-message">Utilisateur mis à jour: ' + newLogin + '. Home: ' + newHome + '.</span>' };
    }

    return {
        output: '<span class="system-message">Usage: usermod [OPTION]... [VALUE]...</span><br>' +
            'Change the current user and their directory.<br><br>' +
            '<span class="cat-highlight-lang">--login</span>  Needed. This is the new user name<br>' +
            '<span class="cat-highlight-lang">--home</span>  Optional. This is the new user\'s directory<br><br>' +
            '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
    };
}

function executeSysinfo(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return '<span class="system-message">Usage: sysinfo</span><br>Display current CPU and memory utilization.<br><br><span class="cat-highlight-lang">--help, -h</span>  display this help and exit';
    }
    return '<span class="cpu-color">CPU 15%</span> | <span class="mem-color">MEM 45%</span>';
}
function executeBattery(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return '<span class="system-message">Usage: battery</span><br>Display current battery percentage.<br><br><span class="cat-highlight-lang">--help, -h</span>  display this help and exit';
    }
    return '<span class="bat-color-normal">65%</span>';
}
function executeChangeBatteryMode(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return '<span class="system-message">Usage: change_battery_mode</span><br>Toggle between battery power saving modes.<br><br><span class="cat-highlight-lang">--help, -h</span>  display this help and exit';
    }
    return '<span class="system-message">Mode batterie changé.</span>';
}
function executeNetworkStatus(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return '<span class="system-message">Usage: network_status</span><br>Display active network SSID and state.<br><br><span class="cat-highlight-lang">--help, -h</span>  display this help and exit';
    }
    return '<span class="net-color-wifi">PortfolioMartin</span>';
}
function executeChangeNetworkStatus(args) {
    if (args && (args.includes('--help') || args.includes('-h'))) {
        return '<span class="system-message">Usage: change_network_status</span><br>Toggle network connectivity status.<br><br><span class="cat-highlight-lang">--help, -h</span>  display this help and exit';
    }
    return '<span class="system-message">Mode réseau changé.</span>';
}

function getAutocompleteData(token, isCommand) {
    let matches = [];
    let parentPath = '';

    if (isCommand) {
        const allCommands = (typeof BUILT_IN_COMMANDS !== 'undefined' ? BUILT_IN_COMMANDS : []).concat(typeof EXECUTABLES !== 'undefined' ? EXECUTABLES : []);
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
            matches = content.filter(item => item.startsWith(partialName));
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

function formatSuggestionGrid(matches, parentPath) {
    if (!matches || matches.length === 0) return '';
    const formatted = matches.map(item => {
        const fullPath = parentPath === '/' ? '/' + item : parentPath + '/' + item;
        const isDir = isDirectory(fullPath);
        if (isDir) {
            return '<span class="dir-color">' + item + '</span>';
        }
        return '<span class="code-color">' + item + '</span>';
    });
    return '<div class="autocomplete-grid">' + formatted.join('    ') + '</div>';
}

function executeCommand(command, args) {
    if (command && command.includes('/')) {
        command = command.substring(command.lastIndexOf('/') + 1);
    }

    if (typeof EXECUTABLES !== 'undefined' && EXECUTABLES.includes(command)) {
        switch (command) {
            case 'sysinfo': return { output: executeSysinfo(args) };
            case 'battery': return { output: executeBattery(args) };
            case 'change_battery_mode': return { output: executeChangeBatteryMode(args) };
            case 'network_status': return { output: executeNetworkStatus(args) };
            case 'change_network_status': return { output: executeChangeNetworkStatus(args) };
        }
    }

    switch (command) {
        case 'help':
            return {
                output: '<span class="system-message">Commands Shell:</span> ls, cd, cat, tree, clear, usermod, help<br>' +
                    '<span class="system-message">Type <span class="command-text">{command} --help</span> or <span class="command-text">{command} -h</span> to show a complete list of attributes for the command<br>In the <span class="command-text">~/github/{project}/README.md</span> file, you can see the competences implied in the project</span><br>'
            };
        case 'ls': return handleLs(args);
        case 'clear':
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return { output: '<span class="system-message">Usage: clear</span><br>Clear the terminal screen.<br><br><span class="cat-highlight-lang">--help, -h</span>  display this help and exit' };
            }
            return { action: 'clear' };
        case 'exit':
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return { output: '<span class="system-message">Usage: exit</span><br>Exit portfolio session and navigate to GitHub profile.<br><br><span class="cat-highlight-lang">--help, -h</span>  display this help and exit' };
            }
            return { action: 'redirect', url: 'https://github.com/XanderTheRat' };
        case 'cd': {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return { output: '<span class="system-message">Usage: cd [DIRECTORY]</span><br>Change current shell directory.<br><br><span class="cat-highlight-lang">DIRECTORY</span>  Target folder (defaults to ~)<br><span class="cat-highlight-lang">--help, -h</span>  display this help and exit' };
            }
            const target = args[0] || '~';
            const res = changeDirectory(target);
            return { output: res.error ? '<span class="cat-color-error">' + res.error + '</span>' : (shellState.currentPath === '/home/martin/scripts.rs' ? '<span class="system-message">Bienvenue dans les binaires Waybar.</span>' : "") };
        }
        case 'usermod': return handleUsermod(args);
        case 'cat': return handleCat(args);
        case 'bat': return handleCat(args);
        case 'tree': return handleTree(args);
        default: return { output: '<span class="cat-color-error">sh: command not found: ' + command + '</span>' };
    }
}