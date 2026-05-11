'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { InputSection } from '@/components/dashboard/input-section'
import { OutputCard } from '@/components/dashboard/output-card'

export interface HistoryItem {
  id: string
  features: string
  tone: 'Professional' | 'Persuasive' | 'Friendly'
  output: string
  timestamp: number
}

export default function Page() {
  const [productFeatures, setProductFeatures] = useState('')
  const [tone, setTone] = useState<'Professional' | 'Persuasive' | 'Friendly'>('Professional')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('descriptionHistory')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load history:', e)
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('descriptionHistory', JSON.stringify(history))
  }, [history])

  const handleGenerate = async () => {
    if (!productFeatures.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: productFeatures, tone })
      })

      if (!response.ok) {
        throw new Error('Failed to generate description')
      }

      const data = await response.json()
      const generatedOutput = data.description

      setOutput(generatedOutput)

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        features: productFeatures,
        tone,
        output: generatedOutput,
        timestamp: Date.now()
      }

      setHistory(prev => [newItem, ...prev])
      setCurrentId(newItem.id)
    } catch (error) {
      console.error('Error generating description:', error)
      setOutput('Error generating description. Please check your API key and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleHistorySelect = (item: HistoryItem) => {
    setProductFeatures(item.features)
    setTone(item.tone)
    setOutput(item.output)
    setCurrentId(item.id)
  }

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id))
    if (currentId === id) {
      setProductFeatures('')
      setTone('Professional')
      setOutput('')
      setCurrentId(null)
    }
  }

  const handleNewGeneration = () => {
    setProductFeatures('')
    setTone('Professional')
    setOutput('')
    setCurrentId(null)
  }

  return (
    <DashboardLayout
      history={history}
      onHistorySelect={handleHistorySelect}
      onDeleteHistory={handleDeleteHistory}
      onNewGeneration={handleNewGeneration}
      currentId={currentId}
    >
      <div className="flex-1 flex flex-col gap-6 p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Description Generator</h1>
          <p className="text-muted-foreground">Create compelling product descriptions powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InputSection
            productFeatures={productFeatures}
            tone={tone}
            onFeaturesChange={setProductFeatures}
            onToneChange={setTone}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          <div className="flex flex-col gap-4">
            <OutputCard output={output} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
