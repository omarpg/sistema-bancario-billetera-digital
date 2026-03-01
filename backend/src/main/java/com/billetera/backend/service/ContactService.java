package com.billetera.backend.service;

import com.billetera.backend.dto.request.ContactRequestDTO;
import com.billetera.backend.dto.response.ContactResponseDTO;
import com.billetera.backend.entity.Contact;
import com.billetera.backend.entity.User;
import com.billetera.backend.exception.BadRequestException;
import com.billetera.backend.exception.ResourceNotFoundException;
import com.billetera.backend.repository.ContactRepository;
import com.billetera.backend.repository.UserRepository;
import com.billetera.backend.util.RutValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final RutValidator rutValidator;

    /**
     * Listar todos los contactos del usuario
     */
    public List<ContactResponseDTO> findByOwnerId(UUID ownerId) {
        List<Contact> contacts = contactRepository.findByOwnerId(ownerId);

        return contacts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener un contacto específico
     */
    public ContactResponseDTO findById(UUID contactId, UUID ownerId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contacto no encontrado"));

        // Verificar que el contacto pertenece al usuario
        if (!contact.getOwner().getId().equals(ownerId)) {
            throw new ResourceNotFoundException("Contacto no encontrado");
        }

        return convertToDTO(contact);
    }

    /**
     * Crear nuevo contacto
     */
    @Transactional
    public ContactResponseDTO create(ContactRequestDTO request, UUID ownerId) {
        // Validar RUT
        String normalizedRut = rutValidator.normalize(request.getRut());
        if (!rutValidator.isValid(normalizedRut)) {
            throw new BadRequestException("RUT inválido");
        }

        // Buscar usuario propietario
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Crear contacto
        Contact contact = Contact.builder()
                .owner(owner)
                .fullName(request.getFullName())
                .rut(normalizedRut)
                .bankName(request.getBankName())
                .accountNumber(request.getAccountNumber())
                .accountType(request.getAccountType())
                .email(request.getEmail())
                .build();

        contact = contactRepository.save(contact);

        return convertToDTO(contact);
    }

    /**
     * Actualizar contacto existente
     */
    @Transactional
    public ContactResponseDTO update(UUID contactId, ContactRequestDTO request, UUID ownerId) {
        // Buscar contacto
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contacto no encontrado"));

        // Verificar propiedad
        if (!contact.getOwner().getId().equals(ownerId)) {
            throw new ResourceNotFoundException("Contacto no encontrado");
        }

        // Validar RUT si cambió
        String normalizedRut = rutValidator.normalize(request.getRut());
        if (!rutValidator.isValid(normalizedRut)) {
            throw new BadRequestException("RUT inválido");
        }

        // Actualizar campos
        contact.setFullName(request.getFullName());
        contact.setRut(normalizedRut);
        contact.setBankName(request.getBankName());
        contact.setAccountNumber(request.getAccountNumber());
        contact.setAccountType(request.getAccountType());
        contact.setEmail(request.getEmail());

        contact = contactRepository.save(contact);

        return convertToDTO(contact);
    }

    /**
     * Eliminar contacto
     */
    @Transactional
    public void delete(UUID contactId, UUID ownerId) {
        // Buscar contacto
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contacto no encontrado"));

        // Verificar propiedad
        if (!contact.getOwner().getId().equals(ownerId)) {
            throw new ResourceNotFoundException("Contacto no encontrado");
        }

        contactRepository.delete(contact);
    }

    /**
     * Convertir entidad a DTO
     */
    private ContactResponseDTO convertToDTO(Contact contact) {
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
}