# 🔧 Backend - Billetera Digital

API REST desarrollada con **Spring Boot 3.5** que proporciona servicios de autenticación, gestión de cuentas bancarias, transferencias y notificaciones.

---

## 🚀 Stack Tecnológico

- **Java 17**
- **Spring Boot 3.5.10**
- **Spring Security 6.x** (JWT + 2FA con OTP)
- **Spring Data JPA** (Hibernate)
- **PostgreSQL 16**
- **Maven 3.8+**
- **Lombok**
- **BCrypt** (hash de contraseñas)

---

## 📁 Estructura del Proyecto
```
backend/
├── database/
│   ├── schema-docker.sql        # Script para PostgreSQL local (Docker)
│   └── schema-supabase.sql      # Script para Supabase
├── src/
│   ├── main/
│   │   ├── java/com/billetera/backend/
│   │   │   ├── config/          # Configuraciones (Security, CORS, JWT)
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # Entidades JPA (Users, Accounts, etc.)
│   │   │   ├── exception/       # Manejo de excepciones
│   │   │   ├── repository/      # Repositorios JPA
│   │   │   ├── service/         # Lógica de negocio
│   │   │   └── util/            # Utilidades (JWT, RUT validator)
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── Dockerfile
├── .dockerignore
└── pom.xml
```

---

## 🗄️ Modelo de Datos

### Entidades Principales

- **Users** - Usuarios del sistema
- **Accounts** - Cuentas bancarias (Vista, Corriente, Ahorro)
- **Contacts** - Contactos para transferencias
- **Transactions** - Historial de transacciones
- **OtpCodes** - Códigos 2FA temporales
- **Notifications** - Notificaciones del sistema
- **CurrencyRates** - Indicadores económicos (UF, USD, EUR)
- **AuditLogs** - Registro de auditoría

### Relaciones
```
Users (1) ──── (N) Accounts
Users (1) ──── (N) Contacts
Users (1) ──── (N) OtpCodes
Users (1) ──── (N) Notifications
Users (1) ──── (N) AuditLogs
Accounts (1) ── (N) Transactions (source)
Accounts (1) ── (N) Transactions (destination)
Transactions (1) ── (N) Notifications
```

Ver diagrama completo en: [`/docs/architecture/database-schema.md`](../docs/architecture/database-schema.md)

---

## 🔐 Seguridad

### Autenticación

- **JWT** (JSON Web Tokens) con expiración de 24 horas
- **2FA** opcional con códigos OTP de 6 dígitos (válidos por 5 minutos)
- **BCrypt** para hash de contraseñas (strength 10)

### Autorización

- Endpoints públicos: `/api/auth/**`
- Endpoints protegidos: Requieren `Authorization: Bearer <token>`
- Validación de permisos por usuario (solo accede a sus propios datos)

### Validaciones

- **RUT chileno** con dígito verificador
- **Saldo suficiente** antes de transferencias
- **Límites de transferencia** configurables
- **Protección CSRF** deshabilitada (API stateless)
- **CORS** configurado para frontends locales

---

## 📡 API Endpoints

### Autenticación

| Método | Endpoint               | Descripción                         |
| ------ | ---------------------- | ----------------------------------- |
| POST   | `/api/auth/register`   | Registrar nuevo usuario             |
| POST   | `/api/auth/login`      | Login (devuelve JWT o requiere OTP) |
| POST   | `/api/auth/verify-otp` | Verificar código 2FA                |

### Cuentas

| Método | Endpoint             | Descripción                |
| ------ | -------------------- | -------------------------- |
| GET    | `/api/accounts`      | Listar cuentas del usuario |
| GET    | `/api/accounts/{id}` | Detalle de cuenta          |
| POST   | `/api/accounts`      | Crear nueva cuenta         |

### Transferencias

| Método | Endpoint              | Descripción                 |
| ------ | --------------------- | --------------------------- |
| POST   | `/api/transfers`      | Realizar transferencia      |
| GET    | `/api/transfers`      | Historial de transferencias |
| GET    | `/api/transfers/{id}` | Detalle de transferencia    |

### Contactos

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/contacts`      | Listar contactos    |
| POST   | `/api/contacts`      | Crear contacto      |
| PUT    | `/api/contacts/{id}` | Actualizar contacto |
| DELETE | `/api/contacts/{id}` | Eliminar contacto   |

### Notificaciones

| Método | Endpoint                       | Descripción           |
| ------ | ------------------------------ | --------------------- |
| GET    | `/api/notifications`           | Listar notificaciones |
| PATCH  | `/api/notifications/{id}/read` | Marcar como leída     |

### Indicadores Económicos

| Método | Endpoint              | Descripción          |
| ------ | --------------------- | -------------------- |
| GET    | `/api/currency-rates` | Obtener UF, USD, EUR |

Ver documentación completa en: [`/docs/architecture/backend-layers.md`](../docs/architecture/backend-layers.md)

---

## ⚙️ Configuración

### Variables de Entorno (Docker)

Sobrescritas automáticamente por `docker-compose.yml`:
```yaml
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/billetera_digital
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
JWT_SECRET=clave-super-secreta-docker...
```

### Configuración Manual (Supabase)

Editar `src/main/resources/application.properties`:
```properties
# ⚠️ Reemplazar con credenciales de Supabase
spring.datasource.url=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD_SUPABASE
```

---

## 🚀 Ejecución

### Con Docker (Recomendado)
```bash
# Desde la raíz del proyecto
docker-compose up
```

Backend disponible en: `http://localhost:8080`

---

### Con Maven (Supabase)
```bash
# Ejecutar base de datos en Supabase
# Ver: /database/schema-supabase.sql

# Instalar dependencias y ejecutar
mvn spring-boot:run
```

Backend disponible en: `http://localhost:8080`

---

## 🧪 Testing
```bash
# Ejecutar tests unitarios
mvn test

# Ejecutar con cobertura
mvn test jacoco:report

# Ver reporte en:
# target/site/jacoco/index.html
```

---

## 🗂️ Base de Datos

### Inicializar con Docker
```bash
docker-compose up postgres
# Se ejecuta automáticamente: database/schema-docker.sql
```

### Inicializar con Supabase

1. Ir a Supabase → SQL Editor
2. Ejecutar contenido de: `database/schema-supabase.sql`

---

## 📊 Jobs Programados

- **CurrencyRateJob**: Actualiza UF, USD, EUR desde mindicador.cl cada 6 horas

---

## 🔧 Herramientas de Desarrollo

- **Lombok**: Reduce boilerplate (getters, setters, builders)
- **Spring DevTools**: Hot reload en desarrollo
- **H2 Console**: Base de datos en memoria para tests (opcional)

---

## 📝 Notas

- Las fechas `created_at` son manejadas automáticamente por JPA (`@PrePersist`)
- Los ENUMs de PostgreSQL están mapeados como `@Enumerated(EnumType.STRING)`
- El `operation_number` de transacciones usa secuencia autoincrementable

---

## 📚 Documentación Adicional

- [Arquitectura del Sistema](../docs/architecture/system-overview.md)
- [Flujo de Autenticación](../docs/architecture/auth-flow.md)
- [Flujo de Transferencias](../docs/architecture/transfer-flow.md)
- [Schema de Base de Datos](../docs/architecture/database-schema.md)

---

Desarrollado con ☕ y Spring Boot