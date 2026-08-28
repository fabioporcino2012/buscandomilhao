import { OperatorNav } from "../../components/OperatorNav";

const healthItems = [
  ["Instagram @floridacluboficial", "Ativo conectado; mensagens via API ainda bloqueadas", "warning"],
  ["WhatsApp +1 407-462-3309", "API oficial definida; legado precisa ficar sem resposta", "warning"],
  ["Kommo", "Acesso somente pelo proxy seguro", "ok"],
  ["Florida Pay", "Fornecedor Dunnas parcialmente comprovado", "warning"],
] as const;

export default function HealthPage() {
  return (
    <main>
      <OperatorNav />
      <header className="compact-header">
        <div>
          <p className="eyebrow">Canais e fornecedores</p>
          <h1>Saúde</h1>
        </div>
        <span className="status">Modo de simulação</span>
      </header>

      <section className="health-list" aria-label="Saúde das integrações">
        {healthItems.map(([name, detail, state]) => (
          <article className="panel health-row" key={name}>
            <span className={`indicator ${state}`} />
            <div>
              <h3>{name}</h3>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
