document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos Globais ---
    const sidebarNav = document.getElementById('sidebar-nav');
    const contentArea = document.getElementById('content-area');
    const onPageToc = document.getElementById('on-page-toc');
    const searchInput = document.getElementById('search-input');
    // ... (outros elementos)

    let searchIndex = [];
    let observer; // Variável para o IntersectionObserver

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

    // --- Construção do Menu e Índice de Busca (sem alterações) ---
    // ... (funções fetchMenuConfig, buildSidebarMenu, buildSearchIndex)
    const fetchMenuConfig=async()=>{try{const e=await fetch("menu.json");if(!e.ok)throw new Error("menu.json não encontrado.");return await e.json()}catch(e){return console.error("Erro fatal ao carregar o menu:",e),sidebarNav.innerHTML="<ul><li>Erro ao carregar menu.</li></ul>",null}};const buildSidebarMenu=e=>{const t=document.createElement("ul");e.forEach(e=>{const o=document.createElement("li");"category"===e.type?(o.className="category",o.innerHTML=`<span>${e.title}</span>`):"link"===e.type&&(o.innerHTML=`<a href="#${e.page}" data-page="${e.page}" class="nav-link">${e.title}</a>`),t.appendChild(o)}),sidebarNav.innerHTML="",sidebarNav.appendChild(t)};const buildSearchIndex=async e=>{const t=e.filter(e=>"link"===e.type).map(async e=>{try{const t=await fetch(`content/${e.page}.md`),o=await t.text();searchIndex.push({title:e.title,page:e.page,content:o})}catch(t){console.warn(`Não foi possível indexar a página: ${e.page}`)}});await Promise.all(t)};

    // --- Lógica de Carregamento de Conteúdo (ATUALIZADO) ---
    const loadContent = async (page) => {
        if (!page) page = 'introducao';
        try {
            const response = await fetch(`content/${page}.md`);
            if (!response.ok) throw new Error('Página não encontrada.');
            const markdown = await response.text();
            contentArea.innerHTML = marked.parse(markdown);
            contentArea.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
            
            // NOVO: Gera o índice da página após carregar o conteúdo
            generateOnPageNav();

        } catch (error) {
            contentArea.innerHTML = `<h1>Erro 404</h1><p>O conteúdo para "${page}" não foi encontrado.</p>`;
            onPageToc.innerHTML = ''; // Limpa o índice em caso de erro
        }
        contentArea.scrollTop = 0;
    };

    // --- NOVO: Geração do Índice da Página (TOC) ---
    const generateOnPageNav = () => {
        onPageToc.innerHTML = '';
        const headings = contentArea.querySelectorAll('h2, h3');
        if (headings.length < 2) return; // Não mostra o TOC se houver poucos títulos

        headings.forEach(heading => {
            const text = heading.textContent;
            const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            heading.id = id;

            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = text;
            link.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
            onPageToc.appendChild(link);
        });

        setupIntersectionObserver();
    };

    // --- NOVO: Destaque Ativo do Índice com Intersection Observer ---
    const setupIntersectionObserver = () => {
        // Desconecta o observador anterior, se existir
        if (observer) observer.disconnect();

        const headings = contentArea.querySelectorAll('h2, h3');
        if (headings.length === 0) return;
        
        const options = { root: contentArea, rootMargin: "0px 0px -80% 0px" };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const link = onPageToc.querySelector(`a[href="#${id}"]`);
                if (link) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0) {
                        // Remove 'active' de todos e adiciona ao link atual
                        onPageToc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        }, options);

        headings.forEach(heading => observer.observe(heading));
    };

    // --- Lógica de Navegação e Roteamento (sem alterações) ---
    const handleNavigation=()=>{const e=window.location.hash.substring(1)||"introducao";loadContent(e),updateActiveLink(e)};const updateActiveLink=e=>{document.querySelectorAll(".sidebar-nav .nav-link").forEach(t=>{t.classList.toggle("active",t.dataset.page===e)})};

    // --- Lógica da Busca (sem alterações) ---
    const handleSearch=e=>{const t=e.target.value.toLowerCase().trim();if(t.length<2)return void searchResults.classList.remove("visible");const o=searchIndex.map(e=>{const o=e.content.toLowerCase().indexOf(t),n=e.title.toLowerCase().includes(t);let s="";return o>-1?s=`...${e.content.substring(Math.max(0,o-30),o+t.length+70)}...`:n&&(s=e.content.substring(0,100)+" ..."),{score:n?10:o>-1?5:0,item:e,context:s}}).filter(e=>e.score>0).sort((e,t)=>t.score-e.score);renderSearchResults(o)};const renderSearchResults=e=>{if(0===e.length)return void searchResults.classList.remove("visible");searchResults.innerHTML=e.map(e=>`\n            <a href="#${e.item.page}" class="search-result-item">\n                <span class="result-title">${e.item.title}</span>\n                <span class="result-context">${e.context.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</span>\n            </a>\n        `).join(""),searchResults.classList.add("visible")};

    // --- Configuração dos Event Listeners (sem alterações) ---
    function setupEventListeners(){window.addEventListener("hashchange",handleNavigation),searchInput.addEventListener("input",handleSearch),searchInput.addEventListener("focus",handleSearch),document.addEventListener("click",e=>{e.target.closest(".sidebar-search-wrapper")||searchResults.classList.remove("visible"),e.target.closest(".search-result-item")&&(searchResults.classList.remove("visible"),searchInput.value="")});const e=document.getElementById("mobile-menu-toggle"),t=document.getElementById("sidebar");e.addEventListener("click",()=>t.classList.toggle("visible")),t.addEventListener("click",e=>{e.target.closest(".nav-link")&&t.classList.contains("visible")&&t.classList.remove("visible")})}

    // --- Iniciar ---
    initializeApp();
});
