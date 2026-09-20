package io.github.bernardotomaz.fluxo.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReceitaDespesaMensalDTO {

    private LocalDate referencia;

    private BigDecimal receitas;

    private BigDecimal despesas;

    public LocalDate getReferencia() {
        return referencia;
    }

    public void setReferencia(LocalDate referencia) {
        this.referencia = referencia;
    }

    public BigDecimal getReceitas() {
        return receitas;
    }

    public void setReceitas(BigDecimal receitas) {
        this.receitas = receitas;
    }

    public BigDecimal getDespesas() {
        return despesas;
    }

    public void setDespesas(BigDecimal despesas) {
        this.despesas = despesas;
    }
}