package io.github.bernardotomaz.fluxo.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class AporteMetaRequestDTO {
    @NotNull(message = "Valor do aporte é obrigatório")
    @Positive(message = "O valor do aporte deve ser positivo")
    @Digits(integer = 12, fraction = 2, message = "O valor do aporte deve ter no máximo duas casas decimais")
    private BigDecimal valor;

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
