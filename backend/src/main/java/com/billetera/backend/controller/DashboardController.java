package com.billetera.backend.controller;

import com.billetera.backend.dto.response.DashboardSummaryDTO;
import com.billetera.backend.service.DashboardService;
import com.billetera.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final JwtUtil jwtUtil;

    /**
     * GET /api/dashboard/summary
     * Obtener resumen completo del dashboard
     */
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        DashboardSummaryDTO summary = dashboardService.getSummary(userId);
        return ResponseEntity.ok(summary);
    }
}