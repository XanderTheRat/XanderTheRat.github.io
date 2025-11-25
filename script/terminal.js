const interactiveInput = document.getElementById('interactive-input');
const terminalOutput = document.getElementById('terminal-output');
const currentPathElement = document.getElementById('current-path');
const currentUserElement = document.getElementById('current-user');

const commandHistory = [];
let historyIndex = -1;

function updatePromptUI() {
    if (typeof shellState === 'undefined') return;

    const displayPath = shellState.currentPath.startsWith(shellState.homeDir) && shellState.currentPath !== '/'
        ? `~${shellState.currentPath.substring(shellState.homeDir.length)}`
        : shellState.currentPath;

    if (currentPathElement) currentPathElement.textContent = displayPath;
    if (currentUserElement) currentUserElement.textContent = `${shellState.currentUser}@hostname`;

    return `<span class="zsh-prompt user-host">${shellState.currentUser}@hostname</span><span class="zsh-prompt colon">:</span><span class="zsh-prompt path">${displayPath}</span><span class="zsh-prompt prompt-symbol">$</span>`;
}

function appendOutput(html) {
    const div = document.createElement('div');
    div.classList.add('terminal-line');
    div.innerHTML = html;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function appendPrompt(command) {
    appendOutput(`${updatePromptUI()} <span class="command-text">${command}</span>`);
}

interactiveInput.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const cmdLine = interactiveInput.textContent.trim();
        
        appendPrompt(cmdLine);
        
        if (cmdLine) {
            commandHistory.push(cmdLine);
            historyIndex = commandHistory.length;
            
            const parts = cmdLine.split(/\s+/).filter(p => p.length > 0);
            
            if (typeof executeCommand === 'function') {
                try {
                    const result = await executeCommand(parts[0], parts.slice(1));
                    
                    if (result.action === 'clear') {
                        terminalOutput.innerHTML = '';
                    } else if (result.action === 'redirect') {
                        window.location.href = result.url;
                    } else if (result.output) {
                        appendOutput(result.output);
                    }
                } catch (e) {
                    appendOutput(`<span class="bat-color-error">Error executing command: ${e.message}</span>`);
                }
            } else {
                appendOutput('<span class="bat-color-error">Erreur: commande.js non chargé.</span>');
            }
        }
        
        interactiveInput.textContent = '';
        updatePromptUI();
    }
    
    else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (commandHistory.length === 0) return;
        
        if (event.key === 'ArrowUp') {
            historyIndex = Math.max(0, historyIndex - 1);
        } else {
            historyIndex = Math.min(commandHistory.length, historyIndex + 1);
        }
        
        interactiveInput.textContent = commandHistory[historyIndex] || '';
        
        const range = document.createRange();
        const sel = window.getSelection();
        if (interactiveInput.childNodes.length > 0) {
            range.selectNodeContents(interactiveInput);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    
    else if (event.key === 'Tab') {
        event.preventDefault();
        const current = interactiveInput.textContent.trim();
        const parts = current.split(/\s+/);
        const cmd = parts[0];
        
        if (parts.length === 1) {
            const allOptions = (typeof BUILT_IN_COMMANDS !== 'undefined' ? BUILT_IN_COMMANDS : []).concat(typeof EXECUTABLES !== 'undefined' ? EXECUTABLES : []);
            const match = allOptions.find(opt => opt.startsWith(cmd));
            if (match) {
                interactiveInput.textContent = match;
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(interactiveInput);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    interactiveInput.focus();
    updatePromptUI();
});