(function() {
    window.shellState = window.ShellState ? window.ShellState.getRawState() : null;
    window.FILESYSTEM = window.VirtualFileSystem ? window.VirtualFileSystem.getRawFilesystem() : {};
    window.EXECUTABLES = window.VirtualFileSystem ? window.VirtualFileSystem.getExecutables() : [];
    window.BUILT_IN_COMMANDS = window.CommandRegistry ? window.CommandRegistry.list() : [];

    window.normalizePath = function(p) {
        return window.PathUtils.normalize(p, window.ShellState.getCurrentPath(), window.ShellState.getHomeDir());
    };

    window.isDirectory = function(p) {
        return window.VirtualFileSystem.isDirectory(p, window.ShellState);
    };

    window.getPathContent = function(p) {
        return window.VirtualFileSystem.getContent(p, window.ShellState);
    };

    window.executeCommand = async function(command, args) {
        const context = {
            state: window.ShellState,
            fs: window.VirtualFileSystem,
            path: window.PathUtils,
            github: window.GitHubService,
            tree: window.TreeWindow,
            terminal: window.TerminalUI
        };
        return await window.CommandRegistry.execute(command, args || [], context);
    };

    window.openTreeWindow = function(targetPath) {
        if (window.TreeWindow) {
            window.TreeWindow.open(targetPath);
        }
    };

    window.closeTreeWindow = function() {
        if (window.TreeWindow) {
            window.TreeWindow.close();
        }
    };

    document.addEventListener('DOMContentLoaded', async () => {
        if (window.WaybarPanel) window.WaybarPanel.init();
        else if (window.FedoraPanel) window.FedoraPanel.init();
        if (window.TreeWindow) window.TreeWindow.init();
        if (window.TerminalUI) window.TerminalUI.init();

        const helpRes = await window.executeCommand('help', []);
        if (helpRes && helpRes.output && window.TerminalUI) {
            window.TerminalUI.appendOutput(helpRes.output);
        }
    });
})();
