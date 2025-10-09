# 🔧 Troubleshooting: SERP Webhook Timeout (504)

## 📊 **Estado Actual**

### ✅ **Keywords Webhook**
- **Estado:** Funcionando correctamente
- **URL:** `https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs`
- **Respuesta:** < 5 segundos

### ❌ **SERP Webhook**
- **Estado:** Timeout (504 Gateway Time-out)
- **URL:** `https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach`
- **Error:** El servidor tarda más de 60 segundos en responder

---

## 🔍 **Diagnóstico del Problema**

El error **504 Gateway Time-out** significa que:

1. ✅ El webhook **SÍ está activo** en n8n
2. ✅ El workflow **SÍ está recibiendo** la petición
3. ❌ El workflow **tarda demasiado** en procesar (> 60 segundos)
4. ❌ El gateway de Elestio/OpenResty **corta la conexión** por timeout

---

## 🛠️ **Cómo Diagnosticar en n8n**

### **Paso 1: Revisar Ejecuciones**

1. Abre n8n: `https://n8n-growth4u-u37225.vm.elestio.app`
2. Ve al workflow **"SERP-outreach"**
3. Haz clic en **"Executions"** (ejecuciones)
4. Busca ejecuciones recientes:
   - ⏳ **Running (En ejecución):** El workflow está procesando pero no termina
   - ❌ **Failed (Fallidas):** Hay un error en el workflow
   - ✅ **Success (Exitosas):** El workflow terminó pero tardó demasiado

### **Paso 2: Revisar Nodos Lentos**

Busca estos nodos en tu workflow:

```
📌 Nodos que suelen ser LENTOS:

1. HTTP Request (llamadas a APIs externas)
   - Google SERP API
   - DataForSEO API
   - Rate limits
   
2. Loops (bucles que procesan muchos items)
   - Loop Over Items
   - Split In Batches
   
3. Google Sheets (escritura/lectura masiva)
   - Append rows
   - Lookup rows
   
4. Code (JavaScript que procesa muchos datos)
   - Procesamiento de arrays grandes
   - Llamadas API síncronas
```

### **Paso 3: Revisar Logs**

En cada nodo, revisa:
- ⏱️ **Tiempo de ejecución** (execution time)
- 📊 **Cantidad de items procesados**
- ❌ **Errores o warnings**

---

## ✅ **Soluciones Recomendadas**

### **Solución 1: Reducir Cantidad de Keywords** (Más Fácil)

**Frontend ya actualizado:**
- ⚠️ Avisa al usuario si selecciona > 5 keywords
- 💡 Recomienda procesar máximo 3-5 keywords a la vez

**En el workflow:**
- Limita los resultados por keyword (ej: solo top 10)
- Procesa menos keywords en paralelo

### **Solución 2: Optimizar el Workflow** (n8n)

```yaml
Cambios recomendados:

1. HTTP Request Nodes:
   - Añadir timeout explícito (30 segundos)
   - Usar "Continue On Fail" para no detener el flujo
   
2. Split In Batches:
   - Reducir batch size (ej: 1 keyword por batch)
   - Procesar secuencialmente en vez de paralelo
   
3. Google Sheets:
   - Usar "Batch" mode para escritura masiva
   - Escribir al final, no por cada resultado
   
4. Code Nodes:
   - Optimizar loops
   - Evitar llamadas API síncronas
```

### **Solución 3: Usar Webhooks Asíncronos** (Avanzado)

**Flujo actual (síncrono):**
```
Frontend → Webhook → n8n procesa → Responde → Frontend
          |                                  |
          └──────── 60+ segundos ────────────┘
                    ❌ TIMEOUT
```

**Flujo asíncrono (recomendado):**
```
Frontend → Webhook → n8n acepta → Responde inmediato
                        |
                        ↓ procesa en background
                        ↓
                     Google Sheets
                        |
                        ↓
Frontend ← Polling ← Google Sheets (lee resultados)
```

**Ventajas:**
- ✅ No hay timeouts
- ✅ Puede procesar miles de keywords
- ✅ El usuario puede seguir usando la app

---

## 🧪 **Tests Rápidos**

### **Test 1: Probar con 1 Keyword**

```bash
curl -X POST https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach \
  -H "Content-Type: application/json" \
  -d '{"keywords":["test"],"location_name":"Spain","language_name":"Spanish"}' \
  --max-time 120
```

**Si funciona:** El problema es la cantidad de keywords
**Si falla:** Hay un problema en el workflow

### **Test 2: Probar con Keywords Simples**

```bash
curl -X POST https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach \
  -H "Content-Type: application/json" \
  -d '{"keywords":["seo","marketing"],"location_name":"Spain","language_name":"Spanish"}' \
  --max-time 120
```

### **Test 3: Ver Tiempo de Respuesta**

```bash
time curl -X POST https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach \
  -H "Content-Type: application/json" \
  -d '{"keywords":["test"],"location_name":"Spain","language_name":"Spanish"}'
```

---

## 📋 **Checklist de Verificación**

Marca lo que ya has verificado:

- [ ] El workflow "SERP-outreach" está **activo** (toggle verde)
- [ ] Hay ejecuciones **recientes** en "Executions"
- [ ] Las ejecuciones terminan en **menos de 60 segundos**
- [ ] No hay **errores** en los nodos
- [ ] El webhook responde correctamente con **1 keyword**
- [ ] El webhook responde correctamente con **2-3 keywords**
- [ ] El formato de respuesta coincide con `WEBHOOK-FORMAT.md`
- [ ] Google Sheets está **accesible** y no da errores
- [ ] Las APIs externas (SERP) no tienen **rate limits**

---

## 🎯 **Acción Inmediata**

**Para continuar trabajando HOY:**

1. **Frontend:** Ya está actualizado con warning de 5 keywords
2. **Prueba:** Selecciona solo 1-2 keywords en la app
3. **n8n:** Revisa las ejecuciones para ver dónde se queda atascado
4. **Temporal:** Reduce los resultados por keyword en el workflow (ej: top 5)

**Para solución permanente:**

1. Implementar webhooks asíncronos
2. Optimizar nodos lentos en n8n
3. Usar Google Sheets como cache/buffer

---

## 📞 **Necesitas Ayuda?**

Si después de estas pruebas sigues teniendo problemas:

1. Comparte un screenshot de "Executions" en n8n
2. Comparte los tiempos de ejecución de cada nodo
3. Indica cuántas keywords estás procesando
4. Copia el error exacto que ves en la consola del navegador

---

**Última actualización:** 2025-10-09

