document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos Globais ---
    const sidebarNav = document.getElementById('sidebar-nav');
    const contentArea = document.getElementById('content-area');
    const articleContent = document.getElementById('article-content');
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    const articleFooterContainer = document.getElementById('article-footer');
    const onPageToc = document.getElementById('on-page-toc');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    // --- Variáveis de Estado ---
    let menuConfig = [];
    let pageLinks = [];
    let observer;

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
        const config = await fetchMenuConfig();
        if (config) {
            menuConfig = config;
            pageLinks = menuConfig.filter(item => item.type === 'link');
            buildSidebarMenu(menuConfig);
            await buildSearchIndex(menuConfig);
            // CORREÇÃO: Chama handleNavigation após tudo estar pronto
            handleNavigation(); 
        }
    };

    // --- Lógica de Carregamento de Conteúdo ---
    const loadContent = async (page) => {
        if (!page) page = pageLinks[0]?.page || 'introducao';
        
        try {
            const response = await fetch(`content/${page}.md`);
            if (!response.ok) throw new Error('Página não encontrada.');
            const markdown = await response.text();
            articleContent.innerHTML = marked.parse(markdown);
            updateDynamicUI(page);
        } catch (error) {
            articleContent.innerHTML = `<h1>Erro 404</h1><p>O conteúdo para "${page}" não foi encontrado.</p>`;
            updateDynamicUI(page, true);
        }
        contentArea.scrollTop = 0;
    };

    // --- FUNÇÃO CENTRAL DE ATUALIZAÇÃO DA UI ---
    const updateDynamicUI = (page, isError = false) => {
        updateBreadcrumbs(page);
        updateArticleFooter(page);
        
        if (!isError) {
            enhanceCodeBlocks();
            // createCodeTabs(); // Removido por simplicidade, pode ser adicionado depois
            transformCallouts();
            generateOnPageNavAndAnchors();
        } else {
             onPageToc.innerHTML = '';
        }
    };
    
    const updateBreadcrumbs = (page) => {
        const currentItem = pageLinks.find(item => item.page === page);
        const currentItemIndex = menuConfig.findIndex(p => p.page === page);
        let category = null;
        for (let i = currentItemIndex - 1; i >= 0; i--) {
            if (menuConfig[i].type === 'category') {
                category = menuConfig[i];
                break;
            }
        }
        
        let breadcrumbHTML = `<a href="#">Docs</a>`;
        if (category) {
            breadcrumbHTML += ` / <span>${category.title}</span>`;
        }
        if (currentItem) {
            breadcrumbHTML += ` / <span class="current">${currentItem.title}</span>`;
        }
        breadcrumbsContainer.innerHTML = breadcrumbHTML;
    };

    const updateArticleFooter = (page) => {
        const currentIndex = pageLinks.findIndex(item => item.page === page);
        const prevPage = currentIndex > 0 ? pageLinks[currentIndex - 1] : null;
        const nextPage = currentIndex < pageLinks.length - 1 ? pageLinks[currentIndex + 1] : null;
        
        let paginationHTML = '<div class="pagination-section">';
        if (prevPage) {
            paginationHTML += `<a href="#${prevPage.page}" class="pagination-link prev"><i class="ph ph-arrow-left"></i><div><div class="label">Anterior</div><div class="title">${prevPage.title}</div></div></a>`;
        } else {
            paginationHTML += '<div></div>';
        }
        if (nextPage) {
            paginationHTML += `<a href="#${nextPage.page}" class="pagination-link next"><div><div class="label">Próximo</div><div class="title">${nextPage.title}</div></div><i class="ph ph-arrow-right"></i></a>`;
        }
        paginationHTML += '</div>';

        const footerHTML = `
            <div class="feedback-section">
                <div class="feedback-buttons">
                    <button><i class="ph ph-thumbs-up"></i> Útil</button>
                    <button><i class="ph ph-thumbs-down"></i> Não útil</button>
                </div>
                <div class="last-updated">Última atualização: 7 de Setembro, 2025</div>
            </div>
            ${paginationHTML}
        `;
        articleFooterContainer.innerHTML = footerHTML;
    };
    
    const enhanceCodeBlocks = () => { /* ... (código inalterado) ... */ };
    const transformCallouts = () => { /* ... (código inalterado) ... */ };
    const generateOnPageNavAndAnchors = () => { /* ... (código inalterado) ... */ };
    const setupIntersectionObserver = () => { /* ... (código inalterado) ... */ };
    const fetchMenuConfig = async () => { /* ... (código inalterado) ... */ };
    const buildSidebarMenu = (config) => { /* ... (código inalterado) ... */ };
    const buildSearchIndex = async (config) => { /* ... (código inalterado) ... */ };
    const handleNavigation = () => { const page = window.location.hash.substring(1) || (pageLinks[0]?.page || 'introducao'); loadContent(page); updateActiveLink(page); };
    const updateActiveLink = (page) => { /* ... (código inalterado) ... */ };
    const handleSearch = (event) => { /* ... (código inalterado) ... */ };
    const renderSearchResults = (results) => { /* ... (código inalterado) ... */ };
    
    function setupEventListeners() {
        window.addEventListener('hashchange', handleNavigation);
        // Todos os outros event listeners permanecem os mesmos, exceto o do tema
    }

    initializeApp();
});
