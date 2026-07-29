package io.github.bernardotomaz.fluxo.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponseDTO {

    // Cards principais
    private ReceitaDespesaDTO resumoFinanceiroMes;

    // Comparativos
    private ComparativoMensalDTO comparativoMensal;

    // Gráficos
    private List<GastoCategoriaDTO> gastosPorCategoria;
    private List<ReceitaDespesaMensalDTO> receitaVsDespesaUltimosMeses;

    // Resumo
    private ResumoMesDTO resumoMes;

    // Listagens
    private List<TransacaoResponseDTO> ultimasTransacoes;
    private List<MetaResponseDTO> proximasMetas;
    private List<CategoriaDashboardDTO> categorias;


    public ReceitaDespesaDTO getResumoFinanceiroMes() {
        return resumoFinanceiroMes;
    }

    public void setResumoFinanceiroMes(ReceitaDespesaDTO resumoFinanceiroMes) {
        this.resumoFinanceiroMes = resumoFinanceiroMes;
    }

    public ComparativoMensalDTO getComparativoMensal() {
        return comparativoMensal;
    }

    public void setComparativoMensal(ComparativoMensalDTO comparativoMensal) {
        this.comparativoMensal = comparativoMensal;
    }

    public List<GastoCategoriaDTO> getGastosPorCategoria() {
        return gastosPorCategoria;
    }

    public void setGastosPorCategoria(List<GastoCategoriaDTO> gastosPorCategoria) {
        this.gastosPorCategoria = gastosPorCategoria;
    }

    public List<ReceitaDespesaMensalDTO> getReceitaVsDespesaUltimosMeses() {
        return receitaVsDespesaUltimosMeses;
    }

    public void setReceitaVsDespesaUltimosMeses(List<ReceitaDespesaMensalDTO> receitaVsDespesaUltimosMeses) {
        this.receitaVsDespesaUltimosMeses = receitaVsDespesaUltimosMeses;
    }

    public ResumoMesDTO getResumoMes() {
        return resumoMes;
    }

    public void setResumoMes(ResumoMesDTO resumoMes) {
        this.resumoMes = resumoMes;
    }

    public List<TransacaoResponseDTO> getUltimasTransacoes() {
        return ultimasTransacoes;
    }

    public void setUltimasTransacoes(List<TransacaoResponseDTO> ultimasTransacoes) {
        this.ultimasTransacoes = ultimasTransacoes;
    }

    public List<MetaResponseDTO> getProximasMetas() {
        return proximasMetas;
    }

    public void setProximasMetas(List<MetaResponseDTO> proximasMetas) {
        this.proximasMetas = proximasMetas;
    }

    public List<CategoriaDashboardDTO> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<CategoriaDashboardDTO> categorias) {
        this.categorias = categorias;
    }
}