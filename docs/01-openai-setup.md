# Configurando a chave da OpenAI

## 1. Criar a chave

1. Acesse **https://platform.openai.com/api-keys** e faça login.
2. Antes de tudo, vá em **Settings → Billing** e adicione crédito. Chave sem crédito retorna `429 insufficient_quota`.
3. Em **Settings → Limits**, defina um **hard limit** mensal (ex.: `USD 50`). Isso é o freio real caso o agente entre em loop.
4. Volte em **API keys → Create new secret key**:
   - **Name:** `buscando-milhao-local`
   - **Project:** crie um projeto separado (não use o `Default`) — assim dá para revogar tudo sem derrubar outras integrações.
   - **Permissions:** `Restricted` → habilite apenas `Model capabilities: Write`.
5. Copie a chave **agora**. Ela só aparece uma vez.

## 2. Colocar no projeto

```bash
cp .env.example .env
```

Abra o `.env` e cole:

```
OPENAI_API_KEY=sk-proj-...
```

O `.env` já está no `.gitignore`. **Nunca** commite a chave, nem cole em issue, print ou vídeo.

## 3. Testar

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $(grep OPENAI_API_KEY .env | cut -d= -f2)" \
  | head -20
```

Se voltar JSON com uma lista de modelos, está funcionando.

## 4. Modelos

| Uso | Variável | Sugestão |
|---|---|---|
| Redação de DM, interpretação de resposta, decisão de próxima ação | `OPENAI_MODEL` | modelo raciocinador (qualidade) |
| Classificação de intenção, extração de campos, dedupe semântico | `OPENAI_MODEL_FAST` | modelo pequeno (custo) |

Fixe o nome exato do modelo no `.env` — não deixe alias flutuante em produção, senão a qualidade das mensagens muda sozinha da noite pro dia.

## 5. Controle de custo

- Toda chamada grava `model`, `prompt_tokens`, `completion_tokens` e custo estimado na tabela `ai_calls`.
- O worker consulta `OPENAI_MONTHLY_BUDGET_USD` antes de cada chamada e **pausa o sistema** ao atingir o teto.
- O painel mostra custo por lead e custo por cliente ativo — sem isso não dá pra saber se a automação dá lucro.

## Se a chave vazar

1. **https://platform.openai.com/api-keys** → `Revoke` na chave comprometida.
2. Gere outra, atualize o `.env`.
3. Se foi commitada: revogar resolve o risco. Reescrever o histórico do Git é secundário.
