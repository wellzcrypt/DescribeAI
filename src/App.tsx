/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Generator } from './components/Generator';
import { HistoryItem, Tone } from './types';
import { generateDescription } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, loginWithGoogle, logout, handleFirestoreError, OperationType } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { Moon, Sun, Monitor, Laptop, Smartphone, Menu, X, LogIn, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | undefined>();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'history'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis() || Date.now()
      })) as HistoryItem[];
      setHistory(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/history`);
    });

    return () => unsubscribe();
  }, [user]);

  const handleGenerate = async (productName: string, features: string, tone: Tone) => {
    if (!user) {
      alert("Please login to generate and save your work.");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedOutput = await generateDescription(productName, features, tone);
      
      const historyPath = `users/${user.uid}/history`;
      try {
        const docRef = await addDoc(collection(db, historyPath), {
          userId: user.uid,
          productName,
          features,
          tone,
          output: generatedOutput || '',
          timestamp: serverTimestamp(),
        });
        
        setOutput(generatedOutput || null);
        setActiveItemId(docRef.id);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, historyPath);
      }
    } catch (error) {
      alert("Something went wrong. Please check your API key or connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectItem = (item: HistoryItem) => {
    setOutput(item.output);
    setActiveItemId(item.id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!user) return;
    const itemPath = `users/${user.uid}/history/${itemId}`;
    try {
      await deleteDoc(doc(db, itemPath));
      if (activeItemId === itemId) {
        setOutput(null);
        setActiveItemId(undefined);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, itemPath);
    }
  };

  const handleNew = () => {
    setOutput(null);
    setActiveItemId(undefined);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const clearHistory = async () => {
    if (!user) return;
    if (confirm("Are you sure you want to clear your generation history? This action cannot be undone.")) {
      const historyPath = `users/${user.uid}/history`;
      try {
        const q = query(collection(db, historyPath));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        setOutput(null);
        setActiveItemId(undefined);
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, historyPath);
      }
    }
  };

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black transition-colors">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      alert("Failed to login. Please ensure popups are allowed for this site.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black px-6 transition-colors font-sans">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">DescribeAI</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Elevate your product copy with AI</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-black p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Welcome Back</h2>
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full"
                />
              ) : (
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
              )}
              {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
            </button>
            <p className="text-xs text-slate-400 mt-6 leading-relaxed">
              By signing in, you agree to our Terms of Service and Privacy Policy. All your data is securely stored in the cloud.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-100 dark:selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100 transition-colors duration-200",
      darkMode && "dark"
    )}>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-40 transition-colors">
        <h1 className="font-bold text-brand-600">DescribeAI</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 transform md:transform-none transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <Sidebar 
          history={history} 
          onSelectItem={handleSelectItem} 
          onDeleteItem={handleDeleteItem}
          onClearHistory={clearHistory}
          onNew={handleNew}
          activeItemId={activeItemId}
          onOpenSettings={() => setShowSettings(true)}
        />
      </div>
      
      <main key={darkMode ? 'dark' : 'light'} className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItemId || 'new'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Generator 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
              output={output}
              activeItem={history.find(h => h.id === activeItemId)}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/20 dark:bg-slate-900/60 backdrop-blur-md"
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-black rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Account</label>
                  <div className="p-4 bg-slate-50 dark:bg-black border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
                    <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-white dark:border-black shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); setShowSettings(false); }}
                    className="w-full py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-center text-slate-400 font-medium">DescribeAI v1.2.0 • Data encrypted in transit</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



