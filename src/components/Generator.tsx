import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, Wand2, Type, Hash, LogOut, ChevronDown, Rocket, Zap, ShieldCheck, X } from 'lucide-react';
import { Tone, HistoryItem } from '../types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { auth, logout } from '../services/firebase';

interface GeneratorProps {
  onGenerate: (productName: string, features: string, tone: Tone) => Promise<void>;
  isGenerating: boolean;
  output: string | null;
  activeItem?: HistoryItem;
}

const TONES: Tone[] = ['Professional', 'Persuasive', 'Friendly', 'Creative', 'Urgent'];

export const Generator: React.FC<GeneratorProps> = ({ 
  onGenerate, 
  isGenerating, 
  output,
  activeItem 
}) => {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [copied, setCopied] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Sync with active item
  useEffect(() => {
    if (activeItem) {
      setProductName(activeItem.productName);
      setFeatures(activeItem.features || '');
      setTone(activeItem.tone as Tone);
    } else {
      setProductName('');
      setFeatures('');
      setTone('Professional');
    }
  }, [activeItem]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !features || isGenerating) return;
    onGenerate(productName, features, tone);
  };

  const user = auth.currentUser;

  return (
    <div className="max-w-[1024px] mx-auto p-4 md:p-10 space-y-6 md:space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          DescribeAI
        </h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPremiumModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all border border-brand-100 dark:border-brand-500/20 shadow-sm"
          >
            <Rocket className="w-3.5 h-3.5" />
            Get Premium
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pl-3 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-full hover:shadow-md transition-all group"
            >
              <span className="hidden sm:inline text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-brand-600 transition-colors">
                {user?.displayName?.split(' ')[0]}
              </span>
              <img src={user?.photoURL || ''} alt="" className="w-7 h-7 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm" />
              <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button 
                      onClick={() => { logout(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-4 transition-colors">
          <label className="block text-[13px] font-bold text-slate-600 dark:text-slate-400">
            Product Features
          </label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="E.g. Stainless steel finish, 15-bar pressure, automatic milk frother, 2-liter water tank..."
            className="w-full h-40 md:h-60 p-4 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none font-sans"
            required
          />
        </div>

        <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-6 flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product Name"
                className="w-full p-3 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-sans"
                required
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-slate-600 dark:text-slate-400 mb-2">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full p-3 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-600 transition-all appearance-none cursor-pointer font-sans"
              >
                {TONES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isGenerating || !productName || !features}
            className={cn(
              "w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm text-white transition-all shadow-lg shadow-brand-100 dark:shadow-none",
              isGenerating || !productName || !features
                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                : "bg-brand-600 hover:bg-brand-700 active:scale-[0.98]"
            )}
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Hash className="w-4 h-4" />
                </motion.div>
                <span>Generating...</span>
              </>
            ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Description</span>
                </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col min-h-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 px-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400">Generated Output</h2>
                <span className="text-xs text-slate-400">• Cloud Synced</span>
              </div>
                <button
                onClick={handleCopy}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg text-[12px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-sans"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span className="text-brand-600 dark:text-brand-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-10 prose prose-slate dark:prose-invert max-w-none shadow-sm min-h-[300px] transition-colors overflow-hidden font-sans">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPremiumModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setIsPremiumModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-white dark:bg-black rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 transition-all text-center relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-500 via-emerald-500 to-brand-500 animate-gradient-x" />
              
              <button 
                onClick={() => setIsPremiumModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-14 h-14 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Rocket className="w-7 h-7 text-brand-600 dark:text-brand-400" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upgrade to Premium</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed max-w-xs mx-auto">
                Unlock the full potential of DescribeAI and skyrocket your sales.
              </p>

              <div className="space-y-3 mb-8 text-left">
                {[
                  { icon: Zap, text: "Unlimited daily generations", sub: "Generate 100+ copies per day" },
                  { icon: ShieldCheck, text: "Advanced AI reasoning", sub: "Better empathy & persuasive hooks" },
                  { icon: Sparkles, text: "Custom Tone Creation", sub: "Defined by your brand voice" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3.5 bg-slate-50 dark:bg-black rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="p-2 bg-white dark:bg-black rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                      <feature.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{feature.text}</p>
                      <p className="text-[11px] text-slate-500">{feature.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">$5</span>
                  <span className="text-slate-400 font-bold mb-1">/ month</span>
                </div>
                <button className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-brand-500/30 flex items-center justify-center gap-3 active:scale-[0.98]">
                  <span>Coming Soon</span>
                  <Rocket className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
