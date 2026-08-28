# Instagram Florida Club — conexão e validação

Estado em 27/08/2026 17:07 EDT:

1. Perfil correto encontrado: `@floridacluboficial`.
2. Login do Instagram confirmado no Chrome.
3. O Meta informou que essa conta do Instagram ainda não está ligada a uma conta Facebook reconhecida.
4. A Graph API v25 ainda não retorna o perfil entre as páginas e contas acessíveis.
5. O envio pelo navegador permanece em `dry_run`.

## Critério para considerar conectado

A conexão só está concluída quando todas as provas abaixo existirem:

1. A conta aparecer em **Configurações do negócio → Contas do Instagram**.
2. Uma página Facebook correta estiver conectada ao perfil.
3. O usuário técnico principal tiver acesso ao ativo.
4. A Graph API retornar `id`, `username`, `name` e `media_count` do `@floridacluboficial`.
5. O sistema provar em teste que chega até o botão de envio sem clicar quando estiver em modo de simulação.

## Segurança do navegador

- Perfil do Chrome dedicado à operação.
- Controle local em `127.0.0.1`, nunca exposto na internet.
- Uma única sessão por vez.
- Checkpoint, desafio ou restrição pausa a fila.
- Instagram e API oficial não podem responder a mesma conversa.
- Qualquer ativação real exige piloto com destinatário e mensagem aprovados.
