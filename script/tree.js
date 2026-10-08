(function() {
    window.openTreeWindow = function(targetPath) {
        if (window.TreeWindow && typeof window.TreeWindow.open === 'function') {
            window.TreeWindow.open(targetPath);
        }
    };

    window.closeTreeWindow = function() {
        if (window.TreeWindow && typeof window.TreeWindow.close === 'function') {
            window.TreeWindow.close();
        }
    };
})();
