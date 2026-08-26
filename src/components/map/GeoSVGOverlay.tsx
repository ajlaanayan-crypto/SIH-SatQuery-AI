import React from 'react';

type GeoSVGOverlayProps = {
  geoJSON: any;
  bounds: [number, number, number, number]; // minLng, minLat, maxLng, maxLat
};

export function GeoSVGOverlay({ geoJSON, bounds }: GeoSVGOverlayProps) {
  if (!geoJSON || !geoJSON.features) return null;
  
  const [minLng, minLat, maxLng, maxLat] = bounds;
  const spanX = maxLng - minLng;
  const spanY = maxLat - minLat;

  const toPx = (lng: number, lat: number) => ({
    x: ((lng - minLng) / spanX) * 100,
    y: ((maxLat - lat) / spanY) * 100
  });

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      {geoJSON.features.map((feature: any, idx: number) => {
        const type = feature.geometry.type;
        const color = feature.properties.color || '#FF0000';

        if (type === 'Polygon') {
          const points = feature.geometry.coordinates[0].map((c: number[]) => {
            const pt = toPx(c[0], c[1]);
            return `${pt.x}%,${pt.y}%`;
          }).join(' ');

          return (
            <polygon 
              key={idx} 
              points={points} 
              fill={color} 
              fillOpacity={0.4} 
              stroke={color} 
              strokeWidth={3} 
              className="animate-pulse"
            />
          );
        }

        if (type === 'LineString') {
          const points = feature.geometry.coordinates.map((c: number[]) => {
            const pt = toPx(c[0], c[1]);
            return `${pt.x}%,${pt.y}%`;
          }).join(' ');

          return (
            <polyline 
              key={idx} 
              points={points} 
              fill="none" 
              stroke={color} 
              strokeWidth={5} 
            />
          );
        }

        if (type === 'MultiPoint' || type === 'Point') {
          const coords = type === 'Point' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
          return coords.map((c: number[], cIdx: number) => {
            const pt = toPx(c[0], c[1]);
            return (
              <circle 
                key={`${idx}-${cIdx}`} 
                cx={`${pt.x}%`} 
                cy={`${pt.y}%`} 
                r={6} 
                fill={color} 
                stroke="#FFF" 
                strokeWidth={2} 
              />
            );
          });
        }

        return null;
      })}
    </svg>
  );
}
