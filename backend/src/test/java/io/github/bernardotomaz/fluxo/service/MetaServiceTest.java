package io.github.bernardotomaz.fluxo.service;

import io.github.bernardotomaz.fluxo.entity.Meta;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import io.github.bernardotomaz.fluxo.exceptions.MetaInvalidaException;
import io.github.bernardotomaz.fluxo.mapper.MetaMapper;
import io.github.bernardotomaz.fluxo.repository.MetaRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class MetaServiceTest {

    @Test
    void deveSomarAporteAoValorAtual() {
        MetaRepository repository = mock(MetaRepository.class);
        MetaService service = new MetaService(repository, new MetaMapper());
        Meta meta = novaMeta("1000.00", "200.00", StatusMeta.EM_ANDAMENTO);
        when(repository.findById(1L)).thenReturn(Optional.of(meta));
        when(repository.save(meta)).thenReturn(meta);

        var resposta = service.adicionarAporte(1L, new BigDecimal("150.00"));

        assertEquals(new BigDecimal("350.00"), resposta.getValorAtual());
        assertEquals(StatusMeta.EM_ANDAMENTO, resposta.getStatus());
        verify(repository).save(meta);
    }

    @Test
    void deveLimitarAporteAoObjetivoEMarcarMetaComoAtingida() {
        MetaRepository repository = mock(MetaRepository.class);
        MetaService service = new MetaService(repository, new MetaMapper());
        Meta meta = novaMeta("1000.00", "900.00", StatusMeta.EM_ANDAMENTO);
        when(repository.findById(1L)).thenReturn(Optional.of(meta));
        when(repository.save(meta)).thenReturn(meta);

        var resposta = service.adicionarAporte(1L, new BigDecimal("200.00"));

        assertEquals(new BigDecimal("1000.00"), resposta.getValorAtual());
        assertEquals(StatusMeta.META_ATINGIDA, resposta.getStatus());
    }

    @Test
    void naoDeveAdicionarAporteEmMetaConcluida() {
        MetaRepository repository = mock(MetaRepository.class);
        MetaService service = new MetaService(repository, new MetaMapper());
        Meta meta = novaMeta("1000.00", "1000.00", StatusMeta.META_ATINGIDA);
        when(repository.findById(1L)).thenReturn(Optional.of(meta));

        assertThrows(
                MetaInvalidaException.class,
                () -> service.adicionarAporte(1L, new BigDecimal("10.00"))
        );

        verify(repository, never()).save(meta);
    }

    @Test
    void naoDeveAceitarAporteComValorZero() {
        MetaRepository repository = mock(MetaRepository.class);
        MetaService service = new MetaService(repository, new MetaMapper());

        assertThrows(
                MetaInvalidaException.class,
                () -> service.adicionarAporte(1L, BigDecimal.ZERO)
        );

        verify(repository, never()).findById(1L);
    }

    @Test
    void naoDeveAceitarAporteComMaisDeDuasCasasDecimais() {
        MetaRepository repository = mock(MetaRepository.class);
        MetaService service = new MetaService(repository, new MetaMapper());

        assertThrows(
                MetaInvalidaException.class,
                () -> service.adicionarAporte(1L, new BigDecimal("10.001"))
        );

        verify(repository, never()).findById(1L);
    }

    private Meta novaMeta(String objetivo, String atual, StatusMeta status) {
        Meta meta = new Meta();
        meta.setValorMeta(new BigDecimal(objetivo));
        meta.setValorAtual(new BigDecimal(atual));
        meta.setStatus(status);
        return meta;
    }
}
