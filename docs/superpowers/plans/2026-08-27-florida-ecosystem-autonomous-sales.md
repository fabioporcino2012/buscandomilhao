# Florida Ecosystem Autonomous Sales Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and validate one autonomous commercial journey that starts with Florida Pay, advances qualified customers to Florida Club quotas, and retains them through Florida Black.

**Architecture:** The `buscandomilhao` repository becomes the local operator control plane and Chrome worker. Kommo remains the commercial source of truth, the Meta Cloud API owns WhatsApp/Instagram delivery, existing n8n workflows are repaired instead of duplicated, and the FRC Supabase stores only system-owned events and operational state. The existing FRC dashboard receives the executive view after the local pilot is proven.

**Tech Stack:** Node.js 24 LTS, TypeScript strict, Next.js App Router, Tailwind, SQLite, Drizzle ORM, Vitest, Playwright over Chrome CDP, Anthropic SDK, Meta Graph v25, Kommo API through `kommo-proxy-v2`, Supabase Edge Functions, existing n8n Hostinger and dashboardfrc.

---

## File map

### Repository `buscandomilhao`

- `PROMPT.md` — approved business/system prompt.
- `docs/reference/PROMPT-ORIGINAL.md` — untouched source prompt from the original repository.
- `docs/audit/2026-08-27-current-state.md` — verified baseline and unresolved access items.
- `config/business.example.json` — public structure without credentials.
- `src/config/business.ts` — validated business configuration loader.
- `src/domain/claims.ts` — exact commercial claims and forbidden language.
- `src/domain/journey.ts` — Pay → Club → Black state machine.
- `src/domain/identity.ts` — deterministic identity matching and ambiguity handling.
- `src/domain/decision.ts` — next-action decision logic.
- `src/integrations/kommo/client.ts` — Kommo adapter through the mandatory proxy.
- `src/integrations/meta/client.ts` — Meta Graph read/write adapter with send guard.
- `src/integrations/florida-pay/client.ts` — provider discovery followed by the canonical read-only API adapter selected from evidence.
- `src/integrations/florida-black/client.ts` — Florida Black membership/catalog adapter.
- `src/integrations/browser/instagram.ts` — dedicated Chrome session, discovery and dry-run.
- `src/worker/jobs.ts` — durable local job processing.
- `src/worker/main.ts` — worker process.
- `src/app/` — PT-BR operator console.
- `src/db/` — local execution ledger schema and queries.
- `tests/` — unit, contract and integration tests.

### Repository `dashboardfrc` in an isolated worktree

- `supabase/migrations/20260827_fl_ecosystem_events.sql` — system-owned event/outbox tables.
- `supabase/functions/fl-ecosystem-webhook/index.ts` — Meta/web lead ingress with signature and dedupe.
- `supabase/functions/fl-ecosystem-dispatch/index.ts` — guarded outbound dispatch.
- `src/pages/FloridaClubPage.tsx` — executive journey and health tabs after pilot validation.
- `src/hooks/useFloridaEcosystem.ts` — typed reads for the dashboard.

### Existing services, modified only after backup

- n8n `FRC | Florida Club — Lead Capture (LP)` — repair and add visible error handling.
- n8n Florida Club funil sync — repair proxy routing and completion logging.
- Meta WABA Florida Club `1079795591041649` / phone `1309297265596025` — keep existing number and health.
- Instagram `@floridacluboficial` — connect to the correct Page/business/system user.

---

### Task 1: Preserve the approved prompt and verified baseline

**Files:**
- Modify: `PROMPT.md`
- Create: `docs/reference/PROMPT-ORIGINAL.md`
- Create: `docs/audit/2026-08-27-current-state.md`
- Modify: `README.md`

- [ ] **Step 1: Verify the approved prompt contains the exact journey and claims**

Run:

```bash
rg -n "Florida Pay|Florida Club|Florida Black|10 diárias|cashback anual de 14%|floridacluboficial|1309297265596025" PROMPT.md
```

Expected: every term appears. Any mention of 100% return appears only inside a prohibition, blocked-template note or negative acceptance test—never as an approved claim.

- [ ] **Step 2: Write the verified baseline**

Create `docs/audit/2026-08-27-current-state.md` with confirmed IDs, the Kommo stage map, Meta health, the Instagram profile, the n8n 401, the 3309/Z-API overlap, and a timestamp for every observation.

