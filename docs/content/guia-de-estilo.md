# Guia de Estilo de Conteúdo

Este guia define as regras, a voz e os padrões de formatação para toda a documentação. A adesão estrita a este guia é o que garante uma experiência de usuário profissional, clara e consistente, no padrão do GitHub Docs.

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

1.  **Título (`#`):** Curto, descritivo e orientado à ação (ex: "Criando seu Primeiro App" em vez de "Sobre Apps").
2.  **Parágrafo Introdutório (Preamble):** As duas ou três primeiras frases devem resumir o artigo e o que o leitor será capaz de fazer ao final.
3.  **Pré-requisitos:** Uma seção `### Pré-requisitos` se o guia depender de etapas anteriores.
4.  **Corpo do Artigo:** Seções lógicas com títulos `##` e `###`.
5.  **Leitura Adicional:** Uma seção `### Próximos Passos` para guiar o leitor em sua jornada.

## 3. Padrões de Conteúdo e "Fórmulas"

Estas são as "fórmulas" para apresentar informações complexas de forma clara.

### Tabelas
Use tabelas para apresentar conjuntos de dados estruturados, como parâmetros de API, com colunas claras: `Parâmetro`, `Tipo`, `Obrigatório`, `Descrição`.

### Listas
- **Listas Numeradas:** Use para procedimentos passo a passo onde a ordem importa. Cada item deve ser uma ação clara.
- **Listas de Marcadores:** Use para listar itens onde a ordem não importa.

### Ênfase e Formatação
-   **Negrito (`**Texto**`):** Para elementos de UI (**Salvar**, **Configurações**), nomes de arquivo (**menu.json**) e ênfase forte.
-   **Código Inline (`` `texto` ``):** Para nomes de parâmetros (`user_id`), comandos (`git clone`), valores (`true`) e nomes de tags HTML (`<div>`).
-   **Teclas de Atalho (`<kbd>`):** Use a tag `<kbd>` para representar teclas do teclado.
    -   Exemplo: Pressione <kbd>Ctrl</kbd> + <kbd>C</kbd> para copiar.

### Callouts (Blocos de Destaque)
Use a sintaxe `> [!TIPO]` para destacar informações.

-   `[!NOTE]`: Para informações suplementares. Ícone azul de informação.
-   `[!TIP]`: Para dicas e boas práticas opcionais. Ícone verde de lâmpada.
-   `[!WARNING]`: Para informações que exigem atenção e podem ter consequências inesperadas. Ícone amarelo de aviso.
-   `[!IMPORTANT]`: Para informações cruciais que o usuário não pode ignorar. Ícone roxo de exclamação.
-   `[!DANGER]`: Para avisos sobre ações perigosas ou destrutivas (ex: exclusão de dados). Ícone vermelho de perigo.

### Seções Expansíveis (`<details>`)
Use para informações secundárias ou muito longas (logs de erro, exemplos de código extensos) que podem poluir o fluxo principal do artigo.

```html
<details>
<summary>Clique para ver o exemplo de resposta completa</summary>

```json
{
  "long_json_response": "aqui..."
}
