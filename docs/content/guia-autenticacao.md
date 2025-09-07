# Guia: Escrevendo Páginas de Autenticação

Neste guia, você aprenderá a estruturar uma página de documentação de autenticação que seja clara, segura e fácil de usar. Uma boa página de autenticação é a porta de entrada para a sua API e um fator decisivo para a experiência do desenvolvedor.

### Pré-requisitos

-   Acesso ao painel de controle da sua plataforma para gerar chaves.
-   Conhecimento básico sobre requisições HTTP.

## Componentes Essenciais

Uma página de autenticação de alta qualidade deve sempre conter as seguintes seções:

- [x] Como obter as credenciais de acesso.
- [x] Exemplos claros de como usar as credenciais.
- [x] Um guia sobre as melhores práticas de segurança.

---

## 1. Como Obter as Credenciais

Esta seção deve ser um guia passo a passo, sem ambiguidades, que leva o usuário do login até a posse da chave de API.

1.  Faça login na sua conta e navegue até o **Painel do Desenvolvedor**.
2.  No menu lateral, clique em **Configurações > Chaves de API**.
3.  Clique no botão **Gerar Nova Chave Secreta**.
4.  Dê um nome descritivo à sua chave (ex: `Meu-App-Producao`).

> [!IMPORTANT]
> Sua chave de API secreta será exibida **apenas uma vez**. Copie-a e armazene-a em um local seguro, como um gerenciador de senhas ou uma variável de ambiente. Por motivos de segurança, não poderemos exibi-la novamente.

## 2. Como Usar as Credenciais

Demonstre como usar a chave de API em uma requisição real. Fornecer exemplos em múltiplas linguagens é uma das melhores práticas, e o uso de abas de código é a forma mais limpa de fazer isso.

<div class="code-tabs">

```bash
# O método mais comum é usar o cabeçalho `Authorization` com um Bearer Token.

curl "[https://api.exemplo.com/v1/users/me](https://api.exemplo.com/v1/users/me)" \
  -H "Authorization: Bearer SUA_CHAVE_DE_API"

import os
import requests

api_key = os.getenv("API_SECRET_KEY")
headers = {
    "Authorization": f"Bearer {api_key}"
}

response = requests.get("[https://api.exemplo.com/v1/users/me](https://api.exemplo.com/v1/users/me)", headers=headers)

print(response.json())

import axios from 'axios';

const apiKey = process.env.API_SECRET_KEY;

const config = {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
};

axios.get('[https://api.exemplo.com/v1/users/me](https://api.exemplo.com/v1/users/me)', config)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
  });

</div>
```

3. Melhores Práticas de Segurança
Educar seus usuários sobre segurança não apenas os protege, mas também protege sua plataforma.
> [!DANGER]
> Nunca exponha sua chave de API secreta em código front-end!
> Chaves expostas em código de navegador (JavaScript, etc.) ou em aplicativos móveis podem ser facilmente roubadas e usadas para esgotar sua cota e acessar seus dados. Todas as chamadas de API com chaves secretas devem ser feitas a partir de um servidor back-end.
> 
 * Use Variáveis de Ambiente: Carregue sua chave de API a partir de variáveis de ambiente (process.env.API_KEY) em seu servidor. Nunca as coloque diretamente no código.
 * Implemente Rotação de Chaves: Crie um processo para revogar chaves antigas e gerar novas periodicamente, ou sempre que um funcionário com acesso deixar a equipe.
> [!TIP]
> Crie chaves de API separadas para os ambientes de desenvolvimento e produção. Isso evita que testes afetem seus dados de produção e permite revogar uma chave sem derrubar todos os seus serviços.
> 
Próximos Passos
 * Agora que você sabe como se autenticar, aprenda a estruturar chamadas de API no nosso Guia de Referência de API.