- [ ] **Step 3: Replace the generic README with the Florida project README**

The README must begin with:

```markdown
# Florida Ecosystem — Sistema Comercial Autônomo

Uma esteira única: Florida Pay → Florida Club → Florida Black.

Estado: desenho aprovado; execução em auditoria e dry-run; nenhum envio externo ativado.
```

- [ ] **Step 4: Scan for leaked credentials**

Run:

```bash
rg -n "(Bearer |Client-Token|service_role|sk-[A-Za-z0-9]|token/[A-F0-9]{10})" . --glob '!docs/reference/PROMPT-ORIGINAL.md' --glob '!docs/superpowers/plans/*.md'
```

Expected: zero matches containing a real credential.

- [ ] **Step 5: Commit the documentation baseline**

```bash
git add PROMPT.md README.md docs
git commit -m "docs: adapt autonomous sales prompt for Florida ecosystem"
```

---

### Task 2: Scaffold the local control plane

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `.env.example`
- Modify: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/worker/main.ts`

- [ ] **Step 1: Add a failing bootstrap test**

Create `tests/bootstrap.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { APP_NAME, JOURNEY_ORDER } from "../src/config/constants";

describe("bootstrap", () => {
  it("uses the approved Florida journey", () => {
    expect(APP_NAME).toBe("Florida Ecosystem");
    expect(JOURNEY_ORDER).toEqual(["florida_pay", "florida_club", "florida_black"]);
  });
});
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `pnpm vitest run tests/bootstrap.test.ts`

Expected: FAIL because `src/config/constants.ts` does not exist.

- [ ] **Step 3: Create the constants**

Create `src/config/constants.ts`:

```ts
export const APP_NAME = "Florida Ecosystem" as const;
export const JOURNEY_ORDER = ["florida_pay", "florida_club", "florida_black"] as const;
export type ProductKey = (typeof JOURNEY_ORDER)[number];
```

- [ ] **Step 4: Add scripts that start web and worker together**

`package.json` must expose:

```json
{
  "scripts": {
    "dev": "concurrently -k \"next dev\" \"tsx watch src/worker/main.ts\"",
    "build": "next build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "next lint"
  }
}
```

- [ ] **Step 5: Run verification**

Run: `pnpm test`

Expected: PASS.

Run: `pnpm typecheck`

Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json next.config.ts vitest.config.ts .env.example .gitignore src tests
git commit -m "feat: scaffold Florida ecosystem control plane"
```

---

### Task 3: Make business claims executable policy

**Files:**
- Create: `config/business.example.json`
- Create: `src/config/business.ts`
- Create: `src/domain/claims.ts`
- Create: `tests/claims.test.ts`

- [ ] **Step 1: Write failing claim tests**

```ts
import { describe, expect, it } from "vitest";
import { validateOutboundText } from "../src/domain/claims";

describe("validateOutboundText", () => {
  it("accepts the approved quota explanation", () => {
    const text = "A cota oferece 10 diárias por ano ou cashback anual de 14% quando as diárias não forem utilizadas, conforme o contrato vigente.";
    expect(validateOutboundText(text)).toEqual({ ok: true, violations: [] });
  });

  it.each([
    "100% do seu valor retorna",
    "rendimento garantido de 14%",
    "aprovação garantida no Florida Pay",
    "restam apenas 850 cotas"
  ])("blocks forbidden claim: %s", (text) => {
    expect(validateOutboundText(text).ok).toBe(false);
  });
});
```

- [ ] **Step 2: Confirm the test fails**

Run: `pnpm vitest run tests/claims.test.ts`

Expected: FAIL because the validator is missing.

- [ ] **Step 3: Implement the guard**

```ts
const forbidden = [
  /100% do (seu )?valor retorna/i,
  /rendimento garantido/i,
  /rentabilidade garantida/i,
  /aprova(?:ção|do) garantid/i,
  /restam apenas 850 cotas/i,
  /investimento garantido/i
] as const;

export function validateOutboundText(text: string) {
  const violations = forbidden.filter((rule) => rule.test(text)).map(String);
  return { ok: violations.length === 0, violations };
}
```

- [ ] **Step 4: Add structured offer values**

`config/business.example.json` must contain the four quota values and cashback amounts, the WABA/phone IDs, Kommo pipeline ID and `instagram_handle: "floridacluboficial"`. It must not contain tokens.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest run tests/claims.test.ts`

