# Isolamento do WhatsApp Florida Club 3309

Última validação: 27/08/2026 17:06 EDT

## Estado oficial na Meta

- WABA: `1079795591041649`
- Phone ID: `1309297265596025`
- Número: `+1 407-462-3309`
- Nome verificado: `Flórida Club`
- Conexão: `CONNECTED`
- Verificação: `VERIFIED`
- Nome: `APPROVED`
- Qualidade: `GREEN`

Leitura realizada pela Graph API v25 com a credencial técnica principal. Nenhuma mensagem foi enviada.

## Modelos disponíveis

1. `fc_copy_condicao_especial_uudodu` — aprovado pela Meta, bloqueado localmente porque promete que 100% do valor retorna.
2. `fc_chamada_de_video_4hxtev` — aprovado pela Meta, mantido como revisão obrigatória antes de qualquer piloto.

## Conflito encontrado

- A automação `zapi-claude-bot` permanece publicada e ativa na versão 43.
- O último registro em `zapi_messages` ocorreu em 20/08/2026 às 15:04:57 UTC.
- Registros nos últimos 7 dias: 0.
- Registros nos últimos 30 dias: 71.

Esses dados não provam que o webhook antigo ainda recebe mensagens hoje, mas provam que o caminho continua publicado. Até confirmar o proprietário atual do webhook e a coexistência Z-API/Meta, o estado operacional deve permanecer `blocked_conflicting_owners`.

## Regra de liberação

O envio externo só poderá sair do modo de simulação quando:

1. O webhook atualmente apontado no provedor do número for identificado.
2. Apenas um sistema tiver permissão para responder cada conversa.
3. O sistema antigo de finanças pessoais não puder responder clientes do Florida Club.
4. Uma mensagem de teste autorizada gerar exatamente um registro de saída e uma confirmação de entrega.

Nenhuma automação foi desativada nesta auditoria.
