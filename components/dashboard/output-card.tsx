'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy, CheckCircle2 } from 'lucide-react'

interface OutputCardProps {
  output: string
  isLoading: boolean
}

export function OutputCard({ output, isLoading }: OutputCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Output</h2>
          <p className="text-sm text-muted-foreground mt-1">Your generated product description</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-6">
        {isLoading ? (
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-3/4 bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
          </div>
        ) : output ? (
          <div className="flex-1 overflow-y-auto">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {output}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                <Copy className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No description generated yet</p>
              <p className="text-xs text-muted-foreground mt-1">Fill in the details and click Generate</p>
            </div>
          </div>
        )}
      </div>

      {output && (
        <div className="p-6 border-t border-border">
          <Button
            onClick={handleCopy}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          >
            {copied ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  )
}
