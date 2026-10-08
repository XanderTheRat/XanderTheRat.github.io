window.TreeWindow = (function() {
    let treeRootNode = null;
    let currentTreePath = '/home/martin/github';
    let treeOrientation = 'horizontal';

    let panX = 40;
    let panY = 40;
    let zoomLevel = 1.0;
    let isPanning = false;
    let startPanX = 0;
    let startPanY = 0;

    let isDraggingWindow = false;
    let dragStartX = 0;
    let dragStartY = 0;

    function render() {
        const svg = document.getElementById('tree-svg');
        if (!svg || !treeRootNode) return;

        window.TreeLayout.compute(treeRootNode, treeOrientation);

        const nodes = [];
        const links = [];

        function traverse(node) {
            nodes.push(node);
            if (node.expanded && node.children) {
                for (const child of node.children) {
                    links.push({ parent: node, child: child });
                    traverse(child);
                }
            }
        }
        traverse(treeRootNode);

        const cfg = window.TreeLayout.DEFAULT_CONFIG[treeOrientation];
        const gLinks = links.map(link => {
            const p = link.parent;
            const c = link.child;
            let d = '';

            if (treeOrientation === 'horizontal') {
                const x1 = p.x + cfg.nodeWidth;
                const y1 = p.y + cfg.nodeHeight / 2;
                const x2 = c.x;
                const y2 = c.y + cfg.nodeHeight / 2;
                const mx = (x1 + x2) / 2;
                d = 'M ' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2;
            } else {
                const x1 = p.x + cfg.nodeWidth / 2;
                const y1 = p.y + cfg.nodeHeight;
                const x2 = c.x + cfg.nodeWidth / 2;
                const y2 = c.y;
                const my = (y1 + y2) / 2;
                d = 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + my + ', ' + x2 + ' ' + my + ', ' + x2 + ' ' + y2;
            }

            return '<path class="tree-link" d="' + d + '" />';
        });

        const activePath = window.ShellState ? window.ShellState.getCurrentPath() : '/';
        const gNodes = nodes.map(n => {
            const isCurrent = (n.path === activePath);
            const nodeClass = 'tree-node-group ' + (n.isDir ? 'node-branch' : 'node-leaf') + (isCurrent ? ' current-dir' : '');

            let label = n.name;
            if (label.length > 15) {
                label = label.substring(0, 13) + '..';
            }

            let badge = '';
            if (n.isDir && n.children && n.children.length > 0) {
                badge = n.expanded ? '[-]' : '[+' + n.children.length + ']';
            }

            const iconColor = n.isDir ? '#3584e4' : '#26a269';
            let iconSvg = '';
            if (n.isDir) {
                iconSvg = '<path d="M 4 5 L 9 5 L 11 8 L 20 8 A 2 2 0 0 1 22 10 L 22 19 A 2 2 0 0 1 20 21 L 4 21 A 2 2 0 0 1 2 19 L 2 7 A 2 2 0 0 1 4 5 Z" fill="none" stroke="' + iconColor + '" stroke-width="2" transform="translate(10, 10) scale(0.75)" />';
            } else {
                iconSvg = '<path d="M 14 2 L 6 2 A 2 2 0 0 0 4 4 L 4 20 A 2 2 0 0 0 6 22 L 18 22 A 2 2 0 0 0 20 20 L 20 8 Z M 14 2 L 14 8 L 20 8" fill="none" stroke="' + iconColor + '" stroke-width="2" transform="translate(10, 10) scale(0.75)" />';
            }

            const tooltip = (n.isDir ? 'Directory (click to cd): ' : 'File (click to cat): ') + n.path;

            return '<g class="' + nodeClass + '" transform="translate(' + n.x + ', ' + n.y + ')" data-path="' + window.PathUtils.escapeHtml(n.path) + '" data-is-dir="' + n.isDir + '">' +
                '<title>' + window.PathUtils.escapeHtml(tooltip) + '</title>' +
                '<rect class="tree-node-rect" width="' + cfg.nodeWidth + '" height="' + cfg.nodeHeight + '" rx="6" ry="6" />' +
                iconSvg +
                '<text class="tree-node-text" x="34" y="24">' + window.PathUtils.escapeHtml(label) + '</text>' +
                (badge ? '<text class="tree-node-badge" x="' + (cfg.nodeWidth - 10) + '" y="24" text-anchor="end">' + badge + '</text>' : '') +
                '</g>';
        });

        svg.innerHTML = '<g id="tree-viewport-group" transform="translate(' + panX + ', ' + panY + ') scale(' + zoomLevel + ')">' +
            '<g class="tree-links-layer">' + gLinks.join('') + '</g>' +
            '<g class="tree-nodes-layer">' + gNodes.join('') + '</g>' +
            '</g>';

        updateBreadcrumbs();
        updateStatusBar(nodes.length);
        attachEvents();
    }

    function attachEvents() {
        const groups = document.querySelectorAll('.tree-node-group');
        groups.forEach(el => {
            el.addEventListener('click', async (e) => {
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

    async function handleBranchClick(folderPath) {
        function toggle(node) {
            if (node.path === folderPath) {
                node.expanded = !node.expanded;
                return true;
            }
            if (node.children) {
                for (const c of node.children) {
                    if (toggle(c)) return true;
                }
            }
            return false;
        }
        toggle(treeRootNode);

        if (window.TerminalUI && typeof window.TerminalUI.runCommand === 'function') {
            await window.TerminalUI.runCommand('cd ' + folderPath);
        }

        render();
    }

    async function handleLeafClick(filePath) {
        const fileName = window.PathUtils.basename(filePath);
        let output = '';

        if (window.TerminalUI && typeof window.TerminalUI.runCommand === 'function') {
            output = await window.TerminalUI.runCommand('cat ' + filePath);
        }

        showPreview(fileName, filePath, output);
    }

    function showPreview(fileName, filePath, content) {
        const drawer = document.getElementById('tree-preview-drawer');
        const title = document.getElementById('preview-file-name');
        const body = document.getElementById('preview-file-body');
        if (!drawer || !title || !body) return;

        title.textContent = fileName + ' (' + filePath + ')';
        body.innerHTML = content || '<span class="system-message">File loaded</span>';
        drawer.classList.remove('hidden');

        if (window.hljs && body.querySelector('code')) {
            try {
                body.querySelectorAll('pre code').forEach(block => {
                    window.hljs.highlightElement(block);
                });
            } catch (e) {}
        }
    }

    function hidePreview() {
        const drawer = document.getElementById('tree-preview-drawer');
        if (drawer) drawer.classList.add('hidden');
    }

    function updateBreadcrumbs() {
        const container = document.getElementById('tree-breadcrumbs');
        if (!container || !currentTreePath) return;

        const parts = currentTreePath.split('/').filter(p => p.length > 0);
        let accumulated = '';
        const crumbs = ['<span class="tree-crumb" data-path="/">/</span>'];

        for (let i = 0; i < parts.length; i++) {
            accumulated += '/' + parts[i];
            crumbs.push('<span class="tree-crumb-separator">/</span>');
            crumbs.push('<span class="tree-crumb" data-path="' + accumulated + '">' + window.PathUtils.escapeHtml(parts[i]) + '</span>');
        }

        container.innerHTML = crumbs.join('');
        container.querySelectorAll('.tree-crumb').forEach(crumb => {
            crumb.addEventListener('click', () => {
                const target = crumb.getAttribute('data-path');
                setTreeRoot(target);
            });
        });
    }

    function updateStatusBar(count) {
        const currentPathEl = document.getElementById('tree-status-current');
        const countEl = document.getElementById('tree-status-count');
        if (currentPathEl) {
            currentPathEl.textContent = window.ShellState ? window.ShellState.getCurrentPath() : currentTreePath;
        }
        if (countEl) {
            countEl.textContent = count + ' nodes visible';
        }
    }

    function setTreeRoot(newRootPath) {
        currentTreePath = newRootPath;
        treeRootNode = window.VirtualFileSystem.buildHierarchy(currentTreePath, 0, 1, window.ShellState);
        resetPanZoom();
        render();
    }

    function resetPanZoom() {
        panX = 40;
        panY = 40;
        zoomLevel = 1.0;
        applyTransform();
    }

    function applyTransform() {
        const g = document.getElementById('tree-viewport-group');
        if (g) {
            g.setAttribute('transform', 'translate(' + panX + ', ' + panY + ') scale(' + zoomLevel + ')');
        }
    }

    function open(targetPath) {
        const overlay = document.getElementById('tree-window-overlay');
        if (!overlay) return;

        overlay.classList.remove('hidden');
        const resolved = targetPath || (window.ShellState ? window.ShellState.getCurrentPath() : '/home/martin/github');
        setTreeRoot(resolved);
        hidePreview();
    }

    function close() {
        const overlay = document.getElementById('tree-window-overlay');
        if (overlay) overlay.classList.add('hidden');
        hidePreview();
        if (window.TerminalUI && typeof window.TerminalUI.focus === 'function') {
            window.TerminalUI.focus();
        }
    }

    function init() {
        const openBtn = document.getElementById('open-tree-btn');
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                const target = window.ShellState ? window.ShellState.getCurrentPath() : '/home/martin/github';
                open(target);
            });
        }

        const closeBtn = document.getElementById('tree-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', close);

        const overlay = document.getElementById('tree-window-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
                close();
            }
        });

        const maxBtn = document.getElementById('tree-max-btn');
        const treeWin = document.getElementById('tree-window');
        if (maxBtn && treeWin) {
            maxBtn.addEventListener('click', () => {
                treeWin.classList.toggle('maximized');
            });
        }

        const closePreviewBtn = document.getElementById('preview-close-btn');
        if (closePreviewBtn) closePreviewBtn.addEventListener('click', hidePreview);

        const jumpGithub = document.getElementById('jump-github-btn');
        if (jumpGithub) jumpGithub.addEventListener('click', () => setTreeRoot('/home/martin/github'));

        const jumpHome = document.getElementById('jump-home-btn');
        if (jumpHome) jumpHome.addEventListener('click', () => setTreeRoot(window.ShellState.getHomeDir()));

        const jumpCurrent = document.getElementById('jump-current-btn');
        if (jumpCurrent) jumpCurrent.addEventListener('click', () => {
            setTreeRoot(window.ShellState.getCurrentPath());
        });

        const toggleLayoutBtn = document.getElementById('tree-layout-btn');
        if (toggleLayoutBtn) {
            toggleLayoutBtn.addEventListener('click', () => {
                treeOrientation = (treeOrientation === 'horizontal') ? 'vertical' : 'horizontal';
                toggleLayoutBtn.textContent = (treeOrientation === 'horizontal') ? 'Horizontal' : 'Vertical';
                resetPanZoom();
                render();
            });
        }

        const expandAllBtn = document.getElementById('tree-expand-all-btn');
        if (expandAllBtn) {
            expandAllBtn.addEventListener('click', () => {
                function expandNode(node) {
                    if (node.isDir) node.expanded = true;
                    if (node.children) node.children.forEach(expandNode);
                }
                expandNode(treeRootNode);
                render();
            });
        }

        const collapseAllBtn = document.getElementById('tree-collapse-all-btn');
        if (collapseAllBtn) {
            collapseAllBtn.addEventListener('click', () => {
                function collapseNode(node) {
                    if (node !== treeRootNode && node.isDir) node.expanded = false;
                    if (node.children) node.children.forEach(collapseNode);
                }
                collapseNode(treeRootNode);
                render();
            });
        }

        const zoomInBtn = document.getElementById('zoom-in-btn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                zoomLevel = Math.min(2.5, zoomLevel + 0.2);
                applyTransform();
            });
        }

        const zoomOutBtn = document.getElementById('zoom-out-btn');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                zoomLevel = Math.max(0.4, zoomLevel - 0.2);
                applyTransform();
            });
        }

        const zoomResetBtn = document.getElementById('zoom-reset-btn');
        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', resetPanZoom);
        }

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
                applyTransform();
            });

            window.addEventListener('mouseup', () => {
                isPanning = false;
            });

            viewport.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                zoomLevel = Math.max(0.3, Math.min(2.5, zoomLevel + delta));
                applyTransform();
            }, { passive: false });
        }

        const titlebar = document.querySelector('.tree-titlebar');
        if (titlebar && treeWin) {
            titlebar.addEventListener('mousedown', (e) => {
                if (e.target.closest('.window-ctrl-btn') || treeWin.classList.contains('maximized')) return;
                isDraggingWindow = true;
                dragStartX = e.clientX - treeWin.offsetLeft;
                dragStartY = e.clientY - treeWin.offsetTop;
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDraggingWindow) return;
                treeWin.style.position = 'absolute';
                treeWin.style.left = (e.clientX - dragStartX) + 'px';
                treeWin.style.top = (e.clientY - dragStartY) + 'px';
            });

            window.addEventListener('mouseup', () => {
                isDraggingWindow = false;
            });
        }
    }

    return {
        init,
        open,
        close,
        render,
        setTreeRoot
    };
})();
