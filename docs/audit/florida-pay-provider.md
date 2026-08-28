# Florida Pay — proprietário técnico e cobertura disponível

Última validação: 27/08/2026 17:10 EDT

## Conclusão executiva

**Dunnas Tecnologia é o único fornecedor com evidência operacional direta encontrada para o Florida Club/Florida Pay.**

Evidências:

1. A memória oficial do projeto identifica Dunnas Tecnologia como fornecedor dos dois aplicativos.
2. O Vault possui a referência `frc-floridaclub-dunnas-api-key`.
3. Existe uma automação ativa chamada `florida-club-dunnas-sync`.
4. A automação lê os caminhos `/clientes`, `/pedidos` e `/cotas`.
5. Existem três espelhos correspondentes no Supabase.

As referências históricas a PayPix, Bankei e C9 Tech não vieram acompanhadas de credencial, automação, tabela ou endpoint ativo na auditoria atual. Portanto, não são tratadas como fonte oficial.

## Dados observados

| Área | Evidência atual | Estado |
|---|---|---|
| Clientes | `/clientes` + `florida_club_dunnas_clientes` | 30 registros |
| Pedidos | `/pedidos` + `florida_club_dunnas_pedidos` | 15 registros |
| Cotas | `/cotas` + `florida_club_dunnas_cotas` | 0 registros |

Último sincronismo visível de clientes e pedidos: 21/08/2026 22:41 UTC. Isso significa que o espelho não pode ser considerado atualizado sem testar a API real.

## Cobertura por ação

| Ação necessária | Fonte confirmada hoje | Cobertura |
|---|---|---|
| Localizar cliente | Dunnas `/clientes` | Parcialmente confirmada |
| Verificar identidade/KYC | Não encontrada | Indisponível |
| Ver status da conta Florida Pay | Não encontrada | Indisponível |
| Ver status do cartão | Não encontrada | Indisponível |
| Ver status do PIX | Não encontrada | Indisponível |
| Ver cashback da cota | Não encontrada | Indisponível |
| Ver pedido Florida Club | Dunnas `/pedidos` | Parcialmente confirmada |
| Ver cota Florida Club | Dunnas `/cotas` | Endpoint existe; nenhuma cota atual |

## Regra para o primeiro piloto

Enquanto os endpoints de conta não forem documentados, o agente poderá:

1. Explicar o Florida Pay com as informações públicas aprovadas.
2. Enviar o link oficial de abertura somente após aprovação do piloto.
3. Registrar `signup_started` quando o próprio cliente confirmar que iniciou.
4. Manter KYC, conta, cartão, PIX e cashback como `unavailable`.

O agente não poderá afirmar que uma conta foi aprovada nem consultar documentos, saldo ou informações financeiras.

## Próxima prova necessária

Abrir o painel técnico da Dunnas ou receber a documentação oficial do Florida Pay e testar uma única conta interna de leitura. Nenhuma criação de conta ou movimentação financeira faz parte desse teste.
