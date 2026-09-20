import type {
  Meta,
  ReceitaVsDespesaMes,
  ResumoFinanceiro,
} from "../types/finance";

export interface IndicadorFluxometro {
  id: string;
  nome: string;
  pontos: number;
  maxPontos: number;
  descricao: string;
}

export interface AnaliseFluxometro {
  nota: number;
  neutro: boolean;
  indicadores: IndicadorFluxometro[];
  pontosFortes: string[];
  pontosFracos: string[];
}

interface DadosFluxometro {
  resumo?: ResumoFinanceiro;
  historico?: ReceitaVsDespesaMes[];
  metas?: Meta[];
}

interface ResultadoTendencia {
  pontos: number;
  percentual: number | null;
}

function calcularPercentualSuperavit(receitas: number, despesas: number): number {
  if (receitas <= 0) return despesas > 0 ? -100 : 0;
  return ((receitas - despesas) / receitas) * 100;
}

// Superávit acumulado nos últimos seis meses (até 40 pontos).
function scoreSuperavit(percentual: number): number {
  if (percentual >= 30) return 40;
  if (percentual >= 20) return 34;
  if (percentual >= 10) return 28;
  if (percentual > 0) return 20;
  if (percentual === 0) return 10;
  return 0;
}

// Consistência de meses com receitas maiores que despesas (até 20 pontos).
function scoreConsistencia(historico: ReceitaVsDespesaMes[]): number {
  if (historico.length < 3) return 10;
  const mesesPositivos = historico.filter(
    (mes) => mes.receita > mes.despesa,
  ).length;
  const percentual = (mesesPositivos / historico.length) * 100;
  if (percentual === 100) return 20;
  if (percentual >= 75) return 15;
  if (percentual >= 50) return 10;
  if (percentual > 0) return 5;
  return 0;
}

// Tendência da média do superávit dos três meses recentes contra os três anteriores.
function scoreTendencia(historico: ReceitaVsDespesaMes[]): ResultadoTendencia {
  if (historico.length < 6) return { pontos: 8, percentual: null };

  const seisMeses = historico.slice(-6);
  const mediaSaldo = (meses: ReceitaVsDespesaMes[]) =>
    meses.reduce((total, mes) => total + mes.receita - mes.despesa, 0)
    / meses.length;
  const mediaAnterior = mediaSaldo(seisMeses.slice(0, 3));
  const mediaRecente = mediaSaldo(seisMeses.slice(3));
  const percentual =
    ((mediaRecente - mediaAnterior) / Math.max(Math.abs(mediaAnterior), 1))
    * 100;

  if (percentual >= 20) return { pontos: 15, percentual };
  if (percentual >= 5) return { pontos: 12, percentual };
  if (percentual > -5) return { pontos: 8, percentual };
  if (percentual > -20) return { pontos: 4, percentual };
  return { pontos: 0, percentual };
}

// Despesas recorrentes comprometendo a receita do mês atual (até 15 pontos).
function scoreRecorrencias(despesas: number, receitas: number): number {
  if (receitas <= 0) return 0;
  const percentual = (despesas / receitas) * 100;
  if (percentual <= 25) return 15;
  if (percentual <= 40) return 11;
  if (percentual <= 55) return 7;
  if (percentual <= 70) return 3;
  return 0;
}

// Progresso médio das metas ativas (até 10 pontos).
function scoreMetas(metas: Meta[] | undefined): {
  pontos: number;
  progressoMedio: number;
  quantidadeAtivas: number;
} {
  const ativas = metas?.filter((meta) => meta.status === "EM_ANDAMENTO") ?? [];
  if (ativas.length === 0) {
    return { pontos: 5, progressoMedio: 0, quantidadeAtivas: 0 };
  }

  const progressoMedio = ativas.reduce((total, meta) => {
    const progresso = meta.valorObjetivo > 0
      ? Math.min((meta.valorAtual / meta.valorObjetivo) * 100, 100)
      : 0;
    return total + progresso;
  }, 0) / ativas.length;

  let pontos = 0;
  if (progressoMedio >= 80) pontos = 10;
  else if (progressoMedio >= 60) pontos = 8;
  else if (progressoMedio >= 40) pontos = 5;
  else if (progressoMedio >= 20) pontos = 3;

  return { pontos, progressoMedio, quantidadeAtivas: ativas.length };
}