Expected: PASS.

```bash
git add config src/config src/domain tests/claims.test.ts
git commit -m "feat: enforce approved Florida commercial claims"
```

---

### Task 4: Implement the three-product journey state machine

**Files:**
- Create: `src/domain/journey.ts`
- Create: `src/domain/decision.ts`
- Create: `tests/journey.test.ts`

- [ ] **Step 1: Write failing journey tests**

```ts
import { describe, expect, it } from "vitest";
import { decideNextAction } from "../src/domain/decision";

describe("Florida journey", () => {
  it("starts with Pay", () => {
    expect(decideNextAction({ pay: "not_started", club: "unknown", black: "unknown" }))
      .toEqual({ action: "invite_pay_signup", product: "florida_pay" });
  });

  it("qualifies Club after Pay activation", () => {
    expect(decideNextAction({ pay: "active", club: "unknown", black: "unknown" }))
      .toEqual({ action: "qualify_club", product: "florida_club" });
  });

  it("invites Black after an active quota", () => {
    expect(decideNextAction({ pay: "active", club: "quota_active", black: "unknown" }))
      .toEqual({ action: "invite_black", product: "florida_black" });
  });
});
```

- [ ] **Step 2: Confirm failure**

Run: `pnpm vitest run tests/journey.test.ts`

Expected: FAIL because the decision module is missing.

- [ ] **Step 3: Implement explicit states and transitions**

Create `src/domain/journey.ts` with these exact public states:

```ts
export type PayState = "not_started" | "signup_started" | "kyc_pending" | "active" | "rejected" | "unavailable";
export type ClubState = "unknown" | "qualifying" | "meeting_scheduled" | "proposal" | "documentation" | "quota_active" | "lost";
export type BlackState = "unknown" | "eligible" | "invited" | "waitlist" | "active" | "unavailable";

export type JourneyState = {
  pay: PayState;
  club: ClubState;
  black: BlackState;
};

export type JourneyAction =
  | { action: "invite_pay_signup"; product: "florida_pay" }
  | { action: "qualify_club"; product: "florida_club" }
  | { action: "invite_black"; product: "florida_black" }
  | { action: "wait"; product: null }
  | { action: "human_review_required"; product: null; reason: string };
```

Create `src/domain/decision.ts` with a total `decideNextAction(state: JourneyState): JourneyAction` function. Invalid backward transitions return `human_review_required`; they never silently overwrite a confirmed contract/payment state.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run tests/journey.test.ts`

Expected: PASS.

```bash
git add src/domain tests/journey.test.ts
git commit -m "feat: add Pay Club Black journey state machine"
```

---

### Task 5: Build deterministic identity and global opt-out

**Files:**
- Create: `src/domain/identity.ts`
- Create: `src/db/schema.ts`
- Create: `src/db/client.ts`
- Create: `drizzle.config.ts`
- Create: `tests/identity.test.ts`

- [ ] **Step 1: Write failing matching tests**

Cover normalized phone, lowercase e-mail, Kommo contact ID, ambiguous conflict and global `do_not_contact`.

```ts
expect(matchIdentity({ phone: "+1 (407) 462-3309" }, [{ id: "a", phone: "14074623309" }]))
  .toEqual({ kind: "matched", customerId: "a" });
```

- [ ] **Step 2: Confirm failure**

Run: `pnpm vitest run tests/identity.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implement conservative matching**

Two distinct records matching different strong identifiers must return:

```ts
{ kind: "ambiguous", candidateIds: ["a", "b"] }
```

The worker must not send while identity is ambiguous.

- [ ] **Step 4: Add SQLite tables**

Create local tables only for execution state: `customer_identity`, `channel_identity`, `jobs`, `messages`, `decisions`, `integration_health`, `opt_out`. Kommo remains the CRM source of truth.

- [ ] **Step 5: Verify migration and commit**

Run: `pnpm drizzle-kit generate`

Expected: one versioned migration.

Run: `pnpm test`

Expected: PASS.

---

### Task 6: Add a guarded Kommo adapter

**Files:**
- Create: `src/integrations/kommo/client.ts`
- Create: `src/integrations/kommo/types.ts`
- Create: `tests/kommo-client.test.ts`

- [ ] **Step 1: Write a failing proxy contract test**

