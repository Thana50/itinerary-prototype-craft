
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Utensils, Activity } from "lucide-react";

interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

interface ItineraryPreviewProps {
  sampleItinerary: ItineraryDay[];
}

const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({ sampleItinerary }) => {
  if (sampleItinerary.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generated Itinerary Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            <p>Itinerary details will appear here as you build it with AI assistance...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Generated Sample Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleItinerary.map((day) => (
            <Card key={day.day} className="border-l-4 border-l-blue-500 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                    {day.day}
                  </div>
                  {day.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {day.activities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1">
                        {activity.toLowerCase().includes('halal') || activity.toLowerCase().includes('dinner') || activity.toLowerCase().includes('lunch') ? (
                          <Utensils className="h-4 w-4 text-green-600" />
                        ) : activity.toLowerCase().includes('temple') || activity.toLowerCase().includes('cultural') ? (
                          <MapPin className="h-4 w-4 text-purple-600" />
                        ) : activity.toLowerCase().includes('transfer') || activity.toLowerCase().includes('check-in') ? (
                          <Clock className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Activity className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <span className="text-sm text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryPreview;
