'use client';
import { useAppStore, TabId } from '@/store/useAppStore';
import { Map, Image as ImageIcon, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export function FloatingMenu() {
  const { activeTab, setActiveTab } = useAppStore();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 4, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: { id: TabId; name: string; icon: React.ReactNode }[] = [
    { id: 'tab_1', name: 'Single VQA', icon: <ImageIcon className="w-4 h-4 mr-1.5" /> },
    { id: 'tab_2', name: 'Change Detect', icon: <Layers className="w-4 h-4 mr-1.5" /> },
    { id: 'tab_3', name: 'Live Map', icon: <Map className="w-4 h-4 mr-1.5" /> },
  ];

  useEffect(() => {
    const activeIndex = tabs.findIndex(t => t.id === activeTab);
    const el = tabsRef.current[activeIndex];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth
      });
    }
  }, [activeTab]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="anti-gravity-menu">
        <motion.div 
          className="anti-gravity-indicator"
          initial={false}
          animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        
        {tabs.map((tab, idx) => (
          <div key={tab.id} className="flex items-center h-full">
            <button
              ref={el => { tabsRef.current[idx] = el; }}
              onClick={() => setActiveTab(tab.id)}
              className="anti-gravity-item flex items-center"
            >
              {tab.icon}
              {tab.name}
            </button>
            {idx < tabs.length - 1 && <div className="anti-gravity-separator" />}
          </div>
        ))}
      </div>
    </div>
  );
}
