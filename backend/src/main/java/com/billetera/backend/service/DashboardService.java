package com.billetera.backend.service;

import com.billetera.backend.dto.response.DashboardSummaryDTO;
import com.billetera.backend.dto.response.TransactionResponseDTO;
import com.billetera.backend.entity.Account;
import com.billetera.backend.entity.CurrencyRate;
import com.billetera.backend.entity.Transaction;
import com.billetera.backend.entity.enums.AccountStatus;
import com.billetera.backend.entity.enums.TransactionStatus;
//import com.billetera.backend.entity.enums.TransactionType;
import com.billetera.backend.repository.*;
import com.billetera.backend.util.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final ContactRepository contactRepository;
    private final NotificationRepository notificationRepository;
    private final CurrencyRateRepository currencyRateRepository;
    private final TransactionMapper transactionMapper;

    /**
     * Obtener resumen completo del dashboard
     */
    public DashboardSummaryDTO getSummary(UUID userId) {
        // Obtener todas las cuentas activas
        List<Account> accounts = accountRepository.findByUserIdAndStatus(userId, AccountStatus.ACTIVE);

        // Calcular saldo total consolidado
        BigDecimal totalBalanceCLP = calculateTotalBalanceInCLP(accounts);
        BigDecimal totalBalanceUF = calculateTotalBalanceInUF(accounts);

        // Obtener últimas 5 transacciones completadas
        List<Transaction> recentTransactions = getRecentTransactions(userId);
        List<TransactionResponseDTO> recentTransactionDTOs = recentTransactions.stream()
            .map(transactionMapper::toDTO).collect(Collectors.toList());

        // Calcular gastos del mes agrupados por tipo
        Map<String, BigDecimal> monthlyExpenses = calculateMonthlyExpensesByType(userId);

        // Contar estadísticas
        int accountsCount = accounts.size();
        int contactsCount = contactRepository.findByOwnerId(userId).size();
        long unreadNotifications = notificationRepository.countByUserIdAndIsReadFalse(userId);

        return DashboardSummaryDTO.builder()
                .totalBalanceCLP(totalBalanceCLP)
                .totalBalanceUF(totalBalanceUF)
                .recentTransactions(recentTransactionDTOs)
                .monthlyExpensesByType(monthlyExpenses)
                .accountsCount(accountsCount)
                .contactsCount(contactsCount)
                .unreadNotifications(unreadNotifications)
                .build();
    }

    /**
     * Calcular balance total consolidado en CLP
     */
    private BigDecimal calculateTotalBalanceInCLP(List<Account> accounts) {
        BigDecimal total = BigDecimal.ZERO;

        for (Account account : accounts) {
            BigDecimal balanceInCLP = convertToCLP(account.getBalance(), account.getCurrency());
            total = total.add(balanceInCLP);
        }

        return total;
    }

    /**
     * Calcular balance total consolidado en UF
     */
    private BigDecimal calculateTotalBalanceInUF(List<Account> accounts) {
        BigDecimal totalCLP = calculateTotalBalanceInCLP(accounts);

        CurrencyRate ufRate = currencyRateRepository.findByCode("UF").orElse(null);
        if (ufRate == null) {
            return BigDecimal.ZERO;
        }

        return totalCLP.divide(ufRate.getValue(), 4, RoundingMode.HALF_UP);
    }

    /**
     * Convertir balance a CLP
     */
    private BigDecimal convertToCLP(BigDecimal balance, String currency) {
        if ("CLP".equals(currency)) {
            return balance;
        }

        if ("UF".equals(currency)) {
            CurrencyRate ufRate = currencyRateRepository.findByCode("UF").orElse(null);
            if (ufRate != null) {
                return balance.multiply(ufRate.getValue());
            }
        }

        if ("USD".equals(currency)) {
            CurrencyRate usdRate = currencyRateRepository.findByCode("USD").orElse(null);
            if (usdRate != null) {
                return balance.multiply(usdRate.getValue());
            }
        }

        return BigDecimal.ZERO;
    }

    /**
     * Obtener últimas 5 transacciones del usuario
     */
    private List<Transaction> getRecentTransactions(UUID userId) {
        List<Transaction> allTransactions = transactionRepository
                .findByUserIdAndStatus(userId, TransactionStatus.COMPLETED);

        return allTransactions.stream()
                .limit(5)
                .collect(Collectors.toList());
    }

    /**
     * Calcular gastos del mes actual agrupados por tipo
     */
    private Map<String, BigDecimal> calculateMonthlyExpensesByType(UUID userId) {
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().atTime(23, 59, 59);

        List<Transaction> monthlyTransactions = transactionRepository
                .findByUserIdAndDateRange(userId, startOfMonth, endOfMonth);

        Map<String, BigDecimal> expensesByType = new HashMap<>();
        expensesByType.put("TRANSFER", BigDecimal.ZERO);
        expensesByType.put("WITHDRAWAL", BigDecimal.ZERO);
        expensesByType.put("FEE", BigDecimal.ZERO);

        for (Transaction transaction : monthlyTransactions) {
            // Solo contar transacciones completadas donde el usuario es el origen (gastos)
            if (transaction.getStatus() == TransactionStatus.COMPLETED &&
                    transaction.getSourceAccount() != null &&
                    transaction.getSourceAccount().getUser().getId().equals(userId)) {

                String type = transaction.getType().name();
                BigDecimal currentAmount = expensesByType.getOrDefault(type, BigDecimal.ZERO);
                expensesByType.put(type, currentAmount.add(transaction.getAmount()));
            }
        }

        return expensesByType;
    }
}