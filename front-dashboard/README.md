# 💼 Dashboard - Billetera Digital

Panel de administración web desarrollado con **Next.js 15** que permite a los usuarios gestionar sus cuentas bancarias, realizar transferencias, recibir notificaciones y administrar contactos.

---

## 🚀 Stack Tecnológico

- **Next.js 15.1** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Zustand** (Manejo de estados)
- **Axios** (HTTP client)
- **React Hot Toast** (Notificaciones)
- **Lucide Icons**

---

## 📁 Estructura del Proyecto
```
front-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Rutas de autenticación
│   │   │   ├── login/
│   │   │   ├── verify-otp/
│   │   │   └── layout.tsx             # Layout auth
│   │   ├── (dashboard)/               # Rutas protegidas dashboard
│   │   │   └── dashboard/             # Vista principal
│   │   │       ├── accounts/          # Cuentas bancarias
│   │   │       ├── contacts/          # Gestión de contactos
│   │   │       ├── notifications/     # Notificaciones
│   │   │       ├── profile/           # Perfil y seguridad
│   │   │       ├── transactions/      # Historial de transacciones
│   │   │       ├── transfers/         # Transferencias
│   │   │       ├── layout.tsx         # Layout dashboard
│   │   │       └── page.tsx           # Carga de datos
│   │   ├── global.css                 # Estilos globales
│   │   ├── layout.tsx                 # Layout principal
│   │   └── page.tsx                   # Redirige a /login
│   ├── components/
│   │   ├── dashboard/                 # Componentes del dashboard
│   │   └── ui/                        # Componentes reutilizables
│   ├── lib/                           
│   │   ├── accounts.ts                # Servicios de cuentas
│   │   ├── api.ts                     # Axios config
│   │   ├── auth.ts                    # Autenticación
│   │   ├── contacts.ts                # Servicios de contactos
│   │   ├── notifications.ts           # Servicios de notificaciones
│   │   ├── security.ts                # Seguridad
│   │   ├── transactions.ts            # Servicios de transacciones
│   │   ├── transfers.ts               # Servicios de transferencias
│   │   └── utils.ts                   # Utilidades (formatDate, formatCurrency, etc.)
│   ├── store/                         # Zustand stores
│   │   ├── authStore.ts               # Estado de autenticación
│   │   └── dashboardStore.ts          # Estado global del dashboard
│   └── types/                         # TypeScript types
├── .env.local                         # Variables de entorno
├── next.config.js
├── README.md
└── package.json
```

---

## 🎨 Características

### Autenticación
- ✅ Login con email o RUT
- ✅ Autenticación 2FA con códigos OTP
- ✅ Tokens JWT almacenados en localStorage
- ✅ Validación automática de sesión
- ✅ Logout con limpieza de estado

### Dashboard Principal
- ✅ Vista de cuentas con saldos
- ✅ Info de transferencias
- ✅ Transacciones recientes
- ✅ Accesos rápidos y tips
- ✅ Notificaciones en tiempo real

### Cuentas
- ✅ Lista de cuentas
- ✅ Detalles de cada cuenta
- ✅ Últimos movimientos de cada cuenta

### Transferencias
- ✅ Flujo en 3 pasos (datos → confirmar → verificar)
- ✅ Transferencias a contactos guardados
- ✅ Validación de saldo en tiempo real
- ✅ Comprobante descargable en HTML, manualmente se puede descargar a pdf

### Gestión de Contactos
- ✅ CRUD completo de contactos
- ✅ Validación de RUT chileno
- ✅ Búsqueda y filtrado

### Notificaciones
- ✅ Centro de notificaciones
- ✅ Marcar como leídas
- ✅ Filtrado por tipo
- ✅ Toast notifications

### Perfil y Seguridad
- ✅ Cambio de contraseña
- ✅ Habilitar/deshabilitar 2FA
- ✅ Visualizar último login

---

## 🔐 Sistema de Caché (Zustand)

El dashboard utiliza **Zustand** para gestionar estado global y optimizar las peticiones al backend:

**Ventajas:**
- ⚡ Reduce llamadas redundantes al backend
- 🔄 Actualización reactiva en todos los componentes
- 🧹 Limpieza automática al logout

---

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_PORTAL_URL=http://localhost:4321
```

---

## 🚀 Ejecución

### Desarrollo
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Dashboard disponible en: `http://localhost:3000`

---

## 🎨 Diseño y UX

### Paleta de Colores

- **Primary:** Azul (`#3B82F6`)
- **Success:** Verde (`#10B981`)
- **Warning:** Amarillo (`#F59E0B`)
- **Error:** Rojo (`#EF4444`)
- **Background:** Gris claro (`#F9FAFB`)

### Responsive Design

- ✅ Mobile First
- ✅ Breakpoints Tailwind: `sm`, `md`, `lg`, `xl`, `2xl`
- ✅ Navegación adaptativa (sidebar → bottom nav en móvil)

### Accesibilidad

- ✅ ARIA labels en botones e inputs
- ✅ Focus visible
- ✅ Contraste WCAG AA
- ✅ Navegación por teclado

---

## 🔄 Flujo de Autenticación
```
1. Usuario ingresa email/RUT + contraseña
   ↓
2. POST /api/auth/login
   ↓
3a. Si 2FA deshabilitado:
    - Recibe JWT token
    - Almacena en localStorage
    - Redirige a /dashboard
3b. Si 2FA habilitado:
    - Recibe requireOtp: true
    - Redirige a /verify-otp
    - Usuario ingresa código OTP
    - POST /api/auth/verify-otp
    - Recibe JWT token
    - Redirige a /dashboard
```

---

## 📦 Dependencias Principales
```json
{
  "next": "^16.1.6",
  "react": "^19.2.3",
  "zustand": "^5.0.2",
  "axios": "^1.13.5",
  "react-hot-toast": "^2.6.0",
  "tailwindcss": "^3.4",
  "lucide-react": "^0.563.0"
}
```

---

## 🚧 Logueo para Testing

- Nombre: Usuario Demo
- Email: demo@billetera.com
- Contraseña: pass1234
- RUT: 13.254.122-1

---

## 📝 Notas

- El dashboard asume que el backend está corriendo en `http://localhost:8080`
- Los tokens JWT expiran en 24 horas
- El estado del dashboard se limpia automáticamente al logout
- Las notificaciones toast desaparecen después de 3 segundos

---

## 📚 Documentación Adicional

- [README Principal](../README.md)
- [Documentación Next.js](https://nextjs.org/docs)