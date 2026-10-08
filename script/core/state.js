window.ShellState = (function() {
    let currentUser = "martin";
    let homeDir = "/home/martin";
    let currentPath = "/";
    const history = [];
    let historyIndex = -1;
    const listeners = {};

    function on(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(callback);
    }

    function emit(event, data) {
        if (listeners[event]) {
            listeners[event].forEach(cb => {
                try {
                    cb(data);
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }

    function getCurrentUser() {
        return currentUser;
    }

    function getHomeDir() {
        return homeDir;
    }

    function getCurrentPath() {
        return currentPath;
    }

    function setCurrentPath(path) {
        if (currentPath !== path) {
            currentPath = path;
            emit('pathChanged', currentPath);
        }
    }

    function setUser(newLogin, newHome) {
        currentUser = newLogin;
        if (newHome) {
            homeDir = newHome;
        }
        emit('userChanged', { currentUser, homeDir });
    }

    function addHistory(command) {
        if (command && command.trim()) {
            history.push(command.trim());
            historyIndex = history.length;
            emit('historyChanged', history);
        }
    }

    function getPreviousHistory() {
        if (history.length === 0) return null;
        historyIndex = Math.max(0, historyIndex - 1);
        return history[historyIndex] || '';
    }

    function getNextHistory() {
        if (history.length === 0) return null;
        historyIndex = Math.min(history.length, historyIndex + 1);
        if (historyIndex >= history.length) {
            return '';
        }
        return history[historyIndex] || '';
    }

    function resetHistoryIndex() {
        historyIndex = history.length;
    }

    function getRawState() {
        return {
            get currentUser() { return currentUser; },
            set currentUser(v) { currentUser = v; emit('userChanged', { currentUser, homeDir }); },
            get homeDir() { return homeDir; },
            set homeDir(v) { homeDir = v; emit('userChanged', { currentUser, homeDir }); },
            get currentPath() { return currentPath; },
            set currentPath(v) { currentPath = v; emit('pathChanged', currentPath); }
        };
    }

    return {
        on,
        emit,
        getCurrentUser,
        getHomeDir,
        getCurrentPath,
        setCurrentPath,
        setUser,
        addHistory,
        getPreviousHistory,
        getNextHistory,
        resetHistoryIndex,
        getRawState
    };
})();
