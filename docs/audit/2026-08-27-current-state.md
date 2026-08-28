# Diagnóstico — Esteira Florida Pay → Florida Club → Florida Black

Data da auditoria: 27/08/2026 (EDT)

## 1. Decisão de negócio

A operação será uma esteira comercial única com três produtos complementares:

1. **Florida Pay — porta de entrada:** abrir a conta digital, passar pela verificação de identidade e preparar a próxima viagem.
2. **Florida Club — produto principal:** adquirir uma cota de veículo e escolher entre 10 diárias anuais ou cashback anual de 14% sobre o valor da cota quando as diárias não forem utilizadas.
3. **Florida Black — continuidade:** produto digital de conteúdo, concierge, comunidade e benefícios para manter relacionamento e recorrência.

O cliente terá um único histórico. O sistema decidirá qual produto apresentar conforme o momento da jornada.

## 2. Ativos confirmados

### 2.1 Florida Pay

- Aplicativo publicado para Android e iOS.
- A listagem pública apresenta: abertura digital de conta, verificação de identidade, PIX, compra e venda de criptoativos e cartão pré-pago.
- O aplicativo Android tem mais de 50 downloads na ficha pública auditada.
- O fornecedor/aplicação aparenta operar na infraestrutura Dunnas; a documentação interna também cita PayPix, Bankei e C9 Tech em momentos diferentes. O operador e a API canônicos ainda precisam ser identificados diretamente nas credenciais ou no painel do fornecedor.

### 2.2 Florida Club

- Site oficial ativo: https://www.floridaclub.com/
- Aplicativos publicados para Android e iOS.
- Planos publicados:
  - US$ 2.000 — Econômico — 10 diárias/ano — cashback anual US$ 280.
  - US$ 3.000 — SUV — 10 diárias/ano — cashback anual US$ 420.
  - US$ 5.000 — SUV Luxo — 10 diárias/ano — cashback anual US$ 700.
  - US$ 9.000 — Escalade — 10 diárias/ano — cashback anual US$ 1.260.
- Regra comercial confirmada por Fabinho: se o cotista não utilizar as 10 diárias, pode optar pelo cashback anual de 14% sobre o valor da cota.
- Funil Kommo oficial confirmado diretamente na API:
  - Pipeline: `Florida Club` — ID `13953440`.
  - Etapas: Incoming leads; Triagem; Qualificação; Agendamento de reunião; Oportunidade; Negociação; Documentação/Pagamento; três cadências; Oportunidade futura; Leads quentes; Venda ganha; Venda perdida.
- O pipeline foi reaproveitado de uma operação antiga. O histórico não pode ser considerado integralmente como base real do produto atual.
- A captura do site, o espelho do funil, o painel e automações n8n já existem.

### 2.3 WhatsApp Florida Club

- Número oficial: **+1 407-462-3309**.
- WABA: `1079795591041649`.
- Phone ID: `1309297265596025`.
- Nome aprovado: `Flórida Club`.
- Estado atual auditado na Meta: `CONNECTED`, verificado e qualidade `GREEN`.
- Dois modelos de mensagem estão aprovados:
  1. `fc_copy_condicao_especial_uudodu` — BLOQUEAR. O texto afirma que 100% do valor retorna, o que conflita com a regra comercial confirmada.
  2. `fc_chamada_de_video_4hxtev` — pode servir como base, mas ainda precisa passar pela revisão final do novo sistema.
- A arquitetura aprovada para a operação não usa Z-API: WhatsApp oficial + Kommo são os únicos caminhos comerciais. Qualquer automação antiga não comercial precisa permanecer tecnicamente incapaz de responder.
- A consulta ao WABA em 28/08/2026 retornou `subscribed_apps = []`. Portanto nenhum aplicativo está inscrito para receber os eventos do número 3309; o canal continua bloqueado para automação.

### 2.4 Instagram

