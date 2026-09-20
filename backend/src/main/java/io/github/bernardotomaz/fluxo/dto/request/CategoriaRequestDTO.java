package io.github.bernardotomaz.fluxo.dto.request;

import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoriaRequestDTO {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    @NotNull(message = "Tipo é obrigatório")
    private TipoTransacao tipo;
    private String cor;
    private String icon;


    // GETTERS e SETTERS
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoTransacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoTransacao tipo) {
        this.tipo = tipo;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
