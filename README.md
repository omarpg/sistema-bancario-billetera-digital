# 💰 Billetera Digital

Aplicación web full-stack de sistema financiero que simula funcionalidades bancarias reales, incluyendo transferencias con autenticación de dos factores, gestión de contactos, y administración de múltiples cuentas.

> **Nota:** Este es un proyecto de portafolio/demostración. No debe usarse con datos reales.

---

## 📸 Screenshots (por hacer)

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
- ✅ Página web corporativa optimizada (Lighthouse 100/100 en todas las métricas)
- ✅ Simulador de crédito con cálculos en tiempo real
- ✅ Indicadores económicos (UF, USD, EUR) desde API pública
- ✅ Sistema de registro de usuarios conectado al backend
- ✅ SEO completo (sitemap, robots.txt, meta tags, JSON-LD)
- ✅ Diseño responsive y accesible

### 🔐 Autenticación y Seguridad
- ✅ JWT (JSON Web Tokens) para autenticación
- ✅ Autenticación de dos factores (2FA) con OTP por email/rut
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
| Tecnología   | Versión | Propósito             |
| ------------ | ------- | --------------------- |
| Astro        | 5       | Framework estático    |
| Tailwind CSS | 4.x     | Estilos               |
| TypeScript   | 5.x     | Tipado estático       |
| React        | 19      | Simulación de crédito |

### Base de Datos
- **PostgreSQL 16** en Supabase y Dockerizando
- 8 tablas principales: `users`, `accounts`, `transactions`, `contacts`, `notifications`, `otp_codes`, `currency_rates`, `audit_logs`

---

## 📦 Instalación y Configuración

### Requisitos Previos

- **Java JDK 17** o superior
- **Node.js 18** o superior
- **PostgreSQL 16** (o cuenta de Supabase)
- **Maven 3.8** o superior
- **npm** o **pnpm**
- **Docker Desktop** y virtualización activada

---

### Clonar el Repositorio
```bash
git clone https://github.com/omarpg/sistema-bancario-billetera-digital.git
cd sistema-bancario-billetera-digital
```

---

### Se puede ejecutar el proyecto de **dos formas**:

- **🐳 Opción A: Docker** - PostgreSQL local en contenedor (recomendado para empezar)
- **☁️ Opción B: Supabase** - PostgreSQL en la nube

#### 🐳 Opción A: Ejecución con Docker

1. **Docker Desktop** instalado y corriendo

2. Levantar Backend + PostgreSQL con Docker
```bash
# En la raíz del proyecto
docker-compose up --build
```
**Primera vez tarda ~3-5 minutos** (descarga imágenes y compila)

3. Levantar front-dashboard
- Crear archivo `front-dashboard/.env.local` y agregar:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_PORTAL_URL=http://localhost:4321
```
- Instalar Dependencias y Ejecutar
```bash
# En /front-dashboard
npm install
npm run dev
```

**Dashboard disponible en:** `http://localhost:3000`

4. Levantar front-portal
- Instalar Dependencias y Ejecutar
```bash
# En /front-portal
npm install
npm run dev
```

**Portal disponible en:** `http://localhost:4321`

---

#### ☁️ Opción B: Ejecución con Supabase

