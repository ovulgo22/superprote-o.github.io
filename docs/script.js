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
