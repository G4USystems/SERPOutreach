# 🗺️ Mapeo de Campos - Webhook n8n → Frontend

## Estructura de Salida del Webhook n8n

Tu webhook devuelve un **array de objetos** con esta estructura:

```javascript
[
  {
    url: "https://ejemplo.com/articulo",
    title: "Título del artículo",  // o título (con tilde)
    keyword: "invertir dinero",
    type_classification: "article",  // o clasificación
    permite_pautar: "SI",
    razon: "Contenido relevante",  // o razón (con tilde)
    medio_contacto: "email",
    dirección_contacto: "contacto@ejemplo.com",
    categoría_contacto: "directo"
  }
]
```

## Mapeo de Campos Frontend

### Campos Principales

| Campo Webhook | Campo Frontend | Tipo | Valores por Defecto |
|---------------|----------------|------|---------------------|
| `url` | `url` | string | 'N/A' |
| `title` o `título` | `title` | string | 'N/A' |
| `keyword` | `keyword` | string | Keyword enviada en request |
| `type_classification` o `clasificación` | `type_classification` | string | null |
| `permite_pautar` | `permite_pautar` | string | 'SI' |
| `razon` o `razón` | `razon` | string | null |

### Campos de Contacto

| Campo Webhook | Campo Frontend | Tipo | Valores por Defecto |
|---------------|----------------|------|---------------------|
| `medio_contacto` | `medio_contacto` | string | 'NO_DATOS' |
| `dirección_contacto` | `dirección_contacto` | string | 'NO_DATOS' |
| `categoría_contacto` | `categoría_contacto` | string | 'NO_DATOS' |

### Campos Calculados Automáticamente

| Campo Frontend | Cálculo | Descripción |
|----------------|---------|-------------|
| `domain` | Extraído de `url` | Hostname de la URL |
| `id` | `${keyword}-${url}` | ID único para React |
| `position` | `index + 1` | Posición en la lista (1, 2, 3...) |

### Campos Opcionales (No usados actualmente)

| Campo Frontend | Valores por Defecto |
|----------------|---------------------|
| `type` | 'organic' |
| `channel` | 'N/A' |
| `duration` | null |
| `platform` | null |
| `email_contact` | null (o `dirección_contacto`) |

## Visualización en la Tabla

### Columnas de la Tabla

1. **Keyword** - Texto azul
2. **Título** - Texto truncado con tooltip
3. **URL** - Link clickeable (abre en nueva pestaña)
4. **Dominio** - Texto gris (extraído de URL)
5. **Clasificación** - Badge de color:
   - `video` → Morado
   - `article` / `articulo` → Azul
   - `social` → Rosa
   - Otro → Gris
6. **Permite Pautar** - Badge de color:
   - `SI` / `Sí` / `Yes` → Verde
   - `NO` / `No` → Rojo
   - Otro → Gris
7. **Razón** - Texto simple
8. **Medio Contacto** - Badge índigo
9. **Dirección Contacto** - Texto truncado con tooltip
10. **Categoría Contacto** - Badge teal

## Ejemplo de Respuesta Completa

```json
[
  {
    "url": "https://www.ejemplo.com/como-invertir-dinero",
    "title": "Cómo invertir dinero en 2024 - Guía completa",
    "keyword": "invertir dinero",
    "type_classification": "article",
    "permite_pautar": "SI",
    "razon": "Contenido educativo de calidad con buena autoridad de dominio",
    "medio_contacto": "email",
    "dirección_contacto": "contacto@ejemplo.com",
    "categoría_contacto": "directo"
  },
  {
    "url": "https://www.youtube.com/watch?v=abc123",
    "title": "Tutorial: Cómo invertir tu dinero paso a paso",
    "keyword": "invertir dinero",
    "type_classification": "video",
    "permite_pautar": "NO",
    "razon": "Canal no acepta colaboraciones pagadas",
    "medio_contacto": "formulario",
    "dirección_contacto": "https://ejemplo.com/contacto",
    "categoría_contacto": "indirecto"
  },
  {
    "url": "https://www.finanzas.com/mejores-inversiones",
    "title": "Las 10 mejores formas de invertir tu dinero",
    "keyword": "invertir dinero",
    "type_classification": "article",
    "permite_pautar": "SI",
    "razon": "Sitio especializado en finanzas con alta audiencia",
    "medio_contacto": "email",
    "dirección_contacto": "publicidad@finanzas.com",
    "categoría_contacto": "comercial"
  }
]
```

## Exportación CSV

El CSV exportado incluye estos campos en este orden:

```
Keyword, Titulo, URL, Domain, Clasificacion, Permite_Pautar, Razon, Medio_Contacto, Direccion_Contacto, Categoria_Contacto
```

## Notas Importantes

### 1. Campos con Tildes
El código maneja tanto versiones con tilde como sin tilde:
- `title` / `título`
- `razon` / `razón`
- `type_classification` / `clasificación`

### 2. Extracción de Dominio
Se extrae de forma segura con try-catch para evitar errores si la URL es inválida.

### 3. Valores por Defecto
- Campos de contacto: `'NO_DATOS'`
- Permite pautar: `'SI'` (asume que todos los resultados filtrados permiten pautar)
- Otros campos: `null` o `'N/A'`

### 4. Keyword
Si el webhook incluye el campo `keyword` en cada resultado, se usa ese valor.
Si no, se asigna automáticamente basándose en las keywords enviadas en el request.

## Flujo Completo

```
1. Usuario ingresa keywords → ["invertir dinero", "asesor financiero"]
2. Frontend envía a webhook:
   {
     keywords: ["invertir dinero", "asesor financiero"],
     location_name: "Spain",
     language_name: "Spanish"
   }
3. Webhook n8n procesa y devuelve array de resultados
4. Frontend mapea campos y muestra en tabla
5. Usuario puede exportar a CSV
```

## Testing

Para verificar que todo funciona:

1. Abre la consola del navegador (F12)
2. Busca logs que empiecen con `[v0]`
3. Verifica:
   - `[v0] Respuesta del SERP webhook:` - Muestra la respuesta cruda
   - `[v0] Procesando array directo con X elementos` - Confirma que detectó el formato
   - `[v0] Primer elemento:` - Muestra el primer resultado
   - `[v0] All SERP results:` - Muestra todos los resultados procesados

