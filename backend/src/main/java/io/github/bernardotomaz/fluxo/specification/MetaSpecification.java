package io.github.bernardotomaz.fluxo.specification;

import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MetaSpecification {
    public static Specification<Meta> titulo(String titulo){
        String tituloPesquisa = titulo.toLowerCase().trim();
        return (root, query, cb) -> {
            Expression<String> lowerTitulo = cb.lower(root.get("titulo"));
            return cb.like(lowerTitulo,  "%"+ tituloPesquisa +"%");
        };
    }
    public static Specification<Meta> descricao(String descricao){
        String descricaoPesquisa = descricao.toLowerCase().trim();
        return (root, query, cb) -> {
            Expression<String> lowerDescricao = cb.lower(root.get("descricao"));
            return cb.like(lowerDescricao, "%" + descricaoPesquisa + "%");
        };
    }
    public static Specification<Meta> valorMetaEntre(BigDecimal valorMetaMin, BigDecimal valorMetaMax){
        return (root, query, cb) -> cb.between(root.get("valorMeta"), valorMetaMin, valorMetaMax);
    }

    public static Specification<Meta> valorMetaMin(BigDecimal valorMin){
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("valorMeta"), valorMin);
    }
    public static Specification<Meta> valorMetaMax(BigDecimal valorMax){
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("valorMeta"), valorMax);
    }

    public static Specification<Meta> prazoEntre(LocalDate inicio, LocalDate fim){
        return (root, query, cb) -> cb.between(root.get("prazo"), inicio, fim);
    }
    public static Specification<Meta> prazoInicio(LocalDate inicio){
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("prazo"), inicio);
    }
    public static Specification<Meta> prazoFim(LocalDate fim){
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("prazo"), fim);
    }
    public static Specification<Meta> status(StatusMeta status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }
}