Assert every request uses the `kommo-proxy-v2` URL, includes a path beginning with `/api/v4`, and never sends to `floridarentalcar2024.kommo.com` directly.

- [ ] **Step 2: Implement read methods**

Implement `getPipeline(13953440)`, `getLead(id)`, `findContacts(query)` and `listLeadTasks(id)` first.

- [ ] **Step 3: Implement write methods behind `ALLOW_EXTERNAL_WRITES=false`**

Implement `updateLead`, `updateContact`, `createTask` and `createNote`. When the guard is false they must return a dry-run record without network mutation.

- [ ] **Step 4: Enforce lead + contact ownership changes**

`changeResponsible()` must `Promise.all` the lead and contact PATCH requests and fail the operation if either fails.

- [ ] **Step 5: Run tests and commit**

Run: `pnpm vitest run tests/kommo-client.test.ts`

Expected: PASS.

---

### Task 7: Audit and isolate WhatsApp 3309

**Files:**
- Create: `src/integrations/meta/client.ts`
- Create: `src/integrations/meta/audit.ts`
- Create: `tests/meta-audit.test.ts`
- Create: `docs/audit/whatsapp-3309-isolation.md`

- [ ] **Step 1: Write failing health tests**

The expected phone state is:

```ts
{
  id: "1309297265596025",
  displayPhoneNumber: "+1 407-462-3309",
  verifiedName: "Flórida Club",
  qualityRating: "GREEN",
  status: "CONNECTED"
}
```

- [ ] **Step 2: Implement read-only Meta health and template audit**

Block template `fc_copy_condicao_especial_uudodu` in local policy even though Meta reports it approved.

- [ ] **Step 3: Prove the old Z-API path is isolated**

Read the deployed `zapi-claude-bot`, its webhook owner and the last message timestamp. Document whether Meta coexistence is enabled. Do not deactivate anything during this step.

- [ ] **Step 4: Add a dispatch circuit breaker**

If two active webhooks can answer the same phone, set integration health to `blocked_conflicting_owners` and reject all outbound jobs.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest run tests/meta-audit.test.ts`

Expected: PASS.

---

### Task 8: Connect and test Instagram @floridacluboficial

**Files:**
- Create: `src/integrations/browser/instagram.ts`
- Create: `src/integrations/browser/session-lock.ts`
- Create: `tests/instagram-browser.test.ts`
- Create: `docs/setup/instagram-meta.md`

- [ ] **Step 1: Complete the human 2FA checkpoint**

Use the already-open Meta Business Settings page. Crislany completes the passkey/2FA. No password, passkey or OTP is copied into a file or chat.

- [ ] **Step 2: Connect the asset**

In Meta Business Settings, confirm `@floridacluboficial` is linked to the correct Facebook Page, business portfolio and system user. Creating or changing persistent access requires action-time confirmation.

- [ ] **Step 3: Run a read-only Graph smoke test**

Read the Instagram ID, username, name and media count through Graph v25. Record IDs without tokens in `docs/audit/2026-08-27-current-state.md`.

- [ ] **Step 4: Write the browser dry-run test**

Use a fake CDP page and prove the worker reaches the final-send boundary without clicking it when `BROWSER_SEND_MODE=dry_run`.

- [ ] **Step 5: Implement dedicated Chrome requirements**

Use `CHROME_CDP_URL=http://127.0.0.1:9222`, a dedicated profile directory, one mutex, one agent tab and `try/finally` cleanup. Any checkpoint/challenge pauses the queue.

- [ ] **Step 6: Commit**

```bash
git add src/integrations/browser tests/instagram-browser.test.ts docs/setup/instagram-meta.md docs/audit
git commit -m "feat: add guarded Instagram Florida Club worker"
```

---

### Task 9: Discover and integrate the canonical Florida Pay API

**Files:**
- Create: `src/integrations/florida-pay/client.ts`
- Create: `src/integrations/florida-pay/types.ts`
- Create: `tests/florida-pay-contract.test.ts`
- Create: `docs/audit/florida-pay-provider.md`

- [ ] **Step 1: Inventory providers without writing**

Inspect Dunnas admin, Vault names, n8n credential names, application network hosts and existing `florida_club_dunnas_*` sync consumers. Determine whether Dunnas, PayPix, Bankei or C9 Tech owns each operation.

- [ ] **Step 2: Record the canonical owner per action**

