
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ItineraryDay } from "@/types/itinerary";

interface ClientItineraryDisplayProps {
  itinerary: ItineraryDay[];
}

const ClientItineraryDisplay = ({ itinerary }: ClientItineraryDisplayProps) => {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
        <CardTitle className="text-xl">Your Travel Itinerary</CardTitle>
        <p className="text-blue-100">A perfect blend of culture, adventure, and relaxation</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {itinerary.map((day, index) => (
            <div key={day.day} className="relative">
              {/* Timeline connector */}
              {index < itinerary.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-blue-300 to-green-300"></div>
              )}
              
              <Card className="border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50 to-green-50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-4 shadow-lg">
                      {day.day}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800">{day.title}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {day.date ? day.date : `Day ${day.day} Activities`}
                        {day.location && ` • ${day.location}`}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3">
                    {day.activities.map((activity, activityIndex) => (
                      <li key={activityIndex} className="flex items-start bg-white rounded-lg p-3 shadow-sm">
                        <span className="text-lg mr-3">{activity.split(' ')[0]}</span>
                        <span className="text-gray-700 flex-1">{activity.substring(activity.indexOf(' ') + 1)}</span>
                      </li>
                    ))}
                  </ul>
                  {day.accommodation && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Accommodation:</span> {day.accommodation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Additional Days Note */}
        {itinerary.length < 7 && (
          <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4 text-center">
              <p className="text-gray-600">
                <span className="font-semibold">Days {itinerary.length + 1}-7:</span> Beach relaxation, shopping, cultural experiences, and departure arrangements
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Complete itinerary details available - chat with our AI to explore more activities!
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientItineraryDisplay;