export function calcularFluxometro(dados: DadosFluxometro): AnaliseFluxometro {
  const historico = (dados.historico ?? []).filter(
    (mes) => mes.receita !== 0 || mes.despesa !== 0,
  );
  const totalReceitas = historico.reduce((total, mes) => total + mes.receita, 0);
  const totalDespesas = historico.reduce((total, mes) => total + mes.despesa, 0);
  const neutro = historico.length === 0;
  const receitasMes = dados.resumo?.receitasMes ?? 0;
  const despesasRecorrentes = dados.resumo?.despesasRecorrentesMes ?? 0;

  const superavitPct = calcularPercentualSuperavit(totalReceitas, totalDespesas);
  const mesesPositivos = historico.filter((mes) => mes.receita > mes.despesa).length;
  const consistenciaPct = historico.length > 0
    ? (mesesPositivos / historico.length) * 100
    : 0;
  const recorrenciaPct = receitasMes > 0
    ? (despesasRecorrentes / receitasMes) * 100
    : 0;

  const ptsSuperavit = scoreSuperavit(superavitPct);
  const ptsConsistencia = scoreConsistencia(historico);
  const tendencia = scoreTendencia(historico);
  const ptsRecorrencias = scoreRecorrencias(despesasRecorrentes, receitasMes);
  const metas = scoreMetas(dados.metas);

  const indicadores: IndicadorFluxometro[] = [
    {
      id: "superavit",
      nome: "Superávit geral",
      pontos: ptsSuperavit,
      maxPontos: 40,
      descricao: `${superavitPct.toFixed(0)}% da renda preservada em até 6 meses`,
    },
    {
      id: "consistencia",
      nome: "Consistência",
      pontos: ptsConsistencia,
      maxPontos: 20,
      descricao: historico.length < 3
        ? "aguardando pelo menos 3 meses"
        : `${mesesPositivos} de ${historico.length} meses positivos`,
    },
    {
      id: "tendencia",
      nome: "Tendência",
      pontos: tendencia.pontos,
      maxPontos: 15,
      descricao: tendencia.percentual === null
        ? "aguardando 6 meses de histórico"
        : `${tendencia.percentual >= 0 ? "+" : ""}${tendencia.percentual.toFixed(0)}% entre períodos`,
    },
    {
      id: "recorrencias",
      nome: "Recorrências",
      pontos: ptsRecorrencias,
      maxPontos: 15,
      descricao: `${recorrenciaPct.toFixed(0)}% da renda mensal comprometida`,
    },
    {
      id: "metas",
      nome: "Metas",
      pontos: metas.pontos,
      maxPontos: 10,
      descricao: metas.quantidadeAtivas === 0
        ? "sem metas ativas"
        : `${metas.progressoMedio.toFixed(0)}% de progresso médio`,
    },
  ];

  const pontosFortes: string[] = [];
  const pontosFracos: string[] = [];

  if (superavitPct >= 20) {
    pontosFortes.push("Suas receitas superam as despesas com boa margem.");
  } else if (superavitPct > 0) {
    pontosFortes.push("Suas receitas ainda superam as despesas no período.");
  } else {
    pontosFracos.push("Suas despesas igualaram ou superaram as receitas do período.");
  }

  if (historico.length >= 3) {
    if (consistenciaPct >= 75) {
      pontosFortes.push("Você mantém superávit na maioria dos meses.");
    } else if (consistenciaPct < 50) {
      pontosFracos.push("Poucos meses terminaram com receitas acima das despesas.");
    }
  }

  if (tendencia.percentual !== null) {
    if (tendencia.percentual >= 5) {
      pontosFortes.push("Seu resultado médio melhorou nos últimos três meses.");
    } else if (tendencia.percentual <= -5) {
      pontosFracos.push("Seu resultado médio caiu nos últimos três meses.");
    }
  }

  if (receitasMes > 0 && recorrenciaPct > 55) {
    pontosFracos.push("Despesas recorrentes comprometem uma parcela elevada da renda.");
  } else if (receitasMes > 0 && recorrenciaPct <= 25) {
    pontosFortes.push("Poucas despesas recorrentes comprometem sua renda.");
  }

  if (metas.quantidadeAtivas > 0 && metas.progressoMedio < 20) {
    pontosFracos.push("Suas metas ainda têm pouco progresso acumulado.");
  } else if (metas.progressoMedio >= 60) {
    pontosFortes.push("Suas metas apresentam bom progresso.");
  }

  return {
    nota: Math.max(
      0,
      Math.min(
        100,
        ptsSuperavit
          + ptsConsistencia
          + tendencia.pontos
          + ptsRecorrencias
          + metas.pontos,
      ),
    ),
    neutro,
    indicadores,
    pontosFortes,
    pontosFracos,
  };
}

export function classificacaoNota(nota: number): {
  label: string;
  tone: "positive" | "warning" | "negative";
} {
  if (nota >= 80) return { label: "Excelente", tone: "positive" };
  if (nota >= 60) return { label: "Boa", tone: "positive" };
  if (nota >= 40) return { label: "Regular", tone: "warning" };
  if (nota >= 20) return { label: "Atenção", tone: "warning" };
  return { label: "Crítica", tone: "negative" };
}
