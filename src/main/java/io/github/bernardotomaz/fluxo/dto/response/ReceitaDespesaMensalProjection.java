package io.github.bernardotomaz.fluxo.dto.response;

import io.github.bernardotomaz.fluxo.enums.TipoTransacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ReceitaDespesaMensalProjection {

    LocalDate getReferencia();

    BigDecimal getReceitas();

    BigDecimal getDespesas();

}
