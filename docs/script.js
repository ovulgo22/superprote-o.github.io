document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos Globais ---
    const contentArea = document.getElementById('content-area');
    const articleContent = document.getElementById('article-content');
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    const articleFooterContainer = document.getElementById('article-footer');
    // ... (outros elementos globais)
    let menuConfig = [];
    let pageLinks = [];

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    const initializeApp = async () => {
        setupEventListeners();
        applySavedTheme();
        const config = await fetchMenuConfig();
        if (config) {
            menuConfig = config;
            pageLinks = menuConfig.filter(item => item.type === 'link'); // Lista plana de links
            buildSidebarMenu(menuConfig);
            await buildSearchIndex(menuConfig);
            handleNavigation();
        }
    };
    
    // --- Lógica de Carregamento de Conteúdo ---
    const loadContent = async (page) => {
        // ... (lógica de fetch e renderização do markdown)
        // Após renderizar:
        updateDynamicUI(page);
    };

    // --- ATUALIZAÇÃO DA UI DINÂMICA (NOVA FUNÇÃO CENTRAL) ---
    const updateDynamicUI = (page) => {
        updateBreadcrumbs(page);
        updateArticleFooter(page);
        // Pós-processamento do HTML (funções anteriores)
        enhanceCodeBlocks();
        createCodeTabs();
        transformCallouts();
        generateOnPageNavAndAnchors();
    };

    const updateBreadcrumbs = (page) => {
        const currentItem = menuConfig.find(item => item.page === page);
        if (!currentItem) {
            breadcrumbsContainer.innerHTML = '';
            return;
        }
        // Lógica para encontrar a categoria pai (simplificada)
        let breadcrumbHTML = `<a href="#">Docs</a> / <span class="current">${currentItem.title}</span>`;
        breadcrumbsContainer.innerHTML = breadcrumbHTML;
    };

    const updateArticleFooter = (page) => {
        const currentIndex = pageLinks.findIndex(item => item.page === page);
        const prevPage = currentIndex > 0 ? pageLinks[currentIndex - 1] : null;
        const nextPage = currentIndex < pageLinks.length - 1 ? pageLinks[currentIndex + 1] : null;
        
        let paginationHTML = '<div class="pagination-section">';
        if (prevPage) {
            paginationHTML += `
                <a href="#${prevPage.page}" class="pagination-link prev">
                    <i class="ph ph-arrow-left"></i>
                    <div>
                        <div class="label">Anterior</div>
                        <div class="title">${prevPage.title}</div>
                    </div>
                </a>`;
        } else {
            paginationHTML += '<div></div>'; // Placeholder para manter o alinhamento
        }

        if (nextPage) {
            paginationHTML += `
                <a href="#${nextPage.page}" class="pagination-link next">
                    <div>
                        <div class="label">Próximo</div>
                        <div class="title">${nextPage.title}</div>
                    </div>
                    <i class="ph ph-arrow-right"></i>
                </a>`;
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
    
    // --- Lógica do Seletor de Tema (REINTRODUZIDO) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark');
        }
    };

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    });

    // --- O RESTANTE DO SCRIPT.JS ---
    // (Todas as outras funções como handleNavigation, enhanceCodeBlocks, createCodeTabs, etc., permanecem as mesmas,
    // mas agora são chamadas a partir de `updateDynamicUI` dentro do `loadContent`).
    // ...
    initializeApp();
});
