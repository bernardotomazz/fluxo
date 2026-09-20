import { mockDashboardData } from "./dashboardMockData";
import type { DashboardData } from "../../types/finance";

// Simula latência de rede para o loading state (skeletons) ficar realista.
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockDashboardService = {
  async getDashboard(): Promise<DashboardData> {
    await delay(800);
    return mockDashboardData;
  },
};
