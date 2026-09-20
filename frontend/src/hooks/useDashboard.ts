import { useCallback, useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { useDataRefresh } from "../contexts/app-contexts";
import type { DashboardData } from "../types/finance";

export function useDashboard() {
  const { version } = useDataRefresh();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    dashboardService
      .getDashboard()
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setError("Não foi possível carregar os dados do dashboard.");
      })
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [reloadToken, version]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setReloadToken((current) => current + 1);
  }, []);

  return { data, isLoading, error, refetch };
}
