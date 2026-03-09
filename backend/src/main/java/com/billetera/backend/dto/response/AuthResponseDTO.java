package com.billetera.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    private UUID userId;
    private String rut;
    private String fullName;
    private String email;
    private String token;
    private Boolean requireOtp;
    private String message;
}