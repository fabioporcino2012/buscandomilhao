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
- Existe uma automação Z-API antiga de finanças pessoais ligada ao mesmo número/instância. A função continua publicada, mas não registrou mensagens nos últimos 7 dias. Essa sobreposição precisa ser isolada antes de ativar o atendimento comercial, para impedir que uma conversa de cliente seja tratada como conversa pessoal.

### 2.4 Instagram

- Perfil exclusivo encontrado e confirmado: **@floridacluboficial** — https://www.instagram.com/floridacluboficial/
- Leitura pública em 27/08/2026: 49 publicações e 292 seguidores.
- Posicionamento atual: “Florida Club | Seu Clube de Benefícios”. A bio fala em experiências, descontos e vantagens e aponta para o Florida Black. Esse posicionamento é anterior à nova esteira Pay → Club → Black e precisa ser revisado antes do lançamento.
- A Meta atualmente oferece acesso confirmado a `@floridarentalcar`, `@floridaplus` e `@floridarentalcarlatino` pelo usuário técnico principal.
- O Instagram dedicado do Florida Club não apareceu entre os ativos acessíveis na auditoria da API. Ele existe publicamente, mas ainda precisa ser conectado à página, ao portfólio Meta e ao usuário técnico corretos antes de automatizar sua caixa de entrada.
- A confirmação de segurança da conta da Crislany foi concluída em 27/08/2026. O portfólio empresarial abriu normalmente e confirmou que o `@floridacluboficial` ainda não está entre os ativos conectados. A janela oficial de login do Instagram ficou aberta para a entrada humana no perfil correto; nenhuma senha ou código foi registrado.
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
- A API pública do n8n retornou 401 na auditoria atual. Os webhooks podem continuar funcionando, mas o acesso administrativo da API precisa ser renovado para inspecionar e corrigir os workflows.

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

1. Conectar o Instagram `@floridacluboficial` à página, ao portfólio Meta e ao usuário técnico corretos.
2. Identificar o operador e a documentação/API canônica do Florida Pay.
3. Isolar o número 3309 da automação antiga de finanças pessoais.
4. Renovar o acesso administrativo da API do n8n.
5. Definir o catálogo ativo e o preço oficial do Florida Black.
6. Definir qual agenda e qual pessoa recebem reuniões qualificadas das cotas.

Essas pendências não impedem a revisão do prompt. Elas viram tarefas obrigatórias da primeira fase de execução.
