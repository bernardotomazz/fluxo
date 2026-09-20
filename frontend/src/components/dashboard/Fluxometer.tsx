import { AlertTriangle, Check, ChevronDown, Gauge, Repeat2, Target, WalletCards } from "lucide-react";
import type { AnaliseFluxometro } from "../../lib/fluxometro";
import { classificacaoNota } from "../../lib/fluxometro";

const TONE_CLASS = {
  positive: "text-positive",
  warning: "text-warning",
  negative: "text-negative",
  neutral: "text-muted-foreground",
} as const;

const SEGMENT_CLASS = {
  positive: "bg-positive",
  warning: "bg-warning",
  negative: "bg-negative",
  neutral: "bg-muted",
} as const;

const INDICATOR_ICONS = {
  superavit: WalletCards,
  consistencia: Check,
  tendencia: Gauge,
  metas: Target,
  recorrencias: Repeat2,
} as const;

export default function Fluxometer({ analise }: { analise: AnaliseFluxometro }) {
  const classificacao = analise.neutro
    ? { label: "Aguardando dados", tone: "neutral" as const }
    : classificacaoNota(analise.nota);
  const activeSegments = analise.neutro ? 0 : Math.ceil(analise.nota / 20);
  const guidance = analise.neutro
    ? "Registre sua primeira receita ou despesa para começar a avaliação."
    : analise.pontosFracos[0] ?? analise.pontosFortes[0] ?? "Continue registrando suas movimentações.";

  return (
    <section className="app-panel h-full p-5 sm:p-6" aria-labelledby="fluxometro-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent">Seu diagnóstico</p>
          <h2 id="fluxometro-title" className="mt-1 text-2xl font-bold leading-8">Fluxômetro</h2>
          <p className="mt-1 text-sm text-muted-foreground">Uma leitura simples da sua vida financeira</p>
        </div>
        <Gauge size={22} className="text-accent" aria-hidden="true" />
      </div>

      <div className="mt-7 flex items-end gap-2">
        <strong className={`fluxometer-display text-6xl font-semibold leading-none ${TONE_CLASS[classificacao.tone]}`}>
          {analise.neutro ? "—" : Math.round(analise.nota)}
        </strong>
        <span className="pb-1 text-sm text-muted-foreground">{analise.neutro ? "sem avaliação" : "/ 100"}</span>
      </div>
      <p className={`mt-3 text-sm font-semibold ${TONE_CLASS[classificacao.tone]}`}>
        {classificacao.label}
      </p>

      <div className="mt-4 grid grid-cols-5 gap-1" aria-label={analise.neutro ? "Fluxômetro aguardando dados" : `Nota ${Math.round(analise.nota)} de 100`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={`h-2 rounded-[2px] ${index < activeSegments ? SEGMENT_CLASS[classificacao.tone] : "bg-muted"}`} />
        ))}
      </div>

      <p className="mt-5 text-base leading-6">{guidance}</p>

      <div className="mt-6 divide-y border-y">
        {analise.indicadores.slice(0, 3).map((indicador) => {
          const Icon = INDICATOR_ICONS[indicador.id as keyof typeof INDICATOR_ICONS] ?? Gauge;
          const ratio = indicador.pontos / indicador.maxPontos;
          const tone = analise.neutro
            ? "text-muted-foreground"
            : ratio >= 0.75
              ? "text-positive"
              : ratio >= 0.5
                ? "text-warning"
                : "text-negative";
          return (
            <div key={indicador.id} className="flex items-center gap-3 py-3">
              <Icon size={18} className={tone} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{indicador.nome}</p>
                <p className="truncate text-xs text-muted-foreground">{indicador.descricao}</p>
              </div>
              <span className={`technical-label text-xs font-semibold ${tone}`}>
                {analise.neutro ? "sem dados" : `${indicador.pontos}/${indicador.maxPontos}`}
              </span>
            </div>
          );
        })}
      </div>

      <details className="group mt-4 text-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
          Como a nota é calculada
          <ChevronDown size={17} className="transition-transform group-open:rotate-180" />
        </summary>
        <p className="mt-3 text-sm leading-5 text-muted-foreground">
          A nota considera o superávit dos últimos seis meses, a consistência dos resultados, a tendência recente, as despesas recorrentes e o progresso das metas. Ela é uma orientação, não uma recomendação financeira profissional.
        </p>
      </details>

      {!analise.neutro && analise.pontosFracos.length > 0 && (
        <div className="mt-5 flex gap-3 rounded-[4px] bg-secondary p-4 text-sm" role="note">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
          <p><strong>Próximo passo:</strong> {analise.pontosFracos[0]}</p>
        </div>
      )}
    </section>
  );
}
