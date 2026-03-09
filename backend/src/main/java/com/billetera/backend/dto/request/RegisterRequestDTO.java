package com.billetera.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "RUT es obligatorio")
    @Size(min = 9, max = 12, message = "RUT debe tener entre 9 y 12 caracteres")
    private String rut;

    @NotBlank(message = "Nombre completo es obligatorio")
    @Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String fullName;

    @NotBlank(message = "Email es obligatorio")
    @Email(message = "Email debe ser válido")
    private String email;

    @NotBlank(message = "Contraseña es obligatoria")
    @Size(min = 8, message = "Contraseña debe tener al menos 8 caracteres")
    private String password;
}