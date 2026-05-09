'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Zap } from 'lucide-react'

interface InputSectionProps {
  productFeatures: string
  tone: 'Professional' | 'Persuasive' | 'Friendly'
  onFeaturesChange: (value: string) => void
  onToneChange: (value: 'Professional' | 'Persuasive' | 'Friendly') => void
  onGenerate: () => void
  isLoading: boolean
}

export function InputSection({
  productFeatures,
  tone,
  onFeaturesChange,
  onToneChange,
  onGenerate,
  isLoading,
}: InputSectionProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold">Input</h2>
        <p className="text-sm text-muted-foreground mt-1">Describe your product features and choose a tone</p>
      </div>

      <div className="flex-1 flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="features" className="font-semibold">
            Product Features
          </Label>
          <Textarea
            id="features"
            placeholder="Enter the key features of your product. Example: Real-time collaboration, AI-powered suggestions, Cloud storage, Mobile app..."
            value={productFeatures}
            onChange={(e) => onFeaturesChange(e.target.value)}
            className="flex-1 resize-none focus:ring-accent"
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            {productFeatures.length}/500 characters
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tone" className="font-semibold">
            Tone of Voice
          </Label>
          <Select value={tone} onValueChange={onToneChange}>
            <SelectTrigger id="tone" className="focus:ring-accent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">
                <span>Professional</span>
                <span className="text-xs text-muted-foreground ml-2">Corporate & formal</span>
              </SelectItem>
              <SelectItem value="Persuasive">
                <span>Persuasive</span>
                <span className="text-xs text-muted-foreground ml-2">Compelling & action-oriented</span>
              </SelectItem>
              <SelectItem value="Friendly">
                <span>Friendly</span>
                <span className="text-xs text-muted-foreground ml-2">Warm & conversational</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6 border-t border-border">
        <Button
          onClick={onGenerate}
          disabled={!productFeatures.trim() || isLoading}
          size="lg"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate Description
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
