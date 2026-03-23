# Arquitectura del Backend

## Patrón de Arquitectura

Este proyecto sigue el patrón **Layered Architecture (Arquitectura en Capas)** combinado con principios de **Domain-Driven Design (DDD)** simplificado.

---

## 🏗️ Estructura de Capas
```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Capa de Presentación)                  │
│  ├─ Controllers (@RestController)                           │
│  ├─ DTOs (Request/Response)                                 │
│  └─ Exception Handlers (@ControllerAdvice)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Capa de Aplicación)                     │
│  ├─ Services (@Service)                                     │
│  │   ├─ Domain Services (TransferService, AccountService)   │
│  │   └─ Infrastructure Services (NotificationService)       │
│  └─ Config (SecurityConfig, CorsConfig)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  DOMAIN LAYER (Capa de Dominio)                             │
│  ├─ Entities (@Entity)                                      │
│  └─ Enums (TransactionStatus, AccountType, etc.)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE LAYER (Capa de Infraestructura)             │
│  ├─ Repositories (JpaRepository)                            │
│  ├─ Database (PostgreSQL)                                   │
│  ├─ Security (JWT, Filters)                                 │
│  └─ Utils (RutValidator, OtpGenerator, JwtUtil)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Componentes por Capa

### 1. PRESENTATION LAYER (Capa de Presentación)

**Responsabilidad:** Interfaz HTTP con el exterior. Recibe requests, valida datos, delega a servicios y retorna responses.

#### 1.1. Controllers (@RestController)

**Función:** Exponer endpoints REST de la API.

**Reglas:**
- ❌ NO contiene lógica de negocio
- ✅ Solo coordina entre DTOs y servicios
- ✅ Maneja códigos de estado HTTP (200, 400, 404, 500)
- ✅ Valida autenticación/autorización con Spring Security

**Ubicación:** `src/main/java/.../controller/`

---

#### 1.2. DTOs (Data Transfer Objects)

**Función:** Contratos de la API (qué se envía y qué se recibe).

**Reglas:**
- ✅ **Nunca exponer entidades directamente** en controllers
- ✅ Separar Request DTOs (entrada) de Response DTOs (salida)
- ✅ Usar validaciones Jakarta (`@NotNull`, `@Email`, `@Size`, `@Pattern`)
- ✅ Usar Lombok `@Data` y `@Builder`

**Nomenclatura: (ejemplos)**
```
LoginRequestDTO              → Entrada para login
LoginResponseDTO             → Respuesta del login
TransferInitiateRequestDTO   → Iniciar transferencia
TransferConfirmRequestDTO    → Confirmar transferencia
TransferResponseDTO          → Respuesta de transferencia
```

**Ubicación:** `src/main/java/.../dto/`

---

#### 1.3. Exception Handlers

**Función:** Manejo centralizado de errores con respuestas consistentes.

**Ubicación:** `src/main/java/.../exception/`

---

### 2. APPLICATION LAYER (Capa de Aplicación)

**Responsabilidad:** Lógica de negocio, orquestación de casos de uso, transacciones.

#### 2.1. Services (@Service)

**Función:** Implementar la lógica de negocio de la aplicación.

**Tipos de Servicios:**

##### A. Domain Services (Servicios de Dominio)
Manejan lógica de negocio de una entidad específica:
- `TransferService` → Transferencias
- `AccountService` → Cuentas
- `SecurityService` → Seguridad (cambio de contraseña)
- `AuthService` → Autenticación y registro
- `ContactService` → Contactos
- `CurrencyRateUpdateService` → Job programado para mindicador.cl
- `DashboardService` → Resumen de datos para Dashboard
- `TransactionService` → Historial de Transacciones

##### B. Infrastructure Services (Servicios de Infraestructura)
Proveen funcionalidades compartidas/transversales:
- `NotificationService` → Notificaciones (usado por varios servicios)

**Reglas:**
- ✅ Aquí van las reglas de negocio (validar saldo, generar OTP, etc.)
- ✅ Usa `@Transactional` cuando modifica datos
- ✅ Puede llamar a otros servicios (ej: TransferService → NotificationService)
- ✅ Convierte entre entidades y DTOs
- ❌ NO debe tener dependencias circulares

**Comunicación entre Servicios:**
```
TransferService
    ├─ TransactionRepository  ✅ (acceso directo a su repositorio)
    ├─ AccountRepository      ✅ (entidad relacionada)
    └─ NotificationService    ✅ (servicio compartido)

