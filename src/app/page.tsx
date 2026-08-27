import { JOURNEY_ORDER } from "../config/constants";

const productLabels = {
  florida_pay: "Florida Pay",
  florida_club: "Florida Club",
  florida_black: "Florida Black",
} as const;

export default function HomePage() {
  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">Central da operação</p>
          <h1>Florida Ecosystem</h1>
          <p className="subtitle">
            Uma jornada comercial única, do primeiro relacionamento ao pós-venda.
          </p>
        </div>
        <span className="status">Modo de simulação</span>
      </header>

      <section aria-labelledby="journey-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Esteira aprovada</p>
            <h2 id="journey-title">Jornada do cliente</h2>
          </div>
          <p>Nenhuma mensagem externa ativada.</p>
        </div>

        <ol className="journey">
          {JOURNEY_ORDER.map((product, index) => (
            <li key={product}>
              <span className="step">0{index + 1}</span>
              <strong>{productLabels[product]}</strong>
              <small>
                {product === "florida_pay" && "Conta e preparação da viagem"}
                {product === "florida_club" && "10 diárias ou cashback anual"}
                {product === "florida_black" && "Conteúdo, concierge e benefícios"}
              </small>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
