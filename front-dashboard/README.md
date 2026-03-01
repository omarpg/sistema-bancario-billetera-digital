# 📊 Billetera Digital — Dashboard

> Aplicación web para usuarios autenticados. Dashboard bancario construido con Next.js 14, TypeScript, Tailwind CSS y shadcn/ui.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev/)

---

## 📋 Descripción

Dashboard bancario privado que permite a usuarios autenticados interactuar con lo siguiente:

- ✅ Login con autenticación 2FA (OTP de 6 dígitos)
- ✅ Visualización de posición consolidada (saldo CLP + equivalente UF)
- ✅ Gráfico de gastos mensuales con Recharts
- ✅ Gestión de agenda de contactos (CRUD completo)
- ✅ Transferencias electrónicas con confirmación OTP
- ✅ Historial de movimientos con filtros avanzados
- ✅ Centro de notificaciones en tiempo real
- ✅ Panel de seguridad (sesiones activas, historial de eventos)
- ✅ Generación y descarga de comprobantes PDF

El proyecto muestra capacidades en desarrollo frontend moderno para apps financieras.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         UI Components (shadcn/ui)       │
│    Buttons, Dialogs, Forms, Tables      │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Pages (App Router)              │
│   /dashboard, /transferir, /contactos   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│       API Client (fetch + SWR)          │
│     Consume REST API del backend        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    Middleware (JWT validation)          │
│   Protege rutas, valida autenticación   │
└─────────────────────────────────────────┘
```

### Estructura del proyecto

```
front-dashboard/
├── app/
│   ├── (auth)/
│   │   ├── login/            # Página de login
│   │   └── verify-otp/       # Verificación 2FA
│   ├── (dashboard)/
│   │   ├── dashboard/        # Home del dashboard
│   │   ├── transferir/       # Flujo de transferencias
│   │   ├── contactos/        # Gestión de agenda
│   │   ├── movimientos/      # Historial
│   │   ├── notificaciones/   # Centro de notificaciones
│   │   └── seguridad/        # Panel de seguridad
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── dashboard/            # Componentes específicos
│   └── shared/               # Componentes reutilizables
├── lib/
│   ├── api.ts                # Cliente API
│   ├── auth.ts               # Helpers de autenticación
│   └── utils.ts              # Utilidades
├── middleware.ts             # Protección de rutas
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 🚀 Tecnologías

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|-----------|
| **Framework** | Next.js | 14.x | React framework con App Router |
| **Lenguaje** | TypeScript | 5.3 | Tipado estático |
| **UI Library** | React | 18.x | Biblioteca de componentes |
| **Estilos** | Tailwind CSS | 3.4 | Utility-first CSS |
| **Componentes** | shadcn/ui | Latest | Componentes accesibles |
| **Formularios** | React Hook Form | 7.x | Gestión de formularios |
| **Validación** | Zod | 3.x | Schema validation |
| **Gráficos** | Recharts | 2.x | Visualización de datos |
| **Data fetching** | SWR | 2.x | Cache y revalidación |
| **Iconos** | Lucide React | Latest | Iconos modernos |

---

## 📦 Instalación y Setup

### Prerrequisitos

