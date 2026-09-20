export type TipoTransacao = "RECEITA" | "DESPESA";
export type StatusMeta = "EM_ANDAMENTO" | "META_ATINGIDA" | "PRAZO_ATINGIDO" | "FINALIZADO" | "CANCELADO";

// ── Tipos internos usados pelos componentes ──────────────────────────────

export interface Categoria {
  id: number;
  nome: string;
  tipo: TipoTransacao;
  icone: string;
  cor: string;
}

// Versão enxuta usada só no resumo do dashboard —
// CategoriaDashboardDTO não devolve o campo "tipo".
export interface CategoriaResumo {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  tipo?: TipoTransacao;
}

export interface Transacao {
  id: string;
  nome: string;
  categoriaId: number;
  categoria: string; // TransacaoResponseDTO só devolve o NOME da categoria, não o objeto
  tipo: TipoTransacao;
  valor: number;
  data: string; // yyyy-MM-dd
  recorrencia: boolean;
  descricao?: string;
}

export interface Meta {
  id: string;
  nome: string;
  descricao?: string;
  valorAtual: number;
  valorObjetivo: number;
  prazo: string;
  status: StatusMeta;
}

export interface ResumoFinanceiro {
  saldoAtual: number;
  saldoMes: number;
  receitasMes: number;
  despesasMes: number;
  economiaPercentual: number;
  despesasRecorrentesMes: number;
}

export interface ReceitaVsDespesaMes {
  mes: string;
  receita: number;
  despesa: number;
}

export interface GastoPorCategoria {
  categoria: string;
  categoriaId?: number;
  icone: string;
  valor: number;
  cor: string;
}

export interface ResumoDoMes {
  maiorGasto: Transacao | null;
  totalTransacoes: number;
  totalCategorias: number;
  metasAtivas: number;
  metaMaisProxima: Meta | null;
  economiaMesAnterior: number;
  percentual: number;
}

export interface DashboardData {
  resumo: ResumoFinanceiro;
  receitaVsDespesa: ReceitaVsDespesaMes[];
  gastosPorCategoria: GastoPorCategoria[];
  ultimasTransacoes: Transacao[];
  proximasMetas: Meta[];
  resumoDoMes: ResumoDoMes;
  categorias: CategoriaResumo[];
}

// ── Requests (o que enviamos para o backend) ──────────────────────────────

export interface TransacaoRequest {
  nome: string;
  tipo: TipoTransacao;
  valor: number;
  categoria: number;
  recorrencia: boolean;
  dataTransacao: string;
  descricao?: string;
}

export interface CategoriaRequest {
  nome: string;
  tipo: TipoTransacao;
  cor?: string;
  icon?: string;
}

export interface MetaRequest {
  titulo: string;
  descricao?: string;
  valorMeta: number;
  prazo: string;
}

// ── Filtros ────────────────────────────────────────────────────────────

export interface TransacaoFiltros {
  nome?: string;
  dataInicio?: string;
  dataFim?: string;
  idCategoria?: number;
  tipoTransacao?: TipoTransacao;
}

export interface CategoriaFiltros {
  nome?: string;
  tipo?: TipoTransacao;
}

export interface MetaFiltros {
  titulo?: string;
  descricao?: string;
  valorMetaMin?: number;
  valorMetaMax?: number;
  inicio?: string;
  fim?: string;
  status?: StatusMeta;
}

// ── DTOs — espelham exatamente o retorno do backend Spring Boot ───────────
// Usados só dentro dos services, para mapear para os tipos internos acima.

export interface MetaResponseDTO {
  id: number;
  titulo: string;
  descricao: string | null;
  valorMeta: number;
  valorAtual: number;
  prazo: string;
  status: StatusMeta;
}

export interface TransacaoResponseDTO {
  id: number;
  nome: string;
  valor: number;
  categoriaId: number;
  categoria: string;
  tipo: TipoTransacao;
  dataTransacao: string;
  recorrencia: boolean;
  descricao: string | null;
}

export interface CategoriaResponseDTO {
  id: number;
  nome: string;
  icon: string;
  cor: string;
  tipo: TipoTransacao;
}

export interface CategoriaDashboardDTO {
  id: number;
  nome: string;
  icon: string;
  cor: string;
}

export interface ReceitaDespesaDTO {
  saldoAtual: number;
  receitasMes: number;
  despesasMes: number;
  saldoMes: number;
  despesasRecorrentesMes: number;
}

export interface ComparativoMensalDTO {
  economiaMesAtual: number;
  economiaMesAnterior: number;
  diferenca: number;
  percentual?: number;
}

export interface GastoCategoriaDTO {
  nome: string;
  cor: string;
  valor: number;
  icon: string;
}

export interface ReceitaDespesaMensalDTO {
  referencia: string;
  receitas: number;
  despesas: number;
}

export interface ResumoMesDTO {
  maiorGasto: TransacaoResponseDTO | null;
  totalTransacoes: number;
  totalCategorias: number;
  metasAtivas: number;
  metaMaisProxima: MetaResponseDTO | null;
  economiaMesAnterior: number;
  percentual: number;
}

export interface DashboardResponseDTO {
  resumoFinanceiroMes: ReceitaDespesaDTO;
  comparativoMensal: ComparativoMensalDTO;
  gastosPorCategoria: GastoCategoriaDTO[];
  receitaVsDespesaUltimosMeses: ReceitaDespesaMensalDTO[];
  resumoMes: ResumoMesDTO;
  ultimasTransacoes: TransacaoResponseDTO[];
  proximasMetas: MetaResponseDTO[];
  categorias: CategoriaDashboardDTO[];
}
