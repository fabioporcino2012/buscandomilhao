import { OperatorNav } from "../../components/OperatorNav";

export default function LeadsPage() {
  return (
    <main>
      <OperatorNav />
      <header className="compact-header">
        <div>
          <p className="eyebrow">Operação, não CRM duplicado</p>
          <h1>Leads</h1>
          <p className="subtitle">
            Próxima ação calculada para a jornada Pay → Club → Black.
          </p>
        </div>
        <span className="status">Modo de simulação</span>
      </header>

      <section className="panel empty-state">
        <p className="eyebrow">Próxima ação</p>
        <h2>Aguardando o piloto controlado</h2>
        <p>
          Nenhum contato real será carregado nesta cópia até a validação do canal e
          do consentimento.
        </p>
      </section>
    </main>
  );
}
