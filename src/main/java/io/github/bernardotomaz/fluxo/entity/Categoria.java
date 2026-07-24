package io.github.bernardotomaz.fluxo.entity;

import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import jakarta.persistence.*;


@Entity
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String icon;
    private String cor;
    @Enumerated(EnumType.STRING)
    private TipoTransacao tipo;

    public Categoria() {
    }

    public Categoria(String nome, String icon, String color, TipoTransacao tipo) {
        this.nome = nome;
        this.icon = icon;
        this.cor = color;
        this.tipo = tipo;
    }



    //GETTERS
    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getIcon() {
        return icon;
    }

    public String getCor() {
        return cor;
    }

    public TipoTransacao getTipo() {
        return tipo;
    }

    //SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public void setTipo(TipoTransacao tipo) {
        this.tipo = tipo;
    }
}
