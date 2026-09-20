package io.github.bernardotomaz.fluxo.dto.response;


import java.math.BigDecimal;
import java.time.LocalDate;

public interface ReceitaDespesaMensalProjection {

    LocalDate getReferencia();

    BigDecimal getReceitas();

    BigDecimal getDespesas();

}
