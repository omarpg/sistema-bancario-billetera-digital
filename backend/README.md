# 💼 Billetera Digital — Backend

> Sistema de Gestión de Billetera Digital orientado al sector bancario. Backend construído con Spring Boot 3.5, Java 17 y PostgreSQL.

[![Java](https://img.shields.io/badge/Java-17-orange?logo=oracle)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.10-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.6-blue?logo=postgresql)](https://www.postgresql.org/)
[![Maven](https://img.shields.io/badge/Maven-3.9+-red?logo=apache-maven)](https://maven.apache.org/)

---

## 📋 Descripción

Backend API REST para una billetera digital que simula las funcionalidades core de un sistema bancario:

- ✅ Autenticación con JWT + 2FA (OTP)
- ✅ Gestión de cuentas bancarias (CLP, USD, UF)
- ✅ Transferencias electrónicas (TEF) con validación de saldo
- ✅ Agenda de contactos con validación de RUT (Módulo 11)
- ✅ Historial de transacciones con filtros avanzados
- ✅ Centro de notificaciones en tiempo real
- ✅ Integración con API mindicador.cl para tasas de cambio
- ✅ Auditoría completa de eventos de seguridad

Este proyecto fue desarrollado como portafolio técnico para mostrar capacidades en desarrollo backend con tecnologías utilizadas en el sector financiero.

---

## 🏗️ Arquitectura

### Capas de la aplicación

```
┌─────────────────────────────────────────┐
│         Controllers (API REST)          │
│   Endpoints: /api/auth, /api/accounts   │
│   /api/transfers, /api/notifications    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│            Services (Lógica)            │
│  UserService, TransactionService, etc.  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│     Repositories (Spring Data JPA)      │
│   UserRepository, AccountRepository     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Base de Datos (PostgreSQL)         │
│        Supabase — 8 tablas              │
└─────────────────────────────────────────┘
```

### Estructura del proyecto

```
backend/
├── src/main/java/com/billetera/backend/
│   ├── controller/       # REST Controllers (@RestController)
│   ├── service/          # Lógica de negocio (@Service)
│   ├── repository/       # Spring Data JPA (@Repository)
│   ├── entity/           # Entidades JPA (@Entity)
│   ├── dto/              # Data Transfer Objects (Request/Response)
│   ├── config/           # Configuración (Security, CORS, JWT)
│   ├── exception/        # Manejo de errores personalizados
│   ├── util/             # Utilidades (validación RUT, generación OTP)
│   └── BackendApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── application-prod.properties
├── pom.xml
└── README.md
```

---

## 🚀 Tecnologías

| Categoría              | Tecnología          | Versión | Propósito                       |
|------------------------|---------------------|---------|---------------------------------|
| **Lenguaje**           | Java                | 17 LTS  | Base del proyecto               |
| **Framework**          | Spring Boot         | 3.5.10  | Framework web + DI              |
| **ORM**                | Hibernate (JPA)     | 6.6.x   | Mapeo objeto-relacional         |
| **Seguridad**          | Spring Security     | 6.x     | Autenticación y autorización    |
| **Base de datos**      | PostgreSQL          | 17.6    | BD relacional (Supabase)        |
| **Tokens**             | JJWT                | 0.12.x  | Generación y validación JWT     |
| **Pool de conexiones** | HikariCP            | 6.x     | Gestión eficiente de conexiones |
| **Validación**         | Hibernate Validator | 8.x     | Validación de DTOs              |
| **Utilidades**         | Lombok              | 1.18.x  | Reducción de boilerplate        |
| **Testing**            | JUnit 5 + Mockito   | 5.x     | Pruebas unitarias               |
| **Build**              | Maven               | 3.9+    | Gestión de dependencias         |

---

## 📦 Instalación y Setup

### Prerrequisitos

- **Java 17** ([Oracle JDK](https://www.oracle.com/java/technologies/downloads/) o [OpenJDK](https://openjdk.org/))
- **Maven 3.9+** (incluido en IntelliJ IDEA)
- **PostgreSQL 15+** (o cuenta en [Supabase](https://supabase.com))
- **IntelliJ IDEA** (recomendado y utilizado en este proyecto) o cualquier IDE con soporte Java

### 1. Clonar el repositorio

```bash
git clone https://github.com/omarpg/backend.git
cd backend
```

### 2. Configurar base de datos

Crea un archivo `application-local.properties` en `src/main/resources/`:

```properties
# Database (Supabase o PostgreSQL local)
spring.datasource.url=jdbc:postgresql://TU-HOST:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD

# JWT Secret (generar uno propio)
jwt.secret=TU_SECRET_KEY_AQUI
jwt.expiration=86400000
```

**Importante:** Nunca subir este archivo a Git. Ya está incluido en `.gitignore`.

### 3. Instalar dependencias

```bash
mvn clean install
```

### 4. Ejecutar la aplicación

**Desde terminal:**
```bash
mvn spring-boot:run
```

**Desde IntelliJ:**
- Abre `BackendApplication.java`
- Click en el botón verde ▶️ "Run"

La aplicación estará disponible en: **http://localhost:8080**

### 5. Verificar que funciona

```bash
curl http://localhost:8080/api/health
```

Respuesta esperada:
```json
{
  "status": "UP",
  "message": "Backend is running! Database connection OK.",
  "timestamp": "2026-02-06T10:30:00",
  "database": "Supabase PostgreSQL 17.6"
}
```

---

## 📚 API Endpoints

### Autenticación

| Método | Endpoint               | Descripción               | Auth    |
|--------|------------------------|---------------------------|---------|
| POST   | `/api/auth/register`   | Registro de nuevo usuario | No      |
| POST   | `/api/auth/login`      | Login (retorna JWT)       | No      |
| POST   | `/api/auth/verify-otp` | Validar código 2FA        | Parcial |

### Cuentas

| Método | Endpoint             | Descripción                  | Auth |
|--------|----------------------|------------------------------|------|
| GET    | `/api/accounts`      | Listar cuentas del usuario   | Sí   |
| GET    | `/api/accounts/{id}` | Detalle de cuenta específica | Sí   |

### Transferencias

| Método | Endpoint                      | Descripción                        | Auth |
|--------|-------------------------------|------------------------------------|------|
| POST   | `/api/transfers/initiate`     | Iniciar transferencia (genera OTP) | Sí   |
| POST   | `/api/transfers/confirm`      | Confirmar con OTP y ejecutar       | Sí   |
| GET    | `/api/transfers/{id}/receipt` | Descargar comprobante PDF          | Sí   |

### Contactos

| Método | Endpoint             | Descripción       | Auth |
|--------|----------------------|-------------------|------|
| GET    | `/api/contacts`      | Listar agenda     | Sí   |
| POST   | `/api/contacts`      | Agregar contacto  | Sí   |
| PUT    | `/api/contacts/{id}` | Editar contacto   | Sí   |
| DELETE | `/api/contacts/{id}` | Eliminar contacto | Sí   |

### Dashboard

| Método | Endpoint                 | Descripción                     | Auth |
|--------|--------------------------|---------------------------------|------|
| GET    | `/api/dashboard/summary` | Posición consolidada + gráficos | Sí   |

**Auth:** Indica si requiere token JWT en header `Authorization: Bearer {token}`

---

## 🔒 Seguridad

### Autenticación JWT + 2FA

1. Usuario hace login → Backend valida credenciales
2. Si tiene 2FA habilitado → Genera OTP de 6 dígitos
3. Usuario ingresa OTP → Backend valida y genera JWT final
4. Todas las requests posteriores incluyen JWT en header

### Validaciones implementadas

- ✅ RUT chileno validado con algoritmo Módulo 11
- ✅ Passwords hasheadas con BCrypt (factor 12)
- ✅ Validación de saldo antes de transferencias
- ✅ OTP expira después de 5 minutos
- ✅ OTP de un solo uso (flag `is_used`)

---

## 🎯 Decisiones Técnicas

### ¿Por qué Java 17 y no Java 21?

Java 17 es LTS y es la versión más adoptada en el sector bancario, sin considerar las versiones legacy más antiguas.

### ¿Por qué NUMERIC en lugar de FLOAT para montos?

En aplicaciones financieras, usar tipos FLOAT causa errores de redondeo. NUMERIC es exacto.

---

## 🔗 Repositorios Relacionados

- [Frontend Dashboard (Next.js)](https://github.com/omarpg/front-dashboard) — Aplicación web para clientes autenticados
- [Frontend Portal (Astro)](https://github.com/omarpg/front-portal) — Sitio público institucional

---

**Desarrollado con ☕ y Spring Boot**