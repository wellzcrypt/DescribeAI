'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { History, Settings, Zap, X } from 'lucide-react'
import Link from 'next/link'

interface SidebarProps {
  history: Array<{ features: string; tone: string; output: string }>
  onHistorySelect: (item: any) => void
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ history, onHistorySelect, isOpen, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history')

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-card border-r border-border">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-accent rounded-lg">
            <Zap className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">DescribeAI</h1>
            <p className="text-xs text-muted-foreground">v1.0</p>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1 p-4">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-4">
            {activeTab === 'history' ? (
              <HistoryTab items={history} onSelect={onHistorySelect} />
            ) : (
              <SettingsTab />
            )}
          </ScrollArea>
        </div>

        <Separator className="bg-border" />
        <div className="p-4">
          <Button variant="outline" className="w-full" size="sm">
            Upgrade to Pro
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col transform transition-transform md:hidden z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <Zap className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">DescribeAI</h1>
              <p className="text-xs text-muted-foreground">v1.0</p>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <Separator className="bg-border" />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex gap-1 p-4">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          <ScrollArea className="flex-1 px-4">
            {activeTab === 'history' ? (
              <HistoryTab items={history} onSelect={(item) => { onHistorySelect(item); onClose(); }} />
            ) : (
              <SettingsTab />
            )}
          </ScrollArea>
        </div>

        <Separator className="bg-border" />
        <div className="p-4">
          <Button variant="outline" className="w-full" size="sm">
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </>
  )
}

function HistoryTab({
  items,
  onSelect,
}: {
  items: Array<{ features: string; tone: string; output: string }>
  onSelect: (item: any) => void
}) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center">
        <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No history yet</p>
        <p className="text-xs text-muted-foreground mt-1">Generate descriptions to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 py-2">
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(item)}
          className="w-full text-left p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors group"
        >
          <p className="text-sm font-medium text-foreground truncate group-hover:text-accent">
            {item.features.substring(0, 40)}...
          </p>
          <p className="text-xs text-muted-foreground mt-1">{item.tone}</p>
        </button>
      ))}
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="py-4 space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm">Auto-save history</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm">Dark mode</span>
          </label>
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <h3 className="font-semibold text-sm mb-3">About</h3>
        <p className="text-xs text-muted-foreground space-y-2">
          <div>DescribeAI v1.0</div>
          <div>© 2024 DescribeAI</div>
          <div className="pt-2">
            <Link href="#" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </div>
        </p>
      </div>
    </div>
  )
}
