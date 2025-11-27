const interactiveInput = document.getElementById('interactive-input');
const terminalOutput = document.getElementById('terminal-output');
const currentPathElement = document.getElementById('current-path');
const currentUserElement = document.getElementById('current-user');

const commandHistory = [];
let historyIndex = -1;
let lastTabTime = 0;

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
        const now = Date.now();
        const isDoubleTab = (now - lastTabTime < 300);
        lastTabTime = now;

        const fullInput = interactiveInput.textContent; 

        const tokens = fullInput.split(/(\s+)/); 
        const lastToken = tokens[tokens.length - 1];
        const isCommandPosition = (tokens.filter(t => t.trim().length > 0).length <= 1);

        const data = getAutocompleteData(lastToken.trim(), isCommandPosition);
        
        if (data.matches.length === 0) {
            return;
        }

        const commonPrefix = getCommonPrefix(data.matches);

        let prefixToAdd = commonPrefix;
        let completedToken = "";

        const slashIndex = lastToken.lastIndexOf('/');
        if (slashIndex !== -1) {
            completedToken = lastToken.substring(0, slashIndex + 1) + commonPrefix;
        } else {
            completedToken = commonPrefix;
        }

        if (completedToken.length > lastToken.length) {
            tokens[tokens.length - 1] = completedToken;
            interactiveInput.textContent = tokens.join('');
            
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(interactiveInput);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        if (isDoubleTab && data.matches.length > 1) {
            appendPrompt(interactiveInput.textContent);
            const gridHTML = formatSuggestionGrid(data.matches, data.parentPath);
            appendOutput(gridHTML);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    interactiveInput.focus();
    updatePromptUI();
});