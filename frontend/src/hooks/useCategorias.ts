import { useCallback, useEffect, useState } from "react";
import { categoriaService } from "../services/categoriaService";
import { useDataRefresh } from "../contexts/app-contexts";
import type { Categoria, CategoriaFiltros } from "../types/finance";

export function useCategorias(filtros: CategoriaFiltros = {}) {
  const { version } = useDataRefresh();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const filterKey = JSON.stringify(filtros);

  useEffect(() => {
    let active = true;
    categoriaService
      .listAll(JSON.parse(filterKey) as CategoriaFiltros)
      .then((data) => {
        if (!active) return;
        setCategorias(data);
        setError(null);
      })
      .catch(() => active && setError("Não foi possível carregar as categorias."))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [filterKey, reloadToken, version]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setReloadToken((current) => current + 1);
  }, []);

  return { categorias, isLoading, error, refetch };
}
