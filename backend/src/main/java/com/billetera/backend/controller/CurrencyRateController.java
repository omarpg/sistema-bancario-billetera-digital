package com.billetera.backend.controller;

import com.billetera.backend.dto.response.CurrencyRateResponseDTO;
import com.billetera.backend.service.CurrencyRateUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/currency-rate")
@RequiredArgsConstructor
public class CurrencyRateController {

    private final CurrencyRateUpdateService currencyRateUpdateService;

    @GetMapping
    public ResponseEntity<List<CurrencyRateResponseDTO>> getUpdatedRates() {
        forceUpdateRates();
        List<CurrencyRateResponseDTO> currencies = currencyRateUpdateService.findAllRates();
        return ResponseEntity.ok(currencies);
    }

    @PostMapping("/update")
    public Map<String, Object> forceUpdateRates() {
        currencyRateUpdateService.forceUpdate();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Currency rates update triggered manually");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
}
