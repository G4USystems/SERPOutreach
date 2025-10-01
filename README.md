# SERP Outreach - Growth 4U

Una aplicación web para análisis de palabras clave y investigación SERP.

## 🚀 Características

- **Búsqueda de Keywords**: Encuentra las mejores palabras clave para tu estrategia SEO
- **Análisis SERP**: Analiza los resultados de búsqueda de Google para keywords seleccionadas
- **Exportación CSV**: Exporta todos los resultados para análisis posterior
- **Interfaz Moderna**: UI responsive y fácil de usar

## 🛠️ Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes accesibles
- **n8n Webhooks** - Integración con flujos de automatización

## 📦 Instalación Local

```bash
# Clonar el repositorio
git clone [tu-repositorio]

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
npm start
```

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Vercel detectará automáticamente la configuración Next.js
3. Se desplegará automáticamente en cada push

### Netlify
1. Arrastra la carpeta del proyecto a [netlify.com](https://netlify.com)
2. O conecta tu repositorio Git

## ⚙️ Configuración

La aplicación utiliza webhooks de n8n para:
- **Búsqueda de Keywords**: `https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs`
- **Análisis SERP**: `https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach`

## 📱 Uso

1. **Buscar Keywords**: Ingresa términos separados por comas
2. **Seleccionar Keywords**: Marca las keywords que quieres analizar
3. **Análisis SERP**: Ejecuta el análisis de resultados de Google
4. **Exportar**: Descarga los resultados en formato CSV

## 🎯 Funcionalidades

- ✅ Búsqueda de keywords con volumen y competencia
- ✅ Ordenamiento por volumen de búsqueda
- ✅ Selección múltiple de keywords
- ✅ Análisis SERP detallado
- ✅ Exportación CSV completa
- ✅ Interfaz responsive
- ✅ Manejo de errores robusto

---

Desarrollado por **Growth 4U** 🚀