SecurityService
    ├─ UserRepository         ✅ (acceso directo a su repositorio)
    └─ NotificationService    ✅ (servicio compartido)

AuthService
    ├─ UserRepository         ✅ (acceso directo a su repositorio)
    ├─ AccountRepository      ✅ (entidad relacionada)
    └─ NotificationService    ✅ (servicio compartido)
```

**Ubicación:** `src/main/java/.../service/`

---

#### 2.2. Configuration

**Función:** Configuración de Spring Boot, seguridad y otras librerías.

**Componentes principales:**
- `CustomUserDetailsService`
- `JwtRequestFilter`
- `JwtUtil`
- `SecurityConfig`

**Ubicación:** `src/main/java/.../config/`

---

### 3. DOMAIN LAYER (Capa de Dominio)

**Responsabilidad:** Modelo de dominio del negocio. Representa las entidades y conceptos centrales.

#### 3.1. Entities (@Entity)

**Función:** Mapeo ORM (Object-Relational Mapping) de las tablas de base de datos.

**Reglas:**
- ✅ Anotaciones JPA (`@Entity`, `@Table`, `@Column`, `@Id`)
- ✅ Relaciones con `@ManyToOne`, `@OneToMany`, `@ManyToMany`
- ✅ Usar `@Enumerated(EnumType.STRING)` para ENUMs de PostgreSQL
- ✅ Usar Lombok (`@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`)
- ✅ Fechas con `@PrePersist` o valores por defecto

**Entidades del Proyecto:**
1. `User` - Usuarios del sistema
2. `Account` - Cuentas bancarias
3. `Transaction` - Transacciones/transferencias
4. `Contact` - Contactos guardados
5. `Notification` - Notificaciones
6. `OtpCode` - Códigos OTP para 2FA
7. `CurrencyRate` - Tasas de cambio (UF, USD, EUR)
8. `AuditLog` - Registro de auditoría

**Ubicación:** `src/main/java/.../entity/`

---

#### 3.2. Enums

**Función:** Definir valores permitidos para ciertos campos.

**Enums del Proyecto:**
```java
public enum AccountType {
    VISTA, CORRIENTE, AHORRO
}

public enum AccountStatus {
    ACTIVE, CLOSED, BLOCKED
}

public enum TransactionType {
    TRANSFER, DEPOSIT, WITHDRAWAL, FEE
}

public enum TransactionStatus {
    PENDING, CONFIRMED, COMPLETED, FAILED
}

public enum NotificationType {
    TRANSFER_SENT, 
    TRANSFER_RECEIVED, 
    LOGIN_NEW_DEVICE,      // ⏸️ No implementado
    PASSWORD_CHANGED, 
    SYSTEM
}

