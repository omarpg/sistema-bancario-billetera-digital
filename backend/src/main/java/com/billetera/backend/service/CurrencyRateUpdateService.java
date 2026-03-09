package com.billetera.backend.service;

import com.billetera.backend.dto.external.MindicadorResponseDTO;
import com.billetera.backend.entity.AuditLog;
import com.billetera.backend.entity.CurrencyRate;
import com.billetera.backend.repository.AuditLogRepository;
import com.billetera.backend.repository.CurrencyRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CurrencyRateUpdateService {

    private final CurrencyRateRepository currencyRateRepository;
    private final AuditLogRepository auditLogRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String MINDICADOR_URL = "https://mindicador.cl/api";

    /**
     * Job programado que se ejecuta
     * Cron: 9:30 AM y 9:30 PM
     */
    @Scheduled(cron = "0 30 9,21 * * *", zone = "America/Santiago")
    @Transactional
    public void updateCurrencyRates() {
        System.out.println("=== ACTUALIZANDO TASAS DE CAMBIO ===");
        System.out.println("Timestamp: " + LocalDateTime.now());

        try {
            // Consumir API de mindicador.cl
            MindicadorResponseDTO response = restTemplate.getForObject(
                    MINDICADOR_URL,
                    MindicadorResponseDTO.class
            );

            if (response != null) {
                // Actualizar UF
                if (response.getUf() != null && response.getUf().getValor() != null) {
                    updateRate("UF", response.getUf().getValor());
                    System.out.println("UF actualizada: " + response.getUf().getValor());
                }

                // Actualizar USD
                if (response.getDolar() != null && response.getDolar().getValor() != null) {
                    updateRate("USD", response.getDolar().getValor());
                    System.out.println("USD actualizado: " + response.getDolar().getValor());
                }

                // Actualizar EUR
                if (response.getEuro() != null && response.getEuro().getValor() != null) {
                    updateRate("EUR", response.getEuro().getValor());
                    System.out.println("EUR actualizado: " + response.getEuro().getValor());
                }

                // Registrar éxito en audit_logs
                logAudit("CURRENCY_RATES_UPDATE_SUCCESS", "Tasas actualizadas exitosamente");
                System.out.println("Actualización completada exitosamente");
            }

        } catch (Exception e) {
            System.err.println("Error actualizando tasas de cambio: " + e.getMessage());

            // Registrar error en audit_logs
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("error", e.getMessage());
            errorDetails.put("timestamp", LocalDateTime.now().toString());

            logAudit("CURRENCY_RATES_UPDATE_FAILED", errorDetails);
        }

        System.out.println("====================================");
    }

    /**
     * Actualizar o crear una tasa de cambio
     */
    private void updateRate(String code, java.math.BigDecimal value) {
        CurrencyRate rate = currencyRateRepository.findByCode(code)
                .orElse(CurrencyRate.builder()
                        .code(code)
                        .build());

        rate.setValue(value);
        rate.setUpdatedAt(LocalDateTime.now());

        currencyRateRepository.save(rate);
    }

    /**
     * Registrar evento en audit_logs
     */
    private void logAudit(String action, Object details) {
        Map<String, Object> detailsMap = new HashMap<>();
        if (details instanceof String) {
            detailsMap.put("message", details);
        } else if (details instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> castedMap = (Map<String, Object>) details;
            detailsMap = castedMap;
        }

        AuditLog log = AuditLog.builder()
                .user(null)  // Sistema, no hay usuario
                .action(action)
                .details(detailsMap)
                .build();

        auditLogRepository.save(log);
    }

    /**
     * Funcionalidad manual para forzar actualización (útil para testing)
     * No lleva @Transactional porque llama a updateCurrencyRates que ya lo tiene
     */
    public void forceUpdate() {
        updateCurrencyRates();
    }
}