1. Cuenta de **Supabase** (crear si no tienes) - [Crear cuenta](https://supabase.com)

2. Crear proyecto

3. Configura:
  - **Name:** `billetera-digital`
  - **Database Password:** Genera una contraseña segura y **guárdala** ✅
  - **Region:** Elige la más cercana (ej: South America)

4. Anota los datos de host, post, database, user y password

5. Abre el archivo `backend/database/schema-supabase.sql` 

6. Copia el contenido y pégalo en el SQL Editor de Supabase

7. Click en **"Run"** (▶️)

8. Busca el archivo `backend/src/main/resources/application.properties`
  - Reemplaza los datos por los obtenidos de supabase en el punto 4:
```properties
# =============================================
# DATABASE
# =============================================
spring.datasource.url=jdbc:postgresql://db.xxxxxxxxxxxxx.supabase.co:5432/postgres
spring.datasource.username=USER_SUPABASE_AQUI
spring.datasource.password=TU_PASSWORD_SUPABASE_AQUI
```

9. Guardar cambios y ejecutar backend (o correr en el IDE directamente ▶️)
```bash
# En /backend Instalar dependencias y ejecutar
mvn spring-boot:run
```

10. Levantar front-dashboard
- Crear archivo `front-dashboard/.env.local` y agregar:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_PORTAL_URL=http://localhost:4321
```
- Instalar Dependencias y Ejecutar
```bash
# En /front-dashboard
npm install
npm run dev
```

**Dashboard disponible en:** `http://localhost:3000`

11. Levantar front-portal
- Instalar Dependencias y Ejecutar
```bash
# En /front-portal
npm install
npm run dev
```

**Portal disponible en:** `http://localhost:4321`

---

## 🗄️ Estructura del Proyecto
```
sistema-bancario-billetera-digital/
├── backend/
│   ├── database/
│   │   ├── schema-docker.sql
│   │   └── schema-supabase.sql
│   ├── Dockerfile
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/billetera/backend/
│   │   │   │   ├── config/         # Configuración (Security, CORS, etc)
│   │   │   │   ├── controller/     # REST Controllers
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── entity/         # Entidades JPA
│   │   │   │   ├── exception/      # Manejo de excepciones
│   │   │   │   ├── repository/     # Repositorios Spring Data
│   │   │   │   ├── service/        # Lógica de negocio
│   │   │   │   └── util/           # Utilidades (JWT, validadores)
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       ├── java/com/billetera/backend/
│   │       │   ├── service/        # Test de auth service
│   │       │   └── util/           # Test validador de rut
│   │       └── resources/
│   │           └── application-test.properties
│   ├── pom.xml
│   └── README.md
│
├── front-dashboard/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # Rutas de autenticación
│   │   │   ├── (dashboard)/    # Rutas del dashboard
│   │   │   ├── globals.css     # Estilos globales
│   │   │   ├── layout.tsx      # Layout de inicio de sesión
│   │   │   └── page.tsx        # Página de inicio de sesión
│   │   ├── components/
│   │   │   ├── dashboard/      # Componentes específicos
│   │   │   └── ui/             # Componentes reutilizables
│   │   ├── lib/                # Servicios API y utilidades
│   │   ├── store/              # Zustand stores
│   │   ├── types/              # TypeScript types
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── front-portal/
│   ├── src/
│   │   ├── assets/           # Svgs, logos, etc
│   │   ├── components/       # Componentes generales
│   │   ├── layouts/          # Layout general
│   │   ├── pages/            # Páginas principales enrutadas
│   │   ├── styles/           # Estilos globales
│   │   └── utils/            # Data y tipos
│   │       └── types/        
│   ├── public/
│   └── package.json
│
├── LICENSE
└── README.md
```

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

## 🔒 Seguridad

### Implementaciones de Seguridad

- ✅ **JWT con expiración** - Tokens válidos por 24 horas
- ✅ **2FA con OTP** - Códigos de 6 dígitos válidos por 5 minutos
- ✅ **Hash de contraseñas** - BCrypt con salt automático
- ✅ **Validación de inputs** - Backend y frontend
- ✅ **CORS configurado** - Solo orígenes permitidos
- ✅ **SQL Injection prevention** - JPA con prepared statements
- ✅ **XSS protection** - Sanitización de inputs en React

---

## 🐛 Limitaciones aceptadas

- [ ] El sistema de OTP por email requiere configuración SMTP adicional, por ahora se ve en consola
- [ ] Los indicadores económicos dependen de disponibilidad de mindicador.cl
- [ ] El comprobante se descarga como HTML (requiere conversión manual a PDF)

---

## 🤝 Contribuciones

Este es un proyecto de portafolio personal. Si encuentras bugs o tienes sugerencias:

1. Envíame un email om.ponce.g@gmail.com

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

- GitHub: [@omarpg](https://github.com/omarpg)
- Email: om.ponce.g@gmail.com

---

## 🙏 Agradecimientos

- [Spring Boot](https://spring.io/projects/spring-boot) - Framework backend
- [Next.js](https://nextjs.org/) - Framework React
- [Astro](https://astro.build/) - Framework estático
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Supabase](https://supabase.com/) - PostgreSQL hosting
- [Mindicador.cl](https://mindicador.cl/) - API de indicadores económicos

---

**⭐ Proyecto sin fines de lucro**