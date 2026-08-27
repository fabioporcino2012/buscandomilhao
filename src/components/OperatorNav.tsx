import Link from "next/link";

export function OperatorNav() {
  return (
    <nav aria-label="Navegação da operação">
      <Link href="/">Visão geral</Link>
      <Link href="/leads">Leads</Link>
      <Link href="/health">Saúde</Link>
      <Link href="/settings">Configurações</Link>
    </nav>
  );
}
