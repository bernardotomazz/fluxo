import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, RefreshCw, Target, Trash2 } from "lucide-react";
import { useMetas } from "../../hooks/useMetas";
import { useDataRefresh, useFeedback } from "../../contexts/app-contexts";
import { metaService } from "../../services/metaService";
import GoalFormDialog from "../modals/GoalFormDialog";
import DeleteConfirmDialog from "../modals/DeleteConfirmDialog";
import { Button } from "../ui/button";
import type { Meta } from "../../types/finance";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const STATUS_LABEL: Record<Meta["status"], string> = {
  EM_ANDAMENTO: "Em andamento",
  META_ATINGIDA: "Meta atingida",
  PRAZO_ATINGIDO: "Prazo atingido",
  FINALIZADO: "Finalizada",
  CANCELADO: "Cancelada",
};

const STATUS_TONE: Record<Meta["status"], string> = {
  EM_ANDAMENTO: "text-info",
  META_ATINGIDA: "text-positive",
  PRAZO_ATINGIDO: "text-warning",
  FINALIZADO: "text-muted-foreground",
  CANCELADO: "text-negative",
};

function formatDeadline(value: string) {
  return new Date(value.includes("T") ? value : `${value}T00:00:00`).toLocaleDateString("pt-BR");
}

export default function GoalsPage() {
  const { notifyDataChanged } = useDataRefresh();
  const { notify } = useFeedback();
  const { metas, isLoading, error, refetch } = useMetas();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Meta | null>(null);
  const [deleting, setDeleting] = useState<Meta | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(item: Meta) {
    setEditing(item);
    setDialogOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await metaService.remover(deleting.id);
      setDeleting(null);
      notifyDataChanged();
      notify("Meta excluída.");
    } catch {
      setActionError("Não foi possível excluir a meta. Tente novamente.");
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-bold leading-[34px]">Seus objetivos</h2>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe o progresso, o prazo e a situação de cada meta.</p>
        </div>
        <Button onClick={openNew}><Plus size={18} /> Nova meta</Button>
      </div>

      {(error || actionError) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-negative/30 bg-negative/10 p-4 text-sm" role="alert" aria-live="assertive">
          <span>{actionError ?? error}</span>
          <Button variant="outline" onClick={refetch}><RefreshCw size={16} /> Tentar novamente</Button>
        </div>
      )}

      <section className="app-panel overflow-hidden" aria-labelledby="goals-list-title">
        <div className="border-b px-4 py-4 sm:px-5">
          <h3 id="goals-list-title" className="text-xl font-semibold leading-7">Objetivos financeiros</h3>
          <p className="text-sm text-muted-foreground">{metas.length === 1 ? "1 meta cadastrada" : `${metas.length} metas cadastradas`}</p>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-20 animate-pulse bg-muted" />)}</div>
        ) : metas.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <Target size={30} className="text-muted-foreground" />
            <h3 className="mt-4 font-semibold">Nenhuma meta cadastrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">Crie um objetivo para acompanhar sua evolução.</p>
            <Button className="mt-5" onClick={openNew}><Plus size={17} /> Nova meta</Button>
          </div>
        ) : (
          <ul className="divide-y">
            {metas.map((item) => {
              const progress = item.valorObjetivo > 0
                ? Math.min((item.valorAtual / item.valorObjetivo) * 100, 100)
                : 0;
              return (
                <li key={item.id} className="px-4 py-5 sm:px-5">
                  <div className="grid items-center gap-4 lg:grid-cols-[minmax(180px,1.2fr)_minmax(220px,2fr)_140px_auto]">
                    <div className="min-w-0">
                      <Link to={`/metas/${item.id}`} className="flex min-h-11 items-center truncate font-semibold underline-offset-4 hover:underline focus-visible:underline">{item.nome}</Link>
                      <p className={`text-xs font-semibold ${STATUS_TONE[item.status]}`}>{STATUS_LABEL[item.status]}</p>
                    </div>
                    <div>
                      <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                        <span className="financial-number">{currency.format(item.valorAtual)}</span>
                        <span className="financial-number">{currency.format(item.valorObjetivo)}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-[2px] bg-muted" role="progressbar" aria-label={`Progresso da meta ${item.nome}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
                        <span className="block h-full origin-left bg-accent" style={{ transform: `scaleX(${progress / 100})` }} />
                      </div>
                    </div>
                    <div className="text-sm"><p className="text-xs text-muted-foreground">Prazo</p><p className="technical-label mt-1 text-xs">{formatDeadline(item.prazo)}</p></div>
                    <div className="flex gap-1 lg:justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label={`Editar ${item.nome}`} title="Editar"><Pencil size={16} /></Button>
                      <Button variant="ghost" size="icon" className="text-negative hover:text-negative" onClick={() => setDeleting(item)} aria-label={`Excluir ${item.nome}`} title="Excluir"><Trash2 size={16} /></Button>
                    </div>
                  </div>
                  {item.descricao && <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{item.descricao}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <GoalFormDialog open={dialogOpen} onOpenChange={setDialogOpen} metaEditando={editing} onSuccess={() => { notifyDataChanged(); notify(editing ? "Meta atualizada." : "Meta criada com sucesso."); }} />
      <DeleteConfirmDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={confirmDelete} isDeleting={isDeleting} title="Excluir meta" description={`Tem certeza que deseja excluir "${deleting?.nome}"?`} />
    </div>
  );
}
