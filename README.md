# 💰 Billetera Digital

Aplicación web full-stack de billetera digital que simula funcionalidades bancarias reales, incluyendo transferencias con autenticación de dos factores, gestión de contactos, y administración de múltiples cuentas.

> **Nota:** Este es un proyecto de portafolio/demostración. No debe usarse con datos financieros reales.

---

## 📸 Screenshots

### Portal Público
![Home Page](docs/screenshots/portal-home.png)
*Landing page optimizada con Lighthouse 100/100*

![Simulador](docs/screenshots/portal-simulator.png)
*Simulador de crédito interactivo con cálculos en tiempo real*

![Indicadores](docs/screenshots/portal-indicators.png)
*Indicadores económicos actualizados desde mindicador.cl*

### Dashboard de Usuario
![Login](docs/screenshots/dashboard-login.png)
*Login con autenticación de dos factores*

![Dashboard](docs/screenshots/dashboard-home.png)
*Vista principal con resumen de cuentas y actividad*

![Transferencias](docs/screenshots/dashboard-transfers.png)
*Flujo completo de transferencia en 3 pasos con verificación OTP*

![Comprobante](docs/screenshots/dashboard-receipt.png)
*Comprobante de transferencia con opción de descarga*

---

## 🚀 Características Principales

### 🌐 Portal Público (Astro)
- ✅ Landing page optimizada (Lighthouse 100/100 en todas las métricas)
- ✅ Simulador de crédito con cálculos en tiempo real
- ✅ Indicadores económicos (UF, USD, EUR) desde API pública
- ✅ Sistema de registro conectado al backend
- ✅ SEO completo (sitemap, robots.txt, meta tags, JSON-LD)
- ✅ Diseño responsive y accesible

### 🔐 Autenticación y Seguridad
- ✅ JWT (JSON Web Tokens) para autenticación
- ✅ Autenticación de dos factores (2FA) con OTP por email
- ✅ Encriptación de contraseñas con BCrypt
- ✅ Validación de RUT chileno
- ✅ Protección de rutas en frontend y backend
- ✅ Manejo seguro de sesiones con Zustand + localStorage

### 💳 Gestión de Cuentas
- ✅ Creación automática de Cuenta Vista al registrarse
- ✅ Soporte para múltiples cuentas (Vista, Corriente, Ahorro)
- ✅ Visualización de saldo en tiempo real
- ✅ Historial de movimientos por cuenta
- ✅ Estados de cuenta (Activa, Inactiva, Bloqueada)

### 💸 Transferencias
- ✅ Flujo completo en 3 pasos:
  1. Ingreso de datos (cuenta origen, destinatario, monto)
  2. Confirmación de detalles
  3. Verificación con código OTP
- ✅ Transferencias solo a contactos guardados
- ✅ Validación de saldo disponible
- ✅ Generación de comprobante descargable
- ✅ Actualización automática de saldos

### 👥 Gestión de Contactos
- ✅ CRUD completo de contactos
- ✅ Validación de RUT chileno con formato automático
- ✅ Selección de banco y tipo de cuenta
- ✅ Búsqueda y filtrado
- ✅ Asociación con transferencias

### 📊 Transacciones
- ✅ Historial completo de movimientos
- ✅ Filtros por tipo (Transferencia, Depósito, Retiro)
- ✅ Filtros por estado (Pendiente, Confirmada, Completada, Fallida)
- ✅ Búsqueda por descripción o número de operación
- ✅ Vista detallada de cada transacción

### 🔔 Notificaciones
- ✅ Sistema de notificaciones por tipo (Transferencia, Seguridad, Sistema)
- ✅ Marcar como leídas individualmente o todas
- ✅ Contador de notificaciones sin leer
- ✅ Filtros por estado de lectura

### ⚙️ Configuración de Seguridad
- ✅ Cambio de contraseña con validación
- ✅ Activar/desactivar autenticación de dos factores
- ✅ Visualización de último acceso
- ✅ Historial de cambios de seguridad

### 📈 Datos Económicos
- ✅ Job programado que actualiza indicadores 2 veces al día
- ✅ Almacenamiento en base de datos para consultas rápidas
- ✅ Integración con API de mindicador.cl
- ✅ Sistema de fallback en caso de falla de API

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología      | Versión | Propósito                    |
| --------------- | ------- | ---------------------------- |
| Java            | 17      | Lenguaje principal           |
| Spring Boot     | 3.5.10  | Framework web                |
| Spring Security | 6.x     | Autenticación y autorización |
| Spring Data JPA | 3.x     | ORM y persistencia           |
| PostgreSQL      | 16+     | Base de datos                |
| JWT             | -       | Tokens de autenticación      |
| BCrypt          | -       | Hash de contraseñas          |
| Maven           | 3.8+    | Gestión de dependencias      |
| Lombok          | -       | Reducción de boilerplate     |

