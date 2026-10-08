window.CommandRegistry = (function() {
    const commands = new Map();

    function register(name, definition) {
        if (!name || typeof definition !== 'object') {
            throw new Error("Invalid command registration");
        }
        commands.set(name, definition);
    }

    function get(name) {
        return commands.get(name) || null;
    }

    function has(name) {
        return commands.has(name);
    }

    function list() {
        return Array.from(commands.keys());
    }

    function getAll() {
        return Array.from(commands.values());
    }

    async function execute(name, args, context) {
        let cmd = commands.get(name);
        if (!cmd && name && name.includes('/')) {
            const baseName = name.substring(name.lastIndexOf('/') + 1);
            cmd = commands.get(baseName);
        }
        if (!cmd) {
            return {
                output: '<span class="term-error">sh: command not found: ' + (context.path ? context.path.escapeHtml(name) : name) + '</span>'
            };
        }
        try {
            return await cmd.execute(args, context);
        } catch (err) {
            return {
                output: '<span class="term-error">Error executing ' + name + ': ' + (err.message || String(err)) + '</span>'
            };
        }
    }

    return {
        register,
        get,
        has,
        list,
        getAll,
        execute
    };
})();
