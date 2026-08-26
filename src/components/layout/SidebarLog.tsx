'use client';

import { useAppStore } from '@/store/useAppStore';
import { Terminal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SidebarLog() {
  const { agentTraceLogs } = useAppStore();

  return (
    <div className="w-[20%] min-w-[250px] max-w-[300px] h-full bg-[var(--color-panel)] backdrop-blur-md border-r border-gray-200 p-4 flex flex-col overflow-hidden">
      <div className="flex items-center space-x-2 text-[var(--color-primary)] mb-6">
        <Terminal className="w-5 h-5" />
        <h2 className="font-semibold text-sm uppercase tracking-wider">Agentic Trace Log</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence>
          {agentTraceLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-2 text-sm"
            >
              <Activity className="w-4 h-4 mt-0.5 text-[var(--color-secondary)] flex-shrink-0" />
              <p className="text-[var(--color-foreground)] leading-relaxed font-mono text-xs break-words">
                {log}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
