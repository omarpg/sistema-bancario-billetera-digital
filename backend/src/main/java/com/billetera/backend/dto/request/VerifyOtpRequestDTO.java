package com.billetera.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerifyOtpRequestDTO {

    @NotNull(message = "User ID es obligatorio")
    private UUID userId;

    @NotBlank(message = "Código OTP es obligatorio")
    @Size(min = 6, max = 6, message = "Código OTP debe tener 6 dígitos")
    private String code;
}