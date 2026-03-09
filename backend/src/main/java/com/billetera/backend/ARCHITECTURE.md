# Arquitectura del Backend

## Capas de la aplicación

### 1. Controller Layer (@RestController)
**Responsabilidad:** Recibir requests HTTP, validar DTOs, delegar a Services, retornar responses.

**Reglas:**
- NO contiene lógica de negocio
- Solo convierte entre DTOs y entidades
- Maneja errores HTTP (400, 404, 500)

**Ejemplo:**
```java
@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;
    
    @GetMapping
    public List<AccountResponseDTO> getAccounts(@AuthenticationPrincipal UserDetails user) {
        return accountService.findByUserId(user.getId());
    }
}
```

### 2. Service Layer (@Service)
**Responsabilidad:** Lógica de negocio, validaciones, orquestación entre repositorios.

**Reglas:**
- Aquí van las reglas de negocio (validar saldo, generar OTP, etc.)
- Usa @Transactional cuando modifica datos
- Convierte entre entidades y DTOs

**Ejemplo:**
```java
@Service
public class TransferService {
    @Transactional
    public TransactionResponseDTO executeTransfer(TransferRequestDTO request) {
        // 1. Validar saldo suficiente
        // 2. Restar de cuenta origen
        // 3. Sumar a cuenta destino
        // 4. Crear registro en transactions
        // 5. Crear notificaciones
        // 6. Retornar DTO
    }
}
```

### 3. Repository Layer (JpaRepository)
**Responsabilidad:** Acceso a base de datos.

**Reglas:**
- Interfaces que extienden JpaRepository
- Spring genera la implementación automáticamente
- Métodos custom con @Query cuando sea necesario

**Ejemplo:**
```java
public interface AccountRepository extends JpaRepository<Account, UUID> {
    List<Account> findByUserId(UUID userId);
    
    @Query("SELECT a FROM Account a WHERE a.status = 'ACTIVE'")
    List<Account> findActiveAccounts();
}
```

### 4. Entity Layer (@Entity)
**Responsabilidad:** Mapeo ORM de las tablas de base de datos.

**Reglas:**
- Anotaciones JPA (@Entity, @Table, @Column)
- Relaciones con @ManyToOne, @OneToMany
- Constructores sin argumentos (required by JPA)
- Usar Lombok para reducir boilerplate

### 5. DTO Layer (Request/Response)
**Responsabilidad:** Contratos de la API (qué se envía/recibe).

**Reglas:**
- Separar DTOs de entidades (nunca exponer entidades directamente)
- Usar validaciones Jakarta (@NotNull, @Email, @Size)
- Dos tipos: Request (entrada) y Response (salida)

### 6. Exception Layer
**Responsabilidad:** Manejo centralizado de errores.

**Clases:**
- Custom exceptions (ResourceNotFoundException, etc.)
- @ControllerAdvice para capturar excepciones globalmente

### 7. Config Layer
**Responsabilidad:** Configuración de Spring Boot.

**Archivos:**
- SecurityConfig (Spring Security + JWT)
- CorsConfig (permitir requests desde Next.js)
- JwtFilter (validar tokens en cada request)

### 8. Util Layer
**Responsabilidad:** Funciones reutilizables.

**Ejemplos:**
- RutValidator (Módulo 11)
- OtpGenerator (códigos de 6 dígitos)
- JwtUtil (generar y validar tokens)