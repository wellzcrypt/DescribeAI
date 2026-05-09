import React, { useState } from 'react';
import { History, Settings, Trash2, Clock, LayoutGrid, Sparkles, Plus, MoreVertical } from 'lucide-react';
import { HistoryItem } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onOpenSettings: () => void;
  onDeleteItem: (id: string) => void;
  onNew: () => void;
  activeItemId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  history, 
  onSelectItem, 
  onClearHistory,
  onOpenSettings,
  onDeleteItem,
  onNew,
  activeItemId 
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <aside className="w-[260px] bg-white dark:bg-black border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen overflow-hidden flex-shrink-0 transition-colors duration-200">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/50 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-400 rounded-lg flex items-center justify-center shadow-sm shadow-brand-200 dark:shadow-none">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">DescribeAI</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        <div>
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 px-2">
            App
          </h2>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-black text-brand-600 dark:text-brand-400 transition-all">
              <LayoutGrid className="w-4.5 h-4.5" />
              Generator
            </button>
            <button 
              onClick={onNew}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              <Plus className="w-4.5 h-4.5" />
              New Generation
            </button>
          </nav>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Recent History
            </h2>
            {history.length > 0 && (
              <button 
                onClick={onClearHistory}
                className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Clear history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="px-2 py-6 text-center bg-slate-50 dark:bg-black rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400">Empty history</p>
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((item) => (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => onSelectItem(item)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm truncate pr-10",
                      activeItemId === item.id 
                        ? "text-brand-600 dark:text-brand-400 font-medium bg-brand-50/50 dark:bg-brand-500/10" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    {item.productName || "Untitled Product"}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === item.id ? null : item.id);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  <AnimatePresence>
                    {openMenuId === item.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setOpenMenuId(null)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-1 z-50 min-w-[120px] bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              onDeleteItem(item.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 font-sans">
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-all text-sm font-medium"
        >
          <Settings className="w-4.5 h-4.5" />
          Settings
        </button>
      </div>
    </aside>
  );
};

