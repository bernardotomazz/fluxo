import { api } from "./api";
import { CATEGORY_COLOR_TOKENS } from "../lib/category-options";
import { mockDashboardData } from "./mock/dashboardMockData";
import type {
  CategoriaRequest,
  Categoria,
  CategoriaFiltros,
  CategoriaResponseDTO,
} from "../types/finance";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

function nextMockId(categorias: Array<{ id: number }>): number {
  return categorias.length > 0
    ? Math.max(...categorias.map((c) => c.id)) + 1
    : 1;
}

function mapCategoriaResponse(dto: CategoriaResponseDTO): Categoria {
  return {
    id: dto.id,
    nome: dto.nome,
    tipo: dto.tipo,
    icone: dto.icon,
    cor: dto.cor,
  };
}

export const categoriaService = {
  async buscarPorId(id: number): Promise<Categoria> {
    if (useMock) {
      const item = mockDashboardData.categorias.find((c) => c.id === id);
      if (!item || !item.tipo) throw new Error("Categoria não encontrada.");
      return item as Categoria;
    }
    const { data } = await api.get<CategoriaResponseDTO>(`/categorias/${id}`);
    return mapCategoriaResponse(data);
  },

  async listAll(filtros: CategoriaFiltros = {}): Promise<Categoria[]> {
    if (useMock) {
      return mockDashboardData.categorias.filter((c): c is Categoria => {
        if (!c.tipo) return false;
        if (
          filtros.nome &&
          !c.nome.toLowerCase().includes(filtros.nome.toLowerCase())
        )
          return false;
        if (filtros.tipo && c.tipo !== filtros.tipo) return false;
        return true;
      });
    }
    const { data } = await api.get<CategoriaResponseDTO[]>("/categorias", {
      params: filtros,
    });
    return data.map(mapCategoriaResponse);
  },

  async create(payload: CategoriaRequest): Promise<Categoria> {
    if (useMock) {
      const nova: Categoria = {
        id: nextMockId(mockDashboardData.categorias),
        nome: payload.nome,
        tipo: payload.tipo,
        cor: payload.cor ?? CATEGORY_COLOR_TOKENS[0].value,
        icone: payload.icon ?? "Tag",
      };
      mockDashboardData.categorias.push(nova);
      return nova;
    }
    const { data } = await api.post<CategoriaResponseDTO>(
      "/categorias",
      payload,
    );
    return mapCategoriaResponse(data);
  },

  async update(id: number, payload: CategoriaRequest): Promise<Categoria> {
    if (useMock) {
      const atualizada: Categoria = {
        id,
        nome: payload.nome,
        tipo: payload.tipo,
        cor: payload.cor ?? CATEGORY_COLOR_TOKENS[0].value,
        icone: payload.icon ?? "Tag",
      };
      const idx = mockDashboardData.categorias.findIndex((c) => c.id === id);
      if (idx >= 0) mockDashboardData.categorias[idx] = atualizada;
      return atualizada;
    }
    const { data } = await api.put<CategoriaResponseDTO>(
      `/categorias/${id}`,
      payload,
    );
    return mapCategoriaResponse(data);
  },

  async remover(id: number): Promise<void> {
    if (useMock) {
      mockDashboardData.categorias = mockDashboardData.categorias.filter(
        (c) => c.id !== id,
      );
      return;
    }
    await api.delete(`/categorias/${id}`);
  },
};
