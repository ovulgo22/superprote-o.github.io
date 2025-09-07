document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    const sidebarNav = document.getElementById('sidebarNav');
    const tocContainer = document.getElementById('tocContainer');
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const sidebar = document.getElementById('sidebar');

    // Estrutura de navegação (pode ser carregada de um JSON no futuro)
    const navStructure = {
        'Início': 'docs/home.md',
        'Guias': {
            'Primeiro Artigo': 'docs/guias/primeiro-artigo.md',
            'Segundo Artigo': 'docs/guias/segundo-artigo.md'
        }
    };

    // --- ROTEAMENTO E CARREGAMENTO DE CONTEÚDO ---
    const loadContent = async (path) => {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Documento não encontrado.');
            
            const markdown = await response.text();
            mainContent.innerHTML = marked.parse(markdown);
            
            updateActiveLink(path);
            generateToc();
            enhanceCodeBlocks();
            mainContent.scrollTop = 0; // Volta ao topo
        } catch (error) {
            mainContent.innerHTML = `<h1>Erro</h1><p>${error.message}</p>`;
        }
    };

    const handleRouting = () => {
        const hash = window.location.hash.substring(1) || navStructure['Início'];
        loadContent(hash);
    };

    // --- GERAÇÃO DE NAVEGAÇÃO E SUMÁRIO ---
    const buildNav = () => {
        const ul = document.createElement('ul');
        for (const key in navStructure) {
            const li = document.createElement('li');
            if (typeof navStructure[key] === 'string') {
                const a = document.createElement('a');
                a.href = `#${navStructure[key]}`;
                a.textContent = key;
                a.dataset.path = navStructure[key];
                li.appendChild(a);
            }
            // Futuramente, pode adicionar lógica para submenus aqui
            ul.appendChild(li);
        }
        sidebarNav.appendChild(ul);
    };

    const updateActiveLink = (path) => {
        document.querySelectorAll('#sidebarNav a').forEach(a => {
            a.classList.toggle('active', a.dataset.path === path);
        });
    };

    const generateToc = () => {
        tocContainer.innerHTML = '';
        const headings = mainContent.querySelectorAll('h2, h3');
        if (headings.length === 0) return;

        const ul = document.createElement('ul');
        headings.forEach(h => {
            const id = h.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            h.id = id;
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = h.textContent;
            a.classList.add(`toc-${h.tagName.toLowerCase()}`);
            li.appendChild(a);
            ul.appendChild(li);
        });
        tocContainer.appendChild(ul);
    };
    
    // --- FUNCIONALIDADES EXTRAS ---
    const enhanceCodeBlocks = () => {
        mainContent.querySelectorAll('pre').forEach(pre => {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'Copiar';
            button.addEventListener('click', () => {
                const code = pre.querySelector('code').innerText;
                navigator.clipboard.writeText(code).then(() => {
                    button.textContent = 'Copiado!';
                    setTimeout(() => button.textContent = 'Copiar', 2000);
                });
            });
            pre.appendChild(button);
        });
    };
    
    // --- MODO CLARO/ESCURO ---
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    // --- MENU MOBILE ---
    mobileMenuButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    mainContent.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // --- INICIALIZAÇÃO ---
    const init = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        
        buildNav();
        handleRouting();
        window.addEventListener('hashchange', handleRouting);
    };

    init();
});
