# Validação n8n — Florida Club — 27/08/2026

## Resultado ao vivo

- API do n8n Hostinger: HTTP 200.
- Inventário total retornado: 81 workflows.
- Florida Club: 3 workflows ativos e 1 duplicata antiga inativa.
- `florida_club_funil_snapshot`: 6.797 registros; sincronização mais recente em 27/08/2026 17:01 EDT.
- `florida_club_leads`: 9 registros; lead mais recente em 14/08/2026 21:39 EDT.
- `florida_club_spend`: 144 registros; sincronização mais recente em 27/08/2026 04:00 EDT.

## O que está funcionando

- O sincronizador do funil executa a cada 30 minutos.
- As quatro execuções mais recentes retornadas pelo n8n terminaram com sucesso.
- As chamadas do Florida Club para o Kommo já apontam para `kommo-proxy-v2` e usam o prefixo obrigatório `/api/v4`.
- O sincronizador escreve no espelho `florida_club_funil_snapshot`, sem escrever no Kommo por meio do Supabase.

## Riscos confirmados

- Os três Code nodes ativos contêm literais com formato de credencial/JWT.
- O lead capture e o funil ainda não registram o conjunto operacional completo: `finished_at`, `ok`, `fetched`, `upserted` e `error`.
- O workflow de captura não retornou histórico pela API, então sua atividade precisa ser provada por um smoke test controlado.
- O cron de gasto usa `0 10 * * *` com timezone do workflow em `default`; o rótulo diz 07h BRT. O horário efetivo precisa ser fixado explicitamente antes de qualquer alteração.

## Proteções antes do reparo

1. Export estrutural sem segredos salvo em `n8n-florida-club-before.json`.
2. Nenhum workflow foi editado, ativado ou desativado nesta auditoria.
3. O teste real deverá usar um único lead identificado como teste.
4. Criação no Kommo somente via `kommo-proxy-v2`, rota `/api/v4/leads/complex`.
5. Após o teste: confirmar exatamente um evento local, um lead e um contato vinculados no Kommo.
6. A troca definitiva só ocorre depois de comparar lista de workflows ativos antes/depois.

## Próximo gate

Preparar a versão sem segredos e executar um smoke test de um lead. Esse passo cria dados reais no Kommo e precisa de confirmação específica no momento da execução.
