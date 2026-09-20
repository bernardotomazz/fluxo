import { api } from "./api";
import { mockDashboardData } from "./mock/dashboardMockData";
import { mapMetaResponse } from "./metaService";
import { mapTransacaoResponse } from "./transacaoService";
import { formatMesAbreviado } from "../lib/finance-format";
import type { DashboardData, DashboardResponseDTO } from "../types/finance";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

function calcularPercentual(
  comparativo: DashboardResponseDTO["comparativoMensal"],
): number {
  if (typeof comparativo.percentual === "number") return comparativo.percentual;
  if (!comparativo.economiaMesAnterior) return 0;
  return Math.round(
    (comparativo.diferenca / comparativo.economiaMesAnterior) * 100,
  );
}

function mapDashboardResponse(dto: DashboardResponseDTO): DashboardData {
  return {
    resumo: {
      saldoAtual: dto.resumoFinanceiroMes.saldoAtual,
      saldoMes: dto.resumoFinanceiroMes.saldoMes,
      receitasMes: dto.resumoFinanceiroMes.receitasMes,
      despesasMes: dto.resumoFinanceiroMes.despesasMes,
      economiaPercentual: calcularPercentual(dto.comparativoMensal),
      despesasRecorrentesMes: dto.resumoFinanceiroMes.despesasRecorrentesMes,
    },
    receitaVsDespesa: dto.receitaVsDespesaUltimosMeses.map((item) => ({
      mes: formatMesAbreviado(item.referencia),
      receita: item.receitas,
      despesa: item.despesas,
    })),
    gastosPorCategoria: dto.gastosPorCategoria.map((item) => ({
      categoria: item.nome,
      icone: item.icon,
      categoriaId: dto.categorias.find((categoria) => categoria.nome === item.nome)?.id,
      valor: item.valor,
      cor: item.cor,
    })),
    ultimasTransacoes: dto.ultimasTransacoes.map(mapTransacaoResponse),
    proximasMetas: dto.proximasMetas.map(mapMetaResponse),
    resumoDoMes: {
      maiorGasto: dto.resumoMes.maiorGasto
        ? mapTransacaoResponse(dto.resumoMes.maiorGasto)
        : null,
      totalTransacoes: dto.resumoMes.totalTransacoes,
      totalCategorias: dto.resumoMes.totalCategorias,
      metasAtivas: dto.resumoMes.metasAtivas,
      metaMaisProxima: dto.resumoMes.metaMaisProxima
        ? mapMetaResponse(dto.resumoMes.metaMaisProxima)
        : null,
      economiaMesAnterior: dto.resumoMes.economiaMesAnterior,
      percentual: dto.resumoMes.percentual,
    },
    categorias: dto.categorias.map((c) => ({
      id: c.id,
      nome: c.nome,
      icone: c.icon,
      cor: c.cor,
    })),
  };
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    if (useMock) {
      return mockDashboardData;
    }
    const { data } = await api.get<DashboardResponseDTO>("/dashboard");
    return mapDashboardResponse(data);
  },
};
