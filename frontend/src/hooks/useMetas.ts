import { useCallback, useEffect, useState } from "react";
import { metaService } from "../services/metaService";
import { useDataRefresh } from "../contexts/app-contexts";
import type { Meta, MetaFiltros } from "../types/finance";

export function useMetas(filtros: MetaFiltros = {}) {
  const { version } = useDataRefresh();
  const [metas, setMetas] = useState<Meta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const filterKey = JSON.stringify(filtros);

  useEffect(() => {
    let active = true;
    metaService
      .listar(JSON.parse(filterKey) as MetaFiltros)
      .then((data) => {
        if (!active) return;
        setMetas(data);
        setError(null);
      })
      .catch(() => active && setError("Não foi possível carregar as metas."))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [filterKey, reloadToken, version]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setReloadToken((current) => current + 1);
  }, []);

  return { metas, isLoading, error, refetch };
}
