package io.github.bernardotomaz.fluxo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String icon;
    private String cor;
    private String tipo;

    public Categoria() {
    }

    public Categoria(String nome, String icon, String color, String tipo) {
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

    public String getTipo() {
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

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
