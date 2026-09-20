package io.github.bernardotomaz.fluxo.dto.response;

import java.math.BigDecimal;

public interface GastoCategoriaProjection {

    String getNome();
    String getIcon();
    String getCor();
    BigDecimal getValor();

}