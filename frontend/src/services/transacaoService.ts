import { api } from "./api";
import { mockDashboardData } from "./mock/dashboardMockData";
import type {
  TransacaoRequest,
  Transacao,
  TransacaoFiltros,
  TransacaoResponseDTO,
} from "../types/finance";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

export function mapTransacaoResponse(dto: TransacaoResponseDTO): Transacao {
  return {
    id: String(dto.id),
    nome: dto.nome,
    categoriaId: dto.categoriaId,
    categoria: dto.categoria,
    tipo: dto.tipo,
    valor: dto.valor,
    data: dto.dataTransacao,
    recorrencia: dto.recorrencia,
    descricao: dto.descricao ?? undefined,
  };
}

export const transacaoService = {
  async buscarPorId(id: string): Promise<Transacao> {
    if (useMock) {
      const item = mockDashboardData.ultimasTransacoes.find((t) => t.id === id);
      if (!item) throw new Error("Transação não encontrada.");
      return item;
    }
    const { data } = await api.get<TransacaoResponseDTO>(`/transacoes/${id}`);
    return mapTransacaoResponse(data);
  },

  async listar(filtros: TransacaoFiltros = {}): Promise<Transacao[]> {
    if (useMock) {
      return mockDashboardData.ultimasTransacoes.filter((t) => {
        if (
          filtros.nome &&
          !t.nome.toLowerCase().includes(filtros.nome.toLowerCase())
        )
          return false;
        if (filtros.tipoTransacao && t.tipo !== filtros.tipoTransacao)
          return false;
        if (filtros.dataInicio && t.data < filtros.dataInicio) return false;
        if (filtros.dataFim && t.data > filtros.dataFim) return false;
        return true;
      });
    }
    const { data } = await api.get<TransacaoResponseDTO[]>("/transacoes", {
      params: {
        nome: filtros.nome,
        dataInicio: filtros.dataInicio,
        dataFim: filtros.dataFim,
        idCategoria: filtros.idCategoria,
        tipoTransacao: filtros.tipoTransacao,
      },
    });
    return data.map(mapTransacaoResponse);
  },

  async create(payload: TransacaoRequest): Promise<Transacao> {
    if (useMock) {
      const categoria = mockDashboardData.categorias.find(
        (c) => c.id === payload.categoria,
      );
      const nova: Transacao = {
        id: crypto.randomUUID(),
        nome: payload.nome,
        categoriaId: payload.categoria,
        categoria: categoria?.nome ?? "Outros",
        tipo: payload.tipo,
        valor: payload.valor,
        data: payload.dataTransacao,
        recorrencia: payload.recorrencia,
        descricao: payload.descricao,
      };
      mockDashboardData.ultimasTransacoes.unshift(nova);
      return nova;
    }
    const { data } = await api.post<TransacaoResponseDTO>(
      "/transacoes",
      payload,
    );
    return mapTransacaoResponse(data);
  },

  async update(id: string, payload: TransacaoRequest): Promise<Transacao> {
    if (useMock) {
      const categoria = mockDashboardData.categorias.find(
        (c) => c.id === payload.categoria,
      );
      const idx = mockDashboardData.ultimasTransacoes.findIndex(
        (t) => t.id === id,
      );
      const atualizada: Transacao = {
        id,
        nome: payload.nome,
        categoriaId: payload.categoria,
        categoria: categoria?.nome ?? "Outros",
        tipo: payload.tipo,
        valor: payload.valor,
        data: payload.dataTransacao,
        recorrencia: payload.recorrencia,
        descricao: payload.descricao,
      };
      if (idx >= 0) mockDashboardData.ultimasTransacoes[idx] = atualizada;
      return atualizada;
    }
    const { data } = await api.put<TransacaoResponseDTO>(
      `/transacoes/${id}`,
      payload,
    );
    return mapTransacaoResponse(data);
  },

  async remover(id: string): Promise<void> {
    if (useMock) {
      mockDashboardData.ultimasTransacoes =
        mockDashboardData.ultimasTransacoes.filter((t) => t.id !== id);
      return;
    }
    await api.delete(`/transacoes/${id}`);
  },
};