The document must name the source for: customer lookup, KYC status, account status, card status, PIX status and cashback ledger.

- [ ] **Step 3: Write provider contract tests**

The public application state must use only:

```ts
type PayAccountStatus = "not_started" | "signup_started" | "kyc_pending" | "active" | "rejected" | "unavailable";
```

- [ ] **Step 4: Implement read-only lookup first**

No account creation or financial mutation is implemented in the first adapter. The commercial agent sends the official signup link and observes status.

- [ ] **Step 5: Run one authorized read smoke test**

Use one internal/test customer, record only status and timestamps, and do not display documents or financial data.

---

### Task 10: Integrate Florida Black safely

**Files:**
- Create: `src/integrations/florida-black/client.ts`
- Create: `tests/florida-black.test.ts`
- Create: `docs/audit/florida-black-offer.md`

- [ ] **Step 1: Read the live sales switch and active catalog**

If sales are suspended, the only allowed action is `join_waitlist` or `send_free_content`.

- [ ] **Step 2: Write a failing test for suspended sales**

```ts
expect(decideBlackOffer({ salesEnabled: false, activePlans: [] }))
  .toEqual({ action: "join_waitlist" });
```

- [ ] **Step 3: Implement catalog-driven pricing**

Never hardcode historical tier prices in outbound text. Read an active catalog row and its effective date.

- [ ] **Step 4: Keep cashbacks separate**

Add a test proving `black_subscription_credit` cannot be rendered as `club_quota_cashback`.

---

### Task 11: Build the autonomous conversation and job engine

**Files:**
- Create: `src/ai/client.ts`
- Create: `src/ai/prompts.ts`
- Create: `src/worker/jobs.ts`
- Create: `src/worker/handlers.ts`
- Create: `tests/decision-engine.test.ts`
- Create: `tests/job-idempotency.test.ts`

- [ ] **Step 1: Write tests for one-question-at-a-time conversations**

Responses that contain two independent questions must fail the message validator.

- [ ] **Step 2: Add structured model output**

The model must return:

```ts
type AgentDecision = {
  intent: string;
  product: "florida_pay" | "florida_club" | "florida_black";
  action: string;
  message: string | null;
  requiresHuman: boolean;
  evidenceKeys: string[];
};
```

- [ ] **Step 3: Validate every outbound message after generation**

Order: schema validation → claim guard → consent/opt-out → channel ownership → integration health → budget → dispatch.

- [ ] **Step 4: Add idempotent durable jobs**

Use unique key `channel:event_id:action`. Restarting the worker cannot resend a completed job.

- [ ] **Step 5: Add cost and decision logging**

Log model, tokens, cost, evidence, decision, validation result and dispatch result without message secrets.

- [ ] **Step 6: Verify**

Run: `pnpm vitest run tests/decision-engine.test.ts tests/job-idempotency.test.ts`

Expected: PASS.

---

### Task 12: Add webhook ingress and remote outbox in dashboardfrc

**Files:**
- Create in isolated dashboardfrc worktree: `supabase/migrations/20260827_fl_ecosystem_events.sql`
- Create: `supabase/functions/fl-ecosystem-webhook/index.ts`
- Create: `supabase/functions/fl-ecosystem-dispatch/index.ts`
- Create: `supabase/functions/fl-ecosystem-webhook/index.test.ts`

- [ ] **Step 1: Create a dashboardfrc worktree**

Use the `using-git-worktrees` skill. Preserve the user changes currently present in `public/MANUAL.md`, `public/README.md` and `supabase/.temp/linked-project.json` by leaving the main worktree untouched.

- [ ] **Step 2: Write failing webhook tests**

Cover valid signature, invalid signature, duplicate event, opt-out event and unknown Instagram identity.

- [ ] **Step 3: Create system-owned tables with RLS**

Tables: `fl_ecosystem_events`, `fl_ecosystem_outbox`, `fl_ecosystem_channel_state`, `fl_ecosystem_integration_health`. Revoke public writes and add only the policies required by authenticated dashboard readers.

- [ ] **Step 4: Implement webhook ingestion**

The edge validates Meta signature, records the event once and returns 200 quickly. It does not call the language model inline.

- [ ] **Step 5: Implement guarded dispatch**

Dispatch rejects a message unless it has passed claim validation, channel ownership and active pilot limits.

- [ ] **Step 6: Security review**

