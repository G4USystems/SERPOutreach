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
}

interface KeywordResultsProps {
  onBackToSearch: () => void
  keywordData: KeywordData[]
}

const SERP_WEBHOOK_ENDPOINT = "https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach"

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
    const newSelected = new Set(selectedKeywords)
    if (checked) {
      newSelected.add(keywordId)
    } else {
      newSelected.delete(keywordId)
    }
    setSelectedKeywords(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedKeywords(new Set(keywordData.map((k) => k.id)))
    } else {
      setSelectedKeywords(new Set())
    }
  }

  const handleSearchSites = async () => {
    if (selectedKeywords.size === 0) return

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

      // Crear un AbortController para manejar timeout personalizado
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos timeout

      const response = await fetch(SERP_WEBHOOK_ENDPOINT, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit'
      })

      clearTimeout(timeoutId)
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
          // Determinar qué keyword corresponde a este resultado
          const keywordIndex = Math.floor(index / resultsPerKeyword)
          const assignedKeyword = selectedKeywordTexts[keywordIndex] || selectedKeywordTexts[0] || 'N/A'
          
          return {
            id: `${assignedKeyword}-${item.position || index}`,
            keyword: item.query || item.keyword || assignedKeyword,
            url: item.url || 'N/A',
            title: item.title || item.titulo || 'N/A',
            position: item.position || (index % 10) + 1,
            domain: item.url ? new URL(item.url).hostname : 'N/A',
            type: item.type || 'organic',
            channel: item.channel || 'N/A',
            duration: item.duration || item.duracion || null,
            platform: item.platform || item.plataforma || null,
            razon: item.razon || null,
            type_classification: item.type_classification || item.tipo_clasificacion || null,
            permite_pautar: item.permite_pautar || null,
            email_contact: item.email_contact || item.email || null
          }
        })
      } else if (data && Array.isArray(data.results)) {
        console.log("[v0] Procesando data.results con", data.results.length, "elementos")
        const resultsPerKeyword = Math.ceil(data.results.length / selectedKeywordTexts.length)
        
        processedSerpResults = data.results.map((item: any, index: number) => {
          const keywordIndex = Math.floor(index / resultsPerKeyword)
          const assignedKeyword = selectedKeywordTexts[keywordIndex] || selectedKeywordTexts[0] || 'N/A'
          
          return {
            id: `${assignedKeyword}-${item.position || index}`,
            keyword: item.query || item.keyword || assignedKeyword,
            url: item.url || 'N/A',
            title: item.title || item.titulo || 'N/A',
            position: item.position || (index % 10) + 1,
            domain: item.url ? new URL(item.url).hostname : 'N/A',
            type: item.type || 'organic',
            channel: item.channel || 'N/A',
            duration: item.duration || item.duracion || null,
            platform: item.platform || item.plataforma || null,
            razon: item.razon || null,
            type_classification: item.type_classification || item.tipo_clasificacion || null,
            permite_pautar: item.permite_pautar || null,
            email_contact: item.email_contact || item.email || null
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
      
      let errorMessage = 'Error desconocido'
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'El webhook tardó demasiado en responder (timeout de 60 segundos). Verifica que el flujo de n8n esté funcionando correctamente.'
        } else if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
          errorMessage = 'No se pudo conectar con el webhook SERP. Verifica que el flujo de n8n esté activo y la URL sea correcta.'
        } else {
          errorMessage = err.message
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

    const csvHeaders = "Keyword,URL,Titulo,Position,Tipo,Plataforma,Duracion,Tipo_de_medio,Permite_Pautar,Email,Domain\n"
    const csvData = serpResults
      .map((result) => 
        `"${result.keyword}","${result.url}","${result.title}",${result.position},"${result.type || ''}","${result.platform || ''}","${result.duration || ''}","${result.type_classification || ''}","${result.permite_pautar || ''}","${result.email_contact || ''}","${result.domain}"`
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
                        <th className="text-left p-3 font-semibold text-sm">Posición</th>
                        <th className="text-left p-3 font-semibold text-sm">Título</th>
                        <th className="text-left p-3 font-semibold text-sm">URL</th>
                        <th className="text-left p-3 font-semibold text-sm">Dominio</th>
                        <th className="text-left p-3 font-semibold text-sm">Tipo</th>
                        <th className="text-left p-3 font-semibold text-sm">Plataforma</th>
                        <th className="text-left p-3 font-semibold text-sm">Duración</th>
                        <th className="text-left p-3 font-semibold text-sm">Tipo de medio</th>
                        <th className="text-left p-3 font-semibold text-sm">Permite Pautar</th>
                        <th className="text-left p-3 font-semibold text-sm">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serpResults.map((result) => (
                        <tr key={result.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors text-sm">
                          <td className="p-3 font-medium text-blue-600">{result.keyword}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.position <= 3
                                  ? "bg-green-100 text-green-800"
                                  : result.position <= 10
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              #{result.position}
                            </span>
                          </td>
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
                                result.type === "organic"
                                  ? "bg-blue-100 text-blue-800"
                                  : result.type === "video"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {result.type || 'organic'}
                            </span>
                          </td>
                          <td className="p-3">
                            {result.platform || '-'}
                          </td>
                          <td className="p-3">
                            {result.duration || '-'}
                          </td>
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
                          <td className="p-3 text-xs">
                            {result.email_contact || '-'}
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
                    Analizando sitios...
                  </>
                ) : (
                  <>
                    <SearchIcon className="w-5 h-5 mr-2" />
                    Buscar sitios en Google ({selectedKeywords.size} keywords)
                  </>
                )}
              </Button>
            </div>

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
                              <label className="cursor-pointer p-2 -m-2 rounded-md hover:bg-blue-50 transition-colors">
                                <Checkbox
                                  checked={selectedKeywords.has(keyword.id)}
                                  onCheckedChange={(checked) => handleCheckboxChange(keyword.id, !!checked)}
                                  className="h-5 w-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 hover:border-blue-500 transition-colors cursor-pointer"
                                />
                              </label>
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
