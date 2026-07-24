package io.github.bernardotomaz.fluxo.dto.response;

import io.github.bernardotomaz.fluxo.enums.TipoTransacao;

public class CategoriaResponseDTO {
    private Long id;
    private String nome;
    private String icon;
    private String cor;
    private TipoTransacao tipo;

    //GETTERS e SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public TipoTransacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoTransacao tipo) {
        this.tipo = tipo;
    }
}
