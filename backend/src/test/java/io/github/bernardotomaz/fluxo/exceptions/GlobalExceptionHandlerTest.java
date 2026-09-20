package io.github.bernardotomaz.fluxo.exceptions;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    @Test
    void deveRetornarConflitoQuandoCategoriaPossuiTransacoes() {
        GlobalExceptionHandler handler = new GlobalExceptionHandler();

        ResponseEntity<String> resposta = handler.tratarCategoriaEmUso(
                new CategoriaEmUsoException("Categoria em uso")
        );

        assertEquals(HttpStatus.CONFLICT, resposta.getStatusCode());
        assertEquals("Categoria em uso", resposta.getBody());
    }
}
