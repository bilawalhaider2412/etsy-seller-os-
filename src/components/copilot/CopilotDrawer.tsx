import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { api } from '../../services/api.ts';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  KeyRound,
  FileEdit,
  Palette,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    tab: any;
  };
}

export const CopilotDrawer: React.FC = () => {
  const { isCopilotOpen, setIsCopilotOpen, shopProfile, setActiveTab, setPrefillKeywordQuery } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: `👋 Hey there! I'm your **Etsy Seller OS CoPilot**. I'm tuned to your shop **${
        shopProfile?.shopName || 'your Etsy shop'
      }** in the **${shopProfile?.category || 'crafts'}** category.\n\nAsk me anything: product trends, Canva listing graphics, keyword advice, listing critiques, or pricing strategies!`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    { label: 'Create Canva listing graphics for my product', icon: Palette },
    { label: 'What products should I create next?', icon: Lightbulb },
    { label: 'Give me 10 low-competition keywords for my shop', icon: KeyRound },
    { label: 'Which of my listings need attention?', icon: TrendingUp },
  ];

  if (!isCopilotOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.copilot({
        query: textToSend,
        history: messages.slice(-4),
      });

      const isCanvaQuery = /canva|design|image|graphics|pinterest|instagram|photo/i.test(textToSend);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: isCanvaQuery ? { label: 'Open in Canva Studio →', tab: 'canva' } : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Error: ${e.message || 'Could not fetch response. Please try again.'}`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
      {/* Top Header */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5">
              Etsy Seller CoPilot
              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold px-1.5 py-0.5 rounded">
                Context-Aware
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Synced with {shopProfile?.shopName || 'your shop'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-stone-100/60 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(q.label)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-[11px] text-stone-700 dark:text-stone-300 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Icon className="w-3 h-3 text-amber-500" />
              <span>{q.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-br-none shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-none border border-stone-200/60 dark:border-stone-700/60'
              }`}
            >
              <div className="whitespace-pre-line prose-sm">{msg.text}</div>

              {msg.action && (
                <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-700/80">
                  <button
                    onClick={() => {
                      setIsCopilotOpen(false);
                      setActiveTab(msg.action!.tab);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>{msg.action.label}</span>
                  </button>
                </div>
              )}

              <div
                className={`text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-amber-200' : 'text-stone-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs italic p-2 bg-stone-50 dark:bg-stone-800/30 rounded-lg w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
            <span>Analyzing shop data and generating advice...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about SEO, products, competitor gaps..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
