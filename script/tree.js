// Interactive Visual Tree Explorer for Terminal Portfolio
(function() {
    let treeRootNode = null;
    let currentTreePath = '/home/martin/github';
    let treeOrientation = 'horizontal'; // 'horizontal' or 'vertical'
    
    // Pan & Zoom state
    let panX = 40;
    let panY = 40;
    let zoomLevel = 1.0;
    let isPanning = false;
    let startPanX = 0;
    let startPanY = 0;

    // Window drag state
    let isDraggingWindow = false;
    let windowDragStartX = 0;
    let windowDragStartY = 0;

    // Node geometry config
    const CONFIG = {
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

    /**
     * Build the hierarchical tree node structure from FILESYSTEM.
     */
    function buildTreeData(rootPath, currentDepth = 0, maxAutoExpandDepth = 1) {
        const name = rootPath === '/' ? '/' : rootPath.substring(rootPath.lastIndexOf('/') + 1);
        const isDir = typeof isDirectory === 'function' ? isDirectory(rootPath) : true;
        
        const node = {
            name: name || '/',
            path: rootPath,
            isDir: isDir,
            expanded: currentDepth < maxAutoExpandDepth,
            children: []
        };

        if (isDir) {
            const rawContent = typeof getPathContent === 'function' ? getPathContent(rootPath) : (FILESYSTEM[rootPath] || []);
            const content = (rawContent || []).filter(item => item !== '.' && item !== '..');

            node.children = content.map(childName => {
                const childPath = rootPath === '/' ? '/' + childName : rootPath + '/' + childName;
                const childIsDir = typeof isDirectory === 'function' ? isDirectory(childPath) : (FILESYSTEM[childPath] !== undefined);
                
                if (childIsDir) {
                    return buildTreeData(childPath, currentDepth + 1, maxAutoExpandDepth);
                } else {
                    return {
                        name: childName,
                        path: childPath,
                        isDir: false,
                        expanded: false,
                        children: []
                    };
                }
            });

            // Sort children: directories first, then files
            node.children.sort((a, b) => {
                if (a.isDir && !b.isDir) return -1;
                if (!a.isDir && b.isDir) return 1;
                return a.name.localeCompare(b.name);
            });
        }

        return node;
    }

    /**
     * Layout computation for Tidy Tree (Binary / N-ary tree).
     */
    function computeTreeLayout(node) {
        const cfg = CONFIG[treeOrientation];

        if (treeOrientation === 'horizontal') {
            let currentLeafY = 40;

            function assignHorizontalY(n) {
                if (!n.expanded || !n.children || n.children.length === 0) {
                    n.y = currentLeafY;
                    currentLeafY += cfg.nodeHeight + cfg.gapY;
                    return;
                }
                for (const child of n.children) {
                    assignHorizontalY(child);
                }
                const first = n.children[0];
                const last = n.children[n.children.length - 1];
                n.y = (first.y + last.y) / 2;
            }

            function assignHorizontalX(n, depth = 0) {
                n.x = 40 + depth * (cfg.nodeWidth + cfg.gapX);
                if (n.expanded && n.children) {
                    for (const child of n.children) {
                        assignHorizontalX(child, depth + 1);
                    }
                }
            }

            assignHorizontalY(node);
            assignHorizontalX(node, 0);

        } else {
            // Vertical Tree layout (root at top, children branching down)
            let currentLeafX = 40;

            function assignVerticalX(n) {
                if (!n.expanded || !n.children || n.children.length === 0) {
                    n.x = currentLeafX;
                    currentLeafX += cfg.nodeWidth + cfg.gapX;
                    return;
                }
                for (const child of n.children) {
                    assignVerticalX(child);
                }
                const first = n.children[0];
                const last = n.children[n.children.length - 1];
                n.x = (first.x + last.x) / 2;
            }

            function assignVerticalY(n, depth = 0) {
                n.y = 40 + depth * (cfg.nodeHeight + cfg.gapY);
                if (n.expanded && n.children) {
                    for (const child of n.children) {
                        assignVerticalY(child, depth + 1);
                    }
                }
            }

            assignVerticalX(node);
            assignVerticalY(node, 0);
        }
    }

    /**
     * Render the tree using SVG.
     */
    function renderTree() {
        const svg = document.getElementById('tree-svg');
        if (!svg || !treeRootNode) return;

        computeTreeLayout(treeRootNode);

        // Gather all visible nodes and links
        const nodes = [];
        const links = [];

        function collect(n) {
            nodes.push(n);
            if (n.expanded && n.children) {
                for (const child of n.children) {
                    links.push({ parent: n, child: child });
                    collect(child);
                }
            }
        }
        collect(treeRootNode);

        const cfg = CONFIG[treeOrientation];
        const gLinks = [];
        const gNodes = [];

        const currentActivePath = (typeof shellState !== 'undefined' ? shellState.currentPath : '');

        // Render Links (Curves connecting branches and leaves)
        for (const link of links) {
            let d = '';
            if (treeOrientation === 'horizontal') {
                const px = link.parent.x + cfg.nodeWidth;
                const py = link.parent.y + cfg.nodeHeight / 2;
                const cx = link.child.x;
                const cy = link.child.y + cfg.nodeHeight / 2;
                const midX = (px + cx) / 2;
                d = `M ${px} ${py} C ${midX} ${py}, ${midX} ${cy}, ${cx} ${cy}`;
            } else {
                const px = link.parent.x + cfg.nodeWidth / 2;
                const py = link.parent.y + cfg.nodeHeight;
                const cx = link.child.x + cfg.nodeWidth / 2;
                const cy = link.child.y;
                const midY = (py + cy) / 2;
                d = `M ${px} ${py} C ${px} ${midY}, ${cx} ${midY}, ${cx} ${cy}`;
            }

            const isLinkActive = currentActivePath.startsWith(link.child.path);
            gLinks.push(`<path class="tree-link ${isLinkActive ? 'link-active' : ''}" d="${d}" />`);
        }

        // Render Nodes
        for (const n of nodes) {
            const isCurrent = currentActivePath === n.path;
            const nodeClass = n.isDir ? 'node-branch' : 'node-leaf';
            const currentClass = isCurrent ? 'current-dir' : '';
            
            // Icon
            let iconText = '📄';
            if (n.isDir) {
                iconText = n.expanded ? '📂' : '📁';
            } else {
                const ext = n.name.split('.').pop().toLowerCase();
                if (['rs'].includes(ext)) iconText = '🦀';
                else if (['java'].includes(ext)) iconText = '☕';
                else if (['py'].includes(ext)) iconText = '🐍';
                else if (['js'].includes(ext)) iconText = '⚡';
                else if (['html', 'css'].includes(ext)) iconText = '🌐';
                else if (['pdf'].includes(ext)) iconText = '📕';
                else if (['png', 'webp', 'jpg'].includes(ext)) iconText = '🖼️';
                else if (['toml', 'json', 'jsonc', 'xml'].includes(ext)) iconText = '⚙️';
                else if (['sh'].includes(ext)) iconText = '💻';
                else if (['md'].includes(ext)) iconText = '📝';
            }

            // Truncate name if too long
            const maxChars = 16;
            const displayName = n.name.length > maxChars ? n.name.substring(0, maxChars - 2) + '..' : n.name;
            const titleTooltip = `${n.isDir ? '📁 Folder (click to cd)' : '📄 File (click to cat)'}: ${n.path}`;

            // Badge text for folders: [children count] or [+]/[-]
            let badgeText = '';
            if (n.isDir && n.children) {
                badgeText = n.children.length > 0 ? (n.expanded ? `[${n.children.length} -]` : `[${n.children.length} +]`) : '[empty]';
            }

            gNodes.push(`
                <g class="tree-node-group ${nodeClass} ${currentClass}" data-path="${escapeHtml(n.path)}" data-is-dir="${n.isDir}" transform="translate(${n.x}, ${n.y})">
                    <title>${escapeHtml(titleTooltip)}</title>
                    <rect class="tree-node-rect" width="${cfg.nodeWidth}" height="${cfg.nodeHeight}" />
                    <text class="tree-node-icon" x="12" y="24">${iconText}</text>
                    <text class="tree-node-text" x="32" y="24">${escapeHtml(displayName)}</text>
                    ${badgeText ? `<text class="tree-node-badge" x="${cfg.nodeWidth - 10}" y="24" text-anchor="end">${escapeHtml(badgeText)}</text>` : ''}
                </g>
            `);
        }

        // Assemble SVG with pan & zoom container
        svg.innerHTML = `
            <g id="tree-viewport-group" transform="translate(${panX}, ${panY}) scale(${zoomLevel})">
                <g class="tree-links-layer">${gLinks.join('')}</g>
                <g class="tree-nodes-layer">${gNodes.join('')}</g>
            </g>
        `;

        // Update breadcrumbs and status
        updateBreadcrumbs();
        updateStatusBar(nodes.length);
        attachNodeEvents();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Attach click handlers to rendered SVG nodes.
     */
    function attachNodeEvents() {
        const nodeGroups = document.querySelectorAll('.tree-node-group');
        nodeGroups.forEach(el => {
            el.addEventListener('click', async function(e) {
                e.stopPropagation();
                const path = el.getAttribute('data-path');
                const isDir = el.getAttribute('data-is-dir') === 'true';

                if (isDir) {
                    await handleBranchClick(path);
                } else {
                    await handleLeafClick(path);
                }
            });
        });
    }

    /**
     * User clicks on a branch (folder):
     * 1. Navigates to the folder (cd)
     * 2. Toggles branch expansion in the visual tree
     */
    async function handleBranchClick(folderPath) {
        // Toggle expansion in data model
        function toggleNode(node) {
            if (node.path === folderPath) {
                node.expanded = !node.expanded;
                return true;
            }
            if (node.children) {
                for (const c of node.children) {
                    if (toggleNode(c)) return true;
                }
            }
            return false;
        }
        toggleNode(treeRootNode);

        // Execute cd command in terminal
        if (typeof executeCommand === 'function') {
            if (typeof appendPrompt === 'function') {
                appendPrompt(`cd ${folderPath}`);
            }
            const res = await executeCommand('cd', [folderPath]);
            if (res && res.output && typeof appendOutput === 'function') {
                appendOutput(res.output);
            }
            if (typeof updatePromptUI === 'function') {
                updatePromptUI();
            }
        }

        renderTree();
    }

    /**
     * User clicks on a leaf (file):
     * 1. Prints the file in terminal (cat)
     * 2. Displays the file in the preview drawer inside tree window
     */
    async function handleLeafClick(filePath) {
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

        // Execute cat command in terminal
        let catOutput = '';
        if (typeof executeCommand === 'function') {
            if (typeof appendPrompt === 'function') {
                appendPrompt(`cat ${filePath}`);
            }
            const res = await executeCommand('cat', [filePath]);
            catOutput = res && res.output ? res.output : '<span class="system-message">(empty)</span>';
            if (typeof appendOutput === 'function') {
                appendOutput(catOutput);
            }
        }

        // Show Preview drawer in Tree Window
        showPreviewDrawer(fileName, filePath, catOutput);
    }

    function showPreviewDrawer(fileName, filePath, contentHtml) {
        const drawer = document.getElementById('tree-preview-drawer');
        const title = document.getElementById('preview-file-name');
        const body = document.getElementById('preview-file-body');
        if (!drawer || !title || !body) return;

        title.textContent = `${fileName} (${filePath})`;
        body.innerHTML = contentHtml;
        drawer.classList.remove('hidden');

        // Syntax highlight if needed
        if (window.hljs && body.querySelector('code')) {
            try {
                body.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            } catch (e) {}
        }
    }

    function hidePreviewDrawer() {
        const drawer = document.getElementById('tree-preview-drawer');
        if (drawer) drawer.classList.add('hidden');
    }

    function updateBreadcrumbs() {
        const container = document.getElementById('tree-breadcrumbs');
        if (!container || !currentTreePath) return;

        const parts = currentTreePath.split('/').filter(p => p.length > 0);
        let accumulated = '';
        const crumbsHtml = [`<span class="tree-crumb" data-path="/">/</span>`];

        for (let i = 0; i < parts.length; i++) {
            accumulated += '/' + parts[i];
            crumbsHtml.push(`<span class="tree-crumb-separator">/</span>`);
            crumbsHtml.push(`<span class="tree-crumb" data-path="${accumulated}">${escapeHtml(parts[i])}</span>`);
        }

        container.innerHTML = crumbsHtml.join('');

        container.querySelectorAll('.tree-crumb').forEach(crumb => {
            crumb.addEventListener('click', () => {
                const p = crumb.getAttribute('data-path');
                setTreeRoot(p);
            });
        });
    }

    function updateStatusBar(nodeCount) {
        const currentPathEl = document.getElementById('tree-status-current');
        const countEl = document.getElementById('tree-status-count');
        if (currentPathEl) {
            const active = typeof shellState !== 'undefined' ? shellState.currentPath : currentTreePath;
            currentPathEl.textContent = active;
        }
        if (countEl) {
            countEl.textContent = `${nodeCount} nodes visible`;
        }
    }

    function setTreeRoot(newRootPath) {
        currentTreePath = newRootPath;
        treeRootNode = buildTreeData(currentTreePath, 0, 1);
        resetPanZoom();
        renderTree();
    }

    function resetPanZoom() {
        panX = 40;
        panY = 40;
        zoomLevel = 1.0;
        const g = document.getElementById('tree-viewport-group');
        if (g) {
            g.setAttribute('transform', `translate(${panX}, ${panY}) scale(${zoomLevel})`);
        }
    }

    function applyPanZoom() {
        const g = document.getElementById('tree-viewport-group');
        if (g) {
            g.setAttribute('transform', `translate(${panX}, ${panY}) scale(${zoomLevel})`);
        }
    }

    /**
     * Open Tree Window
     */
    window.openTreeWindow = function(targetPath) {
        const overlay = document.getElementById('tree-window-overlay');
        if (!overlay) return;

        overlay.classList.remove('hidden');

        const resolved = targetPath || (typeof shellState !== 'undefined' ? shellState.currentPath : '/home/martin/github');
        currentTreePath = resolved;
        treeRootNode = buildTreeData(currentTreePath, 0, 1);
        resetPanZoom();
        renderTree();
    };

    /**
     * Close Tree Window
     */
    window.closeTreeWindow = function() {
        const overlay = document.getElementById('tree-window-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        hidePreviewDrawer();

        const input = document.getElementById('interactive-input');
        if (input) input.focus();
    };

    /**
     * Initialize DOM events for Tree Window and Viewport
     */
    function initTreeUI() {
        // Open tree button on terminal
        const openBtn = document.getElementById('open-tree-btn');
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                const target = typeof shellState !== 'undefined' ? shellState.currentPath : '/home/martin/github';
                openTreeWindow(target);
            });
        }

        // Close and control buttons
        const closeBtn = document.getElementById('tree-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', closeTreeWindow);

        const overlay = document.getElementById('tree-window-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeTreeWindow();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
                closeTreeWindow();
            }
        });

        // Maximize button
        const maxBtn = document.getElementById('tree-max-btn');
        const treeWin = document.getElementById('tree-window');
        if (maxBtn && treeWin) {
            maxBtn.addEventListener('click', () => {
                treeWin.classList.toggle('maximized');
            });
        }

        // Preview close
        const closePreviewBtn = document.getElementById('preview-close-btn');
        if (closePreviewBtn) closePreviewBtn.addEventListener('click', hidePreviewDrawer);

        // Fast Jump buttons
        const jumpGithub = document.getElementById('jump-github-btn');
        if (jumpGithub) jumpGithub.addEventListener('click', () => setTreeRoot('/home/martin/github'));

        const jumpHome = document.getElementById('jump-home-btn');
        if (jumpHome) jumpHome.addEventListener('click', () => setTreeRoot('/home/martin'));

        const jumpCurrent = document.getElementById('jump-current-btn');
        if (jumpCurrent) jumpCurrent.addEventListener('click', () => {
            const p = typeof shellState !== 'undefined' ? shellState.currentPath : '/home/martin/github';
            setTreeRoot(p);
        });

        // Layout toggle (Horizontal vs Vertical)
        const toggleLayoutBtn = document.getElementById('tree-layout-btn');
        if (toggleLayoutBtn) {
            toggleLayoutBtn.addEventListener('click', () => {
                treeOrientation = treeOrientation === 'horizontal' ? 'vertical' : 'horizontal';
                toggleLayoutBtn.textContent = treeOrientation === 'horizontal' ? '↔ Horizontal' : '↕ Vertical';
                resetPanZoom();
                renderTree();
            });
        }

        // Expand / Collapse all
        const expandAllBtn = document.getElementById('tree-expand-all-btn');
        if (expandAllBtn) {
            expandAllBtn.addEventListener('click', () => {
                function setExpanded(node, val) {
                    if (node.isDir) node.expanded = val;
                    if (node.children) node.children.forEach(c => setExpanded(c, val));
                }
                setExpanded(treeRootNode, true);
                renderTree();
            });
        }

        const collapseAllBtn = document.getElementById('tree-collapse-all-btn');
        if (collapseAllBtn) {
            collapseAllBtn.addEventListener('click', () => {
                function setExpanded(node, val) {
                    if (node !== treeRootNode && node.isDir) node.expanded = val;
                    if (node.children) node.children.forEach(c => setExpanded(c, val));
                }
                setExpanded(treeRootNode, false);
                renderTree();
            });
        }

        // Zoom buttons
        const zoomInBtn = document.getElementById('zoom-in-btn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                zoomLevel = Math.min(2.5, zoomLevel + 0.2);
                applyPanZoom();
            });
        }

        const zoomOutBtn = document.getElementById('zoom-out-btn');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                zoomLevel = Math.max(0.4, zoomLevel - 0.2);
                applyPanZoom();
            });
        }

        const zoomResetBtn = document.getElementById('zoom-reset-btn');
        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', () => {
                resetPanZoom();
            });
        }

        // Viewport Drag & Pan
        const viewport = document.getElementById('tree-viewport');
        if (viewport) {
            viewport.addEventListener('mousedown', (e) => {
                if (e.target.closest('.tree-node-group') || e.target.closest('#tree-preview-drawer')) return;
                isPanning = true;
                startPanX = e.clientX - panX;
                startPanY = e.clientY - panY;
            });

            window.addEventListener('mousemove', (e) => {
                if (!isPanning) return;
                panX = e.clientX - startPanX;
                panY = e.clientY - startPanY;
                applyPanZoom();
            });

            window.addEventListener('mouseup', () => {
                isPanning = false;
            });

            // Wheel zoom
            viewport.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                zoomLevel = Math.max(0.3, Math.min(2.5, zoomLevel + delta));
                applyPanZoom();
            }, { passive: false });
        }
    }

    document.addEventListener('DOMContentLoaded', initTreeUI);
})();
