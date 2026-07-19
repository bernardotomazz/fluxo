package io.github.bernardotomaz.fluxo.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;


import java.math.BigDecimal;
import java.time.LocalDate;

public class MetaRequestDTO {
    @NotBlank(message = "Título é obrigatório")
    private String titulo;
    private String descricao;
    @NotNull(message = "Valor da meta é obrigatório")
    @Positive(message = "O valor da meta deve ser positivo")
    private BigDecimal valorMeta;
    @NotNull(message = "Prazo é obrigatório")
    private LocalDate prazo;

    //GETTERS e SETTERS

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValorMeta() {
        return valorMeta;
    }

    public void setValorMeta(BigDecimal valorMeta) {
        this.valorMeta = valorMeta;
    }

    public LocalDate getPrazo() {
        return prazo;
    }

    public void setPrazo(LocalDate prazo) {
        this.prazo = prazo;
    }
}
