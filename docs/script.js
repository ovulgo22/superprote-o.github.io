document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos Globais e Variáveis ---
    const sidebarNav = document.getElementById('sidebar-nav');
    const contentArea = document.getElementById('content-area');
    const onPageToc = document.getElementById('on-page-toc');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let searchIndex = [];
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
        const menuConfig = await fetchMenuConfig();
        if (menuConfig) {
            buildSidebarMenu(menuConfig);
            await buildSearchIndex(menuConfig);
            handleNavigation();
        }
    };

    // --- Lógica de Carregamento de Conteúdo ---
    const loadContent = async (page) => {
        const pageLinks = menuConfig.filter(item => item.type === 'link');
        if (!page) page = pageLinks[0]?.page || 'introducao';
        
        try {
            const response = await fetch(`content/${page}.md`);
            if (!response.ok) throw new Error('Página não encontrada.');
            const markdown = await response.text();
            contentArea.innerHTML = marked.parse(markdown);
            
            // Pós-processamento do HTML renderizado
            enhanceCodeBlocks();
            createCodeTabs();
            transformCallouts();
            generateOnPageNavAndAnchors();

        } catch (error) {
            contentArea.innerHTML = `<h1>Erro 404</h1><p>O conteúdo para "${page}" não foi encontrado.</p>`;
            onPageToc.innerHTML = '';
        }
        contentArea.scrollTop = 0;
    };
    
    // --- FUNÇÕES DE MELHORIA DE UI ---
    const enhanceCodeBlocks = () => {
        const codeBlocks = contentArea.querySelectorAll('pre');
        codeBlocks.forEach(pre => {
            if (pre.parentNode.classList.contains('code-block-wrapper')) return;
            const code = pre.querySelector('code');
            if (!code) return;
            const lang = code.className.replace('hljs language-', '').trim() || 'shell';
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            const header = document.createElement('div');
            header.className = 'code-block-header';
            const langName = document.createElement('span');
            langName.className = 'lang-name';
            langName.textContent = lang;
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '<i class="ph-copy"></i> Copiar';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(code.innerText).then(() => {
                    copyBtn.innerHTML = '<i class="ph-check-circle"></i> Copiado!';
                    setTimeout(() => { copyBtn.innerHTML = '<i class="ph-copy"></i> Copiar'; }, 2000);
                });
            });
            header.appendChild(langName);
            header.appendChild(copyBtn);
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(header);
            wrapper.appendChild(pre);
        });
    };

    const createCodeTabs = () => {
        const tabGroups = contentArea.querySelectorAll('.code-tabs');
        tabGroups.forEach((group) => {
            const codeBlocks = Array.from(group.querySelectorAll('.code-block-wrapper'));
            if (codeBlocks.length === 0) return;
            const tabBar = document.createElement('div');
            tabBar.className = 'code-tabs-bar';
            codeBlocks.forEach((block, blockIndex) => {
                const lang = block.querySelector('.lang-name').textContent || `aba ${blockIndex + 1}`;
                const button = document.createElement('button');
                button.textContent = lang;
                button.setAttribute('role', 'tab');
                if (blockIndex === 0) {
                    button.classList.add('active');
                } else {
                    block.classList.add('hidden');
                }
                button.addEventListener('click', () => {
                    tabBar.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    codeBlocks.forEach((b, i) => b.classList.toggle('hidden', i !== blockIndex));
                });
                tabBar.appendChild(button);
            });
            group.prepend(tabBar);
        });
    };

    const transformCallouts = () => {
        const blockquotes = contentArea.querySelectorAll('blockquote');
        const calloutTypes = {
            '[!NOTE]': { class: 'note', icon: 'ph-info' },
            '[!TIP]': { class: 'tip', icon: 'ph-lightbulb' },
            '[!WARNING]': { class: 'warning', icon: 'ph-warning' },
            '[!IMPORTANT]': { class: 'important', icon: 'ph-seal-warning' },
            '[!DANGER]': { class: 'danger', icon: 'ph-warning-octagon' }
        };
        blockquotes.forEach(bq => {
            const p = bq.querySelector('p');
            if (!p) return;
            const text = p.innerHTML.trim();
            const type = Object.keys(calloutTypes).find(key => text.startsWith(key));
            if (type) {
                const config = calloutTypes[type];
                bq.className = `callout ${config.class}`;
                p.innerHTML = text.substring(type.length).trim();
                bq.innerHTML = `<i class="ph ${config.icon}"></i><div>${bq.innerHTML}</div>`;
            }
        });
    };

    const generateOnPageNavAndAnchors = () => {
        onPageToc.innerHTML = '';
        const headings = contentArea.querySelectorAll('h2, h3');
        if (headings.length < 1) {
            setupIntersectionObserver(); return;
        }
        headings.forEach(heading => {
            const text = heading.textContent;
            const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            heading.id = id;
            const anchorLink = document.createElement('a');
            anchorLink.className = 'heading-anchor-link';
            anchorLink.href = `#${id}`;
            anchorLink.setAttribute('aria-label', `Link permanente para esta seção: ${text}`);
            anchorLink.innerHTML = '<i class="ph-link"></i>';
            heading.appendChild(anchorLink);
            if (headings.length >= 2) {
                const link = document.createElement('a');
                link.href = `#${id}`;
                link.textContent = text;
                link.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
                onPageToc.appendChild(link);
            }
        });
        setupIntersectionObserver();
    };

    const setupIntersectionObserver = () => {
        if (observer) observer.disconnect();
        const headings = contentArea.querySelectorAll('h2, h3');
        if (headings.length === 0) return;
        const options = { root: contentArea, rootMargin: "0px 0px -80% 0px" };
        observer = new IntersectionObserver((entries) => {
            let visibleSection = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) { if (!visibleSection) { visibleSection = entry.target.getAttribute('id'); } }
            });
            if (visibleSection) {
                onPageToc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                const activeLink = onPageToc.querySelector(`a[href="#${visibleSection}"]`);
                if (activeLink) { activeLink.classList.add('active'); }
            }
        }, options);
        headings.forEach(heading => observer.observe(heading));
    };

    // --- Funções Principais (Menu, Busca, Navegação) ---
    let menuConfig = [];
    const fetchMenuConfig = async () => { try { const response = await fetch('menu.json'); if (!response.ok) throw new Error('menu.json não encontrado.'); menuConfig = await response.json(); return menuConfig; } catch (error) { console.error("Erro fatal ao carregar o menu:", error); sidebarNav.innerHTML = "<ul><li>Erro ao carregar menu.</li></ul>"; return null; } };
    const buildSidebarMenu = (config) => { const ul = document.createElement('ul'); config.forEach(item => { const li = document.createElement('li'); if (item.type === 'category') { li.className = 'category'; li.innerHTML = `<span>${item.title}</span>`; } else if (item.type === 'link') { li.innerHTML = `<a href="#${item.page}" data-page="${item.page}" class="nav-link">${item.title}</a>`; } ul.appendChild(li); }); sidebarNav.innerHTML = ''; sidebarNav.appendChild(ul); };
    const buildSearchIndex = async (config) => { const fetchPromises = config.filter(item => item.type === 'link').map(async item => { try { const response = await fetch(`content/${item.page}.md`); const content = await response.text(); searchIndex.push({ title: item.title, page: item.page, content }); } catch (e) { console.warn(`Não foi possível indexar a página: ${item.page}`); } }); await Promise.all(fetchPromises); };
    const handleNavigation = () => { const pageLinks = menuConfig.filter(item => item.type === 'link'); const page = window.location.hash.substring(1) || (pageLinks[0]?.page || 'introducao'); loadContent(page); updateActiveLink(page); };
    const updateActiveLink = (page) => { document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => { link.classList.toggle('active', link.dataset.page === page); }); };
    const handleSearch = (event) => { const query = event.target.value.toLowerCase().trim(); if (query.length < 2) { searchResults.classList.remove('visible'); return; } const results = searchIndex.map(item => { const contentMatchIndex = item.content.toLowerCase().indexOf(query); const titleMatch = item.title.toLowerCase().includes(query); let context = ''; if (contentMatchIndex > -1) { const start = Math.max(0, contentMatchIndex - 30); const end = contentMatchIndex + query.length + 70; context = `...${item.content.substring(start, end)}...`; } else if (titleMatch) { context = item.content.substring(0, 100) + '...'; } return { score: titleMatch ? 10 : (contentMatchIndex > -1 ? 5 : 0), item, context }; }).filter(result => result.score > 0).sort((a, b) => b.score - a.score); renderSearchResults(results); };
    const renderSearchResults = (results) => { if (results.length === 0) { searchResults.classList.remove('visible'); return; } searchResults.innerHTML = results.map(result => ` <a href="#${result.item.page}" class="search-result-item"> <span class="result-title">${result.item.title}</span> <span class="result-context">${result.context.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span> </a> `).join(''); searchResults.classList.add('visible'); };
    
    function setupEventListeners() {
        window.addEventListener('hashchange', handleNavigation);
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('focus', handleSearch);
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.sidebar-search-wrapper')) { searchResults.classList.remove('visible'); }
            if (event.target.closest('.search-result-item')) { searchResults.classList.remove('visible'); searchInput.value = ''; }
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
