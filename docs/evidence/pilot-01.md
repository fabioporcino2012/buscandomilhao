# Evidência — Piloto 01

## Estado

`DRY-RUN CONCLUÍDO — ENVIO REAL PENDENTE DE CONFIRMAÇÃO`

## Dry-run aprovado

- Jornada simulada: Instagram → Florida Pay → Florida Club → Florida Black.
- Florida Black: lista de espera respeitada.
- Promessa de retorno de 100%: bloqueada.
- Evento duplicado: bloqueado após o primeiro processamento.
- Identidade ambígua: encaminhada para revisão humana.
- WhatsApp sem dono exclusivo: bloqueado.
- WhatsApp com saúde vermelha: bloqueado.
- Instagram com checkpoint/sessão vencida: pausado sem clicar em enviar.

## Smoke tests somente leitura

- WABA +1 407-462-3309: conectado, verificado e qualidade GREEN no momento da auditoria.
- Instagram: ativo comercial conectado à BM01, Página, CA01 e usuário técnico; leitura de perfil/mídia/comentários/insights confirmada. Mensagens diretas continuam bloqueadas até a credencial técnica correta ser comprovada.
- Florida Pay: Dunnas confirmado como fornecedor parcial; status KYC/conta/PIX não comprovados pela API atual.
- Florida Black: `vendas/suspensa = true`; nenhum checkout ativo confirmado.
- Kommo: fluxos Florida Club usam `kommo-proxy-v2` com `/api/v4`.

## Base central comprovada em produção — 28/08/2026

- Supabase principal: quatro tabelas operacionais, Vault, freio geral e resumo protegido do dashboard criados.
- Funções `fl-ecosystem-webhook` e `fl-ecosystem-dispatch`: ativas com autenticação própria.
- Evento técnico `codex-smoke-1787926041`: recebido uma única vez, marcado como concluído e sem cliente associado.
- Repetição do evento: reconhecida sem criar segunda ocorrência.
- Despacho sem credencial: bloqueado com HTTP 401.
- Freio geral: `outbound_paused = true`.
- Fila real de saída: zero mensagens enviadas.
- Leitura do resumo por conta autorizada: permitida.
- Leitura simulada por identidade sem permissão: bloqueada.

## A preencher após aprovação específica

- Destinatário de teste:
- Canal:
- Texto exato:
- Janela EDT:
- Janela BRT:
- ID do envio:
- ID do lead Kommo:
- Resultado:
- Confirmação de registro único:
- Estado final da pausa:
- Nota da mensagem no Kommo:
