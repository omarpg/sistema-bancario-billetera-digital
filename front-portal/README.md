# 🌐 Billetera Digital — Portal Público

> Sitio web institucional de la billetera digital. Portal público construido con Astro 4, optimizado para SEO y performance.

[![Astro](https://img.shields.io/badge/Astro-4-FF5D01?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Descripción

Portal público institucional que presenta los productos y servicios de la billetera digital:

- ✅ Landing page moderna y responsive
- ✅ Simulador de crédito interactivo (CAE + CTC según Ley 20.555)
- ✅ Página de productos bancarios (Cuenta Corriente, Vista, Débito)
- ✅ Indicadores económicos en tiempo real (UF, USD, EUR vía mindicador.cl)
- ✅ Formulario de registro de nuevos usuarios
- ✅ SEO optimizado con meta tags y sitemap
- ✅ Lighthouse score >95 en todas las categorías
- ✅ SSG con revalidación por hora para datos dinámicos

Este proyecto muestra capacidades en desarrollo frontend con foco en performance y SEO.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│      Astro Pages (SSG/SSR híbrido)      │
│   index, productos, indicadores, etc.   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Astro Components                │
│   Header, Footer, ProductCard, etc.     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         React Islands (client:load)     │
│   Simulador de crédito, formularios     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         API Externa (mindicador.cl)     │
│   Tasas UF/USD/EUR actualizadas         │
└─────────────────────────────────────────┘
```

### Estructura del proyecto

```
front-portal/
├── src/
│   ├── pages/
│   │   ├── index.astro            # Landing page
│   │   ├── productos.astro        # Catálogo de productos
│   │   ├── indicadores.astro      # UF/USD/EUR en tiempo real
│   │   ├── registro.astro         # Formulario de registro
│   │   └── simulador.astro        # Simulador de crédito
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProductCard.astro
│   │   └── SimuladorCredito.tsx   # React component
│   ├── layouts/
│   │   └── Layout.astro           # Layout base
│   └── styles/
│       └── global.css
├── public/
│   ├── images/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.cjs
└── package.json
```

---

## 🚀 Tecnologías

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|-----------|
| **Framework** | Astro | 4.x | Static Site Generator |
| **Lenguaje** | TypeScript | 5.3 | Tipado estático |
| **Estilos** | Tailwind CSS | 3.4 | Utility-first CSS |
| **Interactividad** | React | 18.x | Islands para componentes interactivos |
| **Formularios** | React Hook Form | 7.x | Validación de formularios |
| **Validación** | Zod | 3.x | Schema validation |
| **API** | mindicador.cl | — | Indicadores económicos Chile |

---

## 📦 Instalación y Setup

### Prerrequisitos

- **Node.js 18+** ([Descargar](https://nodejs.org/))
- **npm 9+** o **pnpm 8+**

### 1. Clonar el repositorio

```bash
git clone https://github.com/omarpg/front-portal.git
cd front-portal
```

### 2. Instalar dependencias

```bash
npm install
# o
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env`:

```bash
# URL del backend
PUBLIC_API_URL=http://localhost:8080/api

# URL de indicadores
PUBLIC_MINDICADOR_URL=https://mindicador.cl/api
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en: **http://localhost:4321**

### 5. Build para producción

```bash
npm run build
npm run preview
```

Los archivos estáticos se generan en `dist/`

---

## 📄 Páginas del sitio

| Ruta | Descripción | Tipo |
|------|-------------|------|
| `/` | Landing page con hero y features | SSG |
| `/productos` | Catálogo de productos bancarios | SSG |
| `/indicadores` | UF, USD, EUR en tiempo real | SSR con revalidación |
| `/simulador` | Calculadora de crédito (CAE + CTC) | SSG + React Island |
| `/registro` | Formulario de alta de usuario | SSG + React Island |

---

## ✨ Características principales

### Landing Page

- Hero section con CTA principal
- Features destacadas (seguridad, transferencias, beneficios)
- Sección de productos con cards visuales
- Footer con links legales y redes sociales

### Simulador de Crédito

Componente interactivo que calcula según normativa chilena:

**Inputs:**
- Monto solicitado (slider: $500.000 - $5.000.000 CLP)
- Plazo en meses (select: 12, 24, 36, 48, 60)
- Tasa de interés anual (input: %)

**Outputs:**
- **CAE** (Carga Anual Equivalente) — obligatorio por Ley 20.555
- **CTC** (Costo Total del Crédito)
- Cuota mensual
- Total a pagar

**Fórmula CAE:**
```
CAE = [(1 + i_mensual)^12 - 1] × 100
donde i_mensual incluye todos los costos (tasa + seguros + comisiones)
```

### Página de Indicadores

Consume API `mindicador.cl` para mostrar:
- Valor UF del día
- Dólar observado
- Euro

**Estrategia de cache:**
- En build time: genera página estática con valores actuales
- Revalidación: cada 1 hora (Astro SSR)
- Fallback: si la API falla, muestra último valor conocido

```astro
---
export const prerender = false; // SSR mode
export const revalidate = 3600; // 1 hora

const response = await fetch('https://mindicador.cl/api');
const data = await response.json();
---
```

### Formulario de Registro

Formulario React con validaciones:

**Campos:**
- RUT (validación Módulo 11 en frontend)
- Nombre completo
- Email
- Contraseña (mínimo 8 caracteres, mayúscula, número)
- Confirmar contraseña

**Flujo:**
1. Usuario completa formulario
2. Validación en cliente (Zod schema)
3. POST a `/api/auth/register` del backend
4. Si éxito: redirigir a `/login` del dashboard
5. Si error: mostrar mensaje inline

---

## 🎨 Sistema de diseño

### Paleta de colores (tema corporativo)

```css
/* Tailwind custom theme */
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#f0fdf4',
    500: '#22c55e',
    900: '#14532d'
  }
}
```

### Tipografía

- **Headings:** `font-family: 'Inter', sans-serif` (weight: 700)
- **Body:** `font-family: 'Inter', sans-serif` (weight: 400)

### Responsive breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## ⚡ Performance

### Lighthouse Score

Target o meta esperada: **>95 en todas las categorías**

- **Performance:** 98
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

### Optimizaciones aplicadas

- ✅ Imágenes optimizadas con `<Image>` de Astro
- ✅ Lazy loading de imágenes (below the fold)
- ✅ Preload de assets críticos (fonts, CSS)
- ✅ Minificación automática de HTML/CSS/JS
- ✅ Code splitting por página
- ✅ React islands solo donde hay interactividad

### Bundle size

```
Total bundle: ~45 KB (gzipped)
├── Landing page: ~15 KB
├── Productos: ~12 KB
├── Simulador: ~25 KB (incluye React)
└── Indicadores: ~18 KB
```

---

## 🔍 SEO

### Meta tags por página

Cada página tiene meta tags optimizados:

```astro
<head>
  <title>Billetera Digital — Banca online segura y simple</title>
  <meta name="description" content="...">
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:image" content="...">
  <meta name="twitter:card" content="summary_large_image">
</head>
```

### Sitemap automático

Configurado en `astro.config.mjs`:

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://billetera-digital.com',
  integrations: [sitemap()]
});
```

Genera `sitemap.xml` en build time.

### robots.txt

```
User-agent: *
Allow: /
Sitemap: https://billetera-digital.com/sitemap.xml
```

---

## 🚢 Deployment

### Deploy en Netlify (recomendado)

1. Push a GitHub
2. Conectar repositorio en [Netlify](https://netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy automático

### Deploy en Vercel

Similar a Netlify, configuración automática al conectar repo.

### Variables de entorno en producción

```bash
PUBLIC_API_URL=https://tu-backend.railway.app/api
PUBLIC_MINDICADOR_URL=https://mindicador.cl/api
```

---

## 🎯 Decisiones técnicas

### ¿Por qué Astro y no Next.js?

El portal público es mayormente estático (no requiere autenticación ni estado complejo). Astro genera HTML puro, resultando en sites ~40% más rápidos que Next.js para contenido estático.

### ¿Por qué React Islands?

Astro renderiza todo a HTML estático por defecto. React se usa **solo** para componentes interactivos (simulador, formularios), reduciendo el JavaScript enviado al cliente.

### ¿Por qué no usar Supabase directamente desde Astro?

Mantiene la arquitectura centralizada, es decir, todo pasa por el backend Java. Esto permite:
- Validaciones consistentes (RUT, business rules)
- Auditoría completa de registros
- Rate limiting en un solo punto

---

## 🔗 Repositorios Relacionados

- [Backend (Spring Boot)](https://github.com/omarpg/backend) — API REST
- [Dashboard (Next.js)](https://github.com/omarpg/front-dashboard) — App autenticada

---

**Desarrollado con 🚀 y Astro**