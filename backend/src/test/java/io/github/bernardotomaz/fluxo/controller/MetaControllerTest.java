package io.github.bernardotomaz.fluxo.controller;

import io.github.bernardotomaz.fluxo.dto.response.MetaResponseDTO;
import io.github.bernardotomaz.fluxo.enums.StatusMeta;
import io.github.bernardotomaz.fluxo.exceptions.GlobalExceptionHandler;
import io.github.bernardotomaz.fluxo.service.MetaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MetaControllerTest {
    private MetaService metaService;
    private MockMvc mockMvc;

    @BeforeEach
    void configurar() {
        metaService = mock(MetaService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new MetaController(metaService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void deveAdicionarAportePeloEndpointDeProgresso() throws Exception {
        MetaResponseDTO resposta = new MetaResponseDTO();
        resposta.setId(2L);
        resposta.setValorMeta(new BigDecimal("1000.00"));
        resposta.setValorAtual(new BigDecimal("150.00"));
        resposta.setStatus(StatusMeta.EM_ANDAMENTO);
        when(metaService.adicionarAporte(2L, new BigDecimal("150.00"))).thenReturn(resposta);

        mockMvc.perform(patch("/metas/2/progresso")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"valor\":150.00}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.valorAtual").value(150.00))
                .andExpect(jsonPath("$.status").value("EM_ANDAMENTO"));

        verify(metaService).adicionarAporte(2L, new BigDecimal("150.00"));
    }

    @Test
    void deveRejeitarAporteComMaisDeDuasCasasDecimais() throws Exception {
        mockMvc.perform(patch("/metas/2/progresso")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"valor\":10.001}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.valor").exists());

        verifyNoInteractions(metaService);
    }
}