- Perfil exclusivo encontrado e confirmado: **@floridacluboficial** — https://www.instagram.com/floridacluboficial/
- Leitura pública em 27/08/2026: 49 publicações e 292 seguidores.
- Posicionamento atual: “Florida Club | Seu Clube de Benefícios”. A bio fala em experiências, descontos e vantagens e aponta para o Florida Black. Esse posicionamento é anterior à nova esteira Pay → Club → Black e precisa ser revisado antes do lançamento.
- A Meta atualmente oferece acesso confirmado a `@floridarentalcar`, `@floridaplus` e `@floridarentalcarlatino` pelo usuário técnico principal.
- O Instagram dedicado foi conectado à BM01, Página, conta de anúncios e usuário técnico. Leitura de perfil, mídia, comentários e insights foi comprovada; mensagens diretas continuam bloqueadas por falta da credencial/capacidade correta do aplicativo.
- O login humano e a vinculação empresarial foram concluídos sem registrar senha ou código.
- O Chrome será usado com perfil dedicado e modo de teste. Não será usado para esconder automação, contornar bloqueios ou interferir no Chrome pessoal.

Atualização 27/08/2026 17:06 EDT: o Chrome está autenticado no `@floridacluboficial`. Entretanto, uma nova leitura Graph v25 das páginas acessíveis pela credencial principal e pela credencial da Crislany ainda retornou apenas `@floridarentalcar`, `@floridaplus` e `@floridarentalcarlatino`. Portanto, o login foi confirmado, mas a vinculação empresarial/API ainda não foi comprovada.

### 2.5 Florida Black

- Plataforma: https://floridablack.lovable.app
- Repositório oficial: `fabioporcino2012/floridablack-c6bd13d2`.
- Estrutura existente: landing page, login, portal, conteúdo, comunidade, concierge com IA, pagamentos, créditos, loja e administração.
- Conteúdo legado importado: 24 módulos e mais de 200 itens na documentação auditada.
- A venda pública está suspensa na versão atual.
- Há preços diferentes em documentos históricos. O agente não poderá informar preço até ler um catálogo oficial marcado como ativo.
- O cashback interno da assinatura Florida Black é diferente do cashback de 14% das cotas. O sistema deve manter as duas regras separadas.

## 3. Situação dos dados em 27/08/2026

- A tabela de captação do Florida Club contém 9 leads identificados como oriundos do produto.
- Não há cota ativa confirmada na base operacional auditada.
- O painel do funil agrega milhares de registros históricos porque o pipeline foi reaproveitado. Esses contatos não podem ser chamados de leads reais do Florida Club sem uma marca de origem confiável.
- O sincronismo de gastos está atualizado, mas sem investimento registrado.
- O sincronismo do funil possui execuções recentes incompletas ou com erro. Antes de ativar a esteira autônoma será necessário reparar o fluxo já existente, sem criar outro robô duplicado.
- A API administrativa do n8n voltou a responder. Foram encontrados 82 workflows, 61 ativos, incluindo três fluxos ativos do Florida Club e uma duplicata antiga inativa. A execução mais recente do sincronismo do funil falhou com 503, enquanto a anterior terminou com sucesso.

## 4. Inconsistências que precisam ser corrigidas

1. O site usa 8,4% em uma simulação e 14% nos planos.
2. O site informa “restam 850 de 1.000 cotas”, mas a base auditada não comprova 150 cotas vendidas.
3. O site usa “Cartão Florida Black”; o aplicativo Florida Pay usa “Florida Club Card”.
4. O site fala em “rende”, “patrimônio” e “dono de uma fração”, enquanto a decisão comercial atual é divulgar a alternativa como cashback pelo não uso das diárias.
5. Os links de Termos, Privacidade e lojas de aplicativos do site precisam ser confirmados; na auditoria anterior alguns estavam apontando para `#`.
6. O modelo aprovado do WhatsApp promete devolução de 100% e precisa ser substituído.
7. O pipeline mistura histórico antigo com o produto atual.
8. O mesmo número 3309 aparece em uma automação antiga não comercial.
9. O Instagram `@floridacluboficial` existe, mas não está visível no acesso técnico atual e mantém o posicionamento antigo de clube de benefícios.

