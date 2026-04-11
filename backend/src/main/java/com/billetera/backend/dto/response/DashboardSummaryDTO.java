package com.billetera.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {

    // Cuentas del usuario
    private List<AccountResponseDTO> accounts;

    // Contactos
    private List<ContactResponseDTO> contacts;
    
    // Últimas transacciones
    private List<TransactionResponseDTO> recentTransactions;
    
    // Notificaciones recientes (últimas 5)
    private List<NotificationResponseDTO> recentNotifications;
    
    // Estadísticas
    private BigDecimal totalBalanceCLP;
    private BigDecimal totalBalanceUF;
    private Map<String, BigDecimal> monthlyExpensesByType;
    
    // Contadores
    private Integer accountsCount;
    private Integer contactsCount;
    private Long unreadNotifications;
    
    // Indicadores económicos
    private List<CurrencyRateResponseDTO> currencyRates;
}