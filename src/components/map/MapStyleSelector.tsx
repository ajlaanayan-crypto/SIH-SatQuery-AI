'use client';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ChevronDown, Map as MapIcon } from 'lucide-react';

const MAP_STYLES = [
  { id: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'Satellite' },
  { id: 'mapbox://styles/mapbox/streets-v12', label: 'Streets' },
  { id: 'mapbox://styles/mapbox/outdoors-v12', label: 'Outdoors' },
  { id: 'mapbox://styles/mapbox/light-v11', label: 'Light' },
  { id: 'mapbox://styles/mapbox/dark-v11', label: 'Dark' },
];

export function MapStyleSelector() {
  const { mapStyle, setMapStyle } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStyleLabel = MAP_STYLES.find(s => s.id === mapStyle)?.label || 'Style';

  return (
    <div className="absolute top-4 left-4 z-20" ref={ref}>
      <button className="pull-down-button bg-white/80 backdrop-blur-md border border-white/50 shadow-sm" onClick={() => setIsOpen(!isOpen)}>
        <MapIcon className="w-3.5 h-3.5" />
        <span>{currentStyleLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="anti-gravity-dropdown-menu">
          {MAP_STYLES.map(style => (
            <div 
              key={style.id}
              className={`anti-gravity-dropdown-item ${mapStyle === style.id ? 'active' : ''}`}
              onClick={() => { setMapStyle(style.id); setIsOpen(false); }}
            >
              {style.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
