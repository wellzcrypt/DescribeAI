'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { History, Settings, Zap, X, Plus, MoreVertical, Trash2, Moon, Sun } from 'lucide-react'
import { PricingModal } from './pricing-modal'
import { HistoryItem } from '@/app/page'
import Link from 'next/link'

interface SidebarProps {
  history: HistoryItem[]
  onHistorySelect: (item: HistoryItem) => void
  onDeleteHistory: (id: string) => void
  onNewGeneration: () => void
  currentId: string | null
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({
  history,
  onHistorySelect,
  onDeleteHistory,
  onNewGeneration,
  currentId,
  isOpen,
  onClose,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'settings'>('history')
  const [pricingOpen, setPricingOpen] = useState(false)
  const { theme, setTheme } = useTheme()

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
              <HistoryTab
                items={history}
                onSelect={onHistorySelect}
                onNew={onNewGeneration}
                onDelete={onDeleteHistory}
                currentId={currentId}
              />
            ) : (
              <SettingsTab theme={theme} onThemeChange={setTheme} onUpgradeClick={() => setPricingOpen(true)} />
            )}
          </ScrollArea>
        </div>

        <Separator className="bg-border" />
        <div className="p-4">
          <Button
            onClick={() => setPricingOpen(true)}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            size="sm"
          >
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
              <HistoryTab
                items={history}
                onSelect={(item) => {
                  onHistorySelect(item)
                  onClose()
                }}
                onNew={() => {
                  onNewGeneration()
                  onClose()
                }}
                onDelete={onDeleteHistory}
                currentId={currentId}
              />
            ) : (
              <SettingsTab
                theme={theme}
                onThemeChange={setTheme}
                onUpgradeClick={() => {
                  setPricingOpen(true)
                }}
              />
            )}
          </ScrollArea>
        </div>

        <Separator className="bg-border" />
        <div className="p-4">
          <Button
            onClick={() => setPricingOpen(true)}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            size="sm"
          >
            Upgrade to Pro
          </Button>
        </div>
      </div>

      <PricingModal open={pricingOpen} onOpenChange={setPricingOpen} />
    </>
  )
}

function HistoryTab({
  items,
  onSelect,
  onNew,
  onDelete,
  currentId,
}: {
  items: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onNew: () => void
  onDelete: (id: string) => void
  currentId: string | null
}) {
  return (
    <div className="space-y-3 py-2">
      <Button
        onClick={onNew}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold justify-center gap-2"
        size="sm"
      >
        <Plus className="w-4 h-4" />
        New Generation
      </Button>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No history yet</p>
          <p className="text-xs text-muted-foreground mt-1">Generate descriptions to see them here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group p-3 rounded-lg transition-colors cursor-pointer ${
                currentId === item.id
                  ? 'bg-accent/20 border border-accent'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => onSelect(item)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-accent">
                    {item.features.substring(0, 35)}...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.tone}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onDelete(item.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SettingsTab({
  theme,
  onThemeChange,
  onUpgradeClick,
}: {
  theme: string | undefined
  onThemeChange: (theme: string) => void
  onUpgradeClick: () => void
}) {
  return (
    <div className="py-4 space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Appearance</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={(e) => onThemeChange(e.target.checked ? 'dark' : 'light')}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              Dark Mode
            </span>
          </label>
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <h3 className="font-semibold text-sm mb-3">Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm">Auto-save history</span>
          </label>
        </div>
      </div>

      <Separator className="bg-border" />

      <div>
        <h3 className="font-semibold text-sm mb-3">Premium</h3>
        <Button
          onClick={onUpgradeClick}
          variant="outline"
          className="w-full text-accent border-accent hover:bg-accent/10"
          size="sm"
        >
          View Premium Features
        </Button>
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
