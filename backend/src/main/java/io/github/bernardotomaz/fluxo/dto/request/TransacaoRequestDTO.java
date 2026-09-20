package io.github.bernardotomaz.fluxo.dto.request;

import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransacaoRequestDTO {

    @NotBlank(message = "Nome inválido")
    private String nome;
    @NotNull(message = "Transação deve possuir um tipo")
    private TipoTransacao tipo;
    @NotNull(message = "Transação deve possuir um valor")
    @Positive(message = "Valor deve ser positivo")
    private BigDecimal valor;
    @NotNull(message = "Transação deve possuir categoria")
    private Long categoria;
    private boolean recorrencia;
    @NotNull(message = "Transação deve possuir uma data")
    private LocalDate dataTransacao;
    private String descricao;

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

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Long getCategoria() {
        return categoria;
    }

    public void setCategoria(Long categoria) {
        this.categoria = categoria;
    }

    public boolean isRecorrencia() {
        return recorrencia;
    }

    public void setRecorrencia(boolean recorrencia) {
        this.recorrencia = recorrencia;
    }

    public LocalDate getDataTransacao() {
        return dataTransacao;
    }

    public void setDataTransacao(LocalDate dataTransacao) {
        this.dataTransacao = dataTransacao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
