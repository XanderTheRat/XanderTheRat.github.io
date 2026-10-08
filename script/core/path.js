window.PathUtils = (function() {
    function normalize(targetPath, currentPath, homeDir) {
        if (!targetPath) return currentPath || '/';
        let path = targetPath;
        if (path === '~') {
            path = homeDir;
        } else if (path.startsWith('~/')) {
            path = homeDir + path.substring(1);
        } else if (!path.startsWith('/')) {
            const base = (currentPath === '/' ? '' : currentPath);
            path = base + '/' + path;
        }
        const segments = path.split('/').filter(s => s.length > 0);
        const resolved = [];
        for (const segment of segments) {
            if (segment === '.') continue;
            if (segment === '..') {
                if (resolved.length > 0) resolved.pop();
            } else {
                resolved.push(segment);
            }
        }
        return '/' + resolved.join('/');
    }

    function join(...segments) {
        const joined = segments.filter(Boolean).join('/');
        return normalize(joined, '/', '/home/martin');
    }

    function dirname(path) {
        if (!path || path === '/') return '/';
        const lastSlash = path.lastIndexOf('/');
        if (lastSlash <= 0) return '/';
        return path.substring(0, lastSlash);
    }

    function basename(path) {
        if (!path || path === '/') return '/';
        const lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substring(lastSlash + 1);
    }

    function getCommonPrefix(strings) {
        if (!strings || !strings.length) return '';
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (strings[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (!prefix) return '';
            }
        }
        return prefix;
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    return {
        normalize,
        join,
        dirname,
        basename,
        getCommonPrefix,
        escapeHtml
    };
})();
