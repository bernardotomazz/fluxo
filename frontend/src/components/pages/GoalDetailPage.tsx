import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Target, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { metaService } from "../../services/metaService";
import { useDataRefresh, useDetailPageTitle, useFeedback } from "../../contexts/app-contexts";
import type { Meta } from "../../types/finance";
import GoalFormDialog from "../modals/GoalFormDialog";
import DeleteConfirmDialog from "../modals/DeleteConfirmDialog";
import GoalContributionDialog from "../modals/GoalContributionDialog";
import { Button } from "../ui/button";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function GoalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifyDataChanged } = useDataRefresh();
  const { notify } = useFeedback();
  const [goal, setGoal] = useState<Meta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [contributionOpen, setContributionOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useDetailPageTitle(goal && String(goal.id) === id ? goal.nome : undefined);

  useEffect(() => { if (id) metaService.buscarPorId(id).then(setGoal).catch(() => setError("Não foi possível carregar a meta.")); }, [id]);
  async function confirmDelete() { if (!goal) return; setDeleting(true); try { await metaService.remover(goal.id); notifyDataChanged(); notify("Meta excluída."); navigate("/metas"); } catch { setError("Não foi possível excluir a meta."); } finally { setDeleting(false); setDeleteOpen(false); } }
  if (error) return <Message text={error} />;
  if (!goal) return <Message text="Carregando meta..." />;
  const progress = goal.valorObjetivo > 0 ? Math.min((goal.valorAtual / goal.valorObjetivo) * 100, 100) : 0;

  return <div className="mx-auto max-w-3xl space-y-5"><Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Voltar</Button><section className="app-panel p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-secondary text-accent"><Target size={21} /></span><div><p className="text-sm text-muted-foreground">Meta financeira</p><h2 className="text-2xl font-bold">{goal.nome}</h2></div></div><span className="technical-label text-sm text-positive">{Math.round(progress)}%</span></div><div className="mt-6 h-3 overflow-hidden rounded-[2px] bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label={`Progresso da meta ${goal.nome}`}><span className="block h-full origin-left bg-accent" style={{ transform: `scaleX(${progress / 100})` }} /></div><div className="mt-2 flex justify-between gap-3 text-sm"><span className="financial-number">{currency.format(goal.valorAtual)}</span><span className="financial-number text-muted-foreground">de {currency.format(goal.valorObjetivo)}</span></div><dl className="mt-6 grid gap-5 border-t pt-5 sm:grid-cols-2"><div><dt className="text-xs font-semibold text-muted-foreground">Prazo</dt><dd className="technical-label mt-1 text-sm">{new Date(`${goal.prazo.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR")}</dd></div>{goal.descricao && <div><dt className="text-xs font-semibold text-muted-foreground">Descrição</dt><dd className="mt-1 text-sm">{goal.descricao}</dd></div>}</dl><div className="mt-6 flex flex-wrap gap-2 border-t pt-5">{goal.status === "EM_ANDAMENTO" && <Button onClick={() => setContributionOpen(true)}><Plus size={17} /> Adicionar valor</Button>}<Button variant="outline" onClick={() => setEditOpen(true)}><Pencil size={17} /> Editar</Button><Button variant="outline" className="text-negative hover:text-negative" onClick={() => setDeleteOpen(true)}><Trash2 size={17} /> Excluir</Button></div></section><GoalContributionDialog goal={goal} open={contributionOpen} onOpenChange={setContributionOpen} onSuccess={(updatedGoal) => { setGoal(updatedGoal); notifyDataChanged(); notify("Valor adicionado à meta."); }} /><GoalFormDialog open={editOpen} onOpenChange={setEditOpen} metaEditando={goal} onSuccess={() => { notifyDataChanged(); notify("Meta atualizada."); navigate("/metas"); }} /><DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={confirmDelete} isDeleting={deleting} title="Excluir meta" description={`Tem certeza que deseja excluir "${goal.nome}"?`} /></div>;
}

function Message({ text }: { text: string }) { return <section className="app-panel p-8 text-center"><p className="text-sm text-muted-foreground">{text}</p><Link className="mt-4 inline-block underline" to="/metas">Voltar para metas</Link></section>; }