Run Supabase advisors, anon-key smoke tests and verify `--no-verify-jwt` only for public webhook edges that authenticate by signature.

---

### Task 13: Repair existing n8n workflows

**Files:**
- Create: `docs/audit/n8n-florida-club-before.json` (secret-free export)
- Create: `docs/audit/n8n-florida-club-after.json` (secret-free export)
- Create: `docs/audit/n8n-validation.md`

- [ ] **Step 1: Renew the n8n API key through the UI**

Fabinho completes the sensitive credential step. Save directly to Vault/1Password without chat or terminal output.

- [ ] **Step 2: Export the three existing Florida Club workflows**

Remove credential values from saved artifacts. Record IDs, node names, schedules, input/output contracts and last executions.

- [ ] **Step 3: Repair lead capture**

Prove a simulated form event creates exactly one local event and one Kommo lead/contact pair through the proxy.

- [ ] **Step 4: Repair funil sync**

Remove direct Kommo calls, use `/api/v4` through `kommo-proxy-v2`, connect every error output and store `finished_at`, `ok`, `fetched`, `upserted`, `error`.

- [ ] **Step 5: Leave new schedules paused**

Existing schedules keep their current state unless a repair requires a replacement. Any new workflow or schedule remains inactive until smoke testing.

---

### Task 14: Build the operator console

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/leads/page.tsx`
- Create: `src/app/health/page.tsx`
- Create: `src/app/settings/page.tsx`
- Create: `src/components/PauseButton.tsx`
- Create: `tests/operator-console.test.tsx`

- [ ] **Step 1: Write failing UI tests**

Test PT-BR labels, global pause, dry-run badge, Pay/Club/Black journey, conflicting-channel alert and blocked-claim queue.

- [ ] **Step 2: Implement the minimum console**

Show operational data only: jobs, decisions, channel health, next actions and failures. Do not duplicate the full Kommo CRM.

- [ ] **Step 3: Add the global pause**

Pause stops new outbound jobs but continues inbound capture and audit logging.

- [ ] **Step 4: Verify accessibility and build**

Run: `pnpm test`

Expected: PASS.

Run: `pnpm build`

Expected: exit 0.

---

### Task 15: End-to-end dry-run and authorized pilot

**Files:**
- Create: `tests/e2e/florida-journey.spec.ts`
- Create: `docs/runbooks/pilot.md`
- Create: `docs/runbooks/rollback.md`
- Create: `docs/evidence/pilot-01.md`

- [ ] **Step 1: Run the simulated journey**

Simulate: new Instagram message → identity → Pay invitation → Pay active event → Club qualification → meeting → active quota → Black invitation.

- [ ] **Step 2: Prove prohibited behavior is blocked**

Attempt forbidden 100% return copy, duplicate send, ambiguous identity, unhealthy 3309 and expired Instagram session. Every attempt must create an exception without sending.

- [ ] **Step 3: Run a real read-only smoke test**

Read one test lead from Kommo, WABA health, Instagram identity, Pay test status and Black sales switch.

- [ ] **Step 4: Present the exact pilot actions for approval**

List the single test recipient, exact message, channel, time window and rollback. This is the required action-time confirmation before external communication.

- [ ] **Step 5: Send one authorized message**

After confirmation, send exactly one message, then read the Meta result and Kommo timeline to prove delivery was recorded once.

- [ ] **Step 6: Activate bounded autonomy**

Set explicit limits for inbound auto-replies, WhatsApp templates, follow-ups and browser first contacts. Limits remain fixed until a measured review.

- [ ] **Step 7: Record evidence and rollback**

Document IDs, timestamps in EDT/BRT, outcome, screenshots and the pause/rollback result without exposing customer data or secrets.

---

## Final verification gate

Run in `buscandomilhao`:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Expected: all exit 0.

Run the FRC blast-radius checklist:

1. Kommo lead and contact stay consistent.
2. Existing n8n and dashboard consumers still work.
3. WhatsApp 3309 has exactly one response owner.
4. Instagram API and Chrome cannot answer the same conversation.
5. Florida Pay reads do not expose documents or balances.
6. Florida Black sales switch is respected.
7. Global opt-out blocks all three products and all channels.
8. Every new cron remains paused until explicitly approved.
9. No secret is present in Git, logs or evidence.
10. The user can pause the entire outbound system from one screen.
