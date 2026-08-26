'use client';
import { useState, useEffect, useRef } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppStore } from '@/store/useAppStore';
import { GeoSVGOverlay } from './GeoSVGOverlay';

export function MapViewer() {
  const { mapGeoJSON, imageT1, mapStyle, targetFlyTo } = useAppStore();
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: 77.5771, // Ladakh approx
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
    }
  }, [targetFlyTo]);

  const getImageCoords = (lng: number, lat: number) => [
    [lng - 0.05, lat + 0.05],
    [lng + 0.05, lat + 0.05],
    [lng + 0.05, lat - 0.05],
    [lng - 0.05, lat - 0.05]
  ];

  if (imageT1) {
    return (
      <div className="w-full h-full relative bg-[#111] flex items-center justify-center p-4">
        <div className="relative max-w-full max-h-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
          <img 
            src={imageT1} 
            alt="Uploaded T1" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback for .tif files which don't render natively in Chrome
              e.currentTarget.src = 'https://images.unsplash.com/photo-1558231580-c11c1dfb1b22?q=80&w=1200';
            }}
          />
          {mapGeoJSON && mapGeoJSON.image_bounds && (
            <GeoSVGOverlay geoJSON={mapGeoJSON} bounds={mapGeoJSON.image_bounds} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />
        
        {mapGeoJSON && (
          <Source id="dynamic-geojson" type="geojson" data={mapGeoJSON}>
            {/* Polygons */}
            <Layer 
              id="dynamic-fill" 
              type="fill" 
              filter={['==', ['geometry-type'], 'Polygon']}
              paint={{ 'fill-color': ['get', 'color'], 'fill-opacity': 0.5 }} 
            />
            <Layer 
              id="dynamic-fill-outline" 
              type="line" 
              filter={['==', ['geometry-type'], 'Polygon']}
              paint={{ 'line-color': ['get', 'color'], 'line-width': 2 }} 
            />
            
            {/* Lines */}
            <Layer 
              id="dynamic-line" 
              type="line" 
              filter={['==', ['geometry-type'], 'LineString']}
              paint={{ 'line-color': ['get', 'color'], 'line-width': 4 }} 
            />
            
            {/* Points / MultiPoints */}
            <Layer 
              id="dynamic-circle" 
              type="circle" 
              filter={['in', ['geometry-type'], ['literal', ['Point', 'MultiPoint']]]}
              paint={{ 
                'circle-color': ['get', 'color'], 
                'circle-radius': 8, 
                'circle-stroke-width': 2, 
                'circle-stroke-color': '#FFFFFF' 
              }} 
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
