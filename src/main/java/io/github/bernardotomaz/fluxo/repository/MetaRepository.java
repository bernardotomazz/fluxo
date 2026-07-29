package io.github.bernardotomaz.fluxo.repository;

import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MetaRepository extends JpaRepository<Meta, Long>, JpaSpecificationExecutor<Meta> {
    List<Meta> findTop8ByStatusOrderByPrazoAsc(StatusMeta status);
    Meta findTopByStatusOrderByPrazoAsc(StatusMeta status);
    long countByStatus(StatusMeta status);
}
