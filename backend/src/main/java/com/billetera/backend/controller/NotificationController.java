package com.billetera.backend.controller;

import com.billetera.backend.dto.response.NotificationResponseDTO;
import com.billetera.backend.service.NotificationService;
import com.billetera.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    /**
     * GET /api/notifications
     * Obtener últimas 20 notificaciones
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getNotifications(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        List<NotificationResponseDTO> notifications = notificationService.findByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET /api/notifications/unread-count
     * Contar notificaciones no leídas (para el badge)
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        long count = notificationService.countUnread(userId);

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/notifications/{id}/read
     * Marcar notificación como leída
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        NotificationResponseDTO notification = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(notification);
    }

    /**
     * PATCH /api/notifications/read-all
     * Marcar todas las notificaciones como leídas
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}