
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { MAPBOX_TOKEN } from "@/config/mapbox";

const PhuketMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Activity locations in Phuket - using proper tuple typing
  const activityLocations = [
    { name: "Patong Beach", coordinates: [98.2969, 7.8971] as [number, number], day: 1 },
    { name: "Phi Phi Islands", coordinates: [98.7784, 7.7403] as [number, number], day: 2 },
    { name: "Big Buddha Temple", coordinates: [98.3122, 7.8426] as [number, number], day: 3 },
    { name: "Old Town Phuket", coordinates: [98.3875, 7.8804] as [number, number], day: 3 },
    { name: "Jungle Zip Line", coordinates: [98.3500, 7.9200] as [number, number], day: 4 },
    { name: "Elephant Sanctuary", coordinates: [98.3200, 7.9500] as [number, number], day: 4 }
  ];

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [98.3875, 7.8804] as [number, number], // Phuket center
      zoom: 10,
      pitch: 30,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add markers for each activity location
    map.current.on('load', () => {
      activityLocations.forEach((location) => {
        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'activity-marker';
        markerEl.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #3b82f6, #10b981);
            color: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            border: 2px solid white;
          ">
            ${location.day}
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="text-align: center; padding: 5px;">
            <strong>Day ${location.day}</strong><br>
            ${location.name}
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerEl)
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Phuket Activity Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainer} 
          className="w-full h-64 rounded-lg shadow-sm"
          style={{ minHeight: '250px' }}
        />
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white flex items-center justify-center text-xs mr-1">1</div>
            <span className="text-gray-600">Patong Beach</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white flex items-center justify-center text-xs mr-1">2</div>
            <span className="text-gray-600">Phi Phi Islands</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white flex items-center justify-center text-xs mr-1">3</div>
            <span className="text-gray-600">Cultural Sites</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhuketMap;
