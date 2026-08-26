'use client';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarLog } from '@/components/layout/SidebarLog';
import { ChatDrawer } from '@/components/chat/ChatDrawer';
import { MapViewer } from '@/components/map/MapViewer';
import { SplitScreenManager } from '@/components/map/SplitScreenManager';
import { OverlayControls } from '@/components/map/OverlayControls';
import { DragDropZone } from '@/components/upload/DragDropZone';
import { FloatingMenu } from '@/components/layout/FloatingMenu';
import { MapStyleSelector } from '@/components/map/MapStyleSelector';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const { activeTab } = useAppStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-background)]">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <SidebarLog />
        
        <main className="flex-1 relative bg-gray-100 flex items-center justify-center">
          {activeTab === 'tab_1' && (
            <>
              <MapStyleSelector />
              <MapViewer />
              <OverlayControls />
              <DragDropZone />
            </>
          )}
          {activeTab === 'tab_2' && (
            <>
              <MapStyleSelector />
              <SplitScreenManager />
              <OverlayControls />
              <DragDropZone />
            </>
          )}
          {activeTab === 'tab_3' && (
            <>
              <MapStyleSelector />
              <MapViewer />
            </>
          )}
        </main>
        
        <ChatDrawer />
        <FloatingMenu />
      </div>
    </div>
  );
}
