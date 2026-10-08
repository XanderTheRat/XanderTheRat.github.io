window.TreeLayout = (function() {
    const DEFAULT_CONFIG = {
        horizontal: {
            nodeWidth: 170,
            nodeHeight: 38,
            gapX: 70,
            gapY: 16
        },
        vertical: {
            nodeWidth: 150,
            nodeHeight: 38,
            gapX: 18,
            gapY: 60
        }
    };

    function compute(rootNode, orientation, customConfig) {
        if (!rootNode) return;
        const cfg = (customConfig && customConfig[orientation]) || DEFAULT_CONFIG[orientation] || DEFAULT_CONFIG.horizontal;

        if (orientation === 'horizontal') {
            let currentLeafY = 40;

            function assignY(node) {
                if (!node.expanded || !node.children || node.children.length === 0) {
                    node.y = currentLeafY;
                    currentLeafY += cfg.nodeHeight + cfg.gapY;
                    return;
                }
                for (const child of node.children) {
                    assignY(child);
                }
                const first = node.children[0];
                const last = node.children[node.children.length - 1];
                node.y = (first.y + last.y) / 2;
            }

            function assignX(node, depth = 0) {
                node.x = 40 + depth * (cfg.nodeWidth + cfg.gapX);
                if (node.expanded && node.children) {
                    for (const child of node.children) {
                        assignX(child, depth + 1);
                    }
                }
            }

            assignY(rootNode);
            assignX(rootNode, 0);

        } else {
            let currentLeafX = 40;

            function assignX(node) {
                if (!node.expanded || !node.children || node.children.length === 0) {
                    node.x = currentLeafX;
                    currentLeafX += cfg.nodeWidth + cfg.gapX;
                    return;
                }
                for (const child of node.children) {
                    assignX(child);
                }
                const first = node.children[0];
                const last = node.children[node.children.length - 1];
                node.x = (first.x + last.x) / 2;
            }

            function assignY(node, depth = 0) {
                node.y = 40 + depth * (cfg.nodeHeight + cfg.gapY);
                if (node.expanded && node.children) {
                    for (const child of node.children) {
                        assignY(child, depth + 1);
                    }
                }
            }

            assignX(rootNode);
            assignY(rootNode, 0);
        }
    }

    return {
        compute,
        DEFAULT_CONFIG
    };
})();
