## Autenticação

Toda requisição à API da Super Pró-Técnico deve ser autenticada usando sua chave de API secreta. Requisições sem autenticação ou com uma chave inválida resultarão em um erro `401 Unauthorized`.

### Como Obter sua Chave de API

1.  **Crie uma conta:** Se ainda não tiver uma, registre-se em nossa plataforma.
2.  **Acesse o Painel do Desenvolvedor:** Faça login e navegue até a seção "API Keys" no menu da sua conta.
3.  **Gere uma Nova Chave:** Clique em "Create new secret key". Dê um nome descritivo à sua chave (ex: "Meu Projeto de Documentação").
4.  **Copie e Guarde sua Chave:** Sua chave será exibida **apenas uma vez**. Copie-a e armazene-a em um local seguro. Por motivos de segurança, não poderemos exibi-la novamente.

### Usando a Chave de API

Inclua sua chave no cabeçalho `Authorization` de cada requisição como um Bearer Token.

```bash
curl [https://api.superprotecnico.com/v1/models](https://api.superprotecnico.com/v1/models) \
  -H "Authorization: Bearer SUA_CHAVE_DE_API"
