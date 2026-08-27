# Reversão e pausa — Florida Ecosystem

## Acionamento imediato

1. Ativar “Pausar saídas” no painel.
2. Confirmar que novas entradas continuam sendo registradas.
3. Marcar jobs pendentes como bloqueados; não apagar histórico.
4. Manter opt-outs ativos em todos os produtos e canais.

## Canais

- Instagram: encerrar o worker do Chrome e preservar a sessão para auditoria.
- WhatsApp: bloquear a fila remota; não trocar webhook sem identificar o dono atual.
- Kommo: interromper gravações, mantendo apenas leituras via `kommo-proxy-v2`.
- n8n: manter o estado anterior dos workflows; qualquer workflow novo continua inativo.

## Banco e painel

- A migração e as Edge Functions não entram em produção antes do piloto.
- Se já implantadas, pausar o dispatcher; o webhook de entrada permanece ativo.
- Não apagar eventos, decisões ou falhas: são a trilha de auditoria.

## Critério de recuperação

Somente retomar saídas após provar: um dono por canal, identidade sem ambiguidade, consentimento ativo, integração saudável e ausência de duplicidade.
