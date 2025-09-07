document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos Globais ---
    const sidebarNav = document.getElementById('sidebar-nav');
    const contentArea = document.getElementById('content-area');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    let searchIndex = []; // [ { title, page, content }, ... ]

    // --- Configuração das Bibliotecas ---
    marked.setOptions({
        highlight: (code, lang) => {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-',
    });

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    const initializeApp = async () => {
        setupEventListeners();

        const menuConfig = await fetchMenuConfig();
        if (menuConfig) {
            buildSidebarMenu(menuConfig);
            await buildSearchIndex(menuConfig);
            handleNavigation(); // Carrega a página inicial
        }
    };

    // --- Construção do Menu e Índice de Busca ---
    const fetchMenuConfig = async () => {
        try {
            const response = await fetch('menu.json');
            if (!response.ok) throw new Error('menu.json não encontrado.');
            return await response.json();
        } catch (error) {
            console.error("Erro fatal ao carregar o menu:", error);
            sidebarNav.innerHTML = "<ul><li>Erro ao carregar menu.</li></ul>";
            return null;
        }
    };

    const buildSidebarMenu = (config) => {
        const ul = document.createElement('ul');
        config.forEach(item => {
            const li = document.createElement('li');
            if (item.type === 'category') {
                li.className = 'category';
                li.innerHTML = `<span>${item.title}</span>`;
            } else if (item.type === 'link') {
                li.innerHTML = `<a href="#${item.page}" data-page="${item.page}" class="nav-link">${item.title}</a>`;
            }
            ul.appendChild(li);
        });
        sidebarNav.innerHTML = '';
        sidebarNav.appendChild(ul);
    };

    const buildSearchIndex = async (config) => {
        const fetchPromises = config
            .filter(item => item.type === 'link')
            .map(async item => {
                try {
                    const response = await fetch(`content/${item.page}.md`);
                    const content = await response.text();
                    searchIndex.push({ title: item.title, page: item.page, content });
                } catch (e) {
                    console.warn(`Não foi possível indexar a página: ${item.page}`);
                }
            });
        await Promise.all(fetchPromises);
    };

    // --- Lógica de Carregamento de Conteúdo ---
    const loadContent = async (page) => {
        if (!page) page = 'introducao';
        try {
            const response = await fetch(`content/${page}.md`);
            if (!response.ok) throw new Error('Página não encontrada.');
            const markdown = await response.text();
            contentArea.innerHTML = marked.parse(markdown);
            contentArea.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
        } catch (error) {
            contentArea.innerHTML = `<h1>Erro 404</h1><p>O conteúdo para "${page}" não foi encontrado.</p>`;
        }
        contentArea.scrollTop = 0;
    };

    // --- Lógica de Navegação e Roteamento ---
    const handleNavigation = () => {
        const page = window.location.hash.substring(1) || 'introducao';
        loadContent(page);
        updateActiveLink(page);
    };

    const updateActiveLink = (page) => {
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
    };

    // --- Lógica da Busca ---
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.classList.remove('visible');
            return;
        }

        const results = searchIndex.map(item => {
            const contentMatchIndex = item.content.toLowerCase().indexOf(query);
            const titleMatch = item.title.toLowerCase().includes(query);
            let context = '';

            if (contentMatchIndex > -1) {
                const start = Math.max(0, contentMatchIndex - 30);
                const end = contentMatchIndex + query.length + 70;
                context = `...${item.content.substring(start, end)}...`;
            } else if (titleMatch) {
                context = item.content.substring(0, 100) + '...';
            }

            return { score: titleMatch ? 10 : (contentMatchIndex > -1 ? 5 : 0), item, context };
        })
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);

        renderSearchResults(results);
    };
    
    const renderSearchResults = (results) => {
        if (results.length === 0) {
            searchResults.classList.remove('visible');
            return;
        }
        searchResults.innerHTML = results.map(result => `
            <a href="#${result.item.page}" class="search-result-item">
                <span class="result-title">${result.item.title}</span>
                <span class="result-context">${result.context.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
            </a>
        `).join('');
        searchResults.classList.add('visible');
    };

    // --- Configuração dos Event Listeners ---
    function setupEventListeners() {
        window.addEventListener('hashchange', handleNavigation);
        
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', handleSearch);

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.sidebar-search-wrapper')) {
                searchResults.classList.remove('visible');
            }
            if (event.target.closest('.search-result-item')) {
                searchResults.classList.remove('visible');
                searchInput.value = '';
            }
        });
        
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');

        mobileMenuToggle.addEventListener('click', () => sidebar.classList.toggle('visible'));

        sidebar.addEventListener('click', (event) => {
            if (event.target.closest('.nav-link') && sidebar.classList.contains('visible')) {
                sidebar.classList.remove('visible');
            }
        });
    }

    // --- Iniciar ---
    initializeApp();
});
