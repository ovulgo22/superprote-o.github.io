## Autenticação

Para usar a API, você precisa de uma chave de autenticação. Obtenha sua chave no painel de controle e inclua-a no cabeçalho `Authorization` de suas requisições como um Bearer token.

Todas as requisições à API devem ser feitas para o endpoint base: `https://api.superprotecnico.com/v1`.

### Exemplo de Requisição

Abaixo está um exemplo de como fazer uma requisição autenticada usando `cURL` para listar os modelos disponíveis.

```bash
curl [https://api.superprotecnico.com/v1/models](https://api.superprotecnico.com/v1/models) \
  -H "Authorization: Bearer SUA_CHAVE_DE_API"
