import { api } from "./api";
import { mockDashboardData } from "./mock/dashboardMockData";
import type {
  MetaRequest,
  Meta,
  MetaFiltros,
  MetaResponseDTO,
} from "../types/finance";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

export function mapMetaResponse(dto: MetaResponseDTO): Meta {
  return {
    id: String(dto.id),
    nome: dto.titulo,
    descricao: dto.descricao ?? undefined,
    valorAtual: dto.valorAtual,
    valorObjetivo: dto.valorMeta,
    prazo: dto.prazo,
    status: dto.status,
  };
}

export const metaService = {
  async buscarPorId(id: string): Promise<Meta> {
    if (useMock) {
      const item = mockDashboardData.proximasMetas.find((m) => m.id === id);
      if (!item) throw new Error("Meta não encontrada.");
      return item;
    }
    const { data } = await api.get<MetaResponseDTO>(`/metas/${id}`);
    return mapMetaResponse(data);
  },

  async listar(filtros: MetaFiltros = {}): Promise<Meta[]> {
    if (useMock) {
      return mockDashboardData.proximasMetas.filter((m) => {
        if (
          filtros.titulo &&
          !m.nome.toLowerCase().includes(filtros.titulo.toLowerCase())
        )
          return false;
        if (filtros.status && m.status !== filtros.status) return false;
        return true;
      });
    }
    const { data } = await api.get<MetaResponseDTO[]>("/metas", {
      params: filtros,
    });
    return data.map(mapMetaResponse);
  },

  async create(payload: MetaRequest): Promise<Meta> {
    if (useMock) {
      const nova: Meta = {
        id: crypto.randomUUID(),
        nome: payload.titulo,
        valorAtual: 0,
        valorObjetivo: payload.valorMeta,
        prazo: payload.prazo,
        status: "EM_ANDAMENTO",
      };
      mockDashboardData.proximasMetas.push(nova);
      return nova;
    }
    const { data } = await api.post<MetaResponseDTO>("/metas", payload);
    return mapMetaResponse(data);
  },

  async update(id: string, payload: MetaRequest): Promise<Meta> {
    if (useMock) {
      const idx = mockDashboardData.proximasMetas.findIndex((m) => m.id === id);
      if (idx >= 0) {
        mockDashboardData.proximasMetas[idx] = {
          ...mockDashboardData.proximasMetas[idx],
          nome: payload.titulo,
          valorObjetivo: payload.valorMeta,
          prazo: payload.prazo,
        };
        return mockDashboardData.proximasMetas[idx];
      }
    }
    const { data } = await api.put<MetaResponseDTO>(`/metas/${id}`, payload);
    return mapMetaResponse(data);
  },

  async adicionarAporte(id: string, valor: number): Promise<Meta> {
    if (useMock) {
      const item = mockDashboardData.proximasMetas.find((meta) => meta.id === id);
      if (!item) throw new Error("Meta não encontrada.");
      item.valorAtual = Math.min(item.valorAtual + valor, item.valorObjetivo);
      if (item.valorAtual >= item.valorObjetivo) item.status = "META_ATINGIDA";
      return item;
    }
    const { data } = await api.patch<MetaResponseDTO>(`/metas/${id}/progresso`, { valor });
    return mapMetaResponse(data);
  },

  async remover(id: string): Promise<void> {
    if (useMock) {
      mockDashboardData.proximasMetas = mockDashboardData.proximasMetas.filter(
        (m) => m.id !== id,
      );
      return;
    }
    await api.delete(`/metas/${id}`);
  },
};
