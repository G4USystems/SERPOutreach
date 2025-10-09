# 🏗️ Plan de Arquitectura - SERP Outreach Pro

## 📋 Resumen Ejecutivo

Sistema completo de outreach para link building que integra:
- Investigación de keywords
- Análisis SERP
- Extracción de contactos
- Gestión de campañas
- Analytics y reportes

---

## 🎯 Componentes del Sistema

### 1. Frontend (Next.js + React)

#### Páginas Principales:
- **Dashboard** - Vista general con métricas clave
- **Keywords** - Investigación y generación de keywords
- **Opportunities** - Análisis SERP y oportunidades de outreach
- **Contacts** - Gestión de contactos extraídos
- **Campaigns** - Gestión de campañas de outreach
- **Analytics** - Métricas y reportes

#### Estado Actual:
✅ Dashboard con stats y quick actions
✅ Integración con KeywordExplorer existente
✅ Integración con KeywordResults existente
⏳ Opportunities (estructura básica)
⏳ Contacts (estructura básica)
⏳ Campaigns (estructura básica)
⏳ Analytics (estructura básica)

---

## 🔄 Flujo de Datos

```
1. Keywords Research
   ↓
2. SERP Analysis (n8n webhook actual)
   ↓
3. Contact Extraction (nuevo)
   ↓
4. Campaign Creation (nuevo)
   ↓
5. Outreach Execution (nuevo)
   ↓
6. Analytics & Tracking (nuevo)
```

---

## 🗄️ Estructura de Datos

### Keywords
```typescript
interface Keyword {
  id: string
  keyword: string
  search_volume: number
  cpc: number
  competition: string
  created_at: Date
  status: 'active' | 'archived'
}
```

### Opportunities (SERP Results)
```typescript
interface Opportunity {
  id: string
  keyword_id: string
  keyword: string
  url: string
  title: string
  domain: string
  position: number
  type_classification: string
  permite_pautar: 'SI' | 'NO'
  razon: string
  score: number  // 0-100 quality score
  status: 'analyzing' | 'high_potential' | 'in_progress' | 'completed' | 'rejected'
  created_at: Date
  updated_at: Date
}
```

### Contacts
```typescript
interface Contact {
  id: string
  opportunity_id: string
  name: string
  email: string
  role: string
  website: string
  medio_contacto: string
  dirección_contacto: string
  categoría_contacto: string
  confidence: number  // 0-100
  verified: boolean
  linkedin_url?: string
  twitter_url?: string
  created_at: Date
  updated_at: Date
}
```

### Campaigns
```typescript
interface Campaign {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  template_id: string
  sent_count: number
  opened_count: number
  replied_count: number
  accepted_count: number
  created_at: Date
  updated_at: Date
}
```

### Campaign Contacts (relación muchos a muchos)
```typescript
interface CampaignContact {
  id: string
  campaign_id: string
  contact_id: string
  status: 'pending' | 'sent' | 'opened' | 'replied' | 'accepted' | 'rejected'
  sent_at?: Date
  opened_at?: Date
  replied_at?: Date
  notes?: string
}
```

---

## 🔌 API Endpoints Necesarios

### Keywords
- `GET /api/keywords` - Listar keywords
- `POST /api/keywords` - Crear keyword
- `GET /api/keywords/:id` - Obtener keyword
- `DELETE /api/keywords/:id` - Eliminar keyword

### Opportunities
- `GET /api/opportunities` - Listar oportunidades
- `GET /api/opportunities/:id` - Obtener oportunidad
- `PATCH /api/opportunities/:id` - Actualizar estado
- `POST /api/opportunities/analyze` - Analizar nuevas keywords (llama a n8n)

### Contacts
- `GET /api/contacts` - Listar contactos
- `GET /api/contacts/:id` - Obtener contacto
- `POST /api/contacts` - Crear contacto manual
- `PATCH /api/contacts/:id` - Actualizar contacto
- `POST /api/contacts/:id/verify` - Verificar email

### Campaigns
- `GET /api/campaigns` - Listar campañas
- `POST /api/campaigns` - Crear campaña
- `GET /api/campaigns/:id` - Obtener campaña
- `PATCH /api/campaigns/:id` - Actualizar campaña
- `POST /api/campaigns/:id/start` - Iniciar campaña
- `POST /api/campaigns/:id/pause` - Pausar campaña
- `GET /api/campaigns/:id/stats` - Estadísticas de campaña

### Analytics
- `GET /api/analytics/dashboard` - Métricas del dashboard
- `GET /api/analytics/campaigns` - Métricas de campañas
- `GET /api/analytics/export` - Exportar reporte

---

## 🤖 Workflows n8n

### Workflow 1: Keywords Research (EXISTENTE)
**URL:** `https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs`

**Input:**
```json
{
  "keywords": ["keyword1", "keyword2"],
  "location_name": "Spain",
  "language_name": "Spanish"
}
```

**Output:**
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

### Workflow 2: SERP Analysis (EXISTENTE)
**URL:** `https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach`

**Input:**
```json
{
  "keywords": ["keyword1"],
  "location_name": "Spain",
  "language_name": "Spanish"
}
```

**Output:**
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

### Workflow 3: Contact Enrichment (NUEVO)
**URL:** `https://n8n-growth4u-u37225.vm.elestio.app/webhook/contact-enrichment`

**Propósito:** Enriquecer contactos con información adicional

**Input:**
```json
{
  "email": "contact@example.com",
  "domain": "example.com"
}
```

