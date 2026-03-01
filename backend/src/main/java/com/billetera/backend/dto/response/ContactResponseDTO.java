package com.billetera.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponseDTO {

    private UUID id;
    private String fullName;
    private String rut;
    private String bankName;
    private String accountNumber;
    private String accountType;
    private String email;
    private LocalDateTime createdAt;
}