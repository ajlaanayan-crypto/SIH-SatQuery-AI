'use client';
import { useAppStore } from '@/store/useAppStore';
import { Layers, Trash2 } from 'lucide-react';

export function OverlayControls() {
  const { activeTab, changeMaskOverlay, setChangeMaskOverlay, imageT1, imageT2, clearImages } = useAppStore();

  if (!imageT1 && !imageT2) return null;

  return (
    <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-xl p-3 rounded-2xl border border-white/40 shadow-lg z-10 flex flex-col gap-3 min-w-[160px]">
      <div className="flex items-center justify-between text-[var(--color-primary)]">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Workspace</h3>
        </div>
        <button 
          onClick={clearImages} 
          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors" 
          title="Clear Images"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {activeTab === 'tab_2' && (
        <div className="pt-2 border-t border-gray-200/50">
          <label className="flex items-center space-x-2 text-sm text-[var(--color-muted)] cursor-pointer hover:text-[var(--color-foreground)] transition-colors">
            <input 
              type="checkbox" 
              checked={changeMaskOverlay}
              onChange={(e) => setChangeMaskOverlay(e.target.checked)}
              className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4"
            />
            <span className="font-medium">Show Differences</span>
          </label>
        </div>
      )}
    </div>
  );
}
