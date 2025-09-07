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
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // --- Variáveis de Estado ---
    let menuConfig = [];
    let pageLinks = []; // Uma lista plana de todas as páginas linkáveis para paginação
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
        applySavedTheme();
        const config = await fetchMenuConfig();
        if (config) {
            menuConfig = config;
            pageLinks = menuConfig.filter(item => item.type === 'link');
            buildSidebarMenu(menuConfig);
            await buildSearchIndex(menuConfig);
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
            
            // Atualiza todos os componentes da UI que dependem do conteúdo
            updateDynamicUI(page);

        } catch (error) {
            articleContent.innerHTML = `<h1>Erro 404</h1><p>O conteúdo para "${page}" não foi encontrado.</p>`;
            updateDynamicUI(page, true); // Atualiza a UI mesmo em caso de erro
        }
        contentArea.scrollTop = 0;
    };

    // --- FUNÇÃO CENTRAL DE ATUALIZAÇÃO DA UI ---
    const updateDynamicUI = (page, isError = false) => {
        updateBreadcrumbs(page);
        updateArticleFooter(page);
        
        if (!isError) {
            // Pós-processamento do HTML renderizado
            enhanceCodeBlocks();
            createCodeTabs();
            transformCallouts();
            generateOnPageNavAndAnchors();
        } else {
             onPageToc.innerHTML = '';
        }
    };
    
    // --- Funções de Melhoria e UI Dinâmica ---
    const updateBreadcrumbs = (page) => {
        const currentItem = pageLinks.find(item => item.page === page);
        // Tenta encontrar a categoria anterior ao item atual
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
            paginationHTML += `
                <a href="#${prevPage.page}" class="pagination-link prev">
                    <i class="ph ph-arrow-left"></i>
                    <div>
                        <div class="label">Anterior</div>
                        <div class="title">${prevPage.title}</div>
                    </div>
                </a>`;
        } else {
            paginationHTML += '<div></div>';
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
    
    // (O restante do script, incluindo enhanceCodeBlocks, createCodeTabs, etc., permanece o mesmo)
    const enhanceCodeBlocks = () => { const codeBlocks = articleContent.querySelectorAll('pre'); codeBlocks.forEach(pre => { if (pre.parentNode.classList.contains('code-block-wrapper')) return; const code = pre.querySelector('code'); if (!code) return; const lang = code.className.replace('hljs language-', '').trim() || 'shell'; const wrapper = document.createElement('div'); wrapper.className = 'code-block-wrapper'; const header = document.createElement('div'); header.className = 'code-block-header'; const langName = document.createElement('span'); langName.className = 'lang-name'; langName.textContent = lang; const copyBtn = document.createElement('button'); copyBtn.className = 'copy-btn'; copyBtn.innerHTML = '<i class="ph-copy"></i> Copiar'; copyBtn.addEventListener('click', () => { navigator.clipboard.writeText(code.innerText).then(() => { copyBtn.innerHTML = '<i class="ph-check-circle"></i> Copiado!'; setTimeout(() => { copyBtn.innerHTML = '<i class="ph-copy"></i> Copiar'; }, 2000); }); }); header.appendChild(langName); header.appendChild(copyBtn); pre.parentNode.insertBefore(wrapper, pre); wrapper.appendChild(header); wrapper.appendChild(pre); }); };
    const createCodeTabs = () => { const tabGroups = articleContent.querySelectorAll('.code-tabs'); tabGroups.forEach((group) => { const codeBlocks = Array.from(group.querySelectorAll('.code-block-wrapper')); if (codeBlocks.length === 0) return; const tabBar = document.createElement('div'); tabBar.className = 'code-tabs-bar'; codeBlocks.forEach((block, blockIndex) => { const lang = block.querySelector('.lang-name').textContent || `aba ${blockIndex + 1}`; const button = document.createElement('button'); button.textContent = lang; button.setAttribute('role', 'tab'); if (blockIndex === 0) { button.classList.add('active'); button.setAttribute('aria-selected', 'true'); } else { block.classList.add('hidden'); button.setAttribute('aria-selected', 'false'); } button.addEventListener('click', () => { tabBar.querySelectorAll('button').forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-selected', 'false'); }); button.classList.add('active'); button.setAttribute('aria-selected', 'true'); codeBlocks.forEach((b, i) => { b.classList.toggle('hidden', i !== blockIndex); }); }); tabBar.appendChild(button); }); group.prepend(tabBar); }); };
    const transformCallouts = () => { const blockquotes = articleContent.querySelectorAll('blockquote'); const calloutTypes = { '[!NOTE]': { class: 'note', icon: 'ph-info' }, '[!TIP]': { class: 'tip', icon: 'ph-lightbulb' }, '[!WARNING]': { class: 'warning', icon: 'ph-warning' }, '[!IMPORTANT]': { class: 'important', icon: 'ph-seal-warning' }, '[!DANGER]': { class: 'danger', icon: 'ph-warning-octagon' } }; blockquotes.forEach(bq => { const p = bq.querySelector('p'); if (!p) return; const text = p.innerHTML.trim(); const type = Object.keys(calloutTypes).find(key => text.startsWith(key)); if (type) { const config = calloutTypes[type]; bq.className = `callout ${config.class}`; p.innerHTML = text.substring(type.length).trim(); bq.innerHTML = `<i class="ph ${config.icon}"></i><div>${bq.innerHTML}</div>`; } }); };
    const generateOnPageNavAndAnchors = () => { onPageToc.innerHTML = ''; const headings = articleContent.querySelectorAll('h2, h3'); if (headings.length < 1) { setupIntersectionObserver(); return; } headings.forEach(heading => { const text = heading.textContent; const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''); heading.id = id; const anchorLink = document.createElement('a'); anchorLink.className = 'heading-anchor-link'; anchorLink.href = `#${id}`; anchorLink.setAttribute('aria-label', `Link permanente para esta seção: ${text}`); anchorLink.innerHTML = '<i class="ph-link"></i>'; heading.appendChild(anchorLink); if (headings.length >= 2) { const link = document.createElement('a'); link.href = `#${id}`; link.textContent = text; link.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2'; onPageToc.appendChild(link); } }); setupIntersectionObserver(); };
    const setupIntersectionObserver = () => { if (observer) observer.disconnect(); const headings = articleContent.querySelectorAll('h2, h3'); if (headings.length === 0) return; const options = { root: contentArea, rootMargin: "0px 0px -80% 0px" }; observer = new IntersectionObserver((entries) => { let visibleSection = null; entries.forEach(entry => { if (entry.isIntersecting) { if (!visibleSection) { visibleSection = entry.target.getAttribute('id'); } } }); if (visibleSection) { onPageToc.querySelectorAll('a').forEach(a => a.classList.remove('active')); const activeLink = onPageToc.querySelector(`a[href="#${visibleSection}"]`); if(activeLink) { activeLink.classList.add('active'); } } }, options); headings.forEach(heading => observer.observe(heading)); };
    const fetchMenuConfig = async () => { try { const response = await fetch('menu.json'); if (!response.ok) throw new Error('menu.json não encontrado.'); return await response.json(); } catch (error) { console.error("Erro fatal ao carregar o menu:", error); sidebarNav.innerHTML = "<ul><li>Erro ao carregar menu.</li></ul>"; return null; } };
    const buildSidebarMenu = (config) => { const ul = document.createElement('ul'); config.forEach(item => { const li = document.createElement('li'); if (item.type === 'category') { li.className = 'category'; li.innerHTML = `<span>${item.title}</span>`; } else if (item.type === 'link') { li.innerHTML = `<a href="#${item.page}" data-page="${item.page}" class="nav-link">${item.title}</a>`; } ul.appendChild(li); }); sidebarNav.innerHTML = ''; sidebarNav.appendChild(ul); };
    const buildSearchIndex = async (config) => { const fetchPromises = config .filter(item => item.type === 'link') .map(async item => { try { const response = await fetch(`content/${item.page}.md`); const content = await response.text(); searchIndex.push({ title: item.title, page: item.page, content }); } catch (e) { console.warn(`Não foi possível indexar a página: ${item.page}`); } }); await Promise.all(fetchPromises); };
    const handleNavigation = () => { const page = window.location.hash.substring(1) || (pageLinks[0]?.page || 'introducao'); loadContent(page); updateActiveLink(page); };
    const updateActiveLink = (page) => { document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => { link.classList.toggle('active', link.dataset.page === page); }); };
    const handleSearch = (event) => { const query = event.target.value.toLowerCase().trim(); if (query.length < 2) { searchResults.classList.remove('visible'); return; } const results = searchIndex.map(item => { const contentMatchIndex = item.content.toLowerCase().indexOf(query); const titleMatch = item.title.toLowerCase().includes(query); let context = ''; if (contentMatchIndex > -1) { const start = Math.max(0, contentMatchIndex - 30); const end = contentMatchIndex + query.length + 70; context = `...${item.content.substring(start, end)}...`; } else if (titleMatch) { context = item.content.substring(0, 100) + '...'; } return { score: titleMatch ? 10 : (contentMatchIndex > -1 ? 5 : 0), item, context }; }) .filter(result => result.score > 0) .sort((a, b) => b.score - a.score); renderSearchResults(results); };
    const renderSearchResults = (results) => { if (results.length === 0) { searchResults.classList.remove('visible'); return; } searchResults.innerHTML = results.map(result => ` <a href="#${result.item.page}" class="search-result-item"> <span class="result-title">${result.item.title}</span> <span class="result-context">${result.context.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span> </a> `).join(''); searchResults.classList.add('visible'); };
    
    // --- Configuração dos Event Listeners ---
    function setupEventListeners() {
        window.addEventListener('hashchange', handleNavigation);
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
        });
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
