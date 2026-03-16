# 💼 Dashboard - Billetera Digital

Panel de administración web desarrollado con **Next.js 15** que permite a los usuarios gestionar sus cuentas bancarias, realizar transferencias y administrar contactos.

---

## 🚀 Stack Tecnológico

- **Next.js 15.1** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 3.4**
- **Zustand** (state management)
- **Axios** (HTTP client)
- **React Hot Toast** (notificaciones)
- **Lucide Icons**

---

## 📁 Estructura del Proyecto
```
front-dashboard/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── verify-otp/
│   │   ├── (dashboard)/         # Rutas protegidas
│   │   │   ├── dashboard/       # Vista principal
│   │   │   ├── transfers/       # Transferencias
│   │   │   ├── contacts/        # Gestión de contactos
│   │   │   ├── accounts/        # Cuentas bancarias
│   │   │   ├── notifications/   # Notificaciones
│   │   │   └── profile/         # Perfil y seguridad
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Redirige a /login
│   ├── components/
│   │   ├── dashboard/           # Componentes del dashboard
│   │   └── ui/                  # Componentes reutilizables
│   ├── services/                # Servicios API
│   │   ├── api.ts               # Axios config
│   │   ├── auth.ts
│   │   ├── accounts.ts
│   │   ├── contacts.ts
│   │   ├── transfers.ts
│   │   └── notifications.ts
│   ├── store/                   # Zustand stores
│   │   └── dashboardStore.ts    # Estado global del dashboard
│   ├── types/                   # TypeScript types
│   └── utils/                   # Utilidades
│       ├── rutValidator.ts
│       └── formatters.ts
├── .env.local                   # Variables de entorno (no subir)
├── .env.local.example           # Template de variables
├── next.config.js
├── tailwind.config.ts
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
- ✅ Indicadores económicos (UF, USD, EUR)
- ✅ Transacciones recientes
- ✅ Notificaciones en tiempo real

### Transferencias
- ✅ Flujo en 3 pasos (origen → destino/monto → confirmación)
- ✅ Transferencias a contactos guardados
- ✅ Transferencias a cuentas nuevas (con validación RUT)
- ✅ Validación de saldo en tiempo real
- ✅ Comprobante descargable en PDF

### Gestión de Contactos
- ✅ CRUD completo de contactos
- ✅ Validación de RUT chileno
- ✅ Búsqueda y filtrado
- ✅ Favoritos (opcional)

### Notificaciones
- ✅ Centro de notificaciones
- ✅ Marcar como leídas
- ✅ Filtrado por tipo
- ✅ Toast notifications

### Perfil y Seguridad
- ✅ Actualizar información personal
- ✅ Cambio de contraseña
- ✅ Habilitar/deshabilitar 2FA
- ✅ Visualizar último login

---

## 🔐 Sistema de Caché (Zustand)

El dashboard utiliza **Zustand** para gestionar estado global y optimizar las peticiones al backend:
```typescript
// dashboardStore.ts
const useDashboardStore = create((set) => ({
  accounts: [],
  transactions: [],
  contacts: [],
  accountsLoaded: false,
  
  loadAccounts: async () => {
    if (!accountsLoaded) {
      const accounts = await accountsService.getAccounts();
      set({ accounts, accountsLoaded: true });
    }
  },
  
  clearCache: () => set({ accounts: [], accountsLoaded: false }),
}));
```

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

### Producción
```bash
# Build
npm run build

# Iniciar
npm start
```

### Linting
```bash
# Verificar código
npm run lint

# Fix automático
npm run lint -- --fix
```

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

Ver diagrama completo en: [`/docs/architecture/auth-flow.md`](../docs/architecture/auth-flow.md)

---

## 🧪 Testing
```bash
# Ejecutar tests (cuando se implementen)
npm test

# Coverage
npm run test:coverage
```

---

## 📦 Dependencias Principales
```json
{
  "next": "^15.1.0",
  "react": "^19.0.0",
  "zustand": "^5.0.2",
  "axios": "^1.7.9",
  "react-hot-toast": "^2.4.1",
  "tailwindcss": "^3.4.1",
  "lucide-react": "^0.468.0"
}
```

---

## 📝 Notas

- El dashboard asume que el backend está corriendo en `http://localhost:8080`
- Los tokens JWT expiran en 24 horas
- El estado del dashboard se limpia automáticamente al logout
- Las notificaciones toast desaparecen después de 3 segundos

---

## 📚 Documentación Adicional

- [Arquitectura del Sistema](../docs/architecture/system-overview.md)
- [Flujo de Transferencias](../docs/architecture/transfer-flow.md)
- [README Principal](../README.md)

---

Desarrollado con ⚛️ y Next.js