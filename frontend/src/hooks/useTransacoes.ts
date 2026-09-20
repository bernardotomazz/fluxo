import { useCallback, useEffect, useState } from "react";
import { transacaoService } from "../services/transacaoService";
import { useDataRefresh } from "../contexts/app-contexts";
import type { Transacao, TransacaoFiltros } from "../types/finance";

export function useTransacoes(filtros: TransacaoFiltros = {}) {
  const { version } = useDataRefresh();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const filterKey = JSON.stringify(filtros);

  useEffect(() => {
    let active = true;
    transacaoService
      .listar(JSON.parse(filterKey) as TransacaoFiltros)
      .then((data) => {
        if (!active) return;
        setTransacoes(data);
        setError(null);
      })
      .catch(() => active && setError("Não foi possível carregar as transações."))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [filterKey, reloadToken, version]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setReloadToken((current) => current + 1);
  }, []);

  return { transacoes, isLoading, error, refetch };
}
