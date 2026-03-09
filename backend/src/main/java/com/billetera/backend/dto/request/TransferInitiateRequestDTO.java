package com.billetera.backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferInitiateRequestDTO {

    @NotNull(message = "ID de cuenta origen es obligatorio")
    private UUID sourceAccountId;

    @NotNull(message = "ID de contacto destino es obligatorio")
    private UUID contactId;

    @NotNull(message = "Monto es obligatorio")
    @DecimalMin(value = "0.01", message = "Monto debe ser mayor a 0")
    private BigDecimal amount;

    @NotBlank(message = "Descripción es obligatoria")
    private String description;
}