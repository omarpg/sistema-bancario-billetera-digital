package com.billetera.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    @NotBlank(message = "RUT o email es obligatorio")
    private String identifier; // Puede ser RUT o email

    @NotBlank(message = "Contraseña es obligatoria")
    private String password;
}