
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain } from "lucide-react";

const WeatherForecast = () => {
  const weatherData = [
    { day: "Mar 15", temp: "32°C", condition: "sunny", icon: Sun },
    { day: "Mar 16", temp: "31°C", condition: "partly cloudy", icon: Cloud },
    { day: "Mar 17", temp: "30°C", condition: "sunny", icon: Sun },
    { day: "Mar 18", temp: "29°C", condition: "light rain", icon: CloudRain },
    { day: "Mar 19", temp: "31°C", condition: "sunny", icon: Sun },
  ];

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Sun className="h-5 w-5 mr-2 text-yellow-600" />
          Weather Forecast - Phuket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {weatherData.map((day, index) => {
            const IconComponent = day.icon;
            return (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-600 mb-1">{day.day}</p>
                <IconComponent className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
                <p className="text-sm font-medium text-gray-800">{day.temp}</p>
                <p className="text-xs text-gray-500 capitalize">{day.condition}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Perfect weather for outdoor activities! Pack light, breathable clothing.
        </p>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
