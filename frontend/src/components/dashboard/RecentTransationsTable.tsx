import { ArrowDownLeft, ArrowUpRight, ChevronRight, ReceiptText } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import type { Transacao } from "../../types/finance";

interface RecentTransactionsTableProps {
  transacoes: Transacao[];
  onManage: () => void;
}

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function RecentTransactionsTable({ transacoes, onManage }: RecentTransactionsTableProps) {
  const navigate = useNavigate();
  if (transacoes.length === 0) {
    return (
      <section className="app-panel flex min-h-64 flex-col items-center justify-center p-8 text-center">
        <ReceiptText size={30} className="text-muted-foreground" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-semibold">Nenhuma movimentação neste mês</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Registre uma receita ou despesa para começar a entender seu fluxo.</p>
        <Button className="mt-5" onClick={onManage}>Registrar transação</Button>
      </section>
    );
  }

  return (
    <section className="app-panel h-full min-w-0 overflow-hidden" aria-labelledby="recent-transactions-title">
      <div className="flex items-center justify-between border-b px-4 py-4 sm:px-5">
        <div>
          <h2 id="recent-transactions-title" className="text-xl font-semibold leading-7">Movimentações recentes</h2>
          <p className="text-sm text-muted-foreground">Seus lançamentos mais recentes</p>
        </div>
        <Button variant="ghost" className="hidden lg:flex" onClick={onManage}>Gerenciar <ChevronRight size={17} /></Button>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead className="bg-secondary text-left text-xs font-semibold text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3">Descrição</th>
              <th className="px-5 py-3">Categoria</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transacoes.map((transaction) => {
              const isIncome = transaction.tipo === "RECEITA";
              const TypeIcon = isIncome ? ArrowDownLeft : ArrowUpRight;
              return (
                <tr
                  key={transaction.id}
                  className="cursor-pointer hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  role="link"
                  tabIndex={0}
                  aria-label={`Abrir transação ${transaction.nome}`}
                  onClick={() => navigate(`/transacoes/${transaction.id}`)}
                  onKeyDown={(event) => { if (event.key === "Enter") navigate(`/transacoes/${transaction.id}`); }}
                >
                  <td className="technical-label whitespace-nowrap px-5 py-3 text-xs text-muted-foreground">{formatDate(transaction.data)}</td>
                  <td className="max-w-56 px-5 py-3 font-medium"><span className="block truncate">{transaction.nome}</span></td>
                  <td className="px-5 py-3 text-muted-foreground">{transaction.categoria}</td>
                  <td className="px-5 py-3"><span className={`inline-flex items-center gap-1.5 ${isIncome ? "text-positive" : "text-negative"}`}><TypeIcon size={15} />{isIncome ? "Receita" : "Despesa"}</span></td>
                  <td className={`financial-number whitespace-nowrap px-5 py-3 text-right font-semibold ${isIncome ? "text-positive" : "text-negative"}`}>{isIncome ? "+" : "-"}{currency.format(transaction.valor)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y lg:hidden">
        {transacoes.map((transaction) => {
          const isIncome = transaction.tipo === "RECEITA";
          const TypeIcon = isIncome ? ArrowDownLeft : ArrowUpRight;
          return (
            <li key={transaction.id}>
              <Link className="flex items-center gap-3 px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" to={`/transacoes/${transaction.id}`}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-secondary ${isIncome ? "text-positive" : "text-negative"}`}><TypeIcon size={19} aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{transaction.nome}</span>
                <p className="mt-0.5 text-xs text-muted-foreground">{transaction.categoria} · {formatDate(transaction.data)}</p>
              </div>
              <span className={`financial-number whitespace-nowrap text-sm font-semibold ${isIncome ? "text-positive" : "text-negative"}`}>{isIncome ? "+" : "-"}{currency.format(transaction.valor)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t p-3 lg:hidden"><Button variant="ghost" className="w-full" onClick={onManage}>Ver todas as transações <ChevronRight size={17} /></Button></div>
    </section>
  );
}
