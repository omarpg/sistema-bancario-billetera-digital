package com.billetera.backend.controller;

import com.billetera.backend.repository.UserRepository;
import com.billetera.backend.service.CurrencyRateUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final UserRepository userRepository;

    private final CurrencyRateUpdateService currencyRateUpdateService;

    @GetMapping
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Backend is running! Database connection OK.");
        response.put("timestamp", LocalDateTime.now());
        response.put("database", "Supabase PostgreSQL 17.6");
        return response;
    }

    @GetMapping("/db-test")
    public Map<String, Object> dbTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("usersCount", userRepository.count());
        response.put("message", "Database query OK!");
        return response;
    }

    @GetMapping("/protected")
    public Map<String, Object> protectedEndpoint(
            @AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Este es un endpoint protegido");
        response.put("authenticatedUser", userDetails.getUsername());
        return response;
    }

    @PostMapping("/update-rates")
    public Map<String, Object> forceUpdateRates() {
        currencyRateUpdateService.forceUpdate();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Currency rates update triggered manually");
        response.put("timestamp", LocalDateTime.now());
        return response;
    }
}