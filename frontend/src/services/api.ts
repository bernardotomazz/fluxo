import axios from "axios";

// Instância única do axios para toda a aplicação.
// Nenhum componente deve chamar axios diretamente — sempre via services/.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
