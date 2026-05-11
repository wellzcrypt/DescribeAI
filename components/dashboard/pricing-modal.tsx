'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Unlock premium features for your product descriptions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-accent">$5</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Pro Features Include:</h3>
            <ul className="space-y-2">
              {[
                'Advanced AI models for better descriptions',
                'Unlimited generations per month',
                'Custom tone templates',
                'Bulk description generation',
                'Export to multiple formats',
                'Priority support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button className="w-full bg-accent hover:bg-accent/90" size="lg">
            Get Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
