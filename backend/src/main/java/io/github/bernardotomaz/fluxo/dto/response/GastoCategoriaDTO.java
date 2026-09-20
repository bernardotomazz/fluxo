package io.github.bernardotomaz.fluxo.dto.response;

import java.math.BigDecimal;

public class GastoCategoriaDTO {
    private String nome;

    private String cor;

    private BigDecimal valor;

    private String icon;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
