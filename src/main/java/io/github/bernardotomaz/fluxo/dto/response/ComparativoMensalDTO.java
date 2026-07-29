package io.github.bernardotomaz.fluxo.dto.response;

import java.math.BigDecimal;

public class ComparativoMensalDTO {

    private BigDecimal economiaMesAtual;

    private BigDecimal economiaMesAnterior;

    private BigDecimal diferenca;

    public BigDecimal getEconomiaMesAtual() {
        return economiaMesAtual;
    }

    public void setEconomiaMesAtual(BigDecimal economiaMesAtual) {
        this.economiaMesAtual = economiaMesAtual;
    }

    public BigDecimal getEconomiaMesAnterior() {
        return economiaMesAnterior;
    }

    public void setEconomiaMesAnterior(BigDecimal economiaMesAnterior) {
        this.economiaMesAnterior = economiaMesAnterior;
    }

    public BigDecimal getDiferenca() {
        return diferenca;
    }

    public void setDiferenca(BigDecimal diferenca) {
        this.diferenca = diferenca;
    }

    public Double getPercentual() {
        return percentual;
    }

    public void setPercentual(Double percentual) {
        this.percentual = percentual;
    }

    private Double percentual;
}