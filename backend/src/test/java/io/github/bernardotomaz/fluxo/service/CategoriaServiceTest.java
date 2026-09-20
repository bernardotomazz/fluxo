package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.entity.Categoria;
import io.github.bernardotomaz.fluxo.exceptions.CategoriaEmUsoException;
import io.github.bernardotomaz.fluxo.mapper.CategoriaMapper;
import io.github.bernardotomaz.fluxo.repository.CategoriaRepository;
import io.github.bernardotomaz.fluxo.repository.TransacaoRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CategoriaServiceTest {

    @Test
    void naoDeveExcluirCategoriaComTransacoesVinculadas() {
        CategoriaRepository categoriaRepository = mock(CategoriaRepository.class);
        TransacaoRepository transacaoRepository = mock(TransacaoRepository.class);
        CategoriaService service = new CategoriaService(
                categoriaRepository, new CategoriaMapper(), transacaoRepository
        );
        Categoria categoria = new Categoria();

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(transacaoRepository.existsByCategoriaId(1L)).thenReturn(true);

        assertThrows(CategoriaEmUsoException.class, () -> service.excluir(1L));

        verify(categoriaRepository, never()).delete(categoria);
    }

    @Test
    void deveExcluirCategoriaSemTransacoesVinculadas() {
        CategoriaRepository categoriaRepository = mock(CategoriaRepository.class);
        TransacaoRepository transacaoRepository = mock(TransacaoRepository.class);
        CategoriaService service = new CategoriaService(
                categoriaRepository, new CategoriaMapper(), transacaoRepository
        );
        Categoria categoria = new Categoria();

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoria));
        when(transacaoRepository.existsByCategoriaId(1L)).thenReturn(false);

        service.excluir(1L);

        verify(categoriaRepository).delete(categoria);
    }
}
