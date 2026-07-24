package io.github.bernardotomaz.fluxo.repository;

import io.github.bernardotomaz.fluxo.entity.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MetaRepository extends JpaRepository<Meta, Long>, JpaSpecificationExecutor<Meta> {
}
