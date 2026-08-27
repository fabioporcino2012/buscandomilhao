import { OperatorNav } from "../../components/OperatorNav";
import { PauseButton } from "../../components/PauseButton";

export default function SettingsPage() {
  return (
    <main>
      <OperatorNav />
      <header className="compact-header">
        <div>
          <p className="eyebrow">Segurança operacional</p>
          <h1>Configurações</h1>
        </div>
        <span className="status">Modo de simulação</span>
      </header>

      <section className="settings-grid">
        <article className="panel">
          <h2>Limites do piloto</h2>
          <dl>
            <div><dt>Envios externos</dt><dd>Desativados</dd></div>
            <div><dt>Lead real</dt><dd>1 por smoke test</dd></div>
            <div><dt>Valores comerciais</dt><dd>Somente fonte ativa</dd></div>
          </dl>
        </article>
        <article className="panel">
          <h2>Pausa geral</h2>
          <p>A pausa bloqueia novas saídas, mas preserva entrada e auditoria.</p>
          <PauseButton />
        </article>
      </section>
    </main>
  );
}
