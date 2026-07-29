package io.github.bernardotomaz.fluxo.dto.response;

import java.math.BigDecimal;

public class ReceitaDespesaDTO {

    private BigDecimal saldoAtual;

    private BigDecimal receitasMes;

    private BigDecimal despesasMes;

    private BigDecimal saldoMes;

    public BigDecimal getSaldoAtual() {
        return saldoAtual;
    }

    public void setSaldoAtual(BigDecimal saldoAtual) {
        this.saldoAtual = saldoAtual;
    }

    public BigDecimal getReceitasMes() {
        return receitasMes;
    }

    public void setReceitasMes(BigDecimal receitasMes) {
        this.receitasMes = receitasMes;
    }

    public BigDecimal getDespesasMes() {
        return despesasMes;
    }

    public void setDespesasMes(BigDecimal despesasMes) {
        this.despesasMes = despesasMes;
    }

    public BigDecimal getSaldoMes() {
        return saldoMes;
    }

    public void setSaldoMes(BigDecimal saldoMes) {
        this.saldoMes = saldoMes;
    }
}