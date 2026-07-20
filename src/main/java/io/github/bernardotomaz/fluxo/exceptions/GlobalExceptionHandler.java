package io.github.bernardotomaz.fluxo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            CategoriaInvalidaException.class,
            MetaInvalidaException.class,
            TransacaoInvalidaException.class,
    })
    public ResponseEntity<String> tratarExcecoesDeValidacao(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler({
        CategoriaNaoEncontradaException.class,
        MetaNaoEncontradaException.class,
        TransacaoNaoEncontradaException.class,
    })
    public ResponseEntity<String> tratarExcecoesDeNaoEncontrado(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarBeanValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            erros.put(erro.getField(),erro.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(erros);
    }
}
