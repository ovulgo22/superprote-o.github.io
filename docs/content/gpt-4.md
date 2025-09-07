## GPT-4

O GPT-4 é nosso modelo de linguagem mais poderoso e capaz. Ele se destaca em tarefas que exigem raciocínio complexo, compreensão profunda de nuances e criatividade avançada. É a escolha ideal para aplicações de chat sofisticadas, análise de documentos complexos e geração de código de alta qualidade.

### Parâmetros da Requisição

Além do `model` e das `messages`, você pode customizar o comportamento do modelo com os seguintes parâmetros:

| Parâmetro       | Tipo    | Descrição                                                                                                       | Padrão  |
|-----------------|---------|-----------------------------------------------------------------------------------------------------------------|---------|
| `temperature`   | `float` | Controla a aleatoriedade da resposta. Valores mais altos (ex: 0.8) tornam a saída mais criativa e diversa; valores mais baixos (ex: 0.2) a tornam mais focada e determinística. | 0.7     |
| `max_tokens`    | `integer` | O número máximo de tokens a serem gerados na resposta.                                                           | 4096    |
| `top_p`         | `float` | Uma alternativa ao `temperature`. O modelo considera apenas os tokens que compõem a massa de probabilidade `top_p`. | 1.0     |
| `stream`        | `boolean` | Se `true`, a resposta será enviada em pedaços (streaming), como no ChatGPT. Ideal para interfaces interativas.   | `false` |

### Exemplo de Requisição Avançada (Node.js)

Este exemplo usa `temperature` baixo para uma resposta mais previsível e define um limite de tokens.

```javascript
const axios = require('axios');

const data = {
  model: "gpt-4",
  messages: [
    { role: "system", content: "Você é um especialista em história mundial." },
    { role: "user", content: "Descreva o impacto da invenção da prensa de Gutenberg em três pontos principais." }
  ],
  temperature: 0.3,
  max_tokens: 200
};

const config = {
  headers: {
    'Authorization': `Bearer ${process.env.SUPERPRO_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

axios.post('[https://api.superprotecnico.com/v1/chat/completions](https://api.superprotecnico.com/v1/chat/completions)', data, config)
  .then(response => {
    console.log(response.data.choices[0].message.content);
  })
  .catch(error => {
    console.error('Erro:', error.response.data);
  });
