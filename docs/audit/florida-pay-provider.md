# Florida Pay — proprietário técnico e cobertura disponível

Última validação: 28/08/2026 10:25 EDT

## Conclusão executiva

**A política oficial identifica a operação do produto como FPR Serviços Digitais Ltda e a hospedagem técnica aponta para Dunnas Tecnologia. A instituição financeira/BaaS responsável por PIX, cartão e cripto ainda não é identificada nas fontes disponíveis.**

Evidências:

1. A memória oficial do projeto identifica Dunnas Tecnologia como fornecedor dos dois aplicativos.
2. O Vault possui a referência `frc-floridaclub-dunnas-api-key`.
3. Existe uma automação ativa chamada `florida-club-dunnas-sync`.
4. A automação lê os caminhos `/clientes`, `/pedidos` e `/cotas`.
5. Existem três espelhos correspondentes no Supabase.
6. A ficha pública atual do Google Play identifica o aplicativo `com.fprapp`, marca “Florida Rental Car” e pessoa jurídica desenvolvedora `EDGE GLOBAL SERVICOS ESPECIALIZADOS EM ADMINISTRACAO DE EMPRESAS LTDA`.
7. A ficha pública promete PIX, criptoativos, cartão pré-pago e cadastro com verificação de identidade, mas não identifica a instituição financeira/BaaS que executa essas operações.
8. O link oficial de privacidade da loja aponta para o domínio `sistema.floridaclub.dunnastecnologia.com.br`, confirmando Dunnas como plataforma técnica do aplicativo.
9. A política identifica a Florida Pay como operada por **FPR Serviços Digitais Ltda**, CNPJ `59.971.035/0001-10`, sem nomear o parceiro regulado que liquida PIX, cartão ou cripto.

As referências históricas a PayPix, Bankei e C9 Tech não vieram acompanhadas de credencial, automação, tabela ou endpoint ativo na auditoria atual. O Vault também não possui credencial com esses nomes. Portanto, nenhuma delas é tratada como fonte oficial.

## Dados observados

| Área | Evidência atual | Estado |
|---|---|---|
| Clientes | `/clientes` + `florida_club_dunnas_clientes` | 30 registros |
| Pedidos | `/pedidos` + `florida_club_dunnas_pedidos` | 15 registros |
| Cotas | `/cotas` + `florida_club_dunnas_cotas` | 0 registros |

Último sincronismo visível de clientes e pedidos: 21/08/2026 22:41 UTC. Em 28/08/2026 o espelho continuava com 30 clientes, 15 pedidos e 0 cotas. Isso significa que ele não pode ser usado como confirmação atual de conta ou produto financeiro.

## Cobertura por ação

| Ação necessária | Fonte confirmada hoje | Cobertura |
|---|---|---|
| Localizar cliente | Dunnas `/clientes` | Parcialmente confirmada |
| Responsável pela operação do produto | Política oficial — FPR Serviços Digitais Ltda | Confirmado documentalmente |
| Plataforma técnica | Domínio oficial Dunnas + API existente | Confirmada |
| Instituição financeira/BaaS | Não identificada | Indisponível |
| Verificar identidade/KYC | API não encontrada | Indisponível |
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

Obter com a FPR Serviços Digitais Ltda/Dunnas o nome da instituição financeira/BaaS, a documentação oficial e uma credencial somente leitura para uma conta interna de teste. A hospedagem Dunnas e a política comprovam a plataforma e a operadora do produto, mas não provam quem liquida KYC, conta, cartão, PIX ou cripto. Nenhuma criação de conta ou movimentação financeira faz parte desse teste.
