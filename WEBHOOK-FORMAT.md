# 📋 Formato de Respuesta de Webhooks

## Webhook 1: Keywords (`v0-KWs`)

### URL
```
https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs
```

### Request Esperado
```json
{
  "keywords": ["invertir dinero", "asesor financiero"],
  "location_name": "Spain",
  "language_name": "Spanish"
}
```

### Response Esperado (Opción 1 - Array directo)
```json
[
  {
    "keyword": "invertir dinero",
    "search_volume": 45000,
    "competition": "HIGH",
    "cpc": 2.5
  },
  {
    "keyword": "asesor financiero",
    "search_volume": 38000,
    "competition": "MEDIUM",
    "cpc": 1.8
  }
]
```

### Response Esperado (Opción 2 - Con propiedad keywords)
```json
{
  "keywords": [
    {
      "keyword": "invertir dinero",
      "search_volume": 45000,
      "competition": "HIGH",
      "cpc": 2.5
    }
  ]
}
```

---

## Webhook 2: SERP Outreach (`SERP-outreach`)

### URL
```
https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach
```

### Request Esperado
```json
{
  "keywords": ["invertir dinero", "asesor financiero"],
  "location_name": "Spain",
  "language_name": "Spanish"
}
```

### Response Esperado (Opción 1 - Array directo)
```json
[
  {
    "keyword": "invertir dinero",
    "query": "invertir dinero",
    "position": 1,
    "title": "Cómo invertir dinero - Guía completa 2024",
    "url": "https://ejemplo.com/invertir-dinero",
    "type": "organic",
    "channel": "web",
    "duration": null,
    "platform": null,
    "razon": "Contenido relevante",
    "type_classification": "article",
    "permite_pautar": "SI",
    "email_contact": "contacto@ejemplo.com"
  },
  {
    "keyword": "invertir dinero",
    "query": "invertir dinero",
    "position": 2,
    "title": "Tutorial de inversión en YouTube",
    "url": "https://youtube.com/watch?v=123",
    "type": "video",
    "channel": "youtube",
    "duration": "10:30",
    "platform": "YouTube",
    "razon": "Video educativo",
    "type_classification": "video",
    "permite_pautar": "NO",
    "email_contact": null
  }
]
```

### Response Esperado (Opción 2 - Con propiedad results)
```json
{
  "results": [
    {
      "keyword": "invertir dinero",
      "position": 1,
      "title": "Cómo invertir dinero",
      "url": "https://ejemplo.com/invertir",
      "type": "organic",
      "type_classification": "article",
      "permite_pautar": "SI",
      "email_contact": "info@ejemplo.com"
    }
  ]
}
```

---

## 📊 Campos de la Tabla SERP

### Campos Obligatorios
- `keyword` o `query`: La palabra clave buscada
- `title` o `titulo`: Título del resultado
- `url`: URL del sitio web
- `position`: Posición en los resultados (1-100)

### Campos Opcionales
- `type`: Tipo de resultado (`organic`, `video`, etc.)
- `channel`: Canal (`web`, `youtube`, etc.)
- `duration` o `duracion`: Duración del video (si aplica)
- `platform` o `plataforma`: Plataforma (YouTube, Vimeo, etc.)
- `razon`: Razón de inclusión
- `type_classification` o `tipo_clasificacion`: Clasificación (`video`, `article`, `social`)
- `permite_pautar`: Si permite publicidad (`SI`, `NO`, `N/A`)
- `email_contact` o `email`: Email de contacto

### Campos Calculados Automáticamente
- `domain`: Se extrae automáticamente de la URL
- `id`: Se genera automáticamente

---

## 🧪 Cómo Probar los Webhooks

### Desde Terminal (curl)

**Webhook Keywords:**
```bash
curl -X POST https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs \
  -H "Content-Type: application/json" \
  -d '{"keywords":["test"],"location_name":"Spain","language_name":"Spanish"}'
```

**Webhook SERP:**
```bash
curl -X POST https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach \
  -H "Content-Type: application/json" \
  -d '{"keywords":["test"],"location_name":"Spain","language_name":"Spanish"}'
```

### Desde Postman

1. Método: `POST`
2. URL: (ver arriba)
3. Headers:
   - `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "keywords": ["test"],
  "location_name": "Spain",
  "language_name": "Spanish"
}
```

---

## 🎨 Visualización en el Frontend

### Tabla de Keywords
- **Keyword**: Texto simple
- **Volumen de búsqueda**: Número formateado con separadores de miles
- **CPC**: Formato €X.XX
- **Competencia**: Badge de color (Alta=rojo, Media=amarillo, Baja=verde)

### Tabla de SERP Results
- **Keyword**: Texto azul
- **Posición**: Badge de color (1-3=verde, 4-10=amarillo, 11+=rojo)
- **Título**: Texto truncado con tooltip
- **URL**: Link clickeable que abre en nueva pestaña
- **Dominio**: Texto gris
- **Tipo**: Badge de color (organic=azul, video=morado)
- **Plataforma**: Texto simple o '-'
- **Duración**: Texto simple o '-'
- **Tipo de medio**: Badge de color (video=morado, article=azul, social=rosa)
- **Permite Pautar**: Badge de color (SI=verde, NO=rojo, N/A=gris)
- **Email**: Texto pequeño o '-'

---

## ✅ Checklist de Verificación

- [ ] Webhook de Keywords está activo en n8n
- [ ] Webhook de SERP está activo en n8n
- [ ] Webhooks responden con el formato correcto
- [ ] Los campos obligatorios están presentes
- [ ] La aplicación muestra los datos correctamente
- [ ] Los colores y badges se muestran apropiadamente
- [ ] Los links son clickeables
- [ ] El CSV exporta todos los campos

