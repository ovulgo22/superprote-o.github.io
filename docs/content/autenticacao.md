Excelente. Seguindo a nova proposta do site, a antiga página autenticacao.md foi transformada em um guia sobre como escrever uma boa página de documentação sobre autenticação.
Isso serve como um exemplo prático dos princípios que discutimos na introdução.
docs/content/guia-autenticacao.md
# Guia: Escrevendo Páginas de Autenticação

A página de autenticação é frequentemente o primeiro ponto de interação real de um desenvolvedor com sua API. Se essa etapa for confusa ou frustrante, muitos podem desistir antes mesmo de fazer a primeira chamada.

Uma documentação de autenticação eficaz deve ser clara, direta e focada em segurança. Ela exemplifica o princípio de **clareza e usabilidade para desenvolvedores**.

### Componentes Essenciais

Uma página de autenticação robusta deve conter três seções principais:

#### 1. Como Obter as Credenciais

Esta seção deve ser um guia passo a passo, sem ambiguidades, que leva o usuário do login até a posse da chave de API.

**Boas Práticas:**
- Use uma lista numerada para os passos.
- Inclua screenshots ou GIFs do painel de controle, se possível.
- Deixe claro onde o usuário precisa clicar (ex: "Navegue até **Painel do Desenvolvedor > Chaves de API**").
- Adicione um aviso de segurança sobre a importância de guardar a chave.

> **Exemplo de Bloco de Destaque:**
> **Importante:** Sua chave de API secreta é exibida **apenas uma vez**. Guarde-a em um local seguro, pois você não poderá visualizá-la novamente.

#### 2. Como Usar as Credenciais

Aqui é onde você aplica o princípio de **componentes interativos focados no desenvolvedor**. Mostre exemplos de código claros e prontos para copiar.

**Boas Práticas:**
- Forneça exemplos em múltiplas linguagens populares (cURL, Python, Node.js) usando abas de código.
- Use um placeholder claro, como `SUA_CHAVE_DE_API`, para indicar onde a chave do usuário deve ser inserida.
- Mostre exatamente qual cabeçalho HTTP deve ser usado (geralmente `Authorization`).

**Exemplo de Código Funcional:**
```bash
# Exemplo de requisição usando o cabeçalho Authorization com um Bearer Token

curl "[https://api.exemplo.com/v1/users/me](https://api.exemplo.com/v1/users/me)" \
  -H "Authorization: Bearer SUA_CHAVE_DE_API"

3. Melhores Práticas de Segurança
Educar seus usuários sobre segurança não apenas os protege, mas também protege sua plataforma. Esta seção demonstra a responsabilidade e a maturidade da sua API.
Tópicos a Cobrir:
 * Nunca exponha chaves no front-end: Explique por que as chaves de API nunca devem estar em código JavaScript de um site público.
 * Uso de Variáveis de Ambiente: Recomende fortemente o carregamento de chaves a partir de variáveis de ambiente no back-end.
 * Rotação de Chaves: Mencione a prática de revogar e gerar novas chaves periodicamente ou em caso de suspeita de vazamento.
Ao estruturar sua página de autenticação com esses três pilares, você remove barreiras e constrói a confiança do desenvolvedor desde o primeiro momento.
