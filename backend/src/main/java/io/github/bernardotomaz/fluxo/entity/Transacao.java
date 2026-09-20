package io.github.bernardotomaz.fluxo.entity;

import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
public class Transacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Enumerated(EnumType.STRING)
    private TipoTransacao tipo;
    private BigDecimal valor;
    @ManyToOne
    private Categoria categoria;
    private boolean recorrencia;
    private LocalDate dataTransacao;
    private String descricao;

    public Transacao() {
    }

    public Transacao(String nome, TipoTransacao tipo, BigDecimal valor, Categoria categoria, boolean recorrencia, LocalDate dataTransacao, String descricao) {
        this.nome = nome;
        this.tipo = tipo;
        this.valor = valor;
        this.categoria = categoria;
        this.recorrencia = recorrencia;
        this.dataTransacao = dataTransacao;
        this.descricao = descricao;
    }

    // GETTERS
    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public TipoTransacao getTipo() {
        return tipo;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public boolean isRecorrencia() {
        return recorrencia;
    }

    public LocalDate getDataTransacao() {
        return dataTransacao;
    }

    public String getDescricao() {
        return descricao;
    }

    //SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setTipo(TipoTransacao tipo) {
        this.tipo = tipo;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public void setRecorrencia(boolean recorrencia) {
        this.recorrencia = recorrencia;
    }

    public void setDataTransacao(LocalDate dataTransacao) {
        this.dataTransacao = dataTransacao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
