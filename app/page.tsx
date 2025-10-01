"use client"

import { useState } from "react"
import { KeywordExplorer } from "@/components/keyword-explorer"
import { KeywordResults } from "@/components/keyword-results"

interface KeywordResult {
  keyword: string
  search_volume: number
  competition: string
  cpc: number
}

interface KeywordData {
  id: string
  keyword: string
  search_volume: number
  cpc: number
  competition: string
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"search" | "results">("search")
  const [keywordResults, setKeywordResults] = useState<KeywordData[]>([])

  const handleShowResults = (results: KeywordResult[]) => {
    // Convert KeywordResult[] to KeywordData[] format expected by results component
    const processedResults: KeywordData[] = results.map((result, index) => ({
      id: (index + 1).toString(),
      keyword: result.keyword,
      search_volume: result.search_volume,
      cpc: result.cpc,
      competition: result.competition,
    }))

    setKeywordResults(processedResults)
    setCurrentPage("results")
  }

  const handleBackToSearch = () => {
    setCurrentPage("search")
    setKeywordResults([])
  }

  return (
    <main className="min-h-screen bg-background">
      {currentPage === "search" ? (
        <KeywordExplorer onShowResults={handleShowResults} />
      ) : (
        <KeywordResults onBackToSearch={handleBackToSearch} keywordData={keywordResults} />
      )}
    </main>
  )
}
