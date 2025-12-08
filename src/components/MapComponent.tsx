"use client";

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  marker_type: string;
  label: string;
}

export default function MapComponent() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    fetchMarkers();
  }, []);

  const fetchMarkers = async () => {
    try {
      const res = await fetch('/api/markers');
      if (res.ok) {
        const data = await res.json();
        setMarkers(data);
      }
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const sumateraBounds: L.LatLngBoundsExpression = [
      [-6.5, 94.5],
      [6.0, 107.5]
    ];

    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles © Esri'
      }
    );

    const map = L.map(mapContainerRef.current, {
      center: [0.5, 102.0],
      zoom: 7,
      minZoom: 6,
      maxZoom: 11,
      maxBounds: sumateraBounds,
      maxBoundsViscosity: 1.0,
      layers: [satellite]
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || markers.length === 0) return;

    const getIcon = (type: string) => {
      const iconClass = {
        flood: 'text-blue-600 fa-solid fa-water',
        truck: 'text-green-600 fa-solid fa-truck',
        tent: 'text-orange-600 fa-solid fa-tent'
      }[type] || 'text-red-600 fa-solid fa-location-dot';

      return L.divIcon({
        className: iconClass + ' text-xl',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    };

    markers.forEach(marker => {
      L.marker([marker.latitude, marker.longitude], { 
        icon: getIcon(marker.marker_type) 
      })
        .addTo(mapRef.current!)
        .bindPopup(marker.label || 'No label');
    });
  }, [markers]);

  return (
    <div 
      ref={mapContainerRef} 
      className="h-[520px] sm:h-[650px] md:h-[768px] rounded-xl"
    />
  );
}
