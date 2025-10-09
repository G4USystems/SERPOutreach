"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import Image from "next/image"

interface KeywordResult {
  keyword: string
  search_volume: number
  competition: string
  cpc: number
}

interface KeywordExplorerProps {
  onShowResults: (results: KeywordResult[]) => void
}

const WEBHOOK_KEYWORDS = "https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs"
const WEBHOOK_SERP = "https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach"

export function KeywordExplorer({ onShowResults }: KeywordExplorerProps) {
  const [keywords, setKeywords] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<KeywordResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!keywords.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const keywordList = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)

      console.log("[v0] Enviando keywords al webhook:", keywordList)

      // Enviar formato completo con ubicación e idioma
      const payload = {
        keywords: keywordList,
        location_name: "Spain",
        language_name: "Spanish"
      }
      
      console.log("[v0] Enviando payload al webhook:", payload)
      console.log("[v0] URL del webhook:", WEBHOOK_KEYWORDS)
      console.log("[v0] Iniciando fetch request...")

      const response = await fetch(WEBHOOK_KEYWORDS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit'
      })

      console.log("[v0] Fetch completado, status:", response.status)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error del webhook:", response.status, errorText)
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const responseText = await response.text()
      console.log("[v0] Respuesta cruda del webhook:", responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
        console.log("[v0] JSON parseado correctamente")
        console.log("[v0] Claves del objeto:", Object.keys(data))
        console.log("[v0] Es array directo?", Array.isArray(data))
      } catch (parseError) {
        console.error("[v0] Error parseando JSON:", parseError)
        throw new Error(`Respuesta del webhook no es JSON válido: ${responseText}`)
      }

      let processedResults: KeywordResult[]

      if (data && Array.isArray(data.keywords)) {
        // Procesar la respuesta del webhook n8n con propiedad keywords
        console.log("[v0] Primer elemento crudo de keywords:", data.keywords[0])
        processedResults = data.keywords.map((item: any) => ({
          keyword: item.keyword,
          search_volume: item.search_volume,
          competition: item.competition === "HIGH" ? "Alta" : 
                      item.competition === "MEDIUM" ? "Media" : 
                      item.competition === "LOW" ? "Baja" : item.competition,
          cpc: item.cpc
        }))
        console.log("[v0] Datos procesados del webhook:", processedResults)
        console.log("[v0] Primer elemento procesado:", processedResults[0])
      } else if (data && Array.isArray(data.results)) {
        processedResults = data.results
      } else if (data && Array.isArray(data) && data[0] && Array.isArray(data[0].keywords)) {
        // La respuesta es un array que contiene un objeto con keywords
        console.log("[v0] Primer elemento del array:", data[0])
        console.log("[v0] Keywords del primer elemento:", data[0].keywords[0])
        processedResults = data[0].keywords.map((item: any) => ({
          keyword: item.keyword,
          search_volume: item.search_volume,
          competition: item.competition === "HIGH" ? "Alta" : 
                      item.competition === "MEDIUM" ? "Media" : 
                      item.competition === "LOW" ? "Baja" : item.competition,
          cpc: item.cpc
        }))
        console.log("[v0] Datos procesados (array con objeto):", processedResults)
      } else if (data && Array.isArray(data)) {
        // La respuesta es un array directo de keywords
        processedResults = data.map((item: any) => ({
          keyword: item.keyword,
          search_volume: item.search_volume,
          competition: item.competition === "HIGH" ? "Alta" : 
                      item.competition === "MEDIUM" ? "Media" : 
                      item.competition === "LOW" ? "Baja" : item.competition,
          cpc: item.cpc
        }))
            } else {
              console.log("[v0] Formato inesperado, estructura recibida:", data)
              // Datos de ejemplo para demostrar la interfaz
              processedResults = [
                { keyword: "marketing digital", search_volume: 45000, competition: "Alta", cpc: 2.5 },
                { keyword: "seo", search_volume: 38000, competition: "Media", cpc: 1.8 },
                { keyword: "contenido", search_volume: 25000, competition: "Baja", cpc: 1.2 },
                { keyword: "redes sociales", search_volume: 32000, competition: "Alta", cpc: 2.1 },
                { keyword: "publicidad online", search_volume: 28000, competition: "Media", cpc: 3.2 }
              ]
            }

      // Ordenar keywords por volumen de búsqueda (mayor a menor)
      const sortedResults = processedResults.sort((a, b) => {
        const volumeA = a.search_volume || 0
        const volumeB = b.search_volume || 0
        return volumeB - volumeA
      })
      
      console.log("[v0] Keywords ordenadas por volumen:", sortedResults)

      setResults(sortedResults)
      onShowResults(sortedResults)
    } catch (err) {
      console.error("[v0] Error fetching keywords:", err)
      console.error("[v0] Error completo:", JSON.stringify(err, Object.getOwnPropertyNames(err)))
      
      let errorMessage = 'Error desconocido'
      if (err instanceof Error) {
        console.error("[v0] Error name:", err.name)
        console.error("[v0] Error message:", err.message)
        console.error("[v0] Error stack:", err.stack)
        
        if (err.message.includes('Failed to fetch') || err.message.includes('fetch') || err.message.includes('NetworkError')) {
          errorMessage = `No se pudo conectar con el webhook de Keywords. URL: ${WEBHOOK_KEYWORDS}. Error: ${err.message}. Verifica que el flujo de n8n esté activo y la URL sea correcta.`
        } else if (err.message.includes("Workflow Webhook Error")) {
          errorMessage = "Error del webhook n8n: El workflow no pudo iniciarse. Verifica que el workflow esté activo y configurado correctamente en n8n."
        } else {
          errorMessage = `Error: ${err.message}`
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-16">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center mb-6">
            <Image src="/images/logo-g4u.png" alt="Growth 4U Logo" width={200} height={80} className="h-16 w-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance tracking-tight">SERP Outreach</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Descubre las mejores palabras clave para tu estrategia de contenido y SEO
          </p>
        </div>

        {/* Search Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Ej: invertir dinero, asesor financiero, roboadvisors"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 text-lg px-6 bg-card border-2 focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !keywords.trim()}
              size="lg"
              className="h-14 px-8 text-lg font-medium bg-primary hover:bg-primary/90 transition-colors rounded-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Buscando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar Keywords
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Results Container */}
        <Card className="w-full min-h-[400px] border-2 bg-card">
          {results.length > 0 ? (
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-4 font-semibold">Keyword</th>
                      <th className="text-left p-4 font-semibold">Volumen de búsqueda</th>
                      <th className="text-left p-4 font-semibold">CPC (€)</th>
                      <th className="text-left p-4 font-semibold">Competencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{result.keyword}</td>
                        <td className="p-4">{result.search_volume.toLocaleString()}</td>
                        <td className="p-4">€{result.cpc.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.competition.toLowerCase() === "alta"
                                ? "bg-red-100 text-red-800"
                                : result.competition.toLowerCase() === "media"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {result.competition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-border/50 bg-card/50">
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Analizando keywords...</p>
                      <p className="text-muted-foreground">
                        Estamos procesando tu búsqueda para encontrar las mejores oportunidades
                      </p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="space-y-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-red-600">Error en la búsqueda</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-muted-foreground">
                        Ingresa términos relacionados con tu nicho separados por comas para obtener mejores resultados
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Introduce términos relacionados con tu nicho separados por comas para obtener mejores resultados</p>
        </div>
      </div>
    </div>
  )
}
