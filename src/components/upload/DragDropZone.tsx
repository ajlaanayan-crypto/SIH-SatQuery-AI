'use client';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

export function DragDropZone() {
  const { activeTab, imageT1, imageT2, setImageT1, setImageT2, addAgentTraceLog, setTargetFlyTo } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Clean up ObjectURLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imageT1 && imageT1.startsWith('blob:')) URL.revokeObjectURL(imageT1);
      if (imageT2 && imageT2.startsWith('blob:')) URL.revokeObjectURL(imageT2);
    };
  }, [imageT1, imageT2]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadSuccess(false);
    addAgentTraceLog(`[System] Received file upload: ${acceptedFiles[0].name}`);
    
    // Simulate API upload and georef validation
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      const fakeUrl = URL.createObjectURL(acceptedFiles[0]);
      if (activeTab === 'tab_1') {
        setImageT1(fakeUrl);
        setTargetFlyTo({ lng: 73.06, lat: 18.98, zoom: 13 });
        addAgentTraceLog(`[System] Image Georeferenced to Navi Mumbai (18.98° N, 73.06° E)`);
      } else if (activeTab === 'tab_2') {
        if (!imageT1) {
          setImageT1(fakeUrl);
          addAgentTraceLog(`[System] Ingested T1 Image (Optical)`);
        } else {
          setImageT2(fakeUrl);
          setTargetFlyTo({ lng: 72.81, lat: 18.95, zoom: 13 });
          addAgentTraceLog(`[System] Images Aligned & Georeferenced to Mumbai Coast (18.95° N, 72.81° E)`);
        }
      }
      
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 2000);
  }, [activeTab, imageT1, setImageT1, setImageT2, addAgentTraceLog, setTargetFlyTo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/tiff': ['.tiff', '.tif', '.geotiff'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  if (activeTab === 'tab_3' || (activeTab === 'tab_1' && imageT1) || (activeTab === 'tab_2' && imageT1 && imageT2)) {
    return null; // Don't show if we don't need uploads or if it's the live map tab
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm z-10 p-8">
      <div 
        {...getRootProps()} 
        className={`w-full max-w-2xl h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 transition-colors cursor-pointer ${
          isDragActive ? 'border-[var(--color-primary)] bg-blue-50/50' : 'border-gray-300 bg-white/80 hover:bg-gray-50/80'
        }`}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-4 text-[var(--color-primary)]"
            >
              <UploadCloud className="w-16 h-16 animate-pulse" />
              <p className="text-lg font-medium">Validating georeference metadata...</p>
            </motion.div>
          ) : uploadSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-4 text-green-500"
            >
              <CheckCircle2 className="w-16 h-16" />
              <p className="text-lg font-medium">Image aligned and ingested successfully!</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-4 text-[var(--color-muted)] text-center"
            >
              <ImageIcon className="w-16 h-16 text-gray-400 mb-2" />
              <p className="text-xl font-medium text-[var(--color-foreground)]">
                Drag & Drop TIFF/GeoTIFF files here
              </p>
              <p className="text-sm">
                {activeTab === 'tab_2' 
                  ? (!imageT1 ? 'Upload T1 (Optical) image first' : 'Now upload T2 (SAR) image')
                  : 'Or click to browse files'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
