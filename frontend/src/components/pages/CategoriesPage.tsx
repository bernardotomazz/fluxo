import { useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useCategorias } from "../../hooks/useCategorias";
import { useDataRefresh, useFeedback } from "../../contexts/app-contexts";
import { categoriaService } from "../../services/categoriaService";
import CategoryIcon from "../CategoryIcon";
import CategoriaFormDialog from "../modals/CategoriaFormDialog";
import DeleteConfirmDialog from "../modals/DeleteConfirmDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { Categoria } from "../../types/finance";

export default function CategoriesPage() {
  const { notifyDataChanged } = useDataRefresh();
  const { notify } = useFeedback();
  const [search, setSearch] = useState("");
  const { categorias, isLoading, error, refetch } = useCategorias({ nome: search || undefined });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [deleting, setDeleting] = useState<Categoria | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function openNew() { setEditing(null); setDialogOpen(true); }
  function openEdit(item: Categoria) { setEditing(item); setDialogOpen(true); }

  async function confirmDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await categoriaService.remover(deleting.id);
      setDeleting(null);
      notifyDataChanged();
      notify("Categoria excluída.");
    } catch (requestError) {
      if (isAxiosError(requestError) && requestError.response?.status === 409) setActionError("Esta categoria está em uso e não pode ser excluída.");
      else setActionError("Não foi possível excluir a categoria. Tente novamente.");
      setDeleting(null);
    } finally { setIsDeleting(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-[28px] font-bold leading-[34px]">Suas categorias</h2><p className="mt-1 text-sm text-muted-foreground">Agrupe receitas e despesas para entender melhor seus hábitos.</p></div><Button onClick={openNew}><Plus size={18} /> Nova categoria</Button></div>
      <div className="relative max-w-md"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar categoria" aria-label="Buscar categoria" className="h-11 pl-10" /></div>
      {(error || actionError) && <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-negative/30 bg-negative/10 p-4 text-sm" role="alert" aria-live="assertive"><span>{actionError ?? error}</span><Button variant="outline" onClick={refetch}><RefreshCw size={16} /> Tentar novamente</Button></div>}
      <section className="app-panel overflow-hidden" aria-labelledby="category-list-title">
        <div className="border-b px-4 py-4 sm:px-5"><h3 id="category-list-title" className="text-xl font-semibold leading-7">Lista de categorias</h3><p className="text-sm text-muted-foreground">{categorias.length === 1 ? "1 categoria" : `${categorias.length} categorias`}</p></div>
        {isLoading ? <div className="space-y-3 p-5">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-14 animate-pulse bg-muted" />)}</div> : categorias.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center"><h3 className="font-semibold">Nenhuma categoria encontrada</h3><p className="mt-1 text-sm text-muted-foreground">Tente outro nome ou crie uma categoria.</p><Button className="mt-5" onClick={openNew}><Plus size={17} /> Nova categoria</Button></div> : <ul className="divide-y">{categorias.map((item) => <li key={item.id} className="flex items-center gap-3 px-4 py-3 sm:px-5"><Link to={`/categorias/${item.id}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-secondary" style={{ color: item.cor }}><CategoryIcon name={item.icone} size={20} aria-hidden="true" /></span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{item.nome}</span><span className="block text-xs text-muted-foreground">{item.tipo === "RECEITA" ? "Receita" : "Despesa"}</span></span></Link><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label={`Editar ${item.nome}`} title="Editar"><Pencil size={16} /></Button><Button variant="ghost" size="icon" className="text-negative hover:text-negative" onClick={() => setDeleting(item)} aria-label={`Excluir ${item.nome}`} title="Excluir"><Trash2 size={16} /></Button></div></li>)}</ul>}
      </section>
      <CategoriaFormDialog open={dialogOpen} onOpenChange={setDialogOpen} categoriaEditando={editing} onSuccess={() => { notifyDataChanged(); notify(editing ? "Categoria atualizada." : "Categoria criada com sucesso."); }} />
      <DeleteConfirmDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)} onConfirm={confirmDelete} isDeleting={isDeleting} title="Excluir categoria" description={`Tem certeza que deseja excluir "${deleting?.nome}"? Categorias vinculadas a transações não podem ser excluídas.`} />
    </div>
  );
}
