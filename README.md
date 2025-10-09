# 🚀 SERP Outreach Pro - Growth 4U

Sistema completo de outreach para link building que integra investigación de keywords, análisis SERP, extracción de contactos y gestión de campañas.

## ✨ Estado Actual

### ✅ Funcionalidades Activas

- **🏠 Dashboard**: Vista general con métricas y quick actions
- **🔍 Keywords Research**: Búsqueda y análisis de keywords con datos de volumen, CPC y competencia
- **🎯 SERP Analysis**: Análisis de resultados de búsqueda para encontrar oportunidades de outreach
- **⚙️ Settings**: Configuración de webhooks y estado del sistema
- **🌙 Dark Mode**: Tema oscuro/claro con persistencia
- **📱 Responsive**: Diseño adaptable a móvil, tablet y desktop

### ⏳ Próximamente

- **👥 Contacts Management**: Gestión de contactos extraídos
- **📧 Campaigns**: Sistema de campañas de outreach
- **📊 Analytics**: Métricas detalladas y reportes
- **🔗 Backlinks**: Tracking de backlinks adquiridos

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Estilos**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui, Lucide Icons
- **Backend**: n8n webhooks
- **Database**: Google Sheets (próximamente)
- **Analytics**: Vercel Analytics

## 📋 Requisitos

- Node.js 18+
- npm o pnpm
- Acceso a webhooks de n8n

## 🚀 Instalación y Uso

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Ejecutar en Desarrollo

```bash
npm run dev
```

### 3. Abrir en el Navegador

Visita [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
├── app/
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── components/
│   ├── outreach-tool.tsx     # Componente principal del sistema
│   ├── keyword-explorer.tsx  # Búsqueda de keywords
│   ├── keyword-results.tsx   # Resultados SERP
│   ├── theme-provider.tsx    # Provider de tema
│   └── ui/                   # Componentes UI reutilizables
├── lib/
│   └── utils.ts              # Utilidades
├── public/
│   └── images/               # Imágenes y assets
└── docs/
    ├── ARCHITECTURE-PLAN.md  # Plan de arquitectura completo
    ├── MAPEO-CAMPOS.md       # Mapeo de campos webhook
    └── WEBHOOK-FORMAT.md     # Formato de webhooks
```

## 🔌 Webhooks Activos

### 1. Keywords Research
**URL**: `https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs`

**Input**:
```json
{
  "keywords": ["keyword1", "keyword2"],
  "location_name": "Spain",
  "language_name": "Spanish"
}
```

**Output**:
```json
[
  {
    "keyword": "keyword1",
    "search_volume": 12000,
    "competition": "HIGH",
    "cpc": 2.5
  }
]
```

### 2. SERP Analysis
**URL**: `https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach`

**Input**:
```json
{
  "keywords": ["keyword1"],
  "location_name": "Spain",
  "language_name": "Spanish"
}
```

**Output**:
```json
[
  {
    "url": "https://example.com",
    "title": "Article Title",
    "keyword": "keyword1",
    "type_classification": "article",
    "permite_pautar": "SI",
    "razon": "Good content quality",
    "medio_contacto": "email",
    "dirección_contacto": "contact@example.com",
    "categoría_contacto": "direct"
  }
]
```

## 🎯 Flujo de Trabajo

1. **Keywords Research** → Busca keywords relevantes
2. **SERP Analysis** → Analiza resultados de búsqueda
3. **Review Opportunities** → Revisa sitios encontrados
4. **Export Data** → Descarga resultados en CSV

## 🎨 Características de UI

### Dashboard
- Stats cards con métricas clave
- Quick actions para acceso rápido
- Diseño moderno con gradientes

### Sidebar
- Navegación clara con iconos
- Badges para features próximas
- Colapsable para más espacio

### Keywords
- Búsqueda intuitiva
- Tabla con datos detallados
- Selección múltiple de keywords

### Opportunities
- Análisis SERP completo
- Información de contacto
- Clasificación por tipo de contenido
- Export a CSV

## 📊 Datos Procesados

### Keywords
- Volumen de búsqueda
- CPC (Cost Per Click)
- Nivel de competencia
- Tendencias

### Opportunities
- URL del sitio
- Título del contenido
- Dominio
- Clasificación (article, video, social)
- Permite pautar (SI/NO)
- Razón de inclusión
- Medio de contacto
- Dirección de contacto
- Categoría de contacto

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub
2. Vercel detectará Next.js automáticamente
3. Deploy con un clic

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para más detalles.

## 📚 Documentación

- **[ARCHITECTURE-PLAN.md](./ARCHITECTURE-PLAN.md)**: Arquitectura completa del sistema
- **[MAPEO-CAMPOS.md](./MAPEO-CAMPOS.md)**: Mapeo de campos webhook → frontend
- **[WEBHOOK-FORMAT.md](./WEBHOOK-FORMAT.md)**: Formato detallado de webhooks

## 🔐 Seguridad

- Webhooks con autenticación
- Variables de entorno para secrets
- Validación de datos en frontend
- CORS configurado correctamente

## 📝 Changelog

### v1.0.0 (Actual)
- ✅ Dashboard con stats
- ✅ Keywords research completo
- ✅ SERP analysis completo
- ✅ Export a CSV
- ✅ Dark mode
- ✅ Responsive design
- ✅ Settings page

### Próximas Versiones
- 🔜 v1.1.0: Contact management
- 🔜 v1.2.0: Campaign system
- 🔜 v1.3.0: Analytics dashboard
- 🔜 v2.0.0: AI-powered features

## 📧 Soporte

Para soporte o preguntas, contacta a: accounts@growth4u.io

## 📄 Licencia

© 2024 Growth 4U. Todos los derechos reservados.

---

**Desarrollado con ❤️ por Growth 4U**
