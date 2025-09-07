# Guia: Criando uma Referência de API

Uma página de Referência de API é o mapa de seus endpoints. Ela deve ser precisa, previsível e fácil de escanear. Neste guia, aprenderemos a estruturar uma referência para um único endpoint, usando componentes avançados para máxima clareza.

### Pré-requisitos
- Conhecimento sobre os princípios de APIs REST.
- Familiaridade com o formato JSON.

## A Anatomia de um Endpoint

A documentação de um endpoint deve ser dividida em duas partes principais:

1.  **A Requisição (Request):** Como fazer uma chamada para o endpoint. Isso inclui o método HTTP, o caminho (path), cabeçalhos e os parâmetros.
2.  **A Resposta (Response):** O que a API retorna em casos de sucesso e de erro. Isso inclui os códigos de status HTTP e o corpo da resposta.

---

## Exemplo: Criar um Novo Usuário

Vamos documentar um endpoint para criar um novo usuário no sistema.

<span class="api-method post">POST</span> ``/v1/users``

Este endpoint cria um novo objeto de usuário. Apenas administradores podem usar este endpoint.

### Parâmetros do Corpo da Requisição

> [!NOTE]
> Este endpoint espera um corpo de requisição em formato `JSON` com o `Content-Type: application/json`.

| Parâmetro | Tipo     | Obrigatório | Descrição                                        |
|-----------|----------|-------------|--------------------------------------------------|
| `email`   | `string` | Sim         | O endereço de e-mail único para o novo usuário.  |
| `name`    | `string` | Sim         | O nome completo do usuário.                      |
| `role`    | `string` | Não         | A função do usuário. Padrão: `'viewer'`. Opções: `'admin'`, `'editor'`, `'viewer'`. |

### Exemplo de Requisição

Aprenda a fazer esta requisição em diferentes linguagens usando as abas abaixo.

<div class="code-tabs">

```bash
# Lembre-se de substituir SUA_CHAVE_DE_API pela sua chave real.

curl -X POST "[https://api.exemplo.com/v1/users](https://api.exemplo.com/v1/users)" \
  -H "Authorization: Bearer SUA_CHAVE_DE_API" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "name": "Nome Sobrenome",
    "role": "editor"
  }'

import os
import requests

API_KEY = os.getenv("API_KEY")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

payload = {
    "email": "usuario@exemplo.com",
    "name": "Nome Sobrenome",
    "role": "editor",
}

response = requests.post(
    "[https://api.exemplo.com/v1/users](https://api.exemplo.com/v1/users)",
    headers=headers,
    json=payload
)

print(response.json())

import axios from 'axios';

const API_KEY = process.env.API_KEY;

async function createUser() {
  try {
    const response = await axios.post(
      '[https://api.exemplo.com/v1/users](https://api.exemplo.com/v1/users)',
      {
        email: 'usuario@exemplo.com',
        name: 'Nome Sobrenome',
        role: 'editor',
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}

createUser();

</div>
Exemplo de Resposta
Se a requisição for bem-sucedida, a API retornará um código de status 201 Created e o objeto de usuário recém-criado.
<details>
<summary>Clique para ver o corpo da resposta (201 Created)</summary>
{
  "id": "usr_1a2b3c4d5e6f7g8h",
  "object": "user",
  "created_at": "2025-09-07T14:08:29Z",
  "name": "Nome Sobrenome",
  "email": "usuario@exemplo.com",
  "role": "editor",
  "is_active": true
}

</details>
Tratamento de Erros Comuns
Se a sua requisição falhar, a API retornará um erro com um código de status apropriado.
| Código HTTP | Identificador do Erro | Descrição |
|---|---|---|
| 400 | invalid_email | O e-mail fornecido não está em um formato válido. |
| 401 | missing_api_key | A chave de API não foi fornecida no cabeçalho. |
| 409 | email_exists | Um usuário com este e-mail já existe. |
> [!TIP]
> Para evitar a criação de usuários duplicados em caso de falha de rede, você pode incluir um cabeçalho Idempotency-Key com um valor único em suas requisições POST.
> 
Próximos Passos
 * Use os princípios deste guia para documentar seus próprios endpoints.
 * Consulte o nosso Guia de Estilo para rever as melhores práticas de formatação.
