# Guia de Estilo de Conteúdo

Neste guia, você aprenderá as regras, a voz e os padrões para criar uma documentação clara e consistente, no padrão do GitHub Docs. Seguir estas diretrizes é essencial para a qualidade do projeto.

### Pré-requisitos

-   Familiaridade com a sintaxe básica do Markdown.

## 1. Voz e Tom

A nossa voz é a personalidade da nossa documentação. O nosso tom adapta essa voz a situações específicas.

-   **Seja Direto e Ativo:** Use a voz ativa. Comece as frases com verbos.
    -   **Correto:** "Execute o comando para instalar as dependências."
    -   **Incorreto:** "As dependências podem ser instaladas executando o comando."

-   **Seja Claro e Conciso:** Evite palavras desnecessárias. Vá direto ao ponto.
    -   **Correto:** "Para usar a API, você precisa de uma chave de autenticação."
    -   **Incorreto:** "É importante notar que, para poder utilizar a API, será necessário primeiro obter uma chave de autenticação."

-   **Seja Empático:** Antecipe as dúvidas e dificuldades do leitor. Use "callouts" para dar dicas e avisos onde eles são mais necessários.

## 2. Estrutura Padrão de Artigo

Todo artigo deve seguir esta estrutura previsível para reduzir a carga cognitiva do leitor.

- [ ] Usar um Título (`#`) curto e orientado à ação.
- [ ] Escrever um parágrafo introdutório que resuma o objetivo.
- [ ] Adicionar uma seção de `### Pré-requisitos`, se aplicável.
- [ ] Dividir o corpo do artigo com títulos `##` e `###`.
- [ ] Concluir com uma seção de `### Próximos Passos` para guiar o leitor.

## 3. Padrões de Conteúdo e "Fórmulas"

Estas são as "fórmulas" para apresentar informações complexas de forma clara.

### Tabelas
Use tabelas para apresentar conjuntos de dados estruturados, como parâmetros de API.

### Ênfase e Formatação
-   **Negrito (`**Texto**`):** Para elementos de UI (**Salvar**, **Configurações**), nomes de arquivo (**menu.json**) e ênfase forte.
-   **Código Inline (`` `texto` ``):** Para nomes de parâmetros (`user_id`), comandos (`git clone`) e valores (`true`).
-   **Teclas de Atalho (`<kbd>`):** Use a tag `<kbd>` para representar teclas do teclado.
    -   Exemplo: Pressione <kbd>Ctrl</kbd> + <kbd>C</kbd> para copiar o texto.

### Callouts (Blocos de Destaque)
Use a sintaxe `> [!TIPO]` para destacar informações.

> [!TIP]
> Você pode aninhar outras formatações, como `código` ou **negrito**, dentro de um callout para dar mais ênfase.

-   `[!NOTE]`: Para informações suplementares.
-   `[!TIP]`: Para dicas e boas práticas opcionais.
-   `[!WARNING]`: Para informações que exigem atenção.
-   `[!IMPORTANT]`: Para informações cruciais que o usuário não pode ignorar.
-   `[!DANGER]`: Para avisos sobre ações perigosas ou destrutivas.

### Seções Expansíveis (`<details>`)
Use para informações secundárias ou muito longas que podem poluir o fluxo principal do artigo.

<details>
<summary>Clique para ver um exemplo de uso do elemento details</summary>
<details>
  <summary>Título da Seção</summary>
  
  Conteúdo escondido que só aparece quando o usuário clica.
  
</details>

</details>
Badges de Métodos de API
Use <span> com classes específicas para indicar métodos HTTP.
 * Exemplo: <span class="api-method post">POST</span> /v1/users
