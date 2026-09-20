import { useEffect, useState, type ReactNode } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { transacaoService } from "../../services/transacaoService";
import { useDataRefresh, useDetailPageTitle, useFeedback } from "../../contexts/app-contexts";
import type { Transacao } from "../../types/finance";
import TransactionFormDialog from "../modals/TransactionFormDialog";
import DeleteConfirmDialog from "../modals/DeleteConfirmDialog";
import { Button } from "../ui/button";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifyDataChanged } = useDataRefresh();
  const { notify } = useFeedback();
  const [item, setItem] = useState<Transacao | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useDetailPageTitle(item && String(item.id) === id ? item.nome : undefined);

  useEffect(() => {
    if (!id) return;
    transacaoService.buscarPorId(id).then(setItem).catch(() => setError("Não foi possível carregar a transação."));
  }, [id]);

  async function confirmDelete() {
    if (!item) return;
    setDeleting(true);
    try {
      await transacaoService.remover(item.id);
      notifyDataChanged();
      notify("Transação excluída.");
      navigate("/transacoes");
    } catch {
      setError("Não foi possível excluir a transação.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  if (error) return <DetailMessage message={error} />;
  if (!item) return <DetailMessage message="Carregando transação..." />;
  const income = item.tipo === "RECEITA";
  const Icon = income ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Voltar</Button>
      <section className="app-panel p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
          <div className="flex items-start gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-[4px] bg-secondary ${income ? "text-positive" : "text-negative"}`}><Icon size={21} /></span><div><p className="text-sm text-muted-foreground">{income ? "Receita" : "Despesa"}</p><h2 className="text-2xl font-bold">{item.nome}</h2></div></div>
          <strong className={`financial-number text-xl ${income ? "text-positive" : "text-negative"}`}>{income ? "+" : "-"}{currency.format(item.valor)}</strong>
        </div>
        <dl className="grid gap-5 py-6 sm:grid-cols-2">
          <Detail label="Categoria"><Link className="underline-offset-4 hover:underline" to={`/categorias/${item.categoriaId}`}>{item.categoria}</Link></Detail>
          <Detail label="Data">{new Date(`${item.data}T00:00:00`).toLocaleDateString("pt-BR")}</Detail>
          <Detail label="Recorrência">{item.recorrencia ? "Mensal" : "Não recorrente"}</Detail>
          {item.descricao && <Detail label="Descrição">{item.descricao}</Detail>}
        </dl>
        <div className="flex flex-wrap gap-2 border-t pt-5"><Button onClick={() => setEditOpen(true)}><Pencil size={17} /> Editar</Button><Button variant="outline" className="text-negative hover:text-negative" onClick={() => setDeleteOpen(true)}><Trash2 size={17} /> Excluir</Button></div>
      </section>
      <TransactionFormDialog open={editOpen} onOpenChange={setEditOpen} tipoInicial={item.tipo} transacaoEditando={item} onSuccess={() => { notifyDataChanged(); notify("Transação atualizada."); navigate("/transacoes"); }} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={confirmDelete} isDeleting={deleting} title="Excluir transação" description={`Tem certeza que deseja excluir "${item.nome}"? Essa ação não pode ser desfeita.`} />
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) { return <div><dt className="text-xs font-semibold text-muted-foreground">{label}</dt><dd className="mt-1 text-sm">{children}</dd></div>; }
function DetailMessage({ message }: { message: string }) { return <section className="app-panel p-8 text-center"><p className="text-sm text-muted-foreground">{message}</p><Link className="mt-4 inline-block underline" to="/transacoes">Voltar para transações</Link></section>; }
