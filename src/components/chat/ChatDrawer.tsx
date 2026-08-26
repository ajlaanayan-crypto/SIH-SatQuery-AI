'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { MessageBubble } from './MessageBubble';
import { QuickChips } from './QuickChips';

export function ChatDrawer() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { chatMessages, addChatMessage, addAgentTraceLog, setMapGeoJSON, setChangeMaskOverlay } = useAppStore();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    setInput('');
    addChatMessage({ id: Date.now().toString(), sender: 'user', text });
    setIsLoading(true);
    addAgentTraceLog(`[User] Query: "${text}"`);
    
    // Simulate delay for thinking
    setTimeout(() => {
      addAgentTraceLog(`[Step 1] Ingesting & Validating intent...`);
    }, 600);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      
      setTimeout(() => {
        addAgentTraceLog(`[Step 2] Intent Classification: ${data.intent}`);
        addAgentTraceLog(`[Step 3] Active Tool: Routing payload...`);
        
        if (data.action === 'highlight' && data.geoJSON) {
          setMapGeoJSON(data.geoJSON);
          addAgentTraceLog(`[Step 4] Overlaying geo-features.`);
        } else if (data.action === 'change_detection') {
          setChangeMaskOverlay(true);
          addAgentTraceLog(`[Step 4] Overlaying difference mask.`);
        }
        
        addAgentTraceLog(`Result: ${data.message}`);
        addChatMessage({ id: Date.now().toString(), sender: 'ai', text: data.message });
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error(error);
      setIsLoading(false);
      addChatMessage({ id: Date.now().toString(), sender: 'ai', text: 'Sorry, I encountered an error.' });
    }
  };

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[30%] min-w-[320px] max-w-[400px] h-full bg-[var(--color-panel)] backdrop-blur-xl border-l border-gray-200 flex flex-col shadow-2xl relative z-20"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white/50 flex items-center space-x-2">
        <h2 className="font-semibold text-[var(--color-foreground)]">SatQuery AI Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {chatMessages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-[var(--color-muted)] p-2">
            <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce delay-75" />
            <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce delay-150" />
            <span className="ml-2">Processing geospatial data...</span>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-md">
        <QuickChips onSelect={handleSend} />
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="anti-gravity-input-container"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the scene..."
            className="anti-gravity-input"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded-full text-white bg-[var(--color-primary)] hover:bg-blue-800 disabled:opacity-50 transition-colors cursor-pointer flex-shrink-0 ml-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
