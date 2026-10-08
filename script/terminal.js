function updatePromptUI() {
    if (window.TerminalUI && typeof window.TerminalUI.updatePrompt === 'function') {
        return window.TerminalUI.updatePrompt();
    }
    const user = (window.shellState && window.shellState.currentUser) ? window.shellState.currentUser : 'martin';
    const path = (window.shellState && window.shellState.currentPath) ? window.shellState.currentPath : '/';
    return '<span class="zsh-prompt user-host">[' + user + '@fedora</span> <span class="zsh-prompt path">' + path + '</span><span class="zsh-prompt prompt-symbol">]$</span>';
}

function appendOutput(html) {
    if (window.TerminalUI && typeof window.TerminalUI.appendOutput === 'function') {
        window.TerminalUI.appendOutput(html);
        return;
    }
    const outputEl = document.getElementById('terminal-output');
    if (!outputEl) return;
    const div = document.createElement('div');
    div.classList.add('terminal-line');
    div.innerHTML = html;
    outputEl.appendChild(div);
    const win = document.querySelector('.terminal-window');
    if (win) win.scrollTop = win.scrollHeight;
}

function appendPrompt(command) {
    if (window.TerminalUI && typeof window.TerminalUI.appendPrompt === 'function') {
        window.TerminalUI.appendPrompt(command);
        return;
    }
    appendOutput(updatePromptUI() + ' <span class="command-text">' + command + '</span>');
}

function scrollToBottom() {
    const win = document.querySelector('.terminal-window');
    if (win) win.scrollTop = win.scrollHeight;
}