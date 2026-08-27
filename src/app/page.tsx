import { JOURNEY_ORDER } from "../config/constants";
import { OperatorNav } from "../components/OperatorNav";
import { PauseButton } from "../components/PauseButton";

const productLabels = {
  florida_pay: "Florida Pay",
  florida_club: "Florida Club",
  florida_black: "Florida Black",
} as const;

export default function HomePage() {
  return (
    <main>
      <OperatorNav />
      <header>
        <div>
          <p className="eyebrow">Central da operação</p>
          <h1>Florida Ecosystem</h1>
          <p className="subtitle">
            Uma jornada comercial única, do primeiro relacionamento ao pós-venda.
          </p>
        </div>
        <div className="header-actions">
          <span className="status">Modo de simulação</span>
          <PauseButton />
        </div>
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

      <section className="operations" aria-labelledby="operations-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Controle operacional</p>
            <h2 id="operations-title">O que exige atenção</h2>
          </div>
          <p>Somente decisões e falhas; o CRM continua no Kommo.</p>
        </div>

        <div className="operations-grid">
          <article className="panel alert-panel">
            <div className="panel-title">
              <span className="indicator danger" />
              <h3>Fila bloqueada</h3>
            </div>
            <strong>Template do WhatsApp</strong>
            <p>Bloqueado por promessa comercial proibida.</p>
            <small>Nenhum envio foi realizado.</small>
          </article>

          <article className="panel">
            <div className="panel-title">
              <span className="indicator warning" />
              <h3>Próxima decisão</h3>
            </div>
            <strong>WhatsApp 3309</strong>
            <p>Confirmar um único dono do canal antes do piloto.</p>
            <small>Meta saudável; Z-API ainda precisa de isolamento.</small>
          </article>

          <article className="panel">
            <div className="panel-title">
              <span className="indicator info" />
              <h3>Florida Black</h3>
            </div>
            <strong>Oferta suspensa</strong>
            <p>Interessados seguem para lista de espera.</p>
            <small>Valores históricos não entram em mensagens.</small>
          </article>
        </div>
      </section>
    </main>
  );
}
