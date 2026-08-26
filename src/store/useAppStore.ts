import { create } from 'zustand';

export type TabId = 'tab_1' | 'tab_2' | 'tab_3';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface BoundingBox {
  id: string;
  coordinates: [number, number, number, number]; // [x_min, y_min, x_max, y_max]
  label?: string;
  color?: string;
}

export interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  imageT1: string | null;
  setImageT1: (url: string | null) => void;
  imageT2: string | null;
  setImageT2: (url: string | null) => void;
  clearImages: () => void;

  mapStyle: string;
  setMapStyle: (style: string) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChatMessages: () => void;

  agentTraceLogs: string[];
  addAgentTraceLog: (log: string) => void;
  clearAgentTraceLogs: () => void;

  mapGeoJSON: any | null;
  setMapGeoJSON: (data: any) => void;
  
  changeMaskOverlay: boolean;
  setChangeMaskOverlay: (show: boolean) => void;

  targetFlyTo: { lng: number, lat: number, zoom: number } | null;
  setTargetFlyTo: (target: { lng: number, lat: number, zoom: number } | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'tab_1',
  setActiveTab: (tab) => set({ activeTab: tab }),

  imageT1: null,
  setImageT1: (url) => set({ imageT1: url }),
  imageT2: null,
  setImageT2: (url) => set({ imageT2: url }),
  clearImages: () => set({ 
    imageT1: null, 
    imageT2: null, 
    mapGeoJSON: null, 
    changeMaskOverlay: false,
    agentTraceLogs: ['[System] Workspace cleared. Ready for new inputs.']
  }),

  mapStyle: 'mapbox://styles/mapbox/satellite-streets-v12',
  setMapStyle: (style) => set({ mapStyle: style }),

  chatMessages: [
    { id: '1', sender: 'ai', text: 'Hello! I am your SatQuery AI assistant. Upload an image or select a region to begin.' }
  ],
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  clearChatMessages: () => set({ chatMessages: [] }),

  agentTraceLogs: ['[System] Initialized SatQuery AI Engine'],
  addAgentTraceLog: (log) => set((state) => ({ agentTraceLogs: [...state.agentTraceLogs, log] })),
  clearAgentTraceLogs: () => set({ agentTraceLogs: [] }),

  mapGeoJSON: null,
  setMapGeoJSON: (data) => set({ mapGeoJSON: data }),

  changeMaskOverlay: false,
  setChangeMaskOverlay: (show) => set({ changeMaskOverlay: show }),

  targetFlyTo: null,
  setTargetFlyTo: (target) => set({ targetFlyTo: target }),
}));
