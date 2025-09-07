# Guia de Estilo de Conteúdo

Este guia define as melhores práticas para escrever e estruturar a documentação neste site. Seguir estas regras garante que nosso conteúdo seja claro, consistente e fácil de usar, semelhante ao padrão de qualidade do GitHub Docs.

## Princípios Fundamentais

1.  **Clareza Acima de Tudo:** Use linguagem simples e direta. Evite jargões ou explique-os na primeira vez que os usar. O objetivo é remover a ambiguidade.
2.  **Estrutura Escaneável:** Os usuários raramente leem palavra por palavra. Eles escaneiam a página em busca de informações. Organize o conteúdo para facilitar essa varredura.
3.  **Foco na Ação:** Comece com o que o usuário precisa saber ou fazer. Forneça o "como" imediatamente, seguido pelo "porquê" ou por detalhes mais profundos.

## Estrutura Padrão de um Artigo

Cada página de documentação deve seguir esta estrutura básica para manter a previsibilidade.

### 1. Título (`# Título Principal`)
O título deve ser descritivo e indicar claramente o conteúdo da página.

### 2. Parágrafo Introdutório
A primeira frase ou parágrafo deve resumir o propósito do artigo. Diga ao leitor o que ele aprenderá ou será capaz de fazer depois de ler a página.

* **Bom:** "Neste guia, você aprenderá a configurar e usar o endpoint de Chat para criar conversas interativas."
* **Ruim:** "O endpoint de Chat é uma funcionalidade da nossa API."

### 3. Seção de Pré-requisitos (Opcional)
Se um guia exigir conhecimento prévio ou configuração, liste-os em uma seção `### Pré-requisitos` usando uma lista de marcadores.

### 4. Corpo do Artigo (Títulos `##` e `###`)
-   Use `## Títulos de Seção` para dividir o artigo em seções lógicas e principais.
-   Use `### Subtítulos` para detalhar ainda mais dentro de uma seção.
-   Para tutoriais passo a passo, use listas numeradas.
-   Para listas de itens não sequenciais, use listas de marcadores.

### 5. Leitura Adicional (Opcional)
Ao final do artigo, você pode adicionar uma seção `### Próximos Passos` ou `### Leitura Adicional` com links para outros guias relevantes.

## Formatação de Texto

A consistência na formatação é crucial para a legibilidade.

-   **Negrito (`**Texto**`):** Use para se referir a elementos de UI clicáveis (botões, nomes de menu), nomes de arquivo ou para dar forte ênfase a um termo específico.
    -   Exemplo: "Navegue até **Configurações > Chaves de API** e clique em **Gerar Nova Chave**."
    -   Exemplo: "Certifique-se de salvar seu arquivo **menu.json**."

-   **Código Inline (`` `texto` ``):** Use para nomes de variáveis, valores, comandos de terminal, nomes de parâmetros, métodos de API, ou qualquer trecho de código curto no meio de uma frase.
    -   Exemplo: "Defina o parâmetro `temperature` como `0.2` para respostas mais determinísticas."
    -   Exemplo: "Execute o comando `npm install` para instalar as dependências."

-   **Itálico (`*Texto*`):** Use com moderação para introduzir um novo termo ou para dar uma ênfase sutil.
    -   Exemplo: "O processo de ajustar um modelo aos seus próprios dados é chamado de *fine-tuning*."

-   **Callouts (`[!NOTE]`, `[!WARNING]`):** Use para destacar informações importantes que estão fora do fluxo principal do texto.
    -   `[!NOTE]`: Para informações suplementares ou dicas úteis.
    -   `[!WARNING]`: Para alertar o usuário sobre cuidados importantes ou ações não reversíveis.
    -   `[!DANGER]`: Para avisos críticos sobre segurança ou perda de dados.