public enum OtpPurpose {
    LOGIN_2FA, 
    TRANSFER_CONFIRM, 
    PASSWORD_RESET
}
```

**Ubicación:** `src/main/java/.../entity/enums` 

---

### 4. INFRASTRUCTURE LAYER (Capa de Infraestructura)

**Responsabilidad:** Detalles técnicos de implementación (persistencia, seguridad, utilidades).

#### 4.1. Repositories (JpaRepository)

**Función:** Acceso a base de datos mediante Spring Data JPA.

**Reglas:**
- ✅ Interfaces que extienden `JpaRepository<Entity, ID>`
- ✅ Spring genera la implementación automáticamente
- ✅ Métodos derivados del nombre (findBy, existsBy, countBy)
- ✅ Queries custom con `@Query` cuando sea necesario

**Ubicación:** `src/main/java/.../repository/`

---

#### 4.2. Utils (Utilidades)

**Función:** Funciones reutilizables y helpers.

**Componentes:**
- `OtpGenerator`
- `RutValidator`
- `JwtUtil`
- `TransactionMapper`

**Ubicación:** `src/main/java/.../util/`

---

## 🔄 Flujo Completo de una Transferencia
```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Cliente envía POST /api/transfers/initiate                  │
│    Body: { sourceAccountId, amount, contactId, ... }           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. PRESENTATION LAYER                                           │
│    TransferController:                                          │
│    - Valida DTO (@Valid)                                        │
│    - Extrae userId del token JWT                                │
│    - Llama a transferService.initiate()                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. APPLICATION LAYER                                            │
│    TransferService:                                             │
│    - Valida saldo suficiente                                    │
│    - Crea Transaction en estado PENDING                         │
│    - Genera código OTP (OtpGenerator)                           │
│    - Guarda OTP en BD                                           │
│    - Retorna TransferResponseDTO                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. INFRASTRUCTURE LAYER                                         │
│    TransactionRepository.save(transaction)                      │
│    OtpCodeRepository.save(otpCode)                              │
│    → PostgreSQL guarda datos                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Response al cliente                                          │
│    { requireOtp: true, transactionId: "...", message: "..." }  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Cliente envía POST /api/transfers/:id/confirm               │
│    Body: { transactionId, otpCode }                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. PRESENTATION LAYER                                           │
│    TransferController:                                          │
│    - Valida DTO                                                 │
│    - Llama a transferService.confirm()                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. APPLICATION LAYER                                            │
│    TransferService:                                             │
│    - Valida OTP                                                 │
│    - Actualiza balances (origen y destino)                      │
│    - Cambia status a COMPLETED                                  │
│    - Llama a NotificationService                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. APPLICATION LAYER                                            │
│    NotificationService:                                         │
│    - Detecta tipo de transferencia                              │
│    - Crea notificación(es) según el caso                        │
│      * Externa → 1 TRANSFER_SENT                                │
│      * Propia → 1 SYSTEM                                        │
│      * Otro usuario → 2 (SENT + RECEIVED)                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. INFRASTRUCTURE LAYER                                        │
│     AccountRepository.save() x2                                 │
│     TransactionRepository.save()                                │
│     NotificationRepository.save()                               │
│     → PostgreSQL actualiza datos                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 11. Response al cliente                                         │
│     { status: "COMPLETED", operationNumber: ..., ... }          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Principios SOLID

| Principio | Cumplimiento | Evidencia |
|-----------|--------------|-----------|
| **S**ingle Responsibility | ✅ | Cada servicio tiene una responsabilidad clara |
| **O**pen/Closed | ✅ | Se pueden agregar servicios sin modificar existentes |
| **L**iskov Substitution | N/A | No usamos herencia en servicios |
| **I**nterface Segregation | ✅ | Repositorios no tienen métodos innecesarios |
| **D**ependency Inversion | ✅ | Servicios dependen de abstracciones (repositorios) |

#### ❓ Por Qué NO Usamos Interfaces para Servicios

Usemos un ejemplo: ¿Habrá múltiples implementaciones de `TransferService`?

- ❌ NO tendremos `TransferServicePostgresImpl` y `TransferServiceMongoImpl`
- ❌ NO tendremos `TransferServiceV1` y `TransferServiceV2`
- ❌ NO necesitamos intercambiar implementaciones en runtime

**Conclusión:** Las interfaces serían código muerto para este proyecto. Serían importantes y necesarias para proyectos más grandes y robustos.

---

## 📚 Referencias

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

---