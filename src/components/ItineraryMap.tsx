
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { MAPBOX_TOKEN } from "@/config/mapbox";

interface ActivityLocation {
  name: string;
  coordinates: [number, number];
  day: number;
  type?: string;
}

interface ItineraryMapProps {
  activities: ActivityLocation[];
  destination: string;
  centerCoordinates?: [number, number];
  className?: string;
}

const ItineraryMap: React.FC<ItineraryMapProps> = ({
  activities,
  destination,
  centerCoordinates,
  className = ""
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Default to center of activities if no center provided
  const getMapCenter = (): [number, number] => {
    if (centerCoordinates) return centerCoordinates;
    
    if (activities.length === 0) return [0, 0];
    
    const avgLng = activities.reduce((sum, activity) => sum + activity.coordinates[0], 0) / activities.length;
    const avgLat = activities.reduce((sum, activity) => sum + activity.coordinates[1], 0) / activities.length;
    
    return [avgLng, avgLat];
  };

  useEffect(() => {
    if (!mapContainer.current || activities.length === 0) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: getMapCenter(),
      zoom: activities.length === 1 ? 12 : 10,
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
      activities.forEach((activity) => {
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
            ${activity.day}
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="text-align: center; padding: 5px;">
            <strong>Day ${activity.day}</strong><br>
            ${activity.name}
            ${activity.type ? `<br><small>${activity.type}</small>` : ''}
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerEl)
          .setLngLat(activity.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });

      // Fit map to show all markers if multiple activities
      if (activities.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        activities.forEach(activity => bounds.extend(activity.coordinates));
        map.current!.fitBounds(bounds, { padding: 50 });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [activities]);

  if (activities.length === 0) {
    return (
      <Card className={`bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            {destination} Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Add activities with locations to see them on the map</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          {destination} Activity Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainer} 
          className="w-full h-64 rounded-lg shadow-sm"
          style={{ minHeight: '250px' }}
        />
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {activities.slice(0, 3).map((activity, index) => (
            <div key={index} className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white flex items-center justify-center text-xs mr-1">
                {activity.day}
              </div>
              <span className="text-gray-600 truncate">{activity.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryMap;
