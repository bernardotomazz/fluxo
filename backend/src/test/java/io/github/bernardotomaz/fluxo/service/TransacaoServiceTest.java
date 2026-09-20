package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.dto.request.TransacaoRequestDTO;
import io.github.bernardotomaz.fluxo.entity.Categoria;
import io.github.bernardotomaz.fluxo.enums.TipoTransacao;
import io.github.bernardotomaz.fluxo.exceptions.TransacaoInvalidaException;
import io.github.bernardotomaz.fluxo.mapper.TransacaoMapper;
import io.github.bernardotomaz.fluxo.repository.TransacaoRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class TransacaoServiceTest {

    @Test
    void deveRejeitarTransacaoComTipoDiferenteDaCategoria() {
        TransacaoRepository transacaoRepository = mock(TransacaoRepository.class);
        CategoriaService categoriaService = mock(CategoriaService.class);
        TransacaoService service = new TransacaoService(
                transacaoRepository, categoriaService, new TransacaoMapper()
        );
        Categoria categoria = new Categoria();
        categoria.setTipo(TipoTransacao.DESPESA);
        TransacaoRequestDTO transacao = novaTransacao(TipoTransacao.RECEITA);

        when(categoriaService.buscarEntidade(1L)).thenReturn(categoria);

        assertThrows(TransacaoInvalidaException.class, () -> service.cadastrar(transacao));

        verifyNoInteractions(transacaoRepository);
    }

    private TransacaoRequestDTO novaTransacao(TipoTransacao tipo) {
        TransacaoRequestDTO transacao = new TransacaoRequestDTO();
        transacao.setCategoria(1L);
        transacao.setTipo(tipo);
        transacao.setNome("Salario");
        transacao.setValor(BigDecimal.TEN);
        return transacao;
    }
}