**Output:**
```json
{
  "name": "John Doe",
  "role": "Content Manager",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "twitter_url": "https://twitter.com/johndoe",
  "confidence": 85
}
```

**Pasos del workflow:**
1. Hunter.io / Apollo.io para encontrar nombre y rol
2. LinkedIn API para perfil
3. Twitter API para perfil social
4. Calcular score de confianza

### Workflow 4: Email Verification (NUEVO)
**URL:** `https://n8n-growth4u-u37225.vm.elestio.app/webhook/verify-email`

**Input:**
```json
{
  "email": "contact@example.com"
}
```

**Output:**
```json
{
  "valid": true,
  "deliverable": true,
  "score": 95
}
```

**Servicios a usar:**
- ZeroBounce
- Hunter.io
- NeverBounce

### Workflow 5: Campaign Execution (NUEVO)
**URL:** `https://n8n-growth4u-u37225.vm.elestio.app/webhook/send-campaign`

**Input:**
```json
{
  "campaign_id": "123",
  "contact_id": "456",
  "template": "...",
  "variables": {
    "name": "John",
    "website": "example.com"
  }
}
```

**Output:**
```json
{
  "sent": true,
  "message_id": "abc123",
  "provider": "sendgrid"
}
```

**Servicios a usar:**
- SendGrid / Mailgun para envío
- Tracking de opens/clicks
- Webhook para respuestas

---

## 📊 Base de Datos (Google Sheets)

### Sheet 1: Keywords
| id | keyword | search_volume | cpc | competition | status | created_at |
|----|---------|---------------|-----|-------------|--------|------------|

### Sheet 2: Opportunities
| id | keyword_id | keyword | url | title | domain | type_classification | permite_pautar | razon | score | status | created_at |
|----|------------|---------|-----|-------|--------|---------------------|----------------|-------|-------|--------|------------|

### Sheet 3: Contacts
| id | opportunity_id | name | email | role | website | medio_contacto | dirección_contacto | categoría_contacto | confidence | verified | linkedin_url | twitter_url | created_at |
|----|----------------|------|-------|------|---------|----------------|-------------------|-------------------|------------|----------|--------------|-------------|------------|

### Sheet 4: Campaigns
| id | name | description | status | template_id | sent_count | opened_count | replied_count | accepted_count | created_at |
|----|------|-------------|--------|-------------|------------|--------------|---------------|----------------|------------|

### Sheet 5: Campaign_Contacts
| id | campaign_id | contact_id | status | sent_at | opened_at | replied_at | notes |
|----|-------------|------------|--------|---------|-----------|------------|-------|

---

## 🔄 Integración con Google Sheets

### Opción 1: Google Sheets API (Recomendado)
- Usar `@googleapis/sheets` en Next.js API routes
- Autenticación con Service Account
- CRUD operations directas

### Opción 2: n8n como Middleware
- Crear endpoints en n8n que manejen Google Sheets
- Frontend llama a n8n, n8n actualiza Sheets
- Más simple pero menos flexible

---

## 🎨 Próximos Pasos

### Fase 1: Completar Frontend Básico ✅
- [x] Dashboard con stats
- [x] Integrar Keywords existente
- [x] Integrar Opportunities existente
- [ ] Completar Contacts UI
- [ ] Completar Campaigns UI
- [ ] Completar Analytics UI

### Fase 2: Backend API
- [ ] Configurar Google Sheets API
- [ ] Crear API routes en Next.js
- [ ] Implementar CRUD para Keywords
- [ ] Implementar CRUD para Opportunities
- [ ] Implementar CRUD para Contacts
- [ ] Implementar CRUD para Campaigns

### Fase 3: Workflows n8n
- [ ] Workflow Contact Enrichment
- [ ] Workflow Email Verification
- [ ] Workflow Campaign Execution
- [ ] Integrar webhooks con frontend

### Fase 4: Features Avanzados
- [ ] Email templates editor
- [ ] Automated follow-ups
- [ ] A/B testing
- [ ] Advanced analytics
- [ ] Reporting dashboard

---

## 🔐 Seguridad

- API keys en variables de entorno
- Autenticación para API routes
- Rate limiting en webhooks
- Validación de datos
- Sanitización de inputs

---

## 📈 Métricas a Trackear

### Dashboard
- Active campaigns
- Links acquired
- Response rate
- Domain authority average

### Campaigns
- Sent count
- Open rate
- Reply rate
- Acceptance rate
- Conversion rate

### Contacts
- Total contacts
- Verified contacts
- Confidence score average
- Social profiles found

---

## 🚀 Deploy

### Frontend (Vercel)
- Conectar repositorio GitHub
- Configurar variables de entorno
- Deploy automático

### Backend (n8n)
- Ya está en Elestio
- Crear nuevos workflows
- Configurar webhooks

### Database (Google Sheets)
- Crear spreadsheet
- Configurar permisos
- Obtener credentials

---

## 💡 Mejoras Futuras

1. **AI-Powered Features**
   - Email template generation
   - Personalization suggestions
   - Opportunity scoring

2. **Integrations**
   - CRM integration (HubSpot, Salesforce)
   - Slack notifications
   - Zapier webhooks

3. **Advanced Analytics**
   - Cohort analysis
   - Funnel visualization
   - ROI calculator

4. **Automation**
   - Auto follow-ups
   - Smart scheduling
   - Response detection

---

## 📝 Notas

- Usar TypeScript para type safety
- Implementar error handling robusto
- Logs detallados para debugging
- Tests unitarios para funciones críticas
- Documentación de API con Swagger/OpenAPI