### Frontend - Dashboard
| Tecnología      | Versión | Propósito                |
| --------------- | ------- | ------------------------ |
| Next.js         | 15      | Framework React con SSR  |
| React           | 19      | Librería UI              |
| TypeScript      | 5.x     | Tipado estático          |
| Tailwind CSS    | 4.x     | Estilos utility-first    |
| Zustand         | 5.x     | Gestión de estado global |
| Axios           | 1.x     | Cliente HTTP             |
| React Hot Toast | -       | Notificaciones           |

### Frontend - Portal Público
| Tecnología   | Versión | Propósito          |
| ------------ | ------- | ------------------ |
| Astro        | 5       | Framework estático |
| Tailwind CSS | 4.x     | Estilos            |
| TypeScript   | 5.x     | Tipado estático    |

### Base de Datos
- **PostgreSQL 16** en Supabase
- 8 tablas principales: `users`, `accounts`, `transactions`, `contacts`, `notifications`, `otp_codes`, `currency_rates`, `audit_logs`

---

## 📦 Instalación y Configuración

### Requisitos Previos

- **Java JDK 17** o superior
- **Node.js 18** o superior
- **PostgreSQL 16** (o cuenta de Supabase)
- **Maven 3.8** o superior
- **npm** o **pnpm**

---

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/billetera-digital.git
cd billetera-digital
```

---

### 2️⃣ Configurar Base de Datos

#### Opción A: Usar Supabase (Recomendado)

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Ejecutar el script SQL en el editor SQL:
```sql
-- Ver archivo: database/schema.sql
```

#### Opción B: PostgreSQL Local

1. Crear base de datos:
```sql
CREATE DATABASE billetera_digital;
```

2. Ejecutar scripts de creación:
```bash
psql -U postgres -d billetera_digital -f database/schema.sql
```

---

### 3️⃣ Backend (Spring Boot)

#### Configurar Variables de Entorno

Crear archivo `backend/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/billetera_digital
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=tu-clave-secreta-muy-larga-y-segura-de-al-menos-256-bits
jwt.expiration=86400000

# Email Configuration (opcional para OTP por email)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-app-password

# Server Configuration
server.port=8080
```

#### Instalar Dependencias y Ejecutar
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

---

### 4️⃣ Frontend - Dashboard (Next.js)

#### Configurar Variables de Entorno

Crear archivo `dashboard/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

#### Instalar Dependencias y Ejecutar
```bash
cd dashboard
npm install
npm run dev
```

El dashboard estará disponible en `http://localhost:3000`

---

### 5️⃣ Frontend - Portal (Astro)

#### Instalar Dependencias y Ejecutar
```bash
cd front-portal
npm install
npm run dev
```

El portal estará disponible en `http://localhost:4321`

---

## 🗄️ Estructura del Proyecto
```
billetera-digital/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/billetera/backend/
│   │   │   │   ├── config/         # Configuración (Security, CORS, etc)
│   │   │   │   ├── controller/     # REST Controllers
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── entity/         # Entidades JPA
│   │   │   │   ├── repository/     # Repositorios Spring Data
│   │   │   │   ├── service/        # Lógica de negocio
│   │   │   │   ├── util/           # Utilidades (JWT, validadores)
│   │   │   │   └── exception/      # Manejo de excepciones
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/               # Tests unitarios
│   └── pom.xml
│
├── dashboard/                  # Next.js Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # Rutas de autenticación
│   │   │   ├── (dashboard)/    # Rutas del dashboard
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── dashboard/      # Componentes específicos
│   │   │   └── ui/             # Componentes reutilizables
│   │   ├── lib/                # Servicios API y utilidades
│   │   ├── store/              # Zustand stores
│   │   ├── types/              # TypeScript types
│   │   └── styles/
│   ├── public/
│   └── package.json
│
├── front-portal/               # Astro Portal Público
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── database/                   # Scripts SQL
│   ├── schema.sql
│   └── seed.sql (opcional)
│
├── docs/                       # Documentación
│   ├── screenshots/
│   ├── architecture/
│   └── api/
│
└── README.md
```

---

## 🔐 Variables de Entorno

### Backend (`application.properties`)

| Variable                     | Descripción                            | Ejemplo                                      |
| ---------------------------- | -------------------------------------- | -------------------------------------------- |
| `spring.datasource.url`      | URL de conexión PostgreSQL             | `jdbc:postgresql://localhost:5432/billetera` |
| `spring.datasource.username` | Usuario de base de datos               | `postgres`                                   |
| `spring.datasource.password` | Contraseña de base de datos            | `tu_password`                                |
| `jwt.secret`                 | Clave secreta para JWT (min. 256 bits) | `clave-super-secreta-256-bits`               |
| `jwt.expiration`             | Tiempo de expiración del token (ms)    | `86400000` (24h)                             |
| `spring.mail.username`       | Email para envío de OTP (opcional)     | `tu-email@gmail.com`                         |
| `spring.mail.password`       | Contraseña de aplicación de email      | `app-password`                               |

