package io.github.bernardotomaz.fluxo.specification;

import io.github.bernardotomaz.fluxo.entity.Transacao;
import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class TransacaoSpecification {
    public static Specification<Transacao> tipo(TipoTransacao tipo){
        return (root, query, cb) -> cb.equal(root.get("tipo"), tipo);
    }
    public static Specification<Transacao> categoria(Long id){
        return (root, query, cb) -> cb.equal(root.get("categoria").get("id"), id);
    }
    public static Specification<Transacao> dataTransacao(LocalDate dataInicio, LocalDate dataFim){
        return (root, query, cb) -> cb.between(root.get("dataTransacao"), dataInicio, dataFim);
    }
    public static Specification<Transacao> nome (String nome){
        String nomePesquisa = nome.toLowerCase().trim();
        return (root, query, cb) -> {
            Expression<String> lowerNome = cb.lower(root.get("nome"));
            return cb.like(lowerNome,  "%"+ nomePesquisa +"%");
        };
    }
}
