'use client';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatMessage } from '@/store/useAppStore';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAi = message.sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-4 ${isAi ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAi ? 'bg-[var(--color-primary)] text-white mr-2' : 'bg-gray-200 text-gray-700 ml-2'}`}>
          {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
        </div>
        <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
          isAi 
            ? 'bg-white border border-gray-100 text-[var(--color-foreground)] rounded-tl-none' 
            : 'bg-[var(--color-primary)] text-white rounded-tr-none'
        }`}>
          {message.text}
        </div>
      </div>
    </motion.div>
  );
}
