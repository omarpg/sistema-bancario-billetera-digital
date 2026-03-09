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

    // Saldo total consolidado
    private BigDecimal totalBalanceCLP;
    private BigDecimal totalBalanceUF;

    // Últimas transacciones
    private List<TransactionResponseDTO> recentTransactions;

    // Gastos del mes agrupados por tipo (para gráfico)
    private Map<String, BigDecimal> monthlyExpensesByType;

    // Estadísticas adicionales
    private Integer accountsCount;
    private Integer contactsCount;
    private Long unreadNotifications;
}