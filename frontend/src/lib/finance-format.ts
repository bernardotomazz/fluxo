const MESES_ABREVIADOS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export function formatMesAbreviado(referencia: string): string {
  const mes = parseInt(referencia.split("-")[1] ?? "0", 10);
  return MESES_ABREVIADOS[mes - 1] ?? referencia;
}