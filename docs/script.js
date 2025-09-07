document.addEventListener('DOMContentLoaded', () => {
    // --- Funcionalidade do Menu Móvel ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('visible');
        });
    }

    // --- Funcionalidade de Copiar Código ---
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pre = button.previousElementSibling;
            const code = pre.querySelector('code');
            const textToCopy = code.innerText;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="ph-check-circle"></i> Copiado!';
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                }, 2000);
            }).catch(err => {
                console.error('Falha ao copiar texto: ', err);
            });
        });
    });

    // --- Navegação Ativa na Barra Lateral ---
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.content-area section');

    // Função para atualizar o link ativo
    const updateActiveLink = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // 150 é um offset para ativar o link um pouco antes de chegar no topo
            if (window.scrollY >= sectionTop - 150) { 
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Adiciona o listener de scroll
    document.querySelector('.content-area').addEventListener('scroll', updateActiveLink);
    // Chama a função uma vez para definir o estado inicial
    updateActiveLink();
});
