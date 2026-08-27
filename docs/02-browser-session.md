# Navegador: usar a sua sessão real do Instagram

O primeiro contato **não** pode sair pela API oficial da Meta — ela não permite abrir conversa com quem nunca interagiu com a conta. Então a primeira DM sai por um navegador real, com uma sessão logada por você, uma única vez, na mão.

## Por que um perfil dedicado do Chrome

Um perfil separado (`.chrome-profile/`) resolve três coisas de uma vez:

- O agente nunca enxerga suas abas pessoais, e-mail, banco ou extensões.
- Sua janela normal do Chrome continua livre — o agente não rouba foco, mouse nem teclado.
- O Chrome 136+ **recusa** `--remote-debugging-port` no perfil padrão. Perfil dedicado não é preferência, é requisito.

> **Atenção de segurança:** a porta de debug dá controle total sobre a sessão logada nesse perfil. Mantenha em `127.0.0.1`, nunca em `0.0.0.0`, e não rode isso em máquina compartilhada. O diretório `.chrome-profile/` guarda seus cookies do Instagram — ele já está no `.gitignore` e não pode sair da sua máquina.

## 1. Subir o Chrome com debug

**macOS**

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --remote-debugging-address=127.0.0.1 \
  --user-data-dir="$PWD/.chrome-profile"
```

**Linux**

```bash
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir="$PWD/.chrome-profile"
```

**Windows (PowerShell)**

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir="$PWD\.chrome-profile"
```

## 2. Logar uma vez

Nessa janela que abriu, entre em `instagram.com`, faça login normalmente, resolva 2FA e marque "salvar login". Feito isso, a sessão fica persistida no perfil e sobrevive a reinício.

Verifique se o CDP respondeu:

```bash
curl -s http://127.0.0.1:9222/json/version
```

## 3. Conectar o agente

```ts
import { chromium } from 'playwright'

const browser = await chromium.connectOverCDP(process.env.CHROME_CDP_URL!)
const context = browser.contexts()[0]        // sessão já logada
const page = await context.newPage()          // aba própria do agente
await page.goto('https://www.instagram.com/direct/inbox/')
```

Regras que o código precisa respeitar:

- **Aba própria, sempre.** Nunca reaproveitar uma aba que você abriu.
- **Nunca chamar `bringToFront()`.** O agente trabalha em segundo plano.
- Uma tarefa por vez. Um `mutex` no worker impede duas jobs disputando a mesma aba.
- Fechar a aba ao fim da job, inclusive em erro (`try/finally`).
- Se `connectOverCDP` falhar, **não** abrir um Chrome novo por conta própria: registrar `browser_unavailable`, pausar a fila e avisar no painel.

## 4. Ritmo humano (saúde da conta)

Isso existe para não queimar a conta com rajada de DM, e é a mesma disciplina de um SDR humano — não é para esconder nada do Instagram:

| Controle | Valor inicial | Variável |
|---|---|---|
| DMs por dia | 30 | `MAX_DMS_PER_DAY` |
| Intervalo entre DMs | 90–240s, aleatório | `MIN/MAX_SECONDS_BETWEEN_DMS` |
| Janela de operação | 09:00–20:00 | `OPERATING_HOURS` |
| Aquecimento | 5/dia na 1ª semana, +5/semana | `warmup_schedule` |

Digitação com delay por caractere, pausa antes de enviar, e **nada de enviar em finais de semana no começo**.

O que o sistema não faz: forjar fingerprint, mascarar automação, usar API privada ou contornar bloqueio. Se o Instagram sinalizar restrição, o circuit breaker pausa tudo e chama você.

## 5. Depois da resposta, sai do navegador

Assim que o lead responde, o webhook da Meta assume a conversa e o navegador fica **proibido** de responder aquele fio. A trava de canal (`channel_state`) garante isso. Detalhe completo no [prompt mestre](../prompts/master-prompt.md).

## Playwright vs. agent-browser

`agent-browser` sobe navegador próprio — não serve aqui, porque a exigência é usar a **sua** sessão real. Playwright via CDP conecta no Chrome que já está rodando. Use `agent-browser` só para testes E2E do painel, onde a sessão não importa.
