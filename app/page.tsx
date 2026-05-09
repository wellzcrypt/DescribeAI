'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { InputSection } from '@/components/dashboard/input-section'
import { OutputCard } from '@/components/dashboard/output-card'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'

export default function Page() {
  const [productFeatures, setProductFeatures] = useState('')
  const [tone, setTone] = useState<'Professional' | 'Persuasive' | 'Friendly'>('Professional')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<Array<{ features: string; tone: string; output: string }>>([])

  const handleGenerate = async () => {
    if (!productFeatures.trim()) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const generatedOutput = generateDescription(productFeatures, tone)
    setOutput(generatedOutput)
    
    // Add to history
    setHistory(prev => [
      { features: productFeatures, tone, output: generatedOutput },
      ...prev
    ])
    
    setIsLoading(false)
  }

  const handleHistorySelect = (item: typeof history[0]) => {
    setProductFeatures(item.features)
    setTone(item.tone as 'Professional' | 'Persuasive' | 'Friendly')
    setOutput(item.output)
  }

  const generateDescription = (features: string, toneType: string): string => {
    const toneGuides = {
      Professional: 'Technical, corporate, and formal',
      Persuasive: 'Compelling, benefit-focused, and action-oriented',
      Friendly: 'Approachable, conversational, and warm'
    }

    return `This product excels in delivering exceptional value through its core features: ${features}. 
    
With a ${toneGuides[toneType as keyof typeof toneGuides]} approach, this solution transforms how users interact with their daily workflows. Each feature has been meticulously crafted to address real user pain points and deliver measurable results.

Our users consistently report improved productivity, streamlined processes, and greater satisfaction. The intuitive design ensures quick adoption, while powerful capabilities scale with your growing needs. Experience the difference that thoughtful engineering and user-centric design can make.

Get started today and discover why thousands of teams trust us.`
  }

  return (
    <DashboardLayout history={history} onHistorySelect={handleHistorySelect}>
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
