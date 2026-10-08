window.TerminalUI = (function() {
    let interactiveInput = null;
    let terminalOutput = null;
    let currentPathElement = null;
    let currentUserElement = null;
    let terminalWindow = null;
    let lastTabTime = 0;

    function getDisplayPath() {
        if (!window.ShellState) return '/';
        const cur = window.ShellState.getCurrentPath();
        const home = window.ShellState.getHomeDir();
        if (cur === home) return '~';
        if (cur.startsWith(home + '/')) {
            return '~' + cur.substring(home.length);
        }
        return cur;
    }

    function formatPromptHTML() {
        const user = window.ShellState ? window.ShellState.getCurrentUser() : 'martin';
        const displayPath = getDisplayPath();
        return '<span class="zsh-prompt user-host">[' + user + '@fedora</span> <span class="zsh-prompt path">' + displayPath + '</span><span class="zsh-prompt prompt-symbol">]$</span>';
    }

    function updatePrompt() {
        const displayPath = getDisplayPath();
        const user = window.ShellState ? window.ShellState.getCurrentUser() : 'martin';

        if (currentPathElement) currentPathElement.textContent = displayPath;
        if (currentUserElement) currentUserElement.textContent = '[' + user + '@fedora';

        return formatPromptHTML();
    }

    function scrollToBottom() {
        if (terminalWindow) {
            terminalWindow.scrollTop = terminalWindow.scrollHeight;
        }
    }

    function appendOutput(html) {
        if (!terminalOutput) return;
        const div = document.createElement('div');
        div.classList.add('terminal-line');
        div.innerHTML = html;
        terminalOutput.appendChild(div);
        scrollToBottom();
    }

    function appendPrompt(command) {
        appendOutput(formatPromptHTML() + ' <span class="command-text">' + window.PathUtils.escapeHtml(command) + '</span>');
    }

    async function runCommand(cmdLine) {
        const trimmed = (cmdLine || '').trim();
        appendPrompt(trimmed);

        if (!trimmed) {
            updatePrompt();
            scrollToBottom();
            return '';
        }

        window.ShellState.addHistory(trimmed);
        const parts = trimmed.split(/\s+/).filter(p => p.length > 0);
        const command = parts[0];
        const args = parts.slice(1);

        const context = {
            state: window.ShellState,
            fs: window.VirtualFileSystem,
            path: window.PathUtils,
            github: window.GitHubService,
            tree: window.TreeWindow,
            terminal: window.TerminalUI
        };

        const result = await window.CommandRegistry.execute(command, args, context);

        if (result.action === 'clear') {
            if (terminalOutput) terminalOutput.innerHTML = '';
        } else if (result.action === 'redirect' && result.url) {
            window.location.href = result.url;
        } else if (result.output) {
            appendOutput(result.output);
        }

        updatePrompt();
        scrollToBottom();
        return result.output || '';
    }

    function focus() {
        if (interactiveInput) {
            interactiveInput.focus();
        }
    }

    function init() {
        interactiveInput = document.getElementById('interactive-input');
        terminalOutput = document.getElementById('terminal-output');
        currentPathElement = document.getElementById('current-path');
        currentUserElement = document.getElementById('current-user');
        terminalWindow = document.querySelector('.terminal-window');

        if (!interactiveInput) return;

        window.ShellState.on('pathChanged', () => {
            updatePrompt();
        });

        window.ShellState.on('userChanged', () => {
            updatePrompt();
        });

        interactiveInput.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const cmd = interactiveInput.textContent.trim();
                interactiveInput.textContent = '';
                await runCommand(cmd);
                interactiveInput.focus();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                const prev = window.ShellState.getPreviousHistory();
                if (prev !== null) {
                    interactiveInput.textContent = prev;
                    placeCaretAtEnd(interactiveInput);
                }
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                const next = window.ShellState.getNextHistory();
                if (next !== null) {
                    interactiveInput.textContent = next;
                    placeCaretAtEnd(interactiveInput);
                }
            } else if (event.key === 'Tab') {
                event.preventDefault();
                const now = Date.now();
                const isDoubleTab = (now - lastTabTime < 350);
                lastTabTime = now;

                const fullInput = interactiveInput.textContent;
                const tokens = fullInput.split(/(\s+)/);
                const lastToken = tokens[tokens.length - 1];
                const isCommandPosition = (tokens.filter(t => t.trim().length > 0).length <= 1);

                const context = {
                    state: window.ShellState,
                    fs: window.VirtualFileSystem,
                    path: window.PathUtils
                };

                const data = window.AutocompleteService.getSuggestions(lastToken.trim(), isCommandPosition, context);
                if (data.matches.length === 0) return;

                const commonPrefix = window.PathUtils.getCommonPrefix(data.matches);
                let completedToken = '';

                const slashIndex = lastToken.lastIndexOf('/');
                if (slashIndex !== -1) {
                    completedToken = lastToken.substring(0, slashIndex + 1) + commonPrefix;
                } else {
                    completedToken = commonPrefix;
                }

                if (completedToken.length > lastToken.length) {
                    tokens[tokens.length - 1] = completedToken;
                    interactiveInput.textContent = tokens.join('');
                    placeCaretAtEnd(interactiveInput);
                }

                if (isDoubleTab && data.matches.length > 1) {
                    appendPrompt(interactiveInput.textContent);
                    const gridHTML = window.AutocompleteService.formatSuggestionGrid(data.matches, data.parentPath, context);
                    appendOutput(gridHTML);
                }
            }
        });

        if (terminalWindow) {
            terminalWindow.addEventListener('click', () => {
                const sel = window.getSelection();
                if (!sel || sel.toString().length === 0) {
                    focus();
                }
            });
        }

        updatePrompt();
        focus();
    }

    function placeCaretAtEnd(el) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    return {
        init,
        focus,
        appendOutput,
        appendPrompt,
        runCommand,
        updatePrompt
    };
})();
