const interactiveInput = document.getElementById('interactive-input');
const terminalOutput = document.getElementById('terminal-output');
const currentPathElement = document.getElementById('current-path');

const commandHistory = [];
let historyIndex = -1;
const DIRECTORIES = ['scripts.rs', 'Documents', 'Desktop']; 
const BUILT_IN_COMMANDS = ['help', 'ls', 'cd', 'clear'];
const HOME_PATH = '~';

// Chemin par défaut.
currentPathElement.textContent = HOME_PATH; 

const promptPrefix = () => `<span class="zsh-prompt user-host">user@hostname</span><span class="zsh-prompt colon">:</span><span class="zsh-prompt path">${currentPathElement.textContent}</span><span class="zsh-prompt prompt-symbol">$</span>`;
const EXECUTABLES = ["sysinfo", "battery", "change_battery_mode", "network_status", "change_network_status"];

let internalState = {
    battery_mode: 1, 
    network_mode: 1,
    simulated_data: {
        battery_percent: 65,
        network_ssid: "MyWaybarWifi",
        ipv4: "192.168.1.50/24",
        ipv6: "fe80::4a5c:3f00:f62b:a5b2/64",
        cpu_percent: 15,
        mem_percent: 45
    }
};

function scrollToBottom() {
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function appendPrompt(command) {
    const executedLine = document.createElement('div');
    executedLine.classList.add('terminal-line');
    executedLine.innerHTML = `${promptPrefix()} <span class="command-text">${command}</span>`;
    terminalOutput.appendChild(executedLine);
}

function appendOutput(htmlContent) {
    const outputLine = document.createElement('div');
    outputLine.classList.add('terminal-line');
    outputLine.innerHTML = htmlContent;
    terminalOutput.appendChild(outputLine);
    
    scrollToBottom();
}

function executeSysinfo() {
    const cpu_color = "cpu-color";
    const mem_color = "mem-color";
    const cpu = internalState.simulated_data.cpu_percent;
    const mem = internalState.simulated_data.mem_percent;
    return `<span class="${cpu_color}">CPU ${cpu}%</span> | <span class="${mem_color}">MEM ${mem}%</span>`;
}

function executeBattery() {
    const mode = internalState.battery_mode;
    const percent = internalState.simulated_data.battery_percent;
    let output = "";

    if (mode === 1) {
        let colorClass;
        let icon;
        if (percent >= 80) { icon = ""; } 
        else if (percent >= 60) { icon = ""; } 
        else if (percent >= 40) { icon = ""; } 
        else if (percent >= 20) { icon = ""; } 
        else { icon = ""; }

        if (percent > 30) {
            colorClass = "bat-color-normal";
        } else if (percent > 15) {
            colorClass = "bat-color-plugged"; 
        } else {
            colorClass = "bat-color-error"; 
        }

        output = `<span class="${colorClass}">${percent}% ${icon}</span>`;
    } else if (mode === 2) {
        const remaining_hours = 3;
        const remaining_minute = 45;
        const colorClass = "bat-color-normal";
        output = `<span class="${colorClass}">${remaining_hours} heure(s) ${remaining_minute} minutes</span>`;
    }
    return output;
}

function executeChangeBatteryMode() {
    internalState.battery_mode = (internalState.battery_mode === 1) ? 2 : 1; 
    return `<span class="system-message">Mode batterie changé à ${internalState.battery_mode} (simule l'écriture dans 'battery_state').</span>`;
}

function executeNetworkStatus() {
    const mode = internalState.network_mode;
    let output = "";

    if (mode === 1) {
        const ssid = internalState.simulated_data.network_ssid;
        if (ssid) {
            output = `<span class="net-color-wifi"> ${ssid}</span>`; 
        } else {
            output = `<span class="net-color-error">⚠ Disconnected</span>`;
        }
    } else if (mode === 2) {
        const ipv4 = internalState.simulated_data.ipv4;
        output = `<span class="net-color-ipv4">ipv4:</span><span class="net-color-wifi"> ${ipv4}</span>`; 
    } else if (mode === 3) {
        const ipv6 = internalState.simulated_data.ipv6;
        output = `<span class="net-color-ipv6">ipv6:</span><span class="net-color-wifi"> ${ipv6}</span>`;
    }
    return output;
}

function executeChangeNetworkStatus() {
    if (internalState.network_mode === 1) {
        internalState.network_mode = 2;
    } else if (internalState.network_mode === 2) {
        internalState.network_mode = 3;
    } else {
        internalState.network_mode = 1;
    }
    return `<span class="system-message">Mode réseau changé à ${internalState.network_mode} (simule l'écriture dans 'network_status').</span>`;
}

function resolvePath(currentPath, targetPath) {
    let path = currentPath === HOME_PATH ? '' : currentPath.substring(HOME_PATH.length + 1);
    let segments = path ? path.split('/') : [];
    
    if (targetPath.startsWith('/')) {
        segments = [];
        targetPath = targetPath.substring(1);
    }

    const targetSegments = targetPath.split('/').filter(s => s.length > 0);
    let error = null;

    for (const segment of targetSegments) {
        const currentDir = segments.length > 0 ? segments[segments.length - 1] : '';

        if (segment === '..') {
            if (segments.length === 0) {
                error = `zsh: permission denied: cd .. (déjà à la racine simulée)`;
                break;
            }
            segments.pop();
        } else if (segment === '.') {} 
        else {
            const target = segment;
            const targetPathString = segments.join('/');

            if (targetPathString === 'scripts.rs') {
                error = `zsh: cd: répertoire non trouvé: ${target}`;
                break;
            }

            if (targetPathString === '') {
                if (!DIRECTORIES.includes(target)) {
                    error = `zsh: cd: répertoire non trouvé: ${target}`;
                    break;
                }
            } else if (targetPathString.startsWith('scripts.rs')) {
                error = `zsh: cd: répertoire non trouvé: ${target}`; 
                break;
            } else if (targetPathString.startsWith('Documents') || targetPathString.startsWith('Desktop')) {
                error = `zsh: cd: répertoire non trouvé: ${target}`;
                break;
            }
            
            
            if (segments.length < 1) {
                if (DIRECTORIES.includes(segment)) {
                     segments.push(segment);
                } else {
                    error = `zsh: cd: répertoire non trouvé: ${segment}`;
                    break;
                }
            } else {
                error = `zsh: cd: répertoire non trouvé: ${segment}`;
                break;
            }
        }
    }

    if (error) {
        return { newPath: currentPath, error: error };
    }

    const newPathSegment = segments.join('/');
    const newPath = newPathSegment ? `${HOME_PATH}/${newPathSegment}` : HOME_PATH;
    return { newPath: newPath, error: null };
}

function handleCommand(commandLine) {
    const parts = commandLine.trim().split(/\s+/).filter(p => p.length > 0);
    const command = parts[0];
    const args = parts.slice(1);

    let output = "";

    if (commandLine && commandHistory[commandHistory.length - 1] !== commandLine) {
        commandHistory.push(commandLine);
        historyIndex = commandHistory.length;
    }


    if (command === 'help') {
        output = `
<span class="system-message">Commandes binaires disponibles dans 'scripts.rs' :</span>
<span class="bat-highlight-lang">${EXECUTABLES.join(' ')}</span>
<span class="system-message">Commandes shell:</span>
<span class="net-color-wifi">ls</span>             : Liste les fichiers/dossiers (supporte -a).
<span class="net-color-wifi">cd &lt;path&gt;</span>      : Change de répertoire (supporte chemins relatifs: ../Documents).
<span class="net-color-wifi">clear</span>          : Efface l'écran.
        `;
    } else if (command === 'ls') {
        const showHidden = args.includes('-a');
        const currentPath = currentPathElement.textContent;
        
        let fileList = [];
        
        if (showHidden) {
            fileList.push(`<span class="dir-color">.</span>`);
            if (currentPath !== HOME_PATH) {
                fileList.push(`<span class="dir-color">..</span>`);
            }
        }
        
        if (currentPath === HOME_PATH) {
            fileList.push(...DIRECTORIES.map(dir => `<span class="dir-color">${dir}</span>`));
        } else if (currentPath === '~/scripts.rs') {
            fileList.push(...EXECUTABLES.map(exe => `<span class="bat-highlight-lang">${exe}</span>`));
        } else if (currentPath === '~/Documents' || currentPath === '~/Desktop') {}
         else {
            output = `<span class="bat-color-error">zsh: permission denied: ls</span>`;
            return;
        }
        
        output = fileList.join('    ');

    } else if (command === 'clear') {
        terminalOutput.innerHTML = '';
        return;
    } else if (command === 'cd') {
        const target = args[0] || HOME_PATH;

        if (target === HOME_PATH) {
            currentPathElement.textContent = HOME_PATH;
            return;
        }
        
        const result = resolvePath(currentPathElement.textContent, target);

        if (result.error) {
            output = `<span class="bat-color-error">${result.error}</span>`;
        } else {
            const oldPath = currentPathElement.textContent;
            currentPathElement.textContent = result.newPath;
            if (result.newPath === oldPath) {
            } else if (result.newPath === '~/scripts.rs') {
                output = `<span class="system-message">Bienvenue dans les binaires Waybar. Exécutez <span class="net-color-wifi">ls</span>.</span>`;
            }
        }
    } else if (EXECUTABLES.includes(command)) {
        if (currentPathElement.textContent !== '~/scripts.rs') {
            output = `<span class="bat-color-error">zsh: command not found: ${commandLine}</span>`;
        } else {
            switch (command) {
                case 'sysinfo':
                    output = executeSysinfo();
                    break;
                case 'battery':
                    output = executeBattery();
                    break;
                case 'change_battery_mode':
                    output = executeChangeBatteryMode();
                    break;
                case 'network_status':
                    output = executeNetworkStatus();
                    break;
                case 'change_network_status':
                    output = executeChangeNetworkStatus();
                    break;
            }
        }
    } else {
        output = `<span class="bat-color-error">zsh: command not found: ${commandLine}</span>`;
    }

    if (output) {
        appendOutput(output);
    }
}

interactiveInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const commandLine = interactiveInput.textContent.trim();
        
        appendPrompt(commandLine);
        handleCommand(commandLine);
        
        interactiveInput.textContent = ''; 
        historyIndex = commandHistory.length;
        
        return;
    } 
    
    else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();

        if (commandHistory.length === 0) return;

        if (event.key === 'ArrowUp') {
            historyIndex = Math.max(0, historyIndex - 1);
        } else if (event.key === 'ArrowDown') {
            historyIndex = Math.min(commandHistory.length, historyIndex + 1);
        }

        const command = (historyIndex < commandHistory.length) ? commandHistory[historyIndex] : '';
        interactiveInput.textContent = command;
        
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(interactiveInput);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        
        return;
    }
    
    else if (event.key === 'Tab') {
        event.preventDefault();
        
        const fullInput = interactiveInput.textContent.trim();
        const inputParts = fullInput.split(/\s+/);
        const command = inputParts[0] || '';
        const currentPath = currentPathElement.textContent;

        let suggestions = [];
        let partial = '';
        
        if (inputParts.length <= 1) {
            suggestions = BUILT_IN_COMMANDS;
            if (currentPath === '~/scripts.rs') {
                suggestions = [...suggestions, ...EXECUTABLES];
            }
            partial = command;
            
        } else if (command === 'cd') {
            const target = inputParts[1] || '';
            
            let dirOptions = ['..', '.']; 
            
            if (currentPath === HOME_PATH) {
                dirOptions = [...dirOptions, ...DIRECTORIES];
            } else if (currentPath === '~/scripts.rs' || currentPath === '~/Documents' || currentPath === '~/Desktop') {}

            suggestions = dirOptions;
            partial = target;
        }


        const matches = suggestions.filter(cmd => cmd.startsWith(partial));

        if (matches.length === 1) {
            if (command === 'cd') {
                 interactiveInput.textContent = `cd ${matches[0]}`;
            } else {
                 interactiveInput.textContent = matches[0];
            }
            
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(interactiveInput);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            
        } else if (matches.length > 1) {
            appendPrompt(interactiveInput.textContent);
            const outputHTML = `<span class="net-color-wifi">${matches.join('    ')}</span>`;
            appendOutput(outputHTML);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    interactiveInput.focus();
    scrollToBottom();
});

