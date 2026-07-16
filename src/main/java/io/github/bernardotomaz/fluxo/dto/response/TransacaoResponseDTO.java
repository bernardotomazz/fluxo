package io.github.bernardotomaz.fluxo.dto.response;


import io.github.bernardotomaz.fluxo.enums.TipoTransacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransacaoResponseDTO {

    private Long id;
    private String nome;
    private BigDecimal valor;
    private String categoria;
    private TipoTransacao tipo;
    private LocalDate dataTransacao;

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

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public TipoTransacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoTransacao tipo) {
        this.tipo = tipo;
    }

    public LocalDate getDataTransacao() {
        return dataTransacao;
    }

    public void setDataTransacao(LocalDate dataTransacao) {
        this.dataTransacao = dataTransacao;
    }
}
