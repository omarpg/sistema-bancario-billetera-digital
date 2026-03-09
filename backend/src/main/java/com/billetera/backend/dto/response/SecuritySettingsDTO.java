package com.billetera.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecuritySettingsDTO {
    private Boolean twoFactorEnabled;
    private LocalDateTime lastPasswordChange;
    private LocalDateTime lastLogin;
}