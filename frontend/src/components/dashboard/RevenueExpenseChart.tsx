import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { ReceitaVsDespesaMes } from "../../types/finance";

const compactCurrency = new Intl.NumberFormat("pt-BR", { notation: "compact", currency: "BRL", style: "currency" });

export default function RevenueExpenseChart({ data }: { data: ReceitaVsDespesaMes[] }) {
  return (
    <section className="app-panel min-w-0 p-4 sm:p-5" aria-labelledby="history-chart-title">
      <h2 id="history-chart-title" className="text-xl font-semibold leading-7">Evolução financeira</h2>
      <p className="mt-1 text-sm text-muted-foreground">Receitas e despesas dos últimos meses</p>
      <div className="mt-5 h-72 w-full" role="img" aria-label="Gráfico de receitas e despesas dos últimos seis meses">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(value) => compactCurrency.format(value)} width={68} />
            <Tooltip
              formatter={(value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))}
              contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--popover-foreground)" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="receita" name="Receitas" stroke="var(--positive)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="despesa" name="Despesas" stroke="var(--negative)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
