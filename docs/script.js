document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos Globais ---
    const sidebar = document.getElementById('sidebar');
    const contentArea = document.getElementById('content-area');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    // --- Configuração das Bibliotecas ---
    // Configura o Marked para usar o Highlight.js para blocos de código
    marked.setOptions({
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-', // Adiciona classes para compatibilidade com temas CSS
    });

    // --- Lógica de Carregamento de Conteúdo ---
    const loadContent = async (page) => {
        // Se a página for nula ou vazia, carrega a página de introdução
        if (!page) page = 'introducao'; 
        
        try {
            const response = await fetch(`content/${page}.md`);
            if (!response.ok) {
                throw new Error('Página não encontrada.');
            }
            const markdown = await response.text();
            contentArea.innerHTML = marked.parse(markdown);
            addCopyButtonsToCodeBlocks();
        } catch (error) {
            contentArea.innerHTML = `<h1>Erro 404</h1><p>O conteúdo solicitado não foi encontrado.</p>`;
            console.error('Erro ao carregar conteúdo:', error);
        }
        contentArea.scrollTop = 0; // Rola para o topo ao carregar nova página
    };
    
    // --- Lógica do Botão de Copiar (com Delegação de Eventos) ---
    const addCopyButtonsToCodeBlocks = () => {
        const codeBlocks = contentArea.querySelectorAll('pre');
        codeBlocks.forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-btn';
            button.innerHTML = '<i class="ph-copy"></i> <span>Copiar</span>';
            block.appendChild(button);
        });
    };
    
    contentArea.addEventListener('click', (event) => {
        const copyBtn = event.target.closest('.copy-btn');
        if (copyBtn) {
            const pre = copyBtn.parentElement;
            const code = pre.querySelector('code').innerText;
            
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerHTML = '<i class="ph-check-circle"></i> <span>Copiado!</span>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="ph-copy"></i> <span>Copiar</span>';
                }, 2000);
            }).catch(err => {
                console.error('Falha ao copiar: ', err);
                copyBtn.innerText = 'Erro ao copiar';
            });
        }
    });


    // --- Lógica de Navegação e Roteamento ---
    const handleNavigation = () => {
        // Pega o hash da URL (ex: #introducao) e remove o '#'
        const page = window.location.hash.substring(1);
        loadContent(page || 'introducao'); // Carrega 'introducao' se não houver hash

        // Atualiza a classe 'active' nos links da sidebar
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            if (link.dataset.page === (page || 'introducao')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    sidebar.addEventListener('click', (event) => {
        const link = event.target.closest('.nav-link');
        if (link) {
            // Fecha o menu sidebar no mobile ao clicar em um link
            if (sidebar.classList.contains('visible')) {
                sidebar.classList.remove('visible');
            }
        }
    });

    // Ouve por mudanças no hash da URL (ex: clique em link, botões de voltar/avançar)
    window.addEventListener('hashchange', handleNavigation);
    // Carrega o conteúdo inicial baseado na URL atual
    handleNavigation();


    // --- Lógica do Seletor de Tema ---
    const applySavedTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
        }
    };
    applySavedTheme();

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });


    // --- Funcionalidade do Menu Móvel ---
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('visible');
    });

});

/* Adicionar ao final do style.css */

/* --- Estilos da Busca --- */
.sidebar-search-wrapper {
    position: relative;
    margin-bottom: 24px;
}

.sidebar-search {
    position: relative;
}

.sidebar-search .ph-magnifying-glass {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 12px;
    color: var(--text-muted);
    font-size: 18px;
}

.sidebar-search input {
    width: 100%;
    padding: 10px 10px 10px 40px; /* Espaço para o ícone */
    border-radius: 6px;
    background-color: var(--code-bg);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 0.9rem;
}

.search-results {
    display: none; /* Escondido por padrão */
    position: absolute;
    top: 110%;
    left: 0;
    right: 0;
    background-color: var(--sidebar-bg);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.search-results.visible {
    display: block;
}

.search-results a {
    display: block;
    padding: 12px 16px;
    color: var(--text-muted);
    text-decoration: none;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s;
}
.search-results a:last-child {
    border-bottom: none;
}

.search-results a:hover {
    background-color: var(--border-color);
    color: var(--text-color);
}

.search-results .result-title {
    font-weight: 500;
    color: var(--text-color);
    display: block;
}

.search-results .result-context {
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-top: 4px;
}
