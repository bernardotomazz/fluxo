package io.github.bernardotomaz.fluxo.specification;

import io.github.bernardotomaz.fluxo.entity.Categoria;
import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

public class CategoriaSpecification {
    public static Specification<Categoria> nome(String nome){
        String nomePesquisa = nome.toLowerCase().trim();
        return (root, query, cb) -> {
            Expression<String> lowerNome = cb.lower(root.get("nome"));
            return cb.like(lowerNome,  "%"+ nomePesquisa +"%");
        };
    }
    public static Specification<Categoria> tipo (TipoTransacao tipo){
        return (root, query, cb) -> cb.equal(root.get("tipo"), tipo);
    }
}
