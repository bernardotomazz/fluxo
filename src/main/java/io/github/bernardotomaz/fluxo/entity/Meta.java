package io.github.bernardotomaz.fluxo.entity;

import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
public class Meta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String descricao;
    private BigDecimal valorMeta;
    private BigDecimal valorAtual;
    private LocalDate prazo;
    private StatusMeta status;

    public Meta() {
    }

    public Meta(String titulo, String descricao, BigDecimal valorMeta, LocalDate prazo) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.valorMeta = valorMeta;
        this.prazo = prazo;
        this.status = StatusMeta.EM_ANDAMENTO;
        this.valorAtual = BigDecimal.valueOf(0);
    }

    //GETTERS
    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public BigDecimal getValorMeta() {
        return valorMeta;
    }

    public BigDecimal getValorAtual() {
        return valorAtual;
    }

    public LocalDate getPrazo() {
        return prazo;
    }

    public StatusMeta getStatus() {
        return status;
    }

    //SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setValorAtual(BigDecimal valorAtual) {
        this.valorAtual = valorAtual;
    }

    public void setValorMeta(BigDecimal valorMeta) {
        this.valorMeta = valorMeta;
    }

    public void setPrazo(LocalDate prazo) {
        this.prazo = prazo;
    }

    public void setStatus(StatusMeta status) {
        this.status = status;
    }
}
