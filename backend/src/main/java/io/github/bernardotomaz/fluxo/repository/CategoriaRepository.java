package io.github.bernardotomaz.fluxo.repository;

import io.github.bernardotomaz.fluxo.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>, JpaSpecificationExecutor<Categoria> {
    public List<Categoria> findTop8ByOrderByNomeAsc();
}
