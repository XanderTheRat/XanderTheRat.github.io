(function() {
    function formatItem(item, parentPath, context) {
        const fullPath = parentPath === '/' ? '/' + item : parentPath + '/' + item;
        const isDir = context.fs.isDirectory(fullPath, context.state) || item === '.' || item === '..';
        const executables = context.fs.getExecutables();
        if (executables.includes(item) && (parentPath === '/usr/bin' || parentPath === '/bin')) {
            return '<span class="cat-highlight-lang">' + context.path.escapeHtml(item) + '</span>';
        } else if (isDir) {
            return '<span class="dir-color">' + context.path.escapeHtml(item) + '</span>';
        }
        return '<span class="code-color">' + context.path.escapeHtml(item) + '</span>';
    }

    function renderLsListing(targetPath, options, context) {
        const rawContent = context.fs.getContent(targetPath, context.state);
        let list = [...rawContent];

        if (options.all) {
            if (targetPath !== '/') {
                list.unshift('..');
            }
            list.unshift('.');
        } else if (!options.almostAll) {
            list = list.filter(item => !item.startsWith('.'));
        }

        if (options.reverse) {
            list.reverse();
        }

        if (list.length === 0) return '';

        if (options.long) {
            const rows = list.map(item => {
                const fullPath = targetPath === '/' ? '/' + item : targetPath + '/' + item;
                const isDir = (item === '.' || item === '..') ? true : context.fs.isDirectory(fullPath, context.state);
                const perms = isDir ? 'drwxr-xr-x' : '-rwxr-xr-x';
                const size = (item === '.' || item === '..') ? '4.0KB' : context.fs.getFileSize(item);
                const formattedName = formatItem(item, targetPath, context);
                const user = context.state.getCurrentUser();
                return '<tr><td class="cat-comment">' + perms + '</td><td class="cat-comment">' + user + '</td><td class="cat-comment">' + size + '</td><td>' + formattedName + '</td></tr>';
            });
            return '<table style="width:100%; text-align:left;">' + rows.join('') + '</table>';
        }

        return list.map(item => formatItem(item, targetPath, context)).join('    ');
    }

    const LsCommand = {
        name: 'ls',
        description: 'List directory contents',
        usage: 'ls [OPTION]... [FILE]...',
        async execute(args, context) {
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

            const options = { recursive: false, reverse: false, long: false, all: false, almostAll: false };
            const targets = [];

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

            const outputLines = [];

            for (const target of targets) {
                const fullPath = context.path.normalize(target, context.state.getCurrentPath(), context.state.getHomeDir());
                const isSpecial = (target === '.' || target === '..');

                if (!isSpecial && !context.fs.isDirectory(fullPath, context.state)) {
                    outputLines.push('<span class="cat-color-error">ls: cannot access \'' + context.path.escapeHtml(target) + '\': No such file or directory</span>');
                    continue;
                }

                if (options.recursive) {
                    const queue = [fullPath];
                    while (queue.length > 0) {
                        const current = queue.shift();
                        if (targets.length > 1 || options.recursive) {
                            outputLines.push('<br><span class="cat-comment">' + current + ':</span>');
                        }
                        const listing = renderLsListing(current, options, context);
                        if (listing) outputLines.push(listing);

                        let subItems = context.fs.getContent(current, context.state);
                        if (!options.all && !options.almostAll) {
                            subItems = subItems.filter(i => !i.startsWith('.'));
                        }
                        if (options.reverse) subItems.reverse();

                        subItems.forEach(item => {
                            const subPath = current === '/' ? '/' + item : current + '/' + item;
                            if (item !== '.' && item !== '..' && context.fs.isDirectory(subPath, context.state)) {
                                queue.push(subPath);
                            }
                        });
                    }
                } else {
                    if (targets.length > 1) {
                        outputLines.push('<span class="cat-comment">' + context.path.escapeHtml(target) + ':</span>');
                    }
                    outputLines.push(renderLsListing(fullPath, options, context));
                }
            }

            return { output: outputLines.join('<br>') };
        }
    };

    const CdCommand = {
        name: 'cd',
        description: 'Change the working directory',
        usage: 'cd [DIRECTORY]',
        async execute(args, context) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: cd [DIRECTORY]</span><br>Change current shell directory.<br><br>' +
                        '<span class="cat-highlight-lang">DIRECTORY</span>  Target folder (defaults to ~)<br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }

            const target = args[0] || '~';
            const normalized = context.path.normalize(target, context.state.getCurrentPath(), context.state.getHomeDir());

            if (context.state.getCurrentPath() === normalized) {
                return { output: '' };
            }

            if (context.fs.isDirectory(normalized, context.state)) {
                context.state.setCurrentPath(normalized);
                return { output: '' };
            }

            return {
                output: '<span class="cat-color-error">sh: bad pattern: ' + context.path.escapeHtml(target) + '</span>'
            };
        }
    };

    const CatCommand = {
        name: 'cat',
        description: 'Concatenate and display files',
        usage: 'cat [FILE]...',
        async execute(args, context) {
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
            const fullPath = context.path.normalize(target, context.state.getCurrentPath(), context.state.getHomeDir());

            if (fullPath.startsWith('/bin/') || fullPath.startsWith('/usr/bin/')) {
                const binaryName = context.path.basename(fullPath);
                const regCmd = window.CommandRegistry.get(binaryName);
                if (regCmd) {
                    return await regCmd.execute(['--help'], context);
                }
            }

            if (context.fs.isDirectory(fullPath, context.state)) {
                return { output: '<span class="cat-color-error">cat: ' + context.path.escapeHtml(target) + ': Is a directory</span>' };
            }

            if (!fullPath.startsWith('/home/martin/github/')) {
                return { output: '<span class="cat-color-error">cat: only supported for files in ~/github/ for now.</span>' };
            }

            const parentDir = context.path.dirname(fullPath);
            const fileName = context.path.basename(fullPath);

            if (!context.fs.isDirectory(parentDir, context.state) || !context.fs.getContent(parentDir, context.state).includes(fileName)) {
                return { output: '<span class="cat-color-error">cat: ' + context.path.escapeHtml(target) + ': No such file or directory</span>' };
            }

            const fileUrl = context.github.resolveRawUrl(fullPath);
            if (!fileUrl) {
                return { output: '<span class="cat-color-error">cat: cannot resolve file URL</span>' };
            }

            if (context.github.isImage(fileName)) {
                return {
                    output: '<img src="' + fileUrl + '" alt="' + context.path.escapeHtml(fileName) + '" style="max-width:100%; max-height:400px; display:block; margin:8px 0; border-radius:6px;">'
                };
            }

            if (context.github.isPdf(fileName)) {
                return {
                    output: '<span class="system-message">PDF document: <a href="' + fileUrl + '" target="_blank" style="color:#51a2da; text-decoration:underline;">Open ' + context.path.escapeHtml(fileName) + ' in new tab</a></span>'
                };
            }

            try {
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error("File not found on GitHub");
                let text = await response.text();
                const language = context.github.detectLanguage(fileName);
                text = context.path.escapeHtml(text);

                if (window.hljs) {
                    try {
                        const highlighted = window.hljs.highlight(text, { language: language }).value;
                        return { output: '<pre><code class="hljs language-' + language + '">' + highlighted + '</code></pre>' };
                    } catch (e) {
                        return { output: '<pre>' + text + '</pre>' };
                    }
                }
                return { output: '<pre>' + text + '</pre>' };
            } catch (err) {
                return { output: '<span class="cat-color-error">cat: error fetching file: ' + err.message + '</span>' };
            }
        }
    };

    const TreeCommand = {
        name: 'tree',
        description: 'Open visual tree explorer',
        usage: 'tree [DIRECTORY]',
        async execute(args, context) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: tree [DIRECTORY]</span><br>' +
                        'Display an interactive graphical tree view of the filesystem in another window.<br>' +
                        'Click on a branch to navigate to a folder, or click on a leaf to print the file.<br><br>' +
                        '<span class="cat-highlight-lang">DIRECTORY</span>  Optional target directory (current path by default)<br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }

            const target = args[0]
                ? context.path.normalize(args[0], context.state.getCurrentPath(), context.state.getHomeDir())
                : context.state.getCurrentPath();

            if (context.tree && typeof context.tree.open === 'function') {
                context.tree.open(target);
            }

            return {
                output: '<span class="system-message">Tree window opened for <span class="path">' + context.path.escapeHtml(target) + '</span>. Click on a branch to cd, or a leaf to cat the file.</span>'
            };
        }
    };

    const ClearCommand = {
        name: 'clear',
        description: 'Clear the terminal screen',
        usage: 'clear',
        async execute(args) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: clear</span><br>Clear the terminal screen.<br><br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }
            return { action: 'clear' };
        }
    };

    const ExitCommand = {
        name: 'exit',
        description: 'Exit portfolio session',
        usage: 'exit',
        async execute(args) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: exit</span><br>Exit portfolio session and navigate to GitHub profile.<br><br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }
            return { action: 'redirect', url: 'https://github.com/XanderTheRat' };
        }
    };

    const HelpCommand = {
        name: 'help',
        description: 'Display available shell commands',
        usage: 'help',
        async execute() {
            return {
                output: '<span class="system-message">Commands Shell:</span> ls, cd, cat, tree, clear, usermod, help<br>' +
                    '<span class="system-message">Type <span class="command-text">{command} --help</span> or <span class="command-text">{command} -h</span> to show a complete list of attributes for the command<br>' +
                    'In the <span class="command-text">~/github/{project}/README.md</span> file, you can see the competences implied in the project</span><br>'
            };
        }
    };

    const UsermodCommand = {
        name: 'usermod',
        description: 'Modify user account settings',
        usage: 'usermod [OPTION]... [VALUE]...',
        async execute(args, context) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: usermod [OPTION]... [VALUE]...</span><br>' +
                        'Change the current user and their directory.<br><br>' +
                        '<span class="cat-highlight-lang">--login</span>  Needed. This is the new user name<br>' +
                        '<span class="cat-highlight-lang">--home</span>   Optional. This is the new user\'s directory<br><br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }

            let newLogin = context.state.getCurrentUser();
            let newHome = context.state.getHomeDir();
            let changeMade = false;
            let homeExplicitlySet = false;
            const oldHome = context.state.getHomeDir();

            for (let i = 0; i < args.length; i++) {
                if (args[i] === '--login' && i + 1 < args.length) {
                    newLogin = args[i + 1].replace(/[^a-zA-Z0-9_]/g, '');
                    i++;
                    changeMade = true;
                } else if (args[i] === '--home' && i + 1 < args.length) {
                    if (!args[i + 1].startsWith('/')) {
                        return { output: '<span class="cat-color-error">Erreur: Chemin absolu requis.</span>' };
                    }
                    newHome = args[i + 1];
                    homeExplicitlySet = true;
                    i++;
                    changeMade = true;
                }
            }

            if (changeMade) {
                if (!homeExplicitlySet && newLogin !== context.state.getCurrentUser()) {
                    newHome = '/home/' + newLogin;
                }
                context.fs.updateHomePath(oldHome, newHome);
                context.state.setUser(newLogin, newHome);

                const currentPath = context.state.getCurrentPath();
                if (currentPath.startsWith(oldHome)) {
                    context.state.setCurrentPath(newHome + currentPath.substring(oldHome.length));
                }

                return {
                    output: '<span class="system-message">Utilisateur mis à jour: ' + newLogin + '. Home: ' + newHome + '.</span>'
                };
            }

            return {
                output: '<span class="system-message">Usage: usermod [OPTION]... [VALUE]...</span><br>' +
                    'Change the current user and their directory.<br><br>' +
                    '<span class="cat-highlight-lang">--login</span>  Needed. This is the new user name<br>' +
                    '<span class="cat-highlight-lang">--home</span>   Optional. This is the new user\'s directory<br><br>' +
                    '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
            };
        }
    };

    const SysinfoCommand = {
        name: 'sysinfo',
        description: 'Show CPU and memory usage',
        usage: 'sysinfo',
        async execute(args) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: sysinfo</span><br>Display current CPU and memory utilization.<br><br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }
            return { output: '<span class="cpu-color">CPU 15%</span> | <span class="mem-color">MEM 45%</span>' };
        }
    };

    const BatteryCommand = {
        name: 'battery',
        description: 'Show battery level',
        usage: 'battery',
        async execute(args) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: battery</span><br>Display current battery percentage.<br><br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }
            return { output: '<span class="bat-color-normal">65%</span>' };
        }
    };

    const ChangeBatteryModeCommand = {
        name: 'change_battery_mode',
        description: 'Toggle power profiles',
        usage: 'change_battery_mode',
        async execute(args) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: change_battery_mode</span><br>Toggle between battery power saving modes.<br><br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }
            return { output: '<span class="system-message">Mode batterie changé.</span>' };
        }
    };

    const NetworkStatusCommand = {
        name: 'network_status',
        description: 'Show network connection',
        usage: 'network_status',
        async execute(args) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: network_status</span><br>Display active network SSID and state.<br><br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }
            return { output: '<span class="net-color-wifi">PortfolioMartin</span>' };
        }
    };

    const ChangeNetworkStatusCommand = {
        name: 'change_network_status',
        description: 'Toggle network connection mode',
        usage: 'change_network_status',
        async execute(args) {
            if (args && (args.includes('--help') || args.includes('-h'))) {
                return {
                    output: '<span class="system-message">Usage: change_network_status</span><br>Toggle network connectivity status.<br><br>' +
                        '<span class="cat-highlight-lang">--help, -h</span>  display this help and exit'
                };
            }
            return { output: '<span class="system-message">Mode réseau changé.</span>' };
        }
    };

    window.CommandRegistry.register('ls', LsCommand);
    window.CommandRegistry.register('cd', CdCommand);
    window.CommandRegistry.register('cat', CatCommand);
    window.CommandRegistry.register('bat', CatCommand);
    window.CommandRegistry.register('tree', TreeCommand);
    window.CommandRegistry.register('clear', ClearCommand);
    window.CommandRegistry.register('exit', ExitCommand);
    window.CommandRegistry.register('help', HelpCommand);
    window.CommandRegistry.register('usermod', UsermodCommand);
    window.CommandRegistry.register('sysinfo', SysinfoCommand);
    window.CommandRegistry.register('battery', BatteryCommand);
    window.CommandRegistry.register('change_battery_mode', ChangeBatteryModeCommand);
    window.CommandRegistry.register('network_status', NetworkStatusCommand);
    window.CommandRegistry.register('change_network_status', ChangeNetworkStatusCommand);
})();
