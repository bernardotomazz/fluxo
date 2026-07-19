package io.github.bernardotomaz.fluxo.dto.response;

import io.github.bernardotomaz.fluxo.enums.StatusMeta;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MetaResponseDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private BigDecimal valorMeta;
    private BigDecimal valorAtual;
    private LocalDate prazo;
    private StatusMeta status;

    //GETTERS e SETTERs

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public BigDecimal getValorAtual() {
        return valorAtual;
    }

    public void setValorAtual(BigDecimal valorAtual) {
        this.valorAtual = valorAtual;
    }

    public LocalDate getPrazo() {
        return prazo;
    }

    public void setPrazo(LocalDate prazo) {
        this.prazo = prazo;
    }

    public StatusMeta getStatus() {
        return status;
    }

    public void setStatus(StatusMeta status) {
        this.status = status;
    }
}
