package com.billetera.backend.controller;

import com.billetera.backend.dto.request.ContactRequestDTO;
import com.billetera.backend.dto.response.ContactResponseDTO;
import com.billetera.backend.service.ContactService;
import com.billetera.backend.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final JwtUtil jwtUtil;

    /**
     * GET /api/contacts
     * Listar todos los contactos del usuario
     */
    @GetMapping
    public ResponseEntity<List<ContactResponseDTO>> getContacts(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        List<ContactResponseDTO> contacts = contactService.findByOwnerId(userId);
        return ResponseEntity.ok(contacts);
    }

    /**
     * GET /api/contacts/{id}
     * Obtener un contacto específico
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContactResponseDTO> getContactById(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        ContactResponseDTO contact = contactService.findById(id, userId);
        return ResponseEntity.ok(contact);
    }

    /**
     * POST /api/contacts
     * Crear nuevo contacto
     */
    @PostMapping
    public ResponseEntity<ContactResponseDTO> createContact(
            @Valid @RequestBody ContactRequestDTO request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        ContactResponseDTO contact = contactService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(contact);
    }

    /**
     * PUT /api/contacts/{id}
     * Actualizar contacto existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ContactResponseDTO> updateContact(
            @PathVariable UUID id,
            @Valid @RequestBody ContactRequestDTO request,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        ContactResponseDTO contact = contactService.update(id, request, userId);
        return ResponseEntity.ok(contact);
    }

    /**
     * DELETE /api/contacts/{id}
     * Eliminar contacto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteContact(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        contactService.delete(id, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Contacto eliminado exitosamente");
        return ResponseEntity.ok(response);
    }
}