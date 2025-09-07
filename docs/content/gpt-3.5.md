## GPT-3.5

O modelo GPT-3.5 Turbo é otimizado para velocidade e custo-benefício. Ele é ideal para uma ampla gama de tarefas de conversação e processamento de linguagem natural que não exigem o nível de raciocínio profundo do GPT-4.

É uma excelente escolha para chatbots de atendimento ao cliente, resumo de textos, classificação de conteúdo e outras aplicações em larga escala onde a rapidez da resposta é crucial.

### Principais Vantagens

- **Velocidade:** Respostas significativamente mais rápidas em comparação com o GPT-4.
- **Custo:** Mais econômico para processar grandes volumes de texto.
- **Capacidade:** Altamente competente na maioria das tarefas de linguagem, incluindo escrita, tradução e geração de código.

### Exemplo de Uso (Python)

```python
import os
import requests

api_key = os.getenv("SUPERPRO_API_KEY")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json",
}

json_data = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {
            "role": "user",
            "content": "Traduza a seguinte frase para o espanhol: 'Hello, how are you?'",
        },
    ],
}

response = requests.post(
    "[https://api.superprotecnico.com/v1/chat/completions](https://api.superprotecnico.com/v1/chat/completions)",
    headers=headers,
    json=json_data,
)

print(response.json()['choices'][0]['message']['content'])
# Saída esperada: 'Hola, ¿cómo estás?'
