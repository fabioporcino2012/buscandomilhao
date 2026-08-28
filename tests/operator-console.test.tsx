import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "../src/app/page";
import HealthPage from "../src/app/health/page";
import LeadsPage from "../src/app/leads/page";
import SettingsPage from "../src/app/settings/page";
import { PauseButton } from "../src/components/PauseButton";
import { evaluatePilotAction } from "../src/domain/pilot";

describe("operator console", () => {
  it("shows the journey, dry-run state and operational queue", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Florida Pay");
    expect(html).toContain("Florida Club");
    expect(html).toContain("Florida Black");
    expect(html).toContain("Modo de simulação");
    expect(html).toContain("Fila bloqueada");
    expect(html).toContain("promessa comercial proibida");
  });

  it("keeps inbound capture alive when outbound work is paused", () => {
    const html = renderToStaticMarkup(<PauseButton />);

    expect(html).toContain("Pausar saídas");
    expect(html).toContain("Entradas e auditoria continuam ativas");
    expect(evaluatePilotAction({ globalPause: true, direction: "outbound" })).toBe(
      "blocked_global_pause",
    );
    expect(evaluatePilotAction({ globalPause: true, direction: "inbound" })).toBe(
      "allowed",
    );
  });

  it("shows leads, health and settings in PT-BR", () => {
    expect(renderToStaticMarkup(<LeadsPage />)).toContain("Próxima ação");
    expect(renderToStaticMarkup(<HealthPage />)).toContain(
      "API oficial definida; legado precisa ficar sem resposta",
    );
    expect(renderToStaticMarkup(<SettingsPage />)).toContain(
      "Limites do piloto",
    );
  });
});
