import { ArrowDownLeft, ArrowUpRight, RefreshCw, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import { calcularFluxometro } from "../../lib/fluxometro";
import Fluxometer from "../dashboard/Fluxometer";
import RecentTransactionsTable from "../dashboard/RecentTransationsTable";
import RevenueExpenseChart from "../dashboard/RevenueExpenseChart";
import UpcomingGoals from "../dashboard/UpcomingGoals";
import { Button } from "../ui/button";
import CategoryIcon from "../CategoryIcon";
import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function DashboardSkeleton() {
  return <div className="space-y-4" aria-live="polite" aria-label="Carregando dashboard"><div className="h-32 animate-pulse bg-muted" /><div className="dashboard-layout"><div className="dashboard-main h-96 animate-pulse bg-muted" /><div className="dashboard-side h-96 animate-pulse bg-muted" /></div></div>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useDashboard();

  if (isLoading && !data) return <DashboardSkeleton />;
  if (error || !data) {
    return (
      <div className="app-panel flex min-h-80 flex-col items-center justify-center p-8 text-center" role="alert" aria-live="assertive">
        <RefreshCw size={30} className="text-negative" aria-hidden="true" />
        <h2 className="mt-4 text-xl font-semibold">Não foi possível carregar o dashboard</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">Verifique se a API local está em execução e tente novamente.</p>
        <Button className="mt-5" onClick={refetch}><RefreshCw size={17} /> Tentar novamente</Button>
      </div>
    );
  }

  const analysis = calcularFluxometro({
    resumo: data.resumo,
    historico: data.receitaVsDespesa,
    metas: data.proximasMetas,
  });
  const savingsRate = data.resumo.receitasMes > 0 ? ((data.resumo.receitasMes - data.resumo.despesasMes) / data.resumo.receitasMes) * 100 : null;
  const scoreTone = analysis.neutro ? "text-muted-foreground" : analysis.nota >= 60 ? "text-positive" : analysis.nota >= 20 ? "text-warning" : "text-negative";
  const scoreSegment = analysis.neutro ? "bg-border" : analysis.nota >= 60 ? "bg-positive" : analysis.nota >= 20 ? "bg-warning" : "bg-negative";
  const metrics = [
    { label: "Saldo atual", value: currency.format(data.resumo.saldoAtual), tone: "text-foreground", icon: WalletCards },
    { label: "Receitas no mês", value: currency.format(data.resumo.receitasMes), tone: "text-positive", icon: ArrowDownLeft },
    { label: "Despesas no mês", value: currency.format(data.resumo.despesasMes), tone: "text-negative", icon: ArrowUpRight },
    { label: "Taxa de economia", value: savingsRate === null ? "—" : `${Math.round(savingsRate)}%`, tone: savingsRate === null ? "text-muted-foreground" : savingsRate >= 0 ? "text-positive" : "text-negative", icon: WalletCards },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="app-panel overflow-hidden" aria-label="Resumo financeiro do mês atual">
        <div className="grid grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_1.2fr]">
          {metrics.map(({ label, value, tone, icon: Icon }) => (
            <div key={label} className="flex min-w-0 items-center gap-2 p-3 xl:gap-3 xl:p-5">
              <Icon size={19} className={tone} aria-hidden="true" />
              <div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className={`financial-number mt-1 truncate text-lg font-bold ${tone}`}>{value}</p></div>
            </div>
          ))}
          <div className="col-span-2 p-4 xl:col-span-1 xl:p-5">
            <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium text-muted-foreground">Fluxômetro</p><p className={`mt-1 text-lg font-semibold ${scoreTone}`}>{analysis.neutro ? "Aguardando dados" : `${Math.round(analysis.nota)} / 100`}</p></div><div className="grid w-24 grid-cols-5 gap-1" aria-hidden="true">{Array.from({ length: 5 }).map((_, index) => <span key={index} className={`h-2 rounded-[2px] ${!analysis.neutro && index < Math.ceil(analysis.nota / 20) ? scoreSegment : "bg-border"}`} />)}</div></div>
          </div>
        </div>
      </section>

      <div className="dashboard-layout items-stretch">
        <div className="dashboard-main flex min-w-0"><RecentTransactionsTable transacoes={data.ultimasTransacoes} onManage={() => navigate("/transacoes")} /></div>
        <div className="dashboard-side flex min-w-0"><Fluxometer analise={analysis} /></div>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-main flex min-w-0"><RevenueExpenseChart data={data.receitaVsDespesa} /></div>
        <div className="dashboard-side flex min-w-0"><UpcomingGoals goals={data.proximasMetas} onManage={() => navigate("/metas")} /></div>
      </div>

      <section className="app-panel p-4 sm:p-5" aria-labelledby="category-summary-title">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="category-summary-title" className="text-xl font-semibold leading-7">Gastos por categoria</h2><p className="text-sm text-muted-foreground">As cinco maiores despesas registradas</p></div><Button variant="outline" onClick={() => navigate("/categorias")}>Ver categorias</Button></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {data.gastosPorCategoria.map((item, index) => {
            const max = Math.max(...data.gastosPorCategoria.map((entry) => entry.valor), 1);
            return <Link key={item.categoria} to={item.categoriaId ? `/categorias/${item.categoriaId}` : "/categorias"} className={`min-w-0 rounded-[4px] p-2 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${index >= 3 ? "hidden sm:block" : ""}`}><div className="flex items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-secondary" style={{ color: item.cor }}><CategoryIcon name={item.icone} size={16} aria-hidden="true" /></span><span className="min-w-0 flex-1 truncate text-sm font-medium">{item.categoria}</span><span className="financial-number text-xs text-muted-foreground">{currency.format(item.valor)}</span></div><div className="mt-3 h-2 overflow-hidden rounded-[2px] bg-muted"><span className="block h-full origin-left" style={{ transform: `scaleX(${item.valor / max})`, backgroundColor: item.cor }} /></div></Link>;
          })}
        </div>
      </section>

    </div>
  );
}
