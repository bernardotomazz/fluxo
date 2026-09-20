import { ChevronRight, Target } from "lucide-react";
import { Button } from "../ui/button";
import type { Meta } from "../../types/finance";
import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function UpcomingGoals({ goals, onManage }: { goals: Meta[]; onManage: () => void }) {
  return (
    <section className="app-panel h-full p-4 sm:p-5" aria-labelledby="goals-title">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="goals-title" className="text-xl font-semibold leading-7">Metas em andamento</h2>
          <p className="text-sm text-muted-foreground">Acompanhe o valor acumulado</p>
        </div>
        <Target size={21} className="text-accent" aria-hidden="true" />
      </div>
      {goals.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Você ainda não possui metas em andamento.</p>
      ) : (
        <div className="mt-5 divide-y">
          {goals.slice(0, 4).map((goal) => {
            const progress = goal.valorObjetivo > 0 ? Math.min((goal.valorAtual / goal.valorObjetivo) * 100, 100) : 0;
            return (
              <div key={goal.id} className="py-4 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><Link className="flex min-h-11 items-center truncate text-sm font-semibold underline-offset-4 hover:underline focus-visible:underline" to={`/metas/${goal.id}`}>{goal.nome}</Link><p className="financial-number text-xs text-muted-foreground">{currency.format(goal.valorAtual)} de {currency.format(goal.valorObjetivo)}</p></div>
                  <strong className="technical-label text-sm text-positive">{Math.round(progress)}%</strong>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-[2px] bg-muted" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso da meta ${goal.nome}`}>
                  <span className="block h-full origin-left bg-accent" style={{ transform: `scaleX(${progress / 100})` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Prazo: {new Date(goal.prazo.includes("T") ? goal.prazo : `${goal.prazo}T00:00:00`).toLocaleDateString("pt-BR")}</p>
              </div>
            );
          })}
        </div>
      )}
      <Button variant="ghost" className="mt-2 w-full justify-between" onClick={onManage}>Gerenciar metas <ChevronRight size={17} /></Button>
    </section>
  );
}
