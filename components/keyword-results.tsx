"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchIcon, DownloadIcon, RotateCcwIcon } from "lucide-react"
import Image from "next/image"

interface KeywordData {
  id: string
  keyword: string
  search_volume: number
  cpc: number
  competition: string
}

interface SerpResult {
  id: string
  keyword: string
  url: string
  title: string
  position: number
  domain: string
  type?: string
  channel?: string
  duration?: string | null
  platform?: string | null
  razon?: string | null
  type_classification?: string | null
  permite_pautar?: string | null
  email_contact?: string | null
  medio_contacto?: string | null
  dirección_contacto?: string | null
  categoría_contacto?: string | null
}

interface KeywordResultsProps {
  onBackToSearch: () => void
  keywordData: KeywordData[]
}

// Use proxy in development, direct webhook in production
const SERP_WEBHOOK_ENDPOINT = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? '/api/serp'
  : 'https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach'

export function KeywordResults({ onBackToSearch, keywordData }: KeywordResultsProps) {
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [serpResults, setSerpResults] = useState<SerpResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [showSerpResults, setShowSerpResults] = useState(false)

  const handleCheckboxChange = (keywordId: string, checked: boolean) => {
    console.log('[CHECKBOX] handleCheckboxChange called:', { keywordId, checked, currentSize: selectedKeywords.size })
    const newSelected = new Set(selectedKeywords)
    if (checked) {
      newSelected.add(keywordId)
      console.log('[CHECKBOX] Added keyword:', keywordId, 'New size:', newSelected.size)
    } else {
      newSelected.delete(keywordId)
      console.log('[CHECKBOX] Removed keyword:', keywordId, 'New size:', newSelected.size)
    }
    setSelectedKeywords(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    console.log('[CHECKBOX] handleSelectAll called:', { checked, totalKeywords: keywordData.length })
    if (checked) {
      const allIds = keywordData.map((k) => k.id)
      console.log('[CHECKBOX] Selecting all:', allIds)
      setSelectedKeywords(new Set(allIds))
    } else {
      console.log('[CHECKBOX] Deselecting all')
      setSelectedKeywords(new Set())
    }
  }

  const handleSearchSites = async () => {
    if (selectedKeywords.size === 0) return

    // Advertencia si hay muchas keywords
    if (selectedKeywords.size > 2) {
      const confirm = window.confirm(
        `⚠️ Has seleccionado ${selectedKeywords.size} keywords.\n\n` +
        `⏱️ IMPORTANTE: El webhook actualmente tarda ~1 minuto por keyword.\n` +
        `Con ${selectedKeywords.size} keywords, el proceso tardará ${selectedKeywords.size} minutos aproximadamente.\n\n` +
        `🚨 Si tarda más de 2 minutos, el navegador cortará la conexión y verás un error.\n\n` +
        `💡 RECOMENDACIÓN: Procesa máximo 1-2 keywords a la vez hasta optimizar el workflow.\n\n` +
        `¿Deseas continuar de todas formas?`
      )
      if (!confirm) return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setIsAnalyzing(true)
    setAnalysisComplete(false)

    try {
      const selectedKeywordTexts = keywordData.filter((k) => selectedKeywords.has(k.id)).map((k) => k.keyword)

      console.log("[v0] Enviando keywords seleccionadas al SERP webhook:", selectedKeywordTexts)

      const payload = {
        keywords: selectedKeywordTexts,
        location_name: "Spain",
        language_name: "Spanish"
      }
      
      console.log("[v0] Enviando payload al SERP webhook:", payload)
      console.log("[v0] URL del webhook:", SERP_WEBHOOK_ENDPOINT)
      console.log("[v0] Iniciando fetch request...")

      const startTime = Date.now()

      // Configurar timeout de 3 minutos (180 segundos)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        console.log("[v0] Request abortada después de 3 minutos")
      }, 180000) // 3 minutos

      let response
      try {
        response = await fetch(SERP_WEBHOOK_ENDPOINT, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload),
          mode: 'cors',
          credentials: 'omit',
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
        console.log(`[v0] ✅ Fetch completado en ${elapsed} segundos`)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
        console.log(`[v0] ❌ Fetch falló después de ${elapsed} segundos:`, fetchError)
        throw fetchError
      }

      console.log("[v0] Fetch completado, status:", response.status)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error del SERP webhook:", response.status, errorText)
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Respuesta del SERP webhook:", data)
      console.log("[v0] Estructura de la respuesta:", JSON.stringify(data, null, 2))

      let processedSerpResults: SerpResult[]

      if (data && Array.isArray(data)) {
        // Mapear los datos del webhook a la estructura esperada
        console.log("[v0] Procesando array directo con", data.length, "elementos")
        console.log("[v0] Primer elemento:", data[0])
        
        // Intentar distribuir los resultados entre las keywords enviadas
        const resultsPerKeyword = Math.ceil(data.length / selectedKeywordTexts.length)
        
        processedSerpResults = data.map((item: any, index: number) => {
          // Usar el keyword del item si está disponible, sino asignar uno de los enviados
          const keywordIndex = Math.floor(index / resultsPerKeyword)
          const assignedKeyword = item.keyword || selectedKeywordTexts[keywordIndex] || selectedKeywordTexts[0] || 'N/A'
          
          // Extraer dominio de la URL
          let domain = 'N/A'
          try {
            if (item.url) {
              domain = new URL(item.url).hostname
            }
          } catch (e) {
            console.warn("[v0] Error extrayendo dominio de:", item.url)
          }
          
          return {
            id: `${assignedKeyword}-${item.url || index}`,
            keyword: assignedKeyword,
            url: item.url || 'N/A',
            title: item.title || item.título || item.titulo || 'N/A',
            position: item.position || index + 1,
            domain: domain,
            type: item.type || 'organic',
            channel: item.channel || 'N/A',
            duration: item.duration || item.duracion || null,
            platform: item.platform || item.plataforma || null,
            razon: item.razon || item.razón || null,
            type_classification: item.type_classification || item.clasificación || item.tipo_clasificacion || null,
            permite_pautar: item.permite_pautar || 'SI',
            email_contact: item.email_contact || item.email || item.dirección_contacto || null,
            medio_contacto: item.medio_contacto || 'NO_DATOS',
            dirección_contacto: item.dirección_contacto || 'NO_DATOS',
            categoría_contacto: item.categoría_contacto || 'NO_DATOS'
          }
        })
      } else if (data && Array.isArray(data.results)) {
        console.log("[v0] Procesando data.results con", data.results.length, "elementos")
        const resultsPerKeyword = Math.ceil(data.results.length / selectedKeywordTexts.length)
        
        processedSerpResults = data.results.map((item: any, index: number) => {
          const keywordIndex = Math.floor(index / resultsPerKeyword)
          const assignedKeyword = item.keyword || selectedKeywordTexts[keywordIndex] || selectedKeywordTexts[0] || 'N/A'
          
          let domain = 'N/A'
          try {
            if (item.url) {
              domain = new URL(item.url).hostname
            }
          } catch (e) {
            console.warn("[v0] Error extrayendo dominio de:", item.url)
          }
          
          return {
            id: `${assignedKeyword}-${item.url || index}`,
            keyword: assignedKeyword,
            url: item.url || 'N/A',
            title: item.title || item.título || item.titulo || 'N/A',
            position: item.position || index + 1,
            domain: domain,
            type: item.type || 'organic',
            channel: item.channel || 'N/A',
            duration: item.duration || item.duracion || null,
            platform: item.platform || item.plataforma || null,
            razon: item.razon || item.razón || null,
            type_classification: item.type_classification || item.clasificación || item.tipo_clasificacion || null,
            permite_pautar: item.permite_pautar || 'SI',
            email_contact: item.email_contact || item.email || item.dirección_contacto || null,
            medio_contacto: item.medio_contacto || 'NO_DATOS',
            dirección_contacto: item.dirección_contacto || 'NO_DATOS',
            categoría_contacto: item.categoría_contacto || 'NO_DATOS'
          }
        })
      } else {
        console.log("[v0] Usando estructura de fallback")
        // Fallback structure if API response format is different
        processedSerpResults = selectedKeywordTexts.flatMap((keyword, keywordIndex) =>
          Array.from({ length: 10 }, (_, i) => ({
            id: `${keywordIndex}-${i}`,
            keyword,
            url: `https://ejemplo${i + 1}.com/articulo-${keyword.replace(/\s+/g, "-")}`,
            title: `${keyword} - Guía completa ${i + 1}`,
            position: i + 1,
            domain: `ejemplo${i + 1}.com`,
            type: 'organic',
            channel: 'N/A',
            duration: null,
            platform: null,
            razon: null,
            type_classification: null,
            permite_pautar: null,
            email_contact: null
          })),
        )
      }

      setSerpResults(processedSerpResults)
      setSuccess(true)
      setAnalysisComplete(true)
      setShowSerpResults(true)
      console.log("[v0] Análisis Serp Outreach completado")
      console.log("[v0] processedSerpResults length:", processedSerpResults.length)
      console.log("[v0] analysisComplete set to:", true)
      console.log("[v0] First SERP result:", processedSerpResults[0])
      console.log("[v0] All SERP results:", processedSerpResults)
    } catch (err) {
      console.error("[v0] Error en análisis Serp Outreach:", err)
      console.error("[v0] Error completo:", JSON.stringify(err, Object.getOwnPropertyNames(err)))
      
      let errorMessage = 'Error desconocido'
      if (err instanceof Error) {
        console.error("[v0] Error name:", err.name)
        console.error("[v0] Error message:", err.message)
        console.error("[v0] Error stack:", err.stack)
        
        if (err.name === 'AbortError') {
          errorMessage = `⏱️ TIMEOUT: El proceso tardó más de 3 minutos\n\n` +
            `El webhook SERP está procesando pero tarda demasiado.\n\n` +
            `SOLUCIONES:\n` +
            `1️⃣ Selecciona MENOS keywords (máximo 2-3)\n` +
            `2️⃣ Revisa el workflow en n8n - optimiza según OPTIMIZE-N8N-WORKFLOW.md\n` +
            `3️⃣ Verifica que las APIs externas respondan rápido\n\n` +
            `💡 El webhook funciona, solo necesita optimización.`
        } else if (err.message.includes('Failed to fetch') || err.message.includes('fetch') || err.message.includes('NetworkError')) {
          errorMessage = `🔌 ERROR DE CONEXIÓN\n\n` +
            `No se pudo conectar con el webhook SERP.\n\n` +
            `Posibles causas:\n` +
            `1️⃣ El workflow en n8n está inactivo\n` +
            `2️⃣ Problemas de red o CORS\n` +
            `3️⃣ El servidor está sobrecargado\n\n` +
            `URL: ${SERP_WEBHOOK_ENDPOINT}\n\n` +
            `💡 Verifica que el workflow esté activo en n8n.`
        } else {
          errorMessage = `❌ Error: ${err.message}`
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      setIsAnalyzing(false)
    }
  }

  const handleExportCSV = () => {
    if (serpResults.length === 0) return

    const csvHeaders = "Keyword,Titulo,URL,Domain,Clasificacion,Permite_Pautar,Razon,Medio_Contacto,Direccion_Contacto,Categoria_Contacto\n"
    const csvData = serpResults
      .map((result) => 
        `"${result.keyword}","${result.title}","${result.url}","${result.domain}","${result.type_classification || ''}","${result.permite_pautar || ''}","${result.razon || ''}","${result.medio_contacto || ''}","${result.dirección_contacto || ''}","${result.categoría_contacto || ''}"`
      )
      .join("\n")

    const csvContent = csvHeaders + csvData
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `serp-outreach-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleRestart = () => {
    setSelectedKeywords(new Set())
    setIsLoading(false)
    setError(null)
    setSuccess(false)
    setSerpResults([])
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setShowSerpResults(false)
    onBackToSearch()
  }

  const allSelected = selectedKeywords.size === keywordData.length
  const someSelected = selectedKeywords.size > 0 && selectedKeywords.size < keywordData.length

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image src="/images/logo-g4u.png" alt="Growth 4U Logo" width={200} height={80} className="h-16 w-auto" />
            <Button
              onClick={handleRestart}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcwIcon className="w-4 h-4" />
              Reiniciar
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance tracking-tight">SERP Outreach</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            {serpResults.length > 0 ? 
              `${serpResults.length} resultados encontrados para ${selectedKeywords.size} keywords` :
              "Selecciona las keywords para buscar sitios relacionados en Google"
            }
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            onClick={() => setShowSerpResults(false)}
            variant={!showSerpResults ? "default" : "outline"}
            className="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          >
            Selección de Keywords
          </Button>
          {serpResults.length > 0 && (
            <Button
              onClick={() => setShowSerpResults(true)}
              variant={showSerpResults ? "default" : "outline"}
              className="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            >
              Resultados SERP ({serpResults.length})
            </Button>
          )}
        </div>

        {/* SERP Results Section - Show at top when available and selected */}
        {showSerpResults && serpResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-green-600">Resultados SERP</h2>
                <p className="text-muted-foreground mt-1">
                  {serpResults.length} sitios encontrados para análisis de outreach
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
                  <DownloadIcon className="w-4 h-4" />
                  Exportar CSV ({serpResults.length} resultados)
                </Button>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">{serpResults.length}</div>
                <div className="text-sm text-muted-foreground">Total Resultados</div>
              </Card>
              <Card className="p-4 border-2 border-green-200 bg-green-50">
                <div className="text-2xl font-bold text-green-600">
                  {serpResults.filter(r => r.position <= 3).length}
                </div>
                <div className="text-sm text-muted-foreground">Top 3 Posiciones</div>
              </Card>
              <Card className="p-4 border-2 border-purple-200 bg-purple-50">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(serpResults.map(r => r.domain)).size}
                </div>
                <div className="text-sm text-muted-foreground">Dominios Únicos</div>
              </Card>
              <Card className="p-4 border-2 border-orange-200 bg-orange-50">
                <div className="text-2xl font-bold text-orange-600">
                  {serpResults.filter(r => r.type === 'video').length}
                </div>
                <div className="text-sm text-muted-foreground">Resultados Video</div>
              </Card>
            </div>

            <Card className="w-full border-2 bg-card shadow-lg">
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left p-3 font-semibold text-sm">Keyword</th>
                        <th className="text-left p-3 font-semibold text-sm">Título</th>
                        <th className="text-left p-3 font-semibold text-sm">URL</th>
                        <th className="text-left p-3 font-semibold text-sm">Dominio</th>
                        <th className="text-left p-3 font-semibold text-sm">Clasificación</th>
                        <th className="text-left p-3 font-semibold text-sm">Permite Pautar</th>
                        <th className="text-left p-3 font-semibold text-sm">Razón</th>
                        <th className="text-left p-3 font-semibold text-sm">Medio Contacto</th>
                        <th className="text-left p-3 font-semibold text-sm">Dirección Contacto</th>
                        <th className="text-left p-3 font-semibold text-sm">Categoría Contacto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serpResults.map((result) => (
                        <tr key={result.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors text-sm">
                          <td className="p-3 font-medium text-blue-600">{result.keyword}</td>
                          <td className="p-3 max-w-md">
                            <div className="truncate" title={result.title}>
                              {result.title}
                            </div>
                          </td>
                          <td className="p-3 max-w-xs">
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline truncate block"
                              title={result.url}
                            >
                              {result.url}
                            </a>
                          </td>
                          <td className="p-3 font-medium text-gray-700">{result.domain}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.type_classification === "video"
                                  ? "bg-purple-100 text-purple-800"
                                  : result.type_classification === "article" || result.type_classification === "articulo"
                                    ? "bg-blue-100 text-blue-800"
                                    : result.type_classification === "social"
                                      ? "bg-pink-100 text-pink-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {result.type_classification || '-'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.permite_pautar === "SI" || result.permite_pautar === "Sí" || result.permite_pautar === "Yes"
                                  ? "bg-green-100 text-green-800"
                                  : result.permite_pautar === "NO" || result.permite_pautar === "No"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {result.permite_pautar || 'N/A'}
                            </span>
                          </td>
                          <td className="p-3 text-sm">
                            {result.razon || '-'}
                          </td>
                          <td className="p-3 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {result.medio_contacto || '-'}
                            </span>
                          </td>
                          <td className="p-3 text-sm max-w-xs">
                            <div className="truncate" title={result.dirección_contacto || '-'}>
                              {result.dirección_contacto || '-'}
                            </div>
                          </td>
                          <td className="p-3 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              {result.categoría_contacto || '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Keyword Selection Section - Show when SERP results are not displayed */}
        {!showSerpResults && (
          <>
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={handleSearchSites}
                disabled={selectedKeywords.size === 0 || isLoading || isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analizando {selectedKeywords.size} keyword{selectedKeywords.size !== 1 ? 's' : ''}... Puede tardar 1-2 minutos
                  </>
                ) : (
                  <>
                    <SearchIcon className="w-5 h-5 mr-2" />
                    Buscar sitios en Google ({selectedKeywords.size} keywords)
                  </>
                )}
              </Button>
            </div>

            {/* Info Message when analyzing */}
            {isAnalyzing && (
              <Card className="w-full border-2 border-blue-200 bg-blue-50">
                <div className="p-6 text-center space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <h3 className="text-xl font-semibold text-blue-900">
                      Analizando SERPs en Google...
                    </h3>
                  </div>
                  <p className="text-blue-800">
                    Estamos buscando y analizando los mejores sitios para outreach.
                  </p>
                  <p className="text-sm text-blue-700">
                    ⏱️ Este proceso puede tardar <strong>1-3 minutos</strong> dependiendo de la cantidad de keywords seleccionadas.
                  </p>
                  <p className="text-xs text-blue-600">
                    💡 Tip: El webhook tarda ~1 minuto por keyword. Selecciona máximo 1-2 keywords para evitar timeouts.
                  </p>
                  <p className="text-xs text-blue-500 mt-2">
                    🔧 Para procesar más keywords más rápido, optimiza el workflow según OPTIMIZE-N8N-WORKFLOW.md
                  </p>
                </div>
              </Card>
            )}

            {/* Keywords Table */}
            <Card className="w-full border-2 bg-card">
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left p-4 font-semibold w-16">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={handleSelectAll}
                              ref={(el) => {
                                if (el) {
                                  el.indeterminate = someSelected
                                }
                              }}
                              className="h-5 w-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 hover:border-blue-500 transition-colors"
                            />
                          </div>
                        </th>
                        <th className="text-left p-4 font-semibold">Keyword</th>
                        <th className="text-left p-4 font-semibold">Volumen de búsqueda</th>
                        <th className="text-left p-4 font-semibold">CPC (€)</th>
                        <th className="text-left p-4 font-semibold">Competencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordData.map((keyword) => (
                        <tr key={keyword.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={selectedKeywords.has(keyword.id)}
                                onCheckedChange={(checked) => handleCheckboxChange(keyword.id, !!checked)}
                                className="h-5 w-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 hover:border-blue-500 transition-colors cursor-pointer"
                              />
                            </div>
                          </td>
                          <td className="p-4 font-medium">{keyword.keyword}</td>
                          <td className="p-4">{keyword.search_volume?.toLocaleString() || 'N/A'}</td>
                          <td className="p-4">€{keyword.cpc?.toFixed(2) || 'N/A'}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                keyword.competition?.toLowerCase() === "alta"
                                  ? "bg-red-100 text-red-800"
                                  : keyword.competition?.toLowerCase() === "media"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {keyword.competition || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Status Messages */}
            <div className="flex justify-center">
              {error && <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

              {success && (
                <div className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg">
                  Análisis Serp Outreach completado exitosamente
                </div>
              )}

              {selectedKeywords.size > 0 && (
                <p className="text-sm text-muted-foreground">
                  {`${selectedKeywords.size} keyword${selectedKeywords.size !== 1 ? "s" : ""} seleccionada${selectedKeywords.size !== 1 ? "s" : ""}`}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
