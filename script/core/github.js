window.GitHubService = (function() {
    const projects = {
        'BUT1': {
            path: '/home/martin/github/BUT1',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/BUT1/main'
        },
        'BUT2': {
            path: '/home/martin/github/BUT2',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/BUT2/main'
        },
        'but2-presentations-r304': {
            path: '/home/martin/github/but2-presentations-r304',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/but2-presentations-r304/main'
        },
        'enseignement-but2-developpement': {
            path: '/home/martin/github/enseignement-but2-developpement',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/enseignement-but2-developpement/master'
        },
        'Just-Another-Coffee': {
            path: '/home/martin/github/Just-Another-Coffee',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/Just-Another-Coffee/main'
        },
        'R5A04': {
            path: '/home/martin/github/R5A04',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/R5A04/main'
        },
        'waybar': {
            path: '/home/martin/github/waybar',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/waybar/master'
        },
        'XanderTheRat': {
            path: '/home/martin/github/XanderTheRat',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/XanderTheRat/main'
        },
        'XanderTheRat.github.io': {
            path: '/home/martin/github/XanderTheRat.github.io',
            raw: 'https://raw.githubusercontent.com/XanderTheRat/XanderTheRat.github.io/portfolio_V2'
        }
    };

    function getProjects() {
        return projects;
    }

    function getProject(name) {
        return projects[name] || null;
    }

    function resolveRawUrl(fullPath) {
        if (!fullPath || !fullPath.startsWith('/home/martin/github/')) {
            return null;
        }
        const pathAfterGithub = fullPath.substring('/home/martin/github/'.length);
        const slashIdx = pathAfterGithub.indexOf('/');
        const repoName = slashIdx === -1 ? pathAfterGithub : pathAfterGithub.substring(0, slashIdx);
        const relativePath = slashIdx === -1 ? '' : pathAfterGithub.substring(slashIdx);

        let rawBaseUrl;
        if (projects[repoName]) {
            rawBaseUrl = projects[repoName].raw;
        } else {
            rawBaseUrl = 'https://raw.githubusercontent.com/XanderTheRat/' + repoName + '/main';
        }
        return rawBaseUrl + relativePath;
    }

    async function fetchFileContent(fullPath) {
        const url = resolveRawUrl(fullPath);
        if (!url) {
            throw new Error("Invalid GitHub path");
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("File not found on GitHub");
        }
        return await response.text();
    }

    function isImage(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        return ['png', 'webp', 'jpg', 'jpeg', 'gif', 'ico'].includes(ext);
    }

    function isPdf(fileName) {
        return fileName.split('.').pop().toLowerCase() === 'pdf';
    }

    function getFileExtension(fileName) {
        const parts = fileName.split('.');
        return parts.length > 1 ? parts.pop().toLowerCase() : '';
    }

    function detectLanguage(fileName) {
        const ext = getFileExtension(fileName);
        const langMap = {
            'c': 'c', 'h': 'c',
            'java': 'java',
            'kt': 'kotlin',
            'py': 'python',
            'html': 'xml', 'xml': 'xml', 'iml': 'xml', 'svg': 'xml',
            'css': 'css',
            'js': 'javascript',
            'json': 'json', 'jsonc': 'json',
            'sql': 'sql',
            'php': 'php',
            'rs': 'rust',
            'md': 'markdown',
            'toml': 'toml',
            'sh': 'bash', 'bash': 'bash',
            'yaml': 'yaml', 'yml': 'yaml',
            'conf': 'ini', 'properties': 'ini',
            'gradle': 'groovy'
        };
        return langMap[ext] || 'plaintext';
    }

    return {
        getProjects,
        getProject,
        resolveRawUrl,
        fetchFileContent,
        isImage,
        isPdf,
        getFileExtension,
        detectLanguage
    };
})();
