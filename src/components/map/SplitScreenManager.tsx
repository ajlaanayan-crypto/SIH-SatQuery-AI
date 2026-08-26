'use client';
import { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppStore } from '@/store/useAppStore';
import { GeoSVGOverlay } from './GeoSVGOverlay';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export function SplitScreenManager() {
  const { imageT1, imageT2, changeMaskOverlay, mapGeoJSON, mapStyle, targetFlyTo } = useAppStore();
  const mapRef = useRef<any>(null);
  
  const [viewState, setViewState] = useState({
    longitude: 77.5771,
    latitude: 34.1526,
    zoom: 9
  });

  useEffect(() => {
    if (mapGeoJSON && mapGeoJSON.features && mapGeoJSON.features.length > 0) {
      let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
      
      mapGeoJSON.features.forEach((feature: any) => {
        const coords = feature.geometry.type === 'Polygon' ? feature.geometry.coordinates[0] 
                     : feature.geometry.type === 'MultiPoint' || feature.geometry.type === 'LineString' ? feature.geometry.coordinates 
                     : [];
        coords.forEach((coord: number[]) => {
          if (coord[0] < minLng) minLng = coord[0];
          if (coord[0] > maxLng) maxLng = coord[0];
          if (coord[1] < minLat) minLat = coord[1];
          if (coord[1] > maxLat) maxLat = coord[1];
        });
      });

      if (minLng !== 180) {
        const lng = (minLng + maxLng) / 2;
        const lat = (minLat + maxLat) / 2;
        
        if (mapRef.current) {
          mapRef.current.flyTo({ center: [lng, lat], zoom: 11, duration: 2500 });
        } else {
          setViewState(prev => ({ ...prev, longitude: lng, latitude: lat, zoom: 11 }));
        }
      }
    }
  }, [mapGeoJSON]);

  useEffect(() => {
    if (targetFlyTo && mapRef.current) {
      mapRef.current.flyTo({ center: [targetFlyTo.lng, targetFlyTo.lat], zoom: targetFlyTo.zoom, duration: 2000 });
      setViewState(prev => ({ ...prev, longitude: targetFlyTo.lng, latitude: targetFlyTo.lat, zoom: targetFlyTo.zoom }));
    }
  }, [targetFlyTo]);

  const getImageCoords = (lng: number, lat: number) => [
    [lng - 0.05, lat + 0.05],
    [lng + 0.05, lat + 0.05],
    [lng + 0.05, lat - 0.05],
    [lng - 0.05, lat - 0.05]
  ];

  const renderDynamicGeoJSON = () => {
    if (!mapGeoJSON || !changeMaskOverlay) return null;
    return (
      <Source id="dynamic-geojson-split" type="geojson" data={mapGeoJSON}>
        <Layer 
          id="split-fill" 
          type="fill" 
          filter={['==', ['geometry-type'], 'Polygon']}
          paint={{ 'fill-color': ['get', 'color'], 'fill-opacity': 0.6 }} 
        />
        <Layer 
          id="split-fill-outline" 
          type="line" 
          filter={['==', ['geometry-type'], 'Polygon']}
          paint={{ 'line-color': ['get', 'color'], 'line-width': 2 }} 
        />
        <Layer 
          id="split-line" 
          type="line" 
          filter={['==', ['geometry-type'], 'LineString']}
          paint={{ 'line-color': ['get', 'color'], 'line-width': 4 }} 
        />
        <Layer 
          id="split-circle" 
          type="circle" 
          filter={['in', ['geometry-type'], ['literal', ['Point', 'MultiPoint']]]}
          paint={{ 'circle-color': ['get', 'color'], 'circle-radius': 8, 'circle-stroke-width': 2, 'circle-stroke-color': '#FFFFFF' }} 
        />
      </Source>
    );
  };

  if (imageT1 || imageT2) {
    return (
      <div className="w-full h-full flex relative bg-[#111] p-4 gap-4">
        <div className="w-1/2 h-full relative rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-black/50">
          {imageT1 ? (
            <div className="relative max-w-full max-h-full">
              <img src={imageT1} alt="Uploaded T1" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1621616111105-0c7f7bc85160?q=80&w=1200'} />
              {changeMaskOverlay && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-red-500/30 border-2 border-red-500 rounded-full blur-md animate-pulse mix-blend-screen" />
                </div>
              )}
              {mapGeoJSON && mapGeoJSON.image_bounds && <GeoSVGOverlay geoJSON={mapGeoJSON} bounds={mapGeoJSON.image_bounds} />}
            </div>
          ) : (
            <p className="text-gray-500">Awaiting T1 Image...</p>
          )}
          <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono z-20">T1: Optical</div>
        </div>

        <div className="w-1/2 h-full relative rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-black/50">
          {imageT2 ? (
            <div className="relative max-w-full max-h-full">
              <img src={imageT2} alt="Uploaded T2" className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1621616111105-0c7f7bc85160?q=80&w=1200'} />
              {changeMaskOverlay && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-red-500/30 border-2 border-red-500 rounded-full blur-md animate-pulse mix-blend-screen" />
                </div>
              )}
              {mapGeoJSON && mapGeoJSON.image_bounds && <GeoSVGOverlay geoJSON={mapGeoJSON} bounds={mapGeoJSON.image_bounds} />}
            </div>
          ) : (
            <p className="text-gray-500">Awaiting T2 Image...</p>
          )}
          <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono z-20">T2: SAR/Optical</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex relative">
      <div className="w-1/2 h-full border-r border-gray-300 relative">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={mapStyle}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        >
          {renderDynamicGeoJSON()}
        </Map>
        
        {changeMaskOverlay && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <div className="w-1/3 h-1/3 bg-red-500/30 border-2 border-red-500 rounded-full blur-md animate-pulse mix-blend-multiply" />
          </div>
        )}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono z-20">T1: Optical</div>
      </div>
      <div className="w-1/2 h-full relative">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={mapStyle}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        >
          {renderDynamicGeoJSON()}
        </Map>

        {changeMaskOverlay && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            <div className="w-1/3 h-1/3 bg-red-500/30 border-2 border-red-500 rounded-full blur-md animate-pulse mix-blend-multiply" />
          </div>
        )}

        <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono z-20">T2: SAR/Optical</div>
      </div>
    </div>
  );
}
