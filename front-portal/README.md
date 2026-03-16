# 🌐 Portal Público - Billetera Digital

Sitio web institucional desarrollado con **Astro 5** que presenta servicios, consulta indicadores económicos, simula cálculo de créditos y permite el registro de nuevos usuarios.

---

## 🚀 Stack Tecnológico

- **Astro 5.1**
- **TypeScript**
- **Tailwind CSS 3.4**
- **Fetch API** (HTTP client)
- **Integración con mindicador.cl** (indicadores económicos)

---

## 📁 Estructura del Proyecto
```
front-portal/
├── public/
│   ├── fonts/                      # Fuentes: Inter variable
│   ├── lighthouse-desktop/         # Imágenes performance lighthouse
│   ├── favicon.svg                 
│   ├── manifest.json               
│   └── robots.txt                  
├── src/                            
│   ├── components/
│   │   ├── AltHeroSection.astro    # Componente Hero alternativo
│   │   ├── Footer.astro            # Componente Footer
│   │   ├── FrontPage.astro         # Contenido página inicial
│   │   ├── Header.astro            # Componente Header
│   │   ├── IndicadorCard.astro     # Componente tarjeta de indicador económico
│   │   ├── IndicadoresPage.astro   # Contenido página de indicadores económicos
│   │   ├── ProductosPage.astro     # Contenido página de productos
│   │   ├── RegistroForm.tsx        # Componente react formulario de registro
│   │   ├── SEO.astro               # Componente SEO para head
│   │   ├── SimuladorCredito.tsx    # Componente react simulador de crédito
│   │   └── SimuladorPage.astro     # Contenido página de simulador de crédito
│   ├── layouts/
│   │   └── Layout.astro            # Layout principal
│   ├── pages/
│   │   ├── index.astro             # Página de inicio
│   │   ├── indicadores.astro       # Página de indicadores
│   │   ├── productos.astro         # Página de productos / servicios
│   │   ├── registro.astro          # Registro de usuarios
│   │   └── simulador.astro         # Simulador de crédito
│   ├── styles/
│   │   └── global.css              # Estilos globales
│   └── utils/
│       ├── types/                  # TypeScript types
|       │   └── indicadores.ts
│       └── data.ts                 # Datos estáticos
├── astro.config.mjs
├── tsconfig.json
├── README.md
└── package.json
```

---

## 🎨 Páginas

### 1. Página Principal (`/`)

- Hero section con CTA a registro y productos
- Características principales
- CTA a registro
- Footer con enlaces

### 2. Productos (`/productos`)

- Hero alternativo
- Presentación de productos/servicios:
  1. Cuenta corriente digital
  2. Cuenta vista
  3. Tarjeta de débito
- CTA a registro

### 3. Indicadores (`/indicadores`)

- Hero alternativo
- Indicadores económicos obtenidos de mindicador.cl
- Info detallada de los indicadores
- Disclaimer

### 4. Simulador de Crédito (`/simulador`)

- Hero alternativo
- Simulador de crédito con datos ajustables:
  1. Monto solicitado
  2. Plazo
  3. Tasa de interés anual
- Al clickear calcular muestra resultados
- Disclaimer CAE y CTC

### 5. Registro (`/registro`)

- Formulario de registro de usuarios
- Validación de RUT chileno
- Integración con backend `/api/auth/register`
- Redirección al dashboard para login después de registro

---

## 🌟 Características

### Performance

- ✅ **Lighthouse Desktop Score: 100/100** en todas las páginas. [Ver Imágenes](../public/lighthouse-desktop)
  - Performance: 100
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
- ✅ **Lighthouse Mobile Score: 94+/100** en todas las páginas
  - Performance: 94+
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
- ✅ Generación estática (SSG)
- ✅ Optimización automática de imágenes
- ✅ CSS crítico inline

### Integraciones

- ✅ **mindicador.cl**: Indicadores económicos actualizados
- ✅ **Backend API**: Registro de usuarios
- ✅ **Simulador de crédito**: Simulador con react

### UX

- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Navegación intuitiva
- ✅ Validación de formularios en tiempo real

---

## ⚙️ Configuración

### Sin Variables de Entorno

El portal **NO requiere** archivo `.env` ya que:
- La API del backend se asume en `http://localhost:8080/api`
- La integración con mindicador.cl es pública

---

## 🚀 Ejecución

### Desarrollo
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Portal disponible en: `http://localhost:4321`

### Build
```bash
# Generar sitio estático
npm run build

# Preview del build
npm run preview
```

---

## 📊 Indicadores Económicos

El portal consume la API pública de **mindicador.cl** para mostrar:

- **UF** (Unidad de Fomento)
- **USD** (Dólar estadounidense)
- **EUR** (Euro)

---

## 🔄 Flujo de Registro
```
1. Usuario completa formulario
   - RUT (validación automática)
   - Nombre completo
   - Email
   - Contraseña
   - Confirma contraseña
   ↓
2. POST /api/auth/register
   ↓
3a. Éxito:
    - Usuario creado
    - Cuenta Vista automática
    - Redirige a Dashboard con token JWT para login
   
3b. Error:
    - Muestra mensaje de error
    - RUT duplicado
    - Email duplicado
```

---

## 📦 Dependencias Principales
```json
{
  "astro": "^5.18.0",
  "react": "^19.0.0",
  "tailwindcss": "^4.1.18",
}
```

---

## 🧪 Testing
```bash
# Verificar build
npm run build

# Lighthouse audit
npx lighthouse http://localhost:4321 --view

```

---

## 📝 SEO

### Meta Tags

Cada página incluye:
- `<title>` único
- `<meta name="description">`
- `<meta property="og:title">`
- `<meta property="og:image">`
- `<link rel="canonical">`

### Sitemap
```bash
# Generar sitemap automáticamente
npm run build
# Sitemap disponible en: dist/sitemap.xml
```

---

## 📝 Notas

- Astro genera archivos estáticos optimizados
- Las páginas NO requieren JavaScript en el cliente (islands architecture)
- Los indicadores económicos se actualizan en build time
- Simulador de crédito utiliza react y funciona en esa única página

---

## 📚 Documentación Adicional

- [README Principal](../README.md)
- [Documentación de Astro](https://docs.astro.build)