## 5. Arquitetura recomendada

### Entrada

- Site Florida Club.
- Site/landing Florida Pay.
- Instagram FRC e, depois, Instagram Florida Club.
- WhatsApp oficial 3309.
- Base FRC com origem e permissão válidas.

### Inteligência central

- Identifica a pessoa pelo telefone, e-mail e IDs dos canais.
- Evita cadastros e mensagens duplicadas.
- Mantém um único histórico no Kommo.
- Classifica o interesse atual: Pay, Club, Black ou combinado.
- Decide a próxima ação e o prazo.
- Responde dúvidas somente com informações aprovadas.
- Cria tarefas e movimenta o lead no Kommo pela API oficial, nunca alterando o espelho Supabase.

### Sequência

1. Convidar para abrir a conta Florida Pay.
2. Acompanhar download, cadastro, verificação e ativação.
3. Identificar frequência de viagem, interesse em veículos e capacidade de adquirir uma cota.
4. Apresentar Florida Club no momento adequado.
5. Explicar a escolha anual: 10 diárias ou cashback de 14% quando as diárias não forem usadas.
6. Encaminhar documentação, pagamento e contrato para o fluxo oficial.
7. Após a ativação, convidar para Florida Black.
8. Manter relacionamento por conteúdo, benefícios e concierge.

### Autonomia

Após um único aceite de ativação do piloto, o sistema poderá responder, qualificar, acompanhar, criar tarefas, atualizar o CRM e realizar follow-ups dentro dos limites aprovados. Contrato, mudança de preço, pagamento, regra de cashback, campanha em massa ou alteração financeira permanecem fora da autonomia.

## 6. Pendências principais para a implementação

1. Liberar mensagens do `@floridacluboficial` para o aplicativo técnico correto, preservando a vinculação empresarial já concluída.
2. Identificar o operador e a documentação/API canônica do Florida Pay.
3. Inscrever o aplicativo correto no WABA 3309 e comprovar que somente a API oficial responde.
4. Retirar credenciais embutidas dos três workflows ativos do Florida Club e tratar o erro 503 sem duplicar robôs.
5. Definir o catálogo ativo e o preço oficial do Florida Black.
6. Definir qual agenda e qual pessoa recebem reuniões qualificadas das cotas.

Essas pendências não impedem a revisão do prompt. Elas viram tarefas obrigatórias da primeira fase de execução.

## 7. Atualização operacional — 28/08/2026 (EDT)

1. O `@floridacluboficial` foi vinculado à Página `130061446866540`, à BM01 Florida Club `1045934536526205`, à conta CA01 e ao usuário técnico `FClub Automation`.
2. A leitura de perfil, mídia, comentários e insights foi confirmada. Mensagens diretas ainda não estão liberadas: a credencial atual não deriva o Page Access Token necessário e a API retorna bloqueio de capacidade/permissão.
3. A decisão final de canal é: **sem Z-API**. O WhatsApp 3309 opera por Kommo + API oficial; qualquer automação antiga deve ficar tecnicamente incapaz de responder.
4. Toda mensagem real da IA deve virar nota no lead do Kommo com texto exato, canal, ID externo e horários de Orlando e São Paulo.
5. Se o canal confirmar o envio e o Kommo falhar, a recuperação repete somente a gravação da nota. A mensagem não é enviada novamente.
6. A base central foi criada no Supabase principal com entrada idempotente, fila de saída protegida, descadastro global, saúde de integrações e segredos gerados dentro do Vault.
7. O freio geral de saídas nasceu pausado e foi confirmado ao vivo. O dashboard recebe apenas um resumo protegido; texto, telefone, destino e payload não são expostos.
8. As funções públicas de entrada e despacho foram publicadas com autenticação própria. Um evento técnico sem cliente foi aceito uma vez, a repetição foi reconhecida e o despacho sem credencial foi bloqueado com 401.
