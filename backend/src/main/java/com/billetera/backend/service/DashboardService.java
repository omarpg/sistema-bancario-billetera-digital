package com.billetera.backend.service;

import com.billetera.backend.dto.response.*;
import com.billetera.backend.entity.*;
import com.billetera.backend.entity.enums.AccountStatus;
import com.billetera.backend.entity.enums.AccountType;
import com.billetera.backend.entity.enums.NotificationType;
import com.billetera.backend.entity.enums.TransactionStatus;
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
        List<UUID> accountIds = accounts.stream().map(Account::getId).toList();
        List<AccountResponseDTO> accountDTOs = accounts.stream()
                .map(this::toAccountDTO).toList();

        // Obtener contactos
        List<Contact> contacts = contactRepository.findByOwnerId(userId);
        List<ContactResponseDTO> contactDTOs = contacts.stream()
                .map(this::toContactDTO).toList();

        // Calcular saldo total consolidado
        BigDecimal totalBalanceCLP = calculateTotalBalanceInCLP(accounts);
        BigDecimal totalBalanceUF = calculateTotalBalanceInUF(accounts);

        // Obtener últimas 5 transacciones completadas
        List<Transaction> recentTransactions = getRecentTransactions(accountIds);
        List<TransactionResponseDTO> recentTransactionDTOs = recentTransactions.stream()
            .map(transactionMapper::toDTO).collect(Collectors.toList());

        // Obtener últimas 5 notificaciones
        List<Notification> notifications = notificationRepository
                .findTop5ByUserIdOrderByCreatedAtDesc(userId);
        List<NotificationResponseDTO> notificationDTOs = notifications.stream()
                .map(this::toNotificationDTO)
                .collect(Collectors.toList());

        // Calcular gastos del mes agrupados por tipo
        Map<String, BigDecimal> monthlyExpenses = calculateMonthlyExpensesByType(userId);

        // Obtener indicadores económicos
        List<CurrencyRate> rates = currencyRateRepository.findAll();
        List<CurrencyRateResponseDTO> currencyRateDTOs = rates.stream()
                .map(this::toCurrencyRateDTO).collect(Collectors.toList());

        // Contar estadísticas
        int accountsCount = accounts.size();
        int contactsCount = contactRepository.findByOwnerId(userId).size();
        long unreadNotifications = notificationRepository.countByUserIdAndIsReadFalse(userId);

        return DashboardSummaryDTO.builder()
                .accounts(accountDTOs)
                .contacts(contactDTOs)
                .recentTransactions(recentTransactionDTOs)
                .recentNotifications(notificationDTOs)
                .totalBalanceCLP(totalBalanceCLP)
                .totalBalanceUF(totalBalanceUF)
                .monthlyExpensesByType(monthlyExpenses)
                .accountsCount(accountsCount)
                .contactsCount(contactsCount)
                .unreadNotifications(unreadNotifications)
                .currencyRates(currencyRateDTOs)
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
     private List<Transaction> getRecentTransactions(List<UUID> accountIds) {
        List<Transaction> allTransactions = transactionRepository.findByAccountIds(accountIds);

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

    /**
     * Métodos auxiliares para convertir entidades a DTOs
     */

    private AccountResponseDTO toAccountDTO(Account account) {
        return AccountResponseDTO.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .type(AccountType.valueOf(account.getType().name()))
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .status(AccountStatus.valueOf(account.getStatus().name()))
                .createdAt(account.getCreatedAt())
                .build();
    }

    private ContactResponseDTO toContactDTO(Contact contact) {
        return ContactResponseDTO.builder()
                .id(contact.getId())
                .fullName(contact.getFullName())
                .rut(contact.getRut())
                .bankName(contact.getBankName())
                .accountNumber(contact.getAccountNumber())
                .accountType(contact.getAccountType())
                .email(contact.getEmail())
                .createdAt(contact.getCreatedAt())
                .build();
    }

    private NotificationResponseDTO toNotificationDTO(Notification notification) {
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .type(NotificationType.valueOf(notification.getType().name()))
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .relatedTransactionId(
                    notification.getRelatedTransaction() != null 
                        ? notification.getRelatedTransaction().getId() 
                        : null
                )
                .createdAt(notification.getCreatedAt())
                .build();
    }

    private CurrencyRateResponseDTO toCurrencyRateDTO(CurrencyRate rate) {
        return CurrencyRateResponseDTO.builder()
                .code(rate.getCode())
                .value(rate.getValue())
                .updatedAt(rate.getUpdatedAt())
                .build();
    }
}