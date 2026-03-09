package com.billetera.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Toggle2FARequestDTO {

    @NotNull(message = "El estado de 2FA es obligatorio")
    private Boolean enable;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}