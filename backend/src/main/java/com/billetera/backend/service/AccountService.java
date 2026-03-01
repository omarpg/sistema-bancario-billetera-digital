package com.billetera.backend.service;

import com.billetera.backend.dto.response.AccountResponseDTO;
import com.billetera.backend.entity.Account;
import com.billetera.backend.entity.CurrencyRate;
import com.billetera.backend.entity.enums.AccountStatus;
import com.billetera.backend.exception.ResourceNotFoundException;
import com.billetera.backend.repository.AccountRepository;
import com.billetera.backend.repository.CurrencyRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final CurrencyRateRepository currencyRateRepository;

    /**
     * Listar todas las cuentas activas de un usuario
     */
    public List<AccountResponseDTO> findByUserId(UUID userId) {
        List<Account> accounts = accountRepository.findByUserIdAndStatus(userId, AccountStatus.ACTIVE);

        return accounts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener detalle de una cuenta específica
     */
    public AccountResponseDTO findById(UUID accountId, UUID userId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada"));

        // Verificar que la cuenta pertenece al usuario
        if (!account.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Cuenta no encontrada");
        }

        return convertToDTO(account);
    }

    /**
     * Convertir entidad Account a DTO
     */
    private AccountResponseDTO convertToDTO(Account account) {
        BigDecimal balanceInUF = calculateBalanceInUF(account.getBalance(), account.getCurrency());

        return AccountResponseDTO.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .type(account.getType())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .status(account.getStatus())
                .balanceInUF(balanceInUF)
                .createdAt(account.getCreatedAt())
                .build();
    }

    /**
     * Calcular balance equivalente en UF
     */
    private BigDecimal calculateBalanceInUF(BigDecimal balance, String currency) {
        if ("UF".equals(currency)) {
            return balance;
        }

        // Obtener tasa UF
        CurrencyRate ufRate = currencyRateRepository.findByCode("UF")
                .orElse(null);

        if (ufRate == null) {
            return BigDecimal.ZERO;
        }

        if ("CLP".equals(currency)) {
            // Balance en CLP / Valor UF = Balance en UF
            return balance.divide(ufRate.getValue(), 4, RoundingMode.HALF_UP);
        }

        if ("USD".equals(currency)) {
            // Obtener tasa USD
            CurrencyRate usdRate = currencyRateRepository.findByCode("USD")
                    .orElse(null);

            if (usdRate == null) {
                return BigDecimal.ZERO;
            }

            // Balance en USD * Valor USD = Balance en CLP
            BigDecimal balanceInCLP = balance.multiply(usdRate.getValue());
            // Balance en CLP / Valor UF = Balance en UF
            return balanceInCLP.divide(ufRate.getValue(), 4, RoundingMode.HALF_UP);
        }

        return BigDecimal.ZERO;
    }
}