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
public class ContactRequestDTO {

    @NotBlank(message = "Nombre completo es obligatorio")
    @Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String fullName;

    @NotBlank(message = "RUT es obligatorio")
    @Size(min = 9, max = 12, message = "RUT debe tener entre 9 y 12 caracteres")
    private String rut;

    @NotBlank(message = "Nombre del banco es obligatorio")
    @Size(max = 50, message = "Nombre del banco no puede exceder 50 caracteres")
    private String bankName;

    @NotBlank(message = "Número de cuenta es obligatorio")
    @Size(max = 30, message = "Número de cuenta no puede exceder 30 caracteres")
    private String accountNumber;

    @NotBlank(message = "Tipo de cuenta es obligatorio")
    @Size(max = 20, message = "Tipo de cuenta no puede exceder 20 caracteres")
    private String accountType;

    @Email(message = "Email debe ser válido")
    private String email;
}