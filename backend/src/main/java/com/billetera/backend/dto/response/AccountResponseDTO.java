package com.billetera.backend.dto.response;

import com.billetera.backend.entity.enums.AccountStatus;
import com.billetera.backend.entity.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponseDTO {

    private UUID id;
    private String accountNumber;
    private AccountType type;
    private BigDecimal balance;
    private String currency;
    private AccountStatus status;
    private BigDecimal balanceInUF;  // Balance equivalente en UF
    private LocalDateTime createdAt;
}