import { useEffect, useState } from "react";
import { ArrowLeft, ReceiptText } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categoriaService } from "../../services/categoriaService";
import { useDetailPageTitle } from "../../contexts/app-contexts";
import { useTransacoes } from "../../hooks/useTransacoes";
import type { Categoria } from "../../types/finance";
import CategoryIcon from "../CategoryIcon";
import { Button } from "../ui/button";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function CategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Categoria | null>(null);
  const [error, setError] = useState<string | null>(null);
  const categoryId = Number(id);
  const { transacoes, isLoading } = useTransacoes({ idCategoria: Number.isNaN(categoryId) ? undefined : categoryId });
  useDetailPageTitle(category?.id === categoryId ? category.nome : undefined);

  useEffect(() => {
    if (!Number.isNaN(categoryId)) categoriaService.buscarPorId(categoryId).then(setCategory).catch(() => setError("Não foi possível carregar a categoria."));
  }, [categoryId]);

  if (error) return <Message text={error} />;
  if (!category) return <Message text="Carregando categoria..." />;
  const total = transacoes.reduce((sum, item) => sum + (item.tipo === "DESPESA" ? item.valor : 0), 0);

  return <div className="mx-auto max-w-4xl space-y-5">
    <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Voltar</Button>
    <section className="app-panel p-5 sm:p-7">
      <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-secondary" style={{ color: category.cor }}><CategoryIcon name={category.icone} size={22} /></span><div><p className="text-sm text-muted-foreground">{category.tipo === "RECEITA" ? "Categoria de receitas" : "Categoria de despesas"}</p><h2 className="text-2xl font-bold">{category.nome}</h2></div></div>
      <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2"><div><p className="text-xs font-semibold text-muted-foreground">Lançamentos</p><p className="mt-1 text-xl font-bold">{transacoes.length}</p></div><div><p className="text-xs font-semibold text-muted-foreground">Total em despesas</p><p className="financial-number mt-1 text-xl font-bold">{currency.format(total)}</p></div></div>
    </section>
    <section className="app-panel overflow-hidden"><div className="border-b p-5"><h3 className="text-xl font-semibold">Transações da categoria</h3></div>{isLoading ? <div className="p-5 text-sm text-muted-foreground">Carregando lançamentos...</div> : transacoes.length === 0 ? <div className="flex flex-col items-center p-8 text-center"><ReceiptText size={28} className="text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">Nenhuma transação vinculada a esta categoria.</p></div> : <ul className="divide-y">{transacoes.map((item) => <li key={item.id} className="flex items-center justify-between gap-4 p-4"><div className="min-w-0"><Link className="block truncate font-semibold underline-offset-4 hover:underline" to={`/transacoes/${item.id}`}>{item.nome}</Link><p className="text-xs text-muted-foreground">{new Date(`${item.data}T00:00:00`).toLocaleDateString("pt-BR")}</p></div><span className={`financial-number whitespace-nowrap font-semibold ${item.tipo === "RECEITA" ? "text-positive" : "text-negative"}`}>{item.tipo === "RECEITA" ? "+" : "-"}{currency.format(item.valor)}</span></li>)}</ul>}</section>
  </div>;
}

function Message({ text }: { text: string }) { return <section className="app-panel p-8 text-center"><p className="text-sm text-muted-foreground">{text}</p><Link className="mt-4 inline-block underline" to="/categorias">Voltar para categorias</Link></section>; }
