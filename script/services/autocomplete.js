window.AutocompleteService = (function() {
    function getSuggestions(token, isCommand, context) {
        let matches = [];
        let parentPath = '';

        if (isCommand) {
            const allCommands = [...window.CommandRegistry.list()];
            matches = allCommands.filter(cmd => cmd.startsWith(token));
            parentPath = '/bin';
        } else {
            let dirToSearch = context.state.getCurrentPath();
            let partialName = token;

            const lastSlashIndex = token.lastIndexOf('/');
            if (lastSlashIndex !== -1) {
                const pathPart = token.substring(0, lastSlashIndex + 1);
                partialName = token.substring(lastSlashIndex + 1);
                dirToSearch = context.path.normalize(pathPart, context.state.getCurrentPath(), context.state.getHomeDir());
            } else if (token === '~') {
                dirToSearch = '/home';
                partialName = context.state.getCurrentUser();
            }

            if (context.fs.isDirectory(dirToSearch, context.state)) {
                const content = context.fs.getContent(dirToSearch, context.state);
                matches = content.filter(item => item.startsWith(partialName));
                parentPath = dirToSearch;
            }
        }

        return { matches, parentPath };
    }

    function formatSuggestionGrid(matches, parentPath, context) {
        if (!matches || matches.length === 0) return '';
        const formatted = matches.map(item => {
            const fullPath = parentPath === '/' ? '/' + item : parentPath + '/' + item;
            const isDir = context.fs.isDirectory(fullPath, context.state);
            if (isDir) {
                return '<span class="dir-color">' + context.path.escapeHtml(item) + '</span>';
            }
            return '<span class="code-color">' + context.path.escapeHtml(item) + '</span>';
        });
        return '<div class="autocomplete-grid">' + formatted.join('    ') + '</div>';
    }

    return {
        getSuggestions,
        formatSuggestionGrid
    };
})();
