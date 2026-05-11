'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { HistoryItem } from '@/app/page'

interface DashboardLayoutProps {
  children: React.ReactNode
  history: HistoryItem[]
  onHistorySelect: (item: HistoryItem) => void
  onDeleteHistory: (id: string) => void
  onNewGeneration: () => void
  currentId: string | null
}

export function DashboardLayout({
  children,
  history,
  onHistorySelect,
  onDeleteHistory,
  onNewGeneration,
  currentId,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        history={history}
        onHistorySelect={onHistorySelect}
        onDeleteHistory={onDeleteHistory}
        onNewGeneration={onNewGeneration}
        currentId={currentId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>
    </div>
  )
}
