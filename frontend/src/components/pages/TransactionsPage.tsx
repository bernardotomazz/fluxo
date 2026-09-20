import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useCategorias } from "../../hooks/useCategorias";
import { useTransacoes } from "../../hooks/useTransacoes";
import { useDataRefresh, useFeedback } from "../../contexts/app-contexts";
import { transacaoService } from "../../services/transacaoService";
import TransactionFilters from "../transacoes/TransactionFilters";
import TransactionFormDialog from "../modals/TransactionFormDialog";
import DeleteConfirmDialog from "../modals/DeleteConfirmDialog";
import { Button } from "../ui/button";
import type { Transacao, TransacaoFiltros, TipoTransacao } from "../../types/finance";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");

export default function TransactionsPage() {
  const { notifyDataChanged } = useDataRefresh();
  const { notify } = useFeedback();
  const [filters, setFilters] = useState<TransacaoFiltros>({});
  const { transacoes, isLoading, error, refetch } = useTransacoes(filters);
  const { categorias } = useCategorias();
  const [dialog, setDialog] = useState<{ open: boolean; tipo: TipoTransacao; item: Transacao | null }>({ open: false, tipo: "DESPESA", item: null });
  const [deleting, setDeleting] = useState<Transacao | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function openNew(tipo: TipoTransacao = "DESPESA") {
    setDialog({ open: true, tipo, item: null });
  }

  function openEdit(item: Transacao) {
    setDialog({ open: true, tipo: item.tipo, item });
  }

  async function confirmDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await transacaoService.remover(deleting.id);
      setDeleting(null);
      notifyDataChanged();
      notify("Transação excluída.");
    } catch {
      setActionError("Não foi possível excluir a transação. Tente novamente.");
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="text-[28px] font-bold leading-[34px]">Suas movimentações</h2><p className="mt-1 text-sm text-muted-foreground">Consulte, filtre e corrija receitas e despesas.</p></div>
        <Button onClick={() => openNew()}><Plus size={18} /> Nova transação</Button>
      </div>

      <section className="border-y bg-secondary/60 py-4" aria-label="Filtros de transações">
        <TransactionFilters filtros={filters} onChange={setFilters} categorias={categorias} />
      </section>

      {(error || actionError) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-negative/30 bg-negative/10 p-4 text-sm" role="alert" aria-live="assertive">
          <span>{actionError ?? error}</span><Button variant="outline" onClick={refetch}><RefreshCw size={16} /> Tentar novamente</Button>
        </div>
      )}

      <section className="app-panel min-w-0 overflow-hidden" aria-labelledby="transactions-list-title">
        <div className="border-b px-4 py-4 sm:px-5"><h3 id="transactions-list-title" className="text-xl font-semibold leading-7">Histórico</h3><p className="text-sm text-muted-foreground">{transacoes.length === 1 ? "1 transação encontrada" : `${transacoes.length} transações encontradas`}</p></div>
        {isLoading ? (
          <div className="space-y-3 p-5" aria-live="polite">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-12 animate-pulse bg-muted" />)}</div>
        ) : transacoes.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center"><h3 className="text-lg font-semibold">Nenhuma transação encontrada</h3><p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros ou registre uma nova movimentação.</p><Button className="mt-5" onClick={() => openNew()}><Plus size={17} /> Nova transação</Button></div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead className="bg-secondary text-left text-xs font-semibold text-muted-foreground"><tr><th className="px-5 py-3">Data</th><th className="px-5 py-3">Descrição</th><th className="px-5 py-3">Categoria</th><th className="px-5 py-3">Tipo</th><th className="px-5 py-3 text-right">Valor</th><th className="px-5 py-3 text-right">Ações</th></tr></thead>
                <tbody className="divide-y">
                  {transacoes.map((item) => {
                    const income = item.tipo === "RECEITA";
                    const TypeIcon = income ? ArrowDownLeft : ArrowUpRight;
                    return <tr key={item.id} className="hover:bg-secondary/60"><td className="technical-label px-5 py-3 text-xs text-muted-foreground">{date(item.data)}</td><td className="px-5 py-3"><Link className="font-medium underline-offset-4 hover:underline focus-visible:underline" to={`/transacoes/${item.id}`}>{item.nome}</Link>{item.descricao && <p className="max-w-64 truncate text-xs text-muted-foreground">{item.descricao}</p>}</td><td className="px-5 py-3 text-muted-foreground">{item.categoria}</td><td className={`px-5 py-3 ${income ? "text-positive" : "text-negative"}`}><span className="inline-flex items-center gap-1.5"><TypeIcon size={15} />{income ? "Receita" : "Despesa"}{item.recorrencia && <span className="text-xs text-muted-foreground">· recorrente</span>}</span></td><td className={`financial-number px-5 py-3 text-right font-semibold ${income ? "text-positive" : "text-negative"}`}>{income ? "+" : "-"}{currency.format(item.valor)}</td><td className="px-5 py-2"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label={`Editar ${item.nome}`} title="Editar"><Pencil size={16} /></Button><Button variant="ghost" size="icon" className="text-negative hover:text-negative" onClick={() => setDeleting(item)} aria-label={`Excluir ${item.nome}`} title="Excluir"><Trash2 size={16} /></Button></div></td></tr>;
                  })}
                </tbody>
              </table>
            </div>
            <ul className="divide-y lg:hidden">
              {transacoes.map((item) => {
                const income = item.tipo === "RECEITA";
                const TypeIcon = income ? ArrowDownLeft : ArrowUpRight;
                return <li key={item.id} className="p-4"><div className="flex items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-secondary ${income ? "text-positive" : "text-negative"}`}><TypeIcon size={19} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link className="flex min-h-11 items-center truncate text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline" to={`/transacoes/${item.id}`}>{item.nome}</Link><p className="text-xs text-muted-foreground">{item.categoria} · {date(item.data)}{item.recorrencia ? " · recorrente" : ""}</p></div><strong className={`financial-number whitespace-nowrap pt-3 text-sm ${income ? "text-positive" : "text-negative"}`}>{income ? "+" : "-"}{currency.format(item.valor)}</strong></div>{item.descricao && <p className="mt-2 text-sm text-muted-foreground">{item.descricao}</p>}<div className="mt-3 flex gap-2"><Button variant="outline" size="sm" onClick={() => openEdit(item)}><Pencil size={15} /> Editar</Button><Button variant="ghost" size="sm" className="text-negative hover:text-negative" onClick={() => setDeleting(item)}><Trash2 size={15} /> Excluir</Button></div></div></div></li>;
              })}
            </ul>
          </>
        )}
      </section>

      <TransactionFormDialog open={dialog.open} onOpenChange={(open) => setDialog((current) => ({ ...current, open }))} tipoInicial={dialog.tipo} transacaoEditando={dialog.item} onSuccess={() => { notifyDataChanged(); notify(dialog.item ? "Transação atualizada." : "Transação criada com sucesso."); }} />
      <DeleteConfirmDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={confirmDelete} isDeleting={isDeleting} title="Excluir transação" description={`Tem certeza que deseja excluir "${deleting?.nome}"? Essa ação não pode ser desfeita.`} />
    </div>
  );
}