### Frontend Dashboard (`.env.local`)

| Variable              | Descripción     | Ejemplo                     |
| --------------------- | --------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | URL del backend | `http://localhost:8080/api` |

---

## 📊 Arquitectura del Sistema

### Flujo de Autenticación
```
1. Usuario → Login (email/RUT + contraseña)
2. Backend → Valida credenciales
3. Backend → Genera código OTP y lo envía (email/consola)
4. Usuario → Ingresa código OTP
5. Backend → Valida OTP y genera JWT
6. Frontend → Guarda JWT en localStorage
7. Frontend → Redirige al Dashboard
```

### Flujo de Transferencia
```
1. Usuario → Selecciona cuenta origen y contacto destino
2. Usuario → Ingresa monto y descripción
3. Frontend → Validación client-side
4. Usuario → Confirma datos
5. Backend → Crea transacción PENDING y genera OTP
6. Usuario → Ingresa código OTP
7. Backend → Valida OTP, actualiza saldos, cambia estado a COMPLETED
8. Frontend → Muestra comprobante con detalles
```

### Diagrama de Base de Datos (Simplificado)
```
users (1) ──── (N) accounts
  │                  │
  │                  │
  ├── (N) contacts   │
  │                  │
  ├── (N) notifications
  │                  │
  └── (N) otp_codes  │
                     │
              (N) transactions
```

---

## 🧪 Testing

### Backend
```bash
cd backend
mvn test
```

**Tests incluidos:**
- ✅ `RutValidatorTest` - Validación de RUT chileno
- ✅ `AuthServiceTest` - Flujos de autenticación

### Frontend
```bash
# Dashboard
cd dashboard
npm run test

# Portal
cd front-portal
npm run test
```

---

## 🚀 Deployment

### Backend

**Opción 1: Heroku**
```bash
heroku create billetera-backend
git subtree push --prefix backend heroku main
```

**Opción 2: Railway**
```bash
railway up
```

### Frontend Dashboard

**Vercel (Recomendado)**
```bash
cd dashboard
vercel
```

### Frontend Portal

**Vercel**
```bash
cd front-portal
vercel
```

---

## 🔒 Seguridad

### Implementaciones de Seguridad

- ✅ **JWT con expiración** - Tokens válidos por 24 horas
- ✅ **2FA con OTP** - Códigos de 6 dígitos válidos por 5 minutos
- ✅ **Hash de contraseñas** - BCrypt con salt automático
- ✅ **Validación de inputs** - Backend y frontend
- ✅ **CORS configurado** - Solo orígenes permitidos
- ✅ **SQL Injection prevention** - JPA con prepared statements
- ✅ **XSS protection** - Sanitización de inputs en React

### Recomendaciones para Producción

- [ ] Usar HTTPS en todos los endpoints
- [ ] Implementar rate limiting
- [ ] Configurar helmet.js para headers de seguridad
- [ ] Implementar logs de auditoría completos
- [ ] Usar variables de entorno seguras (no hardcodear secretos)
- [ ] Implementar refresh tokens
- [ ] Agregar CAPTCHA en login

---

## 📈 Funcionalidades Futuras

### Próximas Mejoras Planeadas

- [ ] Pago de servicios básicos
- [ ] Gráficos de gastos mensuales
- [ ] Exportación de movimientos a Excel/PDF
- [ ] Notificaciones push en tiempo real
- [ ] Modo oscuro
- [ ] Aplicación móvil (React Native)
- [ ] Integración con API de bancos reales (sandbox)
- [ ] Biometría para autenticación

---

## 🐛 Problemas Conocidos

- [ ] El sistema de OTP por email requiere configuración SMTP adicional
- [ ] Los indicadores económicos dependen de disponibilidad de mindicador.cl
- [ ] El comprobante se descarga como HTML (requiere conversión manual a PDF)

---

## 🤝 Contribuciones

Este es un proyecto de portafolio personal. Si encuentras bugs o tienes sugerencias:

1. Abre un Issue describiendo el problema
2. (Opcional) Crea un Pull Request con la solución

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Portfolio: [tu-sitio.com](https://tu-sitio.com)
- Email: tu-email@ejemplo.com

---

## 🙏 Agradecimientos

- [Spring Boot](https://spring.io/projects/spring-boot) - Framework backend
- [Next.js](https://nextjs.org/) - Framework React
- [Astro](https://astro.build/) - Framework estático
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Supabase](https://supabase.com/) - PostgreSQL hosting
- [Mindicador.cl](https://mindicador.cl/) - API de indicadores económicos

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub**