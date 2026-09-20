package io.github.bernardotomaz.fluxo.dto.response;

import java.math.BigDecimal;

public class ResumoMesDTO {

    public TransacaoResponseDTO getMaiorGasto() {
        return maiorGasto;
    }

    public void setMaiorGasto(TransacaoResponseDTO maiorGasto) {
        this.maiorGasto = maiorGasto;
    }

    public Integer getTotalTransacoes() {
        return totalTransacoes;
    }

    public void setTotalTransacoes(Integer totalTransacoes) {
        this.totalTransacoes = totalTransacoes;
    }

    public Integer getTotalCategorias() {
        return totalCategorias;
    }

    public void setTotalCategorias(Integer totalCategorias) {
        this.totalCategorias = totalCategorias;
    }

    public Integer getMetasAtivas() {
        return metasAtivas;
    }

    public void setMetasAtivas(Integer metasAtivas) {
        this.metasAtivas = metasAtivas;
    }

    public MetaResponseDTO getMetaMaisProxima() {
        return metaMaisProxima;
    }

    public void setMetaMaisProxima(MetaResponseDTO metaMaisProxima) {
        this.metaMaisProxima = metaMaisProxima;
    }

    public BigDecimal getEconomiaMesAnterior() {
        return economiaMesAnterior;
    }

    public void setEconomiaMesAnterior(BigDecimal economiaMesAnterior) {
        this.economiaMesAnterior = economiaMesAnterior;
    }

    public Double getPercentual() {
        return percentual;
    }

    public void setPercentual(Double percentual) {
        this.percentual = percentual;
    }

    private TransacaoResponseDTO maiorGasto;

    private Integer totalTransacoes;

    private Integer totalCategorias;

    private Integer metasAtivas;

    private MetaResponseDTO metaMaisProxima;

    private BigDecimal economiaMesAnterior;

    private Double percentual;
}