package io.github.bernardotomaz.fluxo.dto.request;

import io.github.bernardotomaz.fluxo.enums.TipoTransacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CriarTransacaoDTO {

    private String nome;
    private TipoTransacao tipo;
    private BigDecimal valor;
    private Long categoria;
    private boolean recorrencia;
    private LocalDate dataTransacao;
    private String descricao;
}
