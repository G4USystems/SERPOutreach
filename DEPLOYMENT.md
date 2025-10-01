# 🚀 Guía de Despliegue - SERP Outreach

## Opciones de Despliegue

### 1. Vercel (Recomendado para Next.js)

**Pasos:**
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Vercel detectará automáticamente que es Next.js
5. Haz clic en "Deploy"
6. ¡Listo! Tu app estará disponible en una URL pública

**Ventajas:**
- ✅ Optimizado para Next.js
- ✅ CDN global automático
- ✅ SSL gratuito
- ✅ Despliegues automáticos en cada push
- ✅ Dominio personalizado gratuito

### 2. Netlify

**Pasos:**
1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. Arrastra la carpeta del proyecto a la interfaz
3. O conecta tu repositorio Git
4. Netlify compilará y desplegará automáticamente

**Configuración para Netlify:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Railway

**Pasos:**
1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio
3. Railway detectará Next.js automáticamente
4. Se desplegará automáticamente

### 4. Render

**Pasos:**
1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio
3. Selecciona "Static Site" o "Web Service"
4. Configura el comando de build: `npm run build`

## 📋 Checklist Pre-Despliegue

- ✅ La aplicación compila sin errores (`npm run build`)
- ✅ Todas las dependencias están en `package.json`
- ✅ Los webhooks de n8n están funcionando
- ✅ Las imágenes están en la carpeta `public/`
- ✅ No hay variables de entorno sensibles hardcodeadas

## 🔧 Variables de Entorno (si necesarias)

Si en el futuro necesitas variables de entorno:

```bash
# .env.local
NEXT_PUBLIC_WEBHOOK_KEYWORDS=https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs
NEXT_PUBLIC_WEBHOOK_SERP=https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach
```

## 🌐 Dominio Personalizado

Una vez desplegado, puedes configurar un dominio personalizado:
- En Vercel: Settings → Domains
- En Netlify: Site settings → Domain management

## 📊 Monitoreo

- Vercel Analytics (incluido)
- Google Analytics (si lo necesitas)
- Sentry para error tracking (opcional)

---

**¡Tu aplicación SERP Outreach estará lista para usar por cualquier persona en internet!** 🎉
