package io.github.bernardotomaz.fluxo.repository;

import io.github.bernardotomaz.fluxo.dto.response.GastoCategoriaProjection;
import io.github.bernardotomaz.fluxo.dto.response.ReceitaDespesaMensalProjection;
import io.github.bernardotomaz.fluxo.entity.Transacao;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


public interface TransacaoRepository extends JpaRepository<Transacao, Long>, JpaSpecificationExecutor<Transacao> {
    List<Transacao> findTop8ByOrderByDataTransacaoDesc();

    @Query("""
    SELECT COALESCE(SUM(t.valor), 0)
    FROM Transacao t
    WHERE t.tipo = :tipo
""")
    BigDecimal calcularTotalPorTipo(@Param("tipo") TipoTransacao tipo);

    @Query("""
SELECT COALESCE(SUM(t.valor), 0)
FROM Transacao t
WHERE t.tipo = :tipo
AND t.dataTransacao BETWEEN :inicio AND :fim
""")
    BigDecimal calcularTotalMesPorTipo(
            @Param("tipo") TipoTransacao tipo,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );


    Transacao findTopByTipoAndDataTransacaoBetweenOrderByValorDesc(
            TipoTransacao tipo,
            LocalDate inicio,
            LocalDate fim
    );



    long countByDataTransacaoBetween(
            LocalDate inicio,
            LocalDate fim
    );

    @Query("""
SELECT
    c.nome AS nome,
    c.icon AS icon,
    c.cor AS cor,
    SUM(t.valor) AS valor
FROM Transacao t
JOIN t.categoria c
WHERE t.tipo = :tipo
GROUP BY c.id, c.nome, c.icon, c.cor
ORDER BY SUM(t.valor) DESC
""")
    List<GastoCategoriaProjection> buscarGastosPorCategoria(
            @Param("tipo") TipoTransacao tipo,
            Pageable pageable
    );

    @Query(value = """
SELECT
    DATE_TRUNC('month', t.data_transacao)::date AS referencia,
    SUM(
        CASE
            WHEN t.tipo = 'RECEITA'
            THEN t.valor
            ELSE 0
        END
    ) AS receitas,
    SUM(
        CASE
            WHEN t.tipo = 'DESPESA'
            THEN t.valor
            ELSE 0
        END
    ) AS despesas
FROM transacao t
WHERE t.data_transacao >= :inicio
GROUP BY DATE_TRUNC('month', t.data_transacao)
ORDER BY referencia
""", nativeQuery = true)
    List<ReceitaDespesaMensalProjection> buscarReceitaVsDespesaUltimosMeses(
            @Param("inicio") LocalDate inicio
    );
}