- **Node.js 18+** ([Descargar](https://nodejs.org/))
- **npm 9+** o **pnpm 8+**
- Backend corriendo en `http://localhost:8080`

### 1. Clonar el repositorio

```bash
git clone https://github.com/omarpg/front-dashboard.git
cd front-dashboard
```

### 2. Instalar dependencias

```bash
npm install
# o
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local`:

```bash
# URL del backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Configuración JWT
JWT_SECRET=tu_secret_key_aqui
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en: **http://localhost:3000**

### 5. Build para producción

```bash
npm run build
npm run start
```

---

## 🎨 Rutas de la aplicación

### Públicas (sin autenticación)

| Ruta | Descripción |
|------|-------------|
| `/login` | Formulario de login (RUT/email + password) |
| `/verify-otp` | Verificación de código 2FA |

### Privadas (requieren autenticación)

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Home: posición consolidada + gráficos |
| `/transferir` | Flujo completo de transferencias TEF |
| `/contactos` | CRUD de agenda de destinatarios |
| `/movimientos` | Historial de transacciones con filtros |
| `/notificaciones` | Centro de notificaciones |
| `/seguridad` | Panel de seguridad de la cuenta |

---

## 🔒 Flujo de Autenticación

### Login + 2FA

```
1. Usuario ingresa RUT/email + password
   ↓
2. POST /api/auth/login
   ↓
3. ¿Tiene 2FA habilitado?
   → SÍ: Redirigir a /verify-otp
   → NO: Guardar JWT y redirigir a /dashboard
   ↓
4. Usuario ingresa código de 6 dígitos
   ↓
5. POST /api/auth/verify-otp
   ↓
6. JWT final guardado en httpOnly cookie
   ↓
7. Redirigir a /dashboard
```

### Protección de rutas

El archivo `middleware.ts` intercepta todas las requests a rutas privadas:

```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  
  if (!token && isPrivateRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

---

## 📱 Características principales

### Dashboard (Posición Consolidada)

- Card de saldo total en CLP
- Equivalente en UF (actualizado con tasas de `mindicador.cl`)
- Gráfico de barras con gastos mensuales (Recharts)
- Últimas 5 transacciones en tabla
- Actualización automática cada 30 segundos (SWR)

### Transferencias (TEF)

**Paso 1:** Selección
- Cuenta origen (select)
- Destinatario desde agenda (select con búsqueda)
- Monto (validación de saldo en frontend)
- Glosa/mensaje

**Paso 2:** Confirmación
- Resumen de la operación
- Botón "Confirmar"

**Paso 3:** OTP
- Modal con 6 inputs para código
- Timer de 5 minutos
- Opción "Reenviar código"

**Paso 4:** Resultado
- Comprobante descargable en PDF
- Opción "Nueva transferencia"

### Contactos (Agenda)

- Tabla con búsqueda en tiempo real
- Modal para agregar/editar contacto
- Validación de RUT con Módulo 11
- Confirmación antes de eliminar

### Notificaciones

- Dropdown desde icono campana en header
- Badge con contador de no leídas
- Click en notificación: marca como leída
- Si tiene transacción relacionada: navega al detalle

---

## 🎨 Sistema de diseño

### Paleta de colores

```css
/* Tailwind custom colors */
--primary: 222.2 47.4% 11.2%;
--secondary: 210 40% 96.1%;
--accent: 210 40% 96.1%;
--destructive: 0 84.2% 60.2%;
--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;
--ring: 222.2 84% 4.9%;
```

### Componentes shadcn/ui utilizados

- `Button`, `Input`, `Label`
- `Dialog`, `Sheet`, `Popover`
- `Table`, `Card`, `Badge`
- `Select`, `Form`, `Toast`
- `Dropdown Menu`, `Avatar`
- `Skeleton`

---

## 🧪 Testing

```bash
# Tests unitarios (Vitest)
npm run test

# Tests E2E (Playwright)
npm run test:e2e
```

---

## 🚢 Deployment

### Deploy en Vercel (recomendado)

1. Push a GitHub
2. Conectar repositorio en [Vercel](https://vercel.com)
3. Configurar variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL del backend en producción
4. Deploy automático

### Variables de entorno en producción

```bash
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
JWT_SECRET=clave_secreta_produccion
```

---

## 🎯 Decisiones de diseño

### ¿Por qué Next.js 14 con App Router?

El App Router es la arquitectura actual de Next.js, con mejor performance (React Server Components) y DX mejorada. Las empresas están migrando de Pages Router a App Router.

### ¿Por qué shadcn/ui y no otras uis?

shadcn/ui da control total del código (copia componentes al proyecto), es más ligero, y permite personalización completa sin wrappers. Además, es la tendencia actual de los últimos años.

### ¿Por qué SWR para data fetching?

SWR maneja cache, revalidación y estados de loading/error automáticamente. Reduce boilerplate comparado con useEffect + fetch manual.

---

## 🔗 Repositorios Relacionados

- [Backend (Spring Boot)](https://github.com/omarpg/backend) — API REST
- [Portal Público (Astro)](https://github.com/omarpg/front-portal) — Landing page

---

**Desarrollado con ⚛️ y Next.js**