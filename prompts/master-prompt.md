# Prompt mestre — sistema comercial autônomo no Instagram

> Antes de rodar: copie `config/business.example.json` para `config/business.json` e substitua todos os `{{PLACEHOLDERS}}`. O agente lê esse arquivo — nenhum dado real deve ser colado neste prompt.

---

## Papel

Atue como tech lead, engenheiro de produto e especialista em agentes de IA e automação comercial.

Construa um sistema local, completo e funcional, que automatize a prospecção da **{{COMPANY_NAME}}** no Instagram.

Não entregue plano, protótipo ou CRM estático. Implemente, teste e demonstre o fluxo rodando com evidência.

---

## Objetivo

Um sistema que opere sozinho neste ciclo, sem "continue" e sem aprovação mensagem a mensagem:

**Observar → Decidir → Agir → Medir → Aprender → Adaptar**

Autonomia total dentro dos limites configurados em `.env` e no painel. Fora deles, o sistema pausa e chama o operador.

---

## Contexto comercial

Tudo vem de `config/business.json`:

| Campo | Uso |
|---|---|
| `identity.owner_name` | Quem assina as mensagens |
| `identity.company_name` / `company_website` | Empresa e fonte de verdade |
| `identity.instagram_handle` | Conta que prospecta |
| `handoff.whatsapp_link` | Destino do lojista interessado |
| `handoff.affiliate_group_link` | Destino do influenciador interessado |
| `offer.*` | Proposta de valor, funcionamento, modelo de receita, jargão do nicho |

### Regra de afirmações

A IA só pode enviar o que está em `verified_claims`.

Tudo em `unverified_claims` fica bloqueado até ser comprovado no site ou em material oficial. Sem exceção, sem paráfrase.

A IA nunca inventa taxa, condição, garantia, relação societária ou superlativo. Nunca promete aprovação de conta nem resultado financeiro. Onboarding segue as regras de cadastro, KYC, KYB e PLD da empresa.

---

## Funil A — clientes

**Público:** os segmentos e sinais definidos em `icp_customers`, mais os novos padrões que os dados de conversão revelarem.

**Sinais públicos analisados:** nome, @, bio, categoria, publicações, hashtags, localização, perfis relacionados, seguidores e interações públicas.

**Fluxo:**

1. Descobrir o perfil.
2. Checar duplicidade, bloqueio e lista de não contato.
3. Pontuar aderência ao ICP e identificar se é loja, funcionário, dono ou decisor.
4. Definir prioridade e melhor janela de envio.
5. Gerar abertura curta, pessoal e verdadeira, baseada no conteúdo real do perfil.
6. Enviar a primeira DM **pelo navegador**.
7. Aguardar resposta.
8. Migrar para a API oficial assim que a resposta chegar.
9. Apresentar `owner_name` e a empresa no momento certo.
10. Entender a necessidade, tratar objeção.
11. Encaminhar ao WhatsApp.
12. Acompanhar cadastro e ativação quando o dado existir.

Deve parecer conversa pessoal, não campanha. Nunca fingir ser cliente nem usar informação falsa para arrancar resposta.

## Funil B — afiliados

**Público:** os temas de `icp_affiliates`, avaliados por relevância temática, idioma, geografia, qualidade de conteúdo, engajamento real e compatibilidade de audiência.

**Fluxo:** descobrir → qualificar → abordar pelo navegador com contexto real do perfil → migrar para API na resposta → apresentar o programa → explicar link individual e remuneração (só o que está verificado) → encaminhar ao grupo → medir entrada, ativação, indicações e clientes gerados.

Otimizar para afiliado que **gera cliente ativo**, não para entrada no grupo.

---

## Arquitetura de canais

### Etapa 1 — Navegador (primeiro contato)

A API oficial não abre conversa fria. Então a primeira DM sai pelo Chrome real do operador, com sessão logada por ele uma única vez. Setup completo em [`docs/02-browser-session.md`](../docs/02-browser-session.md).

Requisitos:

- Playwright conectado por CDP (`chromium.connectOverCDP`) ao Chrome já em execução.
- Perfil dedicado (`CHROME_PROFILE_DIR`), separado do perfil pessoal.
- Aba própria do agente. Nunca adotar aba do usuário, nunca chamar `bringToFront()`, nunca tomar mouse ou teclado.
- Restrito ao domínio do Instagram.
- Um mutex garante uma job de navegador por vez.
- Ritmo humano por **saúde da conta**: `MAX_DMS_PER_DAY`, intervalo aleatório entre envios, janela de horário, aquecimento gradual.
- Ao enviar: registrar mensagem, horário, variante e resultado no CRM; marcar `waiting_inbound_reply`.
- Falhou? Salvar screenshot, snapshot de acessibilidade, URL, erros de console, falhas de rede, job id.

Preferir snapshot de acessibilidade e referências estáveis a seletor CSS frágil. Nada de comando de chat livre como camada de produção: o worker emite ações estruturadas e valida cada resultado.

Proibido: forjar fingerprint, mascarar automação, usar API privada, contornar restrição.

### Etapa 2 — API oficial (continuação)

Webhook oficial da Meta recebe as mensagens novas. Handoff:

```
navegador envia 1ª DM
  → CRM registra e aguarda
    → lead responde
      → webhook da Meta recebe
        → sistema casa o ID da Meta com o lead
          → propriedade do canal passa para a API
            → IA interpreta e responde pela API oficial
```

Depois do handoff o navegador **não responde mais aquele fio**. A trava de propriedade de canal impede envio simultâneo.

Antes de cada envio pela API, verificar: permissões, elegibilidade do destinatário, janela de mensageria, estado da conversa, pedido de remoção e propriedade atual do canal.

API não autorizada, webhook fora do ar ou janela expirada → **não** tentar contornar pelo navegador. Registrar o motivo e mandar para a fila de exceções.

### Etapa 3 — WhatsApp

Lojista interessado → `handoff.whatsapp_link`. Influenciador interessado → `handoff.affiliate_group_link`. Havendo WhatsApp Business, respeitar opt-in, templates e janelas.

---

## Motor de conversação (OpenAI)

Chave e modelos em [`docs/01-openai-setup.md`](01-openai-setup.md). `OPENAI_MODEL` para redação e decisão; `OPENAI_MODEL_FAST` para classificação e extração.

Contexto de cada chamada: informações públicas do perfil, tipo e nicho do lead, histórico completo, etapa do funil, experimentos anteriores e `verified_claims`.

**Intenções:** `interested`, `asked_info`, `asked_pricing`, `wants_whatsapp`, `not_the_owner`, `will_forward`, `objection`, `not_interested`, `opt_out`, `ambiguous`, `needs_human`.

**Ações:** responder, perguntar, apresentar, tratar objeção, encaminhar ao WhatsApp, aguardar, agendar follow-up, encerrar, escalar para humano.

Pedido de parar é atendido na hora e o perfil entra em `do_not_contact` — permanente, sem follow-up, sem reentrada por outra campanha.

Toda chamada grava tokens e custo em `ai_calls`. Ao bater `OPENAI_MONTHLY_BUDGET_USD`, o sistema pausa.

---

## Otimização contínua

Cada ação gera um evento estruturado. Medir conversão por nicho, palavra-chave, origem, loja vs. dono, características do perfil, horário, mensagem inicial, apresentação, proposta de valor, CTA, cadência de follow-up e modelo usado.

**Prioridade de resultado — clientes:** cliente ativo → volume transacionado → cadastro → encaminhamento qualificado → interesse → resposta.

**Afiliados:** clientes ativos indicados → volume gerado → afiliado ativo → entrada no grupo → interesse → resposta.

Experimentos: uma variável por vez, distribuição controlada, grupo de controle, tamanho de amostra registrado, sem declarar vencedor cedo, aumento gradual da variante campeã e uma fatia sempre explorando hipótese nova. Toda estratégia comparável e reversível.

A IA pode alterar sozinha prompts, critérios, pontuações e horários dentro dos limites aprovados. Mudança de código é testada à parte, tem rollback, e exige revisão humana quando toca regra financeira, alegação comercial, segurança ou limite operacional.

---

## CRM e painel

Dashboard geral · Kanban separado por funil · cadastro e timeline do lead · origem, nicho, tags e score · estado do funil e do canal · próxima ação · follow-ups vencidos · fila de jobs · experimentos e comparação de variantes · métricas de conversão · log de decisões da IA · fila de exceções · alertas de integração · configuração dos limites · botão de pausa geral · atalhos para Instagram, WhatsApp e grupo.

A prospecção fica separada das conversas pessoais do Instagram.

### Estados

Valores internos em inglês, interface traduzida.

**Pipeline de clientes:** `discovered` (Descoberto) · `qualified` (Qualificado) · `contacted` (Abordado) · `replied` (Respondeu) · `interested` (Interessado) · `whatsapp_handoff` (Encaminhado ao WhatsApp) · `registered` (Cadastrado) · `active_customer` (Cliente ativo) · `closed` (Encerrado)

**Pipeline de afiliados:** `discovered` · `qualified` · `contacted` · `replied` · `interested` · `joined_affiliate_group` (Entrou no grupo) · `active_affiliate` (Afiliado ativo) · `generated_customer` (Gerou cliente) · `closed`

**Canal:** `browser_contact_pending` · `browser_contact_sent` · `waiting_inbound_reply` · `api_eligible` · `api_active` · `api_window_closed` · `human_review_required` · `do_not_contact` · `blocked` · `completed`

Pipeline e canal são campos separados.

---

## Stack

Next.js (App Router) · React · TypeScript `strict` · Tailwind · SQLite · Drizzle ORM com migrações · Node.js 24 LTS · pnpm · Playwright (CDP) · SDK oficial da OpenAI.

Versões estáveis, fixadas no lockfile. Sem alpha, beta, RC ou canary sem necessidade comprovada. Roda como app Node.js local — SQLite não vai para serverless com disco efêmero.

### Idioma

**Interface em PT-BR:** menus, botões, títulos, formulários, validações, alertas, notificações, estados vazios, status, datas, números, textos de acessibilidade e mensagens de erro do operador.

**Código em inglês:** diretórios, arquivos, variáveis, funções, componentes, hooks, tipos, tabelas, colunas, status internos, rotas, payloads, logs, testes, comentários, documentação técnica e commits.

Doc de dev em inglês. Manual do operador em português.

---

## Arquitetura de software

Modular monolith. Sem microservices, sem packages separados, sem interface com implementação única, sem abstração especulativa.

```
src/app                      painel Next.js
src/features/leads
src/features/conversations
src/features/campaigns
src/features/experiments
src/features/affiliates
src/integrations/instagram   API oficial + webhook
src/integrations/browser     Playwright via CDP
src/integrations/openai
src/integrations/whatsapp
src/db                       schema, migrações, queries
src/worker                   jobs duráveis e agendadas
src/lib
```

Server Components por padrão · Client Components só onde há interação real · Server Actions para mutação da UI · Route Handlers para webhook · módulos `server-only` para banco e credencial · worker local · tabela de jobs no SQLite no lugar de Redis.

Painel e worker no mesmo repositório, com **um comando único documentado** para subir os dois.

### SQLite

Migrações versionadas · foreign keys · unique constraints · transação nas mudanças críticas · WAL · busy timeout · timestamps em UTC · caminho configurável · backup automático · procedimento de restauração testado · unicidade que impede lead e mensagem duplicados.

SQLite é a fonte única de verdade do MVP. Nada de PostgreSQL, Redis, Elasticsearch ou fila externa. Migrar para PostgreSQL só quando houver várias máquinas, deploy remoto ou concorrência incompatível.

### Clean Code

Funções pequenas · nomes explícitos · retorno antecipado · regra de negócio sem duplicata · sem `any` · sem erro engolido · sem código morto · sem abstração especulativa · composição em vez de hierarquia · separação entre regra, persistência, interface e integração · transição de estado atômica e auditável · validação nos limites de confiança.

Sem Clean Architecture cerimonial de camada vazia.

---

## Segurança e confiabilidade

Validação de env · segredo fora do Git · estado do navegador criptografado · verificação de assinatura do webhook · log estruturado sem token ou senha · idempotência de webhook e job · retry com limite · dead-letter · audit log · circuit breaker · pausa geral · recuperação após reinício · bloqueio de envio duplicado.

Pausa automática diante de: alerta ou restrição do Instagram, perda de sessão, crescimento anormal de erro, mensagem duplicada, aumento de bloqueio ou opt-out, divergência entre navegador/API/CRM, comportamento inesperado da IA, estouro de orçamento da OpenAI.

---

## Testes

Cobrir: dedupe de lead · transição de pipeline · transição de canal · primeiro contato pelo navegador · handoff navegador → webhook → API · trava de envio duplicado · idempotência de webhook · follow-up · atribuição de experimento · recuperação após reinício · expiração da janela da API · lista de não contato · circuit breaker · corte por orçamento.

Navegador em três níveis: (1) local com páginas e APIs simuladas; (2) dry-run real com o envio final bloqueado; (3) smoke test real e limitado, **só após autorização explícita**.

Antes de concluir: lint, type check, testes, production build e um fluxo end-to-end.

---

## Ordem de execução

1. Inspecionar o projeto e reaproveitar o que existir.
2. Ler `config/business.json` e o site da empresa.
3. Validar as limitações atuais nas fontes oficiais da Meta.
4. Definir a arquitetura mínima.
5. Banco, migrações e estados.
6. CRM em PT-BR.
7. Worker e jobs duráveis.
8. Integração Playwright/CDP.
9. Descoberta e primeiro contato.
10. Webhook e API oficial.
11. Trava e handoff de canal.
12. Os dois funis.
13. Motor de conversação com OpenAI.
14. Experimentos e otimização.
15. Segurança, observabilidade e recuperação.
16. Simulação → dry-run → autorização → piloto limitado → autonomia.

Faltou credencial? Continue tudo que não depende dela e reporte só o bloqueio exato quando chegar nele. Não pare o projeto porque um site caiu.

---

## Critérios de aceite

Concluído só quando demonstrar, com evidência:

1. Sobe local com um comando.
2. Frontend 100% PT-BR.
3. Código, banco, status e doc técnica em inglês.
4. Descoberta e cadastro sem duplicidade.
5. Primeira DM enviada pelo Chrome real sem interferir no uso do computador.
6. Resposta recebida pelo webhook.
7. Conversa continua pela API oficial.
8. Zero envio duplicado entre navegador e API.
9. Resposta interpretada e próxima ação decidida sozinha.
10. Os dois funis funcionando.
11. Encaminhamento correto ao WhatsApp.
12. Teste A/B registrado e medido.
13. Estratégia ajustada pelos resultados.
14. Recuperação correta após reinício.
15. Pausa automática em situação de risco.
16. Custo de IA por lead e por cliente visível no painel.
17. Histórico completo e auditável no CRM.
18. Lint, type check, testes e build aprovados.

Código escrito não é sucesso. Mostre cada fluxo crítico funcionando